/**
 * Data Preprocessing and Cleaning Module
 * Clean and transform data for optimal performance in AquaVision
 */

class DataPreprocessor {
  constructor(config = {}) {
    this.config = {
      missingValueStrategy: config.missingValueStrategy || 'mean', // 'mean', 'median', 'mode', 'forward_fill', 'remove'
      outlierHandling: config.outlierHandling || 'cap', // 'cap', 'remove', 'transform'
      normalizationMethod: config.normalizationMethod || 'minmax', // 'minmax', 'zscore', 'robust'
      encodingMethod: config.encodingMethod || 'onehot', // 'onehot', 'label', 'target'
      ...config
    };
    this.preprocessingHistory = [];
    this.transformations = new Map();
  }

  /**
   * Complete preprocessing pipeline
   * @param {Array} data - Raw data to preprocess
   * @param {Object} options - Preprocessing options
   * @returns {Object} Preprocessed data and metadata
   */
  preprocessData(data, options = {}) {
    const pipeline = {
      startTime: Date.now(),
      originalSize: data.length,
      steps: []
    };

    let processedData = [...data];

    // Step 1: Handle missing values
    if (options.handleMissing !== false) {
      const missingResult = this.handleMissingValues(processedData, options.missingStrategy);
      processedData = missingResult.data;
      pipeline.steps.push({
        step: 'handle_missing',
        ...missingResult.metadata
      });
    }

    // Step 2: Remove duplicates
    if (options.removeDuplicates !== false) {
      const duplicateResult = this.removeDuplicates(processedData);
      processedData = duplicateResult.data;
      pipeline.steps.push({
        step: 'remove_duplicates',
        ...duplicateResult.metadata
      });
    }

    // Step 3: Handle outliers
    if (options.handleOutliers !== false) {
      const outlierResult = this.handleOutliers(processedData, options.outlierFields);
      processedData = outlierResult.data;
      pipeline.steps.push({
        step: 'handle_outliers',
        ...outlierResult.metadata
      });
    }

    // Step 4: Normalize numerical features
    if (options.normalize !== false) {
      const normalizeResult = this.normalizeFeatures(processedData, options.normalizeFields);
      processedData = normalizeResult.data;
      pipeline.steps.push({
        step: 'normalize',
        ...normalizeResult.metadata
      });
    }

    // Step 5: Encode categorical variables
    if (options.encode !== false && options.categoricalFields) {
      const encodeResult = this.encodeCategorical(processedData, options.categoricalFields);
      processedData = encodeResult.data;
      pipeline.steps.push({
        step: 'encode_categorical',
        ...encodeResult.metadata
      });
    }

    // Step 6: Data type conversion
    if (options.convertTypes !== false) {
      const typeResult = this.convertDataTypes(processedData, options.typeSchema);
      processedData = typeResult.data;
      pipeline.steps.push({
        step: 'convert_types',
        ...typeResult.metadata
      });
    }

    pipeline.endTime = Date.now();
    pipeline.processingTime = pipeline.endTime - pipeline.startTime;
    pipeline.finalSize = processedData.length;
    pipeline.recordsRemoved = pipeline.originalSize - pipeline.finalSize;

    this.preprocessingHistory.push(pipeline);

    return {
      data: processedData,
      metadata: pipeline,
      transformations: Object.fromEntries(this.transformations)
    };
  }

  /**
   * Handle missing values using various strategies
   * @param {Array} data - Data with potential missing values
   * @param {string} strategy - Strategy to use
   * @returns {Object} Data with handled missing values
   */
  handleMissingValues(data, strategy = null) {
    const usedStrategy = strategy || this.config.missingValueStrategy;
    const metadata = {
      strategy: usedStrategy,
      fieldsProcessed: [],
      valuesImputed: 0
    };

    const processedData = data.map(record => {
      const newRecord = { ...record };
      
      Object.keys(record).forEach(field => {
        const value = record[field];
        
        if (value === null || value === undefined || value === '') {
          metadata.valuesImputed++;
          
          if (!metadata.fieldsProcessed.includes(field)) {
            metadata.fieldsProcessed.push(field);
          }

          // Apply imputation strategy
          switch (usedStrategy) {
            case 'mean':
              newRecord[field] = this.calculateMean(data, field);
              break;
            case 'median':
              newRecord[field] = this.calculateMedian(data, field);
              break;
            case 'mode':
              newRecord[field] = this.calculateMode(data, field);
              break;
            case 'forward_fill':
              newRecord[field] = this.forwardFill(data, field, record);
              break;
            case 'zero':
              newRecord[field] = 0;
              break;
            default:
              newRecord[field] = null;
          }
        }
      });

      return newRecord;
    });

    // Remove records if strategy is 'remove'
    const finalData = usedStrategy === 'remove' 
      ? processedData.filter(record => 
          Object.values(record).every(val => val !== null && val !== undefined && val !== '')
        )
      : processedData;

    metadata.recordsRemoved = processedData.length - finalData.length;

    return { data: finalData, metadata };
  }

  /**
   * Remove duplicate records
   * @param {Array} data - Data to deduplicate
   * @returns {Object} Deduplicated data
   */
  removeDuplicates(data) {
    const seen = new Set();
    const uniqueData = [];
    let duplicatesFound = 0;

    data.forEach(record => {
      const key = JSON.stringify(record);
      if (!seen.has(key)) {
        seen.add(key);
        uniqueData.push(record);
      } else {
        duplicatesFound++;
      }
    });

    return {
      data: uniqueData,
      metadata: {
        originalCount: data.length,
        uniqueCount: uniqueData.length,
        duplicatesRemoved: duplicatesFound
      }
    };
  }

  /**
   * Handle outliers in numerical fields
   * @param {Array} data - Data with potential outliers
   * @param {Array} fields - Fields to check for outliers
   * @returns {Object} Data with handled outliers
   */
  handleOutliers(data, fields = null) {
    const numericFields = fields || this.identifyNumericFields(data[0] || {});
    const metadata = {
      method: this.config.outlierHandling,
      fieldsProcessed: numericFields,
      outliersHandled: 0
    };

    let processedData = [...data];

    numericFields.forEach(field => {
      const values = data.map(r => r[field]).filter(v => typeof v === 'number');
      const { lowerBound, upperBound } = this.calculateOutlierBounds(values);

      this.transformations.set(`${field}_outlier_bounds`, { lowerBound, upperBound });

      processedData = processedData.map(record => {
        const value = record[field];
        
        if (typeof value === 'number') {
          if (value < lowerBound || value > upperBound) {
            metadata.outliersHandled++;

            switch (this.config.outlierHandling) {
              case 'cap':
                return {
                  ...record,
                  [field]: value < lowerBound ? lowerBound : upperBound
                };
              case 'remove':
                return null; // Will be filtered out
              case 'transform':
                return {
                  ...record,
                  [field]: Math.log(Math.abs(value) + 1) * Math.sign(value)
                };
              default:
                return record;
            }
          }
        }
        return record;
      }).filter(r => r !== null);
    });

    return { data: processedData, metadata };
  }

  /**
   * Normalize numerical features
   * @param {Array} data - Data to normalize
   * @param {Array} fields - Fields to normalize
   * @returns {Object} Normalized data
   */
  normalizeFeatures(data, fields = null) {
    const numericFields = fields || this.identifyNumericFields(data[0] || {});
    const metadata = {
      method: this.config.normalizationMethod,
      fieldsNormalized: numericFields,
      scalingFactors: {}
    };

    const processedData = [...data];

    numericFields.forEach(field => {
      const values = data.map(r => r[field]).filter(v => typeof v === 'number');
      
      if (values.length === 0) return;

      let scalingParams;

      switch (this.config.normalizationMethod) {
        case 'minmax':
          scalingParams = this.calculateMinMaxParams(values);
          break;
        case 'zscore':
          scalingParams = this.calculateZScoreParams(values);
          break;
        case 'robust':
          scalingParams = this.calculateRobustParams(values);
          break;
        default:
          scalingParams = this.calculateMinMaxParams(values);
      }

      this.transformations.set(`${field}_scaling`, scalingParams);
      metadata.scalingFactors[field] = scalingParams;

      processedData.forEach(record => {
        if (typeof record[field] === 'number') {
          record[field] = this.applyNormalization(
            record[field],
            scalingParams,
            this.config.normalizationMethod
          );
        }
      });
    });

    return { data: processedData, metadata };
  }

  /**
   * Encode categorical variables
   * @param {Array} data - Data with categorical variables
   * @param {Array} fields - Categorical fields to encode
   * @returns {Object} Encoded data
   */
  encodeCategorical(data, fields) {
    const metadata = {
      method: this.config.encodingMethod,
      fieldsEncoded: fields,
      encodingMaps: {}
    };

    let processedData = [...data];

    fields.forEach(field => {
      const uniqueValues = [...new Set(data.map(r => r[field]))];
      
      switch (this.config.encodingMethod) {
        case 'onehot':
          processedData = this.oneHotEncode(processedData, field, uniqueValues);
          metadata.encodingMaps[field] = { type: 'onehot', values: uniqueValues };
          break;
        case 'label':
          const labelMap = this.createLabelMap(uniqueValues);
          processedData = this.labelEncode(processedData, field, labelMap);
          metadata.encodingMaps[field] = { type: 'label', map: labelMap };
          break;
        default:
          break;
      }

      this.transformations.set(`${field}_encoding`, metadata.encodingMaps[field]);
    });

    return { data: processedData, metadata };
  }

  /**
   * Convert data types according to schema
   * @param {Array} data - Data to convert
   * @param {Object} typeSchema - Schema defining expected types
   * @returns {Object} Data with converted types
   */
  convertDataTypes(data, typeSchema = {}) {
    const metadata = {
      conversions: [],
      errors: []
    };

    const processedData = data.map((record, index) => {
      const newRecord = { ...record };

      Object.keys(typeSchema).forEach(field => {
        const targetType = typeSchema[field];
        const value = record[field];

        try {
          switch (targetType) {
            case 'number':
              newRecord[field] = this.toNumber(value);
              break;
            case 'string':
              newRecord[field] = String(value);
              break;
            case 'boolean':
              newRecord[field] = Boolean(value);
              break;
            case 'date':
              newRecord[field] = new Date(value).toISOString();
              break;
            default:
              break;
          }
          
          if (value !== newRecord[field]) {
            metadata.conversions.push({ record: index, field, from: value, to: newRecord[field] });
          }
        } catch (error) {
          metadata.errors.push({ record: index, field, error: error.message });
        }
      });

      return newRecord;
    });

    return { data: processedData, metadata };
  }

  /**
   * Helper methods for calculations
   */
  calculateMean(data, field) {
    const values = data.map(r => r[field]).filter(v => typeof v === 'number');
    return values.length > 0 ? values.reduce((sum, val) => sum + val, 0) / values.length : 0;
  }

  calculateMedian(data, field) {
    const values = data.map(r => r[field]).filter(v => typeof v === 'number').sort((a, b) => a - b);
    if (values.length === 0) return 0;
    const mid = Math.floor(values.length / 2);
    return values.length % 2 === 0 ? (values[mid - 1] + values[mid]) / 2 : values[mid];
  }

  calculateMode(data, field) {
    const values = data.map(r => r[field]).filter(v => v !== null && v !== undefined);
    const frequency = {};
    let maxFreq = 0;
    let mode = null;

    values.forEach(val => {
      frequency[val] = (frequency[val] || 0) + 1;
      if (frequency[val] > maxFreq) {
        maxFreq = frequency[val];
        mode = val;
      }
    });

    return mode;
  }

  forwardFill(data, field, currentRecord) {
    const currentIndex = data.indexOf(currentRecord);
    for (let i = currentIndex - 1; i >= 0; i--) {
      if (data[i][field] !== null && data[i][field] !== undefined) {
        return data[i][field];
      }
    }
    return null;
  }

  identifyNumericFields(record) {
    return Object.keys(record).filter(key => typeof record[key] === 'number');
  }

  calculateOutlierBounds(values) {
    const sorted = [...values].sort((a, b) => a - b);
    const q1 = sorted[Math.floor(sorted.length * 0.25)];
    const q3 = sorted[Math.floor(sorted.length * 0.75)];
    const iqr = q3 - q1;

    return {
      lowerBound: q1 - 1.5 * iqr,
      upperBound: q3 + 1.5 * iqr
    };
  }

  calculateMinMaxParams(values) {
    return {
      min: Math.min(...values),
      max: Math.max(...values)
    };
  }

  calculateZScoreParams(values) {
    const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
    const variance = values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length;
    
    return {
      mean,
      stdDev: Math.sqrt(variance)
    };
  }

  calculateRobustParams(values) {
    const sorted = [...values].sort((a, b) => a - b);
    const median = sorted[Math.floor(sorted.length / 2)];
    const q1 = sorted[Math.floor(sorted.length * 0.25)];
    const q3 = sorted[Math.floor(sorted.length * 0.75)];

    return {
      median,
      iqr: q3 - q1
    };
  }

  applyNormalization(value, params, method) {
    switch (method) {
      case 'minmax':
        return (value - params.min) / (params.max - params.min);
      case 'zscore':
        return (value - params.mean) / params.stdDev;
      case 'robust':
        return (value - params.median) / params.iqr;
      default:
        return value;
    }
  }

  oneHotEncode(data, field, uniqueValues) {
    return data.map(record => {
      const newRecord = { ...record };
      uniqueValues.forEach(value => {
        newRecord[`${field}_${value}`] = record[field] === value ? 1 : 0;
      });
      delete newRecord[field];
      return newRecord;
    });
  }

  createLabelMap(uniqueValues) {
    const map = {};
    uniqueValues.forEach((value, index) => {
      map[value] = index;
    });
    return map;
  }

  labelEncode(data, field, labelMap) {
    return data.map(record => ({
      ...record,
      [field]: labelMap[record[field]] !== undefined ? labelMap[record[field]] : -1
    }));
  }

  toNumber(value) {
    if (typeof value === 'number') return value;
    const num = parseFloat(value);
    if (isNaN(num)) throw new Error(`Cannot convert ${value} to number`);
    return num;
  }

  /**
   * Get preprocessing statistics
   */
  getPreprocessingStats() {
    return {
      totalPipelines: this.preprocessingHistory.length,
      averageProcessingTime: this.preprocessingHistory.length > 0
        ? this.preprocessingHistory.reduce((sum, p) => sum + p.processingTime, 0) / this.preprocessingHistory.length
        : 0,
      totalRecordsProcessed: this.preprocessingHistory.reduce((sum, p) => sum + p.originalSize, 0),
      transformations: Object.fromEntries(this.transformations)
    };
  }

  /**
   * Export preprocessing configuration
   */
  exportConfiguration() {
    return {
      config: this.config,
      transformations: Object.fromEntries(this.transformations),
      history: this.preprocessingHistory
    };
  }

  /**
   * Import preprocessing configuration
   */
  importConfiguration(config) {
    this.config = { ...this.config, ...config.config };
    this.transformations = new Map(Object.entries(config.transformations || {}));
  }
}

export default DataPreprocessor;

// Made with Bob
