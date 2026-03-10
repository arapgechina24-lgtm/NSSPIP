'use client';

import React, { createContext, useContext, useMemo } from 'react';
import { useSession } from 'next-auth/react';

export type ClearanceLevel = 'L1' | 'L2' | 'L3' | 'L4';

interface RBACContextValue {
  role: ClearanceLevel;
  roleName: string;
  isAtLeast: (level: ClearanceLevel) => boolean;
  canAccess: (level: ClearanceLevel) => boolean;
}

const ROLE_HIERARCHY: Record<ClearanceLevel, number> = {
  L1: 1, // Field Officer
  L2: 2, // Sector Analyst
  L3: 3, // Commanding Officer
  L4: 4, // Director / Admin
};

const ROLE_NAMES: Record<ClearanceLevel, string> = {
  L1: 'Field Officer',
  L2: 'Sector Analyst',
  L3: 'Commanding Officer',
  L4: 'Director',
};

const RBACContext = createContext<RBACContextValue>({
  role: 'L1',
  roleName: 'Field Officer',
  isAtLeast: () => false,
  canAccess: () => false,
});

export function RBACProvider({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const userRole = ((session?.user as any)?.role as ClearanceLevel) || 'L1';

  const value = useMemo<RBACContextValue>(() => ({
    role: userRole,
    roleName: ROLE_NAMES[userRole] || 'Field Officer',
    isAtLeast: (level: ClearanceLevel) => {
      return (ROLE_HIERARCHY[userRole] ?? 1) >= (ROLE_HIERARCHY[level] ?? 1);
    },
    canAccess: (level: ClearanceLevel) => {
      return (ROLE_HIERARCHY[userRole] ?? 1) >= (ROLE_HIERARCHY[level] ?? 1);
    },
  }), [userRole]);

  return (
    <RBACContext.Provider value={value}>
      {children}
    </RBACContext.Provider>
  );
}

export function useRBAC() {
  return useContext(RBACContext);
}

export { ROLE_HIERARCHY, ROLE_NAMES };
