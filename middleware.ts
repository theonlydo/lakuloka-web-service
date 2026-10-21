import { NextRequest, NextResponse } from 'next/server';
import { isModuleId, matchHostname, prefixForModule } from './src/modules';

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)'],
};

export function middleware(req: NextRequest) {
  const { pathname, searchParams } = req.nextUrl;

  // Shared API namespace + already-prefixed module paths pass through.
  // (Direct /resto/... access on localhost is a handy dev shortcut.)
  if (pathname.startsWith('/api')) return NextResponse.next();
  if (/^\/(resto|tracking|kitchen|queue)(\/|$)/.test(pathname)) {
    return NextResponse.next();
  }

  const moduleId = matchHostname(req.headers.get('host'));

  // Local-dev convenience: localhost:3001/demo?preview=kitchen renders the
  // kitchen module without /etc/hosts entries. Unknown hosts without a
  // preview param fall through to the landing page.
  const preview = searchParams.get('preview');
  const target = moduleId ?? (isModuleId(preview) ? preview : null);
  if (!target) return NextResponse.next();

  const url = req.nextUrl.clone();
  url.pathname = `/${prefixForModule(target)}${pathname}`;
  return NextResponse.rewrite(url);
}
