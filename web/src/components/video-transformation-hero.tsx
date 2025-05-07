"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ArrowRight, Play } from "lucide-react"
import { Button } from "@/components/ui/button"
import TransformationExample from "./transformation-example"

export default function VideoTransformationHero() {
  const [isPlaying, setIsPlaying] = useState(false)

  // Simulated video player state
  useEffect(() => {
    if (isPlaying) {
      const timer = setTimeout(() => {
        setIsPlaying(false)
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [isPlaying])

  return (
    <div className="flex flex-col lg:flex-row items-center gap-12">
      <div className="flex-1 text-center lg:text-left">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight mb-6">
          Transform Your Videos with <span className="text-primary">AI Magic</span>
        </h1>
        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto lg:mx-0">
          Elevate your content with our cutting-edge AI video transformation tool. Apply stunning styles, effects, and transformations powered by the Hunyuan-Video Model.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
          <Link href="/video-to-video" className="w-full sm:w-auto">
            {/* Button to start transforming videos */}
            <Button size="lg" className="gap-2">
              Start Transforming
              <ArrowRight className="h-5 w-5" />
            </Button>
          </Link>
          <Button variant="outline" size="lg" className="gap-2" onClick={() => setIsPlaying(true)}>
            <Play className="h-5 w-5" />
            Watch Demo
          </Button>
        </div>
      </div>
      <div className="flex-1 w-full max-w-xl">
        <div className="relative bg-background rounded-xl overflow-hidden shadow-lg p-4">
          {/* Video Preview */}
          <div className="relative aspect-video mb-4">
            {isPlaying ? (
              <div className="absolute inset-0 flex items-center justify-center text-primary">
                <span className="text-lg font-medium">Demo video playing...</span>
              </div>
            ) : (
              <TransformationExample
                title="Cinematic Style"
                description="A stylish woman walks down a Tokyo street filled with warm glowing neon and animated city signage. She wears a dark blue leather jacket, a long pink dress, and bright yellow boots, and carries a black purse."
                beforeSrc="https://storage.googleapis.com/falserverless/hunyuan_video/hunyuan_v2v_input.mp4"
                afterSrc="https://v3.fal.media/files/kangaroo/y5-1YTGpun17eSeggZMzX_video-1733468228.mp4"
              />
            )}
          </div>

          {/* Text Below Video */}
          
        </div>
      </div>
    </div>
  )
}