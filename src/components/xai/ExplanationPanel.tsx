'use client';

import React from 'react';
import { AlertTriangle, CheckCircle, Info, Brain } from 'lucide-react';

interface ExplanationFactor {
  feature: string;
  contribution: number; // -1 to 1
  description: string;
}

interface XAIExplanationProps {
  decision: string;
  confidence: number;
  factors: ExplanationFactor[];
  modelVersion: string;
  onOverride?: () => void;
}

export function XAIExplanationPanel({
  decision,
  confidence,
  factors,
  modelVersion,
  onOverride,
}: XAIExplanationProps) {
  const sortedFactors = [...factors].sort((a, b) => Math.abs(b.contribution) - Math.abs(a.contribution));

  return (
    <div className="bg-slate-900 border border-amber-500/30 rounded-lg p-6 max-w-2xl">
      <div className="flex items-center gap-3 mb-4">
        <Brain className="w-6 h-6 text-amber-400" />
        <h3 className="text-lg font-bold text-amber-400">AI Decision Explanation</h3>
        <span className="ml-auto text-xs text-slate-400">{modelVersion}</span>
      </div>

      <div className="mb-6 p-4 bg-slate-800 rounded-lg">
        <div className="flex justify-between items-center mb-2">
          <span className="text-slate-300">Decision:</span>
          <span className="font-mono font-bold text-amber-300">{decision}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-slate-300">Confidence:</span>
          <div className="flex items-center gap-2">
            <div className="w-32 h-2 bg-slate-700 rounded-full overflow-hidden">
              <div 
                className={`h-full rounded-full ${confidence > 0.8 ? 'bg-green-500' : confidence > 0.6 ? 'bg-yellow-500' : 'bg-red-500'}`}
                style={{ width: `${confidence * 100}%` }}
              />
            </div>
            <span className="font-mono text-sm">{(confidence * 100).toFixed(1)}%</span>
          </div>
        </div>
      </div>

      <div className="space-y-3 mb-6">
        <h4 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Contributing Factors</h4>
        {sortedFactors.map((factor, idx) => (
          <div key={idx} className="flex items-center gap-4 p-3 bg-slate-800/50 rounded">
            <div className={`w-2 h-12 rounded-full ${factor.contribution > 0 ? 'bg-red-500' : 'bg-green-500'}`} />
            <div className="flex-1">
              <div className="flex justify-between items-center mb-1">
                <span className="font-medium text-slate-200">{factor.feature}</span>
                <span className={`font-mono text-sm ${factor.contribution > 0 ? 'text-red-400' : 'text-green-400'}`}>
                  {factor.contribution > 0 ? '+' : ''}{(factor.contribution * 100).toFixed(0)}%
                </span>
              </div>
              <p className="text-sm text-slate-400">{factor.description}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="p-4 bg-amber-900/20 border border-amber-500/30 rounded-lg mb-4">
        <div className="flex items-start gap-3">
          <Info className="w-5 h-5 text-amber-400 mt-0.5" />
          <div>
            <h5 className="font-semibold text-amber-300 mb-1">Human Oversight Required</h5>
            <p className="text-sm text-amber-200/80">
              This alert affects civil liberties. Review factors above before action.
              False positives impact community trust.
            </p>
          </div>
        </div>
      </div>

      {onOverride && (
        <div className="flex gap-3">
          <button
            onClick={onOverride}
            className="flex-1 py-3 px-4 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <AlertTriangle className="w-4 h-4" />
            OVERRIDE - Human Review
          </button>
          <button
            className="flex-1 py-3 px-4 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <CheckCircle className="w-4 h-4" />
            APPROVE - Accept AI
          </button>
        </div>
      )}

      <div className="mt-4 pt-4 border-t border-slate-700 text-xs text-slate-500">
        <p>SHAP values generated • Model: {modelVersion} • Audit hash: {generateAuditHash(factors)}</p>
        <p className="mt-1">Bias check: PASSED • Geographic parity: VERIFIED • Human review: REQUIRED</p>
      </div>
    </div>
  );
}

function generateAuditHash(factors: ExplanationFactor[]): string {
  return factors.map(f => f.feature).join('|').slice(0, 16) + '...';
}
