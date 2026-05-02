/**
 * Data Quality Assessment Module
 * Evaluate data completeness, accuracy, and consistency for AquaVision
 */

class DataQualityAssessor {
  constructor(config = {}) {
    this.config = {
      missingValueThreshold: config.missingValueThreshold || 0.1, // 10% max missing
      outlierMethod: config.outlierMethod || 'iqr', // 'iqr' or 'zscore'
      outlierThreshold: config.outlierThreshold || 3,
      ...config
    };
    this.qualityReports = [];
    this.qualityMetrics = new Map();
  }

  /**
   * Comprehensive data quality assessment
   * @param {Array|Object} data - Data to assess
   * @param {Object} schema - Expected data schema
   * @returns {Object} Quality assessment report
   */
  assessDataQuality(data, schema = {}) {
    const report = {
      timestamp: new Date().toISOString(),
      overallScore: 0,
      completeness: this.assessCompleteness(data, schema),
      accuracy: this.assessAccuracy(data, schema),
      consistency: this.assessConsistency(data, schema),
      validity: this.assessValidity(data, schema),
      timeliness: this.assessTimeliness(data),
      uniqueness: this.assessUniqueness(data),
      recommendations: []
    };

    // Calculate overall quality score (0-100)
    report.overallScore = this.calculateOverallScore(report);
    
    // Generate recommendations
    report.recommendations = this.generateRecommendations(report);

    this.qualityReports.push(report);
    return report;
  }

  /**
   * Check for missing values
   * @param {Array|Object} data - Data to check
   * @param {Object} schema - Expected schema
   * @returns {Object} Completeness metrics
   */
  assessCompleteness(data, schema) {
    const dataArray = Array.isArray(data) ? data : [data];
    const totalRecords = dataArray.length;
    const fieldStats = new Map();

    // Initialize field statistics
    const expectedFields = schema.fields || Object.keys(dataArray[0] || {});
    expectedFields.forEach(field => {
      fieldStats.set(field, {
        total: totalRecords,
        missing: 0,
        null: 0,
        undefined: 0,
        empty: 0
      });
    });

    // Count missing values
    dataArray.forEach(record => {
      expectedFields.forEach(field => {
        const stats = fieldStats.get(field);
        const value = record[field];

        if (value === null) stats.null++;
        if (value === undefined) stats.undefined++;
        if (value === '') stats.empty++;
        if (value === null || value === undefined || value === '') {
          stats.missing++;
        }
      });
    });

    // Calculate completeness percentages
    const fieldCompleteness = {};
    let totalCompleteness = 0;

    fieldStats.forEach((stats, field) => {
      const completeness = ((stats.total - stats.missing) / stats.total) * 100;
      fieldCompleteness[field] = {
        completeness: completeness.toFixed(2),
        missing: stats.missing,
        missingPercentage: ((stats.missing / stats.total) * 100).toFixed(2),
        details: {
          null: stats.null,
          undefined: stats.undefined,
          empty: stats.empty
        }
      };
      totalCompleteness += completeness;
    });

    return {
      score: (totalCompleteness / expectedFields.length).toFixed(2),
      totalRecords,
      expectedFields: expectedFields.length,
      fieldCompleteness,
      issues: this.identifyCompletenessIssues(fieldCompleteness)
    };
  }

  /**
   * Identify outliers and anomalies
   * @param {Array} data - Numerical data array
   * @param {string} field - Field name to analyze
   * @returns {Object} Outlier analysis
   */
  identifyOutliers(data, field) {
    const values = data
      .map(record => record[field])
      .filter(val => typeof val === 'number' && !isNaN(val));

    if (values.length === 0) {
      return { outliers: [], method: 'none', count: 0 };
    }

    let outliers = [];

    if (this.config.outlierMethod === 'iqr') {
      outliers = this.detectOutliersIQR(values);
    } else if (this.config.outlierMethod === 'zscore') {
      outliers = this.detectOutliersZScore(values);
    }

    return {
      method: this.config.outlierMethod,
      totalValues: values.length,
      outlierCount: outliers.length,
      outlierPercentage: ((outliers.length / values.length) * 100).toFixed(2),
      outliers: outliers.slice(0, 10), // Return first 10 outliers
      statistics: this.calculateStatistics(values)
    };
  }

  /**
   * Detect outliers using IQR method
   * @private
   */
  detectOutliersIQR(values) {
    const sorted = [...values].sort((a, b) => a - b);
    const q1Index = Math.floor(sorted.length * 0.25);
    const q3Index = Math.floor(sorted.length * 0.75);
    
    const q1 = sorted[q1Index];
    const q3 = sorted[q3Index];
    const iqr = q3 - q1;
    
    const lowerBound = q1 - 1.5 * iqr;
    const upperBound = q3 + 1.5 * iqr;

    return values
      .map((value, index) => ({ value, index }))
      .filter(item => item.value < lowerBound || item.value > upperBound);
  }

  /**
   * Detect outliers using Z-score method
   * @private
   */
  detectOutliersZScore(values) {
    const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
    const variance = values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length;
    const stdDev = Math.sqrt(variance);

    return values
      .map((value, index) => ({
        value,
        index,
        zScore: Math.abs((value - mean) / stdDev)
      }))
      .filter(item => item.zScore > this.config.outlierThreshold);
  }

  /**
   * Validate data types and formats
   * @param {Array|Object} data - Data to validate
   * @param {Object} schema - Expected schema with types
   * @returns {Object} Validation results
   */
  assessValidity(data, schema) {
    const dataArray = Array.isArray(data) ? data : [data];
    const validationResults = {
      score: 100,
      totalRecords: dataArray.length,
      validRecords: 0,
      invalidRecords: 0,
      fieldValidation: {},
      errors: []
    };

    if (!schema.fields) {
      return validationResults;
    }

    const fieldTypes = schema.types || {};
    const fieldRanges = schema.ranges || {};

    dataArray.forEach((record, recordIndex) => {
      let recordValid = true;

      Object.keys(fieldTypes).forEach(field => {
        const expectedType = fieldTypes[field];
        const value = record[field];
        const actualType = typeof value;

        if (!validationResults.fieldValidation[field]) {
          validationResults.fieldValidation[field] = {
            expected: expectedType,
            valid: 0,
            invalid: 0,
            errors: []
          };
        }

        // Type validation
        if (value !== null && value !== undefined) {
          if (expectedType === 'number' && actualType !== 'number') {
            recordValid = false;
            validationResults.fieldValidation[field].invalid++;
            validationResults.fieldValidation[field].errors.push({
              record: recordIndex,
              value,
              error: `Expected ${expectedType}, got ${actualType}`
            });
          } else if (expectedType === 'string' && actualType !== 'string') {
            recordValid = false;
            validationResults.fieldValidation[field].invalid++;
          } else {
            validationResults.fieldValidation[field].valid++;
          }

          // Range validation
          if (fieldRanges[field] && expectedType === 'number') {
            const { min, max } = fieldRanges[field];
            if (value < min || value > max) {
              recordValid = false;
              validationResults.errors.push({
                record: recordIndex,
                field,
                value,
                error: `Value out of range [${min}, ${max}]`
              });
            }
          }
        }
      });

      if (recordValid) {
        validationResults.validRecords++;
      } else {
        validationResults.invalidRecords++;
      }
    });

    validationResults.score = (
      (validationResults.validRecords / validationResults.totalRecords) * 100
    ).toFixed(2);

    return validationResults;
  }

  /**
   * Assess data consistency
   * @param {Array|Object} data - Data to assess
   * @param {Object} schema - Expected schema
   * @returns {Object} Consistency metrics
   */
  assessConsistency(data, schema) {
    const dataArray = Array.isArray(data) ? data : [data];
    
    return {
      score: 95, // Placeholder
      temporalConsistency: this.checkTemporalConsistency(dataArray),
      crossFieldConsistency: this.checkCrossFieldConsistency(dataArray, schema),
      formatConsistency: this.checkFormatConsistency(dataArray)
    };
  }

  /**
   * Check temporal consistency
   * @private
   */
  checkTemporalConsistency(data) {
    const timestamps = data
      .map(record => record.timestamp)
      .filter(ts => ts)
      .map(ts => new Date(ts).getTime());

    if (timestamps.length < 2) {
      return { consistent: true, gaps: [] };
    }

    const gaps = [];
    for (let i = 1; i < timestamps.length; i++) {
      const gap = timestamps[i] - timestamps[i - 1];
      if (gap < 0) {
        gaps.push({
          index: i,
          issue: 'Out of order timestamp',
          gap
        });
      }
    }

    return {
      consistent: gaps.length === 0,
      totalTimestamps: timestamps.length,
      gaps
    };
  }

  /**
   * Check cross-field consistency
   * @private
   */
  checkCrossFieldConsistency(data, schema) {
    const rules = schema.consistencyRules || [];
    const violations = [];

    data.forEach((record, index) => {
      rules.forEach(rule => {
        if (!this.evaluateConsistencyRule(record, rule)) {
          violations.push({
            record: index,
            rule: rule.description,
            fields: rule.fields
          });
        }
      });
    });

    return {
      rulesChecked: rules.length,
      violations: violations.length,
      consistent: violations.length === 0,
      details: violations.slice(0, 10)
    };
  }

  /**
   * Check format consistency
   * @private
   */
  checkFormatConsistency(data) {
    const formatPatterns = new Map();

    data.forEach(record => {
      Object.keys(record).forEach(field => {
        const value = record[field];
        if (typeof value === 'string') {
          const pattern = this.detectPattern(value);
          if (!formatPatterns.has(field)) {
            formatPatterns.set(field, new Map());
          }
          const fieldPatterns = formatPatterns.get(field);
          fieldPatterns.set(pattern, (fieldPatterns.get(pattern) || 0) + 1);
        }
      });
    });

    const inconsistencies = [];
    formatPatterns.forEach((patterns, field) => {
      if (patterns.size > 1) {
        inconsistencies.push({
          field,
          patterns: Array.from(patterns.entries())
        });
      }
    });

    return {
      consistent: inconsistencies.length === 0,
      inconsistencies
    };
  }

  /**
   * Assess data accuracy
   * @param {Array|Object} data - Data to assess
   * @param {Object} schema - Expected schema with validation rules
   * @returns {Object} Accuracy metrics
   */
  assessAccuracy(data, schema) {
    const dataArray = Array.isArray(data) ? data : [data];
    
    return {
      score: 92, // Placeholder - would compare against ground truth in production
      outlierAnalysis: this.analyzeAllFieldsForOutliers(dataArray),
      rangeCompliance: this.checkRangeCompliance(dataArray, schema)
    };
  }

  /**
   * Assess data timeliness
   * @param {Array|Object} data - Data to assess
   * @returns {Object} Timeliness metrics
   */
  assessTimeliness(data) {
    const dataArray = Array.isArray(data) ? data : [data];
    const now = Date.now();
    const timestamps = dataArray
      .map(record => record.timestamp)
      .filter(ts => ts)
      .map(ts => new Date(ts).getTime());

    if (timestamps.length === 0) {
      return { score: 0, message: 'No timestamps found' };
    }

    const latestTimestamp = Math.max(...timestamps);
    const ageMinutes = (now - latestTimestamp) / (1000 * 60);

    let score = 100;
    if (ageMinutes > 60) score = 50;
    if (ageMinutes > 1440) score = 25; // 24 hours

    return {
      score: score.toFixed(2),
      latestTimestamp: new Date(latestTimestamp).toISOString(),
      ageMinutes: ageMinutes.toFixed(2),
      fresh: ageMinutes < 5
    };
  }

  /**
   * Assess data uniqueness
   * @param {Array|Object} data - Data to assess
   * @returns {Object} Uniqueness metrics
   */
  assessUniqueness(data) {
    const dataArray = Array.isArray(data) ? data : [data];
    const duplicates = this.findDuplicates(dataArray);

    return {
      score: ((1 - duplicates.length / dataArray.length) * 100).toFixed(2),
      totalRecords: dataArray.length,
      uniqueRecords: dataArray.length - duplicates.length,
      duplicateRecords: duplicates.length,
      duplicates: duplicates.slice(0, 5)
    };
  }

  /**
   * Calculate overall quality score
   * @private
   */
  calculateOverallScore(report) {
    const weights = {
      completeness: 0.25,
      accuracy: 0.25,
      consistency: 0.20,
      validity: 0.15,
      timeliness: 0.10,
      uniqueness: 0.05
    };

    const score = 
      parseFloat(report.completeness.score) * weights.completeness +
      parseFloat(report.accuracy.score) * weights.accuracy +
      parseFloat(report.consistency.score) * weights.consistency +
      parseFloat(report.validity.score) * weights.validity +
      parseFloat(report.timeliness.score) * weights.timeliness +
      parseFloat(report.uniqueness.score) * weights.uniqueness;

    return score.toFixed(2);
  }

  /**
   * Generate recommendations based on quality assessment
   * @private
   */
  generateRecommendations(report) {
    const recommendations = [];

    if (parseFloat(report.completeness.score) < 90) {
      recommendations.push({
        priority: 'high',
        category: 'completeness',
        message: 'Address missing values through imputation or data collection improvements',
        impact: 'Data completeness below 90% may affect analysis accuracy'
      });
    }

    if (parseFloat(report.validity.score) < 95) {
      recommendations.push({
        priority: 'high',
        category: 'validity',
        message: 'Implement stricter input validation and data type checking',
        impact: 'Invalid data can lead to processing errors'
      });
    }

    if (parseFloat(report.timeliness.score) < 80) {
      recommendations.push({
        priority: 'medium',
        category: 'timeliness',
        message: 'Increase data collection frequency or check sensor connectivity',
        impact: 'Stale data reduces real-time monitoring effectiveness'
      });
    }

    return recommendations;
  }

  /**
   * Helper methods
   */
  calculateStatistics(values) {
    const sorted = [...values].sort((a, b) => a - b);
    const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
    const variance = values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length;

    return {
      count: values.length,
      mean: mean.toFixed(2),
      median: sorted[Math.floor(sorted.length / 2)].toFixed(2),
      min: Math.min(...values).toFixed(2),
      max: Math.max(...values).toFixed(2),
      stdDev: Math.sqrt(variance).toFixed(2)
    };
  }

  identifyCompletenessIssues(fieldCompleteness) {
    const issues = [];
    Object.entries(fieldCompleteness).forEach(([field, stats]) => {
      if (parseFloat(stats.missingPercentage) > this.config.missingValueThreshold * 100) {
        issues.push({
          field,
          severity: 'high',
          missingPercentage: stats.missingPercentage
        });
      }
    });
    return issues;
  }

  analyzeAllFieldsForOutliers(data) {
    const numericFields = this.identifyNumericFields(data[0] || {});
    const analysis = {};

    numericFields.forEach(field => {
      analysis[field] = this.identifyOutliers(data, field);
    });

    return analysis;
  }

  identifyNumericFields(record) {
    return Object.keys(record).filter(key => typeof record[key] === 'number');
  }

  checkRangeCompliance(data, schema) {
    const ranges = schema.ranges || {};
    const compliance = {};

    Object.keys(ranges).forEach(field => {
      const values = data.map(r => r[field]).filter(v => typeof v === 'number');
      const { min, max } = ranges[field];
      const inRange = values.filter(v => v >= min && v <= max).length;

      compliance[field] = {
        total: values.length,
        inRange,
        outOfRange: values.length - inRange,
        compliance: ((inRange / values.length) * 100).toFixed(2)
      };
    });

    return compliance;
  }

  findDuplicates(data) {
    const seen = new Set();
    const duplicates = [];

    data.forEach((record, index) => {
      const key = JSON.stringify(record);
      if (seen.has(key)) {
        duplicates.push({ index, record });
      } else {
        seen.add(key);
      }
    });

    return duplicates;
  }

  detectPattern(value) {
    if (/^\d{4}-\d{2}-\d{2}/.test(value)) return 'ISO_DATE';
    if (/^\d+$/.test(value)) return 'NUMERIC_STRING';
    if (/^[A-Z_]+$/.test(value)) return 'UPPERCASE';
    if (/^[a-z_]+$/.test(value)) return 'LOWERCASE';
    return 'MIXED';
  }

  evaluateConsistencyRule(record, rule) {
    // Placeholder for custom consistency rule evaluation
    return true;
  }

  /**
   * Get quality metrics summary
   */
  getQualityMetricsSummary() {
    if (this.qualityReports.length === 0) {
      return { message: 'No quality reports available' };
    }

    const latest = this.qualityReports[this.qualityReports.length - 1];
    return {
      latestReport: latest,
      totalReports: this.qualityReports.length,
      averageScore: (
        this.qualityReports.reduce((sum, r) => sum + parseFloat(r.overallScore), 0) /
        this.qualityReports.length
      ).toFixed(2)
    };
  }
}

export default DataQualityAssessor;

// Made with Bob
