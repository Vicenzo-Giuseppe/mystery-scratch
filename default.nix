{
  bun2nix,
  stdenv,
  lib,
  pkgs,
  ...
}:
let
  # Create a simple static file server using Python (always available in Nix)
  serve-static = pkgs.writeShellScriptBin "serve-static" ''
    set -e

    # The directory to serve is passed as first argument
    STATIC_DIR="$1"
    PORT=''${PORT:-3000}

    cd "$STATIC_DIR"

    # Use Python's built-in HTTP server (available in all Nix closures)
    exec ${pkgs.python3}/bin/python3 -m http.server "$PORT"
  '';
in
bun2nix.mkDerivation {
  pname = "nextjs-app";
  version = "0.1.0";

  packageJson = ./package.json;
  src = ./.;

  bunDeps = bun2nix.fetchBunDeps {
    bunNix = ./bun.nix;
  };

  # Don't use default bun build/install phases - we do custom install
  dontUseBunBuild = true;
  dontUseBunInstall = true;

  buildPhase = ''
    runHook preBuild

    # Build Next.js static export
    bun run build

    runHook postBuild
  '';

  installPhase = ''
    runHook preInstall

    # Create output directories
    mkdir -p $out/share/$pname
    mkdir -p $out/bin

    # Copy the built static site from dist directory
    # Next.js export puts everything here including copied public assets
    if [ -d "dist" ]; then
      cp -r dist/* $out/share/$pname/
      echo "Copied built site from dist/"
    else
      echo "Warning: dist directory not found, copying from public/"
      cp -r public/* $out/share/$pname/
    fi

    # Debug: List what's in the models directory
    if [ -d "$out/share/$pname/models" ]; then
      echo "Models in output:"
      ls -la $out/share/$pname/models/
    else
      echo "Warning: models directory not found in output"
    fi

    # Create wrapper script to serve the static site
    makeWrapper ${lib.getExe serve-static} $out/bin/$pname \
      --add-flags "$out/share/$pname"

    runHook postInstall
  '';

  nativeBuildInputs = [
    pkgs.makeWrapper
  ];
}
