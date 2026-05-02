import React from 'react';
import { Droplets, BarChart3, Activity, Leaf, TrendingUp, Menu, X } from 'lucide-react';
import Dashboard from './Dashboard';
import SensorMonitoring from './SensorMonitoring';
import IrrigationControl from './IrrigationControl';
import WaterQuality from './WaterQuality';
import Analytics from './Analytics';

const MobileView = ({ tabs, activeTab, setActiveTab }) => {
  const [showMenu, setShowMenu] = React.useState(false);

  const components = {
    dashboard: Dashboard,
    sensors: SensorMonitoring,
    irrigation: IrrigationControl,
    quality: WaterQuality,
    analytics: Analytics,
  };

  const ActiveComponent = components[activeTab];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Header */}
      <header className="bg-slate-900/80 backdrop-blur-md border-b border-blue-500/20 sticky top-0 z-50">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-r from-aqua-400 to-blue-500 p-2 rounded-lg">
                <Droplets className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-white">AquaVision</h1>
                <p className="text-xs text-blue-300">Smart Water Management</p>
              </div>
            </div>
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-2 rounded-lg bg-slate-800 text-white"
            >
              {showMenu ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      {showMenu && (
        <div className="bg-slate-800/95 backdrop-blur-md border-b border-blue-500/20">
          <div className="px-4 py-3 space-y-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id);
                    setShowMenu(false);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                    activeTab === tab.id
                      ? 'bg-blue-600/20 text-white border border-blue-500/30'
                      : 'text-slate-400 hover:bg-slate-700/30'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="px-4 py-6 pb-24">
        <ActiveComponent />
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-slate-900/95 backdrop-blur-md border-t border-blue-500/20">
        <div className="flex justify-around py-2">
          {tabs.slice(0, 5).map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-all ${
                  activeTab === tab.id
                    ? 'text-blue-400'
                    : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="text-xs">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
};

export default MobileView;
