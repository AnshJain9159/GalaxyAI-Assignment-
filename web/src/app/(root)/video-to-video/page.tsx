/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"
import React, { useState, useEffect } from 'react'
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"
import { FileUploaderRegular } from "@uploadcare/react-uploader/next"
import "@uploadcare/react-uploader/core.css"
import { ImageKitProvider, Video as IKVideo } from "@imagekit/next"
import { ArrowLeft, Upload, Wand2, Info } from 'lucide-react'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

const pubKey = process.env.NEXT_PUBLIC_UPLOADCARE_PUBLIC_KEY

export default function TransformPage() {
  const imagekitUrl = process.env.NEXT_PUBLIC_IMAGEKIT_URL
  const [form, setForm] = useState({
    prompt: "",
    num_inference_steps: 30,
    aspect_ratio: "16:9",
    resolution: "720p",
    num_frames: 129,
    strength: 0.85,
    seed: "",
    pro_mode: false,
    enable_safety_checker: true
  })

  const [files, setFiles] = useState<any[]>([])
  const [cloudinaryUrl, setCloudinaryUrl] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [generatedVideoUrl, setGeneratedVideoUrl] = useState<string | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [jobId, setJobId] = useState<string | null>(null)

  const handleChange = (name: string, value: unknown) => {
    setForm(prev => ({ ...prev, [name]: value }))
  }

  // Poll for job status if jobId is set
  useEffect(() => {
    if (!jobId) return;
    let interval: NodeJS.Timeout;

    const pollStatus = async () => {
      try {
        const res = await fetch(`/api/job-status?jobId=${jobId}`);
        const data = await res.json();
        if (data.status === "completed" && data.output?.video_url) {
          setGeneratedVideoUrl(data.output.video_url);
          setIsGenerating(false);
          clearInterval(interval);
        }
      } catch (err) {
        // Optionally handle error
      }
    };

    interval = setInterval(pollStatus, 5000); // Poll every 5 seconds

    return () => clearInterval(interval);
  }, [jobId]);

  // Uploadcare file upload handler
  const handleChangeEvent = async (e: any) => {
    const successfulFiles = e.allEntries.filter((file: any) => file.status === "success")
    setFiles(successfulFiles)

    if (successfulFiles.length > 0) {
      const cdnUrl = successfulFiles[0].cdnUrl
      setUploading(true)
      setError(null)
      setCloudinaryUrl(null)

      try {
        const res = await fetch("/api/upload-to-cloudinary", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ cdnUrl }),
        })
        const data = await res.json()
        if (res.ok) {
          setCloudinaryUrl(data.url)
        } else {
          setError(data.error || "Cloudinary upload failed")
        }
      } catch (err: any) {
        setError(err.message || "Cloudinary upload failed")
      } finally {
        setUploading(false)
      }
    }
  }

  const handleUploadFailed = (e: any) => {
    setError(e.errors[0])
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsGenerating(true)

    if (!cloudinaryUrl) {
      setError("Please upload a video first.")
      setIsGenerating(false)
      return
    }

    try {
      const res = await fetch("/api/generate-fal-video", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          video_url: cloudinaryUrl,
        }),
      })
      const data = await res.json()
      if (res.ok && data.jobId) {
        setJobId(data.jobId);
        setGeneratedVideoUrl(null); // Clear previous video
      } else {
        setError(data.error || "Fal video generation failed");
        setIsGenerating(false);
      }
    } catch (err: any) {
      setError(err.message || "Fal video generation failed");
      setIsGenerating(false);
    }
  }

  return (
    <ImageKitProvider urlEndpoint={imagekitUrl!}>
      <div className="min-h-screen bg-background">
        <div className="container max-w-7xl mx-auto py-8 md:py-12 px-4 sm:px-6 lg:px-8">
          {/* Add page title */}
          <div className="flex items-center justify-center gap-3 mb-8">
            <Wand2 className="h-6 w-6 text-primary" />
            <h1 className="text-2xl font-bold text-center">Video Transformation</h1>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
            <div>
              <Card className="border border-border/50 bg-background/50 backdrop-blur-sm shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Wand2 className="h-5 w-5 text-primary" />
                    Video Transformation
                  </CardTitle>
                  <CardDescription>
                    Upload a video and set parameters to transform it using AI
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="space-y-2">
                      <Label htmlFor="prompt" className="flex items-center gap-1">
                        Prompt
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Info className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p className="max-w-xs">Describe the style or transformation you want to apply to your video</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </Label>
                      <Input
                        id="prompt"
                        name="prompt"
                        type="text"
                        placeholder="E.g., 'Convert to anime style' or 'Make it look cinematic'"
                        value={form.prompt}
                        onChange={(e) => handleChange("prompt", e.target.value)}
                        required
                        className="border-border/50 focus:border-primary/50"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="flex items-center gap-1">
                        Upload Video
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Info className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p className="max-w-xs">Upload a video file (MP4, MOV, etc.) to transform</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </Label>
                      <div className="border border-border/50 rounded-md p-4 bg-background">
                        <FileUploaderRegular
                          onFileUploadFailed={handleUploadFailed}
                          pubkey={pubKey}
                          onChange={handleChangeEvent}
                        />
                        {uploading && <div className="text-sm text-primary mt-2 flex items-center gap-2">
                          <Upload className="h-4 w-4 animate-pulse" />
                          Uploading to Cloudinary...
                        </div>}
                        {cloudinaryUrl && (
                          <div className="text-sm text-green-600 dark:text-green-400 mt-2 break-all">
                            ✓ Video uploaded successfully!
                          </div>
                        )}
                        {error && <div className="text-sm text-red-600 dark:text-red-400 mt-2">{error}</div>}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="aspect_ratio" className="flex items-center gap-1">
                          Aspect Ratio
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Info className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>The width-to-height ratio of the output video</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </Label>
                        <Select value={form.aspect_ratio} onValueChange={(value) => handleChange("aspect_ratio", value)}>
                          <SelectTrigger className="border-border/50 focus:border-primary/50">
                            <SelectValue placeholder="Select aspect ratio" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="16:9">16:9 (Landscape)</SelectItem>
                            <SelectItem value="9:16">9:16 (Portrait)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="resolution" className="flex items-center gap-1">
                          Resolution
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Info className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>The quality of the output video</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </Label>
                        <Select value={form.resolution} onValueChange={(value) => handleChange("resolution", value)}>
                          <SelectTrigger className="border-border/50 focus:border-primary/50">
                            <SelectValue placeholder="Select resolution" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="480p">480p (SD)</SelectItem>
                            <SelectItem value="580p">580p (Medium)</SelectItem>
                            <SelectItem value="720p">720p (HD)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="num_frames" className="flex items-center gap-1">
                          Number of Frames
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Info className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>The number of frames to process in the video</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </Label>
                        <Select value={form.num_frames.toString()} onValueChange={(value) => handleChange("num_frames", parseInt(value))}>
                          <SelectTrigger className="border-border/50 focus:border-primary/50">
                            <SelectValue placeholder="Select number of frames" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="85">85 (Faster)</SelectItem>
                            <SelectItem value="129">129 (Better quality)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="seed" className="flex items-center gap-1">
                          Seed (Optional)
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Info className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Set a specific seed for reproducible results</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </Label>
                        <Input
                          id="seed"
                          name="seed"
                          type="number"
                          placeholder="Enter seed for reproducibility"
                          value={form.seed}
                          onChange={(e) => handleChange("seed", e.target.value)}
                          className="border-border/50 focus:border-primary/50"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label className="flex items-center gap-1">
                        Transformation Strength: {form.strength.toFixed(2)}
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Info className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>How strongly to apply the transformation (0-1)</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </Label>
                      <Slider
                        value={[form.strength]}
                        onValueChange={([value]) => handleChange("strength", value)}
                        min={0}
                        max={1}
                        step={0.01}
                        className="py-2"
                      />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>Subtle</span>
                        <span>Strong</span>
                      </div>
                    </div>

                    <div className="space-y-4 pt-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="pro_mode"
                          checked={form.pro_mode}
                          onCheckedChange={(checked) => handleChange("pro_mode", checked)}
                        />
                        <Label htmlFor="pro_mode" className="flex items-center gap-1">
                          Pro Mode (55 steps, higher quality)
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Info className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Uses more inference steps for higher quality but slower processing</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </Label>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="enable_safety_checker"
                          checked={form.enable_safety_checker}
                          onCheckedChange={(checked) => handleChange("enable_safety_checker", checked)}
                        />
                        <Label htmlFor="enable_safety_checker" className="flex items-center gap-1">
                          Enable Safety Checker
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Info className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Filters inappropriate content from generated videos</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </Label>
                      </div>
                    </div>

                    <Button 
                      type="submit" 
                      className="w-full gap-2" 
                      disabled={isGenerating || !cloudinaryUrl}
                    >
                      {isGenerating ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Generating Video...
                        </>
                      ) : (
                        <>
                          <Wand2 className="h-4 w-4" />
                          Generate Video
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>

            <div>
              <Card className="border border-border/50 bg-background/50 backdrop-blur-sm shadow-lg h-full">
                <CardHeader>
                  <CardTitle>Preview</CardTitle>
                  <CardDescription>
                    Your transformed video will appear here
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col items-center justify-center h-full">
                  {generatedVideoUrl ? (
                    <div className="w-full">
                      <div className="aspect-video relative rounded-lg overflow-hidden border border-primary/20 mb-4">
                        <IKVideo
                          urlEndpoint={imagekitUrl!}
                          src={generatedVideoUrl}
                          controls
                          className="w-full h-full"
                        />
                      </div>
                      <div className="bg-muted/30 p-3 rounded-md">
                        <h4 className="text-sm font-medium mb-1">Video URL:</h4>
                        <div className="text-xs break-all text-muted-foreground">{generatedVideoUrl}</div>
                      </div>
                      <div className="mt-4 flex justify-center">
                        <Button variant="outline" size="sm" asChild>
                          <a href={generatedVideoUrl} target="_blank" rel="noopener noreferrer">
                            Open in New Tab
                          </a>
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-12 px-4">
                      <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                        <Wand2 className="h-10 w-10 text-primary/50" />
                      </div>
                      <h3 className="text-lg font-medium mb-2">No Video Generated Yet</h3>
                      <p className="text-muted-foreground max-w-md mx-auto">
                        Upload a video and set your transformation parameters, then click &quot;Generate Video&quot; to see the result here.
                      </p>
                    </div>
                  )}
                  {error && (
                    <div className="mt-4 p-3 bg-red-100 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md text-red-800 dark:text-red-400 text-sm">
                      {error}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </ImageKitProvider>
  )
}
