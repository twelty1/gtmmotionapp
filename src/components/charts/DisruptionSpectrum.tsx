import { cn } from '@/lib/utils';

interface DisruptionSpectrumProps {
  score: number; // 0-100, where 0 = incremental, 100 = disruptive
}

export function DisruptionSpectrum({ score }: DisruptionSpectrumProps) {
  const getLabel = (score: number) => {
    if (score <= 25) return 'Incremental';
    if (score <= 50) return 'Evolutionary';
    if (score <= 75) return 'Transformative';
    return 'Disruptive';
  };

  const getDescription = (score: number) => {
    if (score <= 25)
      return 'Improving existing solutions with marginal gains. Low risk, but limited upside potential.';
    if (score <= 50)
      return 'Meaningful improvements to established categories. Moderate market risk with clear value proposition.';
    if (score <= 75)
      return 'Significant shift in how problems are solved. Higher risk with substantial market opportunity.';
    return 'Category-defining innovation. High execution risk but potential for outsized returns.';
  };

  return (
    <div className="bg-card border border-border rounded-lg p-4">
      <h3 className="font-semibold text-foreground mb-4">
        Incremental vs Disruptive Spectrum
      </h3>

      <div className="relative mb-6">
        {/* Track */}
        <div className="h-3 rounded-full bg-gradient-to-r from-chart-3 via-primary to-status-risk" />

        {/* Marker */}
        <div
          className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 transition-all duration-500"
          style={{ left: `${score}%` }}
        >
          <div className="w-6 h-6 rounded-full bg-foreground border-4 border-background shadow-lg" />
        </div>

        {/* Labels */}
        <div className="flex justify-between mt-3 text-xs text-muted-foreground">
          <span>Incremental</span>
          <span>Evolutionary</span>
          <span>Transformative</span>
          <span>Disruptive</span>
        </div>
      </div>

      <div className="p-4 bg-muted/50 rounded-lg">
        <div className="flex items-center justify-between mb-2">
          <span className="font-semibold text-foreground">{getLabel(score)}</span>
          <span className="text-lg font-mono font-bold text-primary">{score}%</span>
        </div>
        <p className="text-sm text-muted-foreground">{getDescription(score)}</p>
      </div>

      <div className="mt-4 grid grid-cols-4 gap-2 text-center">
        {[
          { label: '0-25%', desc: 'Low risk' },
          { label: '26-50%', desc: 'Med risk' },
          { label: '51-75%', desc: 'High risk' },
          { label: '76-100%', desc: 'Very high' },
        ].map((item, i) => (
          <div
            key={i}
            className={cn(
              'p-2 rounded text-xs',
              score > i * 25 && score <= (i + 1) * 25
                ? 'bg-primary/20 text-primary'
                : 'bg-muted/30 text-muted-foreground'
            )}
          >
            <div className="font-medium">{item.label}</div>
            <div>{item.desc}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
