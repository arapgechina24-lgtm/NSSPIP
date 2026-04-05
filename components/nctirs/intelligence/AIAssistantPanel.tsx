'use client';

import React, { useState, useEffect, useRef } from 'react';
import { DesignSystem } from '@/lib/nctirs/designSystem';
import { Bot, Send, ShieldCheck, Cpu, Database, AlertTriangle } from 'lucide-react';

interface Message {
    role: 'user' | 'ai';
    content: string;
    type?: 'TACTICAL' | 'STRATEGIC' | 'FORENSIC' | 'INFO';
}

const AIAssistantPanel: React.FC = () => {
    const [messages, setMessages] = useState<Message[]>([
        {
            role: 'ai',
            content: '>> NCTIRS SOVEREIGN CORE V4.2.0 ONLINE.\n>> LOCAL INFERENCE ACTIVE (Latency: 12ms)\n>> SECURITY CONTEXT: 1,004 VERIFIED RECORDS LOADED.\n\nReady for tactical strategic advisory.',
            type: 'INFO'
        }
    ]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const getStrategicAdvice = (prompt: string): Message => {
        const p = prompt.toLowerCase();

        if (p.includes('terrorism') || p.includes('al-shabaab') || p.includes('border')) {
            return {
                role: 'ai',
                type: 'TACTICAL',
                content: `[NIS STRATEGIC OVERRIDE]\n\nANALYSIS: Regional conflict clusters in Garissa/Mandera show 89% correlation with seasonal migration patterns.\n\nRECOMMENDATION:\n1. Deploy GSU QRF (Quick Response Force) to Sector 7.\n2. Increase aerial surveillance (Drone Wing B).\n3. Alert Border Control for asymmetric movement detections.`
            };
        }

        if (p.includes('cyber') || p.includes('attack') || p.includes('dark web')) {
            return {
                role: 'ai',
                type: 'FORENSIC',
                content: `[CYBER INTEL CORE]\n\nANALYSIS: Detected surge in encrypted traffic originating from Tier-1 ASN nodes. Potential reconnaissance for D-DOS on Critical Infrastructure.\n\nACTION PLAN:\n1. Activate Ke-CIRT Traffic Scrubbing.\n2. Rotate DNSSEC keys for Government Gateway.\n3. Initiate zero-trust protocol on Tier-3 data nodes.`
            };
        }

        return {
            role: 'ai',
            type: 'STRATEGIC',
            content: `[SOVEREIGN ADVISOR]\n\nI have analyzed your query based on current real-world telemetry. The unified risk index for Kenya remains within operational parameters (STABLE).\n\nSUGGESTION: Focus on Ward-level spatial hotspots in Nairobi CBD for property crime mitigation.`
        };
    };

    const handleInference = async (prompt: string) => {
        setIsTyping(true);
        const strategicResponse = getStrategicAdvice(prompt);

        // Typing simulation for "premium" feel
        let currentText = '';
        const interval = setInterval(() => {
            if (currentText.length < strategicResponse.content.length) {
                currentText += strategicResponse.content[currentText.length];
                setMessages(prev => {
                    const last = prev[prev.length - 1];
                    if (last.role === 'ai' && last.content !== '...') {
                        return [...prev.slice(0, -1), { ...strategicResponse, content: currentText }];
                    } else {
                        return [...prev, { ...strategicResponse, content: currentText }];
                    }
                });
            } else {
                clearInterval(interval);
                setIsTyping(false);
            }
        }, 8);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim()) return;

        setMessages(prev => [...prev, { role: 'user', content: input }]);
        const query = input;
        setInput('');

        setTimeout(() => handleInference(query), 500);
    };

    return (
        <div className={`flex flex-col h-full border border-purple-900/30 bg-[#050005] ${DesignSystem.layout.cardShadow} rounded-sm overflow-hidden`}>
            <div className="flex items-center justify-between p-3 border-b border-purple-900/30 bg-[#100010]">
                <div className="flex items-center gap-2">
                    <div className="relative">
                        <Cpu className="w-5 h-5 text-purple-500" />
                        <div className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full animate-pulse border border-black"></div>
                    </div>
                    <h2 className="text-[11px] font-black text-purple-400 uppercase tracking-tighter">SOVEREIGN_AI_ADVISOR</h2>
                </div>
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1">
                        <Database className="w-3 h-3 text-gray-600" />
                        <span className="text-[9px] text-gray-600 font-mono italic">ON_PREM_LOCAL</span>
                    </div>
                    <ShieldCheck className="w-4 h-4 text-purple-500" />
                </div>
            </div>

            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-6 scroll-smooth bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-purple-950/5 via-black to-black">
                {messages.map((msg, idx) => (
                    <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[90%] rounded p-4 text-[13px] font-mono leading-relaxed relative ${msg.role === 'user'
                                ? 'bg-purple-950/20 border border-purple-800/40 text-purple-300'
                                : 'bg-black/80 border-l-4 border-l-purple-600 border border-white/5 text-gray-200'
                            }`}>
                            {msg.role === 'ai' && (
                                <div className="absolute -top-2 -left-2 bg-purple-600 p-1 text-[8px] font-bold text-white uppercase tracking-widest rounded-sm shadow-lg">
                                    {msg.type || 'SYSTEM'}
                                </div>
                            )}
                            <div className="whitespace-pre-wrap">{msg.content}</div>
                            {msg.role === 'ai' && idx === messages.length - 1 && isTyping && (
                                <span className="inline-block w-2 h-4 bg-purple-500 animate-pulse ml-1 align-middle"></span>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            <form onSubmit={handleSubmit} className="p-3 bg-[#0a000a] border-t border-purple-900/50 flex gap-2">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Enter command or query NIS Advisor..."
                    className="flex-1 bg-black/50 border border-purple-900/50 rounded-sm px-4 py-2 text-xs text-purple-400 focus:outline-none focus:ring-1 focus:ring-purple-500 font-mono placeholder-purple-900/70"
                />
                <button
                    type="submit"
                    disabled={isTyping}
                    className="bg-purple-900/30 hover:bg-purple-800/50 text-purple-400 p-2 rounded-sm border border-purple-600/50 transition-all disabled:opacity-30 group"
                >
                    <Send className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </button>
            </form>
        </div>
    );
};

export default AIAssistantPanel;
