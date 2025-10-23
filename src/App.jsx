import React, { useState, useCallback } from 'react';
import { Routes, Route } from 'react-router-dom';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Layout } from 'react-grid-layout';

import { ChartTypeSelector } from './components/ChartTypeSelector';
import { DashboardGrid } from './components/DashboardGrid';
import { ConfigurationPanel } from './components/ConfigurationPanel';
import { DashboardControls } from './components/DashboardControls';
import { createDefaultChartData } from './utils/chartHelpers';

import Landing from './pages/Landing';
import Login from './pages/Login';

// 🧩 Dashboard Page logic separated from App routing
function DashboardPage() {
  const [dashboard, setDashboard] = useState({
    id: 'default',
    name: 'My Dashboard',
    items: [],
    layout: []
  });
  const [selectedItemId, setSelectedItemId] = useState(null);
  const [showSidebar, setShowSidebar] = useState(true);

  const selectedItem = dashboard.items.find(item => item.i === selectedItemId);
  const generateItemId = () => `chart_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  const handleSelectChartType = useCallback((type) => {
    const id = generateItemId();
    const chartData = createDefaultChartData(type, id);
    const newItem = { i: id, x: (dashboard.items.length * 2) % 12, y: Math.floor(dashboard.items.length / 6) * 4, w: 6, h: 4, chartData };
    setDashboard(prev => ({ ...prev, items: [...prev.items, newItem] }));
    setSelectedItemId(id);
  }, [dashboard.items.length]);

  const handleLayoutChange = useCallback((layout) => {
    setDashboard(prev => ({
      ...prev,
      items: prev.items.map(item => {
        const layoutItem = layout.find(l => l.i === item.i);
        return layoutItem ? { ...item, ...layoutItem } : item;
      }),
      layout
    }));
  }, []);

  const handleChartUpdate = useCallback((updatedChartData) => {
    setDashboard(prev => ({
      ...prev,
      items: prev.items.map(item =>
        item.i === updatedChartData.id
          ? { ...item, chartData: updatedChartData }
          : item
      )
    }));
  }, []);

  const handleClearDashboard = useCallback(() => {
    if (confirm('Are you sure you want to clear all charts?')) {
      setDashboard({ id: 'default', name: 'My Dashboard', items: [], layout: [] });
      setSelectedItemId(null);
    }
  }, []);

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="min-h-screen bg-gray-900">
        <DashboardControls
          dashboard={dashboard}
          onClear={handleClearDashboard}
        />
        <div className="flex">
          <div className={`${showSidebar ? 'w-64' : 'w-0'} transition-all duration-300 overflow-hidden bg-gray-900 border-r border-gray-700`}>
            <div className="p-4">
              <ChartTypeSelector onSelectType={handleSelectChartType} />
            </div>
          </div>

          <button
            onClick={() => setShowSidebar(!showSidebar)}
            className="fixed left-0 top-1/2 transform -translate-y-1/2 z-40 bg-gray-800 text-white p-2 rounded-r-lg hover:bg-gray-700 transition-colors"
          >
            {showSidebar ? '←' : '→'}
          </button>

          <div className={`flex-1 ${selectedItem ? 'mr-80' : ''} transition-all duration-300`}>
            {dashboard.items.length === 0 ? (
              <div className="flex items-center justify-center h-screen text-white">
                <div className="text-center">
                  <div className="text-6xl mb-4">📊</div>
                  <h2 className="text-2xl font-bold mb-2">Welcome to Dashboard Builder</h2>
                  <p className="text-gray-400">Select a chart type from the sidebar to get started</p>
                </div>
              </div>
            ) : (
              <DashboardGrid
                items={dashboard.items}
                onLayoutChange={handleLayoutChange}
                onItemSelect={setSelectedItemId}
                selectedItemId={selectedItemId}
              />
            )}
          </div>

          {selectedItem && (
            <ConfigurationPanel
              chartData={selectedItem.chartData}
              onUpdate={handleChartUpdate}
              onClose={() => setSelectedItemId(null)}
            />
          )}
        </div>
      </div>
    </DndProvider>
  );
}

// 🧠 Main Router
export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/dashboard" element={<DashboardPage />} />
    </Routes>
  );
}
