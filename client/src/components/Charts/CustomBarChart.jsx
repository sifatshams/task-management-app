import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

// custom tooltip component
const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const { priority, count } = payload[0].payload;
    return (
      <div className="bg-slate-900 text-white text-xs py-2 px-3 rounded-lg shadow-lg border border-slate-700">
        <p className="font-semibold">{priority} Priority</p>
        <p className="text-slate-300">
          Tasks: <span className="font-bold text-white">{count}</span>
        </p>
      </div>
    );
  }
  return null;
};

const CustomBarChart = ({ data = [] }) => {
  // get priority color
  const getBarColor = (priority) => {
    switch (priority) {
      case 'Low':
        return '#10b981'; // emerald
      case 'Medium':
        return '#f59e0b'; // amber
      case 'High':
        return '#ef4444'; // rose
      default:
        return '#3b82f6'; // blue
    }
  };

  return (
    <div className="w-full h-[320px] flex items-center justify-center">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            vertical={false}
            stroke="#f1f5f9"
          />

          <XAxis
            dataKey="priority"
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#64748b', fontSize: 12 }}
          />

          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#64748b', fontSize: 12 }}
            allowDecimals={false}
          />

          <Tooltip
            content={<CustomTooltip />}
            cursor={{ fill: 'transparent' }}
          />

          <Bar dataKey="count" radius={[6, 6, 0, 0]} barSize={36}>
            {data.map((entry, index) => (
              <Cell
                key={`bar-cell-${index}`}
                fill={getBarColor(entry.priority)}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CustomBarChart;
