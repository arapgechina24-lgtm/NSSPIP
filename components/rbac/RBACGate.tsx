'use client';

import React from 'react';
import { useRBAC, type ClearanceLevel } from '@/contexts/RBACContext';
import { ShieldAlert, Lock } from 'lucide-react';

interface RBACGateProps {
  minLevel: ClearanceLevel;
  children: React.ReactNode;
  fallback?: React.ReactNode;
  showBadge?: boolean;
}

/**
 * RBACGate — wraps UI elements that require minimum clearance level.
 * Shows a "Clearance Required" badge when the user doesn't have access.
 */
export function RBACGate({ minLevel, children, fallback, showBadge = true }: RBACGateProps) {
  const { isAtLeast, role, roleName } = useRBAC();

  if (isAtLeast(minLevel)) {
    return <>{children}</>;
  }

  if (fallback) {
    return <>{fallback}</>;
  }

  if (!showBadge) {
    return null;
  }

  return (
    <div className="relative group">
      {/* Blurred locked content */}
      <div className="filter blur-sm opacity-30 pointer-events-none select-none" aria-hidden="true">
        {children}
      </div>

      {/* Clearance required overlay */}
      <div className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm border border-red-900/30">
        <div className="text-center p-4">
          <Lock className="w-8 h-8 text-red-500 mx-auto mb-2" />
          <p className="text-red-400 text-xs font-bold uppercase tracking-wider mb-1">
            Clearance Required
          </p>
          <p className="text-gray-500 text-[10px] font-mono">
            Minimum: {minLevel} • Current: {role} ({roleName})
          </p>
        </div>
      </div>
    </div>
  );
}

/**
 * Inline RBAC indicator — shows a small badge next to restricted elements
 */
export function ClearanceBadge({ level }: { level: ClearanceLevel }) {
  const colors: Record<ClearanceLevel, string> = {
    L1: 'bg-green-900/50 text-green-400 border-green-700',
    L2: 'bg-amber-900/50 text-amber-400 border-amber-700',
    L3: 'bg-red-900/50 text-red-400 border-red-700',
    L4: 'bg-purple-900/50 text-purple-400 border-purple-700',
  };

  return (
    <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 text-[9px] font-mono uppercase border ${colors[level]}`}>
      <ShieldAlert className="w-2.5 h-2.5" />
      {level}
    </span>
  );
}
