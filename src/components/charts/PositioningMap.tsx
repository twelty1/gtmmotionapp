import { ScatterChart, Scatter, XAxis, YAxis, ResponsiveContainer, Tooltip, ReferenceLine, ReferenceArea, Label } from 'recharts';
import type { PositioningData } from '@/types/diligence';

interface PositioningMapProps {
  data: PositioningData[];
}

function CustomTooltip({ active, payload }: { active?: boolean; payload?: Array<{ payload: PositioningData }> }) {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div className="bg-background border border-border rounded-lg p-3 shadow-xl max-w-xs">
      <p className="text-sm font-bold text-foreground">{d.company}</p>
      {d.category && <p className="text-[11px] uppercase tracking-wide text-primary mt-0.5">{d.category}</p>}
      <div className="mt-1 space-y-0.5 text-xs text-muted-foreground">
        <p>Innovation: <span className="font-mono text-foreground">{d.innovation}</span></p>
        <p>Market Fit: <span className="font-mono text-foreground">{d.marketFit}</span></p>
      </div>
      {d.rationale && <p className="mt-2 text-xs text-muted-foreground leading-relaxed">{d.rationale}</p>}
    </div>
  );
}

function renderDot(props: unknown) {
  const { cx, cy, payload } = props as { cx: number; cy: number; payload: PositioningData };
  const isTarget = payload.isTarget;
  const r = isTarget ? 11 : 6;
  const label = payload.company.length > 16 ? payload.company.slice(0, 16) + '…' : payload.company;
  return (
    <g key={payload.company} style={{ pointerEvents: 'none' }}>
      {isTarget && <circle cx={cx} cy={cy} r={r + 6} fill="hsl(var(--primary))" opacity={0.18} />}
      <circle
        cx={cx}
        cy={cy}
        r={r}
        fill={isTarget ? 'hsl(var(--primary))' : 'hsl(var(--muted-foreground))'}
        stroke="hsl(var(--background))"
        strokeWidth={2}
      />
      <text
        x={cx}
        y={cy - r - 7}
        textAnchor="middle"
        fill={isTarget ? 'hsl(var(--primary))' : 'hsl(var(--foreground))'}
        fontSize={11}
        fontWeight={isTarget ? 700 : 500}
      >
        {label}
      </text>
    </g>
  );
}

export function PositioningMap({ data }: PositioningMapProps) {
  const target = data.find((d) => d.isTarget);
  const competitors = data.filter((d) => !d.isTarget);

  return (
    <div className="bg-card border border-border rounded-lg p-5">
      <h3 className="text-lg font-bold text-foreground mb-1">Competitive Positioning</h3>
      <p className="text-xs text-muted-foreground mb-4">
        Innovation vs. Product-Market Fit — {target ? `${target.company} mapped against ${competitors.length} named competitors` : 'market landscape'}
      </p>
      <div className="h-[26rem]">
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart margin={{ top: 30, right: 30, bottom: 35, left: 30 }}>
            <ReferenceArea x1={50} x2={100} y1={50} y2={100} fill="hsl(var(--primary))" fillOpacity={0.04} />
            <XAxis
              type="number"
              dataKey="innovation"
              domain={[0, 100]}
              tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }}
              axisLine={{ stroke: 'hsl(var(--border))' }}
              tickLine={false}
            >
              <Label value="Innovation →" position="bottom" offset={12} fill="hsl(var(--muted-foreground))" fontSize={11} />
            </XAxis>
            <YAxis
              type="number"
              dataKey="marketFit"
              domain={[0, 100]}
              tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }}
              axisLine={{ stroke: 'hsl(var(--border))' }}
              tickLine={false}
            >
              <Label value="Market Fit →" angle={-90} position="left" offset={8} fill="hsl(var(--muted-foreground))" fontSize={11} />
            </YAxis>
            <ReferenceLine x={50} stroke="hsl(var(--border))" strokeDasharray="4 4" />
            <ReferenceLine y={50} stroke="hsl(var(--border))" strokeDasharray="4 4" />
            <Tooltip content={<CustomTooltip />} cursor={{ strokeDasharray: '3 3' }} />
            <Scatter data={data} shape={renderDot} isAnimationActive={false} />
          </ScatterChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2">
        {[
          { label: 'Leaders', desc: 'High innovation + PMF' },
          { label: 'Incumbents', desc: 'Strong PMF, low innovation' },
          { label: 'Disruptors', desc: 'Innovative, seeking PMF' },
          { label: 'Early Stage', desc: 'Building both' },
        ].map((q) => (
          <div key={q.label} className="flex items-center gap-2 text-xs text-muted-foreground px-2 py-1.5 rounded bg-muted/20">
            <span className="font-semibold text-foreground/70">{q.label}</span>
            <span className="text-muted-foreground/60">— {q.desc}</span>
          </div>
        ))}
      </div>

      <div className="mt-5 space-y-2">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Landscape Breakdown</p>
        {[...(target ? [target] : []), ...competitors].map((c) => (
          <div
            key={c.company}
            className={`rounded-md border p-3 ${c.isTarget ? 'border-primary/50 bg-primary/5' : 'border-border bg-muted/10'}`}
          >
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className={`w-2.5 h-2.5 rounded-full ${c.isTarget ? 'bg-primary' : 'bg-muted-foreground'}`} />
                <span className="text-sm font-semibold text-foreground">{c.company}</span>
                {c.isTarget && <span className="text-[10px] uppercase tracking-wide text-primary">Target</span>}
              </div>
              <span className="text-[11px] font-mono text-muted-foreground">
                {c.category ? `${c.category} · ` : ''}I {c.innovation} / PMF {c.marketFit}
              </span>
            </div>
            {c.rationale && <p className="mt-1.5 text-xs text-muted-foreground leading-relaxed">{c.rationale}</p>}
          </div>
        ))}
      </div>
    </div>
  );
}
