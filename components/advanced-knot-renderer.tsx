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
      <div className="text-white text-lg animate-pulse">Loading 3D Visualization...</div>
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
        <div className="space-y-2">
          <button
            onClick={onRetry}
            className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors block mx-auto"
          >
            Try Again
          </button>
          <p className="text-xs text-white/50">Falling back to 2D view...</p>
        </div>
      </div>
    </div>
  )
}

export default function AdvancedKnotRenderer({ settings }: AdvancedKnotRendererProps) {
  const [renderMode, setRenderMode] = useState<"loading" | "3d" | "2d" | "error">("loading")
  const [error, setError] = useState<string | null>(null)
  const [ThreeCanvas, setThreeCanvas] = useState<any>(null)
  const [retryCount, setRetryCount] = useState(0)

  useEffect(() => {
    let mounted = true

    const loadThreeJS = async () => {
      try {
        setError(null)
        setRenderMode("loading")

        // Check WebGL support first
        const canvas = document.createElement("canvas")
        const gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl")

        if (!gl) {
          throw new Error("WebGL is not supported in your browser")
        }

        // Try to load Three.js components
        const [{ Canvas }, { OrbitControls, Environment }, THREE] = await Promise.all([
          import("@react-three/fiber"),
          import("@react-three/drei"),
          import("three"),
        ])

        if (!mounted) return

        // Create a working Canvas component
        const WorkingCanvas = ({ children }: { children: React.ReactNode }) => {
          try {
            return (
              <Canvas
                camera={{ position: [0, 0, 8], fov: 50 }}
                className="w-full h-full"
                gl={{ antialias: true, alpha: true }}
                onCreated={({ gl }) => {
                  gl.setClearColor(0x000000, 0)
                }}
                fallback={<LoadingFallback />}
              >
                <ambientLight intensity={0.4} />
                <pointLight position={[10, 10, 10]} intensity={1} color="#8b5cf6" />
                <pointLight position={[-10, -10, -10]} intensity={0.5} color="#06b6d4" />

                <Environment preset="night" />

                <KnotMesh settings={settings} THREE={THREE} />

                <OrbitControls
                  enablePan={true}
                  enableZoom={true}
                  enableRotate={true}
                  minDistance={3}
                  maxDistance={15}
                  autoRotate={settings.rotationSpeed > 0}
                  autoRotateSpeed={settings.rotationSpeed}
                />
              </Canvas>
            )
          } catch (canvasError) {
            console.error("Canvas creation error:", canvasError)
            throw canvasError
          }
        }

        setThreeCanvas(() => WorkingCanvas)
        setRenderMode("3d")
      } catch (err: any) {
        console.error("Failed to load Three.js:", err)
        setError(err.message || "Failed to initialize 3D rendering")

        // Auto-fallback to 2D after a short delay
        setTimeout(() => {
          if (mounted) {
            setRenderMode("2d")
          }
        }, 2000)
      }
    }

    loadThreeJS()

    return () => {
      mounted = false
    }
  }, [retryCount, settings])

  const handleRetry = () => {
    setRetryCount((prev) => prev + 1)
  }

  const toggleMode = () => {
    setRenderMode(renderMode === "3d" ? "2d" : "3d")
  }

  // Render based on current mode
  if (renderMode === "loading") {
    return <LoadingFallback />
  }

  if (renderMode === "error" && error) {
    return <ErrorFallback error={error} onRetry={handleRetry} />
  }

  if (renderMode === "2d" || !ThreeCanvas) {
    return (
      <div className="relative w-full h-full">
        <SimpleKnotRenderer settings={settings} />
        <div className="absolute top-4 right-4 z-10">
          <button
            onClick={handleRetry}
            className="px-3 py-1 bg-black/50 text-white text-xs rounded border border-white/20 hover:bg-black/70 transition-colors"
          >
            Try 3D
          </button>
        </div>
      </div>
    )
  }

  // 3D mode
  return (
    <div className="relative w-full h-full">
      <div className="bg-black/20 backdrop-blur-sm rounded-2xl border border-white/10 h-full overflow-hidden">
        <ThreeCanvas />
      </div>
      <div className="absolute top-4 right-4 z-10">
        <button
          onClick={() => setRenderMode("2d")}
          className="px-3 py-1 bg-black/50 text-white text-xs rounded border border-white/20 hover:bg-black/70 transition-colors"
        >
          2D View
        </button>
      </div>
      <div className="absolute bottom-4 left-4 text-white/60 text-sm">3D View - {settings.selectedKnot} knot</div>
    </div>
  )
}

// Simplified Knot Mesh Component
function KnotMesh({ settings, THREE }: { settings: any; THREE: any }) {
  const [geometry, setGeometry] = useState<any>(null)

  useEffect(() => {
    if (!THREE) return

    try {
      const points: any[] = []

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
      const tubeGeometry = new THREE.TubeGeometry(curve, 300, 0.15, 16, true)

      setGeometry(tubeGeometry)
    } catch (error) {
      console.error("Error creating knot geometry:", error)
    }
  }, [settings.selectedKnot, THREE])

  if (!geometry) {
    return null
  }

  return (
    <mesh geometry={geometry}>
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
