"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { LayoutDashboard, LogOut, Search, Menu, X, ListTodo } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";

export function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  // Prevent body scroll when menu open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  if (pathname === "/" || pathname === "/login" || pathname === "/register") {
    return null;
  }

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  const navLinks = [
    { href: "/dashboard", label: "Dashboard", icon: <LayoutDashboard className="w-5 h-5" /> },
    { href: "/issues",    label: "Issues",    icon: <ListTodo className="w-5 h-5" /> },
  ];

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b-2 border-border bg-background font-sans">
        <div className="container mx-auto flex h-16 max-w-screen-2xl items-center justify-between px-4 sm:px-6">

          {/* Logo */}
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-3 hover:-translate-y-[2px] transition-transform group">
              <div className="relative w-8 h-8 flex items-center justify-center transform group-hover:scale-110 group-hover:-rotate-6 transition-all duration-300">
                <Image src="/assets/trackforge_icon.png" alt="TrackForge Logo" fill className="object-contain" sizes="32px" />
              </div>
              <span className="font-heading font-black text-xl sm:text-2xl tracking-tighter text-foreground">TrackForge</span>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-6 text-sm font-bold">
              {navLinks.map(l => (
                <Link key={l.href} href={l.href}
                  className={`transition-colors hover:text-primary ${pathname?.startsWith(l.href) ? "text-primary" : "text-secondary"}`}>
                  {l.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Desktop Right */}
          <div className="hidden md:flex flex-1 items-center justify-end gap-4">
            <div className="relative w-full max-w-sm items-center group flex">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-secondary group-focus-within:text-primary transition-colors" />
              <Input type="search" placeholder="Search issues..."
                className="w-full h-10 rounded-xl bg-surface pl-10 pr-4 md:w-[300px] border-2 border-border hover:border-primary focus-visible:ring-0 focus-visible:border-primary font-medium transition-all duration-300" />
            </div>
            <ThemeToggle />
            <Button variant="ghost" size="icon" onClick={handleLogout}
              className="rounded-xl border-2 border-transparent hover:border-border bg-surface hover:bg-muted text-secondary hover:text-foreground transition-all">
              <LogOut className="h-5 w-5" />
            </Button>
          </div>

          {/* Mobile Right */}
          <div className="flex md:hidden items-center gap-2">
            <ThemeToggle />
            <Button variant="ghost" size="icon"
              onClick={() => setMobileOpen(o => !o)}
              className="rounded-xl border-2 border-transparent hover:border-border bg-surface hover:bg-muted text-secondary hover:text-foreground transition-all"
              aria-label="Toggle mobile menu">
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile Drawer */}
      <div className={`fixed top-16 left-0 right-0 z-40 md:hidden bg-background border-b-2 border-border shadow-2xl transition-all duration-300 ${mobileOpen ? "translate-y-0 opacity-100" : "-translate-y-4 opacity-0 pointer-events-none"}`}>
        <div className="container mx-auto px-4 py-4 space-y-2">
          {/* Mobile Search */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-secondary" />
            <Input type="search" placeholder="Search issues..."
              className="w-full h-11 rounded-xl bg-surface pl-10 pr-4 border-2 border-border focus-visible:ring-0 focus-visible:border-primary font-medium" />
          </div>

          {/* Nav Links */}
          {navLinks.map(l => (
            <Link key={l.href} href={l.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-base transition-colors border-2
                ${pathname?.startsWith(l.href)
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-transparent hover:border-border hover:bg-muted text-secondary hover:text-foreground"
                }`}>
              {l.icon}
              {l.label}
            </Link>
          ))}

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-base border-2 border-transparent hover:border-border hover:bg-muted text-secondary hover:text-foreground transition-colors">
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>
      </div>
    </>
  );
}
