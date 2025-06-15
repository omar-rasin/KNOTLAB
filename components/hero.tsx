"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

interface HeroProps {
  onStartExploring: () => void
}

export default function Hero({ onStartExploring }: HeroProps) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-magenta-500/5 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      {/* Main content */}
      <div className="text-center z-10 px-4">
        <h1 className="text-6xl md:text-8xl font-serif font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-magenta-400 bg-clip-text text-transparent mb-4 animate-fade-in drop-shadow-2xl">
          KnotLab
        </h1>
        <h2 className="text-2xl md:text-3xl font-serif font-light text-white/80 mb-12 animate-fade-in delay-300">
          Knot Theory Visualizer
        </h2>

        <Button
          onClick={onStartExploring}
          size="lg"
          className="bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 text-white font-semibold px-12 py-6 text-xl rounded-full shadow-2xl hover:shadow-cyan-500/25 transition-all duration-300 transform hover:scale-105 animate-fade-in delay-500"
        >
          Start Exploring
          <ArrowRight className="ml-3 h-6 w-6" />
        </Button>
      </div>

      {/* Footer */}
      <div className="absolute bottom-8 text-center z-10">
        <p className="text-white/60 text-sm font-light">Developed by Muhammad Omar Rasin</p>
      </div>
    </div>
  )
}
