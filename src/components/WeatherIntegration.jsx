import React, { useState, useEffect } from 'react';
import { Cloud, Sun, Rain, Wind, Droplets, Thermometer, Eye, ArrowUp, ArrowDown, MapPin } from 'lucide-react';

/**
 * Weather Integration Component for AquaVision
 * Provides real-time weather data and AI-powered irrigation recommendations
 */

const WeatherIntegration = () => {
  const [weather, setWeather] = useState({
    temp: 28,
    condition: 'partly-cloudy',
    humidity: 65,
    windSpeed: 12,
    precipitation: 20,
    forecast: [
      { day: 'Mon', temp: 29, condition: 'sunny', precipitation: 0 },
      { day: 'Tue', temp: 27, condition: 'cloudy', precipitation: 30 },
      { day: 'Wed', temp: 26, condition: 'rainy', precipitation: 80 },
      { day: 'Thu', temp: 28, condition: 'partly-cloudy', precipitation: 20 },
      { day: 'Fri', temp: 30, condition: 'sunny', precipitation: 0 },
    ]
  });

  const [location, setLocation] = useState('Nairobi, Kenya');
  const [recommendation, setRecommendation] = useState('');

  // AI-powered irrigation recommendation based on weather
  useEffect(() => {
    const generateRecommendation = () => {
      if (weather.precipitation > 70) {
        return 'Heavy rain expected. Skip irrigation for next 24-48 hours.';
      } else if (weather.precipitation > 30) {
        return 'Light rain expected. Reduce irrigation by 50%.';
      } else if (weather.temp > 30 && weather.humidity < 40) {
        return 'High heat, low humidity. Increase irrigation frequency.';
      } else if (weather.windSpeed > 20) {
        return 'Strong winds. Delay irrigation to avoid drift.';
      }
      return 'Weather conditions optimal. Follow regular irrigation schedule.';
    };

    setRecommendation(generateRecommendation());
  }, [weather]);

  const getWeatherIcon = (condition) => {
    switch (condition) {
      case 'sunny': return <Sun className="w-8 h-8 text-yellow-400" />;
      case 'cloudy': return <Cloud className="w-8 h-8 text-gray-400" />;
      case 'rainy': return <Rain className="w-8 h-8 text-blue-400" />;
      case 'partly-cloudy': return <Cloud className="w-8 h-8 text-yellow-200" />;
      default: return <Sun className="w-8 h-8 text-yellow-400" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Location Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MapPin className="w-5 h-5 text-blue-400" />
          <h2 className="text-xl font-semibold text-white">{location}</h2>
        </div>
        <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm transition-colors">
          Change Location
        </button>
      </div>

      {/* Current Weather Card */}
      <div className="bg-gradient-to-br from-blue-600/20 to-cyan-600/20 backdrop-blur-sm rounded-xl p-6 border border-blue-500/30">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            {getWeatherIcon(weather.condition)}
            <div>
              <p className="text-5xl font-bold text-white">{weather.temp}°C</p>
              <p className="text-blue-200 capitalize">{weather.condition.replace('-', ' ')}</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <Droplets className="w-4 h-4 text-blue-400" />
              <span className="text-slate-300">{weather.humidity}% Humidity</span>
            </div>
            <div className="flex items-center gap-2">
              <Wind className="w-4 h-4 text-cyan-400" />
              <span className="text-slate-300">{weather.windSpeed} km/h Wind</span>
            </div>
            <div className="flex items-center gap-2">
              <Cloud className="w-4 h-4 text-gray-400" />
              <span className="text-slate-300">{weather.precipitation}% Rain</span>
            </div>
            <div className="flex items-center gap-2">
              <Thermometer className="w-4 h-4 text-orange-400" />
              <span className="text-slate-300">Feels like {weather.temp + 2}°C</span>
            </div>
          </div>
        </div>
      </div>

      {/* AI Irrigation Recommendation */}
      <div className="bg-gradient-to-r from-green-600/20 to-emerald-600/20 backdrop-blur-sm rounded-xl p-6 border border-green-500/30">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-green-500/20 rounded-lg">
            <Eye className="w-6 h-6 text-green-400" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-white mb-2">AI Irrigation Recommendation</h3>
            <p className="text-slate-300">{recommendation}</p>
            <div className="mt-4 flex items-center gap-2 text-sm text-green-400">
              <ArrowUp className="w-4 h-4" />
              <span>Estimated water savings: 25-30% today</span>
            </div>
          </div>
        </div>
      </div>

      {/* 5-Day Forecast */}
      <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50">
        <h3 className="text-lg font-semibold text-white mb-4">5-Day Forecast</h3>
        <div className="grid grid-cols-5 gap-4">
          {weather.forecast.map((day, index) => (
            <div 
              key={index} 
              className="flex flex-col items-center p-4 bg-slate-700/30 rounded-lg hover:bg-slate-700/50 transition-colors"
            >
              <p className="text-slate-400 text-sm mb-2">{day.day}</p>
              {getWeatherIcon(day.condition)}
              <p className="text-white font-semibold mt-2">{day.temp}°C</p>
              <div className="flex items-center gap-1 mt-1">
                <Droplets className="w-3 h-3 text-blue-400" />
                <span className="text-slate-400 text-xs">{day.precipitation}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Historical Weather Impact */}
      <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50">
        <h3 className="text-lg font-semibold text-white mb-4">Weather Impact on Irrigation (Last 7 Days)</h3>
        <div className="space-y-3">
          {[
            { day: 'Today', rain: 0, irrigation: 'Normal', efficiency: '95%' },
            { day: 'Yesterday', rain: 15, irrigation: 'Reduced 20%', efficiency: '92%' },
            { day: '2 days ago', rain: 0, irrigation: 'Normal', efficiency: '88%' },
            { day: '3 days ago', rain: 45, irrigation: 'Skipped', efficiency: '100%' },
          ].map((item, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg">
              <span className="text-slate-300">{item.day}</span>
              <div className="flex items-center gap-4">
                <span className="text-blue-400">{item.rain}mm rain</span>
                <span className="text-cyan-400">{item.irrigation}</span>
                <span className="text-green-400">{item.efficiency} efficiency</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WeatherIntegration;
