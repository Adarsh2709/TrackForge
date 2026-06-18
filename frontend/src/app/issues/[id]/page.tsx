"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
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

import { AIPriorityBadge } from "@/components/ai/AIPriorityBadge";
import { Sparkles } from "lucide-react";

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

  const handleStatusChange = async (newStatus: string | null) => {
    if (!issue || !newStatus) return;
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
          <div className="w-16 h-16 relative mb-4">
            <Image src="/assets/hero_mascot.png" alt="Loading Forge" fill sizes="(max-width: 768px) 100vw, 33vw" className="object-contain opacity-50 grayscale" />
          </div>
          <p className="mt-4 text-secondary font-heading font-bold text-xl">Loading your issue...</p>
        </div>
      </div>
    );
  }

  if (!issue) return null;

  return (
    <div className="flex-1 p-8 pt-10 max-w-screen-xl mx-auto w-full font-sans">
      <div className="flex items-center space-x-4 mb-6">
        <Link href="/dashboard">
          <Button variant="ghost" size="icon" className="rounded-xl border-2 border-transparent hover:border-border bg-surface hover:bg-muted transition-all">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
      </div>

      <div className="flex flex-col lg:flex-row gap-12">
        <div className="flex-1 space-y-12">
          <div>
            <h1 className="font-heading font-black text-4xl md:text-5xl lg:text-6xl tracking-tighter text-foreground leading-[1.1] mb-8 drop-shadow-sm">
              {issue.title}
            </h1>
            <div className="prose prose-lg dark:prose-invert max-w-none bg-surface border-2 border-border rounded-2xl p-8 shadow-[4px_4px_0px_0px_currentColor] text-foreground font-medium leading-relaxed min-h-[300px] whitespace-pre-wrap relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-full pointer-events-none" />
              {issue.description}
            </div>
          </div>
          
          {issue.aiExplanation && (
            <div>
              <h3 className="font-heading font-black text-2xl flex items-center gap-3 text-blue-600 mb-4">
                <Sparkles className="h-6 w-6" />
                AI Analysis
              </h3>
              <div className="bg-blue-500/5 border-2 border-blue-500/20 rounded-2xl p-6 shadow-sm">
                <p className="font-medium text-foreground">{issue.aiExplanation}</p>
                <div className="mt-4 flex gap-4 text-sm font-semibold">
                  <span className="bg-blue-500/10 text-blue-600 px-3 py-1 rounded-full">
                    Risk Score: {issue.riskScore}/100
                  </span>
                  <span className="bg-blue-500/10 text-blue-600 px-3 py-1 rounded-full">
                    Impact: {issue.estimatedImpact}
                  </span>
                </div>
              </div>
            </div>
          )}

          <div className="space-y-6">
            <h3 className="font-heading font-black text-2xl flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-accent text-accent-foreground flex items-center justify-center transform rotate-6 border-2 border-foreground/10">
                <MessageSquare className="h-4 w-4" />
              </div>
              Activity Trail
            </h3>
            <div className="bg-surface border-2 border-border rounded-2xl p-8 shadow-[4px_4px_0px_0px_currentColor]">
              <div className="flex gap-6 relative">
                <div className="flex flex-col items-center">
                  <div className="h-12 w-12 rounded-full bg-primary border-2 border-foreground flex items-center justify-center text-primary-foreground font-heading font-black text-xl shadow-sm z-10">
                    {issue.createdBy.charAt(0).toUpperCase()}
                  </div>
                  <div className="h-full w-0.5 bg-border my-2 min-h-[60px]"></div>
                </div>
                <div className="flex-1 pt-2">
                  <div className="flex items-baseline gap-2 mb-2">
                    <span className="font-bold text-lg">{issue.createdBy}</span>
                    <span className="text-secondary font-medium">forged this issue</span>
                  </div>
                  <div className="text-sm font-bold text-secondary flex items-center gap-1.5">
                    <Clock className="h-4 w-4" />
                    {format(new Date(issue.createdAt), "MMM d, yyyy 'at' h:mm a")}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full lg:w-[400px] space-y-8">
          <div className="bg-card border-2 border-foreground rounded-2xl p-8 shadow-[8px_8px_0px_0px_currentColor] space-y-8 sticky top-24 transform hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[10px_10px_0px_0px_currentColor] transition-all duration-300">
            <div>
              <h4 className="font-heading font-black text-sm text-secondary mb-4 uppercase tracking-widest">Current Status</h4>
              <Select 
                value={issue.status} 
                onValueChange={handleStatusChange}
                disabled={isUpdating}
              >
                <SelectTrigger className="w-full h-14 border-2 border-border bg-surface font-bold text-lg rounded-xl focus:ring-primary focus:ring-offset-0 focus:border-primary">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent className="border-2 border-foreground rounded-xl shadow-[4px_4px_0px_0px_currentColor] font-medium">
                  <SelectItem value="Open">Open</SelectItem>
                  <SelectItem value="In Progress">In Progress</SelectItem>
                  <SelectItem value="In Review">In Review</SelectItem>
                  <SelectItem value="Resolved">Resolved</SelectItem>
                  <SelectItem value="Closed">Closed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <h4 className="font-heading font-black text-sm text-secondary mb-4 uppercase tracking-widest">Blueprint Details</h4>
              <div className="space-y-4 bg-surface border-2 border-border rounded-xl p-6">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-secondary">Type</span>
                  <span className="font-black px-3 py-1 bg-muted rounded-md border-2 border-transparent">{issue.type}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-bold text-secondary">Priority</span>
                  <AIPriorityBadge priority={issue.priority} />
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-bold text-secondary">Reporter</span>
                  <span className="font-black truncate max-w-[150px]" title={issue.createdBy}>{issue.createdBy}</span>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t-2 border-border flex gap-4">
              <Button variant="outline" className="flex-1 h-12 bg-surface font-bold border-2 border-border hover:border-primary hover:bg-muted transition-colors">
                <Edit className="mr-2 h-4 w-4" /> Edit
              </Button>
              <Button variant="destructive" className="flex-1 h-12 font-bold border-2 border-destructive hover:bg-destructive/90 transition-colors" onClick={handleDelete}>
                <Trash2 className="mr-2 h-4 w-4" /> Delete
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
