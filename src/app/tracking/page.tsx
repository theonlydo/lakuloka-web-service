import { fetchTracking, JOB_STATUS_LABEL } from '~lib/tracking';
import TrackingLookup from '~components/tracking/TrackingLookup';

interface Props {
  searchParams: Promise<{ code?: string }>;
}

export default async function TrackingPage({ searchParams }: Props) {
  const { code } = await searchParams;
  const query = code?.trim() ?? '';

  let result: Awaited<ReturnType<typeof fetchTracking>> | null = null;
  let notFound = false;
  if (query) {
    try {
      result = await fetchTracking(query);
    } catch {
      notFound = true;
    }
  }

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-xl px-4 py-10">
        <p className="text-xs font-semibold uppercase tracking-widest text-primary">
          Lakuloka
        </p>
        <h1 className="mt-1 text-2xl font-bold">Lacak Progress Jasa</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Masukkan kode tracking dari struk, mis. <span className="font-mono">JASA-001</span>
        </p>

        <div className="mt-5">
          <TrackingLookup initialCode={query} />
        </div>

        {notFound && (
          <div className="mt-5 rounded-xl border border-destructive/40 bg-destructive/10 p-4 text-sm">
            Kode <span className="font-mono font-semibold">{query}</span> tidak ditemukan.
            Periksa kembali kode di struk Anda.
          </div>
        )}

        {result && (
          <div className="mt-5 overflow-hidden rounded-xl border border-border bg-background shadow-sm">
            <div className="bg-primary px-4 py-3 text-primary-foreground">
              <div className="flex items-center justify-between gap-2">
                <span className="font-mono text-sm font-bold">{result.code}</span>
                <span className="rounded-full bg-white/20 px-2.5 py-0.5 text-xs font-semibold">
                  {JOB_STATUS_LABEL[result.status]}
                </span>
              </div>
              <p className="mt-1 text-sm opacity-90">{result.service}</p>
              <p className="text-xs opacity-70">{result.customer}</p>
            </div>
            <div className="p-4">
              <div className="h-2 overflow-hidden rounded-full bg-muted">
                <div className="h-full bg-accent" style={{ width: `${result.progressPct}%` }} />
              </div>
              <p className="mt-1 text-right text-xs text-muted-foreground">
                {result.progressPct}% — diperbarui {result.updatedAt}
              </p>
              <ol className="mt-3 space-y-2">
                {result.timeline.map((t) => (
                  <li key={t.label} className="flex items-center gap-2 text-sm">
                    <span
                      className={`h-2.5 w-2.5 shrink-0 rounded-full ${t.done ? 'bg-primary' : 'bg-muted'}`}
                    />
                    <span className={t.done ? '' : 'text-muted-foreground'}>{t.label}</span>
                    <span className="ml-auto text-xs text-muted-foreground">{t.at}</span>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
