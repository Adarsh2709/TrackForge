"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { IssueTable } from "@/components/issues/IssueTable";
import { BrandedWidget } from "@/components/dashboard/BrandedWidget";
import { SprintHealthAnalyzer, SprintHealthData } from "@/components/ai/SprintHealthAnalyzer";
import { AIInsightsPanel } from "@/components/ai/AIInsightsPanel";
import { api } from "@/services/api";
import { Issue } from "@/types";

export default function DashboardPage() {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [userName, setUserName] = useState("Builder");
  
  const [sprintHealth, setSprintHealth] = useState<SprintHealthData | null>(null);
  const [isSprintHealthLoading, setIsSprintHealthLoading] = useState(true);

  useEffect(() => {
    // Attempt to get user name from local storage
    try {
      const userStr = localStorage.getItem("user");
      if (userStr) {
        const user = JSON.parse(userStr);
        if (user.name) setUserName(user.name.split(" ")[0]);
      }
    } catch (e) {
      // ignore
    }
  }, []);

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
  
  const fetchSprintHealth = async () => {
    try {
      const response = await api.get("/ai/sprint-health");
      setSprintHealth(response.data);
    } catch (error) {
      console.error("Failed to fetch sprint health", error);
    } finally {
      setIsSprintHealthLoading(false);
    }
  };

  useEffect(() => {
    fetchIssues();
    fetchSprintHealth();
  }, []);

  const openIssues = issues.filter((i) => i.status === "Open").length;
  const inProgressIssues = issues.filter((i) => i.status === "In Progress" || i.status === "In Review").length;
  const resolvedIssues = issues.filter((i) => i.status === "Resolved" || i.status === "Closed").length;
  const criticalIssues = issues.filter((i) => i.priority === "Critical" && i.status !== "Resolved" && i.status !== "Closed").length;

  const totalActive = openIssues + inProgressIssues;
  
  // Calculate highest risk issue for AI panel
  const sortedByRisk = [...issues].sort((a, b) => (b.riskScore || 0) - (a.riskScore || 0));
  const highestRiskIssueTitle = sortedByRisk.length > 0 ? sortedByRisk[0].title : "None";
  
  // Simple calculation for most repeated category (bug type or priority)
  const mostRepeatedBugCategory = "Authentication / Payments"; // Placeholder or compute from issues

  return (
    <div className="flex-1 space-y-12 p-8 pt-10 max-w-screen-2xl mx-auto w-full font-sans">
      
      {/* Welcome Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b-2 border-border/50 pb-8">
        <div className="flex items-center gap-6">
          <div className="hidden sm:block w-24 h-24 relative transform -rotate-6 hover:rotate-0 transition-transform duration-500">
            <Image
              src="/assets/hero_mascot.png"
              alt="TrackForge Mascot"
              fill
              sizes="(max-width: 768px) 100vw, 33vw"
              className="object-contain drop-shadow-xl"
            />
          </div>
          <div>
            <h1 className="font-heading font-black text-4xl md:text-5xl tracking-tight text-foreground mb-2">
              Good Morning, {userName}.
            </h1>
            <p className="text-secondary text-lg font-medium flex items-center gap-2">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-accent"></span>
              </span>
              You have {totalActive} issues that need attention today.
            </p>
          </div>
        </div>
        <div>
          <Link href="/create-issue">
            <Button size="lg" className="h-14 px-8 font-bold text-lg border-2 border-foreground shadow-[4px_4px_0px_0px_currentColor] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all duration-300 bg-primary text-primary-foreground">
              <Plus className="mr-2 h-6 w-6" /> New Issue
            </Button>
          </Link>
        </div>
      </div>

      {/* AI Insights & Health */}
      <div className="grid gap-6 grid-cols-1 lg:grid-cols-4">
        <SprintHealthAnalyzer data={sprintHealth} loading={isSprintHealthLoading} />
        <AIInsightsPanel 
          highestRiskIssueTitle={highestRiskIssueTitle}
          mostRepeatedBugCategory={mostRepeatedBugCategory}
          sprintHealthScore={sprintHealth?.sprintHealthScore || 0}
          criticalIssueCount={criticalIssues}
        />
      </div>

      {/* Overview Widgets */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <BrandedWidget
          title="Open Issues"
          value={openIssues}
          imageSrc="/assets/bug_mascot.png"
          imageAlt="Bug Mascot"
          trend="Needs triage"
          trendUp={null}
        />
        <BrandedWidget
          title="In Progress"
          value={inProgressIssues}
          imageSrc="/assets/task_mascot.png"
          imageAlt="Task Mascot"
          trend="Currently forging"
          trendUp={true}
        />
        <BrandedWidget
          title="Resolved"
          value={resolvedIssues}
          imageSrc="/assets/resolved_mascot.png"
          imageAlt="Resolved Mascot"
          trend="Great job!"
          trendUp={true}
        />
        <BrandedWidget
          title="Critical Alerts"
          value={criticalIssues}
          imageSrc="/assets/critical_mascot.png"
          imageAlt="Critical Mascot"
          trend={criticalIssues > 0 ? "Requires action" : "All clear"}
          trendUp={criticalIssues === 0}
          colorClass={criticalIssues > 0 ? "bg-destructive/10 border-destructive/30" : "bg-surface"}
        />
      </div>

      {/* Issue Table Section */}
      <div className="flex flex-col space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="font-heading font-black text-3xl tracking-tight text-foreground flex items-center gap-3">
            <span className="w-8 h-8 rounded-lg bg-foreground text-background flex items-center justify-center text-sm transform rotate-3">
              I
            </span>
            Recent Issues
          </h2>
        </div>
        {isLoading ? (
          <div className="h-[400px] flex items-center justify-center rounded-2xl border-2 border-border bg-surface text-muted-foreground font-bold animate-pulse">
            Loading your forge...
          </div>
        ) : issues.length === 0 ? (
          <div className="h-[400px] flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-border bg-surface/50 text-center space-y-6">
            <div className="w-48 h-48 relative transform hover:scale-105 transition-transform duration-500">
              <Image src="/assets/empty_state.png" alt="Quiet Forge" fill sizes="(max-width: 768px) 100vw, 33vw" className="object-contain opacity-80" />
            </div>
            <div className="space-y-2">
              <h3 className="font-heading font-black text-2xl">Looks like your forge is quiet today.</h3>
              <p className="text-secondary font-medium">No active issues found. Enjoy the peace or create a new one.</p>
            </div>
            <Link href="/create-issue">
              <Button className="font-bold border-2 border-foreground shadow-[4px_4px_0px_0px_currentColor] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all duration-300">
                Log New Issue
              </Button>
            </Link>
          </div>
        ) : (
          <div className="rounded-2xl border-2 border-foreground shadow-[6px_6px_0px_0px_currentColor] overflow-hidden bg-card transition-all duration-300 hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[8px_8px_0px_0px_currentColor]">
            <IssueTable issues={issues} />
          </div>
        )}
      </div>
    </div>
  );
}
