import React, { useState, useEffect } from 'react';
import { Droplets, FlaskConical, AlertTriangle, CheckCircle, TrendingUp, Activity } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';

const WaterQuality = () => {
  const [qualityMetrics, setQualityMetrics] = useState({
    pH: 7.2,
    turbidity: 2.1,
    dissolvedOxygen: 8.5,
    conductivity: 450,
    temperature: 24,
    tds: 280,
  });

  const [alerts, setAlerts] = useState([
    { id: 1, type: 'warning', parameter: 'Turbidity', value: 2.1, threshold: 2.0, message: 'Slightly above threshold' },
    { id: 2, type: 'success', parameter: 'pH Level', value: 7.2, message: 'Within optimal range' },
  ]);

  const generateQualityData = () => {
    const data = [];
    for (let i = 0; i < 24; i++) {
      data.push({
        time: `${i}:00`,
        pH: 6.8 + Math.random() * 0.8,
        turbidity: 1.5 + Math.random() * 1.0,
        dissolvedOxygen: 7.5 + Math.random() * 2.0,
      });
    }
    return data;
  };

  const qualityData = generateQualityData();

  const radarData = [
    { parameter: 'pH', value: 85, fullMark: 100 },
    { parameter: 'Turbidity', value: 70, fullMark: 100 },
    { parameter: 'DO', value: 90, fullMark: 100 },
    { parameter: 'Conductivity', value: 80, fullMark: 100 },
    { parameter: 'Temperature', value: 75, fullMark: 100 },
    { parameter: 'TDS', value: 82, fullMark: 100 },
  ];

  const MetricCard = ({ label, value, unit, icon: Icon, status, threshold }) => {
    const getStatusColor = (status) => {
      switch (status) {
        case 'good': return 'text-green-400 bg-green-500/20 border-green-500/30';
        case 'warning': return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30';
        case 'danger': return 'text-red-400 bg-red-500/20 border-red-500/30';
        default: return 'text-slate-400 bg-slate-500/20 border-slate-500/30';
      }
    };

    return (
      <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-5 border border-slate-700/50 hover:border-blue-500/30 transition-all duration-300">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className={`p-2 ${status === 'good' ? 'bg-green-500/20' : status === 'warning' ? 'bg-yellow-500/20' : 'bg-red-500/20'} rounded-lg`}>
              <Icon className={`w-5 h-5 ${status === 'good' ? 'text-green-400' : status === 'warning' ? 'text-yellow-400' : 'text-red-400'}`} />
            </div>
            <div>
              <h4 className="text-white font-medium">{label}</h4>
              {threshold && <p className="text-slate-500 text-xs">Threshold: {threshold}</p>}
            </div>
          </div>
          <div className={`px-2 py-1 rounded-full text-xs border ${getStatusColor(status)}`}>
            {status.toUpperCase()}
          </div>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-bold text-white">{value}</span>
          <span className="text-slate-400 text-sm">{unit}</span>
        </div>
      </div>
    );
  };

  const AlertCard = ({ alert }) => {
    const getAlertStyles = (type) => {
      switch (type) {
        case 'warning': return 'bg-yellow-500/10 border-yellow-500/20';
        case 'success': return 'bg-green-500/10 border-green-500/20';
        case 'danger': return 'bg-red-500/10 border-red-500/20';
        default: return 'bg-slate-500/10 border-slate-500/20';
      }
    };

    const getAlertIcon = (type) => {
      switch (type) {
        case 'warning': return AlertTriangle;
        case 'success': return CheckCircle;
        case 'danger': return AlertTriangle;
        default: return Activity;
      }
    };

    const Icon = getAlertIcon(alert.type);

    return (
      <div className={`p-4 rounded-lg border ${getAlertStyles(alert.type)}`}>
        <div className="flex items-start gap-3">
          <div className={`p-2 rounded-lg ${alert.type === 'warning' ? 'bg-yellow-500/20' : alert.type === 'success' ? 'bg-green-500/20' : 'bg-red-500/20'}`}>
            <Icon className={`w-5 h-5 ${alert.type === 'warning' ? 'text-yellow-400' : alert.type === 'success' ? 'text-green-400' : 'text-red-400'}`} />
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <p className="text-white font-medium">{alert.parameter}</p>
              <span className="text-lg font-bold text-white">{alert.value}</span>
            </div>
            <p className="text-slate-400 text-sm mt-1">{alert.message}</p>
            {alert.threshold && (
              <p className="text-slate-500 text-xs mt-1">Threshold: {alert.threshold}</p>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Quality Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <MetricCard 
          label="pH Level" 
          value={qualityMetrics.pH} 
          unit="pH" 
          icon={Droplets}
          status="good"
          threshold="6.5 - 8.5"
        />
        <MetricCard 
          label="Turbidity" 
          value={qualityMetrics.turbidity} 
          unit="NTU" 
          icon={FlaskConical}
          status="warning"
          threshold="< 2.0"
        />
        <MetricCard 
          label="Dissolved Oxygen" 
          value={qualityMetrics.dissolvedOxygen} 
          unit="mg/L" 
          icon={Activity}
          status="good"
          threshold="> 6.0"
        />
        <MetricCard 
          label="Conductivity" 
          value={qualityMetrics.conductivity} 
          unit="µS/cm" 
          icon={TrendingUp}
          status="good"
          threshold="< 500"
        />
        <MetricCard 
          label="Temperature" 
          value={qualityMetrics.temperature} 
          unit="°C" 
          icon={Activity}
          status="good"
          threshold="20 - 30"
        />
        <MetricCard 
          label="Total Dissolved Solids" 
          value={qualityMetrics.tds} 
          unit="ppm" 
          icon={Droplets}
          status="good"
          threshold="< 500"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Water Quality Trends */}
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50">
          <h3 className="text-lg font-semibold text-white mb-4">Water Quality Trends (24h)</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={qualityData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="time" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }}
                labelStyle={{ color: '#94a3b8' }}
              />
              <Line type="monotone" dataKey="pH" stroke="#38bdf8" strokeWidth={2} name="pH" />
              <Line type="monotone" dataKey="turbidity" stroke="#f97316" strokeWidth={2} name="Turbidity" />
              <Line type="monotone" dataKey="dissolvedOxygen" stroke="#22c55e" strokeWidth={2} name="DO (mg/L)" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Quality Radar */}
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50">
          <h3 className="text-lg font-semibold text-white mb-4">Overall Quality Score</h3>
          <ResponsiveContainer width="100%" height={250}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="#334155" />
              <PolarAngleAxis dataKey="parameter" stroke="#94a3b8" />
              <PolarRadiusAxis angle={90} domain={[0, 100]} stroke="#94a3b8" />
              <Radar name="Quality Score" dataKey="value" stroke="#38bdf8" fill="#38bdf8" fillOpacity={0.3} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Alerts */}
      <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">Quality Alerts</h3>
          <AlertTriangle className="w-5 h-5 text-yellow-400" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {alerts.map((alert) => (
            <AlertCard key={alert.id} alert={alert} />
          ))}
        </div>
      </div>

      {/* Water Quality Standards */}
      <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50">
        <h3 className="text-lg font-semibold text-white mb-4">WHO Water Quality Standards</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-700">
                <th className="text-left text-slate-400 font-medium py-3 px-4">Parameter</th>
                <th className="text-left text-slate-400 font-medium py-3 px-4">Acceptable Range</th>
                <th className="text-left text-slate-400 font-medium py-3 px-4">Current Value</th>
                <th className="text-left text-slate-400 font-medium py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-slate-700/50">
                <td className="text-white py-3 px-4">pH</td>
                <td className="text-slate-400 py-3 px-4">6.5 - 8.5</td>
                <td className="text-white py-3 px-4">{qualityMetrics.pH}</td>
                <td className="text-green-400 py-3 px-4">✓ Compliant</td>
              </tr>
              <tr className="border-b border-slate-700/50">
                <td className="text-white py-3 px-4">Turbidity</td>
                <td className="text-slate-400 py-3 px-4">&lt; 5 NTU</td>
                <td className="text-white py-3 px-4">{qualityMetrics.turbidity} NTU</td>
                <td className="text-green-400 py-3 px-4">✓ Compliant</td>
              </tr>
              <tr className="border-b border-slate-700/50">
                <td className="text-white py-3 px-4">Dissolved Oxygen</td>
                <td className="text-slate-400 py-3 px-4">&gt; 6 mg/L</td>
                <td className="text-white py-3 px-4">{qualityMetrics.dissolvedOxygen} mg/L</td>
                <td className="text-green-400 py-3 px-4">✓ Compliant</td>
              </tr>
              <tr>
                <td className="text-white py-3 px-4">TDS</td>
                <td className="text-slate-400 py-3 px-4">&lt; 1000 ppm</td>
                <td className="text-white py-3 px-4">{qualityMetrics.tds} ppm</td>
                <td className="text-green-400 py-3 px-4">✓ Compliant</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default WaterQuality;
