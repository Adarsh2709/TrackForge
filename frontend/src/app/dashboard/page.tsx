"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, LayoutDashboard, CheckCircle2, AlertCircle, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { IssueTable } from "@/components/issues/IssueTable";
import { MetricsCard } from "@/components/shared/MetricsCard";
import { api } from "@/services/api";
import { Issue } from "@/types";

export default function DashboardPage() {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [isLoading, setIsLoading] = useState(true);

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

  const openIssues = issues.filter((i) => i.status === "Open" || i.status === "In Progress").length;
  const resolvedIssues = issues.filter((i) => i.status === "Resolved" || i.status === "Closed").length;
  const criticalIssues = issues.filter((i) => i.priority === "Critical" && i.status !== "Resolved" && i.status !== "Closed").length;

  return (
    <div className="flex-1 space-y-6 p-8 pt-6 max-w-screen-2xl mx-auto w-full">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
          <p className="text-muted-foreground">
            Overview of your project issues and metrics.
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Link href="/create-issue">
            <Button className="h-10">
              <Plus className="mr-2 h-4 w-4" /> New Issue
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricsCard
          title="Total Issues"
          value={issues.length}
          icon={LayoutDashboard}
        />
        <MetricsCard
          title="Open & In Progress"
          value={openIssues}
          icon={Clock}
          trend={`${Math.round((openIssues / (issues.length || 1)) * 100)}% of total`}
        />
        <MetricsCard
          title="Resolved"
          value={resolvedIssues}
          icon={CheckCircle2}
          trendUp={true}
          trend={`${Math.round((resolvedIssues / (issues.length || 1)) * 100)}% completion`}
        />
        <MetricsCard
          title="Critical Alerts"
          value={criticalIssues}
          icon={AlertCircle}
          trend={criticalIssues > 0 ? "Requires immediate attention" : "All good"}
          trendUp={criticalIssues === 0}
        />
      </div>

      <div className="flex flex-col space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold tracking-tight">Recent Issues</h3>
        </div>
        {isLoading ? (
          <div className="h-64 flex items-center justify-center rounded-xl border bg-card text-muted-foreground">
            Loading issues...
          </div>
        ) : (
          <IssueTable issues={issues} />
        )}
      </div>
    </div>
  );
}
