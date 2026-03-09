import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Stethoscope, Leaf, Ship, AlertTriangle, TrendingUp, Network } from "lucide-react"

export default function CrossSectorPanel() {
    return (
        <Card className="bg-black border-purple-900/50 rounded-none h-full">
            <CardHeader className="pb-3 border-b border-purple-900/30">
                <div className="flex items-center justify-between">
                    <CardTitle className="text-sm text-purple-400 flex items-center gap-2 uppercase tracking-wider">
                        <Network className="w-4 h-4" />
                        Multi-Sector Intelligence Spillover
                    </CardTitle>
                    <Badge variant="outline" className="border-purple-500/50 text-purple-400 text-[10px] bg-purple-950/20">
                        RESILIENCE NETWORK
                    </Badge>
                </div>
                <CardDescription className="text-xs text-gray-500 mt-1">
                    Predictive security indicators applied to Health, Agriculture, and National Trade.
                </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
                <div className="divide-y divide-purple-900/20">

                    {/* Sector: Health */}
                    <div className="p-4 hover:bg-white/[0.02] transition-colors">
                        <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2 text-rose-400">
                                <Stethoscope className="w-4 h-4" />
                                <span className="text-xs font-bold uppercase tracking-wider">Public Health</span>
                            </div>
                            <span className="text-[10px] text-gray-500 font-mono">LIVE SYNC</span>
                        </div>
                        <div className="grid grid-cols-12 gap-3 items-center">
                            <div className="col-span-8">
                                <div className="text-sm text-gray-300">Respiratory distress patterns detected in Kakamega OSINT stream.</div>
                                <div className="text-xs text-rose-500/80 mt-1 flex items-center gap-1">
                                    <TrendingUp className="w-3 h-3" />
                                    +14% correlation with hospital admissions
                                </div>
                            </div>
                            <div className="col-span-4 text-right">
                                <Badge className="bg-rose-500/10 text-rose-400 border-rose-500/20 text-[10px]">
                                    PANDEMIC RISK: ELEVATED
                                </Badge>
                            </div>
                        </div>
                    </div>

                    {/* Sector: Agriculture */}
                    <div className="p-4 hover:bg-white/[0.02] transition-colors">
                        <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2 text-emerald-400">
                                <Leaf className="w-4 h-4" />
                                <span className="text-xs font-bold uppercase tracking-wider">Agriculture & Wildlife</span>
                            </div>
                            <span className="text-[10px] text-gray-500 font-mono">KWS INTEGRATION</span>
                        </div>
                        <div className="grid grid-cols-12 gap-3 items-center">
                            <div className="col-span-8">
                                <div className="text-sm text-gray-300">Elephant herd migration vector intersecting with Narok farmland.</div>
                                <div className="text-xs text-emerald-500/80 mt-1 flex items-center gap-1">
                                    <AlertTriangle className="w-3 h-3" />
                                    Predictive conflict alert dispatched to KWS
                                </div>
                            </div>
                            <div className="col-span-4 text-right">
                                <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 text-[10px]">
                                    PREEMPTIVE RESOLUTION
                                </Badge>
                            </div>
                        </div>
                    </div>

                    {/* Sector: Trade */}
                    <div className="p-4 hover:bg-white/[0.02] transition-colors">
                        <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2 text-blue-400">
                                <Ship className="w-4 h-4" />
                                <span className="text-xs font-bold uppercase tracking-wider">Trade & Customs</span>
                            </div>
                            <span className="text-[10px] text-gray-500 font-mono">KPA SURVEILLANCE</span>
                        </div>
                        <div className="grid grid-cols-12 gap-3 items-center">
                            <div className="col-span-8">
                                <div className="text-sm text-gray-300">Mombasa Port queue staging anomaly detected via Computer Vision.</div>
                                <div className="text-xs text-blue-500/80 mt-1 flex items-center gap-1">
                                    <TrendingUp className="w-3 h-3" />
                                    Logistics rerouting suggested to prevent smuggling window
                                </div>
                            </div>
                            <div className="col-span-4 text-right">
                                <Badge className="bg-blue-500/10 text-blue-400 border-blue-500/20 text-[10px]">
                                    SUPPLY CHAIN SECURE
                                </Badge>
                            </div>
                        </div>
                    </div>

                </div>
            </CardContent>
        </Card>
    )
}
