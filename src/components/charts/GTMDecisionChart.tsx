import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, Cell, ReferenceLine } from 'recharts';
import type { GTMDecision } from '@/types/diligence';

interface GTMDecisionChartProps {
  data: GTMDecision[];
}

function CustomTooltip({ active, payload }: { active?: boolean; payload?: Array<{ payload: { factor: string; netScore: number; pushScore: number; pullScore: number } }> }) {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div className="bg-background border border-border rounded-lg p-3 shadow-xl text-xs">
      <p className="font-bold text-foreground mb-1">{d.factor}</p>
      <div className="space-y-0.5 text-muted-foreground">
        <p>Push (Outbound): <span className="font-mono text-primary">{d.pushScore}</span></p>
        <p>Pull (Inbound): <span className="font-mono text-[hsl(142,70%,45%)]">{d.pullScore}</span></p>
      </div>
      <p className="mt-1 text-foreground font-semibold">
        {d.netScore >= 0 ? '→ Pull-dominant' : '→ Push-dominant'}
      </p>
    </div>
  );
}

export function GTMDecisionChart({ data }: GTMDecisionChartProps) {
  const chartData = data.map((item) => ({
    ...item,
    netScore: item.pullScore - item.pushScore,
  }));

  return (
    <div className="bg-card border border-border rounded-lg p-5">
      <h3 className="text-lg font-bold text-foreground mb-1">Push vs Pull GTM</h3>
      <p className="text-xs text-muted-foreground mb-4">
        Positive = inbound/pull motion • Negative = outbound/push motion
      </p>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            layout="vertical"
            margin={{ top: 5, right: 25, left: 85, bottom: 5 }}
          >
            <XAxis
              type="number"
              domain={[-100, 100]}
              tick={{ fill: 'hsl(220, 9%, 50%)', fontSize: 10 }}
              axisLine={{ stroke: 'hsl(222, 47%, 18%)' }}
              tickLine={false}
              ticks={[-100, -50, 0, 50, 100]}
            />
            <YAxis
              type="category"
              dataKey="factor"
              tick={{ fill: 'hsl(220, 14%, 80%)', fontSize: 11, fontWeight: 500 }}
              axisLine={false}
              tickLine={false}
              width={80}
            />
            <Tooltip content={<CustomTooltip />} cursor={false} />
            <ReferenceLine x={0} stroke="hsl(222, 47%, 30%)" strokeWidth={1} />
            <Bar dataKey="netScore" radius={[4, 4, 4, 4]} barSize={20}>
              {chartData.map((entry, index) => (
                <Cell
                  key={index}
                  fill={entry.netScore >= 0 ? 'hsl(142, 70%, 45%)' : 'hsl(38, 92%, 50%)'}
                  opacity={0.85}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-4 flex items-center justify-center gap-8 text-xs">
        <div className="flex items-center gap-2">
          <div className="w-4 h-2.5 rounded" style={{ backgroundColor: 'hsl(38, 92%, 50%)' }} />
          <span className="text-muted-foreground">Push (Outbound/Sales-Led)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-2.5 rounded" style={{ backgroundColor: 'hsl(142, 70%, 45%)' }} />
          <span className="text-muted-foreground">Pull (Inbound/Product-Led)</span>
        </div>
      </div>
    </div>
  );
}
