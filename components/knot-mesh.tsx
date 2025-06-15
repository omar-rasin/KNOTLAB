"use client"

import { useRef, useMemo } from "react"
import { useFrame } from "@react-three/fiber"
import { type Mesh, Vector3, CatmullRomCurve3, TubeGeometry } from "three"
import type { KnotSettings } from "@/components/knot-visualizer"

interface KnotMeshProps {
  settings: KnotSettings
}

// Parametric equations for different knots
const getKnotPoints = (knotType: string, segments = 200) => {
  const points: Vector3[] = []

  for (let i = 0; i <= segments; i++) {
    const t = (i / segments) * Math.PI * 2
    let x, y, z

    switch (knotType) {
      case "trefoil":
        // Trefoil knot (3,2 torus knot)
        x = Math.sin(t) + 2 * Math.sin(2 * t)
        y = Math.cos(t) - 2 * Math.cos(2 * t)
        z = -Math.sin(3 * t)
        break

      case "figure-eight":
        // Figure-eight knot
        x = (2 + Math.cos(2 * t)) * Math.cos(3 * t)
        y = (2 + Math.cos(2 * t)) * Math.sin(3 * t)
        z = Math.sin(4 * t)
        break

      case "cinquefoil":
        // Cinquefoil knot (5,2 torus knot)
        x = Math.cos(2 * t) * (3 + Math.cos(5 * t))
        y = Math.sin(2 * t) * (3 + Math.cos(5 * t))
        z = Math.sin(5 * t)
        break

      default:
        x = Math.sin(t)
        y = Math.cos(t)
        z = 0
    }

    points.push(new Vector3(x, y, z))
  }

  return points
}

export default function KnotMesh({ settings }: KnotMeshProps) {
  const meshRef = useRef<Mesh>(null)

  // Generate knot geometry
  const geometry = useMemo(() => {
    const points = getKnotPoints(settings.selectedKnot)
    const curve = new CatmullRomCurve3(points, true)
    return new TubeGeometry(curve, 200, 0.15, 16, true)
  }, [settings.selectedKnot])

  // Animation
  useFrame((state, delta) => {
    if (meshRef.current && settings.rotationSpeed > 0) {
      meshRef.current.rotation.y += delta * settings.rotationSpeed
      meshRef.current.rotation.x += delta * settings.rotationSpeed * 0.5
    }
  })

  return (
    <mesh ref={meshRef} geometry={geometry}>
      <meshStandardMaterial color="#8b5cf6" metalness={0.8} roughness={0.2} envMapIntensity={1} />
    </mesh>
  )
}
