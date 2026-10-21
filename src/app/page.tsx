import { headers } from 'next/headers';
import { MODULES } from '~modules';

const DEMO_PATHS: Record<string, string> = {
  resto: '/demo',
  tracking: '/',
  kitchen: '/demo',
  queue: '/demo',
};

const NAMES: Record<string, string> = {
  resto: 'Laku Resto',
  tracking: 'Lacak Jasa',
  kitchen: 'Kitchen Display',
  queue: 'Queue Display',
};
const DESCRIPTIONS: Record<string, string> = {
  resto: 'Pesan makanan langsung dari meja, order masuk ke kasir.',
  tracking: 'Cek status progress pekerjaan jasa.',
  kitchen: 'Layar dapur — pantau dan proses order yang masuk.',
  queue: 'Layar antrean untuk TV — nomor siap diambil.',
};

export default async function LandingPage() {
  const host = (await headers()).get('host') ?? 'localhost:3001';
  const port = host.includes(':') ? `:${host.split(':').slice(1).join(':')}` : '';
  const here = host.split(':')[0];

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-100 p-8">
      <div className="w-full max-w-2xl">
        <h1 className="text-2xl font-bold text-gray-900">Lakuloka Web Platform</h1>
        <p className="mt-1 text-sm text-gray-500">
          Satu deploy, banyak modul — dibuka via <span className="font-mono">{here}</span>.
          Untuk preview lokal tambah <span className="font-mono">127.0.0.1 resto.test tracking.test kitchen.test queue.test</span> ke{' '}
          <span className="font-mono">/etc/hosts</span>, atau pakai link preview di bawah.
        </p>
        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          {MODULES.map((m) => (
            <div key={m.id} className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
              <h2 className="font-semibold text-gray-900">{NAMES[m.id]}</h2>
              <p className="mt-0.5 text-xs text-gray-500">{DESCRIPTIONS[m.id]}</p>
              <p className="mt-1 font-mono text-xs text-gray-400">{m.host}</p>
              <div className="mt-3 flex gap-2 text-sm">
                <a
                  href={`http://${m.devHost}${port}${DEMO_PATHS[m.id]}`}
                  className="rounded-lg bg-gray-900 px-3 py-1.5 font-medium text-white hover:bg-gray-700"
                >
                  Buka
                </a>
                <a
                  href={`${DEMO_PATHS[m.id]}?preview=${m.id}`}
                  className="rounded-lg border border-gray-300 px-3 py-1.5 font-medium text-gray-700 hover:bg-gray-50"
                >
                  Preview
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
