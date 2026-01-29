import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import type { CustomerSegment } from '@/types/diligence';

interface SegmentationChartProps {
  data: CustomerSegment[];
}

const COLORS = ['hsl(38, 92%, 50%)', 'hsl(222, 47%, 35%)', 'hsl(220, 14%, 50%)', 'hsl(142, 70%, 45%)'];

const urgencyColors = {
  high: 'hsl(0, 72%, 55%)',
  medium: 'hsl(38, 92%, 50%)',
  low: 'hsl(142, 70%, 45%)',
};

export function SegmentationChart({ data }: SegmentationChartProps) {
  return (
    <div className="bg-card border border-border rounded-lg p-4">
      <h3 className="font-semibold text-foreground mb-4">Customer Segmentation</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="percentage"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={80}
              innerRadius={50}
              strokeWidth={2}
              stroke="hsl(222, 47%, 9%)"
            >
              {data.map((entry, index) => (
                <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(222, 47%, 9%)',
                border: '1px solid hsl(222, 47%, 18%)',
                borderRadius: '8px',
                color: 'hsl(220, 14%, 96%)',
              }}
              formatter={(value: number) => [`${value}%`, 'Share']}
            />
            <Legend
              verticalAlign="bottom"
              height={36}
              formatter={(value: string) => (
                <span className="text-sm text-muted-foreground">{value}</span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-4 space-y-2">
        {data.map((segment, index) => (
          <div key={segment.name} className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: COLORS[index % COLORS.length] }}
              />
              <span className="text-muted-foreground">{segment.name}</span>
            </div>
            <span
              className="text-xs px-2 py-0.5 rounded-full font-medium"
              style={{
                backgroundColor: `${urgencyColors[segment.urgency]}20`,
                color: urgencyColors[segment.urgency],
              }}
            >
              {segment.urgency} urgency
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
