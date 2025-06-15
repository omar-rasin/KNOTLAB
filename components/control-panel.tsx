"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import type { KnotSettings, KnotType } from "@/components/advanced-knot-visualizer"

interface ControlPanelProps {
  settings: KnotSettings
  onSettingsChange: (settings: Partial<KnotSettings>) => void
}

const knotData = {
  trefoil: {
    name: "Trefoil Knot",
    equations: {
      x: "sin(t) + 2*sin(2*t)",
      y: "cos(t) - 2*cos(2*t)",
      z: "-sin(3*t)",
    },
    description: "The simplest non-trivial knot. A (3,2) torus knot with crossing number 3.",
    crossingNumber: 3,
    genus: 1,
  },
  "figure-eight": {
    name: "Figure-Eight Knot",
    equations: {
      x: "(2 + cos(2*t)) * cos(3*t)",
      y: "(2 + cos(2*t)) * sin(3*t)",
      z: "sin(4*t)",
    },
    description: "A prime knot with crossing number 4. The most studied knot in mathematics.",
    crossingNumber: 4,
    genus: 1,
  },
  cinquefoil: {
    name: "Cinquefoil Knot",
    equations: {
      x: "cos(2*t) * (3 + cos(5*t))",
      y: "sin(2*t) * (3 + cos(5*t))",
      z: "sin(5*t)",
    },
    description: "A (5,2) torus knot with 5 crossings. Also known as the pentafoil knot.",
    crossingNumber: 5,
    genus: 2,
  },
  "hopf-link": {
    name: "Hopf Link",
    equations: {
      x: "cos(t) * (2 + cos(2*t))",
      y: "sin(t) * (2 + cos(2*t))",
      z: "sin(2*t)",
    },
    description: "The simplest non-trivial link with two components.",
    crossingNumber: 2,
    genus: 0,
  },
  "torus-knot": {
    name: "Torus Knot (7,2)",
    equations: {
      x: "cos(2*t) * (3 + cos(7*t))",
      y: "sin(2*t) * (3 + cos(7*t))",
      z: "sin(7*t)",
    },
    description: "A (7,2) torus knot with 7 crossings.",
    crossingNumber: 7,
    genus: 3,
  },
}

export default function ControlPanel({ settings, onSettingsChange }: ControlPanelProps) {
  const currentKnot = knotData[settings.selectedKnot as keyof typeof knotData]

  return (
    <Card className="bg-black/30 backdrop-blur-sm border-white/20 text-white h-full">
      <CardHeader>
        <CardTitle className="text-lg font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
          Knot Controls
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Knot Selection */}
        <div className="space-y-3">
          <Label className="text-sm font-medium text-white/90">Select Knot</Label>
          <Select
            value={settings.selectedKnot}
            onValueChange={(value: KnotType) => onSettingsChange({ selectedKnot: value })}
          >
            <SelectTrigger className="bg-white/10 border-white/20 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-slate-800 border-white/20">
              {Object.entries(knotData).map(([key, knot]) => (
                <SelectItem key={key} value={key} className="text-white hover:bg-white/10">
                  {knot.name}
                </SelectItem>
              ))}
              <SelectItem value="custom" className="text-white hover:bg-white/10">
                Custom Knot
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Knot Info */}
        {currentKnot && (
          <div className="p-4 bg-white/5 rounded-lg border border-white/10 space-y-3">
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="bg-cyan-500/20 text-cyan-300">
                Crossing: {currentKnot.crossingNumber}
              </Badge>
              <Badge variant="secondary" className="bg-purple-500/20 text-purple-300">
                Genus: {currentKnot.genus}
              </Badge>
            </div>
            <p className="text-sm text-white/80 leading-relaxed">{currentKnot.description}</p>

            {/* Parametric Equations */}
            <div className="space-y-2">
              <Label className="text-xs font-medium text-cyan-400">Parametric Equations:</Label>
              <div className="font-mono text-xs space-y-1 bg-black/30 p-3 rounded border border-white/10">
                <div>x(t) = {currentKnot.equations.x}</div>
                <div>y(t) = {currentKnot.equations.y}</div>
                <div>z(t) = {currentKnot.equations.z}</div>
                <div className="text-white/60">where t ∈ [0, 2π]</div>
              </div>
            </div>
          </div>
        )}

        {/* Rotation Speed */}
        <div className="space-y-3">
          <Label className="text-sm font-medium text-white/90">
            Rotation Speed: {settings.rotationSpeed.toFixed(1)}x
          </Label>
          <Slider
            value={[settings.rotationSpeed]}
            onValueChange={([value]) => onSettingsChange({ rotationSpeed: value })}
            min={0}
            max={3}
            step={0.1}
            className="w-full"
          />
        </div>

        {/* Display Options */}
        <div className="space-y-4">
          <h3 className="text-sm font-medium text-white/90">Display Options</h3>

          <div className="flex items-center justify-between">
            <Label htmlFor="crossings" className="text-sm text-white/80">
              Show Crossings
            </Label>
            <Switch
              id="crossings"
              checked={settings.showCrossings}
              onCheckedChange={(checked) => onSettingsChange({ showCrossings: checked })}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="arrows" className="text-sm text-white/80">
              Direction Arrows
            </Label>
            <Switch
              id="arrows"
              checked={settings.showArrows}
              onCheckedChange={(checked) => onSettingsChange({ showArrows: checked })}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="reidemeister" className="text-sm text-white/80">
              Reidemeister Moves
            </Label>
            <Switch
              id="reidemeister"
              checked={settings.showReidemeister}
              onCheckedChange={(checked) => onSettingsChange({ showReidemeister: checked })}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
