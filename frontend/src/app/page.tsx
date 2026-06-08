"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function LandingPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Check if the user has a token in local storage
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem("token");
      setIsLoggedIn(!!token);
    }
  }, []);

  return (
    <div className="relative min-h-screen bg-background flex flex-col font-sans overflow-hidden">
      {/* Subtle Dot Pattern Background */}
      <div 
        className="absolute inset-0 z-0 opacity-[0.03] dark:opacity-[0.05]"
        style={{
          backgroundImage: "radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)",
          backgroundSize: "32px 32px"
        }}
      />

      {/* Navigation */}
      <header className="relative z-10 container mx-auto px-6 h-20 flex items-center justify-between border-b-2 border-border/20">
        <div className="flex items-center gap-3 group cursor-pointer">
          <div className="relative w-8 h-8 flex items-center justify-center transform group-hover:scale-110 group-hover:-rotate-6 transition-all duration-300">
            <Image 
              src="/assets/trackforge_icon.png" 
              alt="TrackForge Logo" 
              fill 
              className="object-contain"
              sizes="32px"
            />
          </div>
          <span className="font-heading font-black text-2xl tracking-tighter text-foreground">TrackForge</span>
        </div>
        <nav className="hidden md:flex gap-8 font-medium">
          <Link href="#" className="hover:-translate-y-[2px] transition-transform duration-300">Product</Link>
          <Link href="#" className="hover:-translate-y-[2px] transition-transform duration-300">Methodology</Link>
          <Link href="#" className="hover:-translate-y-[2px] transition-transform duration-300">Customers</Link>
          <Link href="#" className="hover:-translate-y-[2px] transition-transform duration-300">Pricing</Link>
        </nav>
        <div className="flex items-center gap-4 font-medium">
          {isLoggedIn ? (
            <Link href="/dashboard">
              <Button className="font-bold border-2 border-foreground shadow-[4px_4px_0px_0px_currentColor] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all duration-300 bg-primary text-primary-foreground">
                Your Workspace
              </Button>
            </Link>
          ) : (
            <>
              <Link href="/login" className="hidden md:block hover:-translate-y-[2px] transition-transform duration-300">
                Log in
              </Link>
              <Link href="/register">
                <Button className="font-bold border-2 border-foreground shadow-[4px_4px_0px_0px_currentColor] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all duration-300 bg-primary text-primary-foreground">
                  Sign up free
                </Button>
              </Link>
            </>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <main className="relative z-10 flex-1 container mx-auto px-6 py-12 md:py-24 flex flex-col lg:flex-row items-center gap-16">
        
        {/* Left: Copy */}
        <div className="flex-1 space-y-8 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border-2 border-foreground/10 bg-surface/50 backdrop-blur-sm text-sm font-bold uppercase tracking-widest text-primary mb-4 transform -rotate-1">
            <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
            TrackForge 2.0 is Live
          </div>
          
          <h1 className="font-heading font-black text-6xl md:text-8xl leading-[0.95] tracking-tighter text-foreground drop-shadow-sm">
            Track Every Issue.<br/>
            <span className="text-primary relative inline-block">
              Ship With Confidence.
              <svg className="absolute w-full h-4 -bottom-1 left-0 text-accent opacity-50" viewBox="0 0 100 10" preserveAspectRatio="none">
                <path d="M0 5 Q 50 10 100 5" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
              </svg>
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-secondary font-medium leading-relaxed max-w-xl">
            A modern, handcrafted issue tracking workspace for engineering teams who care about their craft. Move fast, stay aligned, and forge better software.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center gap-4 pt-4">
            {isLoggedIn ? (
              <Link href="/dashboard" className="w-full sm:w-auto">
                <Button size="lg" className="w-full sm:w-auto text-lg h-14 px-8 font-bold border-2 border-foreground shadow-[4px_4px_0px_0px_currentColor] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all duration-300 bg-primary text-primary-foreground">
                  Enter Workspace <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
            ) : (
              <Link href="/register" className="w-full sm:w-auto">
                <Button size="lg" className="w-full sm:w-auto text-lg h-14 px-8 font-bold border-2 border-foreground shadow-[4px_4px_0px_0px_currentColor] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all duration-300 bg-primary text-primary-foreground">
                  Start Tracking <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
            )}
          </div>
          
          <div className="pt-8 flex items-center gap-4 text-sm font-medium text-secondary/80">
            <div className="flex -space-x-3">
              {[1,2,3,4].map((i) => (
                <div key={i} className="w-8 h-8 rounded-full border-2 border-background bg-muted flex items-center justify-center text-xs font-bold z-10 relative">
                  U{i}
                </div>
              ))}
            </div>
            <p>Trusted by 10,000+ engineers building the future.</p>
          </div>
        </div>

        {/* Right: Illustration */}
        <div className="flex-1 w-full max-w-xl lg:max-w-none relative group perspective-1000">
          <div className="absolute inset-0 bg-accent/20 blur-3xl rounded-full transform -rotate-12 group-hover:rotate-12 transition-transform duration-1000" />
          <div className="relative transform rotate-2 group-hover:rotate-0 group-hover:-translate-y-4 transition-all duration-500">
            <Image
              src="/assets/hero_mascot.png"
              alt="The Forge Master"
              width={800}
              height={800}
              className="w-full h-auto drop-shadow-2xl"
              priority
            />
          </div>
          
          {/* Floating UI Elements */}
          <div className="absolute -left-12 top-24 bg-card border-2 border-foreground/10 p-4 rounded-xl shadow-xl transform -rotate-6 hidden md:block animate-pulse" style={{ animationDuration: '4s' }}>
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-destructive" />
              <span className="font-heading font-bold text-sm">Critical Bug Fixed</span>
            </div>
          </div>
          <div className="absolute -right-8 bottom-32 bg-card border-2 border-foreground/10 p-4 rounded-xl shadow-xl transform rotate-6 hidden md:block animate-pulse" style={{ animationDuration: '5s', animationDelay: '1s' }}>
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-emerald-500" />
              <span className="font-heading font-bold text-sm">Release v2.0 Shipped</span>
            </div>
          </div>
        </div>

      </main>
    </div>
  );
}
