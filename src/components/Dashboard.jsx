import React, { useState, useEffect } from 'react';
import { 
  Droplets, 
  Thermometer, 
  Activity, 
  AlertTriangle, 
  Zap, 
  TrendingUp,
  ArrowUp,
  ArrowDown,
  Clock
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

const Dashboard = () => {
  const [waterLevel, setWaterLevel] = useState(75);
  const [flowRate, setFlowRate] = useState(45);
  const [temperature, setTemperature] = useState(24);
  const [pressure, setPressure] = useState(3.2);
  const [alerts, setAlerts] = useState([
    { id: 1, type: 'warning', message: 'Low water pressure in Zone B', time: '2 min ago' },
    { id: 2, type: 'info', message: 'Irrigation schedule completed', time: '15 min ago' },
  ]);

  // Simulate real-time data
  useEffect(() => {
    const interval = setInterval(() => {
      setWaterLevel(prev => Math.max(0, Math.min(100, prev + (Math.random() - 0.5) * 2)));
      setFlowRate(prev => Math.max(0, Math.min(100, prev + (Math.random() - 0.5) * 5)));
      setTemperature(prev => Math.max(15, Math.min(35, prev + (Math.random() - 0.5) * 0.5)));
      setPressure(prev => Math.max(0, Math.min(5, prev + (Math.random() - 0.5) * 0.1)));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  // Generate chart data
  const generateChartData = () => {
    const data = [];
    for (let i = 0; i < 24; i++) {
      data.push({
        time: `${i}:00`,
        waterLevel: 60 + Math.random() * 30,
        flowRate: 30 + Math.random() * 40,
      });
    }
    return data;
  };

  const chartData = generateChartData();

  const StatCard = ({ title, value, unit, icon: Icon, trend, color }) => (
    <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50 hover:border-blue-500/30 transition-all duration-300">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-slate-400 text-sm mb-1">{title}</p>
          <div className="flex items-baseline gap-2">
            <span className={`text-3xl font-bold ${color}`}>{value}</span>
            <span className="text-slate-500 text-sm">{unit}</span>
          </div>
          {trend && (
            <div className={`flex items-center gap-1 mt-2 text-sm ${trend > 0 ? 'text-green-400' : 'text-red-400'}`}>
              {trend > 0 ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />}
              <span>{Math.abs(trend)}%</span>
              <span className="text-slate-500">from last hour</span>
            </div>
          )}
        </div>
        <div className={`p-3 rounded-lg ${color.replace('text-', 'bg-').replace('-400', '-400/20')}`}>
          <Icon className={`w-6 h-6 ${color}`} />
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          title="Water Level" 
          value={waterLevel.toFixed(1)} 
          unit="%" 
          icon={Droplets} 
          trend={2.5}
          color="text-blue-400"
        />
        <StatCard 
          title="Flow Rate" 
          value={flowRate.toFixed(1)} 
          unit="L/min" 
          icon={Activity} 
          trend={-1.2}
          color="text-green-400"
        />
        <StatCard 
          title="Temperature" 
          value={temperature.toFixed(1)} 
          unit="°C" 
          icon={Thermometer} 
          trend={0.5}
          color="text-orange-400"
        />
        <StatCard 
          title="Pressure" 
          value={pressure.toFixed(2)} 
          unit="bar" 
          icon={Zap} 
          trend={1.8}
          color="text-purple-400"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Water Level Chart */}
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50">
          <h3 className="text-lg font-semibold text-white mb-4">Water Level Trends (24h)</h3>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="time" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }}
                labelStyle={{ color: '#94a3b8' }}
              />
              <Area type="monotone" dataKey="waterLevel" stroke="#38bdf8" fill="#38bdf8" fillOpacity={0.3} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Flow Rate Chart */}
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50">
          <h3 className="text-lg font-semibold text-white mb-4">Flow Rate Analysis (24h)</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="time" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }}
                labelStyle={{ color: '#94a3b8' }}
              />
              <Line type="monotone" dataKey="flowRate" stroke="#22c55e" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Alerts Section */}
      <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">Recent Alerts</h3>
          <AlertTriangle className="w-5 h-5 text-yellow-400" />
        </div>
        <div className="space-y-3">
          {alerts.map((alert) => (
            <div 
              key={alert.id}
              className={`flex items-start gap-3 p-4 rounded-lg ${
                alert.type === 'warning' 
                  ? 'bg-yellow-500/10 border border-yellow-500/20' 
                  : 'bg-blue-500/10 border border-blue-500/20'
              }`}
            >
              <div className={`p-2 rounded-lg ${
                alert.type === 'warning' ? 'bg-yellow-500/20' : 'bg-blue-500/20'
              }`}>
                <AlertTriangle className={`w-4 h-4 ${
                  alert.type === 'warning' ? 'text-yellow-400' : 'text-blue-400'
                }`} />
              </div>
              <div className="flex-1">
                <p className="text-white text-sm">{alert.message}</p>
                <div className="flex items-center gap-1 mt-1 text-slate-400 text-xs">
                  <Clock className="w-3 h-3" />
                  {alert.time}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* System Status */}
      <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50">
        <h3 className="text-lg font-semibold text-white mb-4">System Status</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center gap-3 p-4 bg-green-500/10 rounded-lg border border-green-500/20">
            <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse" />
            <div>
              <p className="text-white font-medium">Pump System</p>
              <p className="text-green-400 text-sm">Operational</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-4 bg-green-500/10 rounded-lg border border-green-500/20">
            <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse" />
            <div>
              <p className="text-white font-medium">Sensors</p>
              <p className="text-green-400 text-sm">All Active</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-4 bg-blue-500/10 rounded-lg border border-blue-500/20">
            <div className="w-3 h-3 bg-blue-400 rounded-full animate-pulse" />
            <div>
              <p className="text-white font-medium">Data Sync</p>
              <p className="text-blue-400 text-sm">Real-time</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
