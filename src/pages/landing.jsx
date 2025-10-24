import React from 'react';
import { useNavigate } from 'react-router-dom';

const Landing = () => {

  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 text-white relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-pink-500/10 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      <div className="relative z-10 flex flex-col justify-center items-center min-h-screen px-4">
        {/* Logo/Icon */}
        <div className="mb-8 relative">
          <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-2xl transform rotate-3 hover:rotate-0 transition-transform duration-300">
            <span className="text-4xl">📊</span>
          </div>
          <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-400 rounded-full animate-bounce"></div>
        </div>

        {/* Main heading */}
        <h1 className="text-6xl md:text-7xl font-bold mb-6 text-center bg-gradient-to-r from-white via-blue-200 to-purple-200 bg-clip-text text-transparent">
          CLONOS Platform
        </h1>
        
        {/* Subtitle */}
        <p className="text-gray-300 text-xl md:text-2xl mb-4 text-center max-w-2xl leading-relaxed">
          Asset Lifecycle Management Made Simple
        </p>
        <p className="text-gray-400 text-lg mb-12 text-center max-w-2xl">
          Empower your site engineers to build custom asset dashboards without coding. 
          Monitor, analyze, and optimize your asset performance with our no-code dashboard builder.
        </p>

        {/* Feature highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 max-w-4xl">
          <div className="bg-white/10 backdrop-blur-lg p-6 rounded-2xl border border-white/20 text-center hover:transform hover:scale-105 transition-all duration-300">
            <div className="text-3xl mb-3">🏭</div>
            <h3 className="font-semibold mb-2">Asset Templates</h3>
            <p className="text-gray-400 text-sm">Pre-built dashboards for asset management</p>
          </div>
          <div className="bg-white/10 backdrop-blur-lg p-6 rounded-2xl border border-white/20 text-center hover:transform hover:scale-105 transition-all duration-300">
            <div className="text-3xl mb-3">🔧</div>
            <h3 className="font-semibold mb-2">No-Code Builder</h3>
            <p className="text-gray-400 text-sm">Site engineers build dashboards easily</p>
          </div>
          <div className="bg-white/10 backdrop-blur-lg p-6 rounded-2xl border border-white/20 text-center hover:transform hover:scale-105 transition-all duration-300">
            <div className="text-3xl mb-3">📊</div>
            <h3 className="font-semibold mb-2">Real-time Data</h3>
            <p className="text-gray-400 text-sm">Live asset monitoring and analytics</p>
          </div>
        </div>

        {/* CTA buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={() => navigate('/signup')}
            className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
          >
            Get Started Free
          </button>
          <button
            onClick={() => navigate('/login')}
            className="px-8 py-4 bg-white/10 backdrop-blur-lg border border-white/20 hover:bg-white/20 rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-105"
          >
            Sign In
          </button>
        </div>

        {/* Demo link */}
        <div className="mt-8">
          <button
            onClick={() => navigate('/dashboard')}
            className="text-gray-400 hover:text-white transition-colors underline underline-offset-4"
          >
            Try Demo Dashboard →
          </button>
        </div>
      </div>
    </div>
  );
};

export default Landing;
