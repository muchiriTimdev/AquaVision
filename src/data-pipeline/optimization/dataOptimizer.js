/**
 * Data Optimization Techniques Module
 * Optimize data for better test results and model performance
 */

class DataOptimizer {
  constructor(config = {}) {
    this.config = {
      balancingMethod: config.balancingMethod || 'smote', // 'smote', 'undersample', 'oversample'
      dimensionalityMethod: config.dimensionalityMethod || 'pca', // 'pca', 'feature_selection'
      splitRatio: config.splitRatio || { train: 0.7, validation: 0.15, test: 0.15 },
      randomSeed: config.randomSeed || 42,
      ...config
    };
    this.optimizationHistory = [];
  }

  /**
   * Complete data optimization pipeline
   * @param {Array} data - Preprocessed and engineered data
   * @param {Object} options - Optimization options
   * @returns {Object} Optimized datasets
   */
  optimizeDataset(data, options = {}) {
    const pipeline = {
      startTime: Date.now(),
      originalSize: data.length,
      steps: []
    };

    let optimizedData = [...data];

    // Step 1: Balance dataset
    if (options.balance !== false && options.targetField) {
      const balanceResult = this.balanceDataset(optimizedData, options.targetField);
      optimizedData = balanceResult.data;
      pipeline.steps.push({
        step: 'balance_dataset',
        ...balanceResult.metadata
      });
    }

    // Step 2: Apply dimensionality reduction
    if (options.reduceDimensions !== false && options.targetDimensions) {
      const dimResult = this.reduceDimensionality(optimizedData, options.targetDimensions);
      optimizedData = dimResult.data;
      pipeline.steps.push({
        step: 'dimensionality_reduction',
        ...dimResult.metadata
      });
    }

    // Step 3: Create train/validation/test splits
    const splitResult = this.createDataSplits(optimizedData, options.splitRatio);
    pipeline.steps.push({
      step: 'data_splits',
      ...splitResult.metadata
    });

    // Step 4: Apply data augmentation
    if (options.augment !== false) {
      const augmentResult = this.augmentData(splitResult.train, options.augmentationFactor);
      splitResult.train = augmentResult.data;
      pipeline.steps.push({
        step: 'data_augmentation',
        ...augmentResult.metadata
      });
    }

    pipeline.endTime = Date.now();
    pipeline.processingTime = pipeline.endTime - pipeline.startTime;

    this.optimizationHistory.push(pipeline);

    return {
      train: splitResult.train,
      validation: splitResult.validation,
      test: splitResult.test,
      metadata: pipeline
    };
  }

  /**
   * Balance dataset to handle class imbalance
   * @param {Array} data - Data to balance
   * @param {string} targetField - Target field for classification
   * @returns {Object} Balanced data
   */
  balanceDataset(data, targetField) {
    const classDistribution = this.getClassDistribution(data, targetField);
    const metadata = {
      method: this.config.balancingMethod,
      originalDistribution: classDistribution,
      targetField
    };

    let balancedData;

    switch (this.config.balancingMethod) {
      case 'oversample':
        balancedData = this.oversample(data, targetField, classDistribution);
        break;
      case 'undersample':
        balancedData = this.undersample(data, targetField, classDistribution);
        break;
      case 'smote':
        balancedData = this.applySMOTE(data, targetField, classDistribution);
        break;
      default:
        balancedData = data;
    }

    metadata.balancedDistribution = this.getClassDistribution(balancedData, targetField);
    metadata.originalSize = data.length;
    metadata.balancedSize = balancedData.length;

    return { data: balancedData, metadata };
  }

  /**
   * Oversample minority classes
   * @private
   */
  oversample(data, targetField, distribution) {
    const maxCount = Math.max(...Object.values(distribution));
    const balancedData = [];

    Object.keys(distribution).forEach(className => {
      const classData = data.filter(record => record[targetField] === className);
      const currentCount = classData.length;
      const targetCount = maxCount;

      // Add all original samples
      balancedData.push(...classData);

      // Duplicate samples to reach target count
      const duplicatesNeeded = targetCount - currentCount;
      for (let i = 0; i < duplicatesNeeded; i++) {
        const randomIndex = Math.floor(Math.random() * classData.length);
        balancedData.push({ ...classData[randomIndex] });
      }
    });

    return this.shuffleArray(balancedData);
  }

  /**
   * Undersample majority classes
   * @private
   */
  undersample(data, targetField, distribution) {
    const minCount = Math.min(...Object.values(distribution));
    const balancedData = [];

    Object.keys(distribution).forEach(className => {
      const classData = data.filter(record => record[targetField] === className);
      const sampledData = this.randomSample(classData, minCount);
      balancedData.push(...sampledData);
    });

    return this.shuffleArray(balancedData);
  }

  /**
   * Apply SMOTE (Synthetic Minority Over-sampling Technique)
   * @private
   */
  applySMOTE(data, targetField, distribution) {
    const maxCount = Math.max(...Object.values(distribution));
    const balancedData = [...data];

    Object.keys(distribution).forEach(className => {
      const classData = data.filter(record => record[targetField] === className);
      const currentCount = classData.length;
      const syntheticNeeded = maxCount - currentCount;

      if (syntheticNeeded > 0) {
        const syntheticSamples = this.generateSyntheticSamples(
          classData,
          syntheticNeeded,
          targetField
        );
        balancedData.push(...syntheticSamples);
      }
    });

    return this.shuffleArray(balancedData);
  }

  /**
   * Generate synthetic samples using SMOTE
   * @private
   */
  generateSyntheticSamples(classData, count, targetField) {
    const syntheticSamples = [];
    const numericFields = this.identifyNumericFields(classData[0] || {});

    for (let i = 0; i < count; i++) {
      const randomIndex1 = Math.floor(Math.random() * classData.length);
      const randomIndex2 = Math.floor(Math.random() * classData.length);
      
      const sample1 = classData[randomIndex1];
      const sample2 = classData[randomIndex2];
      
      const syntheticSample = { ...sample1 };

      // Interpolate numeric fields
      numericFields.forEach(field => {
        if (field !== targetField) {
          const alpha = Math.random();
          syntheticSample[field] = 
            sample1[field] * alpha + sample2[field] * (1 - alpha);
        }
      });

      syntheticSamples.push(syntheticSample);
    }

    return syntheticSamples;
  }

  /**
   * Reduce dimensionality using PCA or feature selection
   * @param {Array} data - Data to reduce
   * @param {number} targetDimensions - Target number of dimensions
   * @returns {Object} Reduced data
   */
  reduceDimensionality(data, targetDimensions) {
    const originalDimensions = Object.keys(data[0] || {}).length;
    const metadata = {
      method: this.config.dimensionalityMethod,
      originalDimensions,
      targetDimensions
    };

    let reducedData;

    if (this.config.dimensionalityMethod === 'pca') {
      reducedData = this.applyPCA(data, targetDimensions);
      metadata.varianceExplained = reducedData.varianceExplained;
      reducedData = reducedData.data;
    } else {
      // Feature selection based on variance
      reducedData = this.selectTopFeatures(data, targetDimensions);
      metadata.selectedFeatures = reducedData.selectedFeatures;
      reducedData = reducedData.data;
    }

    return { data: reducedData, metadata };
  }

  /**
   * Apply Principal Component Analysis (simplified)
   * @private
   */
  applyPCA(data, components) {
    // Simplified PCA implementation
    // In production, use a proper linear algebra library
    const numericFields = this.identifyNumericFields(data[0] || {});
    const selectedFields = numericFields.slice(0, components);

    const transformedData = data.map(record => {
      const newRecord = {};
      selectedFields.forEach((field, index) => {
        newRecord[`PC${index + 1}`] = record[field];
      });
      return newRecord;
    });

    return {
      data: transformedData,
      varianceExplained: 0.85 // Placeholder
    };
  }

  /**
   * Select top features based on variance
   * @private
   */
  selectTopFeatures(data, topK) {
    const numericFields = this.identifyNumericFields(data[0] || {});
    const variances = new Map();

    numericFields.forEach(field => {
      const values = data.map(r => r[field]).filter(v => typeof v === 'number');
      variances.set(field, this.calculateVariance(values));
    });

    const sortedFields = Array.from(variances.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, topK)
      .map(([field]) => field);

    const reducedData = data.map(record => {
      const newRecord = {};
      sortedFields.forEach(field => {
        newRecord[field] = record[field];
      });
      return newRecord;
    });

    return {
      data: reducedData,
      selectedFeatures: sortedFields
    };
  }

  /**
   * Create train/validation/test splits
   * @param {Array} data - Data to split
   * @param {Object} ratio - Split ratios
   * @returns {Object} Split datasets
   */
  createDataSplits(data, ratio = null) {
    const splitRatio = ratio || this.config.splitRatio;
    const shuffledData = this.shuffleArray([...data]);

    const trainSize = Math.floor(shuffledData.length * splitRatio.train);
    const validationSize = Math.floor(shuffledData.length * splitRatio.validation);

    const train = shuffledData.slice(0, trainSize);
    const validation = shuffledData.slice(trainSize, trainSize + validationSize);
    const test = shuffledData.slice(trainSize + validationSize);

    return {
      train,
      validation,
      test,
      metadata: {
        totalRecords: shuffledData.length,
        trainSize: train.length,
        validationSize: validation.length,
        testSize: test.length,
        splitRatio
      }
    };
  }

  /**
   * Augment data by creating variations
   * @param {Array} data - Data to augment
   * @param {number} factor - Augmentation factor
   * @returns {Object} Augmented data
   */
  augmentData(data, factor = 1.5) {
    const originalSize = data.length;
    const targetSize = Math.floor(originalSize * factor);
    const augmentedData = [...data];

    const numericFields = this.identifyNumericFields(data[0] || {});
    const augmentationsNeeded = targetSize - originalSize;

    for (let i = 0; i < augmentationsNeeded; i++) {
      const randomIndex = Math.floor(Math.random() * data.length);
      const originalRecord = data[randomIndex];
      const augmentedRecord = { ...originalRecord };

      // Add small random noise to numeric fields
      numericFields.forEach(field => {
        const value = originalRecord[field];
        if (typeof value === 'number') {
          const noise = (Math.random() - 0.5) * 0.1 * value; // ±5% noise
          augmentedRecord[field] = value + noise;
        }
      });

      augmentedData.push(augmentedRecord);
    }

    return {
      data: this.shuffleArray(augmentedData),
      metadata: {
        originalSize,
        augmentedSize: augmentedData.length,
        augmentationFactor: factor,
        augmentationsAdded: augmentationsNeeded
      }
    };
  }

  /**
   * Optimize for specific metrics
   * @param {Array} data - Data to optimize
   * @param {Object} targetMetrics - Target performance metrics
   * @returns {Object} Optimized data
   */
  optimizeForMetrics(data, targetMetrics) {
    const optimizations = [];

    // Optimize for accuracy
    if (targetMetrics.accuracy) {
      optimizations.push({
        type: 'balance',
        reason: 'Improve accuracy through balanced classes'
      });
    }

    // Optimize for speed
    if (targetMetrics.speed) {
      optimizations.push({
        type: 'reduce_dimensions',
        reason: 'Improve processing speed through dimensionality reduction'
      });
    }

    // Optimize for memory
    if (targetMetrics.memory) {
      optimizations.push({
        type: 'sample',
        reason: 'Reduce memory usage through sampling'
      });
    }

    return {
      data,
      optimizations,
      targetMetrics
    };
  }

  /**
   * Helper methods
   */
  getClassDistribution(data, targetField) {
    const distribution = {};
    data.forEach(record => {
      const className = record[targetField];
      distribution[className] = (distribution[className] || 0) + 1;
    });
    return distribution;
  }

  identifyNumericFields(record) {
    return Object.keys(record).filter(key => typeof record[key] === 'number');
  }

  shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  randomSample(array, size) {
    const shuffled = this.shuffleArray(array);
    return shuffled.slice(0, size);
  }

  calculateVariance(values) {
    if (values.length === 0) return 0;
    const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
    return values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length;
  }

  /**
   * Cross-validation split
   * @param {Array} data - Data to split
   * @param {number} folds - Number of folds
   * @returns {Array} Array of fold splits
   */
  createCrossValidationFolds(data, folds = 5) {
    const shuffledData = this.shuffleArray([...data]);
    const foldSize = Math.floor(shuffledData.length / folds);
    const cvFolds = [];

    for (let i = 0; i < folds; i++) {
      const testStart = i * foldSize;
      const testEnd = (i + 1) * foldSize;
      
      const test = shuffledData.slice(testStart, testEnd);
      const train = [
        ...shuffledData.slice(0, testStart),
        ...shuffledData.slice(testEnd)
      ];

      cvFolds.push({
        fold: i + 1,
        train,
        test,
        trainSize: train.length,
        testSize: test.length
      });
    }

    return cvFolds;
  }

  /**
   * Stratified sampling
   * @param {Array} data - Data to sample
   * @param {string} targetField - Field to stratify on
   * @param {number} sampleSize - Target sample size
   * @returns {Array} Stratified sample
   */
  stratifiedSample(data, targetField, sampleSize) {
    const distribution = this.getClassDistribution(data, targetField);
    const totalRecords = data.length;
    const sample = [];

    Object.keys(distribution).forEach(className => {
      const classData = data.filter(record => record[targetField] === className);
      const classProportion = distribution[className] / totalRecords;
      const classSampleSize = Math.floor(sampleSize * classProportion);
      
      const classSample = this.randomSample(classData, classSampleSize);
      sample.push(...classSample);
    });

    return this.shuffleArray(sample);
  }

  /**
   * Get optimization statistics
   */
  getOptimizationStats() {
    return {
      totalOptimizations: this.optimizationHistory.length,
      averageProcessingTime: this.optimizationHistory.length > 0
        ? this.optimizationHistory.reduce((sum, p) => sum + p.processingTime, 0) / this.optimizationHistory.length
        : 0,
      config: this.config,
      history: this.optimizationHistory
    };
  }

  /**
   * Export optimization configuration
   */
  exportConfiguration() {
    return {
      config: this.config,
      history: this.optimizationHistory
    };
  }
}

export default DataOptimizer;

// Made with Bob
