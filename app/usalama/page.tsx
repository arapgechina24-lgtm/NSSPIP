'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

// Animated counter hook
function useCounter(target: number, duration: number = 2000) {
    const [count, setCount] = useState(0)
    useEffect(() => {
        let start = 0
        const increment = target / (duration / 16)
        const timer = setInterval(() => {
            start += increment
            if (start >= target) {
                setCount(target)
                clearInterval(timer)
            } else {
                setCount(Math.floor(start))
            }
        }, 16)
        return () => clearInterval(timer)
    }, [target, duration])
    return count
}

function StatCard({ value, label, suffix = '' }: { value: number; label: string; suffix?: string }) {
    const animated = useCounter(value)
    return (
        <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-5 text-center hover:bg-white/[0.05] transition-all duration-300 group">
            <div className="text-3xl font-bold text-white mb-1 tabular-nums group-hover:scale-105 transition-transform">
                {animated.toLocaleString()}{suffix}
            </div>
            <div className="text-xs text-gray-500 uppercase tracking-wider font-medium">{label}</div>
        </div>
    )
}

export default function UsalamaHome() {
    const [mounted, setMounted] = useState(false)
    const [alerts, setAlerts] = useState<Array<{ id: string; title: string; type: string; time: string; severity: string }>>([])

    useEffect(() => {
        setMounted(true)
        // Simulated live alerts
        setAlerts([
            { id: '1', title: 'Suspicious vehicle reported near Westlands', type: 'SURVEILLANCE', time: '2 min ago', severity: 'MEDIUM' },
            { id: '2', title: 'Community patrol update - Kibera area clear', type: 'PATROL', time: '8 min ago', severity: 'LOW' },
            { id: '3', title: 'Unattended bag alert - CBD area', type: 'ALERT', time: '15 min ago', severity: 'HIGH' },
            { id: '4', title: 'Traffic incident reported on Mombasa Road', type: 'TRAFFIC', time: '22 min ago', severity: 'MEDIUM' },
            { id: '5', title: 'Noise disturbance - Eastleigh Section 3', type: 'COMMUNITY', time: '35 min ago', severity: 'LOW' },
        ])
    }, [])

    if (!mounted) return null

    const severityColor: Record<string, string> = {
        LOW: 'text-green-400 bg-green-500/10 border-green-500/20',
        MEDIUM: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
        HIGH: 'text-red-400 bg-red-500/10 border-red-500/20',
        CRITICAL: 'text-red-500 bg-red-500/20 border-red-500/30',
    }

    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <section className="relative overflow-hidden">
                {/* Background effects */}
                <div className="absolute inset-0 bg-gradient-to-b from-green-950/20 via-transparent to-transparent" />
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-green-600/5 rounded-full blur-[120px]" />

                <div className="relative max-w-6xl mx-auto px-4 sm:px-6 pt-16 pb-20">
                    <div className="text-center max-w-3xl mx-auto">
                        {/* Badge */}
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-green-500/10 border border-green-500/20 rounded-full text-green-400 text-xs font-medium mb-8">
                            <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                            System Active — 24/7 Monitoring
                        </div>

                        {/* Title */}
                        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-4 tracking-tight leading-[1.1]">
                            Report.{' '}
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-300">
                                Protect.
                            </span>{' '}
                            Secure.
                        </h1>

                        <p className="text-lg text-gray-400 mb-10 max-w-xl mx-auto leading-relaxed">
                            Help safeguard Kenya by reporting security incidents directly to
                            national intelligence. Anonymous. Encrypted. Immediate.
                        </p>

                        {/* CTA Buttons */}
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <Link
                                href="/usalama/report"
                                className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold rounded-xl hover:from-green-500 hover:to-emerald-500 transition-all duration-300 shadow-lg shadow-green-900/30 hover:shadow-green-800/40 hover:scale-[1.02] active:scale-[0.98] text-center"
                            >
                                🚨 Report an Incident
                            </Link>
                            <Link
                                href="/usalama/track"
                                className="w-full sm:w-auto px-8 py-4 bg-white/5 border border-white/10 text-gray-300 font-semibold rounded-xl hover:bg-white/10 hover:text-white transition-all duration-300 text-center"
                            >
                                📋 Track Your Report
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Stats */}
            <section className="max-w-6xl mx-auto px-4 sm:px-6 -mt-4 mb-16">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <StatCard value={14892} label="Reports Processed" />
                    <StatCard value={342} label="Active Cases" />
                    <StatCard value={97} label="Resolution Rate" suffix="%" />
                    <StatCard value={47} label="Counties Covered" />
                </div>
            </section>

            {/* Feature Cards */}
            <section className="max-w-6xl mx-auto px-4 sm:px-6 mb-16">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Report Card */}
                    <Link href="/usalama/report" className="group">
                        <div className="h-full bg-white/[0.02] border border-white/[0.06] rounded-2xl p-8 hover:bg-white/[0.04] hover:border-green-500/20 transition-all duration-300">
                            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-red-500/20 to-red-600/10 border border-red-500/20 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                                <span className="text-2xl">🚨</span>
                            </div>
                            <h3 className="text-lg font-semibold text-white mb-2">Report Incident</h3>
                            <p className="text-sm text-gray-500 leading-relaxed">
                                Submit a detailed security incident report with location, category, and evidence. 
                                Your identity is protected.
                            </p>
                            <div className="mt-4 text-green-400 text-sm font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
                                File a report <span className="text-lg">→</span>
                            </div>
                        </div>
                    </Link>

                    {/* Track Card */}
                    <Link href="/usalama/track" className="group">
                        <div className="h-full bg-white/[0.02] border border-white/[0.06] rounded-2xl p-8 hover:bg-white/[0.04] hover:border-blue-500/20 transition-all duration-300">
                            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500/20 to-blue-600/10 border border-blue-500/20 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                                <span className="text-2xl">📋</span>
                            </div>
                            <h3 className="text-lg font-semibold text-white mb-2">Track Report</h3>
                            <p className="text-sm text-gray-500 leading-relaxed">
                                Follow up on your submitted report using your case reference number. 
                                See real-time status updates.
                            </p>
                            <div className="mt-4 text-blue-400 text-sm font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
                                Track status <span className="text-lg">→</span>
                            </div>
                        </div>
                    </Link>

                    {/* Emergency Card */}
                    <a href="tel:999" className="group">
                        <div className="h-full bg-red-950/20 border border-red-500/10 rounded-2xl p-8 hover:bg-red-950/30 hover:border-red-500/20 transition-all duration-300">
                            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-red-600/30 to-red-700/20 border border-red-500/30 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                                <span className="text-2xl">📞</span>
                            </div>
                            <h3 className="text-lg font-semibold text-red-400 mb-2">Emergency: 999</h3>
                            <p className="text-sm text-gray-500 leading-relaxed">
                                For life-threatening emergencies, call 999 immediately. 
                                Do not wait to file a digital report.
                            </p>
                            <div className="mt-4 text-red-400 text-sm font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
                                Call now <span className="text-lg">→</span>
                            </div>
                        </div>
                    </a>
                </div>
            </section>

            {/* Live Alerts Feed */}
            <section className="max-w-6xl mx-auto px-4 sm:px-6 mb-16">
                <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl overflow-hidden">
                    <div className="px-6 py-4 border-b border-white/[0.06] flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                            <h2 className="text-sm font-semibold text-white uppercase tracking-wider">Live Security Feed</h2>
                        </div>
                        <span className="text-[10px] text-gray-600 font-mono uppercase">Auto-updating</span>
                    </div>
                    <div className="divide-y divide-white/[0.04]">
                        {alerts.map((alert, i) => (
                            <div
                                key={alert.id}
                                className="px-6 py-4 hover:bg-white/[0.02] transition-colors flex items-center justify-between gap-4"
                                style={{ animationDelay: `${i * 100}ms` }}
                            >
                                <div className="flex items-center gap-4 min-w-0">
                                    <span className={`shrink-0 text-[10px] font-bold px-2 py-0.5 rounded border ${severityColor[alert.severity]}`}>
                                        {alert.severity}
                                    </span>
                                    <div className="min-w-0">
                                        <p className="text-sm text-gray-300 truncate">{alert.title}</p>
                                        <p className="text-[11px] text-gray-600 mt-0.5">{alert.type}</p>
                                    </div>
                                </div>
                                <span className="text-[11px] text-gray-600 shrink-0 whitespace-nowrap">{alert.time}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Trust Section */}
            <section className="max-w-6xl mx-auto px-4 sm:px-6 mb-16">
                <div className="text-center mb-8">
                    <h2 className="text-xl font-bold text-white mb-2">Built with Security First</h2>
                    <p className="text-sm text-gray-500">Your safety and privacy are our top priority</p>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                        { icon: '🔒', title: 'AES-256 Encrypted', desc: 'Military-grade encryption' },
                        { icon: '👤', title: 'Anonymous', desc: 'No identity required' },
                        { icon: '🤖', title: 'AI-Analyzed', desc: 'Instant threat assessment' },
                        { icon: '⚡', title: 'Real-time', desc: 'Immediate processing' },
                    ].map((item, i) => (
                        <div key={i} className="bg-white/[0.02] border border-white/[0.04] rounded-xl p-5 text-center">
                            <div className="text-2xl mb-2">{item.icon}</div>
                            <div className="text-sm font-semibold text-white mb-0.5">{item.title}</div>
                            <div className="text-[11px] text-gray-600">{item.desc}</div>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    )
}
