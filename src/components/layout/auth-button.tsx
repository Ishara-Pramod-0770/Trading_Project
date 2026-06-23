"use client";

import { SignInButton, UserButton, useAuth } from "@clerk/nextjs";
import { User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { clerkEnabled } from "@/lib/auth-config";

export function AuthButton() {
  if (!clerkEnabled) {
    // Dev fallback when Clerk keys aren't configured yet.
    return (
      <Button variant="secondary" size="sm" className="gap-2" disabled>
        <User className="size-4" />
        <span className="hidden sm:inline">Guest</span>
      </Button>
    );
  }
  return <ClerkAuth />;
}

function ClerkAuth() {
  const { isLoaded, isSignedIn } = useAuth();
  if (!isLoaded) {
    return <div className="size-8 animate-pulse rounded-full bg-muted" />;
  }
  if (isSignedIn) {
    return <UserButton />;
  }
  return (
    <SignInButton mode="modal">
      <Button size="sm">Sign in</Button>
    </SignInButton>
  );
}
