import React from 'react';
import { BarChart3, LineChart, PieChart, Donut as Doughnut, Radar, ScatterChart } from 'lucide-react';
import PropTypes from 'prop-types';

const chartTypes = [
  { type: 'bar', icon: BarChart3, label: 'Bar Chart', color: 'text-blue-400' },
  { type: 'line', icon: LineChart, label: 'Line Chart', color: 'text-green-400' },
  { type: 'pie', icon: PieChart, label: 'Pie Chart', color: 'text-purple-400' },
  { type: 'doughnut', icon: Doughnut, label: 'Doughnut', color: 'text-pink-400' },
  { type: 'radar', icon: Radar, label: 'Radar Chart', color: 'text-yellow-400' },
  { type: 'scatter', icon: ScatterChart, label: 'Scatter Plot', color: 'text-red-400' }
];

export const ChartTypeSelector = ({ onSelectType }) => {
  return (
    <div className="bg-gray-800 rounded-lg p-4">
      <h3 className="text-lg font-semibold text-white mb-4">Chart Types</h3>
      <div className="grid grid-cols-2 gap-3">
        {chartTypes.map(({ type, icon: Icon, label, color }) => (
          <button
            key={type}
            onClick={() => onSelectType(type)}
            className="flex flex-col items-center p-3 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors duration-200 group"
          >
            <Icon className={`w-8 h-8 ${color} group-hover:scale-110 transition-transform duration-200`} />
            <span className="text-sm text-gray-300 mt-2">{label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

ChartTypeSelector.propTypes = {
  onSelectType: PropTypes.func.isRequired
};
