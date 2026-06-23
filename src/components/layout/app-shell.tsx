"use client";

import * as React from "react";
import Link from "next/link";
import { Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Logo } from "./logo";
import { SidebarNav } from "./sidebar-nav";
import { ThemeToggle } from "@/components/theme-toggle";
import { AuthButton } from "./auth-button";
import { TickerTape } from "@/components/market/ticker-tape";

export function AppShell({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = React.useState(false);

  return (
    <div className="flex min-h-screen">
      {/* Desktop sidebar */}
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r border-sidebar-border bg-sidebar md:flex">
        <div className="flex h-16 items-center border-b border-sidebar-border px-5">
          <Link href="/dashboard">
            <Logo />
          </Link>
        </div>
        <ScrollArea className="flex-1 py-4">
          <SidebarNav />
        </ScrollArea>
        <div className="border-t border-sidebar-border p-4">
          <p className="text-[10px] leading-relaxed text-muted-foreground/70">
            Educational platform. Not financial advice.
          </p>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        {/* Topbar */}
        <header className="glass-strong sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-border px-4 md:px-6">
          {/* Mobile menu */}
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden" aria-label="Open menu">
                <Menu className="size-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-72 p-0">
              <SheetTitle className="sr-only">Navigation</SheetTitle>
              <div className="flex h-16 items-center border-b border-sidebar-border px-5">
                <Logo />
              </div>
              <ScrollArea className="h-[calc(100vh-4rem)] py-4">
                <SidebarNav onNavigate={() => setMobileOpen(false)} />
              </ScrollArea>
            </SheetContent>
          </Sheet>

          <Link href="/dashboard" className="md:hidden">
            <Logo showText={false} />
          </Link>

          <TickerTape />

          <div className="ml-auto flex items-center gap-2">
            <ThemeToggle />
            <AuthButton />
          </div>
        </header>

        <main className="flex-1 p-4 md:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
