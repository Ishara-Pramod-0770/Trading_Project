"use client";

import * as React from "react";
import { ClerkProvider } from "@clerk/nextjs";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { clerkEnabled } from "@/lib/auth-config";

export function Providers({ children }: { children: React.ReactNode }) {
  const tree = (
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem
      disableTransitionOnChange
    >
      {children}
      <Toaster position="top-right" richColors />
    </ThemeProvider>
  );

  // Only mount Clerk when configured, so the app runs without keys in dev.
  if (clerkEnabled) {
    return <ClerkProvider>{tree}</ClerkProvider>;
  }
  return tree;
}
