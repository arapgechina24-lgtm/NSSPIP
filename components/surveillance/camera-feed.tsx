"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Signal, SignalZero, Video, VideoOff } from "lucide-react"

interface CameraFeedProps {
    id: string
    name: string
    location: string
    status: "LIVE" | "OFFLINE" | "RECORDING"
    imageUrl?: string
}

export function CameraFeed({ id, name, location, status, imageUrl }: CameraFeedProps) {
    const [detections, setDetections] = useState<any[]>([])
    const [analyzing, setAnalyzing] = useState(false)

    useEffect(() => {
        if (status !== "LIVE") return

        const interval = setInterval(async () => {
            setAnalyzing(true)
            // Call Server Action or API Route (Note: In a real app we'd use a server action wrapper, 
            // but for MVP we might need to route this via a Next.js API route to avoid CORS if calling Python directly from Client,
            // OR assumes Python enables CORS. For simplicity here, let's assume we created a server action wrapper or API route.
            // Actually, let's use a client-side fetch wrapper to a Next.js API route we will create momentarily.)

            // For this specific step, I will implement the fetch to a new Next.js API route /api/analyze-surveillance
            try {
                const res = await fetch("/api/analyze-surveillance", {
                    method: "POST",
                    body: JSON.stringify({ feed_id: id })
                })
                const data = await res.json()
                if (data && data.detected_objects) {
                    setDetections(data.detected_objects)
                }
            } catch (e) {
                console.error(e)
            } finally {
                setAnalyzing(false)
            }
        }, 5000) // Poll every 5 seconds

        return () => clearInterval(interval)
    }, [id, status])

    return (
        <Card className="overflow-hidden">
            <div className="relative aspect-video bg-muted flex items-center justify-center">
                {imageUrl ? (
                    <img src={imageUrl} alt={name} className="object-cover w-full h-full opacity-80 hover:opacity-100 transition-opacity" />
                ) : (
                    <div className="text-muted-foreground flex flex-col items-center gap-2">
                        {status === "OFFLINE" ? <VideoOff className="h-10 w-10" /> : <Video className="h-10 w-10" />}
                        <span className="text-sm">Camera Feed Unavailable</span>
                    </div>
                )}

                {/* Detection Overlays */}
                {detections.map((det, idx) => (
                    <div
                        key={idx}
                        className="absolute border-2 border-red-500 bg-red-500/20 z-10 flex items-start justify-center animate-pulse"
                        style={{
                            left: `${det.bbox[0]}px`,
                            top: `${det.bbox[1]}px`,
                            width: `${det.bbox[2]}px`,
                            height: `${det.bbox[3]}px`
                        }}
                    >
                        <span className="bg-red-600 text-white text-[10px] px-1 font-bold uppercase">{det.label} {Math.round(det.confidence * 100)}%</span>
                    </div>
                ))}

                <div className="absolute top-2 left-2 flex gap-2 z-20">
                    <Badge variant={status === "LIVE" ? "destructive" : status === "RECORDING" ? "default" : "secondary"} className="uppercase text-[10px]">
                        {status === "LIVE" && <Signal className="w-3 h-3 mr-1 animate-pulse" />}
                        {status}
                    </Badge>
                    {analyzing && <Badge variant="outline" className="bg-background/50 text-[10px]">AI ANALYZING</Badge>}
                </div>
                <div className="absolute bottom-2 left-2 bg-black/60 text-white px-2 py-1 rounded text-xs backdrop-blur-sm z-20">
                    {location}
                </div>
            </div>
            <CardHeader className="p-3">
                <CardTitle className="text-sm font-medium flex justify-between items-center">
                    <span>{name}</span>
                    <span className="text-xs text-muted-foreground font-normal">{id}</span>
                </CardTitle>
            </CardHeader>
        </Card>
    )
}

import { useState, useEffect } from "react"
