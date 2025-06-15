"use client"

import { useRef } from "react"

import { Suspense, useEffect, useState } from "react"
import { useMemo } from "react"
import { useFrame } from "@react-three/fiber"
import { AlertTriangle } from "lucide-react"

interface AdvancedKnotRendererProps {
  settings: any
}

function LoadingFallback() {
  return (
    <div className="w-full h-full flex items-center justify-center bg-black/20 backdrop-blur-sm rounded-2xl border border-white/10">
      <div className="text-white text-lg animate-pulse">Initializing 3D Engine...</div>
    </div>
  )
}

function ErrorFallback({ error }: { error: string }) {
  return (
    <div className="w-full h-full flex items-center justify-center bg-black/20 backdrop-blur-sm rounded-2xl border border-white/10">
      <div className="text-center text-red-400">
        <AlertTriangle className="h-12 w-12 mx-auto mb-4" />
        <p className="text-lg mb-2">3D Rendering Error</p>
        <p className="text-sm opacity-70">{error}</p>
        <p className="text-xs opacity-50 mt-2">Falling back to 2D view...</p>
      </div>
    </div>
  )
}

export default function AdvancedKnotRenderer({ settings }: AdvancedKnotRendererProps) {
  const [isClient, setIsClient] = useState(false)
  const [ThreeComponents, setThreeComponents] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setIsClient(true)

    // Check for WebGL support
    const canvas = document.createElement("canvas")
    const gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl")

    if (!gl) {
      setError("WebGL not supported")
      return
    }

    // Dynamically import all Three.js components with error handling
    Promise.all([import("@react-three/fiber"), import("@react-three/drei"), import("three")])
      .then(([fiber, drei, three]) => {
        setThreeComponents({
          Canvas: fiber.Canvas,
          OrbitControls: drei.OrbitControls,
          Environment: drei.Environment,
          THREE: three,
        })
        setError(null)
      })
      .catch((error) => {
        console.error("Failed to load Three.js components:", error)
        setError("Failed to load 3D libraries")
      })
  }, [])

  if (!isClient) {
    return <LoadingFallback />
  }

  if (error) {
    return <ErrorFallback error={error} />
  }

  if (!ThreeComponents) {
    return <LoadingFallback />
  }

  try {
    return (
      <div className="bg-black/20 backdrop-blur-sm rounded-2xl border border-white/10 h-full overflow-hidden">
        <Suspense fallback={<LoadingFallback />}>
          <ThreeComponents.Canvas
            camera={{ position: [0, 0, 8], fov: 50 }}
            className="w-full h-full"
            onError={(error: any) => {
              console.error("Canvas error:", error)
              setError("Canvas rendering failed")
            }}
          >
            {/* Enhanced Lighting */}
            <ambientLight intensity={0.3} />
            <pointLight position={[10, 10, 10]} intensity={1.2} color="#00ffff" />
            <pointLight position={[-10, -10, -10]} intensity={0.8} color="#ff00ff" />
            <pointLight position={[0, 10, 0]} intensity={0.6} color="#ffffff" />

            {/* Environment for reflections */}
            <ThreeComponents.Environment preset="night" />

            {/* Knot Mesh */}
            <KnotMesh settings={settings} THREE={ThreeComponents.THREE} />

            {/* Enhanced Controls */}
            <ThreeComponents.OrbitControls
              enablePan={true}
              enableZoom={true}
              enableRotate={true}
              minDistance={2}
              maxDistance={20}
              autoRotate={settings.rotationSpeed > 0}
              autoRotateSpeed={settings.rotationSpeed * 2}
            />
          </ThreeComponents.Canvas>
        </Suspense>
      </div>
    )
  } catch (renderError) {
    console.error("Render error:", renderError)
    return <ErrorFallback error="Rendering failed" />
  }
}

// Simplified knot mesh component
function KnotMesh({ settings, THREE }: { settings: any; THREE: any }) {
  const meshRef = useRef<any>(null)

  // Generate simple knot geometry
  const geometry = useMemo(() => {
    if (!THREE) return null

    const points: any[] = []

    // Generate points based on knot type
    for (let i = 0; i <= 200; i++) {
      const t = (i / 200) * Math.PI * 2
      let x, y, z

      switch (settings.selectedKnot) {
        case "trefoil":
          x = Math.sin(t) + 2 * Math.sin(2 * t)
          y = Math.cos(t) - 2 * Math.cos(2 * t)
          z = -Math.sin(3 * t)
          break
        case "figure-eight":
          x = (2 + Math.cos(2 * t)) * Math.cos(3 * t)
          y = (2 + Math.cos(2 * t)) * Math.sin(3 * t)
          z = Math.sin(4 * t)
          break
        case "cinquefoil":
          x = Math.cos(2 * t) * (3 + Math.cos(5 * t))
          y = Math.sin(2 * t) * (3 + Math.cos(5 * t))
          z = Math.sin(5 * t)
          break
        default:
          x = Math.sin(t) + 2 * Math.sin(2 * t)
          y = Math.cos(t) - 2 * Math.cos(2 * t)
          z = -Math.sin(3 * t)
      }

      points.push(new THREE.Vector3(x * 1.5, y * 1.5, z * 1.5))
    }

    const curve = new THREE.CatmullRomCurve3(points, true)
    return new THREE.TubeGeometry(curve, 200, 0.12, 16, true)
  }, [settings.selectedKnot, THREE])

  // Animation
  useFrame((state, delta) => {
    if (meshRef.current && settings.rotationSpeed > 0) {
      meshRef.current.rotation.y += delta * settings.rotationSpeed * 0.5
      meshRef.current.rotation.x += delta * settings.rotationSpeed * 0.3
    }
  })

  if (!geometry) return null

  return (
    <mesh ref={meshRef} geometry={geometry}>
      <meshStandardMaterial
        color="#8b5cf6"
        metalness={0.8}
        roughness={0.2}
        envMapIntensity={1}
        emissive="#4c1d95"
        emissiveIntensity={0.1}
      />
    </mesh>
  )
}
