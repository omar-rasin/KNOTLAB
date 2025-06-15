"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import ControlPanel from "@/components/control-panel"
import MathInfoPanel from "@/components/math-info-panel"
import CustomKnotGenerator from "@/components/custom-knot-generator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ErrorBoundary } from "@/components/error-boundary"
import dynamic from "next/dynamic"

// Try to load the 3D renderer, fallback to 2D if it fails
const AdvancedKnotRenderer = dynamic(
  () => import("@/components/advanced-knot-renderer").catch(() => import("@/components/simple-knot-renderer")),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full flex items-center justify-center bg-black/20 backdrop-blur-sm rounded-2xl border border-white/10">
        <div className="text-white text-lg animate-pulse">Loading Visualization...</div>
      </div>
    ),
  },
)

interface AdvancedKnotVisualizerProps {
  onBack: () => void
}

export type KnotType = "trefoil" | "figure-eight" | "cinquefoil" | "hopf-link" | "torus-knot" | "custom"

export interface KnotEquations {
  x: string
  y: string
  z: string
}

export interface KnotSettings {
  selectedKnot: KnotType
  rotationSpeed: number
  showCrossings: boolean
  showArrows: boolean
  showReidemeister: boolean
  customEquations: KnotEquations
  animateReidemeister: boolean
}

export default function AdvancedKnotVisualizer({ onBack }: AdvancedKnotVisualizerProps) {
  const [settings, setSettings] = useState<KnotSettings>({
    selectedKnot: "trefoil",
    rotationSpeed: 1,
    showCrossings: true,
    showArrows: false,
    showReidemeister: false,
    customEquations: {
      x: "sin(t) + 2*sin(2*t)",
      y: "cos(t) - 2*cos(2*t)",
      z: "-sin(3*t)",
    },
    animateReidemeister: false,
  })

  const updateSettings = (newSettings: Partial<KnotSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }))
  }

  return (
    <div className="min-h-screen p-4 md:p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <Button onClick={onBack} variant="ghost" className="text-white/80 hover:text-white hover:bg-white/10">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Button>
        <h1 className="text-2xl md:text-3xl font-serif font-bold text-white">KnotLab</h1>
        <div className="w-32"></div>
      </div>

      {/* Main content */}
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 h-[calc(100vh-120px)]">
        {/* Left Panel - Controls and Math Info */}
        <div className="xl:col-span-1 space-y-4">
          <Tabs defaultValue="controls" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-black/30 border-white/20">
              <TabsTrigger value="controls" className="text-white data-[state=active]:bg-white/20">
                Controls
              </TabsTrigger>
              <TabsTrigger value="math" className="text-white data-[state=active]:bg-white/20">
                Math Info
              </TabsTrigger>
            </TabsList>
            <TabsContent value="controls" className="mt-4">
              <ControlPanel settings={settings} onSettingsChange={updateSettings} />
            </TabsContent>
            <TabsContent value="math" className="mt-4">
              <MathInfoPanel settings={settings} />
            </TabsContent>
          </Tabs>
        </div>

        {/* Center - 3D Visualization */}
        <div className="xl:col-span-2">
          <ErrorBoundary>
            <AdvancedKnotRenderer settings={settings} />
          </ErrorBoundary>
        </div>

        {/* Right Panel - Custom Generator */}
        <div className="xl:col-span-1">
          <CustomKnotGenerator settings={settings} onSettingsChange={updateSettings} />
        </div>
      </div>
    </div>
  )
}
