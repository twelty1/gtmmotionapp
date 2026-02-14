import { ScatterChart, Scatter, XAxis, YAxis, ResponsiveContainer, Tooltip, ReferenceLine, Cell, Label } from 'recharts';
import type { PositioningData } from '@/types/diligence';

interface PositioningMapProps {
  data: PositioningData[];
}

function CustomTooltip({ active, payload }: { active?: boolean; payload?: Array<{ payload: PositioningData }> }) {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div className="bg-background border border-border rounded-lg p-3 shadow-xl">
      <p className="text-sm font-bold text-foreground">{d.company}</p>
      <div className="mt-1 space-y-0.5 text-xs text-muted-foreground">
        <p>Innovation: <span className="font-mono text-foreground">{d.innovation}</span></p>
        <p>Market Fit: <span className="font-mono text-foreground">{d.marketFit}</span></p>
      </div>
    </div>
  );
}

function CustomDot(props: { cx: number; cy: number; payload: PositioningData }) {
  const { cx, cy, payload } = props;
  const isTarget = payload.isTarget;
  const r = isTarget ? 12 : 7;
  return (
    <g>
      {isTarget && (
        <circle cx={cx} cy={cy} r={r + 4} fill="hsl(38, 92%, 50%)" opacity={0.15} />
      )}
      <circle
        cx={cx}
        cy={cy}
        r={r}
        fill={isTarget ? 'hsl(38, 92%, 50%)' : 'hsl(222, 47%, 50%)'}
        stroke={isTarget ? 'hsl(38, 92%, 65%)' : 'hsl(222, 47%, 60%)'}
        strokeWidth={2}
      />
      <text
        x={cx}
        y={cy + r + 14}
        textAnchor="middle"
        fill="hsl(220, 14%, 70%)"
        fontSize={10}
        fontWeight={isTarget ? 700 : 400}
      >
        {payload.company.length > 12 ? payload.company.substring(0, 12) + '…' : payload.company}
      </text>
    </g>
  );
}

export function PositioningMap({ data }: PositioningMapProps) {
  return (
    <div className="bg-card border border-border rounded-lg p-5">
      <h3 className="text-lg font-bold text-foreground mb-1">Competitive Positioning</h3>
      <p className="text-xs text-muted-foreground mb-4">Innovation vs. Product-Market Fit</p>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart margin={{ top: 25, right: 25, bottom: 30, left: 25 }}>
            <XAxis
              type="number"
              dataKey="innovation"
              domain={[0, 100]}
              tick={{ fill: 'hsl(220, 9%, 50%)', fontSize: 10 }}
              axisLine={{ stroke: 'hsl(222, 47%, 18%)' }}
              tickLine={false}
            >
              <Label value="Innovation →" position="bottom" offset={10} fill="hsl(220, 9%, 50%)" fontSize={11} />
            </XAxis>
            <YAxis
              type="number"
              dataKey="marketFit"
              domain={[0, 100]}
              tick={{ fill: 'hsl(220, 9%, 50%)', fontSize: 10 }}
              axisLine={{ stroke: 'hsl(222, 47%, 18%)' }}
              tickLine={false}
            >
              <Label value="Market Fit →" angle={-90} position="left" offset={5} fill="hsl(220, 9%, 50%)" fontSize={11} />
            </YAxis>
            <ReferenceLine x={50} stroke="hsl(222, 47%, 22%)" strokeDasharray="4 4" />
            <ReferenceLine y={50} stroke="hsl(222, 47%, 22%)" strokeDasharray="4 4" />
            <Tooltip content={<CustomTooltip />} />
            <Scatter data={data} shape={<CustomDot cx={0} cy={0} payload={{ company: '', innovation: 0, marketFit: 0 }} />}>
              {data.map((entry, index) => (
                <Cell key={index} />
              ))}
            </Scatter>
          </ScatterChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-3 grid grid-cols-2 gap-2">
        {[
          { pos: 'Top Right', label: 'Leaders', desc: 'High innovation + PMF' },
          { pos: 'Top Left', label: 'Incumbents', desc: 'Strong PMF, low innovation' },
          { pos: 'Bottom Right', label: 'Disruptors', desc: 'Innovative, seeking PMF' },
          { pos: 'Bottom Left', label: 'Early Stage', desc: 'Building both' },
        ].map((q) => (
          <div key={q.pos} className="flex items-center gap-2 text-xs text-muted-foreground px-2 py-1.5 rounded bg-muted/20">
            <span className="font-semibold text-foreground/70">{q.label}</span>
            <span className="text-muted-foreground/60">— {q.desc}</span>
          </div>
        ))}
      </div>
      <div className="mt-3 flex items-center justify-center gap-6 text-xs">
        <div className="flex items-center gap-1.5">
          <div className="w-4 h-4 rounded-full" style={{ backgroundColor: 'hsl(38, 92%, 50%)' }} />
          <span className="text-muted-foreground">Target</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: 'hsl(222, 47%, 50%)' }} />
          <span className="text-muted-foreground">Competitors</span>
        </div>
      </div>
    </div>
  );
}
