'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Play, ShieldAlert, Zap, Waves, X } from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";

interface DemoModeProps {
    onTriggerEmergency: (type?: string) => void;
}

export default function DemoModeController({ onTriggerEmergency }: DemoModeProps) {
    const [demoMode, setDemoMode] = useState(false);
    const [showScenarios, setShowScenarios] = useState(false);
    const router = useRouter();

    // Keyboard shortcuts
    const handleKeyDown = useCallback((e: KeyboardEvent) => {
        // Ctrl+Shift+E = Emergency
        if (e.ctrlKey && e.shiftKey && e.key === 'E') {
            e.preventDefault();
            setShowScenarios(true);
        }
        // Ctrl+Shift+A = Audit Trail
        if (e.ctrlKey && e.shiftKey && e.key === 'A') {
            e.preventDefault();
            router.push('/dashboard/compliance');
        }
        // Ctrl+Shift+D = Demo Mode
        if (e.ctrlKey && e.shiftKey && e.key === 'D') {
            e.preventDefault();
            setDemoMode(prev => !prev);
        }
    }, [router]);

    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [handleKeyDown]);

    const triggerScenario = (type: string) => {
        onTriggerEmergency(type);
        setShowScenarios(false);
    }

    return (
        <>
            {/* Demo Mode Toggle Button */}
            <button
                onClick={() => setShowScenarios(true)}
                className={`fixed bottom-4 left-4 z-50 px-3 py-2 text-[10px] flex items-center gap-2 font-mono uppercase transition-all bg-red-950/80 text-red-500 border border-red-900/50 hover:bg-red-900/80 hover:border-red-500 shadow-xl backdrop-blur-sm shadow-red-900/20`}
            >
                <Play className="w-3 h-3" />
                Trigger Scenarios
            </button>

            {/* Scenario Selection Modal */}
            {showScenarios && (
                <div className="fixed bottom-16 left-4 z-50 w-80 animate-in slide-in-from-bottom-5">
                    <Card className="bg-black/90 border-red-900/50 backdrop-blur-md rounded-none shadow-2xl">
                        <div className="flex justify-between items-center p-3 border-b border-red-900/30">
                            <span className="text-xs text-red-500 font-bold uppercase tracking-wider flex items-center gap-2">
                                <ShieldAlert className="w-4 h-4" />
                                Select Threat Simulation
                            </span>
                            <button onClick={() => setShowScenarios(false)} className="text-gray-500 hover:text-white">
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                        <CardContent className="p-0 divide-y divide-red-900/20 text-xs font-mono">
                            <button 
                                onClick={() => triggerScenario('TERROR')} 
                                className="w-full text-left p-3 hover:bg-red-900/20 transition-colors flex items-start gap-3 group"
                            >
                                <div className="mt-1 bg-red-950 p-1.5"><ShieldAlert className="w-4 h-4 text-red-500 group-hover:text-red-400" /></div>
                                <div>
                                    <div className="text-red-400 font-bold">Kinetic Terror Attack</div>
                                    <div className="text-gray-500 text-[10px] mt-0.5">Mall breach + IED + hostage scenario.</div>
                                </div>
                            </button>
                            <button 
                                onClick={() => triggerScenario('CYBER_PHYSICAL')} 
                                className="w-full text-left p-3 hover:bg-amber-900/20 transition-colors flex items-start gap-3 group"
                            >
                                <div className="mt-1 bg-amber-950 p-1.5"><Zap className="w-4 h-4 text-amber-500 group-hover:text-amber-400" /></div>
                                <div>
                                    <div className="text-amber-400 font-bold">Cyber-Physical Coordination</div>
                                    <div className="text-gray-500 text-[10px] mt-0.5">Grid takedown leading to physical infiltration.</div>
                                </div>
                            </button>
                            <button 
                                onClick={() => triggerScenario('DISASTER')} 
                                className="w-full text-left p-3 hover:bg-blue-900/20 transition-colors flex items-start gap-3 group"
                            >
                                <div className="mt-1 bg-blue-950 p-1.5"><Waves className="w-4 h-4 text-blue-500 group-hover:text-blue-400" /></div>
                                <div>
                                    <div className="text-blue-400 font-bold">Disaster + Security Overlay</div>
                                    <div className="text-gray-500 text-[10px] mt-0.5">Urban flooding cascades to mass looting.</div>
                                </div>
                            </button>
                        </CardContent>
                    </Card>
                </div>
            )}

            {/* Keyboard Shortcut Hints */}
            <div className="fixed bottom-4 right-4 z-50 text-[9px] font-mono text-gray-600 space-y-1">
                <div><kbd className="bg-gray-800 px-1 rounded">Ctrl+Shift+E</kbd> Trigger Scenarios</div>
                <div><kbd className="bg-gray-800 px-1 rounded">Ctrl+Shift+A</kbd> Forensics</div>
            </div>
        </>
    );
}
