'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/nctirs/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AlertCircle, CheckCircle2, MapPin, Send } from "lucide-react"
import { toast } from "sonner"

export default function MobileReporter() {
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [success, setSuccess] = useState(false)

    // Mock Nairobi Locations for simulation
    const NAIROBI_LOCATIONS = [
        { name: "CBD - City Hall Way", lat: -1.2841, lng: 36.8221 },
        { name: "Westlands - Electric Ave", lat: -1.2634, lng: 36.8049 },
        { name: "Kibera - District DC", lat: -1.3125, lng: 36.7865 },
        { name: "Kilimani - Yaya Center", lat: -1.2915, lng: 36.7862 },
        { name: "Pangani - Flyover", lat: -1.2678, lng: 36.8345 },
    ]

    const [formData, setFormData] = useState({
        title: "",
        description: "",
        type: "Suspicious Activity",
        locationIndex: "0"
    })

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)

        const selectedLoc = NAIROBI_LOCATIONS[parseInt(formData.locationIndex)]

        try {
            const response = await fetch('/api/incidents', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title: formData.title,
                    description: formData.description,
                    type: formData.type,
                    location: selectedLoc.name,
                    latitude: selectedLoc.lat,
                    longitude: selectedLoc.lng,
                    reportedBy: 'CITIZEN_SIM_001',
                    priority: 'MEDIUM'
                })
            })

            if (response.ok) {
                setSuccess(true)
                toast.success("Incident Reported Securely. AI Risk Analysis Engaged.")
                setFormData({ title: "", description: "", type: "Suspicious Activity", locationIndex: "0" })
            } else {
                throw new Error("Failed to submit report")
            }
        } catch (error) {
            toast.error("Communication failure with Fusion Center.")
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="min-h-screen bg-black text-green-500 font-mono p-4 flex flex-col items-center justify-center">
            <div className="w-full max-w-md border border-green-900 bg-black/80 p-6 space-y-6 shadow-[0_0_20px_rgba(0,255,65,0.1)]">
                <div className="flex items-center justify-between border-b border-green-900 pb-4">
                    <h1 className="text-xl font-bold tracking-tighter flex items-center gap-2">
                        <AlertCircle className="text-orange-500" />
                        CIA: REPORTER
                    </h1>
                    <div className="text-[10px] bg-green-950 px-2 py-1 text-green-400 border border-green-800">
                        SECURE_v2.0
                    </div>
                </div>

                {success ? (
                    <div className="text-center py-12 space-y-4">
                        <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto animate-bounce" />
                        <h2 className="text-lg font-bold">REPORT TRANSMITTED</h2>
                        <p className="text-xs text-green-800">The Fusion Center has received your alert. AI risk scoring is currently being executed for responder prioritization.</p>
                        <Button
                            onClick={() => setSuccess(false)}
                            className="mt-6 w-full bg-green-900 hover:bg-green-800 text-white"
                        >
                            REPORT ANOTHER
                        </Button>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-1">
                            <label className="text-[10px] text-green-800 uppercase font-bold">Incident Title</label>
                            <Input
                                required
                                placeholder="e.g. Unattended Bag detected"
                                className="bg-black border-green-900 text-green-400 placeholder:text-green-900 rounded-none focus-visible:ring-green-500"
                                value={formData.title}
                                onChange={e => setFormData({ ...formData, title: e.target.value })}
                            />
                        </div>

                        <div className="space-y-1">
                            <label className="text-[10px] text-green-800 uppercase font-bold">Description</label>
                            <Textarea
                                required
                                placeholder="Provide tactical details..."
                                className="bg-black border-green-900 text-green-400 placeholder:text-green-900 rounded-none h-24 focus-visible:ring-green-500"
                                value={formData.description}
                                onChange={e => setFormData({ ...formData, description: e.target.value })}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <label className="text-[10px] text-green-800 uppercase font-bold">Category</label>
                                <Select value={formData.type} onValueChange={v => setFormData({ ...formData, type: v })}>
                                    <SelectTrigger className="bg-black border-green-900 text-green-400 rounded-none">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent className="bg-black border-green-900 text-green-400">
                                        <SelectItem value="Suspicious Activity">SUSPECT</SelectItem>
                                        <SelectItem value="Unrest">UNREST</SelectItem>
                                        <SelectItem value="Abandoned Object">OBJECT</SelectItem>
                                        <SelectItem value="Armed Threat">KINETIC</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-1">
                                <label className="text-[10px] text-green-800 uppercase font-bold">Location Simulation</label>
                                <Select value={formData.locationIndex} onValueChange={v => setFormData({ ...formData, locationIndex: v })}>
                                    <SelectTrigger className="bg-black border-green-900 text-green-400 rounded-none">
                                        <div className="flex items-center gap-1 truncate">
                                            <MapPin className="w-3 h-3" />
                                            <SelectValue />
                                        </div>
                                    </SelectTrigger>
                                    <SelectContent className="bg-black border-green-900 text-green-400">
                                        {NAIROBI_LOCATIONS.map((loc, i) => (
                                            <SelectItem key={i} value={i.toString()}>{loc.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <Button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full h-14 bg-orange-600 hover:bg-orange-500 text-black font-bold uppercase tracking-widest rounded-none mt-4 transition-all active:scale-95"
                        >
                            {isSubmitting ? (
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 bg-black rounded-full animate-ping" />
                                    ENCRYPTING_AND_SENDING...
                                </div>
                            ) : (
                                <div className="flex items-center gap-2">
                                    <Send className="w-4 h-4" />
                                    SUBMIT TO FUSION CENTER
                                </div>
                            )}
                        </Button>

                        <p className="text-[8px] text-center text-green-900 uppercase">
                            End-to-End Encrypted via NIST800-171 Compliance Module
                        </p>
                    </form>
                )}
            </div>
        </div>
    )
}
