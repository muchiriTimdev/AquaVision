/**
 * Performance Monitoring Module
 * Continuous monitoring for optimal data pipeline results
 */

class PerformanceMonitor {
  constructor(config = {}) {
    this.config = {
      metricsInterval: config.metricsInterval || 5000, // 5 seconds
      alertThresholds: config.alertThresholds || {
        errorRate: 0.05, // 5%
        latency: 1000, // ms
        throughput: 100, // records/second
        memoryUsage: 0.8 // 80%
      },
      retentionPeriod: config.retentionPeriod || 86400000, // 24 hours
      ...config
    };
    this.metrics = new Map();
    this.alerts = [];
    this.performanceHistory = [];
    this.isMonitoring = false;
  }

  /**
   * Start monitoring data pipeline performance
   */
  startMonitoring() {
    if (this.isMonitoring) {
      console.warn('Monitoring already active');
      return;
    }

    this.isMonitoring = true;
    this.monitoringInterval = setInterval(() => {
      this.collectMetrics();
      this.checkAlerts();
      this.cleanupOldMetrics();
    }, this.config.metricsInterval);

    console.log('✓ Performance monitoring started');
  }

  /**
   * Stop monitoring
   */
  stopMonitoring() {
    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval);
      this.isMonitoring = false;
      console.log('✓ Performance monitoring stopped');
    }
  }

  /**
   * Track data quality metrics
   */
  trackDataQuality(qualityReport) {
    const metric = {
      timestamp: Date.now(),
      type: 'data_quality',
      values: {
        overallScore: parseFloat(qualityReport.overallScore),
        completeness: parseFloat(qualityReport.completeness.score),
        accuracy: parseFloat(qualityReport.accuracy.score),
        consistency: parseFloat(qualityReport.consistency.score),
        validity: parseFloat(qualityReport.validity.score),
        timeliness: parseFloat(qualityReport.timeliness.score)
      }
    };

    this.recordMetric('data_quality', metric);

    // Check for quality degradation
    if (metric.values.overallScore < 70) {
      this.createAlert({
        severity: 'high',
        type: 'data_quality',
        message: `Data quality score dropped to ${metric.values.overallScore}`,
        metric: metric.values
      });
    }
  }

  /**
   * Track pipeline performance
   */
  trackPipelinePerformance(pipelineMetrics) {
    const metric = {
      timestamp: Date.now(),
      type: 'pipeline_performance',
      values: {
        processingTime: pipelineMetrics.processingTime,
        recordsProcessed: pipelineMetrics.originalSize,
        throughput: pipelineMetrics.originalSize / (pipelineMetrics.processingTime / 1000),
        stepsCompleted: pipelineMetrics.steps?.length || 0,
        errorCount: pipelineMetrics.errors?.length || 0
      }
    };

    this.recordMetric('pipeline_performance', metric);

    // Check performance thresholds
    if (metric.values.processingTime > this.config.alertThresholds.latency) {
      this.createAlert({
        severity: 'medium',
        type: 'performance',
        message: `Pipeline processing time exceeded threshold: ${metric.values.processingTime}ms`,
        metric: metric.values
      });
    }

    if (metric.values.throughput < this.config.alertThresholds.throughput) {
      this.createAlert({
        severity: 'medium',
        type: 'throughput',
        message: `Throughput below threshold: ${metric.values.throughput.toFixed(2)} records/sec`,
        metric: metric.values
      });
    }
  }

  /**
   * Monitor data pipeline operations
   */
  monitorOperation(operationName, operation) {
    const startTime = Date.now();
    const startMemory = this.getMemoryUsage();

    return async (...args) => {
      try {
        const result = await operation(...args);
        const endTime = Date.now();
        const endMemory = this.getMemoryUsage();

        this.recordOperationMetrics({
          name: operationName,
          duration: endTime - startTime,
          memoryDelta: endMemory - startMemory,
          status: 'success',
          timestamp: startTime
        });

        return result;
      } catch (error) {
        const endTime = Date.now();

        this.recordOperationMetrics({
          name: operationName,
          duration: endTime - startTime,
          status: 'error',
          error: error.message,
          timestamp: startTime
        });

        this.createAlert({
          severity: 'high',
          type: 'operation_error',
          message: `Operation ${operationName} failed: ${error.message}`,
          operation: operationName
        });

        throw error;
      }
    };
  }

  /**
   * Collect current metrics
   */
  collectMetrics() {
    const currentMetrics = {
      timestamp: Date.now(),
      system: {
        memoryUsage: this.getMemoryUsage(),
        activeOperations: this.getActiveOperations(),
        cacheHitRate: this.getCacheHitRate()
      },
      pipeline: {
        totalOperations: this.getTotalOperations(),
        successRate: this.getSuccessRate(),
        averageLatency: this.getAverageLatency(),
        errorRate: this.getErrorRate()
      }
    };

    this.performanceHistory.push(currentMetrics);
    return currentMetrics;
  }

  /**
   * Check for alert conditions
   */
  checkAlerts() {
    const currentMetrics = this.performanceHistory[this.performanceHistory.length - 1];
    
    if (!currentMetrics) return;

    // Check error rate
    if (currentMetrics.pipeline.errorRate > this.config.alertThresholds.errorRate) {
      this.createAlert({
        severity: 'high',
        type: 'error_rate',
        message: `Error rate exceeded threshold: ${(currentMetrics.pipeline.errorRate * 100).toFixed(2)}%`,
        metric: currentMetrics.pipeline.errorRate
      });
    }

    // Check memory usage
    if (currentMetrics.system.memoryUsage > this.config.alertThresholds.memoryUsage) {
      this.createAlert({
        severity: 'medium',
        type: 'memory',
        message: `Memory usage high: ${(currentMetrics.system.memoryUsage * 100).toFixed(2)}%`,
        metric: currentMetrics.system.memoryUsage
      });
    }

    // Check average latency
    if (currentMetrics.pipeline.averageLatency > this.config.alertThresholds.latency) {
      this.createAlert({
        severity: 'medium',
        type: 'latency',
        message: `Average latency exceeded threshold: ${currentMetrics.pipeline.averageLatency}ms`,
        metric: currentMetrics.pipeline.averageLatency
      });
    }
  }

  /**
   * Record a metric
   */
  recordMetric(metricType, metric) {
    if (!this.metrics.has(metricType)) {
      this.metrics.set(metricType, []);
    }

    const metrics = this.metrics.get(metricType);
    metrics.push(metric);

    // Keep only recent metrics
    const cutoffTime = Date.now() - this.config.retentionPeriod;
    this.metrics.set(
      metricType,
      metrics.filter(m => m.timestamp > cutoffTime)
    );
  }

  /**
   * Record operation metrics
   */
  recordOperationMetrics(operationMetric) {
    this.recordMetric('operations', operationMetric);
  }

  /**
   * Create an alert
   */
  createAlert(alert) {
    const alertWithId = {
      id: this.generateAlertId(),
      timestamp: Date.now(),
      acknowledged: false,
      ...alert
    };

    this.alerts.push(alertWithId);

    // Keep only recent alerts
    const cutoffTime = Date.now() - this.config.retentionPeriod;
    this.alerts = this.alerts.filter(a => a.timestamp > cutoffTime);

    console.warn(`⚠️ Alert: ${alert.message}`);
    return alertWithId;
  }

  /**
   * Acknowledge an alert
   */
  acknowledgeAlert(alertId) {
    const alert = this.alerts.find(a => a.id === alertId);
    if (alert) {
      alert.acknowledged = true;
      alert.acknowledgedAt = Date.now();
      return true;
    }
    return false;
  }

  /**
   * Get performance report
   */
  getPerformanceReport(timeRange = 3600000) { // Default 1 hour
    const cutoffTime = Date.now() - timeRange;
    const recentHistory = this.performanceHistory.filter(h => h.timestamp > cutoffTime);

    if (recentHistory.length === 0) {
      return {
        message: 'No performance data available for the specified time range'
      };
    }

    const report = {
      timeRange: {
        start: new Date(recentHistory[0].timestamp).toISOString(),
        end: new Date(recentHistory[recentHistory.length - 1].timestamp).toISOString(),
        duration: timeRange
      },
      summary: {
        averageMemoryUsage: this.calculateAverage(recentHistory.map(h => h.system.memoryUsage)),
        averageLatency: this.calculateAverage(recentHistory.map(h => h.pipeline.averageLatency)),
        averageSuccessRate: this.calculateAverage(recentHistory.map(h => h.pipeline.successRate)),
        totalOperations: recentHistory.reduce((sum, h) => sum + h.pipeline.totalOperations, 0)
      },
      trends: {
        memoryUsage: this.calculateTrend(recentHistory.map(h => h.system.memoryUsage)),
        latency: this.calculateTrend(recentHistory.map(h => h.pipeline.averageLatency)),
        errorRate: this.calculateTrend(recentHistory.map(h => h.pipeline.errorRate))
      },
      alerts: {
        total: this.alerts.filter(a => a.timestamp > cutoffTime).length,
        unacknowledged: this.alerts.filter(a => a.timestamp > cutoffTime && !a.acknowledged).length,
        bySeverity: this.groupAlertsBySeverity(cutoffTime)
      },
      recommendations: this.generatePerformanceRecommendations(recentHistory)
    };

    return report;
  }

  /**
   * Get real-time metrics
   */
  getRealTimeMetrics() {
    const latest = this.performanceHistory[this.performanceHistory.length - 1];
    
    return {
      timestamp: Date.now(),
      current: latest || this.collectMetrics(),
      alerts: this.alerts.filter(a => !a.acknowledged).slice(-5),
      health: this.calculateSystemHealth()
    };
  }

  /**
   * Calculate system health score
   */
  calculateSystemHealth() {
    const latest = this.performanceHistory[this.performanceHistory.length - 1];
    
    if (!latest) {
      return { score: 100, status: 'unknown' };
    }

    let score = 100;

    // Deduct points for issues
    if (latest.pipeline.errorRate > 0.01) score -= 20;
    if (latest.pipeline.errorRate > 0.05) score -= 30;
    if (latest.system.memoryUsage > 0.7) score -= 15;
    if (latest.system.memoryUsage > 0.9) score -= 25;
    if (latest.pipeline.averageLatency > 1000) score -= 15;
    if (latest.pipeline.averageLatency > 2000) score -= 25;

    score = Math.max(0, score);

    let status;
    if (score >= 90) status = 'excellent';
    else if (score >= 75) status = 'good';
    else if (score >= 50) status = 'fair';
    else status = 'poor';

    return { score, status };
  }

  /**
   * Generate performance recommendations
   */
  generatePerformanceRecommendations(history) {
    const recommendations = [];

    const avgMemory = this.calculateAverage(history.map(h => h.system.memoryUsage));
    const avgLatency = this.calculateAverage(history.map(h => h.pipeline.averageLatency));
    const avgErrorRate = this.calculateAverage(history.map(h => h.pipeline.errorRate));

    if (avgMemory > 0.7) {
      recommendations.push({
        priority: 'high',
        category: 'memory',
        message: 'High memory usage detected. Consider implementing data pagination or increasing cache eviction.',
        impact: 'Performance degradation and potential crashes'
      });
    }

    if (avgLatency > 1000) {
      recommendations.push({
        priority: 'high',
        category: 'latency',
        message: 'High average latency. Optimize data processing pipeline or add caching.',
        impact: 'Poor user experience and reduced throughput'
      });
    }

    if (avgErrorRate > 0.05) {
      recommendations.push({
        priority: 'critical',
        category: 'reliability',
        message: 'High error rate detected. Review error logs and fix underlying issues.',
        impact: 'Data loss and system instability'
      });
    }

    const memoryTrend = this.calculateTrend(history.map(h => h.system.memoryUsage));
    if (memoryTrend === 'increasing') {
      recommendations.push({
        priority: 'medium',
        category: 'memory',
        message: 'Memory usage trending upward. Potential memory leak detected.',
        impact: 'System may become unstable over time'
      });
    }

    return recommendations;
  }

  /**
   * Helper methods
   */
  getMemoryUsage() {
    // Simplified memory usage estimation
    if (performance && performance.memory) {
      return performance.memory.usedJSHeapSize / performance.memory.jsHeapSizeLimit;
    }
    return 0.5; // Default estimate
  }

  getActiveOperations() {
    const operations = this.metrics.get('operations') || [];
    const recentTime = Date.now() - 60000; // Last minute
    return operations.filter(op => op.timestamp > recentTime && op.status === 'success').length;
  }

  getCacheHitRate() {
    // Would integrate with actual cache in production
    return 0.85; // 85% placeholder
  }

  getTotalOperations() {
    const operations = this.metrics.get('operations') || [];
    return operations.length;
  }

  getSuccessRate() {
    const operations = this.metrics.get('operations') || [];
    if (operations.length === 0) return 1;
    
    const successful = operations.filter(op => op.status === 'success').length;
    return successful / operations.length;
  }

  getAverageLatency() {
    const operations = this.metrics.get('operations') || [];
    if (operations.length === 0) return 0;
    
    const totalDuration = operations.reduce((sum, op) => sum + op.duration, 0);
    return totalDuration / operations.length;
  }

  getErrorRate() {
    const operations = this.metrics.get('operations') || [];
    if (operations.length === 0) return 0;
    
    const errors = operations.filter(op => op.status === 'error').length;
    return errors / operations.length;
  }

  calculateAverage(values) {
    if (values.length === 0) return 0;
    return values.reduce((sum, val) => sum + val, 0) / values.length;
  }

  calculateTrend(values) {
    if (values.length < 2) return 'stable';
    
    const firstHalf = values.slice(0, Math.floor(values.length / 2));
    const secondHalf = values.slice(Math.floor(values.length / 2));
    
    const firstAvg = this.calculateAverage(firstHalf);
    const secondAvg = this.calculateAverage(secondHalf);
    
    const change = (secondAvg - firstAvg) / firstAvg;
    
    if (change > 0.1) return 'increasing';
    if (change < -0.1) return 'decreasing';
    return 'stable';
  }

  groupAlertsBySeverity(cutoffTime) {
    const recentAlerts = this.alerts.filter(a => a.timestamp > cutoffTime);
    
    return {
      critical: recentAlerts.filter(a => a.severity === 'critical').length,
      high: recentAlerts.filter(a => a.severity === 'high').length,
      medium: recentAlerts.filter(a => a.severity === 'medium').length,
      low: recentAlerts.filter(a => a.severity === 'low').length
    };
  }

  cleanupOldMetrics() {
    const cutoffTime = Date.now() - this.config.retentionPeriod;
    
    // Clean performance history
    this.performanceHistory = this.performanceHistory.filter(h => h.timestamp > cutoffTime);
    
    // Clean alerts
    this.alerts = this.alerts.filter(a => a.timestamp > cutoffTime);
  }

  generateAlertId() {
    return `alert_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Export monitoring data
   */
  exportMonitoringData() {
    return {
      config: this.config,
      metrics: Object.fromEntries(this.metrics),
      alerts: this.alerts,
      performanceHistory: this.performanceHistory,
      exportedAt: new Date().toISOString()
    };
  }

  /**
   * Get monitoring statistics
   */
  getMonitoringStats() {
    return {
      isMonitoring: this.isMonitoring,
      metricsCollected: this.performanceHistory.length,
      totalAlerts: this.alerts.length,
      unacknowledgedAlerts: this.alerts.filter(a => !a.acknowledged).length,
      metricTypes: Array.from(this.metrics.keys()),
      systemHealth: this.calculateSystemHealth(),
      uptime: this.isMonitoring ? Date.now() - (this.performanceHistory[0]?.timestamp || Date.now()) : 0
    };
  }
}

export default PerformanceMonitor;

// Made with Bob
