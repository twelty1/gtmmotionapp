import { ScatterChart, Scatter, XAxis, YAxis, ResponsiveContainer, Tooltip, ReferenceLine, Cell } from 'recharts';
import type { PositioningData } from '@/types/diligence';

interface PositioningMapProps {
  data: PositioningData[];
}

export function PositioningMap({ data }: PositioningMapProps) {
  return (
    <div className="bg-card border border-border rounded-lg p-4">
      <h3 className="font-semibold text-foreground mb-4">Competitive Positioning Map</h3>
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
            <XAxis
              type="number"
              dataKey="innovation"
              domain={[0, 100]}
              name="Innovation"
              tick={{ fill: 'hsl(220, 9%, 60%)', fontSize: 12 }}
              axisLine={{ stroke: 'hsl(222, 47%, 18%)' }}
              tickLine={{ stroke: 'hsl(222, 47%, 18%)' }}
              label={{
                value: 'Innovation Level',
                position: 'bottom',
                fill: 'hsl(220, 9%, 60%)',
                fontSize: 11,
              }}
            />
            <YAxis
              type="number"
              dataKey="marketFit"
              domain={[0, 100]}
              name="Market Fit"
              tick={{ fill: 'hsl(220, 9%, 60%)', fontSize: 12 }}
              axisLine={{ stroke: 'hsl(222, 47%, 18%)' }}
              tickLine={{ stroke: 'hsl(222, 47%, 18%)' }}
              label={{
                value: 'Market Fit',
                angle: -90,
                position: 'left',
                fill: 'hsl(220, 9%, 60%)',
                fontSize: 11,
              }}
            />
            <ReferenceLine
              x={50}
              stroke="hsl(222, 47%, 25%)"
              strokeDasharray="3 3"
            />
            <ReferenceLine
              y={50}
              stroke="hsl(222, 47%, 25%)"
              strokeDasharray="3 3"
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(222, 47%, 9%)',
                border: '1px solid hsl(222, 47%, 18%)',
                borderRadius: '8px',
                color: 'hsl(220, 14%, 96%)',
              }}
              formatter={(value: number, name: string) => [
                `${value}%`,
                name === 'innovation' ? 'Innovation' : 'Market Fit',
              ]}
              labelFormatter={(label) => data.find((d) => d.innovation === label)?.company || ''}
            />
            <Scatter data={data} name="Companies">
              {data.map((entry, index) => (
                <Cell
                  key={index}
                  fill={entry.isTarget ? 'hsl(38, 92%, 50%)' : 'hsl(222, 47%, 45%)'}
                  stroke={entry.isTarget ? 'hsl(38, 92%, 60%)' : 'hsl(222, 47%, 55%)'}
                  strokeWidth={2}
                  r={entry.isTarget ? 10 : 6}
                />
              ))}
            </Scatter>
          </ScatterChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-4 flex items-center justify-center gap-6">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-primary" />
          <span className="text-sm text-muted-foreground">Target Company</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-chart-2" />
          <span className="text-sm text-muted-foreground">Competitors</span>
        </div>
      </div>
      <div className="mt-2 grid grid-cols-2 gap-4 text-xs text-muted-foreground">
        <div className="text-center p-2 bg-muted/30 rounded">
          <span className="font-medium">Top Right:</span> Innovators with PMF
        </div>
        <div className="text-center p-2 bg-muted/30 rounded">
          <span className="font-medium">Top Left:</span> Incumbents
        </div>
        <div className="text-center p-2 bg-muted/30 rounded">
          <span className="font-medium">Bottom Right:</span> Disruptors seeking PMF
        </div>
        <div className="text-center p-2 bg-muted/30 rounded">
          <span className="font-medium">Bottom Left:</span> Early stage
        </div>
      </div>
    </div>
  );
}
