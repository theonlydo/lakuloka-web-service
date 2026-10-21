/**
 * Module registry — the single place that maps a hostname to a web module.
 * Each module lives under its own path prefix (app/resto, app/tracking,
 * ...); the middleware rewrites the domain root to that prefix so public
 * URLs stay clean (resto.lakuloka.id/demo, not /resto/demo).
 * Adding a new module later = 1 entry in MODULES + 1 app/<prefix> folder.
 */

export type ModuleId = 'resto' | 'tracking' | 'kitchen' | 'queue';

export interface ModuleInfo {
  id: ModuleId;
  /** Path prefix under app/, e.g. "resto" */
  prefix: string;
  /** Canonical production host */
  host: string;
  /** Local-dev host (add `127.0.0.1 <name>.test` to /etc/hosts) */
  devHost: string;
}

export const MODULES: ModuleInfo[] = [
  { id: 'resto', prefix: 'resto', host: 'resto.lakuloka.id', devHost: 'resto.test' },
  { id: 'tracking', prefix: 'tracking', host: 'tracking.lakuloka.id', devHost: 'tracking.test' },
  { id: 'kitchen', prefix: 'kitchen', host: 'kitchen.lakuloka.id', devHost: 'kitchen.test' },
  { id: 'queue', prefix: 'queue', host: 'queue.lakuloka.id', devHost: 'queue.test' },
];

const HOST_MAP: Record<string, ModuleId> = {};
for (const m of MODULES) {
  HOST_MAP[m.host] = m.id;
  HOST_MAP[m.devHost] = m.id;
}

/** Match a Host header value (may include port) to a module, or null. */
export function matchHostname(host: string | null): ModuleId | null {
  if (!host) return null;
  const name = host.split(':')[0].trim().toLowerCase();
  return HOST_MAP[name] ?? null;
}

export function prefixForModule(id: ModuleId): string {
  return id;
}

export function isModuleId(value: string | null): value is ModuleId {
  return value === 'resto' || value === 'tracking' || value === 'kitchen' || value === 'queue';
}
