"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, CheckCircle, Code } from "lucide-react"
import type { KnotSettings, KnotEquations } from "@/components/advanced-knot-visualizer"
import { validateKnotEquations } from "@/lib/knot-validation"

interface CustomKnotGeneratorProps {
  settings: KnotSettings
  onSettingsChange: (settings: Partial<KnotSettings>) => void
}

export default function CustomKnotGenerator({ settings, onSettingsChange }: CustomKnotGeneratorProps) {
  const [tempEquations, setTempEquations] = useState<KnotEquations>(settings.customEquations)
  const [validation, setValidation] = useState<{ isValid: boolean; errors: string[] }>({ isValid: true, errors: [] })

  const handleEquationChange = (axis: keyof KnotEquations, value: string) => {
    const newEquations = { ...tempEquations, [axis]: value }
    setTempEquations(newEquations)

    // Validate equations
    const validationResult = validateKnotEquations(newEquations)
    setValidation(validationResult)
  }

  const applyCustomKnot = () => {
    if (validation.isValid) {
      onSettingsChange({
        customEquations: tempEquations,
        selectedKnot: "custom",
      })
    }
  }

  const loadPreset = (preset: string) => {
    const presets: Record<string, KnotEquations> = {
      spiral: {
        x: "t * cos(t)",
        y: "t * sin(t)",
        z: "t",
      },
      helix: {
        x: "cos(t)",
        y: "sin(t)",
        z: "t / 3",
      },
      lissajous: {
        x: "sin(3*t)",
        y: "sin(2*t)",
        z: "sin(5*t)",
      },
    }

    if (presets[preset]) {
      setTempEquations(presets[preset])
      const validationResult = validateKnotEquations(presets[preset])
      setValidation(validationResult)
    }
  }

  return (
    <Card className="bg-black/30 backdrop-blur-sm border-white/20 text-white h-full">
      <CardHeader>
        <CardTitle className="text-lg font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent flex items-center gap-2">
          <Code className="h-5 w-5" />
          Custom Knot Generator
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Equation Inputs */}
        <div className="space-y-4">
          <Label className="text-sm font-medium text-white/90">Parametric Equations</Label>

          <div className="space-y-3">
            <div>
              <Label htmlFor="x-eq" className="text-xs text-white/70 mb-1 block">
                x(t) =
              </Label>
              <Input
                id="x-eq"
                value={tempEquations.x}
                onChange={(e) => handleEquationChange("x", e.target.value)}
                className="bg-white/10 border-white/20 text-white font-mono text-sm"
                placeholder="sin(t) + 2*sin(2*t)"
              />
            </div>

            <div>
              <Label htmlFor="y-eq" className="text-xs text-white/70 mb-1 block">
                y(t) =
              </Label>
              <Input
                id="y-eq"
                value={tempEquations.y}
                onChange={(e) => handleEquationChange("y", e.target.value)}
                className="bg-white/10 border-white/20 text-white font-mono text-sm"
                placeholder="cos(t) - 2*cos(2*t)"
              />
            </div>

            <div>
              <Label htmlFor="z-eq" className="text-xs text-white/70 mb-1 block">
                z(t) =
              </Label>
              <Input
                id="z-eq"
                value={tempEquations.z}
                onChange={(e) => handleEquationChange("z", e.target.value)}
                className="bg-white/10 border-white/20 text-white font-mono text-sm"
                placeholder="-sin(3*t)"
              />
            </div>
          </div>

          <div className="text-xs text-white/60">
            <p>Use standard JavaScript math functions: sin, cos, tan, sqrt, pow, abs, etc.</p>
            <p>Variable 't' ranges from 0 to 2π</p>
          </div>
        </div>

        {/* Validation Status */}
        <div className="space-y-2">
          {validation.isValid ? (
            <div className="flex items-center gap-2 text-green-400">
              <CheckCircle className="h-4 w-4" />
              <span className="text-sm">Equations are valid</span>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-red-400">
                <AlertTriangle className="h-4 w-4" />
                <span className="text-sm">Invalid equations</span>
              </div>
              <div className="space-y-1">
                {validation.errors.map((error, index) => (
                  <Badge key={index} variant="destructive" className="text-xs">
                    {error}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Apply Button */}
        <Button
          onClick={applyCustomKnot}
          disabled={!validation.isValid}
          className="w-full bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 disabled:opacity-50"
        >
          Apply Custom Knot
        </Button>

        {/* Preset Examples */}
        <div className="space-y-3">
          <Label className="text-sm font-medium text-white/90">Quick Presets</Label>
          <div className="grid grid-cols-1 gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => loadPreset("spiral")}
              className="bg-white/5 border-white/20 text-white hover:bg-white/10 justify-start"
            >
              Spiral Curve
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => loadPreset("helix")}
              className="bg-white/5 border-white/20 text-white hover:bg-white/10 justify-start"
            >
              Helix
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => loadPreset("lissajous")}
              className="bg-white/5 border-white/20 text-white hover:bg-white/10 justify-start"
            >
              Lissajous Curve
            </Button>
          </div>
        </div>

        {/* Mathematical Tips */}
        <div className="p-3 bg-blue-500/10 rounded-lg border border-blue-500/20">
          <h4 className="text-sm font-medium text-blue-400 mb-2">Tips for Creating Knots</h4>
          <ul className="text-xs text-white/70 space-y-1">
            <li>• Use periodic functions for closed curves</li>
            <li>• Combine different frequencies for complexity</li>
            <li>• Ensure the curve closes: f(0) = f(2π)</li>
            <li>• Avoid self-intersections for true knots</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}
