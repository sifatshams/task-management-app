import { useMemo } from 'react';
import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';

// Custom tooltip for better UI and contrast
const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const { status, count } = payload[0].payload;
    return (
      <div className="bg-slate-900 text-white text-xs py-2 px-3 rounded-lg shadow-lg border border-slate-700">
        <p className="font-semibold">{status}</p>
        <p className="text-slate-300">
          Tasks: <span className="font-bold text-white">{count}</span>
        </p>
      </div>
    );
  }
  return null;
};

// Render custom legend at the bottom with safe payload parsing
const CustomLegend = ({ payload = [] }) => {
  if (!payload || payload.length === 0) return null;

  return (
    <div className="flex items-center justify-center gap-6 mt-2">
      {payload.map((entry, index) => {
        const statusName = entry?.payload?.status || entry?.value || '';
        return (
          <div key={`legend-${index}`} className="flex items-center gap-2">
            <span
              className="w-3 h-3 rounded-full inline-block"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-xs font-medium text-slate-600">
              {statusName}
            </span>
          </div>
        );
      })}
    </div>
  );
};

const CustomPieChart = ({
  data = [],
  colors = ['#f59e0b', '#3b82f6', '#10b981'],
}) => {
  // Calculate total count to show in the center of donut
  const totalTasks = useMemo(() => {
    if (!Array.isArray(data) || data.length === 0) return 0;
    return data.reduce((acc, curr) => acc + Number(curr?.count || 0), 0);
  }, [data]);

  return (
    <div className="w-full h-[320px] flex items-center justify-center">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            dataKey="count"
            nameKey="status"
            cx="50%"
            cy="45%"
            outerRadius={100}
            innerRadius={72}
            paddingAngle={4}
            cornerRadius={6}
            animationDuration={800}
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={colors[index % colors.length]}
                stroke="none"
              />
            ))}
          </Pie>

          {/* SVG Center Text for Perfect Reactive Alignment */}
          <text
            x="50%"
            y="41%"
            textAnchor="middle"
            dominantBaseline="middle"
            className="fill-slate-800 text-2xl font-bold"
          >
            {totalTasks}
          </text>
          <text
            x="50%"
            y="51%"
            textAnchor="middle"
            dominantBaseline="middle"
            className="fill-slate-400 text-[11px] font-medium uppercase tracking-wider"
          >
            Total
          </text>

          <Tooltip content={<CustomTooltip />} />
          <Legend content={<CustomLegend />} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CustomPieChart;
