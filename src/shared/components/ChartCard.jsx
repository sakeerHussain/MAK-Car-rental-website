import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Cell,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

const CHART_COLORS = ['#00A0E3', '#33BEF0', '#0088C9', '#005A82', '#E6F6FD'];

/**
 * @param {{
 *   title: string,
 *   type?: 'line' | 'doughnut',
 *   data: Record<string, unknown>[],
 *   dataKey?: string,
 *   nameKey?: string,
 *   loading?: boolean,
 *   className?: string,
 * }} props
 */
export function ChartCard({
  title,
  type = 'line',
  data = [],
  dataKey = 'value',
  nameKey = 'name',
  loading = false,
  className,
}) {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <Skeleton className="h-64 w-full" />
        ) : data.length === 0 ? (
          <div className="flex h-64 items-center justify-center text-sm text-text-muted">
            No chart data available
          </div>
        ) : (
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              {type === 'doughnut' ? (
                <PieChart>
                  <Pie
                    data={data}
                    dataKey={dataKey}
                    nameKey={nameKey}
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={2}
                  >
                    {data.map((entry, index) => (
                      <Cell key={`${entry[nameKey]}-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              ) : (
                <LineChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E2EEF3" />
                  <XAxis dataKey={nameKey} tick={{ fill: '#5B7686', fontSize: 12 }} />
                  <YAxis tick={{ fill: '#5B7686', fontSize: 12 }} />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey={dataKey}
                    stroke="#00A0E3"
                    strokeWidth={2}
                    dot={{ fill: '#00A0E3', r: 4 }}
                  />
                </LineChart>
              )}
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
