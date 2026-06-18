"use client";
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Sparkles, AlertTriangle, CheckCircle2, Info, Loader2, RefreshCw } from 'lucide-react';
import { api } from '@/services/api';

export interface SprintHealthData {
  sprintHealthScore: number;
  riskLevel: 'Low' | 'Medium' | 'High';
  bottlenecks: string[];
  recommendations: string[];
}

export function SprintHealthAnalyzer() {
  const [data, setData] = useState<SprintHealthData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const analyze = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get('/ai/sprint-health');
      setData(response.data);
    } catch (err: any) {
      setError('AI analysis failed. Please try again in a moment.');
    } finally {
      setLoading(false);
    }
  };

  const getRiskIcon = (level: string) => {
    switch (level.toLowerCase()) {
      case 'low': return <CheckCircle2 className="w-6 h-6 text-green-500" />;
      case 'medium': return <AlertTriangle className="w-6 h-6 text-yellow-500" />;
      case 'high': return <AlertTriangle className="w-6 h-6 text-red-500" />;
      default: return <Info className="w-6 h-6 text-blue-500" />;
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-500';
    if (score >= 50) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getProgressColor = (score: number) => {
    if (score >= 80) return 'bg-green-500';
    if (score >= 50) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <Card className="col-span-3 border-2 border-border shadow-[4px_4px_0px_0px_currentColor] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all duration-300 bg-surface">
      <CardHeader className="border-b-2 border-border/50 pb-4">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="font-heading font-black flex items-center gap-2 text-2xl tracking-tight text-foreground">
              <Sparkles className="w-6 h-6 text-primary" />
              AI Sprint Health Analyzer
            </CardTitle>
            <CardDescription className="text-secondary font-medium mt-1">
              Gemini AI insights based on current sprint metrics
            </CardDescription>
          </div>
          <Button
            onClick={analyze}
            disabled={loading}
            className="h-10 px-4 font-bold border-2 border-foreground shadow-[3px_3px_0px_0px_currentColor] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all duration-200 bg-primary text-primary-foreground"
          >
            {loading ? (
              <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Analyzing...</>
            ) : data ? (
              <><RefreshCw className="w-4 h-4 mr-2" /> Re-Analyze</>
            ) : (
              <><Sparkles className="w-4 h-4 mr-2" /> Analyze Sprint</>
            )}
          </Button>
        </div>
      </CardHeader>

      <CardContent className="pt-6">
        {/* Idle State */}
        {!data && !loading && !error && (
          <div className="h-40 flex flex-col items-center justify-center gap-3 text-center">
            <div className="w-14 h-14 rounded-2xl bg-primary/10 border-2 border-primary/20 flex items-center justify-center">
              <Sparkles className="w-7 h-7 text-primary" />
            </div>
            <p className="text-secondary font-medium text-sm max-w-xs">
              Click <strong className="text-foreground">"Analyze Sprint"</strong> to get an AI-powered health report of your current sprint based on your open issues.
            </p>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="h-40 flex flex-col items-center justify-center gap-3">
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
            <p className="text-secondary font-medium text-sm">Gemini is analyzing your sprint data...</p>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="h-40 flex flex-col items-center justify-center gap-3 text-center">
            <AlertTriangle className="w-8 h-8 text-destructive" />
            <p className="text-destructive font-medium text-sm">{error}</p>
            <Button variant="outline" size="sm" onClick={analyze} className="font-bold">
              Try Again
            </Button>
          </div>
        )}

        {/* Results */}
        {data && !loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-end mb-2">
                  <span className="text-sm font-bold text-secondary">Sprint Health Score</span>
                  <span className={`text-3xl font-black ${getScoreColor(data.sprintHealthScore)}`}>
                    {data.sprintHealthScore}<span className="text-lg text-secondary font-medium">/100</span>
                  </span>
                </div>
                <div className="h-3 w-full bg-muted rounded-full overflow-hidden border border-border">
                  <div
                    className={`h-full rounded-full transition-all duration-700 ${getProgressColor(data.sprintHealthScore)}`}
                    style={{ width: `${data.sprintHealthScore}%` }}
                  />
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 rounded-xl bg-muted/50 border-2 border-border">
                <div className="flex-shrink-0">{getRiskIcon(data.riskLevel)}</div>
                <div>
                  <p className="text-xs font-bold text-secondary uppercase tracking-wider">Overall Risk Level</p>
                  <p className="font-black text-lg text-foreground">{data.riskLevel}</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              {data.bottlenecks && data.bottlenecks.length > 0 && (
                <div>
                  <h4 className="text-sm font-black mb-2 flex items-center gap-1 text-orange-500 uppercase tracking-wider">
                    <AlertTriangle className="w-4 h-4" /> Bottlenecks
                  </h4>
                  <ul className="text-sm space-y-2">
                    {data.bottlenecks.map((b, i) => (
                      <li key={i} className="flex items-start gap-2 text-secondary">
                        <span className="w-1.5 h-1.5 rounded-full bg-orange-500 mt-2 flex-shrink-0" />
                        {b}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {data.recommendations && data.recommendations.length > 0 && (
                <div>
                  <h4 className="text-sm font-black mb-2 flex items-center gap-1 text-green-500 uppercase tracking-wider">
                    <CheckCircle2 className="w-4 h-4" /> Recommendations
                  </h4>
                  <ul className="text-sm space-y-2">
                    {data.recommendations.map((r, i) => (
                      <li key={i} className="flex items-start gap-2 text-secondary">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-500 mt-2 flex-shrink-0" />
                        {r}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
