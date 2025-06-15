"use client"

import { useState } from "react"
import Hero from "@/components/hero"
import dynamic from "next/dynamic"

// Completely disable SSR for the visualizer
const AdvancedKnotVisualizer = dynamic(() => import("@/components/advanced-knot-visualizer"), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="text-white text-xl animate-pulse">Loading KnotLab...</div>
    </div>
  ),
})

export default function Page() {
  const [showVisualizer, setShowVisualizer] = useState(false)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {!showVisualizer ? (
        <Hero onStartExploring={() => setShowVisualizer(true)} />
      ) : (
        <AdvancedKnotVisualizer onBack={() => setShowVisualizer(false)} />
      )}
    </div>
  )
}
