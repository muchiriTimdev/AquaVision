/**
 * AquaVision Data Pipeline - Main Integration Module
 * Complete data acquisition and optimization system
 */

import DataCollector from './acquisition/dataCollector.js';
import DataQualityAssessor from './quality/dataQualityAssessor.js';
import DataPreprocessor from './preprocessing/dataPreprocessor.js';
import FeatureEngineer from './optimization/featureEngineer.js';
import DataOptimizer from './optimization/dataOptimizer.js';
import BackendDatasetSetup from './backend/backendSetup.js';
import DataTester from './testing/dataTester.js';
import PerformanceMonitor from './monitoring/performanceMonitor.js';

class AquaVisionDataPipeline {
  constructor(config = {}) {
    this.collector = new DataCollector(config.collector);
    this.qualityAssessor = new DataQualityAssessor(config.quality);
    this.preprocessor = new DataPreprocessor(config.preprocessing);
    this.featureEngineer = new FeatureEngineer(config.features);
    this.optimizer = new DataOptimizer(config.optimization);
    this.backend = new BackendDatasetSetup(config.backend);
    this.tester = new DataTester(config.testing);
    this.monitor = new PerformanceMonitor(config.monitoring);
  }

  async runCompletePipeline(sourceId, options = {}) {
    this.monitor.startMonitoring();
    const startTime = Date.now();

    try {
      // Step 1: Collect
      const rawData = await this.collector.collectFromAPI(sourceId);
      
      // Step 2: Assess Quality
      const quality = this.qualityAssessor.assessDataQuality(rawData.data);
      this.monitor.trackDataQuality(quality);
      
      // Step 3: Preprocess
      const preprocessed = this.preprocessor.preprocessData(rawData.data, options.preprocessing);
      
      // Step 4: Engineer Features
      const engineered = this.featureEngineer.engineerFeatures(preprocessed.data, options.features);
      
      // Step 5: Optimize
      const optimized = this.optimizer.optimizeDataset(engineered.data, options.optimization);
      
      // Step 6: Test
      const tests = await this.tester.runDataPipelineTests(this, rawData.data);
      
      return {
        data: optimized,
        quality,
        tests,
        duration: Date.now() - startTime,
        metrics: this.monitor.getRealTimeMetrics()
      };
    } catch (error) {
      this.monitor.createAlert({
        severity: 'critical',
        type: 'pipeline_error',
        message: error.message
      });
      throw error;
    }
  }

  getStatus() {
    return {
      backend: this.backend.getSetupStatus(),
      monitoring: this.monitor.getMonitoringStats(),
      testing: this.tester.getTestSummary()
    };
  }
}

export default AquaVisionDataPipeline;
export {
  DataCollector,
  DataQualityAssessor,
  DataPreprocessor,
  FeatureEngineer,
  DataOptimizer,
  BackendDatasetSetup,
  DataTester,
  PerformanceMonitor
};

// Made with Bob
