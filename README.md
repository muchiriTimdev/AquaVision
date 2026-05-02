# AquaVision

A mirror of the real water system – simple, understandable and memorable.

## Overview

AquaVision is a smart water management system designed for East African agriculture and water supply, inspired by Asian smart water technology solutions. This digital twin platform addresses critical challenges identified in the Davis & Shirtliff hackathon scope, including water scarcity, irrigation efficiency, and real-time monitoring.

## Problem Statement

Based on research from Davis & Shirtliff and the #HackAgainstHunger Africa hackathon:

- **Less than 60%** of Kenyans have access to safe drinking water
- **Only 29%** have access to improved sanitation facilities
- Small-scale farmers operate in challenging environments with limited water resources
- Need for digital transformation in water management
- Technical challenges: pest prediction, weather forecasting, soil monitoring, IoT data collection

## Asian Technology Solutions Referenced

### Singapore (PUB)
- NB-IoT-enabled smart water meters
- Real-time water quality monitoring using fish behavior analytics
- Smart drainage/water/sewer grids
- Digital operations support

### Japan
- IoT soil sensors (moisture, temperature, nutrients)
- AI-driven decision making for irrigation
- Autonomous machinery
- Smart greenhouses with environmental monitoring
- Data-driven farming with big data analytics

## Features

### 1. Dashboard
- Real-time water level monitoring
- Flow rate analysis
- Temperature and pressure tracking
- Live alerts and system status
- Interactive charts for 24-hour trends

### 2. Sensor Monitoring
- Multi-zone soil moisture tracking
- Temperature and pH sensors
- Water level and flow meters
- Sensor health monitoring
- Real-time data visualization

### 3. Irrigation Control
- Zone-based irrigation management
- Automated scheduling
- Soil moisture-based triggers
- Water usage analytics
- Quick action controls

### 4. Water Quality
- pH level monitoring
- Turbidity tracking
- Dissolved oxygen measurement
- WHO compliance standards
- Quality alerts and recommendations

### 5. Analytics
- Water consumption trends
- Crop yield analysis
- ROI calculations
- AI-powered recommendations
- Efficiency breakdown

## Technology Stack

- **Frontend**: React 18 + Vite
- **Styling**: TailwindCSS
- **Charts**: Recharts
- **Icons**: Lucide React
- **Design**: Mobile-first responsive design

## Installation

```bash
npm install
npm run dev
```

The application will be available at `http://localhost:3000`

## Usage

1. **Dashboard**: View real-time water system metrics and alerts
2. **Sensors**: Monitor all connected IoT sensors and their status
3. **Irrigation**: Control irrigation zones and schedules
4. **Water Quality**: Track water quality parameters against WHO standards
5. **Analytics**: Analyze consumption patterns, yields, and ROI

## Future Enhancements

- Integration with real IoT sensors (ESP32, Arduino)
- AI/ML models for pest prediction
- Weather API integration
- Mobile app deployment
- Offline capabilities
- Multi-language support (Swahili, etc.)

## License

MIT License
