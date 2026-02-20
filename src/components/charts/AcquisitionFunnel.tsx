import { useRef, useCallback } from 'react';
import { Download, ArrowDown, Megaphone, Users, MousePointerClick, UserCheck, CreditCard, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { FunnelStage } from '@/types/diligence';

interface AcquisitionFunnelProps {
  data: FunnelStage[];
  businessModel: 'B2B' | 'B2C' | 'Mixed';
}

const STAGE_ICONS = [Megaphone, Users, MousePointerClick, UserCheck, CreditCard, Heart];

const STAGE_GRADIENTS = [
  { from: 'hsl(38, 92%, 55%)', to: 'hsl(38, 92%, 45%)' },
  { from: 'hsl(32, 85%, 50%)', to: 'hsl(32, 85%, 40%)' },
  { from: 'hsl(25, 80%, 48%)', to: 'hsl(25, 80%, 38%)' },
  { from: 'hsl(222, 47%, 50%)', to: 'hsl(222, 47%, 40%)' },
  { from: 'hsl(200, 60%, 45%)', to: 'hsl(200, 60%, 35%)' },
  { from: 'hsl(142, 70%, 45%)', to: 'hsl(142, 70%, 35%)' },
];

export function AcquisitionFunnel({ data, businessModel }: AcquisitionFunnelProps) {
  const funnelRef = useRef<HTMLDivElement>(null);

  const handleExport = useCallback(async () => {
    if (!funnelRef.current) return;
    const { default: html2canvas } = await import('html2canvas');
    const canvas = await html2canvas(funnelRef.current, {
      backgroundColor: 'hsl(222, 47%, 9%)',
      scale: 2,
    });
    const link = document.createElement('a');
    link.download = `gtm-funnel-${businessModel.toLowerCase()}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  }, [businessModel]);

  const maxValue = data[0]?.value || 1;

  return (
    <div className="bg-card border border-border rounded-xl p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h3 className="text-xl font-bold text-foreground tracking-tight">
            GTM Acquisition Gameplan
          </h3>
          <p className="text-sm text-muted-foreground mt-1">
            {businessModel === 'B2B' ? 'Sales-Led' : 'Product-Led'} Funnel Strategy
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={handleExport} className="gap-2">
          <Download className="w-3.5 h-3.5" />
          Export
        </Button>
      </div>

      <div ref={funnelRef} className="py-6 px-2">
        <div className="space-y-0">
          {data.map((stage, index) => {
            const widthPct = Math.max(38, (stage.value / maxValue) * 100);
            const conversionRate =
              index > 0
                ? ((stage.value / data[index - 1].value) * 100).toFixed(0)
                : null;
            const Icon = STAGE_ICONS[index % STAGE_ICONS.length];
            const gradient = STAGE_GRADIENTS[index % STAGE_GRADIENTS.length];

            return (
              <div key={stage.name}>
                {/* Conversion connector */}
                {conversionRate && (
                  <div className="flex justify-center py-2">
                    <div className="flex flex-col items-center gap-0.5">
                      <div className="w-px h-3 bg-border" />
                      <div className="flex items-center gap-1.5 px-4 py-1 rounded-full bg-muted/50 border border-border/50">
                        <ArrowDown className="w-3 h-3 text-muted-foreground" />
                        <span className="text-xs font-mono font-semibold text-muted-foreground">
                          {conversionRate}% convert
                        </span>
                      </div>
                      <div className="w-px h-3 bg-border" />
                    </div>
                  </div>
                )}

                {/* Funnel stage */}
                <div className="flex justify-center">
                  <div
                    className="rounded-xl px-6 py-5 transition-all duration-500 ease-out relative overflow-hidden"
                    style={{
                      width: `${widthPct}%`,
                      background: `linear-gradient(135deg, ${gradient.from}, ${gradient.to})`,
                      boxShadow: `0 4px 20px -4px ${gradient.from}40`,
                    }}
                  >
                    {/* Shine overlay */}
                    <div
                      className="absolute inset-0"
                      style={{
                        background: 'linear-gradient(180deg, rgba(255,255,255,0.12) 0%, transparent 40%)',
                      }}
                    />
                    {/* Left accent bar */}
                    <div className="absolute left-0 top-3 bottom-3 w-1 rounded-r-full bg-white/25" />

                    <div className="relative flex items-start gap-4 pl-2">
                      <div className="w-10 h-10 rounded-lg bg-white/15 backdrop-blur-sm flex items-center justify-center flex-shrink-0 mt-0.5 border border-white/10">
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-3 mb-1.5">
                          <span className="text-base font-bold text-white">
                            {stage.name}
                          </span>
                          <span className="text-sm font-mono font-bold text-white/70 flex-shrink-0 bg-white/10 px-2 py-0.5 rounded">
                            {stage.percentage}%
                          </span>
                        </div>
                        <p className="text-sm text-white/80 leading-relaxed">
                          {stage.tactic}
                        </p>
                        {stage.channels && stage.channels.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 mt-2.5">
                            {stage.channels.map((ch) => (
                              <span
                                key={ch}
                                className="text-xs font-medium px-2.5 py-1 rounded-md bg-white/15 text-white/90 border border-white/10"
                              >
                                {ch}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Summary metrics */}
        <div className="mt-10 pt-6 border-t border-border grid grid-cols-3 gap-6 text-center">
          <div>
            <p className="text-xs uppercase tracking-wider text-muted-foreground mb-1.5">Top of Funnel</p>
            <p className="text-2xl font-bold text-foreground font-mono">
              {data[0]?.value.toLocaleString()}
            </p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wider text-muted-foreground mb-1.5">End-to-End</p>
            <p className="text-2xl font-bold text-primary font-mono">
              {data.length > 1
                ? ((data[data.length - 1].value / data[0].value) * 100).toFixed(1)
                : '0'}
              %
            </p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wider text-muted-foreground mb-1.5">Customers</p>
            <p className="text-2xl font-bold text-foreground font-mono">
              {data[data.length - 1]?.value.toLocaleString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
