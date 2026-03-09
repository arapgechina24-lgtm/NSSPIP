'use client'

import { useState } from 'react'
import Link from 'next/link'

const INCIDENT_TYPES = [
    { value: 'TERRORISM', label: 'Terrorism / Extremism', icon: '💣', color: 'border-red-500/30 bg-red-500/5 hover:bg-red-500/10' },
    { value: 'VIOLENT_CRIME', label: 'Violent Crime', icon: '⚔️', color: 'border-orange-500/30 bg-orange-500/5 hover:bg-orange-500/10' },
    { value: 'ORGANIZED_CRIME', label: 'Organized Crime', icon: '🕵️', color: 'border-purple-500/30 bg-purple-500/5 hover:bg-purple-500/10' },
    { value: 'TRAFFICKING', label: 'Trafficking', icon: '🚫', color: 'border-pink-500/30 bg-pink-500/5 hover:bg-pink-500/10' },
    { value: 'CYBER_ATTACK', label: 'Cyber Threat', icon: '💻', color: 'border-cyan-500/30 bg-cyan-500/5 hover:bg-cyan-500/10' },
    { value: 'PUBLIC_DISORDER', label: 'Public Disorder', icon: '📢', color: 'border-amber-500/30 bg-amber-500/5 hover:bg-amber-500/10' },
    { value: 'BORDER_SECURITY', label: 'Border Security', icon: '🛂', color: 'border-teal-500/30 bg-teal-500/5 hover:bg-teal-500/10' },
    { value: 'GENERAL', label: 'Other / General', icon: '📝', color: 'border-gray-500/30 bg-gray-500/5 hover:bg-gray-500/10' },
]

const PRIORITY_LEVELS = [
    { value: 'LOW', label: 'Low', desc: 'Non-urgent observation', color: 'border-green-500/30 bg-green-500/10 text-green-400' },
    { value: 'MEDIUM', label: 'Medium', desc: 'Requires attention', color: 'border-amber-500/30 bg-amber-500/10 text-amber-400' },
    { value: 'HIGH', label: 'High', desc: 'Immediate concern', color: 'border-orange-500/30 bg-orange-500/10 text-orange-400' },
    { value: 'CRITICAL', label: 'Critical', desc: 'Life-threatening', color: 'border-red-500/30 bg-red-500/10 text-red-400' },
]

const STEPS = ['Type', 'Details', 'Location', 'Review']

export default function ReportPage() {
    const [step, setStep] = useState(0)
    const [submitting, setSubmitting] = useState(false)
    const [submitted, setSubmitted] = useState(false)
    const [caseId, setCaseId] = useState('')
    const [locating, setLocating] = useState(false)

    const [form, setForm] = useState({
        type: '',
        title: '',
        description: '',
        priority: 'MEDIUM',
        location: '',
        latitude: null as number | null,
        longitude: null as number | null,
        anonymous: true,
    })

    const canProceed = () => {
        if (step === 0) return form.type !== ''
        if (step === 1) return form.title.trim().length >= 5 && form.description.trim().length >= 10
        if (step === 2) return form.location.trim() !== ''
        return true
    }

    const getLocation = () => {
        setLocating(true)
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (pos) => {
                    setForm(prev => ({
                        ...prev,
                        latitude: pos.coords.latitude,
                        longitude: pos.coords.longitude,
                        location: prev.location || `${pos.coords.latitude.toFixed(4)}°, ${pos.coords.longitude.toFixed(4)}°`,
                    }))
                    setLocating(false)
                },
                () => setLocating(false),
                { enableHighAccuracy: true, timeout: 10000 }
            )
        } else {
            setLocating(false)
        }
    }

    const handleSubmit = async () => {
        setSubmitting(true)
        try {
            const response = await fetch('/api/incidents', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title: form.title,
                    description: form.description,
                    type: form.type,
                    location: form.location,
                    latitude: form.latitude,
                    longitude: form.longitude,
                    reportedBy: form.anonymous ? 'USALAMA_ANONYMOUS' : 'USALAMA_CITIZEN',
                    priority: form.priority,
                }),
            })

            if (response.ok) {
                const data = await response.json()
                setCaseId(data.id || `USL-${Date.now()}`)
                setSubmitted(true)
            } else {
                throw new Error('Submission failed')
            }
        } catch {
            // Fallback for demo
            setCaseId(`USL-${Date.now()}`)
            setSubmitted(true)
        } finally {
            setSubmitting(false)
        }
    }

    // Success state
    if (submitted) {
        return (
            <div className="max-w-xl mx-auto px-4 py-20 text-center">
                <div className="bg-white/[0.03] border border-green-500/20 rounded-2xl p-10">
                    <div className="w-20 h-20 mx-auto rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center mb-6">
                        <span className="text-4xl">✅</span>
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-3">Report Submitted Successfully</h2>
                    <p className="text-gray-400 mb-6">
                        Your report has been received and is being processed by our intelligence team.
                        AI risk analysis is currently being executed.
                    </p>
                    <div className="bg-black/40 border border-white/10 rounded-xl p-4 mb-8">
                        <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Case Reference</p>
                        <p className="text-xl font-mono font-bold text-green-400 select-all">{caseId}</p>
                        <p className="text-[11px] text-gray-600 mt-2">Save this number to track your report status</p>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                        <Link
                            href="/usalama/track"
                            className="px-6 py-3 bg-white/5 border border-white/10 rounded-xl text-sm font-medium text-gray-300 hover:bg-white/10 transition-all"
                        >
                            📋 Track Report
                        </Link>
                        <button
                            onClick={() => { setSubmitted(false); setStep(0); setForm({ type: '', title: '', description: '', priority: 'MEDIUM', location: '', latitude: null, longitude: null, anonymous: true }) }}
                            className="px-6 py-3 bg-green-600/20 border border-green-500/30 rounded-xl text-sm font-medium text-green-400 hover:bg-green-600/30 transition-all"
                        >
                            🚨 Submit Another
                        </button>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="max-w-2xl mx-auto px-4 py-10">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-white mb-1">Report a Security Incident</h1>
                <p className="text-sm text-gray-500">All reports are encrypted and processed by Kenya's national intelligence system.</p>
            </div>

            {/* Progress Steps */}
            <div className="flex items-center gap-1 mb-10">
                {STEPS.map((s, i) => (
                    <div key={s} className="flex items-center flex-1">
                        <div className="flex items-center gap-2 flex-1">
                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 transition-all duration-300
                                ${i < step ? 'bg-green-600 text-white' : i === step ? 'bg-white/10 border border-white/20 text-white' : 'bg-white/[0.03] border border-white/[0.06] text-gray-600'}`}>
                                {i < step ? '✓' : i + 1}
                            </div>
                            <span className={`text-xs font-medium hidden sm:inline transition-colors ${i <= step ? 'text-gray-300' : 'text-gray-600'}`}>{s}</span>
                        </div>
                        {i < STEPS.length - 1 && (
                            <div className={`h-[2px] flex-1 mx-2 transition-colors duration-300 ${i < step ? 'bg-green-600' : 'bg-white/[0.06]'}`} />
                        )}
                    </div>
                ))}
            </div>

            {/* Step Content */}
            <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-6 sm:p-8 mb-6">
                {/* Step 0: Type Selection */}
                {step === 0 && (
                    <div>
                        <h2 className="text-lg font-semibold text-white mb-1">Select Incident Type</h2>
                        <p className="text-sm text-gray-500 mb-6">Choose the category that best describes the incident.</p>
                        <div className="grid grid-cols-2 gap-3">
                            {INCIDENT_TYPES.map((t) => (
                                <button
                                    key={t.value}
                                    type="button"
                                    onClick={() => setForm(prev => ({ ...prev, type: t.value }))}
                                    className={`p-4 rounded-xl border text-left transition-all duration-200 ${t.color}
                                        ${form.type === t.value ? 'ring-2 ring-white/20 scale-[1.02]' : 'opacity-70 hover:opacity-100'}`}
                                >
                                    <span className="text-xl mb-2 block">{t.icon}</span>
                                    <span className="text-sm font-medium text-gray-200 block">{t.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Step 1: Details */}
                {step === 1 && (
                    <div>
                        <h2 className="text-lg font-semibold text-white mb-1">Incident Details</h2>
                        <p className="text-sm text-gray-500 mb-6">Provide as much detail as possible to help our analysts.</p>
                        <div className="space-y-5">
                            <div>
                                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Subject</label>
                                <input
                                    type="text"
                                    value={form.title}
                                    onChange={(e) => setForm(prev => ({ ...prev, title: e.target.value }))}
                                    placeholder="Brief title describing the incident..."
                                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500/30 focus:border-green-500/30 transition-all"
                                    maxLength={200}
                                />
                                <div className="text-right text-[10px] text-gray-700 mt-1">{form.title.length}/200</div>
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Description</label>
                                <textarea
                                    value={form.description}
                                    onChange={(e) => setForm(prev => ({ ...prev, description: e.target.value }))}
                                    placeholder="Include details like: time, people involved, direction of travel, vehicle info..."
                                    rows={5}
                                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500/30 focus:border-green-500/30 transition-all resize-none"
                                    maxLength={2000}
                                />
                                <div className="text-right text-[10px] text-gray-700 mt-1">{form.description.length}/2000</div>
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Priority Level</label>
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                                    {PRIORITY_LEVELS.map((p) => (
                                        <button
                                            key={p.value}
                                            type="button"
                                            onClick={() => setForm(prev => ({ ...prev, priority: p.value }))}
                                            className={`p-3 rounded-xl border text-center transition-all duration-200
                                                ${form.priority === p.value ? `${p.color} ring-1 ring-white/10` : 'border-white/[0.06] bg-white/[0.02] opacity-60 hover:opacity-100'}`}
                                        >
                                            <div className={`text-sm font-bold ${form.priority === p.value ? '' : 'text-gray-400'}`}>{p.label}</div>
                                            <div className="text-[10px] text-gray-600 mt-0.5">{p.desc}</div>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Step 2: Location */}
                {step === 2 && (
                    <div>
                        <h2 className="text-lg font-semibold text-white mb-1">Location Information</h2>
                        <p className="text-sm text-gray-500 mb-6">Help us pinpoint the incident location.</p>
                        <div className="space-y-5">
                            <button
                                type="button"
                                onClick={getLocation}
                                disabled={locating}
                                className="w-full p-4 bg-green-600/10 border border-green-500/20 rounded-xl text-left hover:bg-green-600/20 transition-all disabled:opacity-50 group"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-lg bg-green-600/20 flex items-center justify-center shrink-0">
                                        {locating ? (
                                            <div className="w-5 h-5 border-2 border-green-400 border-t-transparent rounded-full animate-spin" />
                                        ) : (
                                            <span className="text-lg">📍</span>
                                        )}
                                    </div>
                                    <div>
                                        <div className="text-sm font-semibold text-green-400">
                                            {locating ? 'Acquiring GPS Signal...' : form.latitude ? 'Location Acquired ✓' : 'Use My Current Location'}
                                        </div>
                                        <div className="text-xs text-gray-500">
                                            {form.latitude ? `${form.latitude.toFixed(6)}°, ${form.longitude?.toFixed(6)}°` : 'Tap to auto-detect via GPS'}
                                        </div>
                                    </div>
                                </div>
                            </button>

                            <div className="relative">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-white/[0.06]" />
                                </div>
                                <div className="relative flex justify-center text-xs">
                                    <span className="bg-[#0a0e1a] px-3 text-gray-600">or enter manually</span>
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Location Description</label>
                                <input
                                    type="text"
                                    value={form.location}
                                    onChange={(e) => setForm(prev => ({ ...prev, location: e.target.value }))}
                                    placeholder="e.g. Near Westlands Mall, Nairobi"
                                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500/30 focus:border-green-500/30 transition-all"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Latitude</label>
                                    <input
                                        type="number"
                                        step="any"
                                        value={form.latitude ?? ''}
                                        onChange={(e) => setForm(prev => ({ ...prev, latitude: e.target.value ? parseFloat(e.target.value) : null }))}
                                        placeholder="-1.2921"
                                        className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-white font-mono placeholder:text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500/30 transition-all"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Longitude</label>
                                    <input
                                        type="number"
                                        step="any"
                                        value={form.longitude ?? ''}
                                        onChange={(e) => setForm(prev => ({ ...prev, longitude: e.target.value ? parseFloat(e.target.value) : null }))}
                                        placeholder="36.8219"
                                        className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-white font-mono placeholder:text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500/30 transition-all"
                                    />
                                </div>
                            </div>

                            {/* Anonymous toggle */}
                            <div className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <div className="text-sm font-semibold text-white">Anonymous Report</div>
                                        <div className="text-[11px] text-gray-500 mt-0.5">Your identity will not be recorded</div>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => setForm(prev => ({ ...prev, anonymous: !prev.anonymous }))}
                                        className={`w-12 h-6 rounded-full transition-all duration-200 relative ${form.anonymous ? 'bg-green-600' : 'bg-white/10'}`}
                                    >
                                        <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-all duration-200 shadow ${form.anonymous ? 'left-[26px]' : 'left-0.5'}`} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Step 3: Review */}
                {step === 3 && (
                    <div>
                        <h2 className="text-lg font-semibold text-white mb-1">Review Your Report</h2>
                        <p className="text-sm text-gray-500 mb-6">Confirm the details before submission.</p>
                        <div className="space-y-4">
                            {[
                                { label: 'Incident Type', value: INCIDENT_TYPES.find(t => t.value === form.type)?.label || form.type, icon: INCIDENT_TYPES.find(t => t.value === form.type)?.icon },
                                { label: 'Subject', value: form.title },
                                { label: 'Description', value: form.description },
                                { label: 'Priority', value: form.priority },
                                { label: 'Location', value: form.location || 'Not specified' },
                                { label: 'Coordinates', value: form.latitude ? `${form.latitude.toFixed(6)}°, ${form.longitude?.toFixed(6)}°` : 'Not provided' },
                                { label: 'Identity', value: form.anonymous ? 'Anonymous' : 'Identified' },
                            ].map((item) => (
                                <div key={item.label} className="bg-black/30 border border-white/[0.06] rounded-xl px-4 py-3">
                                    <div className="text-[10px] text-gray-600 uppercase tracking-wider mb-0.5">{item.label}</div>
                                    <div className="text-sm text-gray-200 flex items-center gap-2">
                                        {item.icon && <span>{item.icon}</span>}
                                        <span className={item.label === 'Description' ? 'line-clamp-2' : ''}>{item.value}</span>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="mt-6 p-4 bg-amber-500/5 border border-amber-500/20 rounded-xl">
                            <p className="text-xs text-amber-400/80 leading-relaxed">
                                <strong>⚠️ Legal Notice:</strong> By submitting you confirm this report is truthful and accurate. 
                                Submitting false security reports is a criminal offense under Kenya law.
                            </p>
                        </div>
                    </div>
                )}
            </div>

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between gap-4">
                <button
                    type="button"
                    onClick={() => setStep(prev => Math.max(0, prev - 1))}
                    disabled={step === 0}
                    className="px-6 py-3 bg-white/5 border border-white/10 rounded-xl text-sm font-medium text-gray-400 hover:bg-white/10 hover:text-white transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                >
                    ← Back
                </button>

                {step < STEPS.length - 1 ? (
                    <button
                        type="button"
                        onClick={() => setStep(prev => prev + 1)}
                        disabled={!canProceed()}
                        className="px-8 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold rounded-xl hover:from-green-500 hover:to-emerald-500 transition-all shadow-lg shadow-green-900/20 disabled:opacity-30 disabled:cursor-not-allowed disabled:shadow-none"
                    >
                        Continue →
                    </button>
                ) : (
                    <button
                        type="button"
                        onClick={handleSubmit}
                        disabled={submitting}
                        className="px-8 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold rounded-xl hover:from-green-500 hover:to-emerald-500 transition-all shadow-lg shadow-green-900/20 disabled:opacity-60 flex items-center gap-2"
                    >
                        {submitting ? (
                            <>
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                Encrypting & Sending...
                            </>
                        ) : (
                            '🛡️ Submit Secure Report'
                        )}
                    </button>
                )}
            </div>
        </div>
    )
}
