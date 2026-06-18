import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Sparkles, AlertTriangle, CheckCircle2, Info } from 'lucide-react';

export interface SprintHealthData {
  sprintHealthScore: number;
  riskLevel: 'Low' | 'Medium' | 'High';
  bottlenecks: string[];
  recommendations: string[];
}

interface SprintHealthAnalyzerProps {
  data: SprintHealthData | null;
  loading?: boolean;
}

export function SprintHealthAnalyzer({ data, loading }: SprintHealthAnalyzerProps) {
  if (loading) {
    return (
      <Card className="col-span-3 border-2 border-border shadow-[4px_4px_0px_0px_currentColor] bg-surface">
        <CardHeader className="border-b-2 border-border/50 pb-4">
          <CardTitle className="font-heading font-black flex items-center gap-2 text-2xl tracking-tight text-foreground">
            <Sparkles className="w-6 h-6 text-primary" />
            AI Sprint Health Analyzer
          </CardTitle>
          <CardDescription className="text-secondary font-medium">Analyzing sprint data...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-48 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!data) return null;

  const getRiskIcon = (level: string) => {
    switch(level.toLowerCase()) {
      case 'low': return <CheckCircle2 className="w-6 h-6 text-green-500" />;
      case 'medium': return <AlertTriangle className="w-6 h-6 text-yellow-500" />;
      case 'high': return <AlertTriangle className="w-6 h-6 text-red-500" />;
      default: return <Info className="w-6 h-6 text-blue-500" />;
    }
  };

  const getScoreColorClass = (score: number) => {
    if (score >= 80) return "bg-green-500";
    if (score >= 50) return "bg-yellow-500";
    return "bg-red-500";
  };

  return (
    <Card className="col-span-3 border-2 border-border shadow-[4px_4px_0px_0px_currentColor] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all duration-300 bg-surface">
      <CardHeader className="border-b-2 border-border/50 pb-4">
        <CardTitle className="font-heading font-black flex items-center gap-2 text-2xl tracking-tight text-foreground">
          <Sparkles className="w-6 h-6 text-primary" />
          AI Sprint Health Analyzer
        </CardTitle>
        <CardDescription className="text-secondary font-medium">Gemini AI insights based on current sprint metrics</CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <div className="flex justify-between items-end mb-2">
                <span className="text-sm font-medium">Sprint Health Score</span>
                <span className="text-2xl font-bold">{data.sprintHealthScore}/100</span>
              </div>
              <Progress value={data.sprintHealthScore} className={`h-2 ${getScoreColorClass(data.sprintHealthScore)}`} />
            </div>
            
            <div className="flex items-center gap-3 p-4 rounded-lg bg-muted/50 border">
              <div className="flex-shrink-0">
                {getRiskIcon(data.riskLevel)}
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Overall Risk Level</p>
                <p className="font-semibold text-lg">{data.riskLevel}</p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            {data.bottlenecks && data.bottlenecks.length > 0 && (
              <div>
                <h4 className="text-sm font-semibold mb-2 flex items-center gap-1 text-orange-500">
                  <AlertTriangle className="w-4 h-4" /> Bottlenecks
                </h4>
                <ul className="text-sm space-y-1 list-disc list-inside text-muted-foreground">
                  {data.bottlenecks.map((b, i) => <li key={i}>{b}</li>)}
                </ul>
              </div>
            )}
            
            {data.recommendations && data.recommendations.length > 0 && (
              <div>
                <h4 className="text-sm font-semibold mb-2 flex items-center gap-1 text-green-500">
                  <CheckCircle2 className="w-4 h-4" /> AI Recommendations
                </h4>
                <ul className="text-sm space-y-1 list-disc list-inside text-muted-foreground">
                  {data.recommendations.map((r, i) => <li key={i}>{r}</li>)}
                </ul>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
