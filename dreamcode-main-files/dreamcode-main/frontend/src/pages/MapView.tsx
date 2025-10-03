import React, { useState } from 'react';
import { AlertTriangle, Waves, Trash2, Plus, Droplet, ThermometerSun, Fish } from 'lucide-react';

const SAMPLE_DATA = [
  { id: 1, category: 'pollution', description: 'Oil spill observed', quality: 35, time: '2 hours ago' },
  { id: 2, category: 'algae', description: 'Large algae bloom', quality: 65, time: '5 hours ago' },
];

export default function MapView() {
  const [localQuality] = useState(78);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

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

  const getMetrics = () => [
    { icon: Droplet, label: 'Clarity', value: '8.5/10' },
    { icon: ThermometerSun, label: 'Temperature', value: '22°C' },
    { icon: Fish, label: 'Marine Life', value: 'Healthy' },
  ];

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gray-50 p-4 space-y-6">
      {/* Water Quality Circle */}
      <div className="bg-white rounded-2xl shadow-lg p-6 flex flex-col items-center">
        <div className={`w-40 h-40 rounded-full ${getQualityColor(localQuality)} flex items-center justify-center mb-4`}>
          <div className="text-white text-center">
            <div className="text-5xl font-bold">{localQuality}</div>
            <div className="text-sm">Quality Score</div>
          </div>
        </div>
        <div className="text-2xl font-semibold">{getQualityText(localQuality)}</div>
        <div className="text-gray-500 mb-6">Your Local Area</div>

        <div className="grid grid-cols-3 gap-4 w-full">
          {getMetrics().map(({ icon: Icon, label, value }) => (
            <div key={label} className="flex flex-col items-center text-center">
              <Icon className="h-6 w-6 text-blue-600 mb-1" />
              <div className="text-sm font-medium">{label}</div>
              <div className="text-lg font-semibold">{value}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Reports */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Recent Reports</h2>
        <div className="space-y-4">
          {SAMPLE_DATA.map((report) => (
            <div key={report.id} className="border-b pb-4 last:border-0">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold capitalize">{report.category}</h3>
                  <p className="text-gray-600">{report.description}</p>
                  <p className="text-sm text-gray-500 mt-1">{report.time}</p>
                </div>
                <div className={`${getQualityColor(report.quality)} text-white px-3 py-1 rounded-full text-sm`}>
                  {report.quality}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Category Filters */}
      <div className="fixed bottom-4 left-0 right-0 px-4">
        <div className="bg-white rounded-2xl shadow-lg p-2">
          <div className="flex space-x-2 overflow-x-auto pb-2 scrollbar-hide">
            <button 
              className={`flex items-center space-x-2 px-4 py-2 ${
                selectedCategory === 'pollution' ? 'bg-red-500 text-white' : 'bg-red-100 text-red-700'
              } rounded-full whitespace-nowrap`}
              onClick={() => setSelectedCategory(selectedCategory === 'pollution' ? null : 'pollution')}
            >
              <AlertTriangle className="h-5 w-5" />
              <span>Pollution</span>
            </button>
            <button 
              className={`flex items-center space-x-2 px-4 py-2 ${
                selectedCategory === 'algae' ? 'bg-green-500 text-white' : 'bg-green-100 text-green-700'
              } rounded-full whitespace-nowrap`}
              onClick={() => setSelectedCategory(selectedCategory === 'algae' ? null : 'algae')}
            >
              <Waves className="h-5 w-5" />
              <span>Algae</span>
            </button>
            <button 
              className={`flex items-center space-x-2 px-4 py-2 ${
                selectedCategory === 'debris' ? 'bg-yellow-500 text-white' : 'bg-yellow-100 text-yellow-700'
              } rounded-full whitespace-nowrap`}
              onClick={() => setSelectedCategory(selectedCategory === 'debris' ? null : 'debris')}
            >
              <Trash2 className="h-5 w-5" />
              <span>Debris</span>
            </button>
          </div>
        </div>
      </div>

      {/* Add Report Button */}
      <button 
        className="fixed bottom-24 right-4 z-10 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition-colors"
        aria-label="Add new report"
      >
        <Plus className="h-6 w-6" />
      </button>
    </div>
  );
}