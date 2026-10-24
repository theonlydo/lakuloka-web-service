import type { Metadata } from 'next';
import {
  JOB_STATUS_LABEL,
  fetchTracking,
  type JobStatus,
} from '~lib/tracking';

export const metadata: Metadata = {
  title: 'Lacak Jasa — Lakuloka',
  robots: { index: false, follow: false },
};

interface Props {
  params: Promise<{ token: string }>;
}

const dateTime = (value: string | null) => {
  if (!value) return '-';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '-';
  return date.toLocaleString('id-ID', {
    timeZone: 'Asia/Jakarta',
    dateStyle: 'medium',
    timeStyle: 'short',
  });
};

const statusTone = (status: JobStatus) => {
  if (status === 'cancelled') return 'bg-destructive/10 text-destructive';
  if (status === 'completed') return 'bg-emerald-500/15 text-emerald-700';
  if (status === 'ready') return 'bg-amber-500/15 text-amber-700';
  return 'bg-primary/10 text-primary';
};

export default async function TrackingDetailPage({ params }: Props) {
  const { token } = await params;

  let result: Awaited<ReturnType<typeof fetchTracking>> | null = null;
  let error: 'NOT_FOUND' | 'RATE_LIMITED' | 'UNKNOWN' | null = null;
  try {
    result = await fetchTracking(decodeURIComponent(token));
  } catch (e) {
    const message = e instanceof Error ? e.message : '';
    error =
      message === 'NOT_FOUND'
        ? 'NOT_FOUND'
        : message === 'RATE_LIMITED'
          ? 'RATE_LIMITED'
          : 'UNKNOWN';
  }

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-xl px-4 py-10">
        <p className="text-xs font-semibold uppercase tracking-widest text-primary">
          Lakuloka
        </p>
        <h1 className="mt-1 text-2xl font-bold">Progress Pekerjaan</h1>

        {error === 'NOT_FOUND' && (
          <div className="mt-5 rounded-xl border border-destructive/40 bg-destructive/10 p-4 text-sm">
            Tautan tracking tidak ditemukan. Periksa kembali tautan dari struk
            Anda.
          </div>
        )}

        {error === 'RATE_LIMITED' && (
          <div className="mt-5 rounded-xl border border-amber-500/40 bg-amber-500/10 p-4 text-sm">
            Terlalu banyak percobaan. Coba lagi beberapa saat lagi.
          </div>
        )}

        {error === 'UNKNOWN' && (
          <div className="mt-5 rounded-xl border border-border bg-muted/40 p-4 text-sm">
            Status belum bisa dimuat. Coba muat ulang halaman ini.
          </div>
        )}

        {result && (
          <div className="mt-5 overflow-hidden rounded-xl border border-border bg-background shadow-sm">
            <div className="bg-primary px-4 py-3 text-primary-foreground">
              <div className="flex items-center justify-between gap-2">
                <span className="text-sm font-bold">
                  {result.jobName || 'Order Jasa'}
                </span>
                <span
                  className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${statusTone(result.status)}`}
                >
                  {JOB_STATUS_LABEL[result.status]}
                </span>
              </div>
              <p className="mt-1 text-xs opacity-80">
                Diterima {dateTime(result.receivedAt)}
                {result.estimatedDoneAt
                  ? ` · Estimasi selesai ${dateTime(result.estimatedDoneAt)}`
                  : ''}
              </p>
            </div>

            <div className="p-4">
              {result.itemNames.length > 0 && (
                <div className="mt-4 rounded-lg bg-muted/40 p-3 text-sm">
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Pekerjaan
                  </p>
                  <ul className="mt-1 space-y-0.5">
                    {result.itemNames.map((name, index) => (
                      <li key={`${name}-${index}`}>{name}</li>
                    ))}
                  </ul>
                </div>
              )}

              <ol aria-label="Riwayat progres pekerjaan" className="mt-6 ml-2 border-l-2 border-primary/30">
                {result.timeline.map((entry, index) => (
                  <li
                    key={`${entry.status}-${entry.at}-${index}`}
                    className="relative pb-6 pl-5 text-sm"
                  >
                    <span aria-hidden="true" className="absolute -left-1.5 top-1 h-2.5 w-2.5 rounded-full bg-primary" />
                    <p className="font-semibold">{JOB_STATUS_LABEL[entry.status]}</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {dateTime(entry.at)}
                    </p>
                  </li>
                ))}
              </ol>

              {result.timeline.length === 0 && (
                <p className="mt-4 text-sm text-muted-foreground">
                  Belum ada riwayat status.
                </p>
              )}
            </div>
          </div>
        )}

        <p className="mt-6 text-center text-xs text-muted-foreground">
          Halaman ini hanya menampilkan status pekerjaan — tanpa rincian harga
          atau data pembayaran.
        </p>
      </div>
    </main>
  );
}
