"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { format } from "date-fns";
import { ArrowLeft, Clock, MessageSquare, Trash2, Edit } from "lucide-react";
import { Issue } from "@/types";
import { api } from "@/services/api";
import { Button } from "@/components/ui/button";
import { StatusBadge, PriorityBadge } from "@/components/shared/StatusBadge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function IssueDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const [issue, setIssue] = useState<Issue | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);

  const fetchIssue = async (issueId: string) => {
    try {
      const response = await api.get(`/issues/${issueId}`);
      setIssue(response.data);
    } catch (error) {
      console.error("Failed to fetch issue details", error);
      router.push("/dashboard");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchIssue(id as string);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleStatusChange = async (newStatus: string) => {
    if (!issue) return;
    try {
      setIsUpdating(true);
      const response = await api.put(`/issues/${issue.id}`, {
        ...issue,
        status: newStatus,
      });
      setIssue(response.data);
    } catch (error) {
      console.error("Failed to update status", error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = async () => {
    if (!issue || !confirm("Are you sure you want to delete this issue?")) return;
    try {
      await api.delete(`/issues/${issue.id}`);
      router.push("/dashboard");
    } catch (error) {
      console.error("Failed to delete issue", error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex-1 p-8 pt-6 max-w-screen-xl mx-auto w-full flex justify-center items-center h-[50vh]">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-muted-foreground font-medium">Loading issue details...</p>
        </div>
      </div>
    );
  }

  if (!issue) return null;

  return (
    <div className="flex-1 space-y-6 p-8 pt-6 max-w-screen-xl mx-auto w-full">
      <div className="flex items-center space-x-4 mb-2">
        <Link href="/dashboard">
          <Button variant="ghost" size="icon" className="rounded-full hover:bg-muted">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <span className="font-mono text-sm text-muted-foreground bg-muted/50 px-2 py-1 rounded-md">
          {issue.id}
        </span>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="flex-1 space-y-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight mb-4">{issue.title}</h1>
            <div className="prose prose-slate dark:prose-invert max-w-none bg-card border rounded-2xl p-6 shadow-sm min-h-[200px] whitespace-pre-wrap">
              {issue.description}
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Activity
            </h3>
            <div className="bg-card border rounded-2xl p-6 shadow-sm">
              <div className="flex gap-4 relative">
                <div className="flex flex-col items-center">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                    {issue.createdBy.charAt(0).toUpperCase()}
                  </div>
                  <div className="h-full w-0.5 bg-border my-2 min-h-[40px]"></div>
                </div>
                <div className="flex-1 pt-2">
                  <div className="flex items-baseline gap-2 mb-1">
                    <span className="font-medium">{issue.createdBy}</span>
                    <span className="text-sm text-muted-foreground">created this issue</span>
                  </div>
                  <div className="text-sm text-muted-foreground flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {format(new Date(issue.createdAt), "MMM d, yyyy 'at' h:mm a")}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full lg:w-[350px] space-y-6">
          <div className="bg-card border rounded-2xl p-6 shadow-sm space-y-6 sticky top-24">
            <div>
              <h4 className="text-sm font-medium text-muted-foreground mb-3 uppercase tracking-wider">Status</h4>
              <Select 
                value={issue.status} 
                onValueChange={handleStatusChange}
                disabled={isUpdating}
              >
                <SelectTrigger className="w-full h-11 border-muted">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Open">Open</SelectItem>
                  <SelectItem value="In Progress">In Progress</SelectItem>
                  <SelectItem value="In Review">In Review</SelectItem>
                  <SelectItem value="Resolved">Resolved</SelectItem>
                  <SelectItem value="Closed">Closed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <h4 className="text-sm font-medium text-muted-foreground mb-3 uppercase tracking-wider">Details</h4>
              <div className="space-y-4 bg-muted/30 rounded-xl p-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Type</span>
                  <span className="font-medium">{issue.type}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Priority</span>
                  <PriorityBadge priority={issue.priority} />
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Reporter</span>
                  <span className="text-sm font-medium truncate max-w-[150px]" title={issue.createdBy}>{issue.createdBy}</span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t flex gap-3">
              <Button variant="outline" className="flex-1 bg-background">
                <Edit className="mr-2 h-4 w-4" /> Edit
              </Button>
              <Button variant="destructive" className="flex-1" onClick={handleDelete}>
                <Trash2 className="mr-2 h-4 w-4" /> Delete
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
