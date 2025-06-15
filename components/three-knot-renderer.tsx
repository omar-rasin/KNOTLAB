"use client"

import { useRef, useEffect, useState } from "react"

interface ThreeKnotRendererProps {
  settings: any
}

export default function ThreeKnotRenderer({ settings }: ThreeKnotRendererProps) {
  const mountRef = useRef<HTMLDivElement>(null)
  const sceneRef = useRef<any>(null)
  const rendererRef = useRef<any>(null)
  const animationRef = useRef<number>()
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let mounted = true

    const initThreeJS = async () => {
      try {
        if (!mountRef.current) return

        // Check WebGL support
        const canvas = document.createElement("canvas")
        const gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl")
        if (!gl) {
          throw new Error("WebGL not supported")
        }

        // Import Three.js
        const THREE = await import("three")

        if (!mounted) return

        // Scene setup
        const scene = new THREE.Scene()
        const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 1000)
        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })

        renderer.setSize(400, 400) // Initial size
        renderer.setClearColor(0x000000, 0)
        mountRef.current.appendChild(renderer.domElement)

        // Lighting
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.4)
        scene.add(ambientLight)

        const pointLight1 = new THREE.PointLight(0x8b5cf6, 1, 100)
        pointLight1.position.set(10, 10, 10)
        scene.add(pointLight1)

        const pointLight2 = new THREE.PointLight(0x06b6d4, 0.5, 100)
        pointLight2.position.set(-10, -10, -10)
        scene.add(pointLight2)

        // Camera position
        camera.position.set(0, 0, 8)

        // Store references
        sceneRef.current = { scene, camera, renderer, THREE }
        rendererRef.current = renderer

        // Create knot
        createKnot()

        // Handle resize
        const handleResize = () => {
          if (mountRef.current && renderer) {
            const width = mountRef.current.clientWidth
            const height = mountRef.current.clientHeight
            camera.aspect = width / height
            camera.updateProjectionMatrix()
            renderer.setSize(width, height)
          }
        }

        window.addEventListener("resize", handleResize)
        handleResize()

        // Animation loop
        const animate = () => {
          if (!mounted) return

          animationRef.current = requestAnimationFrame(animate)

          // Rotate the knot
          if (sceneRef.current?.knotMesh && settings.rotationSpeed > 0) {
            sceneRef.current.knotMesh.rotation.y += 0.01 * settings.rotationSpeed
            sceneRef.current.knotMesh.rotation.x += 0.005 * settings.rotationSpeed
          }

          renderer.render(scene, camera)
        }

        animate()
        setIsLoading(false)
        setError(null)

        return () => {
          window.removeEventListener("resize", handleResize)
          if (animationRef.current) {
            cancelAnimationFrame(animationRef.current)
          }
        }
      } catch (err: any) {
        console.error("Three.js initialization error:", err)
        setError(err.message || "Failed to initialize 3D renderer")
        setIsLoading(false)
      }
    }

    initThreeJS()

    return () => {
      mounted = false
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
      if (rendererRef.current && mountRef.current) {
        mountRef.current.removeChild(rendererRef.current.domElement)
        rendererRef.current.dispose()
      }
    }
  }, [])

  useEffect(() => {
    if (sceneRef.current && !isLoading && !error) {
      createKnot()
    }
  }, [settings.selectedKnot, isLoading, error])

  const createKnot = () => {
    if (!sceneRef.current) return

    const { scene, THREE } = sceneRef.current

    // Remove existing knot
    if (sceneRef.current.knotMesh) {
      scene.remove(sceneRef.current.knotMesh)
      sceneRef.current.knotMesh.geometry.dispose()
      sceneRef.current.knotMesh.material.dispose()
    }

    try {
      // Generate knot points
      const points: any[] = []

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

      // Create curve and geometry
      const curve = new THREE.CatmullRomCurve3(points, true)
      const geometry = new THREE.TubeGeometry(curve, 200, 0.12, 16, true)

      // Create material
      const material = new THREE.MeshStandardMaterial({
        color: 0x8b5cf6,
        metalness: 0.7,
        roughness: 0.3,
        emissive: 0x4c1d95,
        emissiveIntensity: 0.1,
      })

      // Create mesh
      const knotMesh = new THREE.Mesh(geometry, material)
      scene.add(knotMesh)

      // Store reference
      sceneRef.current.knotMesh = knotMesh
    } catch (err) {
      console.error("Error creating knot:", err)
    }
  }

  if (isLoading) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-black/20 backdrop-blur-sm rounded-2xl border border-white/10">
        <div className="text-white text-lg animate-pulse">Loading 3D Engine...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-black/20 backdrop-blur-sm rounded-2xl border border-white/10">
        <div className="text-center">
          <div className="text-red-400 text-lg mb-2">3D Rendering Error</div>
          <div className="text-white/70 text-sm mb-4">{error}</div>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors"
          >
            Reload Page
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-black/20 backdrop-blur-sm rounded-2xl border border-white/10 h-full overflow-hidden relative">
      <div ref={mountRef} className="w-full h-full" />
      <div className="absolute bottom-4 left-4 text-white/60 text-sm">3D View - {settings.selectedKnot} knot</div>
    </div>
  )
}
