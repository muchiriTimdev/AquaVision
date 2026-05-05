import React, { useState, useEffect } from 'react';
import { Bug, AlertTriangle, Shield, Thermometer, Droplets, Wind, Calendar, TrendingUp, AlertCircle } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

/**
 * AI-Powered Pest Prediction System for AquaVision
 * Predicts pest outbreaks based on weather conditions and historical data
 */

const PestPredictionAI = () => {
  const [riskLevel, setRiskLevel] = useState('medium'); // low, medium, high
  const [activePests, setActivePests] = useState([
    { name: 'Fall Armyworm', risk: 'high', probability: 78, conditions: ['High humidity', 'Warm nights'] },
    { name: 'Aphids', risk: 'medium', probability: 45, conditions: ['Moderate temp', 'Low wind'] },
    { name: 'Whiteflies', risk: 'low', probability: 23, conditions: ['Dry conditions'] },
  ]);

  const [historicalData, setHistoricalData] = useState([
    { date: 'Week 1', outbreaks: 2, prevented: 5 },
    { date: 'Week 2', outbreaks: 1, prevented: 7 },
    { date: 'Week 3', outbreaks: 3, prevented: 4 },
    { date: 'Week 4', outbreaks: 0, prevented: 8 },
  ]);

  // Simulate AI predictions based on current conditions
  useEffect(() => {
    const calculateRisk = () => {
      // Mock weather conditions
      const humidity = 75;
      const temp = 28;
      const windSpeed = 8;

      let risk = 'low';
      if (humidity > 70 && temp > 25) {
        risk = 'high';
      } else if (humidity > 60 || temp > 26) {
        risk = 'medium';
      }

      setRiskLevel(risk);
    };

    calculateRisk();
  }, []);

  const getRiskColor = (risk) => {
    switch (risk) {
      case 'high': return 'text-red-400 bg-red-500/20 border-red-500/30';
      case 'medium': return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30';
      case 'low': return 'text-green-400 bg-green-500/20 border-green-500/30';
      default: return 'text-slate-400 bg-slate-500/20';
    }
  };

  const getRiskIcon = (risk) => {
    switch (risk) {
      case 'high': return <AlertTriangle className="w-6 h-6 text-red-400" />;
      case 'medium': return <AlertCircle className="w-6 h-6 text-yellow-400" />;
      case 'low': return <Shield className="w-6 h-6 text-green-400" />;
      default: return <Bug className="w-6 h-6 text-slate-400" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Risk Level Header */}
      <div className={`rounded-xl p-6 border ${getRiskColor(riskLevel)}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {getRiskIcon(riskLevel)}
            <div>
              <h2 className="text-2xl font-bold capitalize">{riskLevel} Pest Risk</h2>
              <p className="text-slate-300 mt-1">
                Current conditions favor {riskLevel === 'high' ? 'significant' : riskLevel} pest activity
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-slate-400">AI Confidence</p>
            <p className="text-2xl font-bold text-white">87%</p>
          </div>
        </div>
      </div>

      {/* Active Threats */}
      <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            <Bug className="w-5 h-5 text-red-400" />
            Active Pest Threats
          </h3>
          <span className="text-sm text-slate-400">Updated 10 minutes ago</span>
        </div>

        <div className="space-y-3">
          {activePests.map((pest, index) => (
            <div 
              key={index} 
              className={`p-4 rounded-lg border ${getRiskColor(pest.risk)}`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  {getRiskIcon(pest.risk)}
                  <div>
                    <p className="font-semibold text-white">{pest.name}</p>
                    <div className="flex items-center gap-2 text-sm">
                      {pest.conditions.map((condition, i) => (
                        <span key={i} className="text-slate-400">{condition}{i < pest.conditions.length - 1 ? ',' : ''}</span>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold">{pest.probability}%</p>
                  <p className="text-sm text-slate-400">Probability</p>
                </div>
              </div>

              {/* Probability Bar */}
              <div className="w-full bg-slate-700/50 rounded-full h-2 mt-2">
                <div 
                  className={`h-2 rounded-full transition-all duration-500 ${
                    pest.risk === 'high' ? 'bg-red-500' : 
                    pest.risk === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                  }`}
                  style={{ width: `${pest.probability}%` }}
                />
              </div>

              {/* Recommended Actions */}
              <div className="mt-3 flex items-center gap-2">
                <Shield className="w-4 h-4 text-green-400" />
                <span className="text-sm text-slate-300">
                  {pest.risk === 'high' ? 'Apply preventive measures immediately' : 
                   pest.risk === 'medium' ? 'Monitor closely, prepare treatments' : 
                   'Standard monitoring sufficient'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Prediction Factors */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-slate-700/50">
          <div className="flex items-center gap-3 mb-2">
            <Thermometer className="w-5 h-5 text-orange-400" />
            <span className="text-slate-300">Temperature</span>
          </div>
          <p className="text-2xl font-bold text-white">28°C</p>
          <p className="text-sm text-red-400 mt-1">Favorable for pests</p>
        </div>

        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-slate-700/50">
          <div className="flex items-center gap-3 mb-2">
            <Droplets className="w-5 h-5 text-blue-400" />
            <span className="text-slate-300">Humidity</span>
          </div>
          <p className="text-2xl font-bold text-white">75%</p>
          <p className="text-sm text-red-400 mt-1">High risk conditions</p>
        </div>

        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-slate-700/50">
          <div className="flex items-center gap-3 mb-2">
            <Wind className="w-5 h-5 text-cyan-400" />
            <span className="text-slate-300">Wind Speed</span>
          </div>
          <p className="text-2xl font-bold text-white">8 km/h</p>
          <p className="text-sm text-green-400 mt-1">Low pest dispersal</p>
        </div>
      </div>

      {/* Historical Chart */}
      <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-blue-400" />
          Pest Outbreak History & Prevention
        </h3>
        <ResponsiveContainer width="100%" height={250}>
          <AreaChart data={historicalData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis dataKey="date" stroke="#94a3b8" />
            <YAxis stroke="#94a3b8" />
            <Tooltip 
              contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }}
              labelStyle={{ color: '#94a3b8' }}
            />
            <Area type="monotone" dataKey="outbreaks" stroke="#ef4444" fill="#ef4444" fillOpacity={0.3} name="Outbreaks" />
            <Area type="monotone" dataKey="prevented" stroke="#22c55e" fill="#22c55e" fillOpacity={0.3} name="Prevented" />
          </AreaChart>
        </ResponsiveContainer>
        <div className="flex items-center justify-center gap-6 mt-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-500 rounded-full" />
            <span className="text-slate-300">Actual Outbreaks</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded-full" />
            <span className="text-slate-300">Prevented by AI</span>
          </div>
        </div>
      </div>

      {/* AI Recommendations */}
      <div className="bg-gradient-to-r from-blue-600/20 to-cyan-600/20 backdrop-blur-sm rounded-xl p-6 border border-blue-500/30">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-cyan-400" />
          AI Prevention Schedule
        </h3>
        <div className="space-y-3">
          {[
            { time: 'Today', action: 'Increase field scouting frequency to every 2 hours', priority: 'high' },
            { time: 'Tomorrow', action: 'Apply neem oil treatment as preventive measure', priority: 'medium' },
            { time: 'Next 3 days', action: 'Deploy pheromone traps in high-risk zones', priority: 'medium' },
            { time: 'Next week', action: 'Review and adjust irrigation to reduce humidity', priority: 'low' },
          ].map((item, index) => (
            <div key={index} className="flex items-center gap-4 p-3 bg-slate-800/50 rounded-lg">
              <div className={`px-3 py-1 rounded-full text-xs font-semibold ${
                item.priority === 'high' ? 'bg-red-500/20 text-red-400' :
                item.priority === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                'bg-green-500/20 text-green-400'
              }`}>
                {item.time}
              </div>
              <p className="text-slate-300 flex-1">{item.action}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PestPredictionAI;
