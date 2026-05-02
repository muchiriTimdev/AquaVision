import React, { useState, useEffect } from 'react';
import { Droplets, Clock, Play, Pause, RotateCcw, MapPin, Calendar, TrendingUp } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const IrrigationControl = () => {
  const [zones, setZones] = useState([
    { id: 1, name: 'Zone 1 - Field A', status: 'idle', moisture: 45, nextSchedule: '06:00', duration: 30 },
    { id: 2, name: 'Zone 2 - Field B', status: 'active', moisture: 62, nextSchedule: '08:00', duration: 25 },
    { id: 3, name: 'Zone 3 - Greenhouse', status: 'idle', moisture: 55, nextSchedule: '10:00', duration: 20 },
    { id: 4, name: 'Zone 4 - Orchard', status: 'idle', moisture: 38, nextSchedule: '14:00', duration: 35 },
  ]);

  const [schedules, setSchedules] = useState([
    { id: 1, zone: 'Zone 1', time: '06:00', duration: 30, days: ['Mon', 'Wed', 'Fri'], active: true },
    { id: 2, zone: 'Zone 2', time: '08:00', duration: 25, days: ['Tue', 'Thu', 'Sat'], active: true },
    { id: 3, zone: 'Zone 3', time: '10:00', duration: 20, days: ['Daily'], active: true },
    { id: 4, zone: 'Zone 4', time: '14:00', duration: 35, days: ['Mon', 'Thu'], active: false },
  ]);

  const generateWaterUsageData = () => {
    const data = [];
    for (let i = 0; i < 7; i++) {
      data.push({
        day: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i],
        usage: 200 + Math.random() * 150,
        target: 250,
      });
    }
    return data;
  };

  const waterUsageData = generateWaterUsageData();

  const toggleZone = (id) => {
    setZones(zones.map(zone => {
      if (zone.id === id) {
        return {
          ...zone,
          status: zone.status === 'active' ? 'idle' : 'active'
        };
      }
      return zone;
    }));
  };

  const ZoneCard = ({ zone }) => {
    const getStatusBadge = (status) => {
      switch (status) {
        case 'active': return 'bg-green-500/20 text-green-400 border-green-500/30';
        case 'idle': return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
        case 'error': return 'bg-red-500/20 text-red-400 border-red-500/30';
        default: return 'bg-slate-500/20 text-slate-400';
      }
    };

    const getMoistureColor = (moisture) => {
      if (moisture < 40) return 'text-red-400';
      if (moisture < 60) return 'text-yellow-400';
      return 'text-green-400';
    };

    return (
      <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-5 border border-slate-700/50 hover:border-blue-500/30 transition-all duration-300">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h4 className="text-white font-medium">{zone.name}</h4>
            <div className={`flex items-center gap-1 text-xs px-2 py-1 rounded-full border ${getStatusBadge(zone.status)} mt-2 inline-flex`}>
              <div className={`w-1.5 h-1.5 rounded-full ${zone.status === 'active' ? 'bg-green-400 animate-pulse' : 'bg-slate-400'}`} />
              {zone.status.toUpperCase()}
            </div>
          </div>
          <button
            onClick={() => toggleZone(zone.id)}
            className={`p-2 rounded-lg transition-all ${
              zone.status === 'active' 
                ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30' 
                : 'bg-green-500/20 text-green-400 hover:bg-green-500/30'
            }`}
          >
            {zone.status === 'active' ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
          </button>
        </div>

        <div className="space-y-3">
          <div>
            <div className="flex items-center justify-between text-sm mb-1">
              <span className="text-slate-400">Soil Moisture</span>
              <span className={`font-medium ${getMoistureColor(zone.moisture)}`}>{zone.moisture}%</span>
            </div>
            <div className="w-full bg-slate-700 rounded-full h-2">
              <div 
                className={`h-2 rounded-full transition-all ${
                  zone.moisture < 40 ? 'bg-red-400' : zone.moisture < 60 ? 'bg-yellow-400' : 'bg-green-400'
                }`}
                style={{ width: `${zone.moisture}%` }}
              />
            </div>
          </div>

          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-2 text-slate-400">
              <Clock className="w-4 h-4" />
              <span>{zone.nextSchedule}</span>
            </div>
            <div className="flex items-center gap-2 text-slate-400">
              <RotateCcw className="w-4 h-4" />
              <span>{zone.duration} min</span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const ScheduleRow = ({ schedule }) => (
    <div className="flex items-center justify-between p-4 bg-slate-700/30 rounded-lg">
      <div className="flex items-center gap-4">
        <div className={`w-3 h-3 rounded-full ${schedule.active ? 'bg-green-400' : 'bg-slate-400'}`} />
        <div>
          <p className="text-white font-medium">{schedule.zone}</p>
          <div className="flex items-center gap-3 text-sm text-slate-400">
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {schedule.time}
            </span>
            <span className="flex items-center gap-1">
              <RotateCcw className="w-3 h-3" />
              {schedule.duration} min
            </span>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <div className="flex gap-1">
          {schedule.days.map((day, idx) => (
            <span key={idx} className="text-xs px-2 py-1 bg-slate-600 rounded text-slate-300">
              {day}
            </span>
          ))}
        </div>
        <button className="px-3 py-1 text-sm bg-blue-500/20 text-blue-400 rounded hover:bg-blue-500/30 transition-colors">
          Edit
        </button>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Zone Control */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {zones.map((zone) => (
          <ZoneCard key={zone.id} zone={zone} />
        ))}
      </div>

      {/* Water Usage Chart */}
      <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">Water Usage (Weekly)</h3>
          <TrendingUp className="w-5 h-5 text-blue-400" />
        </div>
        <ResponsiveContainer width="100%" height={250}>
          <AreaChart data={waterUsageData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis dataKey="day" stroke="#94a3b8" />
            <YAxis stroke="#94a3b8" />
            <Tooltip 
              contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }}
              labelStyle={{ color: '#94a3b8' }}
            />
            <Area type="monotone" dataKey="usage" stroke="#38bdf8" fill="#38bdf8" fillOpacity={0.3} name="Usage (L)" />
            <Area type="monotone" dataKey="target" stroke="#22c55e" fill="none" strokeDasharray="5 5" name="Target (L)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Irrigation Schedule */}
      <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">Irrigation Schedule</h3>
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
            <Calendar className="w-4 h-4" />
            Add Schedule
          </button>
        </div>
        <div className="space-y-3">
          {schedules.map((schedule) => (
            <ScheduleRow key={schedule.id} schedule={schedule} />
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50">
        <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="flex items-center justify-center gap-2 p-4 bg-green-500/20 text-green-400 rounded-lg hover:bg-green-500/30 transition-colors">
            <Play className="w-5 h-5" />
            Start All Zones
          </button>
          <button className="flex items-center justify-center gap-2 p-4 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors">
            <Pause className="w-5 h-5" />
            Stop All Zones
          </button>
          <button className="flex items-center justify-center gap-2 p-4 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-colors">
            <RotateCcw className="w-5 h-5" />
            Reset System
          </button>
        </div>
      </div>
    </div>
  );
};

export default IrrigationControl;
