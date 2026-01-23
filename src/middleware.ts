import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // No middleware logic - just pass through
  return NextResponse.next();
}

// Don't apply middleware to any routes
export const config = {
  matcher: [],
};
