"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import ControlPanel from "@/components/control-panel"
import KnotRenderer from "@/components/knot-renderer"

interface KnotVisualizerProps {
  onBack: () => void
}

export type KnotType = "trefoil" | "figure-eight" | "cinquefoil"

export interface KnotSettings {
  selectedKnot: KnotType
  rotationSpeed: number
  showCrossings: boolean
  showArrows: boolean
}

export default function KnotVisualizer({ onBack }: KnotVisualizerProps) {
  const [settings, setSettings] = useState<KnotSettings>({
    selectedKnot: "trefoil",
    rotationSpeed: 1,
    showCrossings: true,
    showArrows: false,
  })

  const updateSettings = (newSettings: Partial<KnotSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }))
  }

  return (
    <div className="min-h-screen p-4 md:p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <Button onClick={onBack} variant="ghost" className="text-white/80 hover:text-white hover:bg-white/10">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Button>
        <h1 className="text-2xl md:text-3xl font-bold text-white">Knot Theory Visualizer</h1>
        <div className="w-24"></div> {/* Spacer for centering */}
      </div>

      {/* Main content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-[calc(100vh-120px)]">
        {/* Control Panel */}
        <div className="lg:col-span-1">
          <ControlPanel settings={settings} onSettingsChange={updateSettings} />
        </div>

        {/* 3D Visualization */}
        <div className="lg:col-span-2">
          <div className="bg-black/20 backdrop-blur-sm rounded-2xl border border-white/10 h-full overflow-hidden">
            <KnotRenderer settings={settings} />
          </div>
        </div>
      </div>
    </div>
  )
}
