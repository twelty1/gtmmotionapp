import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, Legend, Cell, ReferenceLine } from 'recharts';
import type { GTMDecision } from '@/types/diligence';

interface GTMDecisionChartProps {
  data: GTMDecision[];
}

export function GTMDecisionChart({ data }: GTMDecisionChartProps) {
  const chartData = data.map((item) => ({
    ...item,
    netScore: item.pullScore - item.pushScore,
  }));

  return (
    <div className="bg-card border border-border rounded-lg p-4">
      <h3 className="font-semibold text-foreground mb-2">Push vs Pull GTM Decision</h3>
      <p className="text-xs text-muted-foreground mb-4">
        Positive values indicate pull motion, negative indicate push motion
      </p>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            layout="vertical"
            margin={{ top: 10, right: 30, left: 80, bottom: 10 }}
          >
            <XAxis
              type="number"
              domain={[-100, 100]}
              tick={{ fill: 'hsl(220, 9%, 60%)', fontSize: 11 }}
              axisLine={{ stroke: 'hsl(222, 47%, 18%)' }}
              tickLine={{ stroke: 'hsl(222, 47%, 18%)' }}
            />
            <YAxis
              type="category"
              dataKey="factor"
              tick={{ fill: 'hsl(220, 9%, 60%)', fontSize: 11 }}
              axisLine={{ stroke: 'hsl(222, 47%, 18%)' }}
              tickLine={{ stroke: 'hsl(222, 47%, 18%)' }}
              width={75}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(222, 47%, 9%)',
                border: '1px solid hsl(222, 47%, 18%)',
                borderRadius: '8px',
                color: 'hsl(220, 14%, 96%)',
              }}
              formatter={(value: number) => [
                `${Math.abs(value)}`,
                value >= 0 ? 'Pull Score' : 'Push Score',
              ]}
            />
            <ReferenceLine x={0} stroke="hsl(222, 47%, 30%)" />
            <Bar dataKey="netScore" radius={[0, 4, 4, 0]}>
              {chartData.map((entry, index) => (
                <Cell
                  key={index}
                  fill={
                    entry.netScore >= 0
                      ? 'hsl(142, 70%, 45%)'
                      : 'hsl(38, 92%, 50%)'
                  }
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-4 flex items-center justify-center gap-8">
        <div className="flex items-center gap-2">
          <div className="w-4 h-3 rounded bg-primary" />
          <span className="text-sm text-muted-foreground">Push (Outbound)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-3 rounded bg-status-pass" />
          <span className="text-sm text-muted-foreground">Pull (Inbound)</span>
        </div>
      </div>
    </div>
  );
}
