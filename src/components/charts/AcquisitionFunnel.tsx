import { useRef, useCallback } from 'react';
import { Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { FunnelStage } from '@/types/diligence';

interface AcquisitionFunnelProps {
  data: FunnelStage[];
  businessModel: 'B2B' | 'B2C';
}

const STAGE_COLORS = [
  'hsl(38, 92%, 50%)',
  'hsl(32, 85%, 45%)',
  'hsl(222, 47%, 45%)',
  'hsl(220, 50%, 40%)',
  'hsl(142, 70%, 40%)',
  'hsl(142, 76%, 36%)',
];

export function AcquisitionFunnel({ data, businessModel }: AcquisitionFunnelProps) {
  const funnelRef = useRef<HTMLDivElement>(null);

  const handleExport = useCallback(async () => {
    if (!funnelRef.current) return;

    // Dynamic import for html2canvas
    const { default: html2canvas } = await import('html2canvas');
    const canvas = await html2canvas(funnelRef.current, {
      backgroundColor: 'hsl(222, 47%, 9%)',
      scale: 2,
    });

    const link = document.createElement('a');
    link.download = `acquisition-funnel-${businessModel.toLowerCase()}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  }, [businessModel]);

  const maxValue = data[0]?.value || 1;

  return (
    <div className="bg-card border border-border rounded-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-semibold text-foreground">
            Customer Acquisition Funnel
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            {businessModel === 'B2B' ? 'Sales-Led' : 'Digitally-Led'} Motion
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={handleExport} className="gap-2">
          <Download className="w-3.5 h-3.5" />
          Export PNG
        </Button>
      </div>

      <div ref={funnelRef} className="py-4 px-2">
        <div className="space-y-1.5">
          {data.map((stage, index) => {
            const widthPct = Math.max(
              20,
              (stage.value / maxValue) * 100
            );
            const conversionRate =
              index > 0
                ? ((stage.value / data[index - 1].value) * 100).toFixed(1)
                : null;

            return (
              <div key={stage.name} className="relative group">
                {/* Conversion rate connector */}
                {conversionRate && (
                  <div className="flex items-center justify-end mb-0.5 pr-2">
                    <span className="text-[10px] text-muted-foreground font-mono">
                      ↓ {conversionRate}% conversion
                    </span>
                  </div>
                )}

                <div className="flex items-center gap-3">
                  {/* Funnel bar */}
                  <div className="flex-1 flex justify-center">
                    <div
                      className="h-12 rounded-md flex items-center justify-between px-4 transition-all duration-500 ease-out"
                      style={{
                        width: `${widthPct}%`,
                        backgroundColor: STAGE_COLORS[index % STAGE_COLORS.length],
                        opacity: 0.9,
                      }}
                    >
                      <span className="text-xs font-semibold text-primary-foreground truncate">
                        {stage.name}
                      </span>
                      <span className="text-xs font-mono font-bold text-primary-foreground ml-2">
                        {stage.value.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  {/* Percentage label */}
                  <span className="text-xs font-mono text-muted-foreground w-12 text-right flex-shrink-0">
                    {stage.percentage}%
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Summary metrics */}
        <div className="mt-6 pt-4 border-t border-border grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-xs text-muted-foreground">Top of Funnel</p>
            <p className="text-lg font-semibold text-foreground font-mono">
              {data[0]?.value.toLocaleString()}
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Overall Conversion</p>
            <p className="text-lg font-semibold text-primary font-mono">
              {data.length > 1
                ? ((data[data.length - 1].value / data[0].value) * 100).toFixed(2)
                : '0'}
              %
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Customers</p>
            <p className="text-lg font-semibold text-foreground font-mono">
              {data[data.length - 1]?.value.toLocaleString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
