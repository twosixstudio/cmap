import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const redirectPage = "/auth/login";
const isProd = process.env.NODE_ENV === "production";
const COOKIE_NAME = isProd
  ? "__Secure-authjs.session-token"
  : "authjs.session-token";

export async function middleware(req: NextRequest) {
  const cookies = req.cookies;
  const sessionToken = cookies.get(COOKIE_NAME);

  // Helper function to build the login URL with callbackUrl parameter
  const buildLoginUrl = () => {
    const loginUrl = new URL(redirectPage, req.url);
    loginUrl.searchParams.set("callbackUrl", req.nextUrl.href);
    return loginUrl;
  };

  // If session token is not present, redirect to login with callbackUrl
  if (!sessionToken) {
    return NextResponse.redirect(buildLoginUrl());
  }

  // Optional: Validate the session token with an API call
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
    const response = NextResponse.redirect(buildLoginUrl());
    response.cookies.set(COOKIE_NAME, "", {
      expires: new Date(0), // Expire the cookie immediately
    });
    return response;
  }

  return NextResponse.next();
}

// Apply middleware to specific routes
export const config = {
  matcher: ["/projects/:path*", "/"],
};
