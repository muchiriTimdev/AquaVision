/**
 * Feature Engineering Module
 * Create meaningful features to improve model performance for AquaVision
 */

class FeatureEngineer {
  constructor(config = {}) {
    this.config = {
      timeWindowSizes: config.timeWindowSizes || [5, 10, 30, 60], // minutes
      aggregationMethods: config.aggregationMethods || ['mean', 'max', 'min', 'std'],
      polynomialDegree: config.polynomialDegree || 2,
      ...config
    };
    this.engineeredFeatures = new Map();
    this.featureImportance = new Map();
  }

  /**
   * Complete feature engineering pipeline
   * @param {Array} data - Preprocessed data
   * @param {Object} options - Feature engineering options
   * @returns {Object} Data with engineered features
   */
  engineerFeatures(data, options = {}) {
    const pipeline = {
      startTime: Date.now(),
      originalFeatureCount: Object.keys(data[0] || {}).length,
      steps: []
    };

    let enrichedData = [...data];

    // Step 1: Time-based features
    if (options.timeFeatures !== false) {
      const timeResult = this.createTimeFeatures(enrichedData);
      enrichedData = timeResult.data;
      pipeline.steps.push({
        step: 'time_features',
        featuresAdded: timeResult.featuresAdded
      });
    }

    // Step 2: Rolling window features
    if (options.rollingFeatures !== false) {
      const rollingResult = this.createRollingFeatures(enrichedData, options.rollingFields);
      enrichedData = rollingResult.data;
      pipeline.steps.push({
        step: 'rolling_features',
        featuresAdded: rollingResult.featuresAdded
      });
    }

    // Step 3: Interaction features
    if (options.interactionFeatures !== false && options.interactionPairs) {
      const interactionResult = this.createInteractionFeatures(enrichedData, options.interactionPairs);
      enrichedData = interactionResult.data;
      pipeline.steps.push({
        step: 'interaction_features',
        featuresAdded: interactionResult.featuresAdded
      });
    }

    // Step 4: Polynomial features
    if (options.polynomialFeatures !== false && options.polynomialFields) {
      const polyResult = this.createPolynomialFeatures(enrichedData, options.polynomialFields);
      enrichedData = polyResult.data;
      pipeline.steps.push({
        step: 'polynomial_features',
        featuresAdded: polyResult.featuresAdded
      });
    }

    // Step 5: Domain-specific features
    if (options.domainFeatures !== false) {
      const domainResult = this.createDomainFeatures(enrichedData);
      enrichedData = domainResult.data;
      pipeline.steps.push({
        step: 'domain_features',
        featuresAdded: domainResult.featuresAdded
      });
    }

    // Step 6: Statistical features
    if (options.statisticalFeatures !== false) {
      const statsResult = this.createStatisticalFeatures(enrichedData, options.statsFields);
      enrichedData = statsResult.data;
      pipeline.steps.push({
        step: 'statistical_features',
        featuresAdded: statsResult.featuresAdded
      });
    }

    pipeline.endTime = Date.now();
    pipeline.processingTime = pipeline.endTime - pipeline.startTime;
    pipeline.finalFeatureCount = Object.keys(enrichedData[0] || {}).length;
    pipeline.totalFeaturesAdded = pipeline.finalFeatureCount - pipeline.originalFeatureCount;

    return {
      data: enrichedData,
      metadata: pipeline,
      featureList: Object.keys(enrichedData[0] || {})
    };
  }

  /**
   * Create time-based features from timestamps
   * @param {Array} data - Data with timestamp field
   * @returns {Object} Data with time features
   */
  createTimeFeatures(data) {
    const featuresAdded = [];

    const enrichedData = data.map(record => {
      if (!record.timestamp) return record;

      const date = new Date(record.timestamp);
      const newFeatures = {
        hour: date.getHours(),
        dayOfWeek: date.getDay(),
        dayOfMonth: date.getDate(),
        month: date.getMonth() + 1,
        quarter: Math.floor(date.getMonth() / 3) + 1,
        isWeekend: date.getDay() === 0 || date.getDay() === 6 ? 1 : 0,
        isBusinessHours: date.getHours() >= 8 && date.getHours() < 17 ? 1 : 0,
        timeOfDay: this.getTimeOfDay(date.getHours())
      };

      if (featuresAdded.length === 0) {
        featuresAdded.push(...Object.keys(newFeatures));
      }

      return { ...record, ...newFeatures };
    });

    return { data: enrichedData, featuresAdded };
  }

  /**
   * Create rolling window features
   * @param {Array} data - Time-series data
   * @param {Array} fields - Fields to create rolling features for
   * @returns {Object} Data with rolling features
   */
  createRollingFeatures(data, fields = null) {
    const numericFields = fields || this.identifyNumericFields(data[0] || {});
    const featuresAdded = [];

    const enrichedData = data.map((record, index) => {
      const newFeatures = {};

      this.config.timeWindowSizes.forEach(windowSize => {
        numericFields.forEach(field => {
          const windowData = this.getWindowData(data, index, windowSize, field);

          this.config.aggregationMethods.forEach(method => {
            const featureName = `${field}_${method}_${windowSize}`;
            newFeatures[featureName] = this.calculateAggregation(windowData, method);
            
            if (index === 0) {
              featuresAdded.push(featureName);
            }
          });
        });
      });

      return { ...record, ...newFeatures };
    });

    return { data: enrichedData, featuresAdded };
  }

  /**
   * Create interaction features between field pairs
   * @param {Array} data - Data to create interactions from
   * @param {Array} pairs - Pairs of fields to interact
   * @returns {Object} Data with interaction features
   */
  createInteractionFeatures(data, pairs) {
    const featuresAdded = [];

    const enrichedData = data.map(record => {
      const newFeatures = {};

      pairs.forEach(([field1, field2]) => {
        const val1 = record[field1];
        const val2 = record[field2];

        if (typeof val1 === 'number' && typeof val2 === 'number') {
          // Multiplication
          const multiplyName = `${field1}_x_${field2}`;
          newFeatures[multiplyName] = val1 * val2;

          // Division (with safety check)
          if (val2 !== 0) {
            const divideName = `${field1}_div_${field2}`;
            newFeatures[divideName] = val1 / val2;
          }

          // Addition
          const addName = `${field1}_plus_${field2}`;
          newFeatures[addName] = val1 + val2;

          // Difference
          const diffName = `${field1}_minus_${field2}`;
          newFeatures[diffName] = val1 - val2;

          if (featuresAdded.length === 0) {
            featuresAdded.push(multiplyName, divideName, addName, diffName);
          }
        }
      });

      return { ...record, ...newFeatures };
    });

    return { data: enrichedData, featuresAdded };
  }

  /**
   * Create polynomial features
   * @param {Array} data - Data to create polynomial features from
   * @param {Array} fields - Fields to create polynomial features for
   * @returns {Object} Data with polynomial features
   */
  createPolynomialFeatures(data, fields) {
    const featuresAdded = [];

    const enrichedData = data.map(record => {
      const newFeatures = {};

      fields.forEach(field => {
        const value = record[field];

        if (typeof value === 'number') {
          for (let degree = 2; degree <= this.config.polynomialDegree; degree++) {
            const featureName = `${field}_pow${degree}`;
            newFeatures[featureName] = Math.pow(value, degree);

            if (featuresAdded.length < fields.length * (this.config.polynomialDegree - 1)) {
              featuresAdded.push(featureName);
            }
          }

          // Square root
          if (value >= 0) {
            const sqrtName = `${field}_sqrt`;
            newFeatures[sqrtName] = Math.sqrt(value);
            if (!featuresAdded.includes(sqrtName)) {
              featuresAdded.push(sqrtName);
            }
          }

          // Logarithm
          if (value > 0) {
            const logName = `${field}_log`;
            newFeatures[logName] = Math.log(value);
            if (!featuresAdded.includes(logName)) {
              featuresAdded.push(logName);
            }
          }
        }
      });

      return { ...record, ...newFeatures };
    });

    return { data: enrichedData, featuresAdded };
  }

  /**
   * Create domain-specific features for water management
   * @param {Array} data - Data to create domain features from
   * @returns {Object} Data with domain-specific features
   */
  createDomainFeatures(data) {
    const featuresAdded = [];

    const enrichedData = data.map(record => {
      const newFeatures = {};

      // Water efficiency metrics
      if (record.flowRate && record.waterLevel) {
        newFeatures.efficiency_ratio = record.flowRate / (record.waterLevel + 1);
        featuresAdded.push('efficiency_ratio');
      }

      // Soil moisture status
      if (record.soilMoisture !== undefined) {
        newFeatures.moisture_status = this.getMoistureStatus(record.soilMoisture);
        newFeatures.irrigation_needed = record.soilMoisture < 40 ? 1 : 0;
        featuresAdded.push('moisture_status', 'irrigation_needed');
      }

      // Water quality index
      if (record.ph && record.turbidity && record.dissolvedOxygen) {
        newFeatures.water_quality_index = this.calculateWaterQualityIndex(
          record.ph,
          record.turbidity,
          record.dissolvedOxygen
        );
        featuresAdded.push('water_quality_index');
      }

      // Temperature anomaly
      if (record.temperature !== undefined) {
        const normalTemp = 25; // Normal temperature baseline
        newFeatures.temp_anomaly = Math.abs(record.temperature - normalTemp);
        newFeatures.temp_category = this.getTemperatureCategory(record.temperature);
        featuresAdded.push('temp_anomaly', 'temp_category');
      }

      // Pressure status
      if (record.pressure !== undefined) {
        newFeatures.pressure_status = this.getPressureStatus(record.pressure);
        featuresAdded.push('pressure_status');
      }

      // Flow rate category
      if (record.flowRate !== undefined) {
        newFeatures.flow_category = this.getFlowCategory(record.flowRate);
        featuresAdded.push('flow_category');
      }

      return { ...record, ...newFeatures };
    });

    return { data: enrichedData, featuresAdded: [...new Set(featuresAdded)] };
  }

  /**
   * Create statistical features
   * @param {Array} data - Data to create statistical features from
   * @param {Array} fields - Fields to create statistical features for
   * @returns {Object} Data with statistical features
   */
  createStatisticalFeatures(data, fields = null) {
    const numericFields = fields || this.identifyNumericFields(data[0] || {});
    const featuresAdded = [];

    // Calculate global statistics
    const globalStats = {};
    numericFields.forEach(field => {
      const values = data.map(r => r[field]).filter(v => typeof v === 'number');
      globalStats[field] = {
        mean: this.calculateMean(values),
        std: this.calculateStd(values),
        median: this.calculateMedian(values)
      };
    });

    const enrichedData = data.map(record => {
      const newFeatures = {};

      numericFields.forEach(field => {
        const value = record[field];
        const stats = globalStats[field];

        if (typeof value === 'number' && stats) {
          // Z-score
          const zScoreName = `${field}_zscore`;
          newFeatures[zScoreName] = (value - stats.mean) / (stats.std || 1);

          // Deviation from median
          const medianDevName = `${field}_median_dev`;
          newFeatures[medianDevName] = value - stats.median;

          if (featuresAdded.length < numericFields.length * 2) {
            featuresAdded.push(zScoreName, medianDevName);
          }
        }
      });

      return { ...record, ...newFeatures };
    });

    return { data: enrichedData, featuresAdded };
  }

  /**
   * Perform feature selection
   * @param {Array} data - Data with features
   * @param {Object} target - Target variable information
   * @param {number} topK - Number of top features to select
   * @returns {Object} Selected features and importance scores
   */
  selectFeatures(data, target, topK = 10) {
    const features = Object.keys(data[0] || {}).filter(key => key !== target.field);
    const importanceScores = new Map();

    // Calculate correlation-based importance
    features.forEach(feature => {
      const correlation = this.calculateCorrelation(data, feature, target.field);
      importanceScores.set(feature, Math.abs(correlation));
    });

    // Sort by importance
    const sortedFeatures = Array.from(importanceScores.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, topK);

    this.featureImportance = new Map(sortedFeatures);

    return {
      selectedFeatures: sortedFeatures.map(([feature]) => feature),
      importanceScores: Object.fromEntries(sortedFeatures),
      totalFeatures: features.length
    };
  }

  /**
   * Helper methods
   */
  getTimeOfDay(hour) {
    if (hour >= 6 && hour < 12) return 'morning';
    if (hour >= 12 && hour < 18) return 'afternoon';
    if (hour >= 18 && hour < 22) return 'evening';
    return 'night';
  }

  identifyNumericFields(record) {
    return Object.keys(record).filter(key => typeof record[key] === 'number');
  }

  getWindowData(data, currentIndex, windowSize, field) {
    const startIndex = Math.max(0, currentIndex - windowSize);
    return data
      .slice(startIndex, currentIndex + 1)
      .map(r => r[field])
      .filter(v => typeof v === 'number');
  }

  calculateAggregation(values, method) {
    if (values.length === 0) return 0;

    switch (method) {
      case 'mean':
        return values.reduce((sum, val) => sum + val, 0) / values.length;
      case 'max':
        return Math.max(...values);
      case 'min':
        return Math.min(...values);
      case 'std':
        return this.calculateStd(values);
      case 'sum':
        return values.reduce((sum, val) => sum + val, 0);
      default:
        return 0;
    }
  }

  calculateMean(values) {
    return values.length > 0 ? values.reduce((sum, val) => sum + val, 0) / values.length : 0;
  }

  calculateStd(values) {
    if (values.length === 0) return 0;
    const mean = this.calculateMean(values);
    const variance = values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length;
    return Math.sqrt(variance);
  }

  calculateMedian(values) {
    if (values.length === 0) return 0;
    const sorted = [...values].sort((a, b) => a - b);
    const mid = Math.floor(sorted.length / 2);
    return sorted.length % 2 === 0 ? (sorted[mid - 1] + sorted[mid]) / 2 : sorted[mid];
  }

  calculateCorrelation(data, feature1, feature2) {
    const values1 = data.map(r => r[feature1]).filter(v => typeof v === 'number');
    const values2 = data.map(r => r[feature2]).filter(v => typeof v === 'number');

    if (values1.length !== values2.length || values1.length === 0) return 0;

    const mean1 = this.calculateMean(values1);
    const mean2 = this.calculateMean(values2);
    const std1 = this.calculateStd(values1);
    const std2 = this.calculateStd(values2);

    if (std1 === 0 || std2 === 0) return 0;

    let correlation = 0;
    for (let i = 0; i < values1.length; i++) {
      correlation += (values1[i] - mean1) * (values2[i] - mean2);
    }

    return correlation / (values1.length * std1 * std2);
  }

  getMoistureStatus(moisture) {
    if (moisture < 30) return 'dry';
    if (moisture < 60) return 'optimal';
    return 'wet';
  }

  calculateWaterQualityIndex(ph, turbidity, dissolvedOxygen) {
    // Simplified water quality index calculation
    const phScore = Math.max(0, 100 - Math.abs(ph - 7) * 10);
    const turbidityScore = Math.max(0, 100 - turbidity * 2);
    const doScore = Math.min(100, dissolvedOxygen * 10);

    return (phScore + turbidityScore + doScore) / 3;
  }

  getTemperatureCategory(temp) {
    if (temp < 15) return 'cold';
    if (temp < 25) return 'moderate';
    if (temp < 35) return 'warm';
    return 'hot';
  }

  getPressureStatus(pressure) {
    if (pressure < 2) return 'low';
    if (pressure < 4) return 'normal';
    return 'high';
  }

  getFlowCategory(flowRate) {
    if (flowRate < 20) return 'low';
    if (flowRate < 50) return 'normal';
    return 'high';
  }

  /**
   * Get feature engineering statistics
   */
  getFeatureStats() {
    return {
      engineeredFeatures: Object.fromEntries(this.engineeredFeatures),
      featureImportance: Object.fromEntries(this.featureImportance),
      config: this.config
    };
  }
}

export default FeatureEngineer;

// Made with Bob
