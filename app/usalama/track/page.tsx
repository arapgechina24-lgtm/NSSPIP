'use client'

import { useState } from 'react'

interface TrackingResult {
    id: string
    title: string
    type: string
    status: string
    priority: string
    createdAt: string
    location: string
    timeline: Array<{
        status: string
        timestamp: string
        description: string
    }>
}

export default function TrackPage() {
    const [caseId, setCaseId] = useState('')
    const [searching, setSearching] = useState(false)
    const [result, setResult] = useState<TrackingResult | null>(null)
    const [notFound, setNotFound] = useState(false)

    const statusColors: Record<string, { bg: string; text: string; dot: string }> = {
        OPEN: { bg: 'bg-blue-500/10 border-blue-500/20', text: 'text-blue-400', dot: 'bg-blue-500' },
        ACTIVE: { bg: 'bg-amber-500/10 border-amber-500/20', text: 'text-amber-400', dot: 'bg-amber-500' },
        INVESTIGATING: { bg: 'bg-purple-500/10 border-purple-500/20', text: 'text-purple-400', dot: 'bg-purple-500' },
        RESOLVED: { bg: 'bg-green-500/10 border-green-500/20', text: 'text-green-400', dot: 'bg-green-500' },
        MONITORING: { bg: 'bg-cyan-500/10 border-cyan-500/20', text: 'text-cyan-400', dot: 'bg-cyan-500' },
    }

    const handleSearch = async () => {
        if (!caseId.trim()) return
        setSearching(true)
        setNotFound(false)
        setResult(null)

        try {
            const response = await fetch(`/api/incidents?limit=50`)
            if (response.ok) {
                const data = await response.json()
                const found = data.incidents?.find(
                    (inc: { id: string }) => inc.id === caseId.trim() || inc.id.includes(caseId.trim())
                )
                if (found) {
                    setResult({
                        id: found.id,
                        title: found.title,
                        type: found.type || 'GENERAL',
                        status: found.status || 'ACTIVE',
                        priority: found.severity || found.priority || 'MEDIUM',
                        createdAt: found.createdAt,
                        location: found.location || 'Unknown',
                        timeline: [
                            { status: 'RECEIVED', timestamp: found.createdAt, description: 'Report received and logged into the system' },
                            { status: 'AI_ANALYSIS', timestamp: new Date(new Date(found.createdAt).getTime() + 30000).toISOString(), description: 'AI risk scoring and threat analysis initiated' },
                            { status: found.status || 'ACTIVE', timestamp: found.updatedAt || found.createdAt, description: `Case status updated to ${found.status || 'ACTIVE'}` },
                        ],
                    })
                } else {
                    setNotFound(true)
                }
            }
        } catch {
            setNotFound(true)
        } finally {
            setSearching(false)
        }
    }

    return (
        <div className="max-w-2xl mx-auto px-4 py-10">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-white mb-1">Track Your Report</h1>
                <p className="text-sm text-gray-500">Enter your case reference number to view the current status of your report.</p>
            </div>

            {/* Search */}
            <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-6 sm:p-8 mb-6">
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Case Reference Number</label>
                <div className="flex gap-3">
                    <input
                        type="text"
                        value={caseId}
                        onChange={(e) => setCaseId(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                        placeholder="Enter your case ID (e.g. USL-1741527389123)"
                        className="flex-1 bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-white font-mono placeholder:text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500/30 focus:border-green-500/30 transition-all"
                    />
                    <button
                        onClick={handleSearch}
                        disabled={searching || !caseId.trim()}
                        className="px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold rounded-xl hover:from-green-500 hover:to-emerald-500 transition-all shadow-lg shadow-green-900/20 disabled:opacity-30 disabled:cursor-not-allowed disabled:shadow-none shrink-0 flex items-center gap-2"
                    >
                        {searching ? (
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        ) : (
                            '🔍'
                        )}
                        <span className="hidden sm:inline">Search</span>
                    </button>
                </div>
            </div>

            {/* Not Found */}
            {notFound && (
                <div className="bg-red-500/5 border border-red-500/20 rounded-2xl p-6 text-center mb-6">
                    <span className="text-3xl block mb-3">🔎</span>
                    <h3 className="text-lg font-semibold text-white mb-1">Case Not Found</h3>
                    <p className="text-sm text-gray-500">
                        No report found with that reference number. Please check and try again.
                    </p>
                </div>
            )}

            {/* Result */}
            {result && (
                <div className="space-y-6">
                    {/* Case Overview */}
                    <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-6 sm:p-8">
                        <div className="flex items-start justify-between gap-4 mb-6">
                            <div>
                                <div className="text-[10px] text-gray-600 uppercase tracking-wider mb-1">Case Reference</div>
                                <div className="text-sm font-mono text-green-400 font-bold">{result.id}</div>
                            </div>
                            <span className={`px-3 py-1 rounded-lg border text-xs font-bold ${statusColors[result.status]?.bg || 'bg-gray-500/10 border-gray-500/20'} ${statusColors[result.status]?.text || 'text-gray-400'}`}>
                                {result.status}
                            </span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {[
                                { label: 'Subject', value: result.title },
                                { label: 'Type', value: result.type },
                                { label: 'Priority', value: result.priority },
                                { label: 'Location', value: result.location },
                                { label: 'Filed On', value: new Date(result.createdAt).toLocaleString() },
                            ].map((item) => (
                                <div key={item.label} className="bg-black/30 border border-white/[0.04] rounded-xl px-4 py-3">
                                    <div className="text-[10px] text-gray-600 uppercase tracking-wider mb-0.5">{item.label}</div>
                                    <div className="text-sm text-gray-300">{item.value}</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Timeline */}
                    <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-6 sm:p-8">
                        <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-6">Case Timeline</h3>
                        <div className="space-y-0">
                            {result.timeline.map((event, i) => (
                                <div key={i} className="flex gap-4">
                                    {/* Timeline line */}
                                    <div className="flex flex-col items-center">
                                        <div className={`w-3 h-3 rounded-full shrink-0 ${i === result.timeline.length - 1 ? 'bg-green-500 shadow-lg shadow-green-500/30' : 'bg-white/20'}`} />
                                        {i < result.timeline.length - 1 && (
                                            <div className="w-[2px] h-full min-h-[40px] bg-white/[0.06]" />
                                        )}
                                    </div>
                                    {/* Content */}
                                    <div className="pb-6">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="text-xs font-bold text-white">{event.status}</span>
                                            <span className="text-[10px] text-gray-600">
                                                {new Date(event.timestamp).toLocaleString()}
                                            </span>
                                        </div>
                                        <p className="text-sm text-gray-500">{event.description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Security Note */}
                    <div className="bg-white/[0.02] border border-white/[0.04] rounded-xl p-4 text-center">
                        <p className="text-[11px] text-gray-600">
                            🔒 This information is classified. Do not share your case reference with unauthorized persons.
                        </p>
                    </div>
                </div>
            )}

            {/* Help */}
            {!result && !notFound && (
                <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-8 text-center mt-8">
                    <span className="text-4xl block mb-4">📋</span>
                    <h3 className="text-lg font-semibold text-white mb-2">How It Works</h3>
                    <div className="max-w-md mx-auto space-y-4 mt-6 text-left">
                        {[
                            { step: '1', title: 'Submit a Report', desc: 'File an incident report through our secure form' },
                            { step: '2', title: 'Receive Case ID', desc: 'Get a unique reference number upon submission' },
                            { step: '3', title: 'Track Progress', desc: 'Enter your case ID here to monitor status' },
                        ].map((item) => (
                            <div key={item.step} className="flex items-start gap-4">
                                <div className="w-8 h-8 rounded-lg bg-green-600/20 border border-green-500/20 flex items-center justify-center shrink-0 text-sm font-bold text-green-400">
                                    {item.step}
                                </div>
                                <div>
                                    <div className="text-sm font-semibold text-white">{item.title}</div>
                                    <div className="text-xs text-gray-500">{item.desc}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}
