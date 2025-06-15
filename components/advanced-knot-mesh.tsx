"use client"

import { useRef, useMemo, useEffect, useState } from "react"
import { useFrame } from "@react-three/fiber"
import type { KnotSettings } from "@/components/advanced-knot-visualizer"

interface AdvancedKnotMeshProps {
  settings: KnotSettings
}

export default function AdvancedKnotMesh({ settings }: AdvancedKnotMeshProps) {
  const meshRef = useRef<any>(null)
  const arrowsRef = useRef<any>(null)
  const [Three, setThree] = useState<any>(null)

  // Dynamically import Three.js to avoid SSR issues
  useEffect(() => {
    import("three").then((THREE) => {
      setThree(THREE)
    })
  }, [])

  // Generate knot geometry with enhanced features
  const { geometry, arrowGeometry } = useMemo(() => {
    if (!Three) {
      return { geometry: null, arrowGeometry: null }
    }

    try {
      const points = generateKnotPoints(settings.selectedKnot, settings.customEquations, Three)
      const curve = new Three.CatmullRomCurve3(points, true)

      // Create tube geometry
      const tubeGeometry = new Three.TubeGeometry(curve, 300, 0.12, 16, true)

      // Create arrow geometry for direction indication
      let arrowGeometry: any = null
      if (settings.showArrows) {
        arrowGeometry = new Three.BufferGeometry()
        const arrowPositions: number[] = []
        const arrowColors: number[] = []

        // Add arrows at regular intervals
        for (let i = 0; i < points.length; i += 20) {
          const point = points[i]
          const nextPoint = points[(i + 1) % points.length]
          const direction = new Three.Vector3().subVectors(nextPoint, point).normalize()

          // Create arrow tip
          const arrowTip = new Three.Vector3().addVectors(point, direction.multiplyScalar(0.3))

          arrowPositions.push(point.x, point.y, point.z)
          arrowPositions.push(arrowTip.x, arrowTip.y, arrowTip.z)

          // Color gradient based on position along curve
          const t = i / points.length
          arrowColors.push(1 - t, 0.5, t, 1 - t, 0.5, t) // RGB for both points
        }

        arrowGeometry.setAttribute("position", new Three.Float32BufferAttribute(arrowPositions, 3))
        arrowGeometry.setAttribute("color", new Three.Float32BufferAttribute(arrowColors, 3))
      }

      return { geometry: tubeGeometry, arrowGeometry }
    } catch (error) {
      console.error("Error generating knot geometry:", error)
      // Fallback to simple circle
      const fallbackPoints = []
      for (let i = 0; i <= 100; i++) {
        const t = (i / 100) * Math.PI * 2
        fallbackPoints.push(new Three.Vector3(Math.cos(t), Math.sin(t), 0))
      }
      const fallbackCurve = new Three.CatmullRomCurve3(fallbackPoints, true)
      return { geometry: new Three.TubeGeometry(fallbackCurve, 100, 0.1, 8, true), arrowGeometry: null }
    }
  }, [settings.selectedKnot, settings.customEquations, settings.showArrows, Three])

  // Animation
  useFrame((state, delta) => {
    if (meshRef.current && settings.rotationSpeed > 0) {
      meshRef.current.rotation.y += delta * settings.rotationSpeed * 0.5
      meshRef.current.rotation.x += delta * settings.rotationSpeed * 0.3
    }

    if (arrowsRef.current && settings.rotationSpeed > 0) {
      arrowsRef.current.rotation.y += delta * settings.rotationSpeed * 0.5
      arrowsRef.current.rotation.x += delta * settings.rotationSpeed * 0.3
    }
  })

  if (!Three || !geometry) {
    return null
  }

  return (
    <group>
      {/* Main knot mesh */}
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

      {/* Direction arrows */}
      {settings.showArrows && arrowGeometry && (
        <lineSegments ref={arrowsRef} geometry={arrowGeometry}>
          <lineBasicMaterial vertexColors={true} linewidth={2} />
        </lineSegments>
      )}

      {/* Crossing indicators */}
      {settings.showCrossings && (
        <group>
          {/* This would contain crossing point indicators */}
          {/* Implementation would require crossing detection algorithm */}
        </group>
      )}
    </group>
  )
}

// Helper function to generate knot points
function generateKnotPoints(knotType: string, customEquations: any, Three: any): any[] {
  const points: any[] = []

  // Parametric equations for predefined knots
  const knotEquations: Record<string, any> = {
    trefoil: {
      x: "sin(t) + 2*sin(2*t)",
      y: "cos(t) - 2*cos(2*t)",
      z: "-sin(3*t)",
    },
    "figure-eight": {
      x: "(2 + cos(2*t)) * cos(3*t)",
      y: "(2 + cos(2*t)) * sin(3*t)",
      z: "sin(4*t)",
    },
    cinquefoil: {
      x: "cos(2*t) * (3 + cos(5*t))",
      y: "sin(2*t) * (3 + cos(5*t))",
      z: "sin(5*t)",
    },
    "hopf-link": {
      x: "cos(t) * (2 + cos(2*t))",
      y: "sin(t) * (2 + cos(2*t))",
      z: "sin(2*t)",
    },
    "torus-knot": {
      x: "cos(2*t) * (3 + cos(7*t))",
      y: "sin(2*t) * (3 + cos(7*t))",
      z: "sin(7*t)",
    },
  }

  // Get equations based on knot type
  let equations: any
  if (knotType === "custom" && customEquations) {
    equations = customEquations
  } else if (knotEquations[knotType]) {
    equations = knotEquations[knotType]
  } else {
    // Fallback to trefoil
    equations = knotEquations.trefoil
  }

  // Generate points along the parametric curve
  for (let i = 0; i <= 400; i++) {
    const t = (i / 400) * Math.PI * 2

    try {
      let x, y, z

      // Simple evaluation for known knots
      switch (knotType) {
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

      // Scale the knot to a reasonable size
      const scale = 1.5
      points.push(new Three.Vector3(x * scale, y * scale, z * scale))
    } catch (error) {
      console.warn(`Error generating point at t=${t}:`, error)
      // Add a fallback point
      points.push(new Three.Vector3(Math.cos(t), Math.sin(t), 0))
    }
  }

  return points
}
