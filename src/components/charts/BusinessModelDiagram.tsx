import { ArrowRight, DollarSign, Users, Package, Repeat, Zap } from 'lucide-react';

export interface BusinessModelFlow {
  stages: {
    label: string;
    description: string;
    type: 'source' | 'process' | 'revenue';
  }[];
  revenueStreams: {
    name: string;
    description: string;
    percentage?: number;
  }[];
  summary: string;
}

const stageIcons = {
  source: <Users className="w-5 h-5" />,
  process: <Package className="w-5 h-5" />,
  revenue: <DollarSign className="w-5 h-5" />,
};

const stageColors = {
  source: {
    bg: 'bg-[hsl(var(--chart-2))]/10',
    border: 'border-[hsl(var(--chart-2))]/30',
    icon: 'text-[hsl(var(--chart-2))]',
    accent: 'hsl(var(--chart-2))',
  },
  process: {
    bg: 'bg-primary/10',
    border: 'border-primary/30',
    icon: 'text-primary',
    accent: 'hsl(var(--primary))',
  },
  revenue: {
    bg: 'bg-[hsl(var(--status-pass))]/10',
    border: 'border-[hsl(var(--status-pass))]/30',
    icon: 'text-[hsl(var(--status-pass))]',
    accent: 'hsl(var(--status-pass))',
  },
};

interface Props {
  data: BusinessModelFlow;
}

export function BusinessModelDiagram({ data }: Props) {
  if (!data || !data.stages || data.stages.length === 0) return null;

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
          <Repeat className="w-4 h-4 text-primary" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-foreground">Business Model Flow</h3>
          <p className="text-xs text-muted-foreground">How value is created and captured</p>
        </div>
      </div>

      {/* Summary */}
      <p className="text-sm text-muted-foreground leading-relaxed mb-6 ml-11">
        {data.summary}
      </p>

      {/* Flow Diagram */}
      <div className="relative">
        {/* Stages flow */}
        <div className="flex items-stretch gap-0 overflow-x-auto pb-2">
          {data.stages.map((stage, i) => {
            const colors = stageColors[stage.type];
            return (
              <div key={i} className="flex items-center shrink-0">
                {/* Stage card */}
                <div className={`relative ${colors.bg} ${colors.border} border rounded-xl p-4 w-52 min-h-[120px] flex flex-col`}>
                  {/* Type label */}
                  <div className="flex items-center gap-2 mb-2">
                    <div className={`w-7 h-7 rounded-lg ${colors.bg} flex items-center justify-center ${colors.icon}`}>
                      {stageIcons[stage.type]}
                    </div>
                    <span className={`text-[10px] font-bold uppercase tracking-widest ${colors.icon}`}>
                      {stage.type}
                    </span>
                  </div>
                  {/* Label */}
                  <h4 className="text-sm font-semibold text-foreground mb-1 leading-tight">
                    {stage.label}
                  </h4>
                  {/* Description */}
                  <p className="text-xs text-muted-foreground leading-relaxed flex-1">
                    {stage.description}
                  </p>
                  {/* Glow accent */}
                  <div
                    className="absolute bottom-0 left-3 right-3 h-0.5 rounded-full opacity-50"
                    style={{ background: colors.accent }}
                  />
                </div>

                {/* Arrow connector */}
                {i < data.stages.length - 1 && (
                  <div className="flex items-center px-2 shrink-0">
                    <div className="w-6 h-px bg-border" />
                    <ArrowRight className="w-4 h-4 text-muted-foreground shrink-0" />
                    <div className="w-2 h-px bg-border" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Revenue Streams */}
      {data.revenueStreams.length > 0 && (
        <div className="mt-6 pt-5 border-t border-border">
          <div className="flex items-center gap-2 mb-4">
            <Zap className="w-4 h-4 text-[hsl(var(--status-pass))]" />
            <h4 className="text-sm font-bold text-foreground uppercase tracking-wider">Revenue Streams</h4>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {data.revenueStreams.map((stream, i) => (
              <div
                key={i}
                className="bg-[hsl(var(--status-pass))]/5 border border-[hsl(var(--status-pass))]/15 rounded-lg p-3"
              >
                <div className="flex items-center justify-between mb-1">
                  <h5 className="text-sm font-semibold text-foreground">{stream.name}</h5>
                  {stream.percentage != null && (
                    <span className="text-xs font-bold text-[hsl(var(--status-pass))]">
                      {stream.percentage}%
                    </span>
                  )}
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">{stream.description}</p>
                {stream.percentage != null && (
                  <div className="mt-2 h-1.5 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full bg-[hsl(var(--status-pass))]"
                      style={{ width: `${stream.percentage}%` }}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
