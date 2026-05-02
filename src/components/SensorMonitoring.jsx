import React, { useState, useEffect } from 'react';
import { Activity, Thermometer, Droplets, Gauge, MapPin, Wifi, Battery } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

const SensorMonitoring = () => {
  const [sensors, setSensors] = useState([
    { id: 1, name: 'Soil Moisture A', location: 'Zone 1', value: 65, unit: '%', status: 'active', lastUpdate: '2 min ago' },
    { id: 2, name: 'Soil Moisture B', location: 'Zone 2', value: 42, unit: '%', status: 'active', lastUpdate: '1 min ago' },
    { id: 3, name: 'Temperature Sensor', location: 'Greenhouse', value: 24, unit: '°C', status: 'active', lastUpdate: '30 sec ago' },
    { id: 4, name: 'pH Sensor', location: 'Zone 1', value: 6.8, unit: 'pH', status: 'active', lastUpdate: '5 min ago' },
    { id: 5, name: 'Water Level Sensor', location: 'Tank A', value: 78, unit: '%', status: 'warning', lastUpdate: '1 min ago' },
    { id: 6, name: 'Flow Meter', location: 'Main Line', value: 45, unit: 'L/min', status: 'active', lastUpdate: 'Real-time' },
  ]);

  const generateSensorData = () => {
    const data = [];
    for (let i = 0; i < 12; i++) {
      data.push({
        time: `${i * 2}:00`,
        moisture: 50 + Math.random() * 30,
        temperature: 20 + Math.random() * 8,
        ph: 6.0 + Math.random() * 1.5,
      });
    }
    return data;
  };

  const sensorData = generateSensorData();

  const SensorCard = ({ sensor }) => {
    const getStatusColor = (status) => {
      switch (status) {
        case 'active': return 'bg-green-400';
        case 'warning': return 'bg-yellow-400';
        case 'error': return 'bg-red-400';
        default: return 'bg-gray-400';
      }
    };

    const getIcon = (name) => {
      if (name.includes('Moisture')) return Droplets;
      if (name.includes('Temperature')) return Thermometer;
      if (name.includes('pH')) return Gauge;
      if (name.includes('Water') || name.includes('Flow')) return Activity;
      return Activity;
    };

    const Icon = getIcon(sensor.name);

    return (
      <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-5 border border-slate-700/50 hover:border-blue-500/30 transition-all duration-300">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-500/20 rounded-lg">
              <Icon className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <h4 className="text-white font-medium">{sensor.name}</h4>
              <div className="flex items-center gap-1 text-slate-400 text-xs">
                <MapPin className="w-3 h-3" />
                {sensor.location}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${getStatusColor(sensor.status)} ${sensor.status === 'active' ? 'animate-pulse' : ''}`} />
            <Wifi className="w-4 h-4 text-green-400" />
            <Battery className="w-4 h-4 text-green-400" />
          </div>
        </div>
        <div className="flex items-end justify-between">
          <div>
            <span className="text-3xl font-bold text-white">{sensor.value}</span>
            <span className="text-slate-400 text-sm ml-1">{sensor.unit}</span>
          </div>
          <span className="text-slate-500 text-xs">{sensor.lastUpdate}</span>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Sensor Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {sensors.map((sensor) => (
          <SensorCard key={sensor.id} sensor={sensor} />
        ))}
      </div>

      {/* Sensor Data Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Soil Moisture & Temperature */}
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50">
          <h3 className="text-lg font-semibold text-white mb-4">Soil Moisture & Temperature (24h)</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={sensorData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="time" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }}
                labelStyle={{ color: '#94a3b8' }}
              />
              <Line type="monotone" dataKey="moisture" stroke="#38bdf8" strokeWidth={2} name="Moisture %" />
              <Line type="monotone" dataKey="temperature" stroke="#f97316" strokeWidth={2} name="Temp °C" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* pH Levels */}
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50">
          <h3 className="text-lg font-semibold text-white mb-4">pH Levels (24h)</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={sensorData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="time" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" domain={[5, 8]} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }}
                labelStyle={{ color: '#94a3b8' }}
              />
              <Bar dataKey="ph" fill="#22c55e" name="pH Level" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Sensor Health Summary */}
      <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50">
        <h3 className="text-lg font-semibold text-white mb-4">Sensor Health Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-green-500/10 rounded-lg border border-green-500/20">
            <p className="text-3xl font-bold text-green-400">5</p>
            <p className="text-slate-400 text-sm">Active Sensors</p>
          </div>
          <div className="text-center p-4 bg-yellow-500/10 rounded-lg border border-yellow-500/20">
            <p className="text-3xl font-bold text-yellow-400">1</p>
            <p className="text-slate-400 text-sm">Warning</p>
          </div>
          <div className="text-center p-4 bg-red-500/10 rounded-lg border border-red-500/20">
            <p className="text-3xl font-bold text-red-400">0</p>
            <p className="text-slate-400 text-sm">Offline</p>
          </div>
          <div className="text-center p-4 bg-blue-500/10 rounded-lg border border-blue-500/20">
            <p className="text-3xl font-bold text-blue-400">98%</p>
            <p className="text-slate-400 text-sm">Uptime</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SensorMonitoring;
