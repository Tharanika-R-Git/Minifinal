import React, { useState, useEffect } from 'react';
import { X, Upload, Palette, BarChart } from 'lucide-react';
import PropTypes from 'prop-types';
import { COLOR_THEMES, getThemeColors } from '../utils/colorThemes';
import { parseCSVData, generateSampleData } from '../utils/chartHelpers';

export const ConfigurationPanel = ({ chartData, onUpdate, onClose }) => {
  const [formData, setFormData] = useState(null);
  const [csvInput, setCsvInput] = useState('');

  useEffect(() => {
    if (chartData) {
      setFormData({ ...chartData });
    }
  }, [chartData]);

  if (!formData) return null;

  const handleInputChange = (field, value) => {
    const updated = { ...formData, [field]: value };
    setFormData(updated);
    onUpdate(updated);
  };

  const handleDatasetChange = (index, field, value) => {
    const updated = { ...formData };
    updated.datasets[index] = { ...updated.datasets[index], [field]: value };
    setFormData(updated);
    onUpdate(updated);
  };

  const handleLabelsChange = (value) => {
    const labels = value.split(',').map(label => label.trim()).filter(label => label);
    handleInputChange('labels', labels);
  };

  const handleDataChange = (datasetIndex, value) => {
    const data = value.split(',').map(val => parseFloat(val.trim())).filter(val => !isNaN(val));
    handleDatasetChange(datasetIndex, 'data', data);
  };

  const handleCSVUpload = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result;
        const parsedData = parseCSVData(text);
        if (parsedData) {
          handleInputChange('labels', parsedData.labels);
          handleDatasetChange(0, 'data', parsedData.data);
        }
      };
      reader.readAsText(file);
    }
  };

  const handleCSVTextChange = (value) => {
    setCsvInput(value);
    const parsedData = parseCSVData(value);
    if (parsedData) {
      handleInputChange('labels', parsedData.labels);
      handleDatasetChange(0, 'data', parsedData.data);
    }
  };

  const applyColorTheme = (themeName) => {
    const updated = { ...formData };
    const colors = getThemeColors(themeName, formData.labels.length);

    updated.colorTheme = themeName;
    updated.datasets = updated.datasets.map(dataset => ({
      ...dataset,
      backgroundColor: formData.type === 'pie' || formData.type === 'doughnut' ? colors : colors[0],
      borderColor: colors[0]
    }));

    setFormData(updated);
    onUpdate(updated);
  };

  const loadSampleData = () => {
    const sample = generateSampleData(formData.type);
    const updated = {
      ...formData,
      labels: sample.labels || formData.labels,
      datasets: sample.datasets || formData.datasets
    };
    setFormData(updated);
    onUpdate(updated);
  };

  return (
    <div className="fixed right-0 top-0 h-full w-80 bg-gray-900 border-l border-gray-700 shadow-xl z-50 overflow-y-auto">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <BarChart className="w-5 h-5" />
            Configure Chart
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="space-y-6">
          {/* Chart Title */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Chart Title
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:border-blue-500 focus:outline-none"
            />
          </div>

          {/* Chart Type */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Chart Type
            </label>
            <select
              value={formData.type}
              onChange={(e) => handleInputChange('type', e.target.value)}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:border-blue-500 focus:outline-none"
            >
              <option value="bar">Bar Chart</option>
              <option value="line">Line Chart</option>
              <option value="pie">Pie Chart</option>
              <option value="doughnut">Doughnut Chart</option>
              <option value="radar">Radar Chart</option>
              <option value="scatter">Scatter Plot</option>
            </select>
          </div>

          {/* Data Labels */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Data Labels (comma-separated)
            </label>
            <input
              type="text"
              value={formData.labels.join(', ')}
              onChange={(e) => handleLabelsChange(e.target.value)}
              placeholder="Jan, Feb, Mar, Apr, May"
              className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:border-blue-500 focus:outline-none"
            />
          </div>

          {/* Dataset Configuration */}
          {formData.datasets.map((dataset, index) => (
            <div key={index} className="border border-gray-700 rounded-lg p-4">
              <h4 className="text-sm font-medium text-gray-300 mb-3">Dataset {index + 1}</h4>
              <div className="space-y-3">
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Label</label>
                  <input
                    type="text"
                    value={dataset.label}
                    onChange={(e) => handleDatasetChange(index, 'label', e.target.value)}
                    className="w-full px-2 py-1 bg-gray-800 border border-gray-600 rounded text-white text-sm focus:border-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Data (comma-separated)</label>
                  <input
                    type="text"
                    value={dataset.data.join(', ')}
                    onChange={(e) => handleDataChange(index, e.target.value)}
                    placeholder="12, 19, 3, 5, 2"
                    className="w-full px-2 py-1 bg-gray-800 border border-gray-600 rounded text-white text-sm focus:border-blue-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>
          ))}

          {/* CSV Import */}
          <div className="border border-gray-700 rounded-lg p-4">
            <h4 className="text-sm font-medium text-gray-300 mb-3 flex items-center gap-2">
              <Upload className="w-4 h-4" />
              Import Data
            </h4>
            <div className="space-y-3">
              <div>
                <label className="block text-xs text-gray-400 mb-1">Upload CSV File</label>
                <input
                  type="file"
                  accept=".csv"
                  onChange={handleCSVUpload}
                  className="w-full text-sm text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-600 file:text-white hover:file:bg-blue-700"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">Or paste CSV data</label>
                <textarea
                  value={csvInput}
                  onChange={(e) => handleCSVTextChange(e.target.value)}
                  placeholder="Label1, 10&#10;Label2, 20&#10;Label3, 30"
                  className="w-full px-2 py-2 bg-gray-800 border border-gray-600 rounded text-white text-sm focus:border-blue-500 focus:outline-none"
                  rows={3}
                />
              </div>
            </div>
          </div>

          {/* Color Themes */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-3 flex items-center gap-2">
              <Palette className="w-4 h-4" />
              Color Theme
            </label>
            <div className="grid grid-cols-2 gap-2">
              {COLOR_THEMES.map((theme) => (
                <button
                  key={theme.name}
                  onClick={() => applyColorTheme(theme.name)}
                  className={`p-3 rounded-lg border transition-all duration-200 ${
                    formData.colorTheme === theme.name
                      ? 'border-blue-500 bg-blue-500/20'
                      : 'border-gray-600 hover:border-gray-500'
                  }`}
                >
                  <div className="flex justify-center mb-2">
                    <div className="flex space-x-1">
                      {theme.colors.slice(0, 4).map((color, index) => (
                        <div
                          key={index}
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                  </div>
                  <div className="text-xs text-gray-300">{theme.name}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Sample Data */}
          <button
            onClick={loadSampleData}
            className="w-full px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors duration-200 text-sm font-medium"
          >
            Load Sample Data
          </button>
        </div>
      </div>
    </div>
  );
};

ConfigurationPanel.propTypes = {
  chartData: PropTypes.object,
  onUpdate: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired
};
