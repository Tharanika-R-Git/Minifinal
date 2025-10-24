import React from 'react';
import { TrendingUp, TrendingDown, Activity, DollarSign } from 'lucide-react';

export const MetricsCards = () => {
  const metrics = [
    {
      title: 'Total Assets',
      value: '1,247',
      change: '+12.5%',
      trend: 'up',
      icon: <Activity className="w-6 h-6" />,
      color: 'blue'
    },
    {
      title: 'Maintenance Cost',
      value: '$45,230',
      change: '-8.2%',
      trend: 'down',
      icon: <DollarSign className="w-6 h-6" />,
      color: 'green'
    },
    {
      title: 'Asset Utilization',
      value: '87.3%',
      change: '+5.1%',
      trend: 'up',
      icon: <TrendingUp className="w-6 h-6" />,
      color: 'purple'
    },
    {
      title: 'Downtime Hours',
      value: '142',
      change: '+15.3%',
      trend: 'up',
      icon: <TrendingDown className="w-6 h-6" />,
      color: 'red'
    }
  ];

  const getColorClasses = (color, trend) => {
    const colors = {
      blue: 'from-blue-500 to-blue-600',
      green: 'from-green-500 to-green-600',
      purple: 'from-purple-500 to-purple-600',
      red: 'from-red-500 to-red-600'
    };
    
    const trendColors = {
      up: trend === 'up' ? 'text-green-400' : 'text-red-400',
      down: 'text-green-400'
    };

    return { bg: colors[color], trend: trendColors[trend] || trendColors.up };
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {metrics.map((metric, index) => {
        const colors = getColorClasses(metric.color, metric.trend);
        return (
          <div key={index} className="bg-gray-800/50 backdrop-blur-lg border border-gray-700/50 rounded-2xl p-6 hover:transform hover:scale-105 transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-xl bg-gradient-to-r ${colors.bg}`}>
                {metric.icon}
              </div>
              <div className={`flex items-center gap-1 text-sm font-medium ${colors.trend}`}>
                {metric.trend === 'up' ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                {metric.change}
              </div>
            </div>
            <div className="text-2xl font-bold text-white mb-1">{metric.value}</div>
            <div className="text-gray-400 text-sm">{metric.title}</div>
            <div className="text-xs text-gray-500 mt-2">vs previous month</div>
          </div>
        );
      })}
    </div>
  );
};