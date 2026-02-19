import { AlertTriangle, Zap, DollarSign, TrendingUp } from 'lucide-react';
import type { RiskyGTMStrategy } from '@/types/diligence';

interface RiskyStrategiesProps {
  strategies: RiskyGTMStrategy[];
}

const riskColors = {
  'high': 'border-[hsl(var(--status-unclear))]/30 bg-[hsl(var(--status-unclear))]/5',
  'very-high': 'border-[hsl(var(--status-risk))]/30 bg-[hsl(var(--status-risk))]/5',
  'extreme': 'border-[hsl(var(--status-risk))]/50 bg-[hsl(var(--status-risk))]/10',
};

const riskBadge = {
  'high': 'bg-[hsl(var(--status-unclear))]/15 text-[hsl(var(--status-unclear))]',
  'very-high': 'bg-[hsl(var(--status-risk))]/15 text-[hsl(var(--status-risk))]',
  'extreme': 'bg-[hsl(var(--status-risk))]/25 text-[hsl(var(--status-risk))]',
};

export function RiskyStrategies({ strategies }: RiskyStrategiesProps) {
  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden">
      <div className="p-5 pb-3 border-b border-border">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-8 h-8 rounded-full bg-[hsl(var(--status-risk))]/10 flex items-center justify-center">
            <Zap className="w-4 h-4 text-[hsl(var(--status-risk))]" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-foreground">Additional GTM Strategy Plans (Risk)</h3>
            <p className="text-xs text-muted-foreground">Unconventional, high-risk approaches — not part of the core GTM strategy</p>
          </div>
        </div>
      </div>

      <div className="p-5 grid gap-4 sm:grid-cols-2">
        {strategies.map((strategy, i) => (
          <div
            key={i}
            className={`rounded-lg border p-4 ${riskColors[strategy.riskLevel]} animate-fade-in`}
            style={{ animationDelay: `${i * 80}ms` }}
          >
            <div className="flex items-start justify-between gap-2 mb-2">
              <h4 className="font-semibold text-foreground text-sm">{strategy.title}</h4>
              <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full shrink-0 ${riskBadge[strategy.riskLevel]}`}>
                {strategy.riskLevel.replace('-', ' ')}
              </span>
            </div>
            <p className="text-xs text-muted-foreground mb-3 leading-relaxed">{strategy.description}</p>
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center gap-1.5 text-xs">
                <TrendingUp className="w-3 h-3 text-[hsl(var(--status-pass))]" />
                <span className="text-muted-foreground"><span className="font-medium text-foreground">Upside:</span> {strategy.potentialUpside}</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs">
                <DollarSign className="w-3 h-3 text-[hsl(var(--status-unclear))]" />
                <span className="text-muted-foreground"><span className="font-medium text-foreground">Est. Cost:</span> {strategy.estimatedCost}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
