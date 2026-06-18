import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BrainCircuit, Bug, Target, Activity } from 'lucide-react';

interface AIInsightsPanelProps {
  highestRiskIssueTitle?: string;
  mostRepeatedBugCategory?: string;
  sprintHealthScore?: number;
  criticalIssueCount?: number;
}

export function AIInsightsPanel({
  highestRiskIssueTitle = "Loading...",
  mostRepeatedBugCategory = "Loading...",
  sprintHealthScore = 0,
  criticalIssueCount = 0
}: AIInsightsPanelProps) {
  return (
    <Card className="col-span-full relative overflow-hidden border-2 border-border shadow-[4px_4px_0px_0px_currentColor] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all duration-300 bg-surface">
      <CardHeader className="border-b-2 border-border/50 pb-4">
        <CardTitle className="font-heading font-black flex items-center gap-2 text-2xl tracking-tight text-foreground">
          <BrainCircuit className="w-6 h-6 text-primary" />
          AI Engineering Insights
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-5 rounded-xl bg-surface border-2 border-border shadow-[4px_4px_0px_0px_currentColor] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all duration-200 group">
            <div className="flex items-center gap-2 text-destructive mb-3">
              <Target className="w-5 h-5 group-hover:scale-110 transition-transform" />
              <h4 className="font-heading font-black text-sm uppercase tracking-wider text-secondary">Highest Risk</h4>
            </div>
            <p className="text-lg font-bold line-clamp-2 leading-tight">{highestRiskIssueTitle}</p>
          </div>

          <div className="p-5 rounded-xl bg-surface border-2 border-border shadow-[4px_4px_0px_0px_currentColor] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all duration-200 group">
            <div className="flex items-center gap-2 text-orange-500 mb-3">
              <Bug className="w-5 h-5 group-hover:scale-110 transition-transform" />
              <h4 className="font-heading font-black text-sm uppercase tracking-wider text-secondary">Most Repeated</h4>
            </div>
            <p className="text-lg font-bold leading-tight">{mostRepeatedBugCategory}</p>
          </div>

          <div className="p-5 rounded-xl bg-surface border-2 border-border shadow-[4px_4px_0px_0px_currentColor] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all duration-200 group">
            <div className="flex items-center gap-2 text-blue-500 mb-3">
              <Activity className="w-5 h-5 group-hover:scale-110 transition-transform" />
              <h4 className="font-heading font-black text-sm uppercase tracking-wider text-secondary">Health</h4>
            </div>
            <p className="text-4xl font-black">{sprintHealthScore}</p>
          </div>

          <div className="p-5 rounded-xl bg-surface border-2 border-border shadow-[4px_4px_0px_0px_currentColor] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all duration-200 group">
            <div className="flex items-center gap-2 text-purple-500 mb-3">
              <AlertTriangleIcon className="w-5 h-5 group-hover:scale-110 transition-transform" />
              <h4 className="font-heading font-black text-sm uppercase tracking-wider text-secondary">Critical</h4>
            </div>
            <p className="text-4xl font-black">{criticalIssueCount}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
function AlertTriangleIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
      <path d="M12 9v4" />
      <path d="M12 17h.01" />
    </svg>
  );
}
