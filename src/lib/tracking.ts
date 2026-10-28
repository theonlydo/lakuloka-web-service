/**
 * Public job tracking (F-29 K8). The token in the URL is the capability;
 * no login is required, but the API also requires the trusted web server's
 * daily X-Menu-Key. BFF unwraps kasir-go's envelope, so `data` is the
 * JobTracking object directly.
 */

import { getApiBaseUrl, webHeaders } from './webToken';

export type JobStatus =
  | 'received'
  | 'waiting_confirmation'
  | 'in_progress'
  | 'ready'
  | 'completed'
  | 'cancelled';

export interface TrackingTimelineEntry {
  status: JobStatus;
  at: string;
}

export interface TrackingResult {
  jobName: string;
  status: JobStatus;
  receivedAt: string | null;
  estimatedDoneAt: string | null;
  itemCount: number;
  itemNames: string[];
  timeline: TrackingTimelineEntry[];
}

export const JOB_STATUS_LABEL: Record<JobStatus, string> = {
  received: 'Orderan diterima',
  waiting_confirmation: 'Menunggu Konfirmasi',
  in_progress: 'Proses',
  ready: 'Selesai',
  completed: 'Completed',
  cancelled: 'Dibatalkan',
};

export const JOB_STATUS_ORDER: JobStatus[] = [
  'received',
  'in_progress',
  'ready',
  'completed',
];

const STATUSES = new Set<string>(Object.keys(JOB_STATUS_LABEL));

function normalizeStatus(value: unknown): JobStatus {
  const raw = typeof value === 'string' ? value : '';
  return STATUSES.has(raw) ? (raw as JobStatus) : 'received';
}

export async function fetchTracking(token: string): Promise<TrackingResult> {
  const trimmed = token.trim();
  if (!trimmed) throw new Error('NOT_FOUND');

  const res = await fetch(
    `${getApiBaseUrl()}/public/track/${encodeURIComponent(trimmed)}`,
    { headers: webHeaders(), cache: 'no-store' }
  );

  if (res.status === 401) throw new Error('UNAUTHORIZED');
  if (res.status === 404) throw new Error('NOT_FOUND');
  if (res.status === 429) throw new Error('RATE_LIMITED');
  if (!res.ok) throw new Error(`Failed to fetch tracking: ${res.status}`);

  const json = await res.json();
  const data = (json.data ?? json) as Partial<TrackingResult> & {
    status?: unknown;
  };

  return {
    jobName: data.jobName ?? '',
    status: normalizeStatus(data.status),
    receivedAt: data.receivedAt ?? null,
    estimatedDoneAt: data.estimatedDoneAt ?? null,
    itemCount: Number(data.itemCount ?? data.itemNames?.length ?? 0),
    itemNames: Array.isArray(data.itemNames) ? data.itemNames : [],
    timeline: Array.isArray(data.timeline)
      ? data.timeline.map((entry) => ({
          status: normalizeStatus(entry?.status),
          at: entry?.at ?? '',
        }))
      : [],
  };
}

export function progressPct(status: JobStatus): number {
  if (status === 'cancelled') return 0;
  const index = JOB_STATUS_ORDER.indexOf(status);
  if (index < 0) return 0;
  return Math.round(((index + 1) / JOB_STATUS_ORDER.length) * 100);
}
