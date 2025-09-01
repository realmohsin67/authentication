import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // Clone the request headers and set a new header
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-pathname", request.nextUrl.pathname);
  requestHeaders.set("x-search", request.nextUrl.search);

  // You can also set request headers in NextResponse.next
  return NextResponse.next({
    request: {
      // New request headers
      headers: requestHeaders,
    },
  });
}
