"use client";

import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { Issue } from "@/types";
import { StatusBadge, PriorityBadge } from "@/components/shared/StatusBadge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Bug, FileCode, CheckCircle2, ListTodo } from "lucide-react";

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
    <div className="rounded-xl border bg-card text-card-foreground shadow-sm overflow-hidden">
      <Table>
        <TableHeader className="bg-muted/50">
          <TableRow className="hover:bg-transparent">
            <TableHead className="w-[100px] font-medium">ID</TableHead>
            <TableHead className="font-medium">Title</TableHead>
            <TableHead className="w-[120px] font-medium">Status</TableHead>
            <TableHead className="w-[120px] font-medium">Priority</TableHead>
            <TableHead className="w-[150px] font-medium">Created</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {issues.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                No issues found.
              </TableCell>
            </TableRow>
          ) : (
            issues.map((issue) => (
              <TableRow 
                key={issue.id}
                className="cursor-pointer transition-colors hover:bg-muted/50 group"
                onClick={() => router.push(`/issues/${issue.id}`)}
              >
                <TableCell className="font-mono text-xs text-muted-foreground group-hover:text-foreground transition-colors">
                  {issue.id.substring(0, 8)}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {getTypeIcon(issue.type)}
                    <span className="font-medium">{issue.title}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <StatusBadge status={issue.status} />
                </TableCell>
                <TableCell>
                  <PriorityBadge priority={issue.priority} />
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
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
