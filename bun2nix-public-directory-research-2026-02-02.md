# Research: bun2nix writeBunApplication - Public Directory Static Assets

**Date:** 2026-02-02  
**Research Type:** Technical Implementation Guide  
**Objective:** Understand how to properly pass public directory items to running applications using bun2nix writeBunApplication  
**Status:** Complete

---

## Executive Summary

Based on analysis of the bun2nix source code and Nix derivation patterns, `writeBunApplication` extends `mkDerivation` and provides specific mechanisms for handling static assets. The key insight is that `writeBunApplication` uses a **wrapper-based approach** where the application is installed to `$out/share/$pname` and executed via `makeWrapper` with `--chdir` to ensure runtime file access.

---

## 1. Understanding bun2nix Architecture

### 1.1 Function Hierarchy

```
writeBunApplication
    └── extends: mkDerivation.function (bun2nix.mkDerivation)
            └── extends: pkgs.stdenv.mkDerivation
```

### 1.2 Key Source Files Analyzed

| File | Purpose |
|------|---------|
| `nix/write-bun-application.nix` | Main writeBunApplication implementation |
| `nix/mk-derivation.nix` | mkDerivation extension for bun2nix |
| `nix/mk-derivation/hook.sh` | Build hooks for bun install/build phases |
| `nix/mk-derivation/hook.nix` | Setup hook definition |

---

## 2. How writeBunApplication Works

### 2.1 Core Implementation

From `nix/write-bun-application.nix`:

```nix
writeBunApplication = lib.extendMkDerivation {
  constructDrv = config.mkDerivation.function;

  excludeDrvArgNames = [
    "startScript"
    "runtimeInputs"
    "runtimeEnv"
    "excludeShellChecks"
    "extraShellCheckFlags"
    "bashOptions"
    "inheritPath"
  ];

  extendDrvArgs = _finalAttrs:
    { startScript
    , runtimeInputs ? [ ]
    , runtimeEnv ? { }
    , ...
    }@args:
    let
      script = pkgs.writeShellApplication {
        inherit runtimeEnv ...;
        name = "bun2nix-application-startup";
        text = startScript;
        runtimeInputs = [ pkgs.bun ] ++ runtimeInputs;
      };
    in
    {
      nativeBuildInputs = [ pkgs.makeWrapper ] ++ nativeBuildInputs;

      installPhase = args.installPhase or ''
        runHook preInstall

        mkdir -p \
          "$out/share/$pname" \
          "$out/bin"

        cp -r ./. "$out/share/$pname"

        makeWrapper ${lib.getExe script} $out/bin/$pname \
          --chdir "$out/share/$pname"

        runHook postInstall
      '';
    };
};
```

### 2.2 Key Observations

1. **Working Directory**: The wrapper uses `--chdir "$out/share/$pname"` which means the application runs from the installed directory
2. **Full Copy**: `cp -r ./. "$out/share/$pname"` copies ALL files from the build directory to the output
3. **Wrapper Script**: The actual executable is a wrapper that changes to the application directory before running

---

## 3. How mkDerivation (bun2nix) Handles Builds

### 3.1 Build Phase Flow

From `nix/mk-derivation/hook.sh`:

```bash
# Phases are appended in order:
appendToVar preConfigurePhases bunSetInstallCacheDirPhase
appendToVar preBuildPhases bunNodeModulesInstallPhase

if [ -z "${dontRunLifecycleScripts-}" ]; then
  appendToVar preBuildPhases bunLifecycleScriptsPhase
fi

# Default phases (can be overridden):
# - patchPhase = bunPatchPhase
# - buildPhase = bunBuildPhase  
# - checkPhase = bunCheckPhase
# - installPhase = bunInstallPhase
```

### 3.2 Default bunBuildPhase

```bash
function bunBuildPhase {
  pushd "$bunRoot" || exit 1
  runHook preBuild

  local flagsArray=()
  concatTo flagsArray \
    bunBuildFlags bunBuildFlagsArray

  echoCmd 'bun build flags' "${flagsArray[@]}"
  bun build "${flagsArray[@]}"

  runHook postBuild
  popd || exit 1
}
```

### 3.3 Default bunInstallPhase

```bash
function bunInstallPhase {
  pushd "$bunRoot" || exit 1
  runHook preInstall

  install -Dm755 "$pname" "$out/bin/$pname"

  runHook postInstall
  popd || exit 1
}
```

**Important**: The default `bunInstallPhase` only installs the compiled binary, not static assets!

---

## 4. Solutions for Public Directory Access

### 4.1 Solution 1: Custom installPhase (Recommended for writeBunApplication)

Since `writeBunApplication` already overrides `installPhase` to copy everything to `$out/share/$pname`, the public directory will be available at runtime:

```nix
{ bun2nix, ... }:

bun2nix.writeBunApplication {
  pname = "my-nextjs-app";
  version = "1.0.0";
  
  src = ./.;
  
  bunDeps = bun2nix.fetchBunDeps {
    bunNix = ./bun.nix;
  };
  
  # The start script - runs from $out/share/$pname
  startScript = ''
    bun run start
  '';
  
  # The default installPhase in writeBunApplication already does:
  # cp -r ./. "$out/share/$pname"
  # This includes your public/ directory!
  
  # If you need additional files copied:
  postInstall = ''
    # Additional assets if needed
    cp -r ${./additional-assets} $out/share/$pname/static-assets
  '';
}
```

### 4.2 Solution 2: Using postInstall with mkDerivation

For more control using `bun2nix.mkDerivation` directly:

```nix
{ bun2nix, ... }:

bun2nix.mkDerivation {
  pname = "my-nextjs-app";
  version = "1.0.0";
  
  src = ./.;
  
  packageJson = ./package.json;
  
  bunDeps = bun2nix.fetchBunDeps {
    bunNix = ./bun.nix;
  };
  
  # Override the default installPhase
  installPhase = ''
    runHook preInstall
    
    mkdir -p $out/bin
    mkdir -p $out/share/$pname
    
    # Copy the built application
    cp -r dist/* $out/share/$pname/
    
    # Copy public assets
    cp -r public/* $out/share/$pname/
    
    # Create wrapper script
    makeWrapper ${pkgs.bun}/bin/bun $out/bin/$pname \
      --add-flags "run $out/share/$pname/server.js" \
      --chdir "$out/share/$pname"
    
    runHook postInstall
  '';
  
  nativeBuildInputs = [ pkgs.makeWrapper ];
}
```

### 4.3 Solution 3: Using symlinkJoin for Assets

If you want to keep assets separate and combine them:

```nix
{ bun2nix, pkgs, ... }:

let
  app = bun2nix.writeBunApplication {
    pname = "my-nextjs-app";
    version = "1.0.0";
    src = ./.;
    bunDeps = bun2nix.fetchBunDeps {
      bunNix = ./bun.nix;
    };
    startScript = ''
      bun run start
    '';
  };
  
  assets = pkgs.stdenv.mkDerivation {
    name = "my-app-assets";
    src = ./public;
    installPhase = ''
      mkdir -p $out/public
      cp -r $src/* $out/public/
    '';
  };
in
  pkgs.symlinkJoin {
    name = "my-nextjs-app-with-assets";
    paths = [ app assets ];
    buildInputs = [ pkgs.makeWrapper ];
    postBuild = ''
      # Ensure the wrapper points to the combined directory
      wrapProgram $out/bin/my-nextjs-app \
        --chdir "$out/share/my-nextjs-app"
    '';
  }
```

### 4.4 Solution 4: Environment Variables for Asset Paths

For applications that need to know where assets are located:

```nix
{ bun2nix, ... }:

bun2nix.writeBunApplication {
  pname = "my-nextjs-app";
  version = "1.0.0";
  src = ./.;
  
  bunDeps = bun2nix.fetchBunDeps {
    bunNix = ./bun.nix;
  };
  
  # Pass runtime environment variables
  runtimeEnv = {
    PUBLIC_ASSETS_PATH = "./public";
    MODELS_PATH = "./public/models";
  };
  
  startScript = ''
    # Assets are relative to the chdir location ($out/share/$pname)
    bun run start
  '';
}
```

---

## 5. Best Practices for Static Assets with bun2nix

### 5.1 Directory Structure

```
my-app/
├── package.json
├── bun.lock
├── bun.nix          # Generated by bun2nix
├── src/
│   └── index.ts
├── public/          # Static assets
│   ├── models/
│   │   └── model.glb
│   ├── images/
│   └── favicon.ico
└── flake.nix
```

### 5.2 Recommended Approach for Next.js

```nix
{
  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
    bun2nix.url = "github:nix-community/bun2nix";
  };

  outputs = { self, nixpkgs, bun2nix }:
    let
      system = "x86_64-linux";
      pkgs = nixpkgs.legacyPackages.${system};
      bun2nix' = bun2nix.packages.${system};
    in {
      packages.${system}.default = bun2nix'.writeBunApplication {
        pname = "my-nextjs-app";
        version = "1.0.0";
        
        src = ./.;
        
        bunDeps = bun2nix'.fetchBunDeps {
          bunNix = ./bun.nix;
        };
        
        # Build the Next.js app
        buildPhase = ''
          runHook preBuild
          bun run build
          runHook postBuild
        '';
        
        # Start script - runs from $out/share/$pname
        # where all files (including public/) are copied
        startScript = ''
          bun run start
        '';
        
        # The default installPhase copies everything:
        # cp -r ./. "$out/share/$pname"
        # This includes public/, .next/, node_modules/, etc.
      };
    };
}
```

### 5.3 Key Configuration Options

| Option | Purpose |
|--------|---------|
| `runtimeEnv` | Environment variables available at runtime |
| `runtimeInputs` | Additional packages available in the wrapper |
| `startScript` | The shell script that launches the application |
| `postInstall` | Additional installation steps |

---

## 6. Runtime File Access Patterns

### 6.1 File Access in Nix Derivations

In Nix, derivations are immutable. Files are stored in:
- `/nix/store/...-pname/` - The derivation output
- `$out/share/$pname/` - Where writeBunApplication installs the app

### 6.2 How Applications Access Files

Since `writeBunApplication` uses `--chdir "$out/share/$pname"`:

```javascript
// In your Bun/Next.js application:

// This works - relative to the chdir location
const file = Bun.file("./public/models/model.glb");

// This also works - using process.cwd()
const publicDir = path.join(process.cwd(), "public");

// For Next.js specifically:
// Files in public/ are served automatically
// when running from the correct directory
```

### 6.3 Environment Variable Approach

```nix
{
  runtimeEnv = {
    NODE_ENV = "production";
    PUBLIC_DIR = "./public";
  };
}
```

```javascript
// In your application:
const publicDir = process.env.PUBLIC_DIR || "./public";
const file = Bun.file(path.join(publicDir, "models/model.glb"));
```

---

## 7. Comparison with Other Approaches

### 7.1 buildNpmPackage (nixpkgs)

```nix
# With buildNpmPackage, you'd use:
pkgs.buildNpmPackage {
  # ...
  installPhase = ''
    mkdir -p $out/share/$pname
    cp -r public $out/share/$pname/
    cp -r dist $out/share/$pname/
    makeWrapper ...
  '';
}
```

### 7.2 Docker Approach

```dockerfile
# Similar concept - copy everything needed
COPY public /app/public
COPY dist /app/dist
WORKDIR /app
CMD ["bun", "run", "start"]
```

---

## 8. Troubleshooting Common Issues

### 8.1 Files Not Found at Runtime

**Problem**: Application can't find public files  
**Solution**: Ensure you're using relative paths from the working directory

```javascript
// ❌ Wrong - absolute path
const file = Bun.file("/public/model.glb");

// ✅ Correct - relative to working directory
const file = Bun.file("./public/model.glb");
```

### 8.2 Build vs Runtime Paths

**Problem**: Files exist at build time but not runtime  
**Solution**: Ensure files are copied in installPhase

```nix
{
  # Files must be in src or generated during build
  src = ./.;
  
  # Or copy explicitly
  postInstall = ''
    cp -r ${./public} $out/share/$pname/public
  '';
}
```

### 8.3 Large Assets

**Problem**: Large model files increase closure size  
**Solution**: Consider using `pkgs.runCommand` or fetchurl for large assets

```nix
{
  runtimeEnv = {
    MODELS_PATH = pkgs.fetchzip {
      url = "https://example.com/models.zip";
      sha256 = "...";
    };
  };
}
```

---

## 9. Summary and Recommendations

### For Next.js with public directory:

1. **Use `writeBunApplication`** - It handles the directory structure correctly
2. **Don't override `installPhase`** unless necessary - The default copies everything
3. **Use relative paths** in your application code
4. **Set `runtimeEnv`** if your app needs environment variables for paths
5. **Use `postInstall`** for any additional file copying needs

### Minimal Working Example:

```nix
bun2nix.writeBunApplication {
  pname = "my-app";
  version = "1.0.0";
  src = ./.;
  
  bunDeps = bun2nix.fetchBunDeps {
    bunNix = ./bun.nix;
  };
  
  # Build Next.js
  buildPhase = ''
    runHook preBuild
    bun run build
    runHook postBuild
  '';
  
  # Start the app
  startScript = ''
    bun run start
  '';
  
  # Assets in public/ are automatically available
  # because installPhase copies ./. to $out/share/$pname
}
```

---

## 10. References

- [bun2nix GitHub Repository](https://github.com/nix-community/bun2nix)
- [bun2nix Documentation](https://nix-community.github.io/bun2nix/)
- [Nixpkgs stdenv.mkDerivation](https://nixos.org/manual/nixpkgs/stable/#sec-using-stdenv)
- [makeWrapper documentation](https://github.com/NixOS/nixpkgs/blob/master/pkgs/build-support/setup-hooks/make-wrapper.sh)
- [Working with local files in Nix](https://nix.dev/tutorials/working-with-local-files.html)

---

**Research completed:** 2026-02-02  
**Conclusion:** `writeBunApplication` handles public directories correctly by copying all files to `$out/share/$pname` and using `--chdir` in the wrapper. No special configuration is needed for most use cases - just ensure your application uses relative paths to access static assets.
