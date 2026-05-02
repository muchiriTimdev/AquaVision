import React, { useState } from 'react';
import { Download, FileText, Database, Save, Printer, CheckCircle, AlertCircle } from 'lucide-react';
import { 
  exportToCSV, 
  exportToJSON, 
  generateSensorData,
  exportAllSensorData,
  writeToFile,
  printDataToConsole,
  formatWithSIUnit,
  getSIUnitInfo
} from '../utils/dataExport';

const DataExport = () => {
  const [selectedModule, setSelectedModule] = useState('dashboard');
  const [selectedFormat, setSelectedFormat] = useState('csv');
  const [dateRange, setDateRange] = useState('week');
  const [includeSI, setIncludeSI] = useState(true);
  const [exportStatus, setExportStatus] = useState(null);

  const modules = [
    { id: 'dashboard', label: 'Dashboard', icon: FileText },
    { id: 'sensors', label: 'Sensor Data', icon: Database },
    { id: 'irrigation', label: 'Irrigation', icon: FileText },
    { id: 'quality', label: 'Water Quality', icon: Database },
    { id: 'analytics', label: 'Analytics', icon: FileText },
  ];

  const formats = [
    { id: 'csv', label: 'CSV', description: 'Comma Separated Values' },
    { id: 'json', label: 'JSON', description: 'JavaScript Object Notation' },
  ];

  const dateRanges = [
    { id: 'day', label: 'Today', points: 144 },
    { id: 'week', label: 'This Week', points: 1008 },
    { id: 'month', label: 'This Month', points: 4320 },
  ];

  const handleExport = () => {
    try {
      // Generate sample data based on selected module
      const dataPoints = dateRanges.find(r => r.id === dateRange)?.points || 100;
      let data;

      switch (selectedModule) {
        case 'sensors':
          data = {
            waterLevel: generateSensorData('waterLevel', dataPoints),
            flowRate: generateSensorData('flowRate', dataPoints),
            temperature: generateSensorData('temperature', dataPoints),
            soilMoisture: generateSensorData('soilMoisture', dataPoints),
          };
          break;
        case 'quality':
          data = {
            ph: generateSensorData('ph', dataPoints),
            turbidity: generateSensorData('turbidity', dataPoints),
            dissolvedOxygen: generateSensorData('dissolvedOxygen', dataPoints),
            conductivity: generateSensorData('conductivity', dataPoints),
          };
          break;
        default:
          data = {
            waterLevel: generateSensorData('waterLevel', dataPoints),
            flowRate: generateSensorData('flowRate', dataPoints),
          };
      }

      // Export based on format
      const filename = `aquavision_${selectedModule}_${dateRange}_${new Date().toISOString().split('T')[0]}`;
      
      if (selectedFormat === 'csv') {
        // Flatten data for CSV
        const flatData = Object.values(data).flat();
        exportToCSV(flatData, `${filename}.csv`, {
          module: selectedModule,
          description: `Export for ${selectedModule} - ${dateRange}`,
          includeSIUnits: includeSI
        });
      } else {
        exportAllSensorData(data, 'json');
      }

      // Also print to console as requested
      const flatData = Object.values(data).flat();
      printDataToConsole(flatData, `${selectedModule} - ${dateRange}`, {
        includeMetadata: true,
        format: 'table',
        siUnits: includeSI
      });

      // Write to simulated file path
      writeToFile(
        `/exports/aquavision_${selectedModule}_${dateRange}.txt`,
        JSON.stringify(flatData, null, 2),
        'txt'
      );

      setExportStatus({
        type: 'success',
        message: `Data exported successfully to ${filename}.${selectedFormat}`
      });

      setTimeout(() => setExportStatus(null), 5000);
    } catch (error) {
      setExportStatus({
        type: 'error',
        message: `Export failed: ${error.message}`
      });
      setTimeout(() => setExportStatus(null), 5000);
    }
  };

  const SIUnitReference = () => {
    const units = [
      { name: 'Water Level', unit: '%', siBase: 'dimensionless', range: '0-100' },
      { name: 'Flow Rate', unit: 'L/min', siBase: 'm³/s', conversion: '1.6667e-5' },
      { name: 'Temperature', unit: '°C', siBase: 'K', conversion: '+273.15' },
      { name: 'Pressure', unit: 'bar', siBase: 'Pa', conversion: '×100,000' },
      { name: 'Soil Moisture', unit: '%', siBase: 'dimensionless', range: '0-100' },
      { name: 'pH', unit: 'pH', siBase: 'dimensionless', range: '0-14' },
      { name: 'Turbidity', unit: 'NTU', siBase: 'dimensionless', range: '0-1000' },
      { name: 'Dissolved Oxygen', unit: 'mg/L', siBase: 'kg/m³', conversion: '×0.001' },
      { name: 'Conductivity', unit: 'µS/cm', siBase: 'S/m', conversion: '×0.0001' },
      { name: 'TDS', unit: 'ppm', siBase: 'mg/L', conversion: '×1' },
    ];

    return (
      <div className="mt-6">
        <h3 className="text-lg font-semibold text-white mb-4">SI Units Reference</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-700">
                <th className="text-left text-slate-400 font-medium py-3 px-4">Parameter</th>
                <th className="text-left text-slate-400 font-medium py-3 px-4">Unit</th>
                <th className="text-left text-slate-400 font-medium py-3 px-4">SI Base Unit</th>
                <th className="text-left text-slate-400 font-medium py-3 px-4">Conversion</th>
                <th className="text-left text-slate-400 font-medium py-3 px-4">Valid Range</th>
              </tr>
            </thead>
            <tbody>
              {units.map((unit, index) => (
                <tr key={index} className="border-b border-slate-700/50">
                  <td className="text-white py-3 px-4">{unit.name}</td>
                  <td className="text-blue-400 py-3 px-4 font-mono">{unit.unit}</td>
                  <td className="text-slate-400 py-3 px-4 font-mono">{unit.siBase}</td>
                  <td className="text-slate-400 py-3 px-4 font-mono">{unit.conversion}</td>
                  <td className="text-slate-400 py-3 px-4">{unit.range}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Export Configuration */}
      <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-blue-500/20 rounded-lg">
            <Download className="w-6 h-6 text-blue-400" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Data Export</h2>
            <p className="text-slate-400 text-sm">Export system data with SI units and metadata</p>
          </div>
        </div>

        {/* Status Message */}
        {exportStatus && (
          <div className={`mb-6 p-4 rounded-lg flex items-center gap-3 ${
            exportStatus.type === 'success' 
              ? 'bg-green-500/10 border border-green-500/20' 
              : 'bg-red-500/10 border border-red-500/20'
          }`}>
            {exportStatus.type === 'success' ? (
              <CheckCircle className="w-5 h-5 text-green-400" />
            ) : (
              <AlertCircle className="w-5 h-5 text-red-400" />
            )}
            <span className={`font-medium ${
              exportStatus.type === 'success' ? 'text-green-400' : 'text-red-400'
            }`}>
              {exportStatus.message}
            </span>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Module Selection */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Select Module
            </label>
            <div className="space-y-2">
              {modules.map((module) => {
                const Icon = module.icon;
                return (
                  <button
                    key={module.id}
                    onClick={() => setSelectedModule(module.id)}
                    className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all ${
                      selectedModule === module.id
                        ? 'bg-blue-600/20 text-white border border-blue-500/30'
                        : 'bg-slate-700/30 text-slate-400 hover:bg-slate-700/50'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{module.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Format Selection */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Select Format
            </label>
            <div className="space-y-2">
              {formats.map((format) => (
                <button
                  key={format.id}
                  onClick={() => setSelectedFormat(format.id)}
                  className={`w-full p-3 rounded-lg transition-all ${
                    selectedFormat === format.id
                      ? 'bg-blue-600/20 text-white border border-blue-500/30'
                      : 'bg-slate-700/30 text-slate-400 hover:bg-slate-700/50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{format.label}</span>
                    <span className="text-xs text-slate-500">{format.description}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Date Range Selection */}
        <div className="mt-6">
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Date Range
          </label>
          <div className="flex gap-2">
            {dateRanges.map((range) => (
              <button
                key={range.id}
                onClick={() => setDateRange(range.id)}
                className={`flex-1 p-3 rounded-lg transition-all ${
                  dateRange === range.id
                    ? 'bg-blue-600/20 text-white border border-blue-500/30'
                    : 'bg-slate-700/30 text-slate-400 hover:bg-slate-700/50'
                }`}
              >
                <div className="text-sm font-medium">{range.label}</div>
                <div className="text-xs text-slate-500">{range.points} data points</div>
              </button>
            ))}
          </div>
        </div>

        {/* Options */}
        <div className="mt-6">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={includeSI}
              onChange={(e) => setIncludeSI(e.target.checked)}
              className="w-5 h-5 rounded bg-slate-700 border-slate-600 text-blue-500 focus:ring-blue-500 focus:ring-offset-slate-900"
            />
            <div>
              <span className="text-white font-medium">Include SI Base Units</span>
              <p className="text-slate-400 text-sm">Add SI base unit conversions to export</p>
            </div>
          </label>
        </div>

        {/* Export Button */}
        <div className="mt-6 flex gap-3">
          <button
            onClick={handleExport}
            className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium"
          >
            <Download className="w-5 h-5" />
            Export Data
          </button>
          <button
            onClick={handleExport}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition-colors font-medium"
          >
            <Printer className="w-5 h-5" />
            Print to Console
          </button>
        </div>
      </div>

      {/* SI Units Reference */}
      <SIUnitReference />

      {/* File Output Information */}
      <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 bg-purple-500/20 rounded-lg">
            <Save className="w-6 h-6 text-purple-400" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">File Output Information</h3>
            <p className="text-slate-400 text-sm">Data is exported to multiple locations</p>
          </div>
        </div>

        <div className="space-y-3">
          <div className="p-4 bg-slate-700/30 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="w-5 h-5 text-green-400" />
              <span className="text-white font-medium">Browser Download</span>
            </div>
            <p className="text-slate-400 text-sm ml-7">
              File downloaded to browser default download folder with filename:
              <code className="ml-2 px-2 py-1 bg-slate-600 rounded text-xs">
                aquavision_[module]_[date].[format]
              </code>
            </p>
          </div>

          <div className="p-4 bg-slate-700/30 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="w-5 h-5 text-green-400" />
              <span className="text-white font-medium">Console Output</span>
            </div>
            <p className="text-slate-400 text-sm ml-7">
              Data printed to browser console (F12 → Console) with full metadata and SI units
            </p>
          </div>

          <div className="p-4 bg-slate-700/30 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <AlertCircle className="w-5 h-5 text-yellow-400" />
              <span className="text-white font-medium">Simulated File Path</span>
            </div>
            <p className="text-slate-400 text-sm ml-7">
              Due to browser security restrictions, direct file system access is simulated.
              In a Node.js environment, data would be written to:
              <code className="ml-2 px-2 py-1 bg-slate-600 rounded text-xs">
                /exports/aquavision_[module]_[date].txt
              </code>
            </p>
          </div>
        </div>
      </div>

      {/* Data Validation */}
      <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50">
        <h3 className="text-lg font-semibold text-white mb-4">Data Validation</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-green-500/10 rounded-lg border border-green-500/20">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="w-5 h-5 text-green-400" />
              <span className="text-white font-medium">Range Validation</span>
            </div>
            <p className="text-slate-400 text-sm">
              All values validated against acceptable ranges for each parameter type
            </p>
          </div>
          <div className="p-4 bg-green-500/10 rounded-lg border border-green-500/20">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="w-5 h-5 text-green-400" />
              <span className="text-white font-medium">SI Unit Conversion</span>
            </div>
            <p className="text-slate-400 text-sm">
              Automatic conversion to SI base units with conversion factors
            </p>
          </div>
          <div className="p-4 bg-green-500/10 rounded-lg border border-green-500/20">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="w-5 h-5 text-green-400" />
              <span className="text-white font-medium">Metadata Inclusion</span>
            </div>
            <p className="text-slate-400 text-sm">
              Timestamps, sensor IDs, locations, and units included in all exports
            </p>
          </div>
          <div className="p-4 bg-green-500/10 rounded-lg border border-green-500/20">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="w-5 h-5 text-green-400" />
              <span className="text-white font-medium">Data Integrity</span>
            </div>
            <p className="text-slate-400 text-sm">
              Completeness checks and error handling for all export operations
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataExport;
