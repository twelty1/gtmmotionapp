import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import type { CustomerSegment } from '@/types/diligence';

interface SegmentationChartProps {
  data: CustomerSegment[];
}

const COLORS = [
  'hsl(38, 92%, 50%)',
  'hsl(222, 47%, 45%)',
  'hsl(200, 60%, 45%)',
  'hsl(142, 70%, 45%)',
  'hsl(280, 60%, 50%)',
];

const urgencyColors = {
  high: 'hsl(0, 72%, 55%)',
  medium: 'hsl(38, 92%, 50%)',
  low: 'hsl(142, 70%, 45%)',
};

const RADIAN = Math.PI / 180;

function renderCustomLabel({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
}: {
  cx: number;
  cy: number;
  midAngle: number;
  innerRadius: number;
  outerRadius: number;
  percent: number;
}) {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  if (percent < 0.08) return null;

  return (
    <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" fontSize={12} fontWeight={700}>
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
}

export function SegmentationChart({ data }: SegmentationChartProps) {
  return (
    <div className="bg-card border border-border rounded-lg p-5">
      <h3 className="text-lg font-bold text-foreground mb-1">Customer Segmentation</h3>
      <p className="text-xs text-muted-foreground mb-4">ICP breakdown by market share</p>
      <div className="h-56">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="percentage"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={90}
              innerRadius={55}
              strokeWidth={3}
              stroke="hsl(222, 47%, 11%)"
              labelLine={false}
              label={renderCustomLabel}
            >
              {data.map((_, index) => (
                <Cell key={index} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(222, 47%, 11%)',
                border: '1px solid hsl(222, 47%, 20%)',
                borderRadius: '8px',
                color: 'hsl(220, 14%, 96%)',
                fontSize: 12,
              }}
              formatter={(value: number) => [`${value}%`, 'Share']}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="space-y-2.5 mt-2">
        {data.map((segment, index) => (
          <div key={segment.name} className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div
                className="w-3 h-3 rounded-sm"
                style={{ backgroundColor: COLORS[index % COLORS.length] }}
              />
              <span className="text-sm text-foreground font-medium">{segment.name}</span>
            </div>
            <span
              className="text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded"
              style={{
                backgroundColor: `${urgencyColors[segment.urgency]}18`,
                color: urgencyColors[segment.urgency],
              }}
            >
              {segment.urgency}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
