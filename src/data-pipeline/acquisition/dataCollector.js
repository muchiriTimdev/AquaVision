/**
 * Data Collection Strategy Module
 * Systematically gather data from multiple sources for AquaVision
 */

class DataCollector {
  constructor(config = {}) {
    this.config = {
      apiEndpoints: config.apiEndpoints || {},
      refreshInterval: config.refreshInterval || 2000, // 2 seconds as per requirements
      retryAttempts: config.retryAttempts || 3,
      timeout: config.timeout || 5000,
      ...config
    };
    this.dataSources = new Map();
    this.collectionStatus = new Map();
  }

  /**
   * Register a data source
   * @param {string} sourceId - Unique identifier for the data source
   * @param {Object} sourceConfig - Configuration for the data source
   */
  registerDataSource(sourceId, sourceConfig) {
    this.dataSources.set(sourceId, {
      id: sourceId,
      type: sourceConfig.type, // 'api', 'mqtt', 'websocket', 'database'
      endpoint: sourceConfig.endpoint,
      protocol: sourceConfig.protocol || 'http',
      authentication: sourceConfig.authentication,
      dataFormat: sourceConfig.dataFormat || 'json',
      validationRules: sourceConfig.validationRules || [],
      enabled: sourceConfig.enabled !== false,
      lastFetch: null,
      errorCount: 0
    });

    this.collectionStatus.set(sourceId, {
      status: 'registered',
      lastUpdate: new Date().toISOString(),
      recordsCollected: 0,
      errors: []
    });

    console.log(`✓ Data source registered: ${sourceId}`);
  }

  /**
   * Collect data from API endpoint
   * @param {string} sourceId - Data source identifier
   * @returns {Promise<Object>} Collected data
   */
  async collectFromAPI(sourceId) {
    const source = this.dataSources.get(sourceId);
    if (!source) {
      throw new Error(`Data source not found: ${sourceId}`);
    }

    let attempts = 0;
    let lastError = null;

    while (attempts < this.config.retryAttempts) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), this.config.timeout);

        const headers = {
          'Content-Type': 'application/json',
          ...(source.authentication?.token && {
            'Authorization': `Bearer ${source.authentication.token}`
          })
        };

        const response = await fetch(source.endpoint, {
          method: 'GET',
          headers,
          signal: controller.signal
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        
        // Update collection status
        this.updateCollectionStatus(sourceId, 'success', data);
        
        return {
          sourceId,
          timestamp: new Date().toISOString(),
          data,
          metadata: {
            responseTime: response.headers.get('x-response-time'),
            dataSize: JSON.stringify(data).length
          }
        };

      } catch (error) {
        lastError = error;
        attempts++;
        
        if (attempts < this.config.retryAttempts) {
          await this.delay(1000 * attempts); // Exponential backoff
        }
      }
    }

    this.updateCollectionStatus(sourceId, 'error', null, lastError);
    throw new Error(`Failed to collect data from ${sourceId} after ${attempts} attempts: ${lastError.message}`);
  }

  /**
   * Collect data from MQTT broker (simulated for frontend)
   * @param {string} sourceId - Data source identifier
   * @returns {Promise<Object>} Collected data
   */
  async collectFromMQTT(sourceId) {
    const source = this.dataSources.get(sourceId);
    if (!source) {
      throw new Error(`Data source not found: ${sourceId}`);
    }

    // Simulated MQTT data collection
    // In production, this would connect to an actual MQTT broker
    return {
      sourceId,
      timestamp: new Date().toISOString(),
      data: this.generateSimulatedSensorData(),
      metadata: {
        protocol: 'mqtt',
        qos: 1
      }
    };
  }

  /**
   * Collect data from database (simulated for frontend)
   * @param {string} sourceId - Data source identifier
   * @param {Object} query - Database query parameters
   * @returns {Promise<Object>} Collected data
   */
  async collectFromDatabase(sourceId, query = {}) {
    const source = this.dataSources.get(sourceId);
    if (!source) {
      throw new Error(`Data source not found: ${sourceId}`);
    }

    // Simulated database query
    return {
      sourceId,
      timestamp: new Date().toISOString(),
      data: this.generateHistoricalData(query),
      metadata: {
        queryTime: Math.random() * 100,
        recordCount: query.limit || 100
      }
    };
  }

  /**
   * Validate data availability and access permissions
   * @param {string} sourceId - Data source identifier
   * @returns {Promise<Object>} Validation result
   */
  async validateDataSource(sourceId) {
    const source = this.dataSources.get(sourceId);
    if (!source) {
      return {
        valid: false,
        error: 'Data source not found'
      };
    }

    try {
      // Test connection
      const testData = await this.collectFromAPI(sourceId);
      
      return {
        valid: true,
        accessible: true,
        dataFormat: typeof testData.data,
        lastCheck: new Date().toISOString()
      };
    } catch (error) {
      return {
        valid: false,
        accessible: false,
        error: error.message,
        lastCheck: new Date().toISOString()
      };
    }
  }

  /**
   * Implement data extraction pipeline
   * @param {Array<string>} sourceIds - Array of data source identifiers
   * @returns {Promise<Array>} Collected data from all sources
   */
  async extractDataPipeline(sourceIds) {
    const results = [];
    const errors = [];

    for (const sourceId of sourceIds) {
      try {
        const source = this.dataSources.get(sourceId);
        let data;

        switch (source.type) {
          case 'api':
            data = await this.collectFromAPI(sourceId);
            break;
          case 'mqtt':
            data = await this.collectFromMQTT(sourceId);
            break;
          case 'database':
            data = await this.collectFromDatabase(sourceId);
            break;
          default:
            throw new Error(`Unsupported source type: ${source.type}`);
        }

        results.push(data);
      } catch (error) {
        errors.push({
          sourceId,
          error: error.message,
          timestamp: new Date().toISOString()
        });
      }
    }

    return {
      success: results,
      errors,
      summary: {
        total: sourceIds.length,
        successful: results.length,
        failed: errors.length,
        timestamp: new Date().toISOString()
      }
    };
  }

  /**
   * Update collection status
   * @private
   */
  updateCollectionStatus(sourceId, status, data, error = null) {
    const currentStatus = this.collectionStatus.get(sourceId);
    
    this.collectionStatus.set(sourceId, {
      status,
      lastUpdate: new Date().toISOString(),
      recordsCollected: currentStatus.recordsCollected + (data ? 1 : 0),
      errors: error ? [...currentStatus.errors.slice(-9), error.message] : currentStatus.errors
    });
  }

  /**
   * Generate simulated sensor data
   * @private
   */
  generateSimulatedSensorData() {
    return {
      sensors: [
        {
          id: 'soil_moisture_1',
          value: 45 + Math.random() * 30,
          unit: '%',
          location: 'Zone 1'
        },
        {
          id: 'temperature_1',
          value: 20 + Math.random() * 10,
          unit: '°C',
          location: 'Greenhouse'
        },
        {
          id: 'ph_sensor_1',
          value: 6.0 + Math.random() * 2,
          unit: 'pH',
          location: 'Zone 1'
        }
      ],
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Generate historical data
   * @private
   */
  generateHistoricalData(query) {
    const records = [];
    const limit = query.limit || 100;

    for (let i = 0; i < limit; i++) {
      records.push({
        timestamp: new Date(Date.now() - i * 3600000).toISOString(),
        waterLevel: 50 + Math.random() * 40,
        flowRate: 30 + Math.random() * 30,
        temperature: 20 + Math.random() * 10
      });
    }

    return records;
  }

  /**
   * Get collection statistics
   * @returns {Object} Statistics for all data sources
   */
  getCollectionStatistics() {
    const stats = {
      totalSources: this.dataSources.size,
      activeSources: 0,
      errorSources: 0,
      totalRecords: 0,
      sources: []
    };

    this.collectionStatus.forEach((status, sourceId) => {
      if (status.status === 'success') stats.activeSources++;
      if (status.status === 'error') stats.errorSources++;
      stats.totalRecords += status.recordsCollected;

      stats.sources.push({
        id: sourceId,
        ...status
      });
    });

    return stats;
  }

  /**
   * Utility delay function
   * @private
   */
  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

export default DataCollector;

// Made with Bob
