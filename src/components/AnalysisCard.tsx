import { useState } from 'react';
import { cn } from '@/lib/utils';
import { ChevronDown, AlertTriangle, CheckCircle, Lightbulb, Target } from 'lucide-react';
import { StatusBadge } from './StatusBadge';
import type { AnalysisSection } from '@/types/diligence';

interface AnalysisCardProps {
  section: AnalysisSection;
  index: number;
}

export function AnalysisCard({ section, index }: AnalysisCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div
      className={cn(
        'bg-card border border-border rounded-lg overflow-hidden transition-all duration-300',
        'animate-fade-in'
      )}
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-4 hover:bg-muted/50 transition-colors"
      >
        <div className="flex items-center gap-4">
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold text-sm">
            {index + 1}
          </div>
          <div className="text-left">
            <h3 className="font-semibold text-foreground">{section.title}</h3>
            <p className="text-sm text-muted-foreground line-clamp-1 mt-0.5">
              {section.summary}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <StatusBadge status={section.status} />
          <ChevronDown
            className={cn(
              'w-5 h-5 text-muted-foreground transition-transform duration-200',
              isExpanded && 'rotate-180'
            )}
          />
        </div>
      </button>

      {isExpanded && (
        <div className="px-4 pb-4 space-y-4 border-t border-border pt-4">
          {/* Key Insights */}
          {section.insights.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                <Lightbulb className="w-4 h-4 text-primary" />
                Key Insights
              </div>
              <ul className="space-y-1.5 ml-6">
                {section.insights.map((insight, i) => (
                  <li
                    key={i}
                    className="text-sm text-muted-foreground list-disc"
                  >
                    {insight}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Gaps & Risks */}
          {section.gaps.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                <AlertTriangle className="w-4 h-4 text-status-risk" />
                Gaps, Risks & Unanswered Questions
              </div>
              <ul className="space-y-1.5 ml-6">
                {section.gaps.map((gap, i) => (
                  <li
                    key={i}
                    className="text-sm text-muted-foreground list-disc"
                  >
                    {gap}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Recommendations */}
          {section.recommendations.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                <Target className="w-4 h-4 text-status-pass" />
                Recommended GTM Motion
              </div>
              <ul className="space-y-1.5 ml-6">
                {section.recommendations.map((rec, i) => (
                  <li
                    key={i}
                    className="text-sm text-muted-foreground list-disc"
                  >
                    {rec}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Assumptions vs Validated */}
          <div className="grid grid-cols-2 gap-4 pt-2">
            <div className="p-3 bg-status-risk-bg/50 rounded-lg">
              <h4 className="text-xs font-medium text-status-risk mb-2">
                Assumptions (Unvalidated)
              </h4>
              <ul className="space-y-1">
                {section.assumptions.map((assumption, i) => (
                  <li
                    key={i}
                    className="text-xs text-muted-foreground"
                  >
                    • {assumption}
                  </li>
                ))}
              </ul>
            </div>
            <div className="p-3 bg-status-pass-bg/50 rounded-lg">
              <h4 className="text-xs font-medium text-status-pass mb-2">
                Validated Signals
              </h4>
              <ul className="space-y-1">
                {section.validatedSignals.map((signal, i) => (
                  <li
                    key={i}
                    className="text-xs text-muted-foreground"
                  >
                    • {signal}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
