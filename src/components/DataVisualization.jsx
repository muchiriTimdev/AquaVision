import React, { useState } from 'react';
import { 
  BarChart3, 
  LineChart, 
  PieChart, 
  TrendingUp, 
  Download, 
  Settings,
  Eye,
  Layers,
  Maximize2
} from 'lucide-react';
import { 
  LineChart as RechartsLineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  PieChart as RechartsPieChart, 
  Pie, 
  Cell,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from 'recharts';
import { generateSensorData, exportToCSV, formatWithSIUnit } from '../utils/dataExport';

const DataVisualization = () => {
  const [selectedChartType, setSelectedChartType] = useState('line');
  const [selectedMetric, setSelectedMetric] = useState('waterLevel');
  const [timeRange, setTimeRange] = useState('24h');
  const [showSI, setShowSI] = useState(false);

  const chartTypes = [
    { id: 'line', label: 'Line Chart', icon: LineChart, description: 'Time-series data' },
    { id: 'area', label: 'Area Chart', icon: Layers, description: 'Cumulative data' },
    { id: 'bar', label: 'Bar Chart', icon: BarChart3, description: 'Categorical comparison' },
    { id: 'radar', label: 'Radar Chart', icon: Eye, description: 'Multi-dimensional' },
  ];

  const metrics = [
    { id: 'waterLevel', label: 'Water Level', unit: '%', color: '#38bdf8' },
    { id: 'flowRate', label: 'Flow Rate', unit: 'L/min', color: '#22c55e' },
    { id: 'temperature', label: 'Temperature', unit: '°C', color: '#f97316' },
    { id: 'pressure', label: 'Pressure', unit: 'bar', color: '#a855f7' },
    { id: 'soilMoisture', label: 'Soil Moisture', unit: '%', color: '#06b6d4' },
  ];

  const timeRanges = [
    { id: '1h', label: '1 Hour', points: 60 },
    { id: '6h', label: '6 Hours', points: 360 },
    { id: '24h', label: '24 Hours', points: 1440 },
    { id: '7d', label: '7 Days', points: 10080 },
  ];

  // Generate chart data
  const generateChartData = (metric, range) => {
    const points = timeRanges.find(r => r.id === range)?.points || 1440;
    const data = generateSensorData(metric, Math.min(points, 100)); // Limit to 100 points for performance
    return data.map((d, i) => ({
      index: i,
      time: new Date(d.timestamp).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      value: d.value,
      siValue: d.siValue,
      label: showSI ? formatWithSIUnit(d.value, metric, true) : `${d.value} ${d.unit}`
    }));
  };

  const chartData = generateChartData(selectedMetric, timeRange);

  // Generate comparison data for bar chart
  const generateComparisonData = () => {
    return metrics.map(metric => ({
      name: metric.label,
      value: Math.random() * 100,
      siValue: Math.random() * 100,
      color: metric.color
    }));
  };

  const comparisonData = generateComparisonData();

  // Generate radar data
  const generateRadarData = () => {
    return metrics.map(metric => ({
      parameter: metric.label,
      value: 50 + Math.random() * 50,
      fullMark: 100
    }));
  };

  const radarData = generateRadarData();

  const ChartComponent = () => {
    switch (selectedChartType) {
      case 'line':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <RechartsLineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="time" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }}
                labelStyle={{ color: '#94a3b8' }}
                formatter={(value) => [value, selectedMetric]}
              />
              <Line 
                type="monotone" 
                dataKey="value" 
                stroke={metrics.find(m => m.id === selectedMetric)?.color || '#38bdf8'} 
                strokeWidth={2}
                dot={false}
                name={metrics.find(m => m.id === selectedMetric)?.label}
              />
            </RechartsLineChart>
          </ResponsiveContainer>
        );

      case 'area':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <AreaChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="time" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }}
                labelStyle={{ color: '#94a3b8' }}
              />
              <Area 
                type="monotone" 
                dataKey="value" 
                stroke={metrics.find(m => m.id === selectedMetric)?.color || '#38bdf8'} 
                fill={metrics.find(m => m.id === selectedMetric)?.color || '#38bdf8'} 
                fillOpacity={0.3}
              />
            </AreaChart>
          </ResponsiveContainer>
        );

      case 'bar':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={comparisonData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="name" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }}
                labelStyle={{ color: '#94a3b8' }}
              />
              <Bar dataKey="value" fill="#38bdf8">
                {comparisonData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        );

      case 'radar':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="#334155" />
              <PolarAngleAxis dataKey="parameter" stroke="#94a3b8" />
              <PolarRadiusAxis angle={90} domain={[0, 100]} stroke="#94a3b8" />
              <Radar 
                name="Current" 
                dataKey="value" 
                stroke="#38bdf8" 
                fill="#38bdf8" 
                fillOpacity={0.3} 
              />
            </RadarChart>
          </ResponsiveContainer>
        );

      default:
        return null;
    }
  };

  const handleExportChart = () => {
    const data = selectedChartType === 'bar' ? comparisonData : chartData;
    exportToCSV(data, `aquavision_chart_${selectedChartType}_${selectedMetric}.csv`, {
      module: 'Data Visualization',
      description: `${selectedChartType} chart data for ${selectedMetric}`,
      chartType: selectedChartType,
      metric: selectedMetric,
      timeRange: timeRange
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-purple-500/20 rounded-lg">
            <BarChart3 className="w-6 h-6 text-purple-400" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Data Visualization Tools</h2>
            <p className="text-slate-400 text-sm">Interactive charts for data analysis and export</p>
          </div>
        </div>

        {/* Controls */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Chart Type */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Chart Type</label>
            <select
              value={selectedChartType}
              onChange={(e) => setSelectedChartType(e.target.value)}
              className="w-full bg-slate-700 text-white px-3 py-2 rounded-lg border border-slate-600 focus:outline-none focus:border-blue-500"
            >
              {chartTypes.map(type => (
                <option key={type.id} value={type.id}>{type.label}</option>
              ))}
            </select>
          </div>

          {/* Metric Selection */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Metric</label>
            <select
              value={selectedMetric}
              onChange={(e) => setSelectedMetric(e.target.value)}
              className="w-full bg-slate-700 text-white px-3 py-2 rounded-lg border border-slate-600 focus:outline-none focus:border-blue-500"
            >
              {metrics.map(metric => (
                <option key={metric.id} value={metric.id}>{metric.label} ({metric.unit})</option>
              ))}
            </select>
          </div>

          {/* Time Range */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Time Range</label>
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="w-full bg-slate-700 text-white px-3 py-2 rounded-lg border border-slate-600 focus:outline-none focus:border-blue-500"
            >
              {timeRanges.map(range => (
                <option key={range.id} value={range.id}>{range.label}</option>
              ))}
            </select>
          </div>

          {/* SI Units Toggle */}
          <div>
            <label className="flex items-center gap-3 cursor-pointer h-full">
              <input
                type="checkbox"
                checked={showSI}
                onChange={(e) => setShowSI(e.target.checked)}
                className="w-5 h-5 rounded bg-slate-700 border-slate-600 text-blue-500 focus:ring-blue-500 focus:ring-offset-slate-900"
              />
              <div>
                <span className="text-white font-medium">Show SI Units</span>
                <p className="text-slate-400 text-xs">Include SI base units</p>
              </div>
            </label>
          </div>
        </div>
      </div>

      {/* Chart Display */}
      <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-white">
              {chartTypes.find(t => t.id === selectedChartType)?.label}
            </h3>
            <p className="text-slate-400 text-sm">
              {metrics.find(m => m.id === selectedMetric)?.label} - {timeRanges.find(r => r.id === timeRange)?.label}
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleExportChart}
              className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm"
            >
              <Download className="w-4 h-4" />
              Export Data
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition-colors text-sm">
              <Maximize2 className="w-4 h-4" />
              Fullscreen
            </button>
          </div>
        </div>

        <ChartComponent />
      </div>

      {/* Chart Type Descriptions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {chartTypes.map((type) => {
          const Icon = type.icon;
          return (
            <div
              key={type.id}
              onClick={() => setSelectedChartType(type.id)}
              className={`p-4 rounded-lg cursor-pointer transition-all ${
                selectedChartType === type.id
                  ? 'bg-blue-600/20 border-2 border-blue-500/30'
                  : 'bg-slate-800/50 border border-slate-700/50 hover:border-blue-500/30'
              }`}
            >
              <div className="flex items-center gap-3 mb-2">
                <Icon className={`w-5 h-5 ${selectedChartType === type.id ? 'text-blue-400' : 'text-slate-400'}`} />
                <span className="text-white font-medium">{type.label}</span>
              </div>
              <p className="text-slate-400 text-sm">{type.description}</p>
            </div>
          );
        })}
      </div>

      {/* Data Table */}
      <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">Data Table</h3>
          <span className="text-slate-400 text-sm">{chartData.length} data points</span>
        </div>
        <div className="overflow-x-auto max-h-64">
          <table className="w-full text-sm">
            <thead className="sticky top-0 bg-slate-800">
              <tr className="border-b border-slate-700">
                <th className="text-left text-slate-400 font-medium py-2 px-4">Index</th>
                <th className="text-left text-slate-400 font-medium py-2 px-4">Time</th>
                <th className="text-left text-slate-400 font-medium py-2 px-4">Value</th>
                {showSI && <th className="text-left text-slate-400 font-medium py-2 px-4">SI Value</th>}
              </tr>
            </thead>
            <tbody>
              {chartData.slice(0, 20).map((row, index) => (
                <tr key={index} className="border-b border-slate-700/50">
                  <td className="text-white py-2 px-4">{row.index}</td>
                  <td className="text-slate-400 py-2 px-4">{row.time}</td>
                  <td className="text-blue-400 py-2 px-4 font-mono">{row.value}</td>
                  {showSI && <td className="text-purple-400 py-2 px-4 font-mono">{row.siValue}</td>}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {chartData.length > 20 && (
          <p className="text-slate-500 text-sm mt-2 text-center">
            Showing first 20 of {chartData.length} data points. Export to view all.
          </p>
        )}
      </div>

      {/* Visualization Tips */}
      <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 bg-green-500/20 rounded-lg">
            <Eye className="w-6 h-6 text-green-400" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">Visualization Tips</h3>
            <p className="text-slate-400 text-sm">Best practices for data visualization</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-slate-700/30 rounded-lg">
            <h4 className="text-white font-medium mb-2">Line Charts</h4>
            <p className="text-slate-400 text-sm">Best for time-series data showing trends over time. Use for monitoring sensor values continuously.</p>
          </div>
          <div className="p-4 bg-slate-700/30 rounded-lg">
            <h4 className="text-white font-medium mb-2">Area Charts</h4>
            <p className="text-slate-400 text-sm">Ideal for showing cumulative data or volume. Great for water consumption over time.</p>
          </div>
          <div className="p-4 bg-slate-700/30 rounded-lg">
            <h4 className="text-white font-medium mb-2">Bar Charts</h4>
            <p className="text-slate-400 text-sm">Perfect for comparing categories. Use for comparing different zones or sensor types.</p>
          </div>
          <div className="p-4 bg-slate-700/30 rounded-lg">
            <h4 className="text-white font-medium mb-2">Radar Charts</h4>
            <p className="text-slate-400 text-sm">Excellent for multi-dimensional comparison. Use for overall system health assessment.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataVisualization;
