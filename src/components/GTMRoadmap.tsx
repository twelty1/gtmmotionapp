import { Search, Crosshair, Rocket, CheckCircle2, BarChart3, ArrowDown } from 'lucide-react';
import type { RoadmapPhase } from '@/types/diligence';

interface GTMRoadmapProps {
  phases: RoadmapPhase[];
}

const phaseConfig = {
  'icp-discovery': {
    icon: Search,
    gradient: 'from-blue-500/20 to-blue-600/5',
    accent: 'text-blue-400',
    border: 'border-blue-500/30',
    bg: 'bg-blue-500/10',
    dot: 'bg-blue-500',
    label: 'Phase 1',
  },
  'pmf-validation': {
    icon: Crosshair,
    gradient: 'from-amber-500/20 to-amber-600/5',
    accent: 'text-amber-400',
    border: 'border-amber-500/30',
    bg: 'bg-amber-500/10',
    dot: 'bg-amber-500',
    label: 'Phase 2',
  },
  'gtm-scaling': {
    icon: Rocket,
    gradient: 'from-emerald-500/20 to-emerald-600/5',
    accent: 'text-emerald-400',
    border: 'border-emerald-500/30',
    bg: 'bg-emerald-500/10',
    dot: 'bg-emerald-500',
    label: 'Phase 3',
  },
} as const;

export function GTMRoadmap({ phases }: GTMRoadmapProps) {
  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden">
      <div className="p-6 pb-4 border-b border-border">
        <h3 className="text-lg font-bold text-foreground">GTM Execution Roadmap</h3>
        <p className="text-sm text-muted-foreground mt-1">
          From ICP discovery through product-market fit to scalable growth
        </p>
      </div>

      <div className="relative">
        {phases.map((phase, phaseIdx) => {
          const config = phaseConfig[phase.id];
          const Icon = config.icon;
          const isLast = phaseIdx === phases.length - 1;

          return (
            <div key={phase.id} className="relative">
              {/* Phase Header */}
              <div className={`p-6 bg-gradient-to-r ${config.gradient}`}>
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-xl ${config.bg} ${config.border} border flex items-center justify-center shrink-0`}>
                    <Icon className={`w-6 h-6 ${config.accent}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-[10px] font-bold uppercase tracking-widest ${config.accent}`}>
                        {config.label}
                      </span>
                      <span className="text-[10px] text-muted-foreground">•</span>
                      <span className="text-[10px] text-muted-foreground font-medium">
                        {phase.milestones[0]?.timeline}
                      </span>
                    </div>
                    <h4 className="text-base font-bold text-foreground">{phase.name}</h4>
                    <p className="text-sm text-muted-foreground mt-1 leading-relaxed">{phase.objective}</p>
                  </div>
                </div>
              </div>

              {/* Milestones */}
              <div className="px-6 py-4 space-y-4">
                {phase.milestones.map((milestone, mIdx) => (
                  <div key={mIdx} className="relative pl-8">
                    {/* Timeline dot & line */}
                    <div className="absolute left-0 top-0 bottom-0 flex flex-col items-center">
                      <div className={`w-3 h-3 rounded-full ${config.dot} shrink-0 mt-1.5`} />
                      {mIdx < phase.milestones.length - 1 && (
                        <div className={`w-px flex-1 ${config.bg} mt-1`} />
                      )}
                    </div>

                    <div className="pb-4">
                      <div className="flex items-center gap-2 mb-1">
                        <h5 className="text-sm font-semibold text-foreground">{milestone.title}</h5>
                        {milestone.timeline && (
                          <span className="text-[10px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
                            {milestone.timeline}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed mb-3">{milestone.description}</p>

                      {/* Tactics */}
                      <div className="grid md:grid-cols-2 gap-3">
                        <div className={`p-3 rounded-lg ${config.bg} border ${config.border}`}>
                          <h6 className={`text-[10px] font-bold uppercase tracking-wider ${config.accent} mb-2`}>
                            Key Actions
                          </h6>
                          <ul className="space-y-1">
                            {milestone.tactics.map((tactic, tIdx) => (
                              <li key={tIdx} className="flex items-start gap-1.5 text-xs text-foreground/80">
                                <CheckCircle2 className={`w-3 h-3 ${config.accent} shrink-0 mt-0.5`} />
                                <span>{tactic}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div className="p-3 rounded-lg bg-muted/50 border border-border">
                          <h6 className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-2">
                            Success Metrics
                          </h6>
                          <ul className="space-y-1">
                            {milestone.successMetrics.map((metric, mIdx) => (
                              <li key={mIdx} className="flex items-start gap-1.5 text-xs text-foreground/80">
                                <BarChart3 className="w-3 h-3 text-muted-foreground shrink-0 mt-0.5" />
                                <span>{metric}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Phase connector arrow */}
              {!isLast && (
                <div className="flex justify-center py-1 pb-0">
                  <div className="flex flex-col items-center text-muted-foreground/40">
                    <ArrowDown className="w-5 h-5" />
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
