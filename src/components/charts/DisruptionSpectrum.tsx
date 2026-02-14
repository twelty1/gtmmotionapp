import { cn } from '@/lib/utils';

interface DisruptionSpectrumProps {
  score: number;
}

const ZONES = [
  { label: 'Incremental', range: '0-25', color: 'hsl(222, 47%, 45%)', desc: 'Improving existing solutions' },
  { label: 'Evolutionary', range: '26-50', color: 'hsl(200, 60%, 45%)', desc: 'Meaningful category improvements' },
  { label: 'Transformative', range: '51-75', color: 'hsl(38, 92%, 50%)', desc: 'Redefining how problems are solved' },
  { label: 'Disruptive', range: '76-100', color: 'hsl(0, 72%, 55%)', desc: 'Category-creating innovation' },
];

export function DisruptionSpectrum({ score }: DisruptionSpectrumProps) {
  const activeZone = Math.min(Math.floor(score / 25), 3);
  const zone = ZONES[activeZone];

  return (
    <div className="bg-card border border-border rounded-lg p-5">
      <h3 className="text-lg font-bold text-foreground mb-1">
        Disruption Spectrum
      </h3>
      <p className="text-xs text-muted-foreground mb-5">Where does this company sit?</p>

      {/* Track with gradient */}
      <div className="relative mb-2">
        <div className="h-4 rounded-full overflow-hidden flex">
          {ZONES.map((z, i) => (
            <div
              key={i}
              className="flex-1 transition-opacity duration-300"
              style={{
                backgroundColor: z.color,
                opacity: i === activeZone ? 1 : 0.25,
              }}
            />
          ))}
        </div>

        {/* Marker */}
        <div
          className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 transition-all duration-700 ease-out"
          style={{ left: `${score}%` }}
        >
          <div className="w-7 h-7 rounded-full bg-foreground border-[3px] border-background shadow-lg flex items-center justify-center">
            <span className="text-[8px] font-bold text-background">{score}</span>
          </div>
        </div>
      </div>

      {/* Zone labels */}
      <div className="flex mb-6">
        {ZONES.map((z, i) => (
          <div key={i} className="flex-1 text-center">
            <span className={cn(
              'text-[10px] font-medium',
              i === activeZone ? 'text-foreground' : 'text-muted-foreground/50'
            )}>
              {z.label}
            </span>
          </div>
        ))}
      </div>

      {/* Active zone detail */}
      <div
        className="p-4 rounded-lg border"
        style={{
          backgroundColor: `${zone.color}10`,
          borderColor: `${zone.color}30`,
        }}
      >
        <div className="flex items-center justify-between mb-1.5">
          <span className="font-bold text-foreground">{zone.label}</span>
          <span
            className="text-lg font-mono font-black"
            style={{ color: zone.color }}
          >
            {score}/100
          </span>
        </div>
        <p className="text-sm text-muted-foreground">{zone.desc}</p>
      </div>
    </div>
  );
}
