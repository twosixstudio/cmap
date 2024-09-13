"use client";
import { SessionProvider } from "next-auth/react";

export function Provider(props: { children: React.ReactNode }) {
  return <SessionProvider>{props.children}</SessionProvider>;
}
