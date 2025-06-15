"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calculator, Info } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import type { KnotSettings } from "@/components/advanced-knot-visualizer"
import { calculateKnotInvariants } from "@/lib/knot-math"

interface MathInfoPanelProps {
  settings: KnotSettings
}

export default function MathInfoPanel({ settings }: MathInfoPanelProps) {
  const invariants = calculateKnotInvariants(settings.selectedKnot, settings.customEquations)

  return (
    <Card className="bg-black/30 backdrop-blur-sm border-white/20 text-white h-full">
      <CardHeader>
        <CardTitle className="text-lg font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent flex items-center gap-2">
          <Calculator className="h-5 w-5" />
          Mathematical Analysis
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Knot Invariants */}
        <div className="space-y-4">
          <h3 className="text-sm font-medium text-white/90">Knot Invariants</h3>

          {/* Crossing Number */}
          <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/10">
            <div className="flex items-center gap-2">
              <span className="text-sm text-white/80">Crossing Number</span>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <Info className="h-4 w-4 text-white/60" />
                  </TooltipTrigger>
                  <TooltipContent className="bg-slate-800 border-white/20 text-white max-w-xs">
                    <p>The minimum number of crossings in any diagram of the knot.</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <Badge variant="secondary" className="bg-cyan-500/20 text-cyan-300">
              {invariants.crossingNumber}
            </Badge>
          </div>

          {/* Writhe Number */}
          <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/10">
            <div className="flex items-center gap-2">
              <span className="text-sm text-white/80">Writhe Number</span>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <Info className="h-4 w-4 text-white/60" />
                  </TooltipTrigger>
                  <TooltipContent className="bg-slate-800 border-white/20 text-white max-w-xs">
                    <p>A measure of the overall twist of the knot in 3D space.</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <Badge variant="secondary" className="bg-purple-500/20 text-purple-300">
              {invariants.writhe.toFixed(2)}
            </Badge>
          </div>

          {/* Genus */}
          <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/10">
            <div className="flex items-center gap-2">
              <span className="text-sm text-white/80">Genus</span>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <Info className="h-4 w-4 text-white/60" />
                  </TooltipTrigger>
                  <TooltipContent className="bg-slate-800 border-white/20 text-white max-w-xs">
                    <p>The minimum genus of any Seifert surface for the knot.</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <Badge variant="secondary" className="bg-magenta-500/20 text-magenta-300">
              {invariants.genus}
            </Badge>
          </div>
        </div>

        {/* Alexander Polynomial */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-medium text-white/90">Alexander Polynomial</h3>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Info className="h-4 w-4 text-white/60" />
                </TooltipTrigger>
                <TooltipContent className="bg-slate-800 border-white/20 text-white max-w-xs">
                  <p>A polynomial invariant that helps distinguish different knots.</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <div className="p-3 bg-black/30 rounded-lg border border-white/10 font-mono text-sm">
            <div className="text-cyan-400">Δ(t) = {invariants.alexanderPolynomial}</div>
          </div>
        </div>

        {/* Jones Polynomial */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-medium text-white/90">Jones Polynomial</h3>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Info className="h-4 w-4 text-white/60" />
                </TooltipTrigger>
                <TooltipContent className="bg-slate-800 border-white/20 text-white max-w-xs">
                  <p>A more powerful polynomial invariant discovered by Vaughan Jones.</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <div className="p-3 bg-black/30 rounded-lg border border-white/10 font-mono text-sm">
            <div className="text-purple-400">V(q) = {invariants.jonesPolynomial}</div>
          </div>
        </div>

        {/* Computational Notes */}
        <div className="p-3 bg-yellow-500/10 rounded-lg border border-yellow-500/20">
          <h4 className="text-sm font-medium text-yellow-400 mb-2">Computational Notes</h4>
          <ul className="text-xs text-white/70 space-y-1">
            <li>• Invariants computed using discrete approximations</li>
            <li>• Polynomials shown for known knots only</li>
            <li>• Custom knots show estimated values</li>
          </ul>
        </div>

        {/* Reidemeister Moves */}
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-white/90">Reidemeister Moves</h3>
          <div className="grid grid-cols-3 gap-2">
            <Button variant="outline" size="sm" className="bg-white/5 border-white/20 text-white hover:bg-white/10">
              Move I
            </Button>
            <Button variant="outline" size="sm" className="bg-white/5 border-white/20 text-white hover:bg-white/10">
              Move II
            </Button>
            <Button variant="outline" size="sm" className="bg-white/5 border-white/20 text-white hover:bg-white/10">
              Move III
            </Button>
          </div>
          <p className="text-xs text-white/60">
            Click to animate the three fundamental moves that preserve knot equivalence.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
