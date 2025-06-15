"use client"

import { useEffect, useRef, useState } from "react"

interface SimpleKnotRendererProps {
  settings: any
}

export default function SimpleKnotRenderer({ settings }: SimpleKnotRendererProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number>()
  const [error, setError] = useState<string | null>(null)
  const rotationRef = useRef(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    try {
      const ctx = canvas.getContext("2d")
      if (!ctx) {
        setError("Canvas 2D context not available")
        return
      }

      const resizeCanvas = () => {
        const rect = canvas.getBoundingClientRect()
        canvas.width = rect.width
        canvas.height = rect.height
      }

      resizeCanvas()
      window.addEventListener("resize", resizeCanvas)

      const animate = () => {
        if (!canvas || !ctx) return

        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height)

        const centerX = canvas.width / 2
        const centerY = canvas.height / 2
        const scale = Math.min(canvas.width, canvas.height) * 0.25

        // Update rotation
        if (settings.rotationSpeed > 0) {
          rotationRef.current += 0.02 * settings.rotationSpeed
        }

        // Set up drawing style
        ctx.strokeStyle = "#8b5cf6"
        ctx.lineWidth = 6
        ctx.lineCap = "round"
        ctx.shadowColor = "#8b5cf6"
        ctx.shadowBlur = 15
        ctx.globalAlpha = 0.9

        ctx.beginPath()

        // Generate and draw knot points
        for (let i = 0; i <= 300; i++) {
          const t = (i / 300) * Math.PI * 2
          let x, y, z

          switch (settings.selectedKnot) {
            case "trefoil":
              x = Math.sin(t) + 2 * Math.sin(2 * t)
              y = Math.cos(t) - 2 * Math.cos(2 * t)
              z = -Math.sin(3 * t)
              break
            case "figure-eight":
              x = (2 + Math.cos(2 * t)) * Math.cos(3 * t) * 0.6
              y = (2 + Math.cos(2 * t)) * Math.sin(3 * t) * 0.6
              z = Math.sin(4 * t)
              break
            case "cinquefoil":
              x = Math.cos(2 * t) * (3 + Math.cos(5 * t)) * 0.4
              y = Math.sin(2 * t) * (3 + Math.cos(5 * t)) * 0.4
              z = Math.sin(5 * t)
              break
            case "hopf-link":
              x = Math.cos(t) * (2 + Math.cos(2 * t)) * 0.7
              y = Math.sin(t) * (2 + Math.cos(2 * t)) * 0.7
              z = Math.sin(2 * t)
              break
            case "torus-knot":
              x = Math.cos(2 * t) * (3 + Math.cos(7 * t)) * 0.4
              y = Math.sin(2 * t) * (3 + Math.cos(7 * t)) * 0.4
              z = Math.sin(7 * t)
              break
            default:
              x = Math.sin(t) + 2 * Math.sin(2 * t)
              y = Math.cos(t) - 2 * Math.cos(2 * t)
              z = -Math.sin(3 * t)
          }

          // Simple 3D to 2D projection with rotation
          const cos = Math.cos(rotationRef.current)
          const sin = Math.sin(rotationRef.current)
          const rotatedX = x * cos - z * sin
          const rotatedZ = x * sin + z * cos

          // Project to 2D
          const screenX = centerX + rotatedX * scale
          const screenY = centerY + y * scale

          if (i === 0) {
            ctx.moveTo(screenX, screenY)
          } else {
            ctx.lineTo(screenX, screenY)
          }
        }

        ctx.stroke()
        setError(null)

        animationRef.current = requestAnimationFrame(animate)
      }

      animate()

      return () => {
        window.removeEventListener("resize", resizeCanvas)
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current)
        }
      }
    } catch (err) {
      console.error("Canvas rendering error:", err)
      setError("Failed to render knot")
    }
  }, [settings.selectedKnot, settings.rotationSpeed])

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
    <div className="bg-black/20 backdrop-blur-sm rounded-2xl border border-white/10 h-full overflow-hidden relative">
      <canvas ref={canvasRef} className="w-full h-full" style={{ background: "transparent" }} />
      <div className="absolute bottom-4 left-4 text-white/60 text-sm">2D View - {settings.selectedKnot} knot</div>
    </div>
  )
}
