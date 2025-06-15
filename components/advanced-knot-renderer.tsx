"use client"

import type React from "react"
import { useState, useEffect } from "react"
import SimpleKnotRenderer from "@/components/simple-knot-renderer"
import { AlertTriangle } from "lucide-react"

interface AdvancedKnotRendererProps {
  settings: any
}

function LoadingFallback() {
  return (
    <div className="w-full h-full flex items-center justify-center bg-black/20 backdrop-blur-sm rounded-2xl border border-white/10">
      <div className="text-white text-lg animate-pulse">Loading...</div>
    </div>
  )
}

function ErrorFallback({ error, onRetry }: { error: string; onRetry: () => void }) {
  return (
    <div className="w-full h-full flex items-center justify-center bg-black/20 backdrop-blur-sm rounded-2xl border border-white/10">
      <div className="text-center">
        <AlertTriangle className="h-12 w-12 mx-auto mb-4 text-red-400" />
        <p className="text-lg mb-2 text-white">3D Rendering Issue</p>
        <p className="text-sm opacity-70 text-white/70 mb-4">{error}</p>
        <button
          onClick={onRetry}
          className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors"
        >
          Try Again
        </button>
      </div>
    </div>
  )
}

export default function AdvancedKnotRenderer({ settings }: AdvancedKnotRendererProps) {
  const [use3D, setUse3D] = useState(true)
  const [isClient, setIsClient] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [Canvas, setCanvas] = useState<any>(null)
  const [retryCount, setRetryCount] = useState(0)

  useEffect(() => {
    setIsClient(true)
    loadThreeJS()
  }, [retryCount])

  const loadThreeJS = async () => {
    try {
      setError(null)

      // Check WebGL support
      const canvas = document.createElement("canvas")
      const gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl")

      if (!gl) {
        throw new Error("WebGL is not supported in your browser")
      }

      // Dynamic imports
      const [{ Canvas: R3FCanvas }, { OrbitControls, Environment }] = await Promise.all([
        import("@react-three/fiber"),
        import("@react-three/drei"),
      ])

      // Create the Canvas component
      const ThreeCanvas = ({ children }: { children: React.ReactNode }) => (
        <R3FCanvas
          camera={{ position: [0, 0, 8], fov: 50 }}
          className="w-full h-full"
          gl={{ antialias: true, alpha: true }}
          onCreated={({ gl }) => {
            gl.setClearColor(0x000000, 0)
          }}
        >
          <ambientLight intensity={0.4} />
          <pointLight position={[10, 10, 10]} intensity={1} color="#8b5cf6" />
          <pointLight position={[-10, -10, -10]} intensity={0.5} color="#06b6d4" />

          <Environment preset="night" />

          {children}

          <OrbitControls
            enablePan={true}
            enableZoom={true}
            enableRotate={true}
            minDistance={3}
            maxDistance={15}
            autoRotate={settings.rotationSpeed > 0}
            autoRotateSpeed={settings.rotationSpeed}
          />
        </R3FCanvas>
      )

      setCanvas(() => ThreeCanvas)
    } catch (err: any) {
      console.error("Failed to load Three.js:", err)
      setError(err.message || "Failed to initialize 3D rendering")
    }
  }

  const handleRetry = () => {
    setRetryCount((prev) => prev + 1)
  }

  if (!isClient) {
    return <LoadingFallback />
  }

  if (error) {
    return <ErrorFallback error={error} onRetry={handleRetry} />
  }

  return (
    <div className="relative w-full h-full">
      {use3D ? (
        <Canvas>
          <KnotMesh settings={settings} />
        </Canvas>
      ) : (
        <SimpleKnotRenderer settings={settings} />
      )}

      {/* Toggle button */}
      <div className="absolute top-4 right-4 z-10">
        <button
          onClick={() => setUse3D(!use3D)}
          className="px-3 py-1 bg-black/50 text-white text-xs rounded border border-white/20 hover:bg-black/70 transition-colors"
        >
          {use3D ? "2D View" : "3D View"}
        </button>
      </div>
    </div>
  )
}

// Simplified Knot Mesh Component
function KnotMesh({ settings }: { settings: any }) {
  const [mesh, setMesh] = useState<any>(null)

  useEffect(() => {
    const createKnotGeometry = async () => {
      try {
        const THREE = await import("three")

        const points: THREE.Vector3[] = []

        // Generate knot points
        for (let i = 0; i <= 300; i++) {
          const t = (i / 300) * Math.PI * 2
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
            case "hopf-link":
              x = Math.cos(t) * (2 + Math.cos(2 * t))
              y = Math.sin(t) * (2 + Math.cos(2 * t))
              z = Math.sin(2 * t)
              break
            case "torus-knot":
              x = Math.cos(2 * t) * (3 + Math.cos(7 * t))
              y = Math.sin(2 * t) * (3 + Math.cos(7 * t))
              z = Math.sin(7 * t)
              break
            default:
              x = Math.sin(t) + 2 * Math.sin(2 * t)
              y = Math.cos(t) - 2 * Math.cos(2 * t)
              z = -Math.sin(3 * t)
          }

          points.push(new THREE.Vector3(x * 1.2, y * 1.2, z * 1.2))
        }

        const curve = new THREE.CatmullRomCurve3(points, true)
        const geometry = new THREE.TubeGeometry(curve, 300, 0.15, 16, true)

        setMesh({ geometry })
      } catch (error) {
        console.error("Error creating knot geometry:", error)
      }
    }

    createKnotGeometry()
  }, [settings.selectedKnot])

  if (!mesh) {
    return null
  }

  return (
    <mesh geometry={mesh.geometry}>
      <meshStandardMaterial
        color="#8b5cf6"
        metalness={0.7}
        roughness={0.3}
        emissive="#4c1d95"
        emissiveIntensity={0.1}
      />
    </mesh>
  )
}
