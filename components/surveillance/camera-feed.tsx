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

                <div className="absolute top-2 left-2 flex gap-2">
                    <Badge variant={status === "LIVE" ? "destructive" : status === "RECORDING" ? "default" : "secondary"} className="uppercase text-[10px]">
                        {status === "LIVE" && <Signal className="w-3 h-3 mr-1 animate-pulse" />}
                        {status}
                    </Badge>
                </div>
                <div className="absolute bottom-2 left-2 bg-black/60 text-white px-2 py-1 rounded text-xs backdrop-blur-sm">
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
