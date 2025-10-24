import React, { useState } from 'react';
import { Plus, Settings, Eye, Code } from 'lucide-react';

export const NoCodeBuilder = ({ onChartCreate }) => {
  const [step, setStep] = useState(1);
  const [chartConfig, setChartConfig] = useState({
    type: 'bar',
    title: '',
    dataSource: '',
    xField: '',
    yField: '',
    filters: []
  });

  const chartTypes = [
    { type: 'bar', name: 'Bar Chart', icon: '📊', use: 'Compare values across categories' },
    { type: 'line', name: 'Line Chart', icon: '📈', use: 'Show trends over time' },
    { type: 'pie', name: 'Pie Chart', icon: '🥧', use: 'Show proportions of a whole' },
    { type: 'doughnut', name: 'Doughnut', icon: '🍩', use: 'Like pie chart with center space' },
    { type: 'radar', name: 'Radar Chart', icon: '🎯', use: 'Compare multiple metrics' }
  ];

  const sampleFields = {
    assets: ['asset_id', 'asset_name', 'location', 'status', 'last_maintenance', 'cost'],
    maintenance: ['maintenance_id', 'asset_id', 'date', 'type', 'cost', 'duration'],
    sensors: ['sensor_id', 'timestamp', 'temperature', 'pressure', 'vibration', 'status']
  };

  const handleNext = () => {
    if (step < 4) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleCreate = () => {
    onChartCreate(chartConfig);
    setStep(1);
    setChartConfig({
      type: 'bar',
      title: '',
      dataSource: '',
      xField: '',
      yField: '',
      filters: []
    });
  };

  return (
    <div className="bg-gray-800 rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-white font-semibold flex items-center gap-2">
          <Plus className="w-5 h-5" />
          No-Code Chart Builder
        </h3>
        <div className="flex items-center gap-2 text-sm text-gray-400">
          Step {step} of 4
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-gray-700 rounded-full h-2 mb-6">
        <div 
          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
          style={{ width: `${(step / 4) * 100}%` }}
        />
      </div>

      {/* Step 1: Chart Type */}
      {step === 1 && (
        <div>
          <h4 className="text-white font-medium mb-4">Choose Chart Type</h4>
          <div className="grid grid-cols-1 gap-3">
            {chartTypes.map(chart => (
              <div
                key={chart.type}
                onClick={() => setChartConfig({...chartConfig, type: chart.type})}
                className={`p-4 rounded-lg cursor-pointer transition-colors ${
                  chartConfig.type === chart.type 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{chart.icon}</span>
                  <div>
                    <div className="font-medium">{chart.name}</div>
                    <div className="text-sm opacity-75">{chart.use}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Step 2: Data Source */}
      {step === 2 && (
        <div>
          <h4 className="text-white font-medium mb-4">Select Data Source</h4>
          <div className="space-y-3">
            {Object.keys(sampleFields).map(source => (
              <div
                key={source}
                onClick={() => setChartConfig({...chartConfig, dataSource: source})}
                className={`p-4 rounded-lg cursor-pointer transition-colors ${
                  chartConfig.dataSource === source 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                <div className="font-medium capitalize">{source} Data</div>
                <div className="text-sm opacity-75">
                  Fields: {sampleFields[source].join(', ')}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Step 3: Configure Fields */}
      {step === 3 && (
        <div>
          <h4 className="text-white font-medium mb-4">Configure Chart Data</h4>
          <div className="space-y-4">
            <div>
              <label className="block text-gray-300 mb-2">Chart Title</label>
              <input
                type="text"
                value={chartConfig.title}
                onChange={(e) => setChartConfig({...chartConfig, title: e.target.value})}
                className="w-full p-3 bg-gray-700 text-white rounded-lg"
                placeholder="Enter chart title"
              />
            </div>
            <div>
              <label className="block text-gray-300 mb-2">X-Axis Field</label>
              <select
                value={chartConfig.xField}
                onChange={(e) => setChartConfig({...chartConfig, xField: e.target.value})}
                className="w-full p-3 bg-gray-700 text-white rounded-lg"
              >
                <option value="">Select field</option>
                {chartConfig.dataSource && sampleFields[chartConfig.dataSource]?.map(field => (
                  <option key={field} value={field}>{field}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-gray-300 mb-2">Y-Axis Field</label>
              <select
                value={chartConfig.yField}
                onChange={(e) => setChartConfig({...chartConfig, yField: e.target.value})}
                className="w-full p-3 bg-gray-700 text-white rounded-lg"
              >
                <option value="">Select field</option>
                {chartConfig.dataSource && sampleFields[chartConfig.dataSource]?.map(field => (
                  <option key={field} value={field}>{field}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Step 4: Preview */}
      {step === 4 && (
        <div>
          <h4 className="text-white font-medium mb-4">Preview & Create</h4>
          <div className="bg-gray-700 p-4 rounded-lg mb-4">
            <div className="text-white font-medium mb-2">Chart Configuration:</div>
            <div className="text-gray-300 text-sm space-y-1">
              <div>Type: {chartConfig.type}</div>
              <div>Title: {chartConfig.title}</div>
              <div>Data Source: {chartConfig.dataSource}</div>
              <div>X-Axis: {chartConfig.xField}</div>
              <div>Y-Axis: {chartConfig.yField}</div>
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <div className="flex justify-between mt-6">
        <button
          onClick={handleBack}
          disabled={step === 1}
          className="px-4 py-2 bg-gray-600 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Back
        </button>
        {step < 4 ? (
          <button
            onClick={handleNext}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Next
          </button>
        ) : (
          <button
            onClick={handleCreate}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            Create Chart
          </button>
        )}
      </div>
    </div>
  );
};