"use client";

import { SessionProvider } from "next-auth/react";
import type { ReactNode } from "react";

/**
 * עטיפת client-component דקה סביב next-auth/react's SessionProvider,
 * כדי ש-layout.tsx עצמו יוכל להישאר Server Component.
 */
export function AuthSessionProvider({ children }: { children: ReactNode }) {
  return <SessionProvider>{children}</SessionProvider>;
}
