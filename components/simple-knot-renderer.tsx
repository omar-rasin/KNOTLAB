"use client"

import { useEffect, useRef, useState } from "react"

interface SimpleKnotRendererProps {
  settings: any
}

export default function SimpleKnotRenderer({ settings }: SimpleKnotRendererProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    try {
      const ctx = canvas.getContext("2d")
      if (!ctx) {
        setError("Canvas 2D context not available")
        return
      }

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Set canvas size
      canvas.width = canvas.offsetWidth
      canvas.height = canvas.offsetHeight

      // Draw a simple 2D projection of the knot
      const centerX = canvas.width / 2
      const centerY = canvas.height / 2
      const scale = Math.min(canvas.width, canvas.height) * 0.3

      ctx.strokeStyle = "#8b5cf6"
      ctx.lineWidth = 8
      ctx.lineCap = "round"
      ctx.shadowColor = "#8b5cf6"
      ctx.shadowBlur = 10

      ctx.beginPath()

      // Generate knot points
      for (let i = 0; i <= 200; i++) {
        const t = (i / 200) * Math.PI * 2
        let x, y

        switch (settings.selectedKnot) {
          case "trefoil":
            x = Math.sin(t) + 2 * Math.sin(2 * t)
            y = Math.cos(t) - 2 * Math.cos(2 * t)
            break
          case "figure-eight":
            x = (2 + Math.cos(2 * t)) * Math.cos(3 * t) * 0.5
            y = (2 + Math.cos(2 * t)) * Math.sin(3 * t) * 0.5
            break
          case "cinquefoil":
            x = Math.cos(2 * t) * (3 + Math.cos(5 * t)) * 0.3
            y = Math.sin(2 * t) * (3 + Math.cos(5 * t)) * 0.3
            break
          default:
            x = Math.sin(t) + 2 * Math.sin(2 * t)
            y = Math.cos(t) - 2 * Math.cos(2 * t)
        }

        const screenX = centerX + x * scale
        const screenY = centerY + y * scale

        if (i === 0) {
          ctx.moveTo(screenX, screenY)
        } else {
          ctx.lineTo(screenX, screenY)
        }
      }

      ctx.stroke()
      setError(null)
    } catch (err) {
      console.error("Canvas rendering error:", err)
      setError("Failed to render knot")
    }
  }, [settings.selectedKnot])

  if (error) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-black/20 backdrop-blur-sm rounded-2xl border border-white/10">
        <div className="text-red-400 text-center">
          <p className="text-lg mb-2">Rendering Error</p>
          <p className="text-sm opacity-70">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-black/20 backdrop-blur-sm rounded-2xl border border-white/10 h-full overflow-hidden">
      <canvas ref={canvasRef} className="w-full h-full" style={{ background: "transparent" }} />
      <div className="absolute bottom-4 left-4 text-white/60 text-sm">2D Projection - {settings.selectedKnot} knot</div>
    </div>
  )
}
