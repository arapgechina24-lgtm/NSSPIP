'use client'

import { Inter } from 'next/font/google'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import '@/app/globals.css'

const inter = Inter({ subsets: ['latin'] })

export default function UsalamaLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const pathname = usePathname()

    const navLinks = [
        { href: '/usalama', label: 'Home', icon: '🏠' },
        { href: '/usalama/report', label: 'Report Incident', icon: '🚨' },
        { href: '/usalama/track', label: 'Track Report', icon: '📋' },
    ]

    return (
        <div className={`min-h-screen bg-[#0a0e1a] text-gray-100 ${inter.className}`}>
            {/* Navigation */}
            <header className="sticky top-0 z-50 border-b border-white/5 bg-[#0a0e1a]/95 backdrop-blur-xl">
                <div className="max-w-6xl mx-auto px-4 sm:px-6">
                    <div className="flex items-center justify-between h-16">
                        {/* Brand */}
                        <Link href="/usalama" className="flex items-center gap-3 group">
                            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-green-600 to-emerald-700 flex items-center justify-center shadow-lg shadow-green-900/30 group-hover:shadow-green-800/50 transition-shadow">
                                <span className="text-xl">🛡️</span>
                            </div>
                            <div className="hidden sm:block">
                                <h1 className="text-lg font-bold tracking-tight text-white leading-none">
                                    USALAMA
                                </h1>
                                <p className="text-[10px] text-gray-500 tracking-widest uppercase">
                                    Kenya Security Reporting
                                </p>
                            </div>
                        </Link>

                        {/* Nav Links */}
                        <nav className="flex items-center gap-1">
                            {navLinks.map((link) => {
                                const isActive = pathname === link.href
                                return (
                                    <Link
                                        key={link.href}
                                        href={link.href}
                                        className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2
                                            ${isActive
                                                ? 'bg-white/10 text-white shadow-inner'
                                                : 'text-gray-400 hover:text-white hover:bg-white/5'
                                            }`}
                                    >
                                        <span className="text-base">{link.icon}</span>
                                        <span className="hidden sm:inline">{link.label}</span>
                                    </Link>
                                )
                            })}
                        </nav>

                        {/* Emergency */}
                        <a
                            href="tel:999"
                            className="flex items-center gap-2 px-4 py-2 bg-red-600/20 border border-red-500/30 rounded-lg text-red-400 text-sm font-semibold hover:bg-red-600/30 transition-all"
                        >
                            <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                            <span className="hidden sm:inline">Emergency 999</span>
                            <span className="sm:hidden">999</span>
                        </a>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1">
                {children}
            </main>

            {/* Footer */}
            <footer className="border-t border-white/5 bg-[#060810]">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div>
                            <div className="flex items-center gap-2 mb-3">
                                <span className="text-lg">🛡️</span>
                                <span className="font-bold text-white">USALAMA</span>
                            </div>
                            <p className="text-xs text-gray-500 leading-relaxed">
                                Kenya National Security Reporting Platform. Empowering citizens 
                                to report security incidents anonymously and securely.
                            </p>
                        </div>
                        <div>
                            <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Quick Links</h4>
                            <div className="space-y-2">
                                <Link href="/usalama/report" className="block text-sm text-gray-500 hover:text-white transition-colors">Report an Incident</Link>
                                <Link href="/usalama/track" className="block text-sm text-gray-500 hover:text-white transition-colors">Track Your Report</Link>
                            </div>
                        </div>
                        <div>
                            <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Security</h4>
                            <div className="space-y-2 text-xs text-gray-500">
                                <div className="flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                                    End-to-end encrypted
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                                    Anonymous reporting
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                                    24/7 monitoring active
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="border-t border-white/5 mt-8 pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
                        <p className="text-[11px] text-gray-600">
                            © {new Date().getFullYear()} Republic of Kenya • National Security Service
                        </p>
                        <p className="text-[10px] text-gray-700">
                            All reports are processed in compliance with the Data Protection Act, 2019
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    )
}
