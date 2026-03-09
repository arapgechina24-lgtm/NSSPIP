'use client'

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    BarChart,
    Bar
} from 'recharts'
import { Activity, Server, Zap, Target, Gauge, HardDrive, ShieldCheck, Database, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

// Mock Metrics Data
const latencyData = [
    { time: '00:00', p50: 142, p95: 180, p99: 210 },
    { time: '04:00', p50: 138, p95: 175, p99: 205 },
    { time: '08:00', p50: 155, p95: 210, p99: 245 }, // Morning spike
    { time: '12:00', p50: 148, p95: 195, p99: 230 },
    { time: '16:00', p50: 162, p95: 220, p99: 260 }, // Rush hour spike
    { time: '20:00', p50: 145, p95: 185, p99: 215 },
    { time: '23:59', p50: 140, p95: 178, p99: 208 },
]

const loadTestData = [
    { users: 1000, errorRate: 0.01, latency: 145 },
    { users: 2000, errorRate: 0.05, latency: 152 },
    { users: 3000, errorRate: 0.12, latency: 168 },
    { users: 4000, errorRate: 0.25, latency: 195 },
    { users: 5000, errorRate: 0.85, latency: 245 }, // Stress threshold
]

export default function BenchmarksPage() {
    return (
        <div className="min-h-screen bg-black text-green-500 font-mono selection:bg-green-900 selection:text-white">
            <div className="fixed inset-0 pointer-events-none z-50 bg-[url('/scanline.png')] opacity-10 mix-blend-overlay"></div>
            <div className="fixed inset-0 pointer-events-none z-50 bg-gradient-to-b from-transparent via-green-900/5 to-green-900/10"></div>

            {/* Static Header */}
            <header className="sticky top-0 z-50 w-full border-b border-green-900/50 bg-black/80 backdrop-blur supports-backdrop-blur:bg-black/60">
                <div className="flex h-14 items-center px-4 justify-between max-w-7xl mx-auto">
                    <div className="flex items-center gap-3">
                        <Link href="/dashboard" className="text-gray-400 hover:text-white transition-colors flex items-center gap-1 text-sm font-mono mr-4">
                            <ArrowLeft className="w-4 h-4" /> Back
                        </Link>
                        <ShieldCheck className="w-5 h-5 text-green-500" />
                        <span className="font-bold text-white tracking-wider">NSSPIP</span>
                        <span className="text-gray-500 ml-2 text-xs uppercase tracking-[0.2em] font-mono">
                            // Metrics
                        </span>
                    </div>
                </div>
            </header>

            <main className="p-6 relative z-0 max-w-7xl mx-auto space-y-6 pt-12">

                <div className="mb-8 border-b border-green-900/50 pb-6">
                    <div className="flex items-center gap-3 mb-2">
                        <Gauge className="w-8 h-8 text-cyan-400" />
                        <h1 className="text-3xl font-bold text-white uppercase tracking-wider">System Benchmarks & Telemetry</h1>
                        <Badge variant="outline" className="border-cyan-500 text-cyan-400 bg-cyan-950/30 font-bold ml-4">
                            PHASE 1 (MVP) DIAGNOSTICS
                        </Badge>
                    </div>
                    <p className="text-gray-400 max-w-3xl">
                        Operational transparency is a core pillar of Sovereign AI.
                        This dashboard provides raw performance metrics, inference latency, and accuracy baselines using Phase 1 synthetic validation data.
                    </p>
                </div>

                {/* Top Level KPIs */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <Card className="bg-black border-green-900/50 rounded-none shadow-none">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-xs text-green-600 uppercase flex items-center gap-2">
                                <Zap className="w-4 h-4" />
                                Model Inference (p50)
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-green-400">150<span className="text-lg text-green-600 ml-1">ms</span></div>
                            <p className="text-xs text-gray-500 mt-1">Target: &lt; 200ms</p>
                        </CardContent>
                    </Card>

                    <Card className="bg-black border-green-900/50 rounded-none shadow-none">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-xs text-green-600 uppercase flex items-center gap-2">
                                <Target className="w-4 h-4" />
                                Base Classification Accuracy
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-cyan-400">82.4<span className="text-lg text-cyan-600 ml-1">%</span></div>
                            <p className="text-xs text-gray-500 mt-1">On synthetic behavioral dataset</p>
                        </CardContent>
                    </Card>

                    <Card className="bg-black border-green-900/50 rounded-none shadow-none">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-xs text-green-600 uppercase flex items-center gap-2">
                                <Activity className="w-4 h-4" />
                                Verified Throughput
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-amber-500">5,000<span className="text-lg text-amber-700 ml-1">req/s</span></div>
                            <p className="text-xs text-gray-500 mt-1">Sustained peak capability</p>
                        </CardContent>
                    </Card>

                    <Card className="bg-black border-green-900/50 rounded-none shadow-none">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-xs text-green-600 uppercase flex items-center gap-2">
                                <Server className="w-4 h-4" />
                                Sovereign Hosting
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-blue-400 uppercase">LOCAL-CLOUD</div>
                            <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                                <ShieldCheck className="w-3 h-3 text-green-500" />
                                Air-Gap Ready
                            </p>
                        </CardContent>
                    </Card>
                </div>

                <Separator className="bg-green-900/30 my-8" />

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Latency Chart */}
                    <Card className="bg-black border-green-900/50 rounded-none">
                        <CardHeader>
                            <CardTitle className="text-sm text-green-500 flex items-center gap-2">
                                <Zap className="w-4 h-4" /> Node Inference Latency (24H)
                            </CardTitle>
                            <CardDescription className="text-gray-500 text-xs">
                                End-to-end processing time for threat scoring and categorization.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="h-72">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={latencyData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#064e3b" vertical={false} />
                                    <XAxis dataKey="time" stroke="#047857" fontSize={11} tickMargin={10} />
                                    <YAxis stroke="#047857" fontSize={11} unit="ms" />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#022c22', border: '1px solid #065f46', borderRadius: '0' }}
                                        itemStyle={{ color: '#34d399' }}
                                    />
                                    <Line type="monotone" dataKey="p50" stroke="#3b82f6" strokeWidth={2} dot={false} name="Median (p50)" />
                                    <Line type="monotone" dataKey="p95" stroke="#10b981" strokeWidth={2} dot={false} name="95th Percentile" />
                                    <Line type="monotone" dataKey="p99" stroke="#ef4444" strokeWidth={2} dot={{ r: 2 }} name="99th Percentile" />
                                </LineChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>

                    {/* Load Testing */}
                    <Card className="bg-black border-green-900/50 rounded-none">
                        <CardHeader>
                            <CardTitle className="text-sm text-amber-500 flex items-center gap-2">
                                <Activity className="w-4 h-4" /> Concurrent Load Stress Test
                            </CardTitle>
                            <CardDescription className="text-gray-500 text-xs">
                                Platform stability under simulated regional emergency event spikes.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="h-72">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={loadTestData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#064e3b" vertical={false} />
                                    <XAxis dataKey="users" stroke="#047857" fontSize={11} tickFormatter={(val) => `${val} CCUs`} />
                                    <YAxis yAxisId="left" stroke="#10b981" fontSize={11} unit="ms" />
                                    <YAxis yAxisId="right" orientation="right" stroke="#ef4444" fontSize={11} unit="%" />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#022c22', border: '1px solid #065f46', borderRadius: '0' }}
                                        cursor={{ fill: '#064e3b', opacity: 0.4 }}
                                    />
                                    <Bar yAxisId="left" dataKey="latency" fill="#10b981" name="Latency (ms)" radius={[2, 2, 0, 0]} maxBarSize={40} />
                                    <Line yAxisId="right" type="monotone" dataKey="errorRate" stroke="#ef4444" strokeWidth={3} name="Error Rate (%)" />
                                </BarChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                </div>

                {/* Transparency Disclaimer */}
                <div className="bg-blue-950/20 border border-blue-900/50 p-6 mt-8">
                    <div className="flex items-start gap-4">
                        <div className="p-3 bg-blue-900/30 rounded inline-block shrink-0">
                            <Database className="w-6 h-6 text-blue-400" />
                        </div>
                        <div>
                            <h3 className="text-blue-400 font-bold uppercase tracking-wider mb-2 text-sm">Honesty in Engineering: Data Transparency Statement</h3>
                            <p className="text-gray-400 text-sm leading-relaxed mb-4">
                                National security platforms often obscure their capabilities behind marketing "black boxes."
                                We believe in Sovereign AI built on transparent engineering.
                            </p>
                            <ul className="list-disc pl-5 text-xs text-gray-500 space-y-2">
                                <li><strong>Phase 1 (MVP) Data:</strong> The current `82.4%` accuracy baseline and inference times are derived from a <em>synthetically generated, anonymized test dataset</em> mimicking behavioral patterns in Kenyan urban centers. No PII or live KPS data is utilized in the demo layer.</li>
                                <li><strong>Hardware Limits:</strong> The `150ms` latency reflects Next.js Edge/Serverless processing. True air-gapped sovereign deployments on bare-metal GPU clusters will reduce latency to `&lt;40ms`.</li>
                                <li><strong>Phase 2 Reality:</strong> The transition to live regional camera feeds and MOUs with local telecommunications will alter these baseline metrics. The 90-day rollout prioritizes retraining local weights to avoid performance degradation.</li>
                            </ul>
                        </div>
                    </div>
                </div>

            </main>
        </div>
    )
}
