"use client";

import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { Issue } from "@/types";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { AIPriorityBadge } from "@/components/ai/AIPriorityBadge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Bug, FileCode, CheckCircle2, ListTodo, Sparkles } from "lucide-react";

interface IssueTableProps {
  issues: Issue[];
}

export function IssueTable({ issues }: IssueTableProps) {
  const router = useRouter();

  const getTypeIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case "bug":
        return <Bug className="h-4 w-4 text-destructive" />;
      case "feature":
        return <FileCode className="h-4 w-4 text-blue-500" />;
      case "enhancement":
        return <CheckCircle2 className="h-4 w-4 text-emerald-500" />;
      default:
        return <ListTodo className="h-4 w-4 text-muted-foreground" />;
    }
  };

  return (
    <div className="w-full overflow-auto">
      <Table>
        <TableHeader className="bg-muted border-b-2 border-foreground">
          <TableRow className="hover:bg-transparent">
            <TableHead className="w-[100px] font-heading font-black text-foreground uppercase tracking-wider text-xs">ID</TableHead>
            <TableHead className="font-heading font-black text-foreground uppercase tracking-wider text-xs">Title</TableHead>
            <TableHead className="w-[120px] font-heading font-black text-foreground uppercase tracking-wider text-xs">Status</TableHead>
            <TableHead className="w-[140px] font-heading font-black text-foreground uppercase tracking-wider text-xs">Priority</TableHead>
            <TableHead className="w-[100px] font-heading font-black text-foreground uppercase tracking-wider text-xs flex items-center gap-1">
              <Sparkles className="w-3 h-3" /> Risk
            </TableHead>
            <TableHead className="w-[150px] font-heading font-black text-foreground uppercase tracking-wider text-xs text-right pr-6">Created</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {issues.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="h-24 text-center font-medium text-secondary">
                No issues found.
              </TableCell>
            </TableRow>
          ) : (
            issues.map((issue) => (
              <TableRow 
                key={issue.id}
                className="cursor-pointer transition-colors hover:bg-muted/50 group border-b-2 border-border/50 last:border-0"
                onClick={() => router.push(`/issues/${issue.id}`)}
              >
                <TableCell className="font-mono text-xs font-bold text-secondary group-hover:text-primary transition-colors">
                  {issue.id.substring(0, 8)}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="p-1.5 rounded-md bg-surface border-2 border-border group-hover:border-primary/50 transition-colors">
                      {getTypeIcon(issue.type)}
                    </div>
                    <span className="font-bold text-foreground group-hover:text-primary transition-colors">{issue.title}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <StatusBadge status={issue.status} />
                </TableCell>
                <TableCell>
                  <AIPriorityBadge priority={issue.priority} />
                </TableCell>
                <TableCell>
                  <span className={`font-mono text-xs px-2 py-1 rounded-md font-bold ${
                    (issue.riskScore || 0) >= 80 ? 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400' :
                    (issue.riskScore || 0) >= 50 ? 'bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400' :
                    'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400'
                  }`}>
                    {issue.riskScore || 0}/100
                  </span>
                </TableCell>
                <TableCell className="text-sm font-medium text-secondary text-right pr-6">
                  {format(new Date(issue.createdAt), "MMM d, yyyy")}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
