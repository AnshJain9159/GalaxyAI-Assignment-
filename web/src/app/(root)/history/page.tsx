/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"
import { useEffect, useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ImageKitProvider, Video as IKVideo } from "@imagekit/next"
import { ArrowLeft, Wand2, History, Calendar, Clock, FileVideo, Settings, ExternalLink } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export default function HistoryPage() {
  const [history, setHistory] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const imagekitUrl = process.env.NEXT_PUBLIC_IMAGEKIT_URL

  useEffect(() => {
    fetch("/api/history")
      .then((res) => res.json())
      .then((data) => {
        setHistory(data.history || [])
        setLoading(false)
      })
      .catch((error) => {
        console.error("Failed to fetch history:", error)
        setLoading(false)
      })
  }, [])

  if (!imagekitUrl) {
    console.error("ImageKit URL not configured")
    return <div>Configuration Error</div>
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date)
  }

  return (
    <ImageKitProvider urlEndpoint={imagekitUrl}>
      <div className="min-h-screen bg-background">
        <div className="container max-w-7xl mx-auto py-8 md:py-12 px-4 sm:px-6 lg:px-8">
          {/* Centered Header */}
          <div className="flex items-center justify-center gap-3 mb-8">
            <History className="h-6 w-6 text-primary" />
            <h1 className="text-2xl font-bold text-center">Your Transformation History</h1>
          </div>

          <div className="max-w-4xl mx-auto">
            {loading ? (
              <div className="space-y-6">
                {[1, 2, 3].map((i) => (
                  <Card key={i} className="border border-border/50 bg-background/50 backdrop-blur-sm">
                    <CardHeader>
                      <Skeleton className="h-6 w-48" />
                      <Skeleton className="h-4 w-32" />
                    </CardHeader>
                    <CardContent>
                      <div className="aspect-video w-full">
                        <Skeleton className="h-full w-full rounded-md" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : history.length === 0 ? (
              <Card className="border border-border/50 bg-background/50 backdrop-blur-sm p-8 text-center">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <History className="h-8 w-8 text-primary/50" />
                </div>
                <h3 className="text-xl font-medium mb-2">No Transformation History</h3>
                <p className="text-muted-foreground max-w-md mx-auto mb-6">
                  You haven&apos;st transformed any videos yet. Start by creating your first video transformation.
                </p>
                <Button asChild>
                  <Link href="/transform" className="gap-2">
                    <Wand2 className="h-4 w-4" />
                    Create Your First Transformation
                  </Link>
                </Button>
              </Card>
            ) : (
              <div className="grid grid-cols-1 gap-6">
                {history.map((item) => (
                  <Card
                    key={item._id}
                    className="border border-border/50 bg-background/50 backdrop-blur-sm overflow-hidden"
                  >
                    <CardHeader>
                      <CardTitle className="flex items-start justify-between">
                        <span className="text-xl font-semibold line-clamp-1">
                          {item.parameters.prompt || "Untitled Transformation"}
                        </span>
                        <Badge variant="outline" className="ml-2 flex-shrink-0">
                          {item.parameters.resolution}
                        </Badge>
                      </CardTitle>
                      <CardDescription className="flex flex-wrap gap-x-4 gap-y-2">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                          {formatDate(item.createdAt)}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                          {item.parameters.num_inference_steps} steps
                        </span>
                        <span className="flex items-center gap-1">
                          <FileVideo className="h-3.5 w-3.5 text-muted-foreground" />
                          {item.parameters.aspect_ratio}
                        </span>
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <h4 className="text-sm font-medium flex items-center gap-1">
                            <FileVideo className="h-3.5 w-3.5 text-muted-foreground" />
                            Original Video
                          </h4>
                          <div className="aspect-video relative rounded-lg overflow-hidden border border-border/50">
                            <IKVideo
                              urlEndpoint={imagekitUrl}
                              src={item.sourceVideoUrl}
                              controls
                              className="w-full h-full"
                              transformation={[
                                {
                                  height: "auto",
                                  width: "auto",
                                  format: "auto",
                                },
                              ]}
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <h4 className="text-sm font-medium flex items-center gap-1">
                            <Wand2 className="h-3.5 w-3.5 text-primary" />
                            Transformed Video
                          </h4>
                          <div className="aspect-video relative rounded-lg overflow-hidden border border-primary/20">
                            <IKVideo
                              urlEndpoint={imagekitUrl}
                              src={item.generatedVideoUrl}
                              controls
                              className="w-full h-full"
                              transformation={[
                                {
                                  height: "auto",
                                  width: "auto",
                                  format: "auto",
                                },
                              ]}
                            />
                          </div>
                        </div>
                      </div>

                      <Accordion type="single" collapsible className="mt-4">
                        <AccordionItem value="parameters" className="border-border/50">
                          <AccordionTrigger className="text-sm font-medium py-2">
                            <div className="flex items-center gap-1">
                              <Settings className="h-3.5 w-3.5 text-muted-foreground" />
                              Transformation Parameters
                            </div>
                          </AccordionTrigger>
                          <AccordionContent className="text-xs">
                            <div className="bg-muted/30 p-3 rounded-md overflow-x-auto">
                              <pre className="whitespace-pre-wrap">{JSON.stringify(item.parameters, null, 2)}</pre>
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      </Accordion>
                    </CardContent>
                    <CardFooter className="flex justify-between border-t border-border/50 bg-muted/10 py-3">
                      <Button variant="ghost" size="sm" asChild>
                        <a
                          href={item.sourceVideoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1"
                        >
                          <ExternalLink className="h-3.5 w-3.5" />
                          Source
                        </a>
                      </Button>
                      <Button variant="ghost" size="sm" asChild>
                        <a
                          href={item.generatedVideoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1"
                        >
                          <ExternalLink className="h-3.5 w-3.5" />
                          Result
                        </a>
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </ImageKitProvider>
  )
}
