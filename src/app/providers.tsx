"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { AuthInitializer } from "@/components/auth/auth-initializer";
import { SocketProvider } from "@/components/providers/socket-provider";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <AuthInitializer>
        <SocketProvider>{children}</SocketProvider>
      </AuthInitializer>
    </NextThemesProvider>
  );
}
