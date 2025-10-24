import React from 'react';
import { Wrench, Zap, Gauge, TrendingUp } from 'lucide-react';

export const AssetTemplates = ({ onTemplateSelect }) => {
  const templates = [
    {
      id: 'asset-overview',
      name: 'Asset Overview',
      icon: <Gauge className="w-6 h-6" />,
      description: 'Complete asset status dashboard',
      charts: [
        { type: 'pie', title: 'Asset Status Distribution', data: 'asset_status' },
        { type: 'bar', title: 'Assets by Location', data: 'asset_location' },
        { type: 'line', title: 'Asset Utilization Trend', data: 'utilization_trend' }
      ]
    },
    {
      id: 'maintenance-tracker',
      name: 'Maintenance Tracker',
      icon: <Wrench className="w-6 h-6" />,
      description: 'Track maintenance schedules and costs',
      charts: [
        { type: 'bar', title: 'Maintenance Costs by Month', data: 'maintenance_costs' },
        { type: 'doughnut', title: 'Maintenance Types', data: 'maintenance_types' },
        { type: 'line', title: 'Downtime Trends', data: 'downtime_data' }
      ]
    },
    {
      id: 'performance-monitor',
      name: 'Performance Monitor',
      icon: <TrendingUp className="w-6 h-6" />,
      description: 'Real-time asset performance metrics',
      charts: [
        { type: 'line', title: 'Performance Metrics', data: 'performance_data' },
        { type: 'radar', title: 'Asset Health Score', data: 'health_metrics' },
        { type: 'bar', title: 'Efficiency Ratings', data: 'efficiency_data' }
      ]
    },
    {
      id: 'energy-consumption',
      name: 'Energy Consumption',
      icon: <Zap className="w-6 h-6" />,
      description: 'Monitor energy usage and costs',
      charts: [
        { type: 'line', title: 'Energy Consumption Trend', data: 'energy_usage' },
        { type: 'pie', title: 'Energy by Asset Type', data: 'energy_by_type' },
        { type: 'bar', title: 'Monthly Energy Costs', data: 'energy_costs' }
      ]
    }
  ];

  return (
    <div className="bg-gray-800 rounded-lg p-4 mb-4">
      <h3 className="text-white font-semibold mb-4">Asset Dashboard Templates</h3>
      <div className="space-y-3">
        {templates.map(template => (
          <div
            key={template.id}
            onClick={() => onTemplateSelect(template)}
            className="bg-gray-700 p-4 rounded-lg cursor-pointer hover:bg-gray-600 transition-colors"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="text-blue-400">{template.icon}</div>
              <h4 className="text-white font-medium text-sm">{template.name}</h4>
            </div>
            <p className="text-gray-400 text-xs mb-2">{template.description}</p>
            <div className="text-xs text-gray-500">
              {template.charts.length} charts
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};