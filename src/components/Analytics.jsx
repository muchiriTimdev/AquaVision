import React, { useState } from 'react';
import { TrendingUp, Droplets, Leaf, Zap, Calendar, Download, Filter } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';

const Analytics = () => {
  const [timeRange, setTimeRange] = useState('week');

  const generateWaterConsumptionData = () => {
    const data = [];
    for (let i = 0; i < 7; i++) {
      data.push({
        day: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i],
        consumption: 1500 + Math.random() * 800,
        saved: 200 + Math.random() * 300,
      });
    }
    return data;
  };

  const generateYieldData = () => {
    const data = [];
    for (let i = 0; i < 12; i++) {
      data.push({
        month: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][i],
        yield: 80 + Math.random() * 40,
        target: 100,
      });
    }
    return data;
  };

  const efficiencyData = [
    { name: 'Water Saved', value: 35, color: '#38bdf8' },
    { name: 'Energy Saved', value: 28, color: '#22c55e' },
    { name: 'Yield Increase', value: 25, color: '#f97316' },
    { name: 'Cost Reduction', value: 12, color: '#a855f7' },
  ];

  const waterConsumptionData = generateWaterConsumptionData();
  const yieldData = generateYieldData();

  const StatCard = ({ title, value, unit, change, icon: Icon, color }) => (
    <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50 hover:border-blue-500/30 transition-all duration-300">
      <div className="flex items-start justify-between mb-3">
        <div className={`p-3 rounded-lg ${color.replace('text-', 'bg-').replace('-400', '-400/20')}`}>
          <Icon className={`w-6 h-6 ${color}`} />
        </div>
        <div className={`flex items-center gap-1 text-sm ${change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
          <TrendingUp className={`w-4 h-4 ${change < 0 ? 'rotate-180' : ''}`} />
          <span>{Math.abs(change)}%</span>
        </div>
      </div>
      <p className="text-slate-400 text-sm mb-1">{title}</p>
      <div className="flex items-baseline gap-2">
        <span className="text-3xl font-bold text-white">{value}</span>
        <span className="text-slate-500 text-sm">{unit}</span>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Time Range Selector */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Analytics Dashboard</h2>
        <div className="flex items-center gap-2">
          <button className="p-2 bg-slate-700 rounded-lg hover:bg-slate-600 transition-colors">
            <Filter className="w-4 h-4 text-white" />
          </button>
          <select 
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="bg-slate-700 text-white px-4 py-2 rounded-lg border border-slate-600 focus:outline-none focus:border-blue-500"
          >
            <option value="day">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="year">This Year</option>
          </select>
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          title="Total Water Consumed" 
          value="12,450" 
          unit="L" 
          change={-15}
          icon={Droplets}
          color="text-blue-400"
        />
        <StatCard 
          title="Water Saved" 
          value="3,280" 
          unit="L" 
          change={22}
          icon={Droplets}
          color="text-green-400"
        />
        <StatCard 
          title="Crop Yield" 
          value="8.5" 
          unit="tons/ha" 
          change={18}
          icon={Leaf}
          color="text-orange-400"
        />
        <StatCard 
          title="Energy Efficiency" 
          value="87" 
          unit="%" 
          change={12}
          icon={Zap}
          color="text-purple-400"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Water Consumption */}
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">Water Consumption</h3>
            <Calendar className="w-5 h-5 text-blue-400" />
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={waterConsumptionData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="day" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }}
                labelStyle={{ color: '#94a3b8' }}
              />
              <Bar dataKey="consumption" fill="#38bdf8" name="Consumed (L)" />
              <Bar dataKey="saved" fill="#22c55e" name="Saved (L)" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Crop Yield */}
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">Crop Yield vs Target</h3>
            <Leaf className="w-5 h-5 text-green-400" />
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={yieldData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="month" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }}
                labelStyle={{ color: '#94a3b8' }}
              />
              <Line type="monotone" dataKey="yield" stroke="#22c55e" strokeWidth={2} name="Actual Yield" />
              <Line type="monotone" dataKey="target" stroke="#94a3b8" strokeDasharray="5 5" strokeWidth={2} name="Target" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Efficiency Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Efficiency Pie Chart */}
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50">
          <h3 className="text-lg font-semibold text-white mb-4">Efficiency Breakdown</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={efficiencyData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
              >
                {efficiencyData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }}
                labelStyle={{ color: '#94a3b8' }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-4 space-y-2">
            {efficiencyData.map((item, index) => (
              <div key={index} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-slate-400">{item.name}</span>
                </div>
                <span className="text-white font-medium">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* ROI Summary */}
        <div className="lg:col-span-2 bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50">
          <h3 className="text-lg font-semibold text-white mb-4">Return on Investment Summary</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-blue-500/10 rounded-lg border border-blue-500/20">
              <p className="text-3xl font-bold text-blue-400">$12,450</p>
              <p className="text-slate-400 text-sm mt-1">Water Cost Saved</p>
              <p className="text-green-400 text-xs mt-2">+22% from last period</p>
            </div>
            <div className="text-center p-4 bg-green-500/10 rounded-lg border border-green-500/20">
              <p className="text-3xl font-bold text-green-400">$8,320</p>
              <p className="text-slate-400 text-sm mt-1">Yield Value Increase</p>
              <p className="text-green-400 text-xs mt-2">+18% from last period</p>
            </div>
            <div className="text-center p-4 bg-purple-500/10 rounded-lg border border-purple-500/20">
              <p className="text-3xl font-bold text-purple-400">$20,770</p>
              <p className="text-slate-400 text-sm mt-1">Total Savings</p>
              <p className="text-green-400 text-xs mt-2">+20% from last period</p>
            </div>
          </div>
          <div className="mt-6 p-4 bg-slate-700/30 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white font-medium">System Payback Period</p>
                <p className="text-slate-400 text-sm">Based on current savings rate</p>
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold text-green-400">8.5</p>
                <p className="text-slate-400 text-sm">months</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recommendations */}
      <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50">
        <h3 className="text-lg font-semibold text-white mb-4">AI-Powered Recommendations</h3>
        <div className="space-y-3">
          <div className="flex items-start gap-3 p-4 bg-green-500/10 rounded-lg border border-green-500/20">
            <div className="p-2 bg-green-500/20 rounded-lg">
              <Leaf className="w-5 h-5 text-green-400" />
            </div>
            <div>
              <p className="text-white font-medium">Optimize Irrigation Schedule</p>
              <p className="text-slate-400 text-sm mt-1">Based on weather forecasts, reducing irrigation by 15% during rainy days could save approximately 2,400L of water weekly.</p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-4 bg-blue-500/10 rounded-lg border border-blue-500/20">
            <div className="p-2 bg-blue-500/20 rounded-lg">
              <Droplets className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <p className="text-white font-medium">Sensor Calibration Recommended</p>
              <p className="text-slate-400 text-sm mt-1">Soil moisture sensors in Zone 3 show deviation of 8%. Calibration scheduled for next week.</p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-4 bg-purple-500/10 rounded-lg border border-purple-500/20">
            <div className="p-2 bg-purple-500/20 rounded-lg">
              <Zap className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <p className="text-white font-medium">Energy Optimization Opportunity</p>
              <p className="text-slate-400 text-sm mt-1">Running pumps during off-peak hours (10 PM - 6 AM) could reduce energy costs by 25%.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
