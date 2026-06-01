import { type NextRequest, NextResponse } from "next/server";

const PROD_APEX = "yasirgaji.com";
const STUDIO_HOST = `studio.${PROD_APEX}`;

export function proxy(request: NextRequest) {
  const host = request.headers.get("host") ?? "";
  const { pathname } = request.nextUrl;

  // Studio subdomain: rewrite root path to /studio internally so
  // app/studio/[[...tool]]/page.tsx handles the request.
  if (host === STUDIO_HOST && !pathname.startsWith("/studio")) {
    const url = request.nextUrl.clone();
    url.pathname = `/studio${pathname === "/" ? "" : pathname}`;
    return NextResponse.rewrite(url);
  }

  // Canonicalize: on the apex/www, redirect /studio/* to the subdomain.
  // Skips dev (localhost) and Vercel preview URLs untouched.
  if ((host === PROD_APEX || host === `www.${PROD_APEX}`) && pathname.startsWith("/studio")) {
    const url = request.nextUrl.clone();
    url.host = STUDIO_HOST;
    url.pathname = pathname.replace(/^\/studio/, "") || "/";
    return NextResponse.redirect(url, 308);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
