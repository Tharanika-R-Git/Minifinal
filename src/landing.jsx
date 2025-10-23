import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white flex flex-col justify-center items-center">
      <h1 className="text-6xl font-bold mb-4">Clonos Platform</h1>
      <p className="text-gray-400 text-lg mb-10 text-center max-w-xl">
        Design. Visualize. Analyze. <br />
        Create interactive dashboards effortlessly.
      </p>
      <div className="space-x-4">
        <button
          onClick={() => navigate('/login')}
          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold transition-all"
        >
          Login
        </button>
        <button
          onClick={() => navigate('/dashboard')}
          className="px-6 py-3 bg-gray-700 hover:bg-gray-800 rounded-lg font-semibold transition-all"
        >
          Try Dashboard
        </button>
      </div>
    </div>
  );
}
