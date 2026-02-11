import { cn } from '@/lib/utils';
import { AlertTriangle, CheckCircle, Lightbulb, Target, ArrowRight } from 'lucide-react';
import { StatusBadge } from './StatusBadge';
import type { AnalysisSection } from '@/types/diligence';

interface AnalysisCardProps {
  section: AnalysisSection;
  index: number;
}

export function AnalysisCard({ section, index }: AnalysisCardProps) {
  return (
    <div
      className="bg-card border border-border rounded-lg overflow-hidden animate-fade-in"
      style={{ animationDelay: `${index * 50}ms` }}
    >
      {/* Section Header */}
      <div className="flex items-center justify-between p-5 pb-3">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold text-xs">
            {index + 1}
          </div>
          <h4 className="font-semibold text-foreground text-base">{section.title}</h4>
        </div>
        <StatusBadge status={section.status} />
      </div>

      {/* Summary */}
      <div className="px-5 pb-4">
        <p className="text-sm text-muted-foreground leading-relaxed">
          {section.summary}
        </p>
      </div>

      {/* Content Grid */}
      <div className="px-5 pb-5 space-y-4">
        {/* Key Findings */}
        {section.insights.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Lightbulb className="w-3.5 h-3.5 text-primary" />
              <h5 className="text-xs font-semibold text-foreground uppercase tracking-wider">Key Findings</h5>
            </div>
            <ul className="space-y-1.5">
              {section.insights.map((insight, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                  <span className="text-primary mt-1.5 shrink-0">•</span>
                  <span>{insight}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Gaps & Risks */}
        {section.gaps.length > 0 && (
          <div className="p-3 rounded-lg bg-[hsl(var(--status-risk-bg))]/50 border border-[hsl(var(--status-risk))]/10">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="w-3.5 h-3.5 text-[hsl(var(--status-risk))]" />
              <h5 className="text-xs font-semibold text-[hsl(var(--status-risk))] uppercase tracking-wider">Gaps & Risks</h5>
            </div>
            <ul className="space-y-1">
              {section.gaps.map((gap, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                  <span className="text-[hsl(var(--status-risk))] mt-1.5 shrink-0">—</span>
                  <span>{gap}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Action Steps */}
        {section.recommendations.length > 0 && (
          <div className="p-3 rounded-lg bg-[hsl(var(--status-pass-bg))]/50 border border-[hsl(var(--status-pass))]/10">
            <div className="flex items-center gap-2 mb-2">
              <Target className="w-3.5 h-3.5 text-[hsl(var(--status-pass))]" />
              <h5 className="text-xs font-semibold text-[hsl(var(--status-pass))] uppercase tracking-wider">Recommended Action Steps</h5>
            </div>
            <ol className="space-y-1.5">
              {section.recommendations.map((rec, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                  <span className="text-[hsl(var(--status-pass))] font-semibold text-xs mt-0.5 shrink-0 w-4">{i + 1}.</span>
                  <span>{rec}</span>
                </li>
              ))}
            </ol>
          </div>
        )}

        {/* Evidence Row */}
        <div className="grid grid-cols-2 gap-3 pt-1">
          {section.assumptions.length > 0 && (
            <div className="p-3 bg-muted/50 rounded-lg">
              <h5 className="text-[10px] font-semibold text-[hsl(var(--status-unclear))] uppercase tracking-wider mb-1.5">
                Unvalidated Assumptions
              </h5>
              <ul className="space-y-1">
                {section.assumptions.map((a, i) => (
                  <li key={i} className="text-xs text-muted-foreground">• {a}</li>
                ))}
              </ul>
            </div>
          )}
          {section.validatedSignals.length > 0 && (
            <div className="p-3 bg-muted/50 rounded-lg">
              <h5 className="text-[10px] font-semibold text-[hsl(var(--status-pass))] uppercase tracking-wider mb-1.5">
                Validated Evidence
              </h5>
              <ul className="space-y-1">
                {section.validatedSignals.map((s, i) => (
                  <li key={i} className="text-xs text-muted-foreground">✓ {s}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
