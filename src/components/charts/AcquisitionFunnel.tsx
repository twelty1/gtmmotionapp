import { useRef, useCallback } from 'react';
import { Download, ArrowDown, Megaphone, Users, MousePointerClick, UserCheck, CreditCard, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { FunnelStage } from '@/types/diligence';

interface AcquisitionFunnelProps {
  data: FunnelStage[];
  businessModel: 'B2B' | 'B2C';
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
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-bold text-foreground">
            GTM Acquisition Gameplan
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            {businessModel === 'B2B' ? 'Sales-Led' : 'Product-Led'} Funnel Strategy
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={handleExport} className="gap-2">
          <Download className="w-3.5 h-3.5" />
          Export
        </Button>
      </div>

      <div ref={funnelRef} className="py-4">
        <div className="space-y-0">
          {data.map((stage, index) => {
            const widthPct = Math.max(30, (stage.value / maxValue) * 100);
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
                  <div className="flex justify-center py-1.5">
                    <div className="flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-muted/40">
                      <ArrowDown className="w-3 h-3 text-muted-foreground" />
                      <span className="text-[10px] font-mono font-semibold text-muted-foreground">
                        {conversionRate}% convert
                      </span>
                    </div>
                  </div>
                )}

                {/* Funnel stage */}
                <div className="flex justify-center">
                  <div
                    className="rounded-lg px-5 py-3.5 transition-all duration-500 ease-out relative overflow-hidden"
                    style={{
                      width: `${widthPct}%`,
                      background: `linear-gradient(135deg, ${gradient.from}, ${gradient.to})`,
                    }}
                  >
                    {/* Subtle shine overlay */}
                    <div
                      className="absolute inset-0 opacity-10"
                      style={{
                        background: 'linear-gradient(180deg, rgba(255,255,255,0.3) 0%, transparent 50%)',
                      }}
                    />

                    <div className="relative flex items-start gap-3">
                      <div className="w-8 h-8 rounded-md bg-white/15 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Icon className="w-4 h-4 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <span className="text-sm font-bold text-white truncate">
                            {stage.name}
                          </span>
                          <span className="text-xs font-mono font-bold text-white/80 flex-shrink-0">
                            {stage.percentage}%
                          </span>
                        </div>
                        <p className="text-[11px] text-white/75 leading-snug">
                          {stage.tactic}
                        </p>
                        {stage.channels && stage.channels.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-1.5">
                            {stage.channels.slice(0, 3).map((ch) => (
                              <span
                                key={ch}
                                className="text-[9px] font-medium px-1.5 py-0.5 rounded bg-white/15 text-white/90"
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
        <div className="mt-8 pt-5 border-t border-border grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">Top of Funnel</p>
            <p className="text-xl font-bold text-foreground font-mono">
              {data[0]?.value.toLocaleString()}
            </p>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">End-to-End</p>
            <p className="text-xl font-bold text-primary font-mono">
              {data.length > 1
                ? ((data[data.length - 1].value / data[0].value) * 100).toFixed(1)
                : '0'}
              %
            </p>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">Customers</p>
            <p className="text-xl font-bold text-foreground font-mono">
              {data[data.length - 1]?.value.toLocaleString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
