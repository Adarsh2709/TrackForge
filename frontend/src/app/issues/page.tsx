"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { IssueTable } from "@/components/issues/IssueTable";
import { api } from "@/services/api";
import { Issue } from "@/types";

export default function IssuesPage() {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchIssues = async () => {
    try {
      const response = await api.get("/issues");
      setIssues(response.data);
    } catch (error) {
      console.error("Failed to fetch issues", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchIssues();
  }, []);

  const filteredIssues = issues.filter((issue) => 
    issue.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    issue.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex-1 space-y-8 p-8 pt-10 max-w-screen-2xl mx-auto w-full font-sans">
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b-2 border-border/50 pb-8">
        <div className="flex items-center gap-6">
          <div className="hidden sm:block w-20 h-20 relative transform hover:scale-105 transition-transform duration-500">
            <Image
              src="/assets/task_mascot.png"
              alt="Issues Mascot"
              fill
              sizes="(max-width: 768px) 100vw, 33vw"
              className="object-contain drop-shadow-xl"
            />
          </div>
          <div>
            <h1 className="font-heading font-black text-4xl tracking-tight text-foreground mb-2">
              All Issues
            </h1>
            <p className="text-secondary text-lg font-medium">
              Manage, track, and forge your tasks.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Filter issues..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 h-12 rounded-xl border-2 border-border bg-surface focus-visible:ring-accent focus-visible:border-accent font-medium"
            />
          </div>
          <Link href="/create-issue">
            <Button size="lg" className="h-12 px-6 font-bold border-2 border-foreground shadow-[4px_4px_0px_0px_currentColor] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all duration-300 bg-primary text-primary-foreground">
              <Plus className="mr-2 h-5 w-5" /> New Issue
            </Button>
          </Link>
        </div>
      </div>

      {/* Table Section */}
      <div>
        {isLoading ? (
          <div className="h-[400px] flex items-center justify-center rounded-2xl border-2 border-border bg-surface text-muted-foreground font-bold animate-pulse">
            Loading your forge...
          </div>
        ) : filteredIssues.length === 0 ? (
          <div className="h-[400px] flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-border bg-surface/50 text-center space-y-6">
            <div className="w-48 h-48 relative transform hover:scale-105 transition-transform duration-500">
              <Image src="/assets/empty_state.png" alt="Quiet Forge" fill sizes="(max-width: 768px) 100vw, 33vw" className="object-contain opacity-80" />
            </div>
            <div className="space-y-2">
              <h3 className="font-heading font-black text-2xl">No issues found.</h3>
              <p className="text-secondary font-medium">
                {searchQuery ? "Try adjusting your filters." : "Your forge is completely clean!"}
              </p>
            </div>
            {!searchQuery && (
              <Link href="/create-issue">
                <Button className="font-bold border-2 border-foreground shadow-[4px_4px_0px_0px_currentColor] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all duration-300">
                  Log New Issue
                </Button>
              </Link>
            )}
          </div>
        ) : (
          <div className="rounded-2xl border-2 border-foreground shadow-[6px_6px_0px_0px_currentColor] overflow-hidden bg-card transition-all duration-300">
            <IssueTable issues={filteredIssues} />
          </div>
        )}
      </div>
    </div>
  );
}
