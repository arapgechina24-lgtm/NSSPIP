'use client';

import React from 'react';
import { Shield, Zap, Users, Activity } from 'lucide-react';
import { DesignSystem } from '@/lib/nctirs/designSystem';

interface AgencyStatus {
    name: string;
    acronym: string;
    status: 'ONLINE' | 'RESPONSE_ACTIVE' | 'STANDBY' | 'OFFLINE';
    readiness: number;
    color: string;
}

const agencies: AgencyStatus[] = [
    { name: 'National Intelligence Service', acronym: 'NIS', status: 'ONLINE', readiness: 98, color: '#a855f7' },
    { name: 'General Service Unit', acronym: 'GSU', status: 'RESPONSE_ACTIVE', readiness: 92, color: '#ef4444' },
    { name: 'Directorate of Criminal Invest.', acronym: 'DCI', status: 'ONLINE', readiness: 85, color: '#3b82f6' },
    { name: 'Kenya Defence Forces', acronym: 'KDF', status: 'STANDBY', readiness: 95, color: '#16a34a' },
];

const InterAgencyFusion: React.FC = () => {
    return (
        <div className={`p-4 border border-[#003b00] bg-black/80 rounded-sm ${DesignSystem.layout.cardShadow}`}>
            <div className="flex items-center gap-2 mb-4 border-b border-[#003b00] pb-2">
                <Shield className="w-5 h-5 text-green-400" />
                <h3 className="text-xs font-bold text-green-400 uppercase tracking-widest">Inter-Agency Fusion Center</h3>
            </div>

            <div className="space-y-4">
                {agencies.map((agency) => (
                    <div key={agency.acronym} className="group cursor-default">
                        <div className="flex justify-between items-end mb-1">
                            <div className="flex items-center gap-2">
                                <div className={`w-2 h-2 rounded-full ${agency.status === 'RESPONSE_ACTIVE' ? 'animate-pulse' : ''}`} style={{ backgroundColor: agency.color }}></div>
                                <span className="text-[11px] font-bold text-gray-300">{agency.acronym}</span>
                                <span className="text-[9px] text-gray-500 hidden group-hover:block transition-all">{agency.name}</span>
                            </div>
                            <span className="text-[10px] font-mono text-gray-400">{agency.readiness}% RDY</span>
                        </div>

                        <div className="h-1 w-full bg-[#001500] rounded-full overflow-hidden">
                            <div
                                className="h-full transition-all duration-1000"
                                style={{
                                    width: `${agency.readiness}%`,
                                    backgroundColor: agency.color,
                                    boxShadow: `0 0 10px ${agency.color}40`
                                }}
                            ></div>
                        </div>

                        <div className="flex justify-between mt-1 px-1">
                            <span className={`text-[8px] font-bold ${agency.status === 'RESPONSE_ACTIVE' ? 'text-red-500' : 'text-green-500'}`}>
                                {agency.status.replace('_', ' ')}
                            </span>
                            <div className="flex gap-2">
                                <Activity className="w-2 h-2 text-gray-600" />
                                <Users className="w-2 h-2 text-gray-600" />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-6 pt-4 border-t border-[#003b00]">
                <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] text-gray-400 font-mono">INTEL_COOPERATION_RATIO</span>
                    <span className="text-[10px] text-purple-400 font-bold">0.89</span>
                </div>
                <div className="flex gap-1">
                    {[...Array(10)].map((_, i) => (
                        <div key={i} className={`h-3 flex-1 ${i < 9 ? 'bg-purple-500/80 shadow-[0_0_5px_rgba(168,85,247,0.5)]' : 'bg-gray-800'}`}></div>
                    ))}
                </div>
                <p className="text-[9px] text-gray-500 mt-2 font-mono italic">
                    {">> "} Sovereign data fusion active via Ke-CIRT mesh.
                </p>
            </div>
        </div>
    );
};

export default InterAgencyFusion;
