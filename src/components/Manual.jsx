import React, { useState } from 'react';
import { 
  Book, 
  ChevronRight, 
  ChevronDown, 
  Search, 
  FileText, 
  Shield, 
  Settings, 
  Database,
  Download,
  AlertCircle,
  CheckCircle,
  Info
} from 'lucide-react';

const Manual = () => {
  const [expandedSection, setExpandedSection] = useState('overview');
  const [searchQuery, setSearchQuery] = useState('');

  const sections = [
    {
      id: 'overview',
      title: 'System Overview',
      icon: FileText,
      content: `
# AquaVision Tool Manual

## Purpose
AquaVision is a smart water management system designed for East African agriculture and water supply. This digital twin platform provides real-time monitoring, control, and analytics of water systems.

## Target Users
- Farmers managing irrigation systems
- Water utility operators
- Agricultural cooperatives
- Government agencies
- Research institutions

## System Architecture
The system consists of five main modules:
1. **Dashboard** - Real-time monitoring and alerts
2. **Sensor Monitoring** - IoT sensor data visualization
3. **Irrigation Control** - Zone-based irrigation management
4. **Water Quality** - Water parameter monitoring
5. **Analytics** - Data analysis and reporting
      `
    },
    {
      id: 'si-units',
      title: 'SI Units and Standards',
      icon: Database,
      content: `
# SI Units Reference

## Water Quantity
- **Volume**: Liters (L), Cubic meters (m³)
  - 1 m³ = 1000 L
- **Flow Rate**: Liters per minute (L/min), Cubic meters per hour (m³/h)
  - 1 L/min = 0.06 m³/h

## Temperature
- **Unit**: Degrees Celsius (°C)
- **Conversion to Kelvin**: K = °C + 273.15
- **Range**: -20°C to 50°C for agricultural applications

## Pressure
- **Unit**: Bar (bar)
- **SI Base Unit**: Pascal (Pa)
- 1 bar = 100,000 Pa = 100 kPa
- 1 bar ≈ 14.5 psi

## Electrical
- **Voltage**: Volts (V)
- **Current**: Amperes (A)
- **Power**: Watts (W), Kilowatts (kW)
- **Energy**: Kilowatt-hours (kWh)

## Water Quality
- **pH**: Dimensionless (0-14 scale)
  - 6.5 - 8.5: Optimal for most crops
  - < 6.5: Acidic
  - > 8.5: Alkaline
- **Turbidity**: NTU (Nephelometric Turbidity Units)
  - < 5 NTU: Good
  - 5-10 NTU: Fair
  - > 10 NTU: Poor
- **Dissolved Oxygen**: mg/L (milligrams per liter)
  - > 6 mg/L: Good for aquatic life
  - 4-6 mg/L: Moderate
  - < 4 mg/L: Poor
- **Conductivity**: µS/cm (microsiemens per centimeter)
  - < 500 µS/cm: Good
  - 500-1000 µS/cm: Moderate
  - > 1000 µS/cm: High
- **TDS**: ppm (parts per million) or mg/L
  - 1 ppm ≈ 1 mg/L for dilute solutions
  - < 500 ppm: Good
  - 500-1000 ppm: Acceptable
  - > 1000 ppm: High

## Agricultural
- **Yield**: Tons per hectare (t/ha)
  - 1 hectare = 10,000 m²
- **Moisture**: % volumetric water content
  - 0-30%: Dry
  - 30-60%: Optimal
  - 60-100%: Saturated
- **Application Rate**: mm/hour (millimeters per hour)
      `
    },
    {
      id: 'dashboard',
      title: 'Dashboard Module',
      icon: FileText,
      content: `
# Dashboard Module Guide

## Features

### Real-Time Metrics
1. **Water Level**
   - Unit: Percentage (%)
   - Update Rate: Every 2 seconds
   - Normal Range: 50-90%
   - Alert Threshold: < 30% or > 95%

2. **Flow Rate**
   - Unit: Liters per minute (L/min)
   - Update Rate: Every 2 seconds
   - Normal Range: 20-80 L/min
   - Alert Threshold: < 10 L/min (low flow) or > 100 L/min (high flow)

3. **Temperature**
   - Unit: Degrees Celsius (°C)
   - Update Rate: Every 2 seconds
   - Normal Range: 15-35°C
   - Alert Threshold: < 10°C or > 40°C

4. **Pressure**
   - Unit: Bar
   - Update Rate: Every 2 seconds
   - Normal Range: 2-4 bar
   - Alert Threshold: < 1 bar or > 5 bar

### Charts
- **Water Level Trends (24h)**: Area chart showing water level over time
- **Flow Rate Analysis (24h)**: Line chart showing flow rate patterns
- **Interactive Features**: Hover for details, zoom capability

### Alerts System
- **Warning Alerts**: Yellow indicators for non-critical issues
- **Critical Alerts**: Red indicators for immediate attention
- **Info Alerts**: Blue indicators for informational messages
- **Timestamp**: Each alert includes time of occurrence

### System Status
- **Pump System**: Shows operational status
- **Sensors**: Displays sensor health
- **Data Sync**: Shows real-time connectivity status

## Usage Instructions
1. Monitor real-time metrics for anomalies
2. Review 24-hour trends to identify patterns
3. Address alerts promptly based on severity
4. Check system status before starting operations
      `
    },
    {
      id: 'sensors',
      title: 'Sensor Monitoring Module',
      icon: Database,
      content: `
# Sensor Monitoring Module Guide

## Supported Sensor Types

### Soil Moisture Sensors
- **Unit**: % volumetric water content
- **Range**: 0-100%
- **Accuracy**: ±3%
- **Update Rate**: Every 5 minutes
- **Optimal Range**: 30-60%
- **Thresholds**:
  - < 30%: Needs irrigation
  - 30-60%: Optimal
  - > 60%: Over-watered

### Temperature Sensors
- **Unit**: Degrees Celsius (°C)
- **Range**: -20°C to 80°C
- **Accuracy**: ±0.5°C
- **Update Rate**: Every 2 minutes
- **Optimal Range**: 15-30°C
- **Thresholds**:
  - < 10°C: Too cold
  - 10-30°C: Optimal
  - > 30°C: Too hot

### pH Sensors
- **Unit**: pH (dimensionless)
- **Range**: 0-14
- **Accuracy**: ±0.1 pH
- **Update Rate**: Every 10 minutes
- **Optimal Range**: 6.0-7.5
- **Thresholds**:
  - < 6.0: Acidic
  - 6.0-7.5: Optimal
  - > 7.5: Alkaline

### Water Level Sensors
- **Unit**: Meters (m) or Percentage (%)
- **Range**: 0-10 m
- **Accuracy**: ±1 cm
- **Update Rate**: Every 1 minute
- **Thresholds**:
  - < 20%: Critical low
  - 20-80%: Normal
  - > 80%: High

### Flow Meters
- **Unit**: Liters per minute (L/min)
- **Range**: 0-200 L/min
- **Accuracy**: ±2%
- **Update Rate**: Real-time
- **Thresholds**:
  - < 5 L/min: No flow
  - 5-100 L/min: Normal
  - > 100 L/min: High flow

## Sensor Health Indicators
- **Green**: Active and functioning normally
- **Yellow**: Warning - may need calibration
- **Red**: Offline or malfunctioning
- **Battery Status**: Shows voltage or percentage
- **Signal Strength**: Displayed in dBm
  - > -60 dBm: Excellent
  - -60 to -70 dBm: Good
  - -70 to -80 dBm: Fair
  - < -80 dBm: Poor

## Data Visualization
- **24-hour Trends**: Line charts for each sensor
- **Multi-sensor Comparison**: Compare different sensors
- **Historical Data**: Access up to 30 days of history
- **Export**: Download sensor data in CSV format

## Calibration
- Recommended every 3 months
- Use reference solutions for pH sensors
- Verify flow meter with known volume
- Check soil moisture with manual measurement
      `
    },
    {
      id: 'irrigation',
      title: 'Irrigation Control Module',
      icon: Settings,
      content: `
# Irrigation Control Module Guide

## Zone Management

### Zone Configuration
Each irrigation zone includes:
- **Zone Name**: Custom identifier
- **Location**: Physical area description
- **Soil Moisture**: Current moisture level (%)
- **Status**: Idle, Active, or Error
- **Next Schedule**: Planned irrigation time
- **Duration**: Irrigation duration in minutes

### Zone Status
- **Idle**: Zone is not currently irrigating
- **Active**: Zone is currently irrigating
- **Error**: Zone has a fault or communication issue

### Manual Control
- **Start**: Begin irrigation for selected zone
- **Stop**: Halt irrigation for selected zone
- **Start All**: Activate all zones simultaneously
- **Stop All**: Deactivate all zones
- **Reset**: Clear all active states

## Irrigation Scheduling

### Schedule Parameters
- **Zone**: Select which zone to schedule
- **Time**: Set start time (24-hour format)
- **Duration**: Set irrigation duration (minutes)
- **Days**: Select days of the week
- **Active**: Enable or disable schedule

### Schedule Examples
- **Morning Schedule**: 06:00 for 30 minutes on Mon, Wed, Fri
- **Afternoon Schedule**: 14:00 for 25 minutes on Tue, Thu, Sat
- **Daily Schedule**: 10:00 for 20 minutes every day

### Smart Scheduling
- **Soil Moisture Trigger**: Irrigate when moisture drops below threshold
- **Weather-Based**: Adjust schedule based on forecast
- **Time-of-Use**: Schedule during off-peak energy hours

## Water Usage Monitoring

### Metrics Tracked
- **Total Consumption**: Liters used per period
- **Zone Usage**: Liters per zone
- **Efficiency**: Water used vs. water saved
- **Target Comparison**: Actual vs. planned usage

### Weekly Analysis
- Bar chart showing daily consumption
- Comparison with target usage
- Trend analysis
- Savings calculation

## Quick Actions

### Emergency Stop
- Immediately stops all irrigation
- Use for leaks, system faults, or weather events
- Requires confirmation

### System Reset
- Clears all active states
- Resets timers and counters
- Use after maintenance or error recovery

## Best Practices
1. Monitor soil moisture before irrigation
2. Avoid irrigation during peak sun hours (10 AM - 3 PM)
3. Adjust duration based on season and crop needs
4. Regular maintenance of irrigation equipment
5. Keep records of irrigation schedules and results
      `
    },
    {
      id: 'water-quality',
      title: 'Water Quality Module',
      icon: Database,
      content: `
# Water Quality Module Guide

## Quality Parameters

### pH Level
- **Unit**: pH (dimensionless)
- **Range**: 0-14
- **WHO Standard**: 6.5 - 8.5
- **Agricultural Optimal**: 6.0 - 7.5
- **Measurement Frequency**: Every 10 minutes
- **Impact**:
  - < 6.0: Nutrient lockout, root damage
  - 6.0-7.5: Optimal nutrient availability
  - > 7.5: Nutrient deficiencies, salt accumulation

### Turbidity
- **Unit**: NTU (Nephelometric Turbidity Units)
- **WHO Standard**: < 5 NTU
- **Measurement Frequency**: Every 15 minutes
- **Impact**:
  - < 5 NTU: Clear water, good for irrigation
  - 5-10 NTU: Slightly cloudy, acceptable
  - > 10 NTU: Cloudy, may clog irrigation systems

### Dissolved Oxygen (DO)
- **Unit**: mg/L (milligrams per liter)
- **Optimal Range**: > 6 mg/L
- **Measurement Frequency**: Every 5 minutes
- **Impact**:
  - > 6 mg/L: Good for aquatic life
  - 4-6 mg/L: Moderate stress
  - < 4 mg/L: Harmful to aquatic life

### Electrical Conductivity (EC)
- **Unit**: µS/cm (microsiemens per centimeter)
- **WHO Standard**: < 500 µS/cm
- **Agricultural Limit**: < 2000 µS/cm
- **Measurement Frequency**: Every 10 minutes
- **Impact**:
  - < 500 µS/cm: Low salinity, safe for all crops
  - 500-1000 µS/cm: Moderate salinity
  - > 1000 µS/cm: High salinity, salt-sensitive crops affected

### Temperature
- **Unit**: Degrees Celsius (°C)
- **Optimal Range**: 20-30°C
- **Measurement Frequency**: Every 2 minutes
- **Impact**:
  - < 15°C: Reduced biological activity
  - 20-30°C: Optimal for most applications
  - > 30°C: Increased evaporation, potential for harmful organisms

### Total Dissolved Solids (TDS)
- **Unit**: ppm (parts per million) or mg/L
- **WHO Standard**: < 500 ppm
- **Agricultural Limit**: < 1000 ppm
- **Measurement Frequency**: Every 10 minutes
- **Relationship**: TDS ≈ EC × 0.65

## WHO Compliance Standards

### Drinking Water Standards
- pH: 6.5 - 8.5
- Turbidity: < 5 NTU
- TDS: < 500 ppm
- Conductivity: < 500 µS/cm

### Irrigation Water Standards
- pH: 6.0 - 8.5
- EC: < 2000 µS/cm
- TDS: < 1000 ppm
- No specific turbidity limit

## Quality Alerts

### Alert Types
- **Warning**: Parameter approaching threshold
- **Critical**: Parameter exceeds threshold
- **Success**: Parameter within optimal range

### Alert Response
1. Identify the parameter causing the alert
2. Review current value vs. threshold
3. Check for contamination sources
4. Take corrective action
5. Monitor until values return to normal

## Quality Score
- **Radar Chart**: Visual representation of overall quality
- **Scoring**: Each parameter scored 0-100
- **Overall Score**: Average of all parameters
- **Grade**:
  - 90-100: Excellent
  - 75-89: Good
  - 60-74: Fair
  - < 60: Poor

## Data Export
- Export quality reports in PDF format
- Include all parameters with timestamps
- Add WHO compliance status
- Include recommendations for improvement
      `
    },
    {
      id: 'analytics',
      title: 'Analytics Module',
      icon: FileText,
      content: `
# Analytics Module Guide

## Key Performance Indicators

### Water Consumption
- **Total Water Consumed**: Liters used in selected period
- **Water Saved**: Liters saved through optimization
- **Savings Percentage**: (Saved / Total) × 100
- **Target Comparison**: Actual vs. planned usage

### Crop Performance
- **Yield**: Tons per hectare (t/ha)
- **Yield Increase**: Percentage improvement over baseline
- **Target Yield**: Planned production target
- **Efficiency**: Actual yield / Target yield

### Energy Metrics
- **Energy Efficiency**: Percentage of optimal energy use
- **Power Consumption**: Kilowatt-hours (kWh)
- **Cost Savings**: Currency value of energy saved
- **Optimization Opportunities**: Potential savings

## Time Range Selection

### Available Ranges
- **Today**: Real-time data for current day
- **This Week**: Last 7 days of data
- **This Month**: Last 30 days of data
- **This Year**: Last 12 months of data

### Data Aggregation
- **Day/Hour**: Hourly data points
- **Week/Day**: Daily averages
- **Month/Week**: Weekly averages
- **Year/Month**: Monthly averages

## Charts and Visualizations

### Water Consumption Chart
- **Type**: Bar chart
- **X-Axis**: Time period (days, weeks, months)
- **Y-Axis**: Liters
- **Series**: Consumed, Saved, Target
- **Features**: Hover details, legend toggle, export

### Crop Yield Chart
- **Type**: Line chart
- **X-Axis**: Time period (months)
- **Y-Axis**: Tons per hectare (t/ha)
- **Series**: Actual Yield, Target
- **Features**: Trend analysis, comparison

### Efficiency Breakdown
- **Type**: Pie chart
- **Categories**: Water Saved, Energy Saved, Yield Increase, Cost Reduction
- **Display**: Percentage and absolute values
- **Features**: Interactive segments, legend

### ROI Summary
- **Water Cost Saved**: Currency value
- **Yield Value Increase**: Currency value
- **Total Savings**: Sum of all savings
- **Payback Period**: Months to recover investment

## AI-Powered Recommendations

### Irrigation Optimization
- Analyze weather forecasts
- Suggest schedule adjustments
- Calculate potential water savings
- Recommend optimal irrigation times

### Sensor Calibration
- Identify sensor drift
- Schedule calibration reminders
- Detect abnormal readings
- Suggest maintenance actions

### Energy Optimization
- Analyze peak/off-peak pricing
- Recommend pump scheduling
- Calculate energy cost savings
- Suggest equipment upgrades

### Yield Improvement
- Analyze historical yield data
- Identify best practices
- Recommend crop-specific adjustments
- Predict future yields

## Data Export

### Export Formats
- **CSV**: Sensor data, time-series data
- **JSON**: Configuration, analytics data
- **PDF**: Reports, summaries
- **Excel**: Detailed analytics with formulas

### Export Options
- Date range selection
- Metric selection
- Include/exclude metadata
- Compression for large files
- Scheduled automatic exports

### File Naming Convention
\`\`\`
aquavision_[module]_[start_date]_[end_date].[format]
Example: aquavision_analytics_2024-01-01_2024-01-31.csv
\`\`\`

## ROI Calculation

### Formula
\`\`\`
ROI = (Total Savings - Investment Cost) / Investment Cost × 100
\`\`\`

### Components
- **Water Cost Savings**: (Water Saved × Water Rate)
- **Energy Cost Savings**: (Energy Saved × Energy Rate)
- **Yield Value Increase**: (Yield Increase × Crop Price)
- **Maintenance Savings**: Reduced maintenance costs

### Payback Period
\`\`\`
Payback Period = Investment Cost / Monthly Savings
\`\`\`

## Best Practices
1. Review analytics weekly for trend identification
2. Compare actual vs. target performance
3. Implement AI recommendations where feasible
4. Export reports for record-keeping
5. Use data to inform future planning
      `
    },
    {
      id: 'data-export',
      title: 'Data Export and File Output',
      icon: Download,
      content: `
# Data Export Guide

## Export Functionality

### Access Points
1. **Analytics Module**: Export button in top-right
2. **Sensor Monitoring**: Export individual sensor data
3. **Water Quality**: Export quality reports
4. **Manual Section**: Export all system data

### Export Formats

#### CSV (Comma Separated Values)
- **Best for**: Sensor data, time-series data
- **Compatible with**: Excel, Google Sheets, data analysis tools
- **Structure**: Headers in first row, data in subsequent rows
- **File extension**: .csv

#### JSON (JavaScript Object Notation)
- **Best for**: Configuration, API data, programmatic access
- **Compatible with**: Web applications, databases, programming languages
- **Structure**: Nested objects and arrays
- **File extension**: .json

#### PDF (Portable Document Format)
- **Best for**: Reports, documentation, sharing
- **Compatible with**: All devices, email attachments
- **Structure**: Formatted document with charts and tables
- **File extension**: .pdf

#### Excel
- **Best for**: Detailed analytics with formulas
- **Compatible with**: Microsoft Excel, Google Sheets
- **Structure**: Multiple sheets, formulas, formatting
- **File extension**: .xlsx

## Export Options

### Date Range Selection
- **Predefined**: Today, This Week, This Month, This Year
- **Custom**: Select specific start and end dates
- **Format**: YYYY-MM-DD

### Metric Selection
- **All Metrics**: Export all available data
- **Selected Metrics**: Choose specific parameters
- **Custom**: Build custom export template

### Metadata Options
- **Include**: Timestamps, sensor IDs, locations, units
- **Exclude**: Raw data only
- **Custom**: Select which metadata to include

## File Output Location

### Default Directory
\`\`\`
/exports/
\`\`\`

### File Naming Convention
\`\`\`
aquavision_[module]_[YYYY-MM-DD]_[HH-MM-SS].[format]
\`\`\`

### Examples
\`\`\`
aquavision_dashboard_2024-01-15_14-30-00.csv
aquavision_sensors_2024-01-15_14-30-00.json
aquavision_analytics_2024-01-01_2024-01-31.pdf
\`\`\`

## Export Process

### Step-by-Step
1. Navigate to desired module
2. Click "Export" button
3. Select export format
4. Choose date range (if applicable)
5. Select metrics to include
6. Choose metadata options
7. Click "Generate Export"
8. Wait for processing
9. Download file

### Processing Time
- **Small datasets** (< 1000 records): < 5 seconds
- **Medium datasets** (1000-10000 records): 5-30 seconds
- **Large datasets** (> 10000 records): 30 seconds - 5 minutes

## Scheduled Exports

### Configuration
- **Frequency**: Daily, Weekly, Monthly
- **Time**: Specific time of day
- **Format**: CSV, JSON, PDF, or Excel
- **Destination**: Email, cloud storage, local file

### Setting Up Scheduled Export
1. Go to Settings → Scheduled Exports
2. Click "Add Schedule"
3. Configure frequency and time
4. Select data source and format
5. Set destination
6. Save schedule

## Data Validation

### Validation Checks
- **Data Completeness**: Ensure no missing values
- **Range Validation**: Check values are within expected ranges
- **Unit Consistency**: Verify SI units are correct
- **Timestamp Accuracy**: Ensure chronological order

### Error Handling
- **Invalid Data**: Flag and exclude from export
- **Missing Data**: Fill with placeholder or exclude
- **Corrupted Data**: Log error and retry
- **Export Failure**: Notify user and provide error details

## Security Considerations

### Data Encryption
- **In Transit**: HTTPS/TLS encryption
- **At Rest**: AES-256 encryption
- **Export Files**: Optional password protection

### Access Control
- **User Authentication**: Required for export
- **Role-Based Access**: Admins can export all data
- **Audit Logging**: All exports logged with user and timestamp

### Data Privacy
- **Sensitive Data**: Mask or exclude personal information
- **Anonymization**: Remove identifiers for analytics
- **Retention Policy**: Auto-delete old exports

## Troubleshooting

### Common Issues
1. **Export Fails**
   - Check network connection
   - Verify sufficient disk space
   - Review error message for details

2. **File Won't Open**
   - Verify file format matches application
   - Check for file corruption
   - Try alternative format

3. **Missing Data**
   - Verify date range includes data
   - Check sensor connectivity during period
   - Review data retention policy

4. **Large File Size**
   - Reduce date range
   - Select fewer metrics
   - Enable compression
      `
    },
    {
      id: 'security',
      title: 'Security Features',
      icon: Shield,
      content: `
# Security Features Guide

## Authentication

### User Authentication
- **Multi-Factor Authentication (MFA)**: Optional enhanced security
- **Password Requirements**:
  - Minimum 8 characters
  - At least one uppercase letter
  - At least one lowercase letter
  - At least one number
  - At least one special character
- **Session Timeout**: 30 minutes of inactivity
- **Account Lockout**: After 5 failed login attempts

### Password Management
- **Password Expiry**: Every 90 days
- **Password History**: Prevent reuse of last 5 passwords
- **Password Reset**: Via email verification
- **Temporary Password**: One-time use for first login

## Authorization

### Role-Based Access Control (RBAC)

#### Admin Role
- Full system access
- User management
- Configuration changes
- Export all data
- View audit logs

#### Operator Role
- Monitor all modules
- Control irrigation
- View analytics
- Export operational data
- No user management

#### Viewer Role
- View all modules
- No control capabilities
- No export functionality
- Read-only access

### Permission Matrix
| Feature | Admin | Operator | Viewer |
|---------|-------|----------|--------|
| Dashboard | ✓ | ✓ | ✓ |
| Sensor Monitoring | ✓ | ✓ | ✓ |
| Irrigation Control | ✓ | ✓ | ✗ |
| Water Quality | ✓ | ✓ | ✓ |
| Analytics | ✓ | ✓ | ✓ |
| Data Export | ✓ | ✓ | ✗ |
| User Management | ✓ | ✗ | ✗ |
| System Settings | ✓ | ✗ | ✗ |

## Data Protection

### Encryption
- **In Transit**: TLS 1.3 encryption
- **At Rest**: AES-256 encryption
- **Database**: Encrypted storage
- **Backup Files**: Encrypted archives

### Key Management
- **Key Rotation**: Every 90 days
- **Key Storage**: Hardware Security Module (HSM)
- **Key Escrow**: Secure key recovery process
- **Key Destruction**: Secure deletion after expiry

## Input Validation

### Validation Rules
- **Numerical Inputs**: Range checking, type validation
- **Text Inputs**: Length limits, character whitelist
- **Date Inputs**: Format validation, range checking
- **File Uploads**: Type validation, size limits

### Attack Prevention
- **SQL Injection**: Parameterized queries
- **XSS (Cross-Site Scripting)**: Input sanitization
- **CSRF (Cross-Site Request Forgery)**: Token validation
- **Command Injection**: No direct command execution

## Audit Logging

### Logged Events
- User logins and logouts
- Configuration changes
- Control actions (irrigation start/stop)
- Data exports
- Failed authentication attempts
- System errors

### Log Retention
- **Access Logs**: 90 days
- **Audit Logs**: 1 year
- **Error Logs**: 30 days
- **Security Logs**: 2 years

### Log Analysis
- **Real-time Monitoring**: Immediate threat detection
- **Pattern Analysis**: Identify suspicious behavior
- **Compliance Reporting**: Generate audit reports
- **Alerting**: Automatic notification of security events

## Network Security

### Firewall Rules
- **Inbound**: Only necessary ports open (80, 443)
- **Outbound**: Restricted to approved destinations
- **DMZ**: Public-facing services isolated
- **VPN**: Required for remote admin access

### API Security
- **Rate Limiting**: 100 requests per minute per user
- **API Keys**: Required for programmatic access
- **IP Whitelist**: Restrict API access by IP
- **CORS**: Configured for allowed origins

## Data Privacy

### Personal Data
- **Collection**: Only necessary data
- **Storage**: Encrypted at rest
- **Access**: Role-based restrictions
- **Deletion**: User-requested data removal

### Anonymization
- **Analytics**: No personally identifiable information
- **Reporting**: Aggregated data only
- **Research**: Anonymized datasets
- **Sharing**: No data sharing without consent

## Compliance

### Standards
- **GDPR**: General Data Protection Regulation
- **ISO 27001**: Information Security Management
- **SOC 2**: Service Organization Control
- **NIST**: Cybersecurity Framework

### Regular Assessments
- **Penetration Testing**: Quarterly
- **Vulnerability Scanning**: Monthly
- **Security Audits**: Annual
- **Compliance Reviews**: Semi-annual

## Best Practices

### For Users
- Use strong, unique passwords
- Enable MFA when available
- Log out after use
- Report suspicious activity
- Keep software updated

### For Administrators
- Regular security updates
- Monitor audit logs
- Review access permissions
- Test backup recovery
- Conduct security training

### For Developers
- Follow secure coding practices
- Implement input validation
- Use encryption for sensitive data
- Test for vulnerabilities
- Document security features
      `
    }
  ];

  const filteredSections = sections.filter(section => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      section.title.toLowerCase().includes(query) ||
      section.content.toLowerCase().includes(query)
    );
  });

  const SectionContent = ({ content }) => {
    const lines = content.split('\n');
    return (
      <div className="prose prose-invert max-w-none">
        {lines.map((line, index) => {
          if (line.startsWith('# ')) {
            return <h2 key={index} className="text-2xl font-bold text-white mt-6 mb-4">{line.replace('# ', '')}</h2>;
          } else if (line.startsWith('## ')) {
            return <h3 key={index} className="text-xl font-semibold text-blue-400 mt-4 mb-3">{line.replace('## ', '')}</h3>;
          } else if (line.startsWith('### ')) {
            return <h4 key={index} className="text-lg font-medium text-slate-300 mt-3 mb-2">{line.replace('### ', '')}</h4>;
          } else if (line.startsWith('- ')) {
            return <li key={index} className="text-slate-400 ml-6 mb-1">{line.replace('- ', '')}</li>;
          } else if (line.startsWith('**') && line.endsWith('**')) {
            return <p key={index} className="text-white font-semibold mb-2">{line.replace(/\*\*/g, '')}</p>;
          } else if (line.startsWith('```')) {
            return null; // Skip code block markers
          } else if (line.trim() === '') {
            return <br key={index} />;
          } else {
            return <p key={index} className="text-slate-400 mb-2">{line}</p>;
          }
        })}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Header */}
      <header className="bg-slate-900/80 backdrop-blur-md border-b border-blue-500/20 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-r from-aqua-400 to-blue-500 p-2 rounded-lg">
                <Book className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">AquaVision Manual</h1>
                <p className="text-xs text-blue-300">Comprehensive Tool Documentation</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Search Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search documentation..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 transition-colors"
          />
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-slate-700/50 sticky top-24">
              <h3 className="text-white font-semibold mb-4">Sections</h3>
              <nav className="space-y-1">
                {filteredSections.map((section) => {
                  const Icon = section.icon;
                  const isExpanded = expandedSection === section.id;
                  return (
                    <button
                      key={section.id}
                      onClick={() => setExpandedSection(section.id)}
                      className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all ${
                        isExpanded
                          ? 'bg-blue-600/20 text-white border border-blue-500/30'
                          : 'text-slate-400 hover:bg-slate-700/30 hover:text-white'
                      }`}
                    >
                      <Icon className="w-4 h-4 flex-shrink-0" />
                      <span className="text-sm font-medium truncate">{section.title}</span>
                      {isExpanded ? <ChevronDown className="w-4 h-4 ml-auto flex-shrink-0" /> : <ChevronRight className="w-4 h-4 ml-auto flex-shrink-0" />}
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>

          {/* Content Area */}
          <div className="lg:col-span-3">
            {filteredSections.map((section) => {
              const Icon = section.icon;
              const isExpanded = expandedSection === section.id;
              return (
                <div
                  key={section.id}
                  className={`bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700/50 mb-4 transition-all ${
                    isExpanded ? 'border-blue-500/30' : ''
                  }`}
                >
                  <button
                    onClick={() => setExpandedSection(section.id)}
                    className="w-full flex items-center gap-3 p-6 hover:bg-slate-700/30 transition-colors"
                  >
                    <div className="p-3 bg-blue-500/20 rounded-lg">
                      <Icon className="w-6 h-6 text-blue-400" />
                    </div>
                    <div className="flex-1 text-left">
                      <h2 className="text-lg font-semibold text-white">{section.title}</h2>
                    </div>
                    {isExpanded ? <ChevronDown className="w-5 h-5 text-slate-400" /> : <ChevronRight className="w-5 h-5 text-slate-400" />}
                  </button>
                  
                  {isExpanded && (
                    <div className="px-6 pb-6 border-t border-slate-700/50 pt-6">
                      <SectionContent content={section.content} />
                    </div>
                  )}
                </div>
              );
            })}

            {filteredSections.length === 0 && (
              <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-12 border border-slate-700/50 text-center">
                <Search className="w-12 h-12 text-slate-500 mx-auto mb-4" />
                <p className="text-slate-400">No results found for "{searchQuery}"</p>
                <p className="text-slate-500 text-sm mt-2">Try different keywords or browse the sections above</p>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Quick Reference Card */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-xl p-6 border border-blue-500/30">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-blue-500/30 rounded-lg">
              <Info className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <h3 className="text-white font-semibold mb-2">Quick Reference</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <p className="text-slate-400 mb-1">Water Level</p>
                  <p className="text-white font-medium">50-90% (Normal)</p>
                </div>
                <div>
                  <p className="text-slate-400 mb-1">Soil Moisture</p>
                  <p className="text-white font-medium">30-60% (Optimal)</p>
                </div>
                <div>
                  <p className="text-slate-400 mb-1">pH Level</p>
                  <p className="text-white font-medium">6.5-8.5 (WHO Std)</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Manual;
