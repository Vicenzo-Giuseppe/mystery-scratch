# Importing Realistic 3D Sneaker Models from Blender to React Three Fiber / Next.js

**Research Date:** 2025-02-02  
**Research Type:** Technical Implementation Guide  
**Objective:** Replace image-based sneaker displays with interactive 3D models  
**Status:** Complete

---

## Executive Summary

This research provides a comprehensive guide for importing realistic 3D sneaker models from Blender into React Three Fiber (R3F) applications running on Next.js. The workflow covers the complete pipeline: Blender export optimization, R3F integration, performance optimization, realistic rendering techniques, and production-ready code examples.

---

## 1. Blender Export Process

### 1.1 Best Format for Web

| Format | Description | Pros | Cons | Recommendation |
|--------|-------------|------|------|----------------|
| **GLB** | Binary GLTF | Single file, smallest size, fastest loading | Less human-readable | **✅ RECOMMENDED** |
| **GLTF** | JSON-based GLTF | Human-readable, separate textures | Base64 encoding increases size by ~33% | Use only for debugging |
| **GLTF Separate** | JSON + external files | Good for editing | Multiple files to manage | Use for development |

**Recommendation:** Always use **GLB (glTF Binary)** for production web applications. It packages all resources into a single binary file, eliminating the ~33% size increase from Base64 encoding in embedded GLTF.

### 1.2 Export Settings from Blender

**Step-by-Step Export Process:**

1. **Prepare your model:**
   - Apply all transformations (Ctrl+A → All Transforms)
   - Ensure proper UV unwrapping for textures
   - Use Principled BSDF materials for best compatibility

2. **Export Settings (File > Export > glTF 2.0):**

```
Format: glTF Binary (.glb)

Include:
  ☑ Limit to: Visible Objects
  ☑ Renderable Objects
  ☑ Active Collection (if organizing by collection)
  ☐ Custom Properties (unless needed)

Transform:
  +Y Up (standard for glTF)

Geometry:
  ☑ Apply Modifiers
  ☐ Normals (uncheck for smaller file size if not needed)
  ☑ Tangents
  ☑ Materials
  ☑ Images
  ☑ Compression (DRACO) - Check this!
  
  Draco Compression Settings:
    Compression Level: 6 (balance of speed/size)
    Position Quantization: 14
    Normal Quantization: 10
    Texcoord Quantization: 12
    Color Quantization: 10
    Generic Quantization: 12
```

**File Size Optimization Results:**
- Unchecking "Normals" + Draco Compression: Up to 70-90% size reduction
- Typical sneaker model: 5MB → 500KB-1MB

### 1.3 Handling Textures, Materials, and Lighting

**Texture Best Practices:**

```
Recommended Texture Sizes for Web:
- 4K (4096x4096): High-end desktop only
- 2K (2048x2048): Standard desktop
- 1K (1024x1024): Mobile/tablet
- 512x512: Low-end devices

Format: PNG for transparency, JPEG for opaque textures
```

**Material Setup in Blender:**
- Use **Principled BSDF** node for all materials
- Leather: High roughness (0.6-0.9), low metallic (0.0-0.1)
- Rubber: Medium roughness (0.4-0.7), metallic 0.0
- Mesh/Fabric: High roughness (0.7-1.0), use normal maps for weave pattern
- Metal accents: High metallic (0.8-1.0), low roughness (0.1-0.3)

**Export Material Settings:**
- ☑ Export materials
- Images: Automatic or PNG format
- Image quality: 90% for JPEG

### 1.4 File Size Optimization Techniques

**1. Draco Compression (Geometry):**
- Reduces mesh size by 70-90%
- Requires decoder in browser (handled by R3F)

**2. Texture Compression:**

**Option A: KTX2 + Basis Universal (Recommended for advanced)**
```bash
# Using gltf-transform CLI
npm install -g @gltf-transform/cli

# Convert textures to KTX2 with Basis Universal
gltf-transform etc1s input.glb output.glb --quality 128
gltf-transform uastc input.glb output.glb --level 2
```

- **ETC1S**: Best for color textures (baseColor), 8:1 compression
- **UASTC**: Best for detail textures (normal, roughness, metallic)

**Option B: WebP Textures**
```bash
gltf-transform webp input.glb output.glb
```

**3. Mesh Optimization:**
- Target polygon count: 5K-50K triangles for web
- Use Decimate modifier in Blender for high-poly models
- Remove interior faces not visible to camera

**4. Post-Export Optimization with gltf-transform:**
```bash
# Complete optimization pipeline
gltf-transform optimize input.glb output.glb \
  --compress draco \
  --texture-compress webp \
  --texture-size 2048 \
  --flatten false
```

---

## 2. React Three Fiber Integration

### 2.1 Loading 3D Models with useGLTF

**Basic Setup:**

```tsx
// components/SneakerModel.tsx
import { useGLTF } from '@react-three/drei'
import { useRef } from 'react'
import * as THREE from 'three'

interface SneakerModelProps {
  url: string
  position?: [number, number, number]
  rotation?: [number, number, number]
  scale?: number
}

export function SneakerModel({ url, position = [0, 0, 0], rotation = [0, 0, 0], scale = 1 }: SneakerModelProps) {
  const groupRef = useRef<THREE.Group>(null)
  
  // Load the GLTF model
  const { scene, nodes, materials } = useGLTF(url)
  
  // Clone the scene to allow multiple instances
  const clonedScene = scene.clone()
  
  return (
    <group 
      ref={groupRef}
      position={position}
      rotation={rotation}
      scale={scale}
    >
      <primitive object={clonedScene} />
    </group>
  )
}

// Preload for better performance
useGLTF.preload('/models/sneaker.glb')
```

**With Draco Compression:**

```tsx
import { useGLTF } from '@react-three/drei'

export function SneakerModel({ url }: { url: string }) {
  // useGLTF automatically loads Draco decoder from CDN
  const { scene } = useGLTF(url)
  
  return <primitive object={scene} />
}

// Optional: Use custom Draco decoder path
const { scene } = useGLTF(url, '/draco-gltf/')

// Preload Draco files for faster decoding (add to HTML head)
// <link rel="prefetch" href="https://www.gstatic.com/draco/versioned/decoders/1.5.5/draco_wasm_wrapper.js" />
// <link rel="prefetch" href="https://www.gstatic.com/draco/versioned/decoders/1.5.5/draco_decoder.wasm" />
```

### 2.2 Handling Model Loading States and Errors

**Loading Progress with Suspense:**

```tsx
// components/ModelLoader.tsx
import { Html, useProgress } from '@react-three/drei'

function Loader() {
  const { active, progress, errors, item, loaded, total } = useProgress()
  
  return (
    <Html center>
      <div className="loader">
        <div className="spinner" />
        <p>{Math.round(progress)}% loaded</p>
        {errors.length > 0 && <p className="error">Error loading: {item}</p>}
      </div>
    </Html>
  )
}

// Usage in App
import { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'

export default function App() {
  return (
    <Canvas>
      <Suspense fallback={<Loader />}>
        <SneakerModel url="/models/sneaker.glb" />
      </Suspense>
    </Canvas>
  )
}
```

**Error Boundary Implementation:**

```tsx
// components/ErrorBoundary.tsx
import { Component, ErrorInfo, ReactNode } from 'react'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error?: Error
}

export class ModelErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('3D Model Error:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="error-fallback">
          <h3>Failed to load 3D model</h3>
          <p>{this.state.error?.message}</p>
          <button onClick={() => this.setState({ hasError: false })}>
            Retry
          </button>
        </div>
      )
    }

    return this.props.children
  }
}

// Usage
<ModelErrorBoundary fallback={<ImageFallback src="/sneaker-fallback.jpg" />}>
  <Suspense fallback={<Loader />}>
    <SneakerModel url="/models/sneaker.glb" />
  </Suspense>
</ModelErrorBoundary>
```

**Alternative: useLoader with Error Handling:**

```tsx
import { useLoader } from '@react-three/fiber'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'

function ModelWithErrorHandling({ url }: { url: string }) {
  let gltf = null
  let error = null
  
  try {
    gltf = useLoader(GLTFLoader, url, (loader) => {
      // Optional: Configure loader (e.g., set DRACOLoader)
    })
  } catch (e) {
    error = e
    console.error('Failed to load model:', e)
  }
  
  if (error) {
    return <FallbackMesh />
  }
  
  if (!gltf) {
    return null
  }
  
  return <primitive object={gltf.scene} />
}
```

### 2.3 Positioning and Scaling Models Properly

**Auto-Centering and Scaling:**

```tsx
import { useGLTF, Bounds, useBounds } from '@react-three/drei'
import { useEffect } from 'react'

function AutoScaledModel({ url }: { url: string }) {
  const { scene } = useGLTF(url)
  const bounds = useBounds()
  
  useEffect(() => {
    // Auto-fit model to view
    bounds.refresh().clip().fit()
  }, [bounds])
  
  return <primitive object={scene} />
}

// Usage with Bounds wrapper
<Bounds fit clip observe margin={1.2}>
  <AutoScaledModel url="/models/sneaker.glb" />
</Bounds>
```

**Manual Centering and Scaling:**

```tsx
import { useGLTF } from '@react-three/drei'
import { useMemo } from 'react'
import * as THREE from 'three'

function CenteredModel({ url, targetSize = 2 }: { url: string; targetSize?: number }) {
  const { scene } = useGLTF(url)
  
  const centeredScene = useMemo(() => {
    const cloned = scene.clone()
    
    // Calculate bounding box
    const box = new THREE.Box3().setFromObject(cloned)
    const center = box.getCenter(new THREE.Vector3())
    const size = box.getSize(new THREE.Vector3())
    
    // Center the model
    cloned.position.sub(center)
    
    // Scale to target size
    const maxDim = Math.max(size.x, size.y, size.z)
    const scale = targetSize / maxDim
    cloned.scale.setScalar(scale)
    
    // Lift up so bottom is at y=0
    cloned.position.y += (size.y * scale) / 2
    
    return cloned
  }, [scene, targetSize])
  
  return <primitive object={centeredScene} />
}
```

### 2.4 Adding Interactivity (Rotation, Hover Effects)

**Auto-Rotation with Hover Pause:**

```tsx
import { useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'

function InteractiveSneaker({ url }: { url: string }) {
  const groupRef = useRef<THREE.Group>(null)
  const [hovered, setHovered] = useState(false)
  const [autoRotate, setAutoRotate] = useState(true)
  
  const { scene } = useGLTF(url)
  
  useFrame((state, delta) => {
    if (!groupRef.current) return
    
    // Auto-rotation when not hovered
    if (autoRotate && !hovered) {
      groupRef.current.rotation.y += delta * 0.5
    }
    
    // Smooth hover scale effect
    const targetScale = hovered ? 1.1 : 1
    groupRef.current.scale.lerp(
      new THREE.Vector3(targetScale, targetScale, targetScale),
      delta * 5
    )
  })
  
  return (
    <group
      ref={groupRef}
      onPointerOver={(e) => {
        e.stopPropagation()
        setHovered(true)
        document.body.style.cursor = 'pointer'
      }}
      onPointerOut={(e) => {
        e.stopPropagation()
        setHovered(false)
        document.body.style.cursor = 'auto'
      }}
      onClick={() => setAutoRotate(!autoRotate)}
    >
      <primitive object={scene} />
    </group>
  )
}
```

**Click-to-Rotate with Animation:**

```tsx
import { useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { useGLTF, useSpring, animated } from '@react-three/drei'
import * as THREE from 'three'

function ClickableSneaker({ url }: { url: string }) {
  const groupRef = useRef<THREE.Group>(null)
  const [rotationY, setRotationY] = useState(0)
  const { scene } = useGLTF(url)
  
  // Smooth spring animation for rotation
  const { spring } = useSpring({
    spring: rotationY,
    config: { mass: 1, tension: 120, friction: 14 }
  })
  
  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.rotation.y = spring.get()
    }
  })
  
  const handleClick = () => {
    setRotationY((prev) => prev + Math.PI / 2) // Rotate 90 degrees
  }
  
  return (
    <animated.group
      ref={groupRef}
      onClick={handleClick}
      onPointerOver={() => document.body.style.cursor = 'pointer'}
      onPointerOut={() => document.body.style.cursor = 'auto'}
    >
      <primitive object={scene} />
    </animated.group>
  )
}
```

**Drag to Rotate (OrbitControls alternative for single object):**

```tsx
import { useRef, useState } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'

function DraggableSneaker({ url }: { url: string }) {
  const groupRef = useRef<THREE.Group>(null)
  const { scene } = useGLTF(url)
  const { gl } = useThree()
  
  const [isDragging, setIsDragging] = useState(false)
  const [previousMousePosition, setPreviousMousePosition] = useState({ x: 0, y: 0 })
  const rotationRef = useRef({ x: 0, y: 0 })
  
  const handlePointerDown = (e: THREE.Event<PointerEvent>) => {
    setIsDragging(true)
    setPreviousMousePosition({ x: e.clientX, y: e.clientY })
    gl.domElement.setPointerCapture(e.pointerId)
  }
  
  const handlePointerMove = (e: THREE.Event<PointerEvent>) => {
    if (!isDragging) return
    
    const deltaX = e.clientX - previousMousePosition.x
    const deltaY = e.clientY - previousMousePosition.y
    
    rotationRef.current.y += deltaX * 0.01
    rotationRef.current.x += deltaY * 0.01
    
    setPreviousMousePosition({ x: e.clientX, y: e.clientY })
  }
  
  const handlePointerUp = (e: THREE.Event<PointerEvent>) => {
    setIsDragging(false)
    gl.domElement.releasePointerCapture(e.pointerId)
  }
  
  useFrame(() => {
    if (groupRef.current) {
      // Smooth interpolation
      groupRef.current.rotation.y += (rotationRef.current.y - groupRef.current.rotation.y) * 0.1
      groupRef.current.rotation.x += (rotationRef.current.x - groupRef.current.rotation.x) * 0.1
    }
  })
  
  return (
    <group
      ref={groupRef}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
    >
      <primitive object={scene} />
    </group>
  )
}
```

---

## 3. Performance Optimization

### 3.1 Model Polygon Count Recommendations

| Device Type | Triangle Count | Use Case |
|-------------|----------------|----------|
| Mobile/Low-end | 5K - 15K | Quick previews, AR |
| Tablet/Mid-range | 15K - 50K | Standard web viewing |
| Desktop/High-end | 50K - 100K | Detailed product showcase |
| VR/High-fidelity | 100K+ | Premium experiences |

**Sneaker-Specific Guidelines:**
- **Sole detail:** 5K-10K triangles (treads pattern)
- **Upper body:** 10K-20K triangles (including laces)
- **Interior:** 2K-5K triangles (if visible)
- **Total target:** 20K-50K for optimal web performance

### 3.2 Texture Compression and Optimization

**Recommended Texture Pipeline:**

```
Source (4K PNG) 
  → Resize to target (1K-2K)
  → Compress (WebP/KTX2)
  → Generate mipmaps
  → Include in GLB or separate
```

**Texture Size Guidelines:**

| Texture Type | Mobile | Desktop | Format |
|--------------|--------|---------|--------|
| Base Color | 1K | 2K | WebP/PNG |
| Normal Map | 1K | 2K | WebP/PNG |
| Roughness | 512 | 1K | Grayscale WebP |
| Metallic | 512 | 1K | Grayscale WebP |
| AO | 512 | 1K | Grayscale WebP |

**KTX2 Implementation:**

```tsx
import { useGLTF, Ktx2Loader } from '@react-three/drei'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { KTX2Loader as KTX2LoaderThree } from 'three/examples/jsm/loaders/KTX2Loader'

// Extend useGLTF with KTX2 support
useGLTF.setDecoderPath('/draco/')

function ModelWithKTX2({ url }: { url: string }) {
  const { scene } = useGLTF(url, true, true, (loader: GLTFLoader) => {
    const ktx2Loader = new KTX2LoaderThree()
    ktx2Loader.setTranscoderPath('/basis/')
    loader.setKTX2Loader(ktx2Loader)
  })
  
  return <primitive object={scene} />
}
```

### 3.3 Lazy Loading Strategies

**Component-Level Lazy Loading:**

```tsx
import { lazy, Suspense } from 'react'

// Lazy load the 3D viewer component
const SneakerViewer = lazy(() => import('./SneakerViewer'))

function ProductPage() {
  return (
    <div className="product-page">
      <Suspense fallback={<ProductImage src="/sneaker.jpg" />}>
        <SneakerViewer modelUrl="/models/sneaker.glb" />
      </Suspense>
    </div>
  )
}
```

**Intersection Observer for Below-Fold Loading:**

```tsx
import { useEffect, useRef, useState } from 'react'

function LazySneakerViewer({ modelUrl }: { modelUrl: string }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [shouldLoad, setShouldLoad] = useState(false)
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldLoad(true)
          observer.disconnect()
        }
      },
      { rootMargin: '100px' } // Start loading 100px before visible
    )
    
    if (containerRef.current) {
      observer.observe(containerRef.current)
    }
    
    return () => observer.disconnect()
  }, [])
  
  return (
    <div ref={containerRef} className="sneaker-viewer-container">
      {shouldLoad ? (
        <SneakerViewer modelUrl={modelUrl} />
      ) : (
        <Placeholder />
      )}
    </div>
  )
}
```

**Model Preloading Strategy:**

```tsx
import { useGLTF } from '@react-three/drei'
import { useEffect } from 'react'

// Preload critical models
const CRITICAL_MODELS = [
  '/models/sneaker-main.glb',
  '/models/sneaker-variant-1.glb',
]

export function usePreloadModels() {
  useEffect(() => {
    // Preload after initial page load
    const timer = setTimeout(() => {
      CRITICAL_MODELS.forEach(url => {
        useGLTF.preload(url)
      })
    }, 2000)
    
    return () => clearTimeout(timer)
  }, [])
}

// Usage in _app.tsx or layout
function App() {
  usePreloadModels()
  return <>{/* app content */}</>
}
```

### 3.4 Level of Detail (LOD) Techniques

**Using Drei's Detailed Component:**

```tsx
import { Detailed } from '@react-three/drei'
import { useGLTF } from '@react-three/drei'

function LODSneaker({ 
  highResUrl, 
  midResUrl, 
  lowResUrl 
}: { 
  highResUrl: string
  midResUrl: string
  lowResUrl: string
}) {
  const highRes = useGLTF(highResUrl)
  const midRes = useGLTF(midResUrl)
  const lowRes = useGLTF(lowResUrl)
  
  return (
    <Detailed
      distances={[0, 10, 20]} // Switch distances
    >
      <primitive object={highRes.scene} />
      <primitive object={midRes.scene} />
      <primitive object={lowRes.scene} />
    </Detailed>
  )
}
```

**Custom LOD with Distance-Based Switching:**

```tsx
import { useRef, useMemo } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'

function AdaptiveSneaker({
  lodModels
}: {
  lodModels: { url: string; distance: number }[]
}) {
  const groupRef = useRef<THREE.Group>(null)
  const { camera } = useThree()
  const [currentLOD, setCurrentLOD] = useState(0)
  
  // Load all LOD variants
  const models = lodModels.map(({ url }) => useGLTF(url))
  
  useFrame(() => {
    if (!groupRef.current) return
    
    const distance = camera.position.distanceTo(groupRef.current.position)
    
    // Find appropriate LOD level
    let newLOD = 0
    for (let i = 0; i < lodModels.length; i++) {
      if (distance > lodModels[i].distance) {
        newLOD = i
      }
    }
    
    setCurrentLOD(newLOD)
  })
  
  return (
    <group ref={groupRef}>
      {models.map((model, index) => (
        <primitive
          key={index}
          object={model.scene}
          visible={index === currentLOD}
        />
      ))}
    </group>
  )
}

// Usage
<AdaptiveSneaker
  lodModels={[
    { url: '/models/sneaker-hd.glb', distance: 0 },
    { url: '/models/sneaker-md.glb', distance: 5 },
    { url: '/models/sneaker-ld.glb', distance: 15 },
  ]}
/>
```

---

## 4. Realistic Rendering

### 4.1 Lighting Setup for Product Showcases

**Professional Studio Lighting Setup:**

```tsx
import { Environment, Lightformer, ContactShadows } from '@react-three/drei'

function StudioLighting() {
  return (
    <>
      {/* Environment Map for reflections */}
      <Environment resolution={256}>
        <group>
          {/* Key Light */}
          <Lightformer
            form="rect"
            intensity={10}
            position={[-5, 5, 5]}
            scale={5}
            color="#ffffff"
          />
          
          {/* Fill Light */}
          <Lightformer
            form="rect"
            intensity={5}
            position={[5, 3, 5]}
            scale={5}
            color="#e8f4ff"
          />
          
          {/* Rim Light */}
          <Lightformer
            form="rect"
            intensity={8}
            position={[0, 5, -5]}
            scale={5}
            color="#ffffff"
            rotation-y={Math.PI}
          />
          
          {/* Ground reflection light */}
          <Lightformer
            form="circle"
            intensity={3}
            position={[0, -3, 0]}
            scale={3}
            color="#f0f0f0"
            rotation-x={Math.PI / 2}
          />
        </group>
      </Environment>
      
      {/* Contact shadows for grounding */}
      <ContactShadows
        position={[0, -1.5, 0]}
        opacity={0.4}
        scale={10}
        blur={2}
        far={4}
      />
    </>
  )
}
```

**Using Drei's Stage Component (Quick Setup):**

```tsx
import { Stage } from '@react-three/drei'

function ProductStage({ children }: { children: React.ReactNode }) {
  return (
    <Stage
      environment="city"
      intensity={0.5}
      contactShadow={{
        opacity: 0.5,
        blur: 2,
      }}
      preset="rembrandt"
      shadows
    >
      {children}
    </Stage>
  )
}

// Available presets: "rembrandt", "portrait", "upfront", "soft"
```

### 4.2 Environment Maps and Reflections

**HDRI Environment Setup:**

```tsx
import { Environment } from '@react-three/drei'

function EnvironmentSetup() {
  return (
    <>
      {/* Using built-in presets */}
      <Environment preset="city" background />
      
      {/* Or custom HDRI */}
      <Environment
        files="/hdris/studio.hdr"
        background
        blur={0.5}
      />
      
      {/* Ground-projected environment for better grounding */}
      <Environment
        files="/hdris/studio.hdr"
        ground={{
          height: 15,
          radius: 30,
          scale: 50,
        }}
      />
    </>
  )
}

// Available presets:
// "sunset", "dawn", "night", "warehouse", "forest", 
// "apartment", "studio", "city", "park", "lobby"
```

**Dynamic Environment with Reflections:**

```tsx
import { Environment, useEnvironment } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { useRef } from 'react'

function RotatingEnvironment() {
  const envRef = useRef<THREE.Group>(null)
  
  useFrame((state) => {
    if (envRef.current) {
      envRef.current.rotation.y = state.clock.elapsedTime * 0.05
    }
  })
  
  return (
    <Environment frames={Infinity} resolution={256}>
      <group ref={envRef}>
        <Lightformer
          form="ring"
          intensity={5}
          scale={3}
          color="#ff9900"
          position={[0, 5, 0]}
        />
      </group>
    </Environment>
  )
}
```

### 4.3 Material Properties for Different Surfaces

**Sneaker Material Configurations:**

```tsx
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'

function SneakerWithMaterials({ url }: { url: string }) {
  const { scene, materials } = useGLTF(url)
  
  // Modify materials after loading
  scene.traverse((child) => {
    if (child.isMesh) {
      const material = child.material as THREE.MeshStandardMaterial
      
      // Identify by material name or mesh name
      if (child.name.includes('leather') || material.name.includes('leather')) {
        // Leather material
        material.roughness = 0.7
        material.metalness = 0.1
        material.envMapIntensity = 0.8
      }
      
      if (child.name.includes('rubber') || material.name.includes('rubber')) {
        // Rubber sole
        material.roughness = 0.6
        material.metalness = 0.0
        material.envMapIntensity = 0.5
      }
      
      if (child.name.includes('mesh') || material.name.includes('mesh')) {
        // Mesh/fabric upper
        material.roughness = 0.9
        material.metalness = 0.0
        material.envMapIntensity = 0.3
      }
      
      if (child.name.includes('metal') || material.name.includes('metal')) {
        // Metal eyelets/logos
        material.roughness = 0.2
        material.metalness = 0.9
        material.envMapIntensity = 1.2
      }
      
      if (child.name.includes('laces') || material.name.includes('laces')) {
        // Fabric laces
        material.roughness = 0.95
        material.metalness = 0.0
        material.envMapIntensity = 0.2
      }
    }
  })
  
  return <primitive object={scene} />
}
```

**Advanced Material with MeshPhysicalMaterial:**

```tsx
import { useRef } from 'react'
import * as THREE from 'three'

function PremiumLeatherMaterial() {
  return (
    <meshPhysicalMaterial
      color="#8B4513"
      roughness={0.6}
      metalness={0.1}
      clearcoat={0.3}
      clearcoatRoughness={0.4}
      sheen={0.5}
      sheenColor="#D2691E"
      envMapIntensity={1.0}
    />
  )
}

function RubberSoleMaterial() {
  return (
    <meshPhysicalMaterial
      color="#1a1a1a"
      roughness={0.7}
      metalness={0.0}
      clearcoat={0.1}
      clearcoatRoughness={0.8}
      envMapIntensity={0.5}
    />
  )
}
```

### 4.4 Shadows and Contact Shadows

**Contact Shadows (Recommended for products):**

```tsx
import { ContactShadows } from '@react-three/drei'

function ProductWithShadows() {
  return (
    <>
      {/* Single-frame contact shadows (static) */}
      <ContactShadows
        position={[0, -1.5, 0]}
        opacity={0.4}
        scale={10}
        blur={2.5}
        far={4}
        resolution={512}
        color="#000000"
        frames={1} // Render once for static objects
      />
      
      {/* Animated contact shadows for moving objects */}
      <ContactShadows
        position={[0, -1.5, 0]}
        opacity={0.4}
        scale={10}
        blur={2.5}
        far={4}
        resolution={512}
        frames={Infinity} // Continuously update
        smooth={true}
      />
    </>
  )
}
```

**Accumulative Shadows (High-quality soft shadows):**

```tsx
import { AccumulativeShadows, RandomizedLight } from '@react-three/drei'

function SoftShadows() {
  return (
    <AccumulativeShadows
      temporal
      frames={100}
      color="#9d4b4b"
      colorBlend={2}
      toneMapped={true}
      alphaTest={0.75}
      opacity={0.8}
      scale={12}
    >
      <RandomizedLight
        amount={8}
        radius={4}
        ambient={0.5}
        intensity={1}
        position={[5, 5, -10]}
        bias={0.001}
      />
    </AccumulativeShadows>
  )
}
```

**Standard Shadow Setup:**

```tsx
import { Canvas } from '@react-three/fiber'

function App() {
  return (
    <Canvas
      shadows
      camera={{ position: [0, 0, 5], fov: 45 }}
      gl={{ antialias: true }}
    >
      {/* Ambient light for base illumination */}
      <ambientLight intensity={0.3} />
      
      {/* Main directional light with shadows */}
      <directionalLight
        position={[5, 10, 7]}
        intensity={1}
        castShadow
        shadow-mapSize={2048}
        shadow-camera-near={0.1}
        shadow-camera-far={50}
        shadow-bias={-0.001}
      />
      
      {/* Fill light */}
      <pointLight position={[-5, 5, -5]} intensity={0.5} />
      
      <SneakerModel url="/models/sneaker.glb" />
      
      {/* Shadow-receiving ground */}
      <mesh receiveShadow position={[0, -1.5, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[20, 20]} />
        <shadowMaterial opacity={0.3} />
      </mesh>
    </Canvas>
  )
}
```

---

## 5. Code Examples

### 5.1 Complete Example: Loading and Displaying a GLTF Model

```tsx
// components/SneakerViewer.tsx
'use client'

import { Suspense, useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { 
  useGLTF, 
  Environment, 
  ContactShadows,
  OrbitControls,
  Html,
  useProgress,
  Bounds,
  useBounds
} from '@react-three/drei'
import * as THREE from 'three'

// Loading indicator
function Loader() {
  const { progress } = useProgress()
  return (
    <Html center>
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center',
        fontFamily: 'sans-serif'
      }}>
        <div className="spinner" style={{
          width: '40px',
          height: '40px',
          border: '4px solid #f3f3f3',
          borderTop: '4px solid #3498db',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }} />
        <p>{Math.round(progress)}% loaded</p>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    </Html>
  )
}

// Auto-centering wrapper
function AutoCenter({ children }: { children: React.ReactNode }) {
  const bounds = useBounds()
  
  return (
    <group 
      onClick={() => bounds.refresh().clip().fit()}
      onPointerOver={() => document.body.style.cursor = 'zoom-in'}
      onPointerOut={() => document.body.style.cursor = 'auto'}
    >
      {children}
    </group>
  )
}

// Interactive sneaker model
function Sneaker({ url }: { url: string }) {
  const groupRef = useRef<THREE.Group>(null)
  const [hovered, setHovered] = useState(false)
  const [autoRotate, setAutoRotate] = useState(true)
  
  const { scene } = useGLTF(url)
  
  // Clone scene to avoid conflicts with multiple instances
  const model = scene.clone()
  
  // Apply material adjustments
  model.traverse((child) => {
    if (child.isMesh) {
      child.castShadow = true
      child.receiveShadow = true
      
      // Enhance material properties
      if (child.material) {
        child.material.envMapIntensity = 0.8
      }
    }
  })
  
  useFrame((state, delta) => {
    if (!groupRef.current) return
    
    // Auto-rotation
    if (autoRotate && !hovered) {
      groupRef.current.rotation.y += delta * 0.3
    }
    
    // Hover scale effect
    const targetScale = hovered ? 1.05 : 1
    groupRef.current.scale.lerp(
      new THREE.Vector3(targetScale, targetScale, targetScale),
      delta * 5
    )
  })
  
  return (
    <group
      ref={groupRef}
      onPointerOver={(e) => {
        e.stopPropagation()
        setHovered(true)
        document.body.style.cursor = 'pointer'
      }}
      onPointerOut={(e) => {
        e.stopPropagation()
        setHovered(false)
        document.body.style.cursor = 'auto'
      }}
      onClick={() => setAutoRotate(!autoRotate)}
    >
      <primitive object={model} />
    </group>
  )
}

// Preload model
useGLTF.preload('/models/sneaker.glb')

// Main viewer component
export default function SneakerViewer() {
  return (
    <div style={{ width: '100%', height: '500px' }}>
      <Canvas
        shadows
        dpr={[1, 2]} // Responsive pixel ratio
        camera={{ position: [0, 0, 4], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
      >
        <color attach="background" args={['#f5f5f5']} />
        
        <Suspense fallback={<Loader />}>
          <Bounds fit clip observe margin={1.2}>
            <AutoCenter>
              <Sneaker url="/models/sneaker.glb" />
            </AutoCenter>
          </Bounds>
          
          {/* Environment for reflections */}
          <Environment preset="city" />
          
          {/* Contact shadows */}
          <ContactShadows
            position={[0, -1.5, 0]}
            opacity={0.4}
            scale={10}
            blur={2}
            far={4}
          />
        </Suspense>
        
        {/* Controls */}
        <OrbitControls
          makeDefault
          minPolarAngle={0}
          maxPolarAngle={Math.PI / 2}
          enableZoom={true}
          enablePan={false}
          minDistance={2}
          maxDistance={8}
        />
        
        {/* Ambient light */}
        <ambientLight intensity={0.3} />
        
        {/* Directional light for shadows */}
        <directionalLight
          position={[5, 10, 7]}
          intensity={0.8}
          castShadow
          shadow-mapSize={1024}
        />
      </Canvas>
    </div>
  )
}
```

### 5.2 Integration with Existing React Three Fiber Scenes

```tsx
// components/SneakerScene.tsx
import { Canvas } from '@react-three/fiber'
import { 
  Environment, 
  ContactShadows,
  PresentationControls,
  Float
} from '@react-three/drei'
import { SneakerModel } from './SneakerModel'

interface SneakerSceneProps {
  modelUrl: string
  variant?: 'floating' | 'static' | 'presentation'
  backgroundColor?: string
}

export function SneakerScene({ 
  modelUrl, 
  variant = 'presentation',
  backgroundColor = '#f0f0f0'
}: SneakerSceneProps) {
  return (
    <Canvas
      shadows
      dpr={[1, 2]}
      camera={{ position: [0, 0, 5], fov: 45 }}
      gl={{ antialias: true }}
    >
      <color attach="background" args={[backgroundColor]} />
      
      {/* Lighting */}
      <ambientLight intensity={0.4} />
      <spotLight
        position={[10, 10, 10]}
        angle={0.15}
        penumbra={1}
        intensity={1}
        castShadow
      />
      
      <Environment preset="studio" />
      
      {/* Render variant */}
      {variant === 'floating' && (
        <Float
          speed={2}
          rotationIntensity={0.5}
          floatIntensity={0.5}
        >
          <SneakerModel url={modelUrl} />
        </Float>
      )}
      
      {variant === 'presentation' && (
        <PresentationControls
          global
          rotation={[0, 0, 0]}
          polar={[-0.4, 0.2]}
          azimuth={[-0.5, 0.5]}
          config={{ mass: 2, tension: 400 }}
          snap={{ mass: 4, tension: 400 }}
        >
          <SneakerModel url={modelUrl} />
        </PresentationControls>
      )}
      
      {variant === 'static' && (
        <SneakerModel url={modelUrl} />
      )}
      
      {/* Ground shadows */}
      <ContactShadows
        position={[0, -1.5, 0]}
        opacity={0.3}
        scale={15}
        blur={2}
        far={4}
      />
    </Canvas>
  )
}
```

### 5.3 Error Boundaries and Fallbacks

```tsx
// components/SafeSneakerViewer.tsx
import { Component, ErrorInfo, ReactNode } from 'react'
import { SneakerViewer } from './SneakerViewer'

interface Props {
  children: ReactNode
  fallbackImage?: string
}

interface State {
  hasError: boolean
  error?: Error
}

export class SneakerErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Sneaker 3D Viewer Error:', error, errorInfo)
    // Log to error tracking service
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="sneaker-fallback">
          {this.props.fallbackImage ? (
            <img 
              src={this.props.fallbackImage} 
              alt="Sneaker"
              style={{ width: '100%', height: 'auto' }}
            />
          ) : (
            <div className="error-message">
              <h3>Unable to load 3D view</h3>
              <p>Please try refreshing the page</p>
              <button 
                onClick={() => this.setState({ hasError: false })}
                className="retry-button"
              >
                Retry
              </button>
            </div>
          )}
        </div>
      )
    }

    return this.props.children
  }
}

// Usage with feature detection
import { useEffect, useState } from 'react'

export function SafeSneakerViewer({ modelUrl }: { modelUrl: string }) {
  const [webglSupported, setWebglSupported] = useState(true)
  
  useEffect(() => {
    // Check WebGL support
    const canvas = document.createElement('canvas')
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl')
    setWebglSupported(!!gl)
  }, [])
  
  if (!webglSupported) {
    return (
      <div className="webgl-fallback">
        <img 
          src="/images/sneaker-fallback.jpg" 
          alt="Sneaker"
        />
        <p>Your browser doesn't support 3D viewing</p>
      </div>
    )
  }
  
  return (
    <SneakerErrorBoundary fallbackImage="/images/sneaker-fallback.jpg">
      <SneakerViewer modelUrl={modelUrl} />
    </SneakerErrorBoundary>
  )
}
```

### 5.4 Next.js Integration

```tsx
// app/page.tsx or pages/index.tsx
import dynamic from 'next/dynamic'
import { Suspense } from 'react'

// Dynamic import for client-side only rendering
const SneakerViewer = dynamic(
  () => import('@/components/SneakerViewer').then(mod => mod.default),
  { 
    ssr: false,
    loading: () => (
      <div style={{ 
        width: '100%', 
        height: '500px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#f5f5f5'
      }}>
        <p>Loading 3D Viewer...</p>
      </div>
    )
  }
)

export default function ProductPage() {
  return (
    <div className="product-page">
      <h1>Nike Air Max 90</h1>
      
      <div className="product-viewer">
        <SneakerViewer />
      </div>
      
      <div className="product-details">
        <p>Experience our latest sneaker in 3D</p>
        <button>Add to Cart</button>
      </div>
    </div>
  )
}
```

**Next.js Config for 3D Assets:**

```js
// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    // Add support for importing GLB/GLTF files
    config.module.rules.push({
      test: /\.(glb|gltf)$/,
      type: 'asset/resource',
    })
    
    return config
  },
  
  // Optional: Configure headers for 3D assets
  async headers() {
    return [
      {
        source: '/models/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ]
  },
}

module.exports = nextConfig
```

---

## 6. Best Practices

### 6.1 Recommended Tools and Workflows

**Blender Workflow:**

```
1. Model Creation
   ↓
2. UV Unwrapping
   ↓
3. Material Setup (Principled BSDF)
   ↓
4. Texture Baking (if using procedural textures)
   ↓
5. Polygon Reduction (Decimate modifier if needed)
   ↓
6. Export as GLB with Draco compression
   ↓
7. Optimize with gltf-transform
   ↓
8. Convert to React component with gltfjsx (optional)
```

**Essential Tools:**

| Tool | Purpose | Installation |
|------|---------|--------------|
| **gltfjsx** | Convert GLTF to React component | `npx gltfjsx` |
| **gltf-transform** | Optimize and compress models | `npm install -g @gltf-transform/cli` |
| **Blender glTF I/O** | Export from Blender | Built-in |
| **Khronos glTF-Compressor** | Interactive texture compression | Web tool |
| **Draco** | Mesh compression | Included with Three.js |

**GLTFJSX Usage:**

```bash
# Convert GLB to React component
npx gltfjsx public/models/sneaker.glb --transform --output src/components/Sneaker.jsx

# Options:
# --transform: Auto-optimize with draco
# --types: Generate TypeScript definitions
# --shadows: Enable shadow casting
# --instance: Auto-instance repeated geometry
```

### 6.2 Common Pitfalls and Solutions

| Pitfall | Solution |
|---------|----------|
| **Model not visible** | Check file path (must be from public root, not include `/public`), verify camera position |
| **Textures not loading** | Ensure textures are in public folder, check material names match |
| **Black model** | Add lighting or Environment, check material roughness/metalness |
| **Slow loading** | Use Draco compression, reduce texture sizes, implement lazy loading |
| **Memory leaks** | Dispose of geometries/materials when unmounting, use `useGLTF.preload` sparingly |
| **Mobile performance** | Reduce polygon count, use simpler materials, disable shadows |
| **CORS errors** | Host models on same domain or configure CORS headers |
| **Draco not working** | Ensure decoder path is set correctly, check browser console for errors |

**Memory Management:**

```tsx
import { useEffect } from 'react'
import { useGLTF } from '@react-three/drei'

function SneakerModel({ url }: { url: string }) {
  const { scene, nodes, materials } = useGLTF(url)
  
  useEffect(() => {
    return () => {
      // Cleanup when component unmounts
      scene.traverse((child) => {
        if (child.isMesh) {
          child.geometry.dispose()
          if (Array.isArray(child.material)) {
            child.material.forEach(m => m.dispose())
          } else {
            child.material.dispose()
          }
        }
      })
    }
  }, [scene])
  
  return <primitive object={scene} />
}
```

### 6.3 Testing and Debugging Tips

**Performance Monitoring:**

```tsx
import { Stats } from '@react-three/drei'

function App() {
  return (
    <Canvas>
      {/* Your scene */}
      <Stats /> {/* Shows FPS, draw calls, memory */}
    </Canvas>
  )
}
```

**Browser DevTools:**

1. **Three.js Inspector**: Install browser extension for scene inspection
2. **Performance Tab**: Record and analyze frame times
3. **Network Tab**: Monitor model loading times
4. **Memory Tab**: Check for memory leaks

**Common Debugging Techniques:**

```tsx
// 1. Visualize bounding boxes
import { BoxHelper } from 'three'

function DebugBoundingBox({ object }: { object: THREE.Object3D }) {
  const helper = new BoxHelper(object, 0xff0000)
  return <primitive object={helper} />
}

// 2. Check if model loaded correctly
function SneakerWithDebug({ url }: { url: string }) {
  const { scene } = useGLTF(url)
  
  console.log('Loaded scene:', scene)
  console.log('Children:', scene.children)
  
  scene.traverse((child) => {
    console.log('Object:', child.name, child.type)
    if (child.isMesh) {
      console.log('  Material:', child.material.name)
      console.log('  Geometry:', child.geometry.type)
    }
  })
  
  return <primitive object={scene} />
}

// 3. Wireframe mode for debugging
<mesh>
  <boxGeometry />
  <meshBasicMaterial wireframe color="red" />
</mesh>
```

**Testing Checklist:**

- [ ] Model loads without errors
- [ ] Textures display correctly
- [ ] Shadows render properly
- [ ] Auto-rotation works smoothly
- [ ] Hover effects respond correctly
- [ ] Mobile performance is acceptable (30+ FPS)
- [ ] Loading states display correctly
- [ ] Fallback image shows on error
- [ ] Memory usage remains stable
- [ ] Works across browsers (Chrome, Firefox, Safari, Edge)

---

## 7. Quick Reference

### Installation

```bash
# Core dependencies
npm install three @react-three/fiber @react-three/drei

# TypeScript types
npm install -D @types/three

# Optimization tools
npm install -g @gltf-transform/cli
```

### File Structure

```
public/
  models/
    sneaker.glb
    sneaker-draco.glb
  hdris/
    studio.hdr
src/
  components/
    SneakerViewer.tsx
    SneakerModel.tsx
    Loader.tsx
    ErrorBoundary.tsx
```

### Performance Targets

| Metric | Target |
|--------|--------|
| Initial load | < 3 seconds |
| Model file size | < 2 MB |
| Texture memory | < 50 MB |
| FPS (desktop) | 60 |
| FPS (mobile) | 30+ |
| Time to interactive | < 5 seconds |

---

## Conclusion

This research provides a complete pipeline for importing realistic 3D sneaker models from Blender into React Three Fiber applications. Key takeaways:

1. **Use GLB format** with Draco compression for optimal web delivery
2. **Leverage Drei's components** (useGLTF, Environment, ContactShadows) for rapid development
3. **Implement proper loading states** and error boundaries for production reliability
4. **Optimize for mobile** with reduced polygon counts and texture sizes
5. **Use realistic lighting** with environment maps and contact shadows
6. **Add interactivity** with hover effects and rotation controls

**Next Steps:**
1. Set up Blender with proper export settings
2. Create or acquire a sneaker 3D model
3. Export and optimize using the gltf-transform pipeline
4. Implement the React Three Fiber components
5. Test performance across devices
6. Deploy with proper caching headers

---

**Research Sources:**
- React Three Fiber Documentation (docs.pmnd.rs)
- Drei Documentation (drei.docs.pmnd.rs)
- Three.js Documentation (threejs.org)
- Blender glTF I/O Documentation
- Khronos Group glTF Specifications
- Community examples and GitHub repositories

**File:** `sneaker-3d-research-2025-02-02.md`
