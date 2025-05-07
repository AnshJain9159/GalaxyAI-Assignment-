import Link from "next/link"
import { ArrowRight, Wand2, Layers, History, Upload, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import VideoTransformationHero from "@/components/video-transformation-hero"
import FeatureCard from "@/components/feature-card"
import ProcessStep from "@/components/process-step"
import TransformationExample from "@/components/transformation-example"
export default function Home() {
  return (
    <div className="flex min-h-screen flex-col overflow-x-hidden"> {/* Added overflow-x-hidden */}
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-b from-background to-background/80 py-20 md:py-32">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <VideoTransformationHero />
          </div>
          <div className="absolute inset-0 bg-grid-white/5 dark:bg-grid-white/10 [mask-image:radial-gradient(900px_at_center,transparent_30%,white)]"></div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-20 bg-muted/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">Powerful Video Transformation</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Transform your videos with state-of-the-art AI technology. Our tool leverages the Hunyuan-Video Model to
                create stunning visual transformations.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <FeatureCard
                icon={<Sparkles className="h-10 w-10 text-primary" />}
                title="AI-Powered Styling"
                description="Apply advanced AI-generated styles to transform the look and feel of your videos while preserving content and motion."
              />
              <FeatureCard
                icon={<Upload className="h-10 w-10 text-primary" />}
                title="Simple Upload Process"
                description="Easily upload your videos through our secure interface with support for all major video formats."
              />
              <FeatureCard
                icon={<Layers className="h-10 w-10 text-primary" />}
                title="Customizable Parameters"
                description="Fine-tune your transformations with a wide range of adjustable parameters to achieve your desired look."
              />
              <FeatureCard
                icon={<History className="h-10 w-10 text-primary" />}
                title="Transformation History"
                description="Access your previous transformations anytime with our comprehensive history tracking system."
              />
              <FeatureCard
                icon={<Wand2 className="h-10 w-10 text-primary" />}
                title="One-Click Magic"
                description="Transform your videos with a single click using our optimized presets for quick, stunning results."
              />
              <FeatureCard
                icon={<ArrowRight className="h-10 w-10 text-primary" />}
                title="Instant Preview"
                description="See transformation previews before committing to the full processing for better creative control."
              />
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section id="how-it-works" className="py-20 overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">How It Works</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Our streamlined process makes video transformation simple and efficient.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto relative">
              <ProcessStep
                number={1}
                title="Upload Your Video"
                description="Upload your source video through our secure interface. We support MP4, MOV, and other major formats."
              />
              <ProcessStep
                number={2}
                title="Set Parameters"
                description="Choose from a variety of transformation options and customize parameters to achieve your desired effect."
              />
              <ProcessStep
                number={3}
                title="Get Transformed Video"
                description="Our AI processes your video and delivers a transformed version that you can download and share."
              />
            </div>
          </div>
        </section>

        {/* Examples Section */}
        <section id="examples" className="py-20 bg-muted/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">Transformation Examples</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                See the power of our AI video transformation in action with these examples.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              <TransformationExample
                title="Cinematic Style"
                description="A stylish woman walks down a Tokyo street filled with warm glowing neon and animated city signage. She wears a dark blue leather jacket, a long pink dress, and bright yellow boots, and carries a black purse."
                beforeSrc="https://storage.googleapis.com/falserverless/hunyuan_video/hunyuan_v2v_input.mp4"
                afterSrc="https://v3.fal.media/files/kangaroo/y5-1YTGpun17eSeggZMzX_video-1733468228.mp4"
              />
              <TransformationExample
                title="Object Swapping."
                description="Add black dog in the video where only white dog is walking ."
                beforeSrc="https://res.cloudinary.com/dqrzwnjgs/video/upload/v1746557316/video-to-video-uploads/xmd83iq9ckdwjzxexjwq.mp4"
                afterSrc="https://v3.fal.media/files/panda/z2yeNXTqLXqv1wPnlLsD2_video-1746554958.mp4"
              />
              
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-primary/5">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-6">Ready to Transform Your Videos?</h2>
            <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
              Start creating stunning video transformations with our AI-powered tool. Upload your first video and see
              the magic happen.
            </p>
            <Link href="/transform">
              <Button size="lg" className="gap-2">
                Get Started Now
                <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
          </div>
        </section>
      </main>
    </div>
  )
}