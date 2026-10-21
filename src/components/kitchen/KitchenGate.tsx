import type { ReactNode } from 'react';

interface KitchenGateProps {
  children: ReactNode;
}

/**
 * Access gate placeholder for the kitchen display.
 * TODO: enforce per-outlet PIN (?key=...) validated server-side against
 * lakuloka-be before rendering children. Dummy phase: open access.
 */
export default function KitchenGate({ children }: KitchenGateProps) {
  return <>{children}</>;
}
