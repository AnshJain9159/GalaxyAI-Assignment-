/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"
import React, { useState } from 'react'
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
import { Card } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"
import { FileUploaderRegular } from "@uploadcare/react-uploader/next";
import "@uploadcare/react-uploader/core.css";
import { ImageKitProvider, Video as IKVideo } from "@imagekit/next";

const pubKey = process.env.NEXT_PUBLIC_UPLOADCARE_PUBLIC_KEY;
const imagekitUrl = process.env.NEXT_IMAGEKIT_URL;

function Page() {
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

  const [files, setFiles] = useState<any[]>([]);
  const [cloudinaryUrl, setCloudinaryUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [generatedVideoUrl, setGeneratedVideoUrl] = useState<string | null>(null);

  const handleChange = (name: string, value: unknown) => {
    setForm(prev => ({ ...prev, [name]: value }))
  }

  // Uploadcare file upload handler
  const handleChangeEvent = async (e: any) => {
    const successfulFiles = e.allEntries.filter((file: any) => file.status === "success");
    setFiles(successfulFiles);

    if (successfulFiles.length > 0) {
      const cdnUrl = successfulFiles[0].cdnUrl;
      setUploading(true);
      setError(null);
      setCloudinaryUrl(null);

      try {
        const res = await fetch("/api/upload-to-cloudinary", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ cdnUrl }),
        });
        const data = await res.json();
        if (res.ok) {
          setCloudinaryUrl(data.url);
        } else {
          setError(data.error || "Cloudinary upload failed");
        }
      } catch (err: any) {
        setError(err.message || "Cloudinary upload failed");
      } finally {
        setUploading(false);
      }
    }
  };

  const handleUploadFailed = (e: any) => {
    setError(e.errors[0]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!cloudinaryUrl) {
      setError("Please upload a video first.");
      return;
    }

    try {
      const res = await fetch("/api/generate-fal-video", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          video_url: cloudinaryUrl,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        // Fal API result is nested: data.data.video.url
        const videoUrl = data?.data?.video?.url;
        if (videoUrl) {
          setGeneratedVideoUrl(videoUrl);
        } else {
          setError("No video URL returned from Fal API.");
        }
      } else {
        setError(data.error || "Fal video generation failed");
      }
    } catch (err: any) {
      setError(err.message || "Fal video generation failed");
    }
  };

  return (
    <ImageKitProvider urlEndpoint={imagekitUrl!}>
      <div className="flex justify-center items-center min-h-screen bg-[#F5F6FA]">
        <Card className="p-8 w-full max-w-md shadow-lg">
          <h2 className="text-2xl font-bold mb-6 text-center">AI Video-to-Video Generator</h2>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="prompt">Prompt</Label>
              <Input
                id="prompt"
                name="prompt"
                type="text"
                placeholder="Enter your prompt"
                value={form.prompt}
                onChange={(e) => handleChange("prompt", e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <FileUploaderRegular
                onFileUploadFailed={handleUploadFailed}
                pubkey={pubKey}
                onChange={handleChangeEvent}
              />
              {uploading && <div className="text-sm text-blue-500">Uploading to Cloudinary...</div>}
              {cloudinaryUrl && (
                <div className="text-sm text-green-600 break-all">
                  Uploaded to Cloudinary!
                  {/* <a href={cloudinaryUrl} target="_blank" rel="noopener noreferrer">{cloudinaryUrl}</a> */}
                </div>
              )}
              {error && <div className="text-sm text-red-600">{error}</div>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="aspect_ratio">Aspect Ratio</Label>
              <Select value={form.aspect_ratio} onValueChange={(value) => handleChange("aspect_ratio", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select aspect ratio" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="16:9">16:9</SelectItem>
                  <SelectItem value="9:16">9:16</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="resolution">Resolution</Label>
              <Select value={form.resolution} onValueChange={(value) => handleChange("resolution", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select resolution" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="480p">480p</SelectItem>
                  <SelectItem value="580p">580p</SelectItem>
                  <SelectItem value="720p">720p</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="num_frames">Number of Frames</Label>
              <Select value={form.num_frames.toString()} onValueChange={(value) => handleChange("num_frames", parseInt(value))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select number of frames" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="129">129</SelectItem>
                  <SelectItem value="85">85</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Strength ({form.strength})</Label>
              <Slider
                value={[form.strength]}
                onValueChange={([value]) => handleChange("strength", value)}
                min={0}
                max={1}
                step={0.01}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="seed">Seed (Optional)</Label>
              <Input
                id="seed"
                name="seed"
                type="number"
                placeholder="Enter seed for reproducibility"
                value={form.seed}
                onChange={(e) => handleChange("seed", e.target.value)}
              />
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="pro_mode"
                checked={form.pro_mode}
                onCheckedChange={(checked) => handleChange("pro_mode", checked)}
              />
              <Label htmlFor="pro_mode">Pro Mode (55 steps, higher quality)</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="enable_safety_checker"
                checked={form.enable_safety_checker}
                onCheckedChange={(checked) => handleChange("enable_safety_checker", checked)}
              />
              <Label htmlFor="enable_safety_checker">Enable Safety Checker</Label>
            </div>

            <Button type="submit" className="w-full">Generate Video</Button>
          </form>
          {generatedVideoUrl && (
            <div className="mt-8">
              <h3 className="text-lg font-semibold mb-2">Generated Video:</h3>
              <IKVideo
                urlEndpoint={imagekitUrl!}
                src={generatedVideoUrl}
                controls
                width={500}
                height={300}
              />
              <div className="text-xs break-all mt-2">{generatedVideoUrl}</div>
            </div>
          )}
          {error && <div className="text-sm text-red-600 mt-4">{error}</div>}
        </Card>
      </div>
    </ImageKitProvider>
  )
}

export default Page