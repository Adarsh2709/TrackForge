"use client";
import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sparkles, AlertTriangle, CheckCircle2, Info, Loader2, RefreshCw, Clock } from 'lucide-react';
import { api } from '@/services/api';

export interface SprintHealthData {
  sprintHealthScore: number;
  riskLevel: 'Low' | 'Medium' | 'High';
  bottlenecks: string[];
  recommendations: string[];
}

type ViewState = 'idle' | 'loading' | 'error' | 'rate-limited' | 'success';

export function SprintHealthAnalyzer() {
  const [view, setView] = useState<ViewState>('idle');
  const [data, setData] = useState<SprintHealthData | null>(null);
  const [countdown, setCountdown] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Countdown timer for rate limit — runs once when countdown is first set
  useEffect(() => {
    if (countdown <= 0) return;
    // Clear any existing interval before starting a new one
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          timerRef.current = null;
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [countdown === 0 ? 0 : 1]); // only re-run when transitioning from 0 → non-zero

  const analyze = async () => {
    setView('loading');
    setData(null);
    try {
      const response = await api.get('/ai/sprint-health');
      const result: SprintHealthData = response.data;
      // Detect rate-limit fallback from backend
      if (result.bottlenecks?.some(b => b.toLowerCase().includes('rate limit'))) {
        setCountdown(65); // 65s covers the full 1-min Gemini rate limit window
        setView('rate-limited');
      } else {
        setData(result);
        setView('success');
      }
    } catch (err: any) {
      setView('error');
    }
  };

  const getRiskIcon = (level: string) => {
    switch (level?.toLowerCase()) {
      case 'low': return <CheckCircle2 className="w-6 h-6 text-green-500" />;
      case 'high': return <AlertTriangle className="w-6 h-6 text-red-500" />;
      default: return <AlertTriangle className="w-6 h-6 text-yellow-500" />;
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
            disabled={view === 'loading' || countdown > 0}
            className="h-10 px-4 font-bold border-2 border-foreground shadow-[3px_3px_0px_0px_currentColor] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all duration-200 bg-primary text-primary-foreground disabled:opacity-50 disabled:cursor-not-allowed disabled:translate-x-0 disabled:translate-y-0 disabled:shadow-[3px_3px_0px_0px_currentColor]"
          >
            {view === 'loading' ? (
              <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Analyzing...</>
            ) : countdown > 0 ? (
              <><Clock className="w-4 h-4 mr-2" /> Wait {countdown}s</>
            ) : view === 'success' ? (
              <><RefreshCw className="w-4 h-4 mr-2" /> Re-Analyze</>
            ) : (
              <><Sparkles className="w-4 h-4 mr-2" /> Analyze Sprint</>
            )}
          </Button>
        </div>
      </CardHeader>

      <CardContent className="pt-6">

        {/* Idle State */}
        {view === 'idle' && (
          <div className="h-40 flex flex-col items-center justify-center gap-3 text-center">
            <div className="w-14 h-14 rounded-2xl bg-primary/10 border-2 border-primary/20 flex items-center justify-center">
              <Sparkles className="w-7 h-7 text-primary" />
            </div>
            <p className="text-secondary font-medium text-sm max-w-xs">
              Click <strong className="text-foreground">"Analyze Sprint"</strong> to get an AI-powered health report of your current sprint.
            </p>
          </div>
        )}

        {/* Loading State */}
        {view === 'loading' && (
          <div className="h-40 flex flex-col items-center justify-center gap-3">
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
            <p className="text-secondary font-medium text-sm">AI is analyzing your sprint data...</p>
          </div>
        )}

        {/* Error State */}
        {view === 'error' && (
          <div className="h-40 flex flex-col items-center justify-center gap-3 text-center">
            <AlertTriangle className="w-8 h-8 text-destructive" />
            <p className="text-destructive font-medium text-sm">AI analysis failed. Please check your connection and try again.</p>
            <Button variant="outline" size="sm" onClick={analyze} className="font-bold">Try Again</Button>
          </div>
        )}

        {/* Rate Limited State */}
        {view === 'rate-limited' && (
          <div className="h-40 flex flex-col items-center justify-center gap-3 text-center px-4">
            <div className="w-14 h-14 rounded-2xl bg-yellow-500/10 border-2 border-yellow-500/30 flex items-center justify-center">
              <Clock className="w-7 h-7 text-yellow-500" />
            </div>
            <div>
              <p className="font-black text-foreground">API Rate Limit Reached</p>
              <p className="text-secondary text-sm mt-1">
                Gemini API limit: 10 requests/min.
                {countdown > 0
                  ? <> Button re-enables in <strong className="text-primary">{countdown}s</strong>.</>
                  : <> Click <strong className="text-primary">Re-Analyze</strong> to try again.</>
                }
              </p>
            </div>
          </div>
        )}

        {/* Results */}
        {view === 'success' && data && (
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
              {data.bottlenecks?.length > 0 && (
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

              {data.recommendations?.length > 0 && (
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
