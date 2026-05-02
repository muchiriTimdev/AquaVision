/**
 * Data Export Utility for AquaVision
 * Handles data export to various formats with proper SI units and metadata
 */

// SI Units Reference
const SI_UNITS = {
  waterLevel: { unit: '%', description: 'Percentage', siBase: 'dimensionless' },
  flowRate: { unit: 'L/min', description: 'Liters per minute', siBase: 'm³/s', conversion: 1.6667e-5 },
  temperature: { unit: '°C', description: 'Degrees Celsius', siBase: 'K', conversion: 273.15 },
  pressure: { unit: 'bar', description: 'Bar', siBase: 'Pa', conversion: 100000 },
  soilMoisture: { unit: '%', description: 'Volumetric water content', siBase: 'dimensionless' },
  ph: { unit: 'pH', description: 'pH level', siBase: 'dimensionless' },
  turbidity: { unit: 'NTU', description: 'Nephelometric Turbidity Units', siBase: 'dimensionless' },
  dissolvedOxygen: { unit: 'mg/L', description: 'Milligrams per liter', siBase: 'kg/m³', conversion: 0.001 },
  conductivity: { unit: 'µS/cm', description: 'Microsiemens per centimeter', siBase: 'S/m', conversion: 0.0001 },
  tds: { unit: 'ppm', description: 'Parts per million', siBase: 'mg/L', conversion: 1 },
  yield: { unit: 't/ha', description: 'Tons per hectare', siBase: 'kg/m²', conversion: 0.1 },
  voltage: { unit: 'V', description: 'Volts', siBase: 'V' },
  current: { unit: 'A', description: 'Amperes', siBase: 'A' },
  power: { unit: 'W', description: 'Watts', siBase: 'W' },
  energy: { unit: 'kWh', description: 'Kilowatt-hours', siBase: 'J', conversion: 3600000 },
};

/**
 * Convert value to SI base unit
 * @param {number} value - Value to convert
 * @param {string} unitType - Type of unit (key from SI_UNITS)
 * @returns {number} Value in SI base unit
 */
export const convertToSI = (value, unitType) => {
  const unitInfo = SI_UNITS[unitType];
  if (!unitInfo || !unitInfo.conversion) return value;
  
  if (unitType === 'temperature') {
    return value + unitInfo.conversion; // °C to K
  }
  return value * unitInfo.conversion;
};

/**
 * Validate SI unit value
 * @param {number} value - Value to validate
 * @param {string} unitType - Type of unit
 * @returns {Object} Validation result with isValid and message
 */
export const validateSIUnit = (value, unitType) => {
  const ranges = {
    waterLevel: { min: 0, max: 100 },
    flowRate: { min: 0, max: 200 },
    temperature: { min: -20, max: 50 },
    pressure: { min: 0, max: 10 },
    soilMoisture: { min: 0, max: 100 },
    ph: { min: 0, max: 14 },
    turbidity: { min: 0, max: 1000 },
    dissolvedOxygen: { min: 0, max: 20 },
    conductivity: { min: 0, max: 5000 },
    tds: { min: 0, max: 5000 },
    yield: { min: 0, max: 50 },
    voltage: { min: 0, max: 240 },
    current: { min: 0, max: 100 },
    power: { min: 0, max: 10000 },
    energy: { min: 0, max: 100000 },
  };

  const range = ranges[unitType];
  if (!range) {
    return { isValid: true, message: 'No validation range defined' };
  }

  if (value < range.min || value > range.max) {
    return {
      isValid: false,
      message: `Value ${value} is outside valid range [${range.min}, ${range.max}] for ${unitType}`
    };
  }

  return { isValid: true, message: 'Valid' };
};

/**
 * Generate export filename with timestamp
 * @param {string} module - Module name
 * @param {string} format - File format
 * @returns {string} Formatted filename
 */
export const generateFilename = (module, format) => {
  const now = new Date();
  const date = now.toISOString().split('T')[0];
  const time = now.toTimeString().split(' ')[0].replace(/:/g, '-');
  return `aquavision_${module}_${date}_${time}.${format}`;
};

/**
 * Export data to CSV format
 * @param {Array} data - Array of data objects
 * @param {string} filename - Output filename
 * @param {Object} metadata - Metadata to include
 */
export const exportToCSV = (data, filename, metadata = {}) => {
  if (!data || data.length === 0) {
    console.error('No data to export');
    return;
  }

  // Add metadata as comments at the top
  let csvContent = '# AquaVision Data Export\n';
  csvContent += `# Export Date: ${new Date().toISOString()}\n`;
  csvContent += `# Module: ${metadata.module || 'Unknown'}\n`;
  csvContent += `# Data Points: ${data.length}\n`;
  if (metadata.description) {
    csvContent += `# Description: ${metadata.description}\n`;
  }
  csvContent += '#\n';

  // Get headers from first data object
  const headers = Object.keys(data[0]);
  csvContent += headers.join(',') + '\n';

  // Add data rows
  data.forEach(row => {
    const values = headers.map(header => {
      const value = row[header];
      // Handle different data types
      if (typeof value === 'string' && value.includes(',')) {
        return `"${value}"`;
      }
      return value !== null && value !== undefined ? value : '';
    });
    csvContent += values.join(',') + '\n';
  });

  // Create and download file
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = filename || generateFilename('data', 'csv');
  link.click();
  URL.revokeObjectURL(link.href);

  console.log(`Data exported to: ${filename || generateFilename('data', 'csv')}`);
  return filename || generateFilename('data', 'csv');
};

/**
 * Export data to JSON format
 * @param {Object} data - Data object
 * @param {string} filename - Output filename
 * @param {Object} metadata - Metadata to include
 */
export const exportToJSON = (data, filename, metadata = {}) => {
  const exportData = {
    metadata: {
      exportDate: new Date().toISOString(),
      module: metadata.module || 'Unknown',
      description: metadata.description || '',
      version: '1.0.0',
      ...metadata
    },
    data: data
  };

  const jsonContent = JSON.stringify(exportData, null, 2);
  const blob = new Blob([jsonContent], { type: 'application/json;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = filename || generateFilename('data', 'json');
  link.click();
  URL.revokeObjectURL(link.href);

  console.log(`Data exported to: ${filename || generateFilename('data', 'json')}`);
  return filename || generateFilename('data', 'json');
};

/**
 * Print data to console with formatting
 * @param {Array} data - Data array to print
 * @param {string} title - Title for the output
 * @param {Object} options - Output options
 */
export const printDataToConsole = (data, title, options = {}) => {
  const {
    includeMetadata = true,
    format = 'table',
    siUnits = true
  } = options;

  console.log('\n' + '='.repeat(80));
  console.log(`AquaVision Data Export: ${title}`);
  console.log('='.repeat(80));

  if (includeMetadata) {
    console.log(`\n[Metadata]`);
    console.log(`  Export Date: ${new Date().toISOString()}`);
    console.log(`  Data Points: ${data.length}`);
    console.log(`  SI Units: ${siUnits ? 'Enabled' : 'Disabled'}`);
  }

  console.log(`\n[Data]`);
  
  if (format === 'table' && data.length > 0) {
    console.table(data);
  } else {
    console.log(JSON.stringify(data, null, 2));
  }

  console.log('\n' + '='.repeat(80) + '\n');
};

/**
 * Write data to a specific file path (simulated - browser limitation)
 * In a real Node.js environment, this would use fs.writeFile
 * @param {string} filePath - File path to write to
 * @param {string} content - Content to write
 * @param {string} format - File format
 */
export const writeToFile = (filePath, content, format = 'txt') => {
  // Browser limitation: Cannot write to arbitrary file paths
  // This is a simulation that logs the file path and content
  console.log('\n[FILE WRITE SIMULATION]');
  console.log(`File Path: ${filePath}`);
  console.log(`Format: ${format}`);
  console.log(`Content Length: ${content.length} characters`);
  console.log(`Timestamp: ${new Date().toISOString()}`);
  console.log('\n[CONTENT]');
  console.log(content);
  console.log('[END OF CONTENT]\n');

  // In a real implementation with Node.js:
  // const fs = require('fs');
  // fs.writeFileSync(filePath, content, 'utf8');
  
  return {
    success: true,
    filePath,
    message: 'Data logged to console (browser limitation - use export functions for file download)'
  };
};

/**
 * Generate sensor data for testing/export
 * @param {string} sensorType - Type of sensor
 * @param {number} count - Number of data points
 * @returns {Array} Generated sensor data
 */
export const generateSensorData = (sensorType, count = 100) => {
  const data = [];
  const now = new Date();
  
  for (let i = 0; i < count; i++) {
    const timestamp = new Date(now - (count - i) * 60000); // 1-minute intervals
    
    let value;
    const unitInfo = SI_UNITS[sensorType];
    
    switch (sensorType) {
      case 'waterLevel':
        value = 50 + Math.random() * 40;
        break;
      case 'flowRate':
        value = 20 + Math.random() * 60;
        break;
      case 'temperature':
        value = 20 + Math.random() * 10;
        break;
      case 'pressure':
        value = 2 + Math.random() * 2;
        break;
      case 'soilMoisture':
        value = 30 + Math.random() * 40;
        break;
      case 'ph':
        value = 6.0 + Math.random() * 2;
        break;
      case 'turbidity':
        value = 1 + Math.random() * 4;
        break;
      case 'dissolvedOxygen':
        value = 6 + Math.random() * 4;
        break;
      case 'conductivity':
        value = 200 + Math.random() * 300;
        break;
      case 'tds':
        value = 150 + Math.random() * 350;
        break;
      default:
        value = Math.random() * 100;
    }

    data.push({
      timestamp: timestamp.toISOString(),
      value: parseFloat(value.toFixed(2)),
      unit: unitInfo ? unitInfo.unit : 'unknown',
      sensorType,
      siValue: parseFloat(convertToSI(value, sensorType).toFixed(4)),
      siUnit: unitInfo ? unitInfo.siBase : 'unknown'
    });
  }

  return data;
};

/**
 * Export all sensor data with SI units
 * @param {Object} sensorData - Object with sensor types as keys
 * @param {string} format - Export format ('csv', 'json')
 */
export const exportAllSensorData = (sensorData, format = 'csv') => {
  const allData = [];
  
  Object.keys(sensorData).forEach(sensorType => {
    const data = sensorData[sensorType];
    if (data) {
      allData.push(...data);
    }
  });

  const filename = generateFilename('all_sensors', format);
  
  if (format === 'csv') {
    return exportToCSV(allData, filename, {
      module: 'All Sensors',
      description: 'Complete sensor data export with SI units'
    });
  } else {
    return exportToJSON(allData, filename, {
      module: 'All Sensors',
      description: 'Complete sensor data export with SI units'
    });
  }
};

/**
 * Get SI unit information
 * @param {string} unitType - Type of unit
 * @returns {Object} Unit information
 */
export const getSIUnitInfo = (unitType) => {
  return SI_UNITS[unitType] || null;
};

/**
 * Format value with SI unit
 * @param {number} value - Value to format
 * @param {string} unitType - Type of unit
 * @param {boolean} includeSI - Include SI base unit
 * @returns {string} Formatted value
 */
export const formatWithSIUnit = (value, unitType, includeSI = false) => {
  const unitInfo = SI_UNITS[unitType];
  if (!unitInfo) {
    return `${value}`;
  }

  const formatted = `${value} ${unitInfo.unit}`;
  
  if (includeSI && unitInfo.conversion) {
    const siValue = convertToSI(value, unitType);
    return `${formatted} (${siValue.toFixed(4)} ${unitInfo.siBase})`;
  }

  return formatted;
};
