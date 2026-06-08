"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2, ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { api } from "@/services/api";

const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Invalid email address." }),
  password: z.string().min(6, { message: "Password must be at least 6 characters." }),
});

export default function RegisterPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setIsLoading(true);
      setError(null);
      await api.post("/auth/register", values);
      
      const loginResponse = await api.post("/auth/login", {
        email: values.email,
        password: values.password
      });

      if (loginResponse.data.token) {
        localStorage.setItem("token", loginResponse.data.token);
        localStorage.setItem("user", JSON.stringify(loginResponse.data));
        router.push("/dashboard");
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen bg-background font-sans overflow-hidden">
      {/* Left Side: Illustrated World */}
      <div className="hidden lg:flex w-1/2 relative bg-surface border-r-2 border-border/50 items-center justify-center p-12 overflow-hidden">
        <div 
          className="absolute inset-0 z-0 opacity-[0.03] dark:opacity-[0.05]"
          style={{
            backgroundImage: "radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)",
            backgroundSize: "32px 32px"
          }}
        />
        <div className="absolute top-12 left-12 z-10">
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <ArrowLeft className="w-5 h-5" /> Back to Home
          </Link>
        </div>
        <div className="relative z-10 w-full max-w-lg text-center flex flex-col items-center">
          <h2 className="font-heading font-black text-4xl text-foreground mb-6">Build something great.</h2>
          <p className="text-secondary text-lg font-medium mb-12">
            Join thousands of engineering teams who have moved from chaos to clarity with TrackForge.
          </p>
          <div className="relative w-full aspect-square max-w-md transform hover:scale-105 transition-transform duration-500">
            <div className="absolute inset-0 bg-accent/20 blur-3xl rounded-full" />
            <Image
              src="/assets/task_mascot.png"
              alt="TrackForge Builder"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-contain drop-shadow-2xl relative z-10"
              priority
            />
          </div>
        </div>
      </div>

      {/* Right Side: Auth Form */}
      <div className="flex-1 flex flex-col justify-center px-8 sm:px-16 md:px-24 py-12 bg-background relative overflow-y-auto">
        <div className="lg:hidden absolute top-8 left-8">
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <ArrowLeft className="w-5 h-5" /> Home
          </Link>
        </div>
        
        <div className="w-full max-w-md mx-auto space-y-10 my-auto">
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-xl bg-accent text-accent-foreground flex items-center justify-center font-heading font-bold text-2xl transform rotate-6 mb-6 border-2 border-foreground/10 shadow-sm">
              T
            </div>
            <h1 className="font-heading font-black text-4xl tracking-tight text-foreground">Create Account</h1>
            <p className="text-secondary font-medium">
              Start your journey with a fresh workspace.
            </p>
          </div>

          {error && (
            <div className="rounded-xl border-2 border-destructive bg-destructive/10 p-4 text-sm text-destructive font-bold text-center flex items-center justify-center gap-2">
              <span className="w-2 h-2 rounded-full bg-destructive animate-pulse" />
              {error}
            </div>
          )}

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-bold">Full Name</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="John Doe" 
                        {...field} 
                        className="h-14 rounded-xl border-2 border-border bg-surface focus-visible:ring-accent focus-visible:border-accent transition-all font-medium"
                      />
                    </FormControl>
                    <FormMessage className="font-medium" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-bold">Email Address</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="you@example.com" 
                        {...field} 
                        className="h-14 rounded-xl border-2 border-border bg-surface focus-visible:ring-accent focus-visible:border-accent transition-all font-medium"
                      />
                    </FormControl>
                    <FormMessage className="font-medium" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-bold">Password</FormLabel>
                    <FormControl>
                      <Input 
                        type="password" 
                        placeholder="••••••••" 
                        {...field} 
                        className="h-14 rounded-xl border-2 border-border bg-surface focus-visible:ring-accent focus-visible:border-accent transition-all font-medium"
                      />
                    </FormControl>
                    <FormMessage className="font-medium" />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full h-14 rounded-xl text-lg font-bold border-2 border-foreground shadow-[4px_4px_0px_0px_currentColor] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all duration-300 bg-accent text-accent-foreground mt-4" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
                Join TrackForge
              </Button>
            </form>
          </Form>

          <div className="text-center font-medium text-secondary">
            Already have an account?{" "}
            <Link href="/login" className="font-bold text-accent hover:text-primary transition-colors">
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
