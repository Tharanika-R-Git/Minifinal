import React, { useState } from 'react';
import { Plus, Save, X } from 'lucide-react';

export const UserInputPanel = ({ onDataSubmit }) => {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    assetName: '',
    location: '',
    cost: '',
    maintenanceDate: '',
    status: 'operational'
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onDataSubmit(formData);
    setFormData({
      assetName: '',
      location: '',
      cost: '',
      maintenanceDate: '',
      status: 'operational'
    });
    setShowForm(false);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="mb-6">
      {!showForm ? (
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105"
        >
          <Plus className="w-5 h-5" />
          Add Asset Data
        </button>
      ) : (
        <div className="bg-gray-800/50 backdrop-blur-lg border border-gray-700/50 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white font-semibold text-lg">Add New Asset</h3>
            <button
              onClick={() => setShowForm(false)}
              className="p-2 text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2">Asset Name</label>
              <input
                type="text"
                name="assetName"
                value={formData.assetName}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                placeholder="Enter asset name"
                required
              />
            </div>
            
            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2">Location</label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                placeholder="Asset location"
                required
              />
            </div>
            
            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2">Cost ($)</label>
              <input
                type="number"
                name="cost"
                value={formData.cost}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                placeholder="Asset cost"
                required
              />
            </div>
            
            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2">Last Maintenance</label>
              <input
                type="date"
                name="maintenanceDate"
                value={formData.maintenanceDate}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                required
              />
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-gray-300 text-sm font-medium mb-2">Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              >
                <option value="operational">Operational</option>
                <option value="maintenance">Under Maintenance</option>
                <option value="offline">Offline</option>
                <option value="retired">Retired</option>
              </select>
            </div>
            
            <div className="md:col-span-2 flex gap-3 mt-4">
              <button
                type="submit"
                className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <Save className="w-4 h-4" />
                Save Asset
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};