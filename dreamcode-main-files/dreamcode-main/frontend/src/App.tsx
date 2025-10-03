import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Droplet, ThermometerSun, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import WaterMetrics from './pages/WaterMetrics';

function HomePage() {
  const localQuality = 78;

  const getQualityColor = (quality: number) => {
    if (quality >= 80) return 'bg-green-500';
    if (quality >= 60) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getQualityText = (quality: number) => {
    if (quality >= 80) return 'Excellent';
    if (quality >= 60) return 'Good';
    return 'Poor';
  };

  const metrics = [
    { icon: Droplet, label: 'Water Metrics', value: 'View Details' },
    { icon: ThermometerSun, label: 'Temperature', value: '22°C' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100 p-6">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-3xl shadow-xl p-8 space-y-8">
          {/* Water Quality Circle */}
          <div className="flex flex-col items-center">
            <div 
              className={`w-48 h-48 rounded-full ${getQualityColor(localQuality)} 
                flex items-center justify-center mb-6 shadow-lg 
                transition-transform transform hover:scale-105`}
            >
              <div className="text-white text-center">
                <div className="text-6xl font-bold">{localQuality}</div>
                <div className="text-lg mt-1">Quality Score</div>
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-800">{getQualityText(localQuality)}</div>
            <div className="text-lg text-gray-600 mt-1">Current Water Quality</div>
          </div>

          {/* Metrics Grid */}
          <div className="grid grid-cols-2 gap-8">
            <Link 
              to="/metrics" 
              className="flex flex-col items-center p-4 bg-blue-50 rounded-2xl
                transition-transform transform hover:scale-105 hover:bg-blue-100 group"
            >
              <Droplet className="h-8 w-8 text-blue-600 mb-2" />
              <div className="text-sm font-medium text-gray-600">Water Metrics</div>
              <div className="flex items-center text-blue-600 mt-1">
                View Details
                <ChevronRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
            <div 
              className="flex flex-col items-center p-4 bg-blue-50 rounded-2xl
                transition-transform transform hover:scale-105"
            >
              <ThermometerSun className="h-8 w-8 text-blue-600 mb-2" />
              <div className="text-sm font-medium text-gray-600">Temperature</div>
              <div className="text-xl font-bold text-gray-800 mt-1">22°C</div>
            </div>
          </div>

          {/* Last Updated */}
          <div className="text-center text-gray-500 text-sm">
            Last updated: {new Date().toLocaleTimeString()}
          </div>
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/metrics" element={<WaterMetrics />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;