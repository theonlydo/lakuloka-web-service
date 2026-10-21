/**
 * Dummy tracking domain — real job-status endpoints in lakuloka-be
 * have not been built yet. When ready, replace fetchTracking() with a
 * server-side fetch (same X-Menu-Key pattern as src/lib/api.ts) and
 * delete DUMMY_TRACKING. UI files stay unchanged.
 */

export type JobStatus =
  | 'received'
  | 'in_progress'
  | 'waiting_parts'
  | 'ready'
  | 'completed';

export interface TrackingTimelineEntry {
  label: string;
  at: string;
  done: boolean;
}

export interface TrackingResult {
  code: string;
  customer: string;
  service: string;
  status: JobStatus;
  progressPct: number;
  updatedAt: string;
  timeline: TrackingTimelineEntry[];
}

export const JOB_STATUS_LABEL: Record<JobStatus, string> = {
  received: 'Diterima',
  in_progress: 'Dikerjakan',
  waiting_parts: 'Menunggu Sparepart',
  ready: 'Siap Diambil',
  completed: 'Selesai',
};

export const DUMMY_TRACKING: Record<string, TrackingResult> = {
  'JASA-001': {
    code: 'JASA-001',
    customer: 'Budi Santoso',
    service: 'Servis Laptop — ganti keyboard',
    status: 'in_progress',
    progressPct: 60,
    updatedAt: '2026-09-28T10:30:00+07:00',
    timeline: [
      { label: 'Pesanan diterima', at: '2026-09-27 09:00', done: true },
      { label: 'Diagnosa selesai', at: '2026-09-27 14:00', done: true },
      { label: 'Pengerjaan', at: '2026-09-28 08:00', done: false },
      { label: 'Siap diambil', at: '-', done: false },
    ],
  },
  'JASA-002': {
    code: 'JASA-002',
    customer: 'Siti Aminah',
    service: 'Cuci AC 2 unit',
    status: 'ready',
    progressPct: 100,
    updatedAt: '2026-09-28T09:15:00+07:00',
    timeline: [
      { label: 'Pesanan diterima', at: '2026-09-28 07:30', done: true },
      { label: 'Pengerjaan', at: '2026-09-28 08:00', done: true },
      { label: 'Siap diambil', at: '2026-09-28 09:15', done: true },
    ],
  },
};

export async function fetchTracking(code: string): Promise<TrackingResult> {
  // TODO(lakuloka-be): GET /service-jobs/{code} with X-Menu-Key.
  const hit = DUMMY_TRACKING[code.trim().toUpperCase()];
  if (!hit) throw new Error('NOT_FOUND');
  return hit;
}
