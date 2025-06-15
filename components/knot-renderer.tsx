"use client"

import { Canvas } from "@react-three/fiber"
import { OrbitControls, Environment } from "@react-three/drei"
import { Suspense } from "react"
import KnotMesh from "@/components/knot-mesh"
import type { KnotSettings } from "@/components/knot-visualizer"

interface KnotRendererProps {
  settings: KnotSettings
}

export default function KnotRenderer({ settings }: KnotRendererProps) {
  return (
    <Canvas camera={{ position: [0, 0, 8], fov: 50 }} className="w-full h-full">
      <Suspense fallback={null}>
        {/* Lighting */}
        <ambientLight intensity={0.4} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <pointLight position={[-10, -10, -10]} intensity={0.5} />

        {/* Environment for reflections */}
        <Environment preset="night" />

        {/* Knot */}
        <KnotMesh settings={settings} />

        {/* Controls */}
        <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} minDistance={3} maxDistance={15} />
      </Suspense>
    </Canvas>
  )
}
