'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search } from 'lucide-react';

export default function TrackingLookup({ initialCode }: { initialCode: string }) {
  const router = useRouter();
  const [code, setCode] = useState(initialCode);

  const submit = (value: string) => {
    let token = value.trim();
    if (/^https?:\/\//i.test(token)) {
      try {const url = new URL(token);const match=url.pathname.match(/\/track\/([^/]+)\/?$/);if(!match)return;token=decodeURIComponent(match[1]);}catch{return;}
    }
    if (!token) return;
    const host = window.location.hostname;
    const path =
      host === 'track.lakuloka.id' || host.startsWith('track.')
        ? `/track/${encodeURIComponent(token)}`
        : `/tracking/track/${encodeURIComponent(token)}`;
    router.push(path);
  };

  return (
    <form
      className="flex gap-2"
      onSubmit={(e) => {
        e.preventDefault();
        submit(code);
      }}
    >
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="Tempel tautan atau kode tracking"
          className="w-full rounded-xl border border-input bg-background py-2.5 pl-9 pr-4 font-mono text-sm uppercase placeholder:normal-case placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
        />
      </div>
      <button
        type="submit"
        className="shrink-0 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90"
      >
        Cek
      </button>
    </form>
  );
}
