import React, { useState } from 'react';
import { Database, Plus, Trash2, RefreshCw } from 'lucide-react';

export const DataSourceManager = ({ onDataSourceSelect }) => {
  const [dataSources, setDataSources] = useState([
    { id: 'assets', name: 'Asset Registry', type: 'database', status: 'connected' },
    { id: 'maintenance', name: 'Maintenance Logs', type: 'api', status: 'connected' },
    { id: 'sensors', name: 'Sensor Data', type: 'realtime', status: 'connected' }
  ]);

  const [showAddForm, setShowAddForm] = useState(false);
  const [newSource, setNewSource] = useState({ name: '', type: 'database', endpoint: '' });

  const handleAddSource = () => {
    const source = {
      id: Date.now().toString(),
      ...newSource,
      status: 'connected'
    };
    setDataSources([...dataSources, source]);
    setNewSource({ name: '', type: 'database', endpoint: '' });
    setShowAddForm(false);
  };

  return (
    <div className="bg-gray-800 rounded-lg p-4 mb-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-white font-semibold flex items-center gap-2">
          <Database className="w-5 h-5" />
          Data Sources
        </h3>
        <button
          onClick={() => setShowAddForm(true)}
          className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      <div className="space-y-2">
        {dataSources.map(source => (
          <div
            key={source.id}
            onClick={() => onDataSourceSelect(source)}
            className="flex items-center justify-between p-3 bg-gray-700 rounded-lg cursor-pointer hover:bg-gray-600"
          >
            <div>
              <div className="text-white font-medium">{source.name}</div>
              <div className="text-gray-400 text-sm">{source.type}</div>
            </div>
            <div className={`w-3 h-3 rounded-full ${source.status === 'connected' ? 'bg-green-400' : 'bg-red-400'}`} />
          </div>
        ))}
      </div>

      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 p-6 rounded-lg w-96">
            <h4 className="text-white font-semibold mb-4">Add Data Source</h4>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Source Name"
                value={newSource.name}
                onChange={(e) => setNewSource({...newSource, name: e.target.value})}
                className="w-full p-2 bg-gray-700 text-white rounded"
              />
              <select
                value={newSource.type}
                onChange={(e) => setNewSource({...newSource, type: e.target.value})}
                className="w-full p-2 bg-gray-700 text-white rounded"
              >
                <option value="database">Database</option>
                <option value="api">REST API</option>
                <option value="realtime">Real-time Stream</option>
              </select>
              <input
                type="text"
                placeholder="Endpoint/Connection String"
                value={newSource.endpoint}
                onChange={(e) => setNewSource({...newSource, endpoint: e.target.value})}
                className="w-full p-2 bg-gray-700 text-white rounded"
              />
              <div className="flex gap-2">
                <button onClick={handleAddSource} className="flex-1 bg-blue-600 text-white p-2 rounded">
                  Add
                </button>
                <button onClick={() => setShowAddForm(false)} className="flex-1 bg-gray-600 text-white p-2 rounded">
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};