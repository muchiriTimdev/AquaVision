import React, { useState, useEffect } from 'react';
import { 
  Droplets, 
  Thermometer, 
  Activity, 
  AlertTriangle, 
  Zap, 
  TrendingUp,
  Smartphone,
  Cloud,
  Leaf,
  BarChart3,
  Book,
  Download
} from 'lucide-react';
import { Cloud, Bug } from 'lucide-react';
import Dashboard from './components/Dashboard';
import SensorMonitoring from './components/SensorMonitoring';
import IrrigationControl from './components/IrrigationControl';
import WaterQuality from './components/WaterQuality';
import Analytics from './components/Analytics';
import Manual from './components/Manual';
import DataExport from './components/DataExport';
import DataVisualization from './components/DataVisualization';
import MobileView from './components/MobileView';
import WeatherIntegration from './components/WeatherIntegration';
import PestPredictionAI from './components/PestPredictionAI';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'sensors', label: 'Sensors', icon: Activity },
    { id: 'irrigation', label: 'Irrigation', icon: Droplets },
    { id: 'quality', label: 'Water Quality', icon: Leaf },
    { id: 'analytics', label: 'Analytics', icon: TrendingUp },
    { id: 'visualization', label: 'Visualization', icon: BarChart3 },
    { id: 'weather', label: 'Weather', icon: Cloud },
    { id: 'pests', label: 'Pest AI', icon: Bug },
    { id: 'manual', label: 'Manual', icon: Book },
    { id: 'export', label: 'Data Export', icon: Download },
  ];

  if (isMobile) {
    return <MobileView tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Header */}
      <header className="bg-slate-900/80 backdrop-blur-md border-b border-blue-500/20 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-r from-aqua-400 to-blue-500 p-2 rounded-lg">
                <Droplets className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">AquaVision</h1>
                <p className="text-xs text-blue-300">Smart Water Management System</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-green-400">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                <span className="text-sm">Live</span>
              </div>
              <Smartphone className="w-5 h-5 text-blue-300" />
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className="bg-slate-800/50 backdrop-blur-sm border-b border-blue-500/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-all duration-200 ${
                    activeTab === tab.id
                      ? 'text-white bg-blue-600/20 border-b-2 border-blue-400'
                      : 'text-slate-400 hover:text-white hover:bg-slate-700/30'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'dashboard' && <Dashboard />}
        {activeTab === 'sensors' && <SensorMonitoring />}
        {activeTab === 'irrigation' && <IrrigationControl />}
        {activeTab === 'visualization' && <DataVisualization />}
        {activeTab === 'quality' && <WaterQuality />}
        {activeTab === 'analytics' && <Analytics />}
        {activeTab === 'weather' && <WeatherIntegration />}
        {activeTab === 'pests' && <PestPredictionAI />}
        {activeTab === 'manual' && <Manual />}
        {activeTab === 'export' && <DataExport />}
      </main>
    </div>
  );
}

export default App;
