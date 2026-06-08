"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, LogOut, Search } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function Navbar() {
  const pathname = usePathname();
  
  // Don't show navbar on auth pages
  if (pathname === "/login" || pathname === "/register") {
    return null;
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-14 max-w-screen-2xl items-center justify-between px-4">
        <div className="flex items-center gap-6">
          <Link href="/dashboard" className="flex items-center gap-2 font-bold text-lg tracking-tight hover:opacity-80 transition-opacity">
            <div className="bg-primary text-primary-foreground p-1 rounded-md">
              <LayoutDashboard size={20} />
            </div>
            <span>TrackForge</span>
          </Link>

          <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
            <Link 
              href="/dashboard" 
              className={`transition-colors hover:text-foreground/80 ${pathname === '/dashboard' ? 'text-foreground' : 'text-foreground/60'}`}
            >
              Dashboard
            </Link>
            <Link 
              href="/issues" 
              className={`transition-colors hover:text-foreground/80 ${pathname?.startsWith('/issues') ? 'text-foreground' : 'text-foreground/60'}`}
            >
              Issues
            </Link>
          </nav>
        </div>

        <div className="flex flex-1 items-center justify-end gap-4 md:justify-end">
          <div className="hidden md:flex relative w-full max-w-sm items-center">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search issues..."
              className="w-full rounded-full bg-muted/50 pl-9 pr-4 md:w-[300px] lg:w-[300px] border-muted hover:bg-muted/80 focus-visible:ring-1 focus-visible:ring-primary transition-all duration-300"
            />
          </div>
          <ThemeToggle />
          
          <Button variant="ghost" size="icon" className="rounded-full text-muted-foreground hover:text-foreground">
            <LogOut className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  );
}
