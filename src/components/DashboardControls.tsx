import React, { useState } from 'react';
import { Save, FolderOpen, Download, Plus, Trash2 } from 'lucide-react';
import { Dashboard } from '../types/dashboard';

interface DashboardControlsProps {
  dashboard: Dashboard;
  onSave: (name: string) => void;
  onLoad: (dashboard: Dashboard) => void;
  onClear: () => void;
  onExport: () => void;
}

export const DashboardControls: React.FC<DashboardControlsProps> = ({
  dashboard,
  onSave,
  onLoad,
  onClear,
  onExport
}) => {
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [dashboardName, setDashboardName] = useState(dashboard.name);

  const handleSave = () => {
    if (dashboardName.trim()) {
      onSave(dashboardName.trim());
      setShowSaveDialog(false);
    }
  };

  const handleLoad = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const loadedDashboard = JSON.parse(e.target?.result as string);
          onLoad(loadedDashboard);
        } catch (error) {
          alert('Invalid dashboard file');
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="flex items-center justify-between p-4 bg-gray-800 border-b border-gray-700">
      <div className="flex items-center space-x-4">
        <h1 className="text-xl font-bold text-white flex items-center gap-2">
          <Plus className="w-6 h-6 text-blue-400" />
          Dashboard Builder
        </h1>
        <span className="text-gray-400 text-sm">
          {dashboard.name || 'Untitled Dashboard'}
        </span>
      </div>

      <div className="flex items-center space-x-2">
        <button
          onClick={() => setShowSaveDialog(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
        >
          <Save className="w-4 h-4" />
          Save
        </button>

        <label className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors duration-200 cursor-pointer">
          <FolderOpen className="w-4 h-4" />
          Load
          <input
            type="file"
            accept=".json"
            onChange={handleLoad}
            className="hidden"
          />
        </label>

        <button
          onClick={onExport}
          className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors duration-200"
        >
          <Download className="w-4 h-4" />
          Export
        </button>

        <button
          onClick={onClear}
          className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200"
        >
          <Trash2 className="w-4 h-4" />
          Clear
        </button>
      </div>

      {/* Save Dialog */}
      {showSaveDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 p-6 rounded-lg shadow-xl">
            <h3 className="text-lg font-semibold text-white mb-4">Save Dashboard</h3>
            <input
              type="text"
              value={dashboardName}
              onChange={(e) => setDashboardName(e.target.value)}
              placeholder="Dashboard name"
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white mb-4 focus:border-blue-500 focus:outline-none"
              autoFocus
            />
            <div className="flex space-x-3">
              <button
                onClick={handleSave}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Save
              </button>
              <button
                onClick={() => setShowSaveDialog(false)}
                className="flex-1 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};