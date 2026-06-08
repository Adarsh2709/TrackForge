"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, LogOut, Search } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function Navbar() {
  const pathname = usePathname();
  
  // Don't show navbar on auth and landing pages
  if (pathname === "/" || pathname === "/login" || pathname === "/register") {
    return null;
  }

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b-2 border-border bg-background font-sans">
      <div className="container mx-auto flex h-16 max-w-screen-2xl items-center justify-between px-6">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2 font-heading font-black text-xl tracking-tight hover:-translate-y-[2px] transition-transform">
            <div className="relative w-10 h-10 flex items-center justify-center transform hover:scale-105 transition-transform duration-300">
              <Image 
                src="/assets/trackforge_logo.png" 
                alt="TrackForge Logo" 
                fill 
                className="object-contain"
                sizes="40px"
              />
            </div>
            <span>TrackForge</span>
          </Link>

          <nav className="hidden md:flex items-center gap-6 text-sm font-bold">
            <Link 
              href="/dashboard" 
              className={`transition-colors hover:text-primary ${pathname === '/dashboard' ? 'text-primary' : 'text-secondary'}`}
            >
              Dashboard
            </Link>
            <Link 
              href="/issues" 
              className={`transition-colors hover:text-primary ${pathname?.startsWith('/issues') ? 'text-primary' : 'text-secondary'}`}
            >
              Issues
            </Link>
          </nav>
        </div>

        <div className="flex flex-1 items-center justify-end gap-4 md:justify-end">
          <div className="hidden md:flex relative w-full max-w-sm items-center group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-secondary group-focus-within:text-primary transition-colors" />
            <Input
              type="search"
              placeholder="Search issues..."
              className="w-full h-10 rounded-xl bg-surface pl-10 pr-4 md:w-[300px] lg:w-[300px] border-2 border-border hover:border-primary focus-visible:ring-0 focus-visible:border-primary font-medium transition-all duration-300"
            />
          </div>
          <ThemeToggle />
          
          <Button variant="ghost" size="icon" onClick={handleLogout} className="rounded-xl border-2 border-transparent hover:border-border bg-surface hover:bg-muted text-secondary hover:text-foreground transition-all">
            <LogOut className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  );
}
