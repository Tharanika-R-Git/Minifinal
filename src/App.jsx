import React, { useState, useCallback } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

import { ChartTypeSelector } from './components/ChartTypeSelector';
import { DashboardGrid } from './components/DashboardGrid';
import { ConfigurationPanel } from './components/ConfigurationPanel';
import { DashboardControls } from './components/DashboardControls';
import { DataSourceManager } from './components/DataSourceManager';
import { AssetTemplates } from './components/AssetTemplates';
import { NoCodeBuilder } from './components/NoCodeBuilder';
import { MetricsCards } from './components/MetricsCards';
import { UserInputPanel } from './components/UserInputPanel';
import { createDefaultChartData } from './utils/chartHelpers';

import Landing from './pages/landing';
import Login from './pages/loginpage';
import Signup from './pages/signup';

// Auth check hook
const useAuth = () => {
  const navigate = useNavigate();
  
  React.useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
    }
  }, [navigate]);
};

// Dashboard Page
function DashboardPage() {
  // useAuth(); // Disabled for demo mode
  const [dashboard, setDashboard] = useState({
    id: 'default',
    name: 'My Dashboard',
    items: [],
    layout: [],
  });

  const [selectedItemId, setSelectedItemId] = useState(null);
  const [showSidebar, setShowSidebar] = useState(true);
  const [activeTab, setActiveTab] = useState('templates');
  const [selectedDataSource, setSelectedDataSource] = useState(null);
  const [userAssets, setUserAssets] = useState([]);

  const selectedItem = dashboard.items.find(item => item.i === selectedItemId);

  const generateItemId = () =>
    `chart_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`;

  const handleSelectChartType = useCallback(
    type => {
      const id = generateItemId();
      const chartData = createDefaultChartData(type, id);
      const newItem = {
        i: id,
        x: (dashboard.items.length * 2) % 12,
        y: Math.floor(dashboard.items.length / 6) * 4,
        w: 6,
        h: 4,
        chartData,
      };
      setDashboard(prev => ({ ...prev, items: [...prev.items, newItem] }));
      setSelectedItemId(id);
    },
    [dashboard.items.length]
  );

  const handleTemplateSelect = useCallback(template => {
    const newItems = template.charts.map((chart, index) => {
      const id = generateItemId();
      const chartData = createDefaultChartData(chart.type, id);
      chartData.title = chart.title;
      return {
        i: id,
        x: (index * 6) % 12,
        y: Math.floor(index / 2) * 4,
        w: 6,
        h: 4,
        chartData,
      };
    });
    setDashboard(prev => ({ ...prev, items: [...prev.items, ...newItems] }));
  }, []);

  const handleNoCodeChartCreate = useCallback(config => {
    const id = generateItemId();
    const chartData = createDefaultChartData(config.type, id);
    chartData.title = config.title;
    const newItem = {
      i: id,
      x: (dashboard.items.length * 2) % 12,
      y: Math.floor(dashboard.items.length / 6) * 4,
      w: 6,
      h: 4,
      chartData,
    };
    setDashboard(prev => ({ ...prev, items: [...prev.items, newItem] }));
    setSelectedItemId(id);
  }, [dashboard.items.length]);

  const handleUserDataSubmit = useCallback(data => {
    setUserAssets(prev => [...prev, { ...data, id: Date.now() }]);
  }, []);

  const handleLayoutChange = useCallback(layout => {
    setDashboard(prev => ({
      ...prev,
      items: prev.items.map(item => {
        const layoutItem = layout.find(l => l.i === item.i);
        return layoutItem ? { ...item, ...layoutItem } : item;
      }),
      layout,
    }));
  }, []);

  const handleChartUpdate = useCallback(updatedChartData => {
    setDashboard(prev => ({
      ...prev,
      items: prev.items.map(item =>
        item.i === updatedChartData.id
          ? { ...item, chartData: updatedChartData }
          : item
      ),
    }));
  }, []);

  const handleClearDashboard = useCallback(() => {
    if (window.confirm('Are you sure you want to clear all charts?')) {
      setDashboard({ id: 'default', name: 'My Dashboard', items: [], layout: [] });
      setSelectedItemId(null);
    }
  }, []);

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        {/* Background Effects */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>
        <DashboardControls dashboard={dashboard} onClear={handleClearDashboard} />

        <div className="flex relative">
          {/* Sidebar */}
          <div
            className={`${
              showSidebar ? 'w-64' : 'w-0'
            } transition-all duration-300 overflow-hidden bg-gray-900 border-r border-gray-700`}
          >
            <div className="p-4">
              {/* Tab Navigation */}
              <div className="flex mb-4 bg-gray-700 rounded-lg p-1">
                <button
                  onClick={() => setActiveTab('templates')}
                  className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
                    activeTab === 'templates' ? 'bg-blue-600 text-white' : 'text-gray-300 hover:text-white'
                  }`}
                >
                  Templates
                </button>
                <button
                  onClick={() => setActiveTab('builder')}
                  className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
                    activeTab === 'builder' ? 'bg-blue-600 text-white' : 'text-gray-300 hover:text-white'
                  }`}
                >
                  Builder
                </button>
                <button
                  onClick={() => setActiveTab('charts')}
                  className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
                    activeTab === 'charts' ? 'bg-blue-600 text-white' : 'text-gray-300 hover:text-white'
                  }`}
                >
                  Charts
                </button>
              </div>

              {/* Tab Content */}
              {activeTab === 'templates' && (
                <div>
                  <DataSourceManager onDataSourceSelect={setSelectedDataSource} />
                  <AssetTemplates onTemplateSelect={handleTemplateSelect} />
                </div>
              )}
              
              {activeTab === 'builder' && (
                <NoCodeBuilder onChartCreate={handleNoCodeChartCreate} />
              )}
              
              {activeTab === 'charts' && (
                <ChartTypeSelector onSelectType={handleSelectChartType} />
              )}
            </div>
          </div>

          {/* Toggle Sidebar Button */}
          <button
            onClick={() => setShowSidebar(!showSidebar)}
            className="fixed left-0 top-1/2 transform -translate-y-1/2 z-40 bg-gray-800 text-white p-2 rounded-r-lg hover:bg-gray-700 transition-colors"
          >
            {showSidebar ? '←' : '→'}
          </button>

          {/* Main Content */}
          <div className={`flex-1 ${selectedItem ? 'mr-80' : ''} transition-all duration-300 relative z-10`}>
            <div className="p-6">
              <MetricsCards />
              <UserInputPanel onDataSubmit={handleUserDataSubmit} />
            </div>
            {dashboard.items.length === 0 ? (
              <div className="flex items-center justify-center min-h-[60vh] text-white px-6">
                <div className="text-center max-w-2xl">
                  <div className="text-6xl mb-4">🏭</div>
                  <h2 className="text-3xl font-bold mb-4">CLONOS Asset Dashboard Builder</h2>
                  <p className="text-gray-400 mb-6">
                    Build powerful asset lifecycle management dashboards without coding.
                    Choose from pre-built templates or create custom charts for your assets.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div className="bg-gray-800 p-4 rounded-lg">
                      <div className="text-2xl mb-2">📋</div>
                      <div className="font-medium text-white">Asset Templates</div>
                      <div className="text-gray-400">Pre-built dashboards for common asset scenarios</div>
                    </div>
                    <div className="bg-gray-800 p-4 rounded-lg">
                      <div className="text-2xl mb-2">🔧</div>
                      <div className="font-medium text-white">No-Code Builder</div>
                      <div className="text-gray-400">Create custom charts with simple wizard</div>
                    </div>
                    <div className="bg-gray-800 p-4 rounded-lg">
                      <div className="text-2xl mb-2">📊</div>
                      <div className="font-medium text-white">Chart Library</div>
                      <div className="text-gray-400">Advanced chart types for detailed analysis</div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="px-6">
                <DashboardGrid
                  items={dashboard.items}
                  onLayoutChange={handleLayoutChange}
                  onItemSelect={setSelectedItemId}
                  selectedItemId={selectedItemId}
                />
              </div>
            )}
          </div>

          {/* Configuration Panel */}
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

// Main Router
export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/dashboard" element={<DashboardPage />} />
    </Routes>
  );
}
