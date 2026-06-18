"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2, ArrowLeft, Sparkles } from "lucide-react";
import Link from "next/link";

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
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { api } from "@/services/api";
import { DuplicateIssueWarningModal, DuplicateIssue } from "@/components/ai/DuplicateIssueWarningModal";

const formSchema = z.object({
  title: z.string().min(5, { message: "Title must be at least 5 characters." }),
  description: z.string().min(10, { message: "Description must be at least 10 characters." }),
  type: z.string().min(1, { message: "Please select an issue type." }),
  priority: z.string().min(1, { message: "Please select a priority." }),
  status: z.string(),
});

export default function CreateIssuePage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isAiProcessing, setIsAiProcessing] = useState(false);
  
  // Duplicate Modal State
  const [showDuplicateModal, setShowDuplicateModal] = useState(false);
  const [duplicates, setDuplicates] = useState<DuplicateIssue[]>([]);
  const [pendingValues, setPendingValues] = useState<z.infer<typeof formSchema> | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      type: "Bug",
      priority: "Medium",
      status: "Open",
    },
  });

  async function checkDuplicatesAndProceed(values: z.infer<typeof formSchema>) {
    try {
      setIsLoading(true);
      setError(null);
      
      const res = await api.post("/ai/check-duplicate", {
        title: values.title,
        description: values.description
      });
      
      if (res.data.hasDuplicate && res.data.similarIssues?.length > 0) {
        // Only show modal if confidence is somewhat high, assuming backend does that filter, but let's just check length
        setDuplicates(res.data.similarIssues);
        setPendingValues(values);
        setShowDuplicateModal(true);
        setIsLoading(false);
        return;
      }
      
      // No duplicates, proceed to AI prioritize and save
      await proceedWithCreate(values);
      
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to check duplicates.");
      setIsLoading(false);
    }
  }

  async function proceedWithCreate(values: z.infer<typeof formSchema>) {
    try {
      setIsLoading(true);
      setIsAiProcessing(true);
      
      // 1. Get AI Prioritization
      const aiRes = await api.post("/ai/prioritize", {
        title: values.title,
        description: values.description,
        tags: [values.type],
        severity: values.priority
      });
      
      const aiData = aiRes.data;
      
      // 2. Submit Issue with AI Data
      const finalPayload = {
        ...values,
        priority: aiData.priority || values.priority, // override with AI priority
        riskScore: aiData.riskScore,
        estimatedImpact: aiData.estimatedImpact,
        aiExplanation: aiData.shortExplanation
      };
      
      await api.post("/issues", finalPayload);
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to create issue. Please try again.");
      setIsLoading(false);
      setIsAiProcessing(false);
    }
  }

  function onSubmit(values: z.infer<typeof formSchema>) {
    checkDuplicatesAndProceed(values);
  }

  return (
    <div className="flex-1 space-y-6 p-8 pt-6 max-w-3xl mx-auto w-full">
      <DuplicateIssueWarningModal 
        isOpen={showDuplicateModal}
        onClose={() => setShowDuplicateModal(false)}
        duplicates={duplicates}
        onContinue={() => {
          setShowDuplicateModal(false);
          if (pendingValues) proceedWithCreate(pendingValues);
        }}
      />
      
      <div className="flex items-center space-x-4 mb-6">
        <Link href="/dashboard">
          <Button variant="ghost" size="icon" className="rounded-full">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Create New Issue</h2>
          <p className="text-muted-foreground">
            Fill out the details below to log a new issue.
          </p>
        </div>
      </div>

      <div className="rounded-2xl border bg-card p-8 shadow-sm">
        {error && (
          <div className="mb-6 rounded-md bg-destructive/15 p-3 text-sm text-destructive font-medium">
            {error}
          </div>
        )}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="E.g., Fix login page crashing on mobile" {...field} className="h-11" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Provide detailed steps to reproduce, expected behavior, etc." 
                      className="min-h-[150px] resize-y"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Issue Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="h-11">
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Bug">Bug</SelectItem>
                        <SelectItem value="Feature">Feature</SelectItem>
                        <SelectItem value="Enhancement">Enhancement</SelectItem>
                        <SelectItem value="Task">Task</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="priority"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Severity (User Input)</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="h-11">
                          <SelectValue placeholder="Select priority" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Low">Low</SelectItem>
                        <SelectItem value="Medium">Medium</SelectItem>
                        <SelectItem value="High">High</SelectItem>
                        <SelectItem value="Critical">Critical</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-muted-foreground mt-1">AI will refine priority automatically.</p>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex justify-end pt-4 border-t">
              <Link href="/dashboard" className="mr-4">
                <Button variant="outline" type="button" className="h-11 px-8">
                  Cancel
                </Button>
              </Link>
              <Button type="submit" className="h-11 px-8" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {isAiProcessing ? "AI Prioritizing..." : "Checking..."}
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Create with AI
                  </>
                )}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
