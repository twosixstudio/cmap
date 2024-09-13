// app/signin/page.tsx
"use client";

import { signIn } from "next-auth/react";
// import { useRouter, useSearchParams } from "next/navigation";
// import { useEffect } from "react";

export default function SignInPage() {
  //   const { data: session, status } = useSession();
  //   const router = useRouter();
  // const searchParams = useSearchParams();
  // const callbackUrl = searchParams.get("callbackUrl") || "/";

  //   useEffect(() => {
  //     console.log("hello", callbackUrl, session);
  //     if (status === "authenticated") {
  //       // User is authenticated, redirect them
  //       router.replace(callbackUrl);
  //     }
  //   }, [status, router, callbackUrl]);

  //   if (status === "authenticated") {
  //     // Optional: Return null or a loading state while redirecting
  //     return JSON.stringify(session);
  //   }

  // Display the sign-in UI if the user is not authenticated
  return (
    <div>
      <h1>Sign In</h1>
      {/* Your custom sign-in UI */}
      {/* <button onClick={() => signIn("github", { callbackUrl })}>
        Sign in with GitHub
      </button> */}
      <button onClick={() => signIn("github")}>Sign in with GitHub</button>
    </div>
  );
}
