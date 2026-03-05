'use client';

import React from 'react';
import { FileText, CheckCircle2, Shield, Lock } from 'lucide-react';
import { DesignSystem } from '@/lib/nctirs/designSystem';

interface LedgerEntry {
    id: string;
    action: string;
    agency: string;
    timestamp: string;
    hash: string;
    status: 'VERIFIED' | 'PENDING';
}

const entries: LedgerEntry[] = [
    { id: 'TX-8821', action: 'INCIDENT_SIGNED', agency: 'NIS', timestamp: '10:42:01', hash: '8a72...f9e1', status: 'VERIFIED' },
    { id: 'TX-8822', action: 'DEPLOYMENT_LOGGED', agency: 'GSU', timestamp: '10:45:30', hash: '2b11...a4d2', status: 'VERIFIED' },
    { id: 'TX-8823', action: 'SIGINT_COLLECTED', agency: 'DCI', timestamp: '11:02:15', hash: 'e3c0...7b55', status: 'VERIFIED' },
    { id: 'TX-8824', action: 'ASSET_REDEPLOYED', agency: 'KDF', timestamp: '11:15:00', hash: 'd9f2...8c3e', status: 'PENDING' },
];

const ForensicLedger: React.FC = () => {
    return (
        <div className={`flex flex-col h-full bg-[#000500] border border-[#003b00] rounded-sm ${DesignSystem.layout.cardShadow}`}>
            <div className="p-2 border-b border-[#003b00] bg-[#001000] flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Lock className="w-3 h-3 text-green-500" />
                    <span className="text-[10px] font-bold text-green-400 uppercase tracking-widest">Forensic Ledger v2</span>
                </div>
                <div className="flex items-center gap-1">
                    <Shield className="w-2.5 h-2.5 text-blue-500" />
                    <span className="text-[8px] text-blue-500 font-mono">DPA_COMPLIANT</span>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-2 custom-scrollbar">
                <div className="space-y-px">
                    {entries.map((entry) => (
                        <div key={entry.id} className="p-2 bg-black border-l-2 border-l-[#003b00] hover:border-l-green-500 hover:bg-[#001500] transition-all group">
                            <div className="flex justify-between items-start mb-1">
                                <span className="text-[9px] font-black text-gray-500 group-hover:text-green-400 transition-colors uppercase">{entry.action}</span>
                                <span className="text-[8px] font-mono text-gray-600">{entry.timestamp}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <div className="flex items-center gap-2">
                                    <span className="text-[9px] font-mono text-[#00ff41] opacity-70 bg-[#003b00/20] px-1 rounded-sm">{entry.agency}</span>
                                    <span className="text-[8px] font-mono text-gray-600 truncate max-w-[60px]">{entry.hash}</span>
                                </div>
                                {entry.status === 'VERIFIED' ? (
                                    <CheckCircle2 className="w-3 h-3 text-green-500" />
                                ) : (
                                    <div className="w-3 h-3 border border-gray-600 rounded-full animate-spin border-t-transparent"></div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="p-2 bg-[#001000] border-t border-[#003b00]">
                <div className="flex justify-between items-center opacity-50">
                    <span className="text-[8px] font-mono text-gray-500">CHAIN_HEIGHT</span>
                    <span className="text-[8px] font-mono text-green-600">4,129,082</span>
                </div>
            </div>
        </div>
    );
};

export default ForensicLedger;
