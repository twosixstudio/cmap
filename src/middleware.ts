// middleware.ts
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const redirectPage = "/auth/login";

export async function middleware(req: NextRequest) {
  const cookies = req.cookies;
  const sessionToken = cookies.get("authjs.session-token");

  // If session token is not present, redirect to login
  if (!sessionToken) {
    return NextResponse.redirect(new URL(redirectPage, req.url));
  }

  // Optional: If you need to validate the session token further with an API call
  try {
    const sessionResponse = await fetch(
      `${req.nextUrl.origin}/api/auth/session`,
      {
        headers: {
          cookie: req.headers.get("cookie") ?? "", // Pass cookies to the API route
        },
      },
    );

    if (sessionResponse.status !== 200) {
      throw new Error("Session not found");
    }
  } catch (error) {
    const response = NextResponse.redirect(new URL(redirectPage, req.url));
    response.cookies.set("authjs.session-token", "", {
      expires: new Date(0), // Expire the cookie immediately
    });
    return response;
  }

  return NextResponse.next();
}

// If you want this middleware to apply to specific routes
export const config = {
  matcher: ["/projects/:path*", "/"],
};
