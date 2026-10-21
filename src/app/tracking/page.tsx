import TrackingLookup from '~components/tracking/TrackingLookup';

export default function TrackingLandingPage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-xl px-4 py-10">
        <p className="text-xs font-semibold uppercase tracking-widest text-primary">
          Lakuloka
        </p>
        <h1 className="mt-1 text-2xl font-bold">Lacak Progress Jasa</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Masukkan kode tracking dari struk Anda untuk melihat status
          pekerjaan secara langsung.
        </p>

        <div className="mt-5">
          <TrackingLookup initialCode="" />
        </div>

        <div className="mt-6 rounded-xl border border-border bg-muted/40 p-4 text-sm text-muted-foreground">
          Halaman ini hanya menampilkan status pekerjaan — tanpa rincian harga
          atau data pembayaran.
        </div>
      </div>
    </main>
  );
}
