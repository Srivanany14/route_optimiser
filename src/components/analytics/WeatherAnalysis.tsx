// components/analytics/WeatherAnalysis.tsx
'use client'

import React, { useState, useEffect, useRef } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ComposedChart, AreaChart, Area, BarChart, Bar } from 'recharts'
import { Cloud, Thermometer, Wind, Droplets, AlertTriangle, Sun, CloudRain, Snowflake, Zap, CheckCircle, TrendingUp, MapPin } from 'lucide-react'

interface WeatherAnalysisProps {
  // Add any props needed from the parent component
}

export default function WeatherAnalysis({ }: WeatherAnalysisProps) {
  const [currentCondition, setCurrentCondition] = useState('sunny')
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<any>(null)
  
  // Simulate weather changes for demo
  useEffect(() => {
    const conditions = ['sunny', 'cloudy', 'rainy']
    const interval = setInterval(() => {
      setCurrentCondition(conditions[Math.floor(Math.random() * conditions.length)])
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  // Routes with weather data
  const weatherRoutes = [
    {
      id: 'route-1',
      name: 'Main Street → Downtown',
      coordinates: [[40.7128, -74.0060], [40.7589, -73.9851]],
      weatherCondition: 'rain',
      visibility: 'low',
      roadCondition: 'wet',
      aiAction: 'Switched to Highway',
      timeImpact: '+15 min without AI',
      color: '#ef4444'
    },
    {
      id: 'route-2', 
      name: 'Highway 101 → Industrial',
      coordinates: [[40.7505, -73.9934], [40.6892, -74.0445]],
      weatherCondition: 'clear',
      visibility: 'excellent',
      roadCondition: 'dry',
      aiAction: 'Optimal route',
      timeImpact: 'On time',
      color: '#10b981'
    },
    {
      id: 'route-3',
      name: 'Cross Town → Airport',
      coordinates: [[40.7614, -73.9776], [40.6413, -73.7781]],
      weatherCondition: 'fog',
      visibility: 'moderate',
      roadCondition: 'damp',
      aiAction: 'Monitoring conditions',
      timeImpact: '+5 min delay',
      color: '#f59e0b'
    }
  ]

  // Initialize Weather Map
  useEffect(() => {
    if (typeof window !== 'undefined' && mapRef.current && !mapInstanceRef.current) {
      // Load Leaflet from CDN
      if (!(window as any).L) {
        const script = document.createElement('script')
        script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js'
        script.onload = () => initializeWeatherMap()
        document.head.appendChild(script)
        
        const link = document.createElement('link')
        link.rel = 'stylesheet'
        link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'
        document.head.appendChild(link)
      } else {
        initializeWeatherMap()
      }
    }
    
    function initializeWeatherMap() {
      const L = (window as any).L
      if (!L || !mapRef.current || mapInstanceRef.current) return
      
      // Create map
      const map = L.map(mapRef.current).setView([40.7128, -74.0060], 11)
      
      // Add grayscale tile layer
      L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
        attribution: '© OpenStreetMap contributors © CARTO',
        subdomains: 'abcd',
        maxZoom: 20
      }).addTo(map)
      
      // Add weather zones
      // Rain zone (northwest)
      const rainZone = L.circle([40.75, -74.01], {
        color: '#3b82f6',
        fillColor: '#3b82f6',
        fillOpacity: 0.3,
        radius: 3000
      }).addTo(map)
      rainZone.bindPopup('<strong>Rain Zone</strong><br>Heavy rainfall detected<br>Visibility: Poor')
      
      // Fog zone (southwest) 
      const fogZone = L.circle([40.69, -74.02], {
        color: '#6b7280',
        fillColor: '#6b7280', 
        fillOpacity: 0.2,
        radius: 2500
      }).addTo(map)
      fogZone.bindPopup('<strong>Fog Zone</strong><br>Low visibility<br>Drive carefully')
      
      // Clear zone (east)
      const clearZone = L.circle([40.72, -73.95], {
        color: '#fbbf24',
        fillColor: '#fbbf24',
        fillOpacity: 0.1,
        radius: 2000
      }).addTo(map)
      clearZone.bindPopup('<strong>Clear Zone</strong><br>Good weather<br>Optimal conditions')
      
      // Add routes with weather considerations
      weatherRoutes.forEach((route) => {
        const color = route.weatherCondition === 'rain' ? '#ef4444' : 
                     route.weatherCondition === 'fog' ? '#f59e0b' : '#10b981'
        
        const polyline = L.polyline(route.coordinates, {
          color: color,
          weight: 5,
          opacity: 0.8,
          dashArray: route.weatherCondition === 'rain' ? '10, 10' : undefined
        }).addTo(map)
        
        // Add weather-aware popup
        polyline.bindPopup(`
          <div style="font-family: system-ui; min-width: 200px;">
            <h4 style="margin: 0 0 8px 0; font-weight: 600;">${route.name}</h4>
            <p style="margin: 4px 0;"><strong>Weather:</strong> ${route.weatherCondition}</p>
            <p style="margin: 4px 0;"><strong>Visibility:</strong> ${route.visibility}</p>
            <p style="margin: 4px 0;"><strong>Road:</strong> ${route.roadCondition}</p>
            <p style="margin: 4px 0;"><strong>AI Action:</strong> ${route.aiAction}</p>
            <p style="margin: 4px 0; color: ${route.timeImpact.includes('+') ? '#ef4444' : '#10b981'};">
              <strong>Impact:</strong> ${route.timeImpact}
            </p>
          </div>
        `)
        
        // Add weather icons as markers
        const weatherIcon = route.weatherCondition === 'rain' ? '🌧️' : 
                           route.weatherCondition === 'fog' ? '🌫️' : '☀️'
        
        const midpoint = [
          (route.coordinates[0][0] + route.coordinates[1][0]) / 2,
          (route.coordinates[0][1] + route.coordinates[1][1]) / 2
        ]
        
        const weatherMarker = L.marker(midpoint as [number, number], {
          icon: L.divIcon({
            html: `<div style="font-size: 20px;">${weatherIcon}</div>`,
            className: 'weather-marker',
            iconSize: [30, 30]
          })
        }).addTo(map)
        
        weatherMarker.bindPopup(`<strong>Weather Alert</strong><br>${route.weatherCondition} conditions`)
      })
      
      mapInstanceRef.current = map
    }
    
    // Cleanup
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove()
        mapInstanceRef.current = null
      }
    }
  }, [])

  // Weather Impact on Delivery Performance
  const weatherPerformanceData = [
    { condition: 'Sunny', normal_time: 25, ai_time: 23, delay_risk: 5, cost_impact: 0 },
    { condition: 'Cloudy', normal_time: 28, ai_time: 25, delay_risk: 12, cost_impact: 5 },
    { condition: 'Light Rain', normal_time: 38, ai_time: 29, delay_risk: 35, cost_impact: 18 },
    { condition: 'Heavy Rain', normal_time: 52, ai_time: 34, delay_risk: 65, cost_impact: 42 },
    { condition: 'Snow', normal_time: 68, ai_time: 41, delay_risk: 85, cost_impact: 60 },
  ]

  // Today's Weather Forecast with AI Adaptation
  const todaysForecast = [
    { time: '9 AM', temp: 22, rain: 10, ai_action: 'Normal routing', confidence: 95 },
    { time: '12 PM', temp: 28, rain: 15, ai_action: 'Monitor conditions', confidence: 92 },
    { time: '3 PM', temp: 31, rain: 35, ai_action: 'Prepare alternatives', confidence: 88 },
    { time: '6 PM', temp: 27, rain: 65, ai_action: 'Activate rain routes', confidence: 94 },
    { time: '9 PM', temp: 24, rain: 45, ai_action: 'Use covered paths', confidence: 91 },
  ]

  // Smart Weather Adaptations
  const weatherAdaptations = [
    {
      weather: 'Rain Detected',
      impact: 'High',
      ai_response: 'Switch to highway routes',
      time_saved: 15,
      risk_reduced: 40
    },
    {
      weather: 'Snow Warning', 
      impact: 'Critical',
      ai_response: 'Use main roads only',
      time_saved: 27,
      risk_reduced: 60
    },
    {
      weather: 'Fog Alert',
      impact: 'Medium',
      ai_response: 'Avoid rural routes',
      time_saved: 8,
      risk_reduced: 25
    }
  ]

  // Current weather status
  const currentWeather = {
    temp: 28,
    humidity: 65,
    rain_chance: 25,
    condition: 'Partly Cloudy',
    ai_recommendation: 'Optimal conditions',
    routes_affected: 2
  }

  const getWeatherIcon = (condition: string) => {
    switch(condition) {
      case 'sunny': return <Sun className="w-6 h-6 text-yellow-500" />
      case 'cloudy': return <Cloud className="w-6 h-6 text-gray-500" />
      case 'rainy': return <CloudRain className="w-6 h-6 text-blue-500" />
      default: return <Sun className="w-6 h-6 text-yellow-500" />
    }
  }

  return (
    <div className="space-y-6">
      {/* Weather Dashboard Header */}
      <div className="bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold mb-2">Weather-Smart Routing</h2>
            <p className="text-blue-100">AI adapts routes based on weather conditions</p>
          </div>
          <div className="flex items-center space-x-4">
            {getWeatherIcon(currentCondition)}
            <div className="text-right">
              <div className="text-2xl font-bold">{currentWeather.temp}°C</div>
              <div className="text-blue-200 text-sm">{currentWeather.condition}</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-4">
          <div className="bg-white/10 rounded-lg p-3 backdrop-blur">
            <div className="flex items-center space-x-2 mb-1">
              <Droplets className="w-4 h-4 text-blue-300" />
              <span className="text-sm">Rain Risk</span>
            </div>
            <p className="text-xl font-bold">{currentWeather.rain_chance}%</p>
          </div>
          <div className="bg-white/10 rounded-lg p-3 backdrop-blur">
            <div className="flex items-center space-x-2 mb-1">
              <Wind className="w-4 h-4 text-cyan-300" />
              <span className="text-sm">Humidity</span>
            </div>
            <p className="text-xl font-bold">{currentWeather.humidity}%</p>
          </div>
          <div className="bg-white/10 rounded-lg p-3 backdrop-blur">
            <div className="flex items-center space-x-2 mb-1">
              <CheckCircle className="w-4 h-4 text-green-300" />
              <span className="text-sm">AI Status</span>
            </div>
            <p className="text-sm font-bold">{currentWeather.ai_recommendation}</p>
          </div>
          <div className="bg-white/10 rounded-lg p-3 backdrop-blur">
            <div className="flex items-center space-x-2 mb-1">
              <AlertTriangle className="w-4 h-4 text-yellow-300" />
              <span className="text-sm">Affected Routes</span>
            </div>
            <p className="text-xl font-bold">{currentWeather.routes_affected}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weather Map */}
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <h3 className="text-lg font-semibold mb-4 text-slate-900 flex items-center space-x-2">
            <MapPin className="w-5 h-5 text-blue-600" />
            <span>Live Weather Conditions</span>
          </h3>
          
          {/* Leaflet Weather Map */}
          <div 
            ref={mapRef}
            className="w-full h-80 rounded-lg border border-slate-300"
            style={{ minHeight: '320px' }}
          />
          
          {/* Load Leaflet CSS */}
          {typeof window !== 'undefined' && (
            <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
          )}
          
          {/* Route Weather Status */}
          <div className="mt-4 space-y-2">
            {weatherRoutes.slice(0, 2).map((route, index) => (
              <div key={index} className={`flex justify-between items-center p-2 rounded text-sm ${
                route.weatherCondition === 'rain' ? 'bg-red-50 border border-red-200' :
                route.weatherCondition === 'fog' ? 'bg-yellow-50 border border-yellow-200' :
                'bg-green-50 border border-green-200'
              }`}>
                <span className={`font-medium ${
                  route.weatherCondition === 'rain' ? 'text-red-800' :
                  route.weatherCondition === 'fog' ? 'text-yellow-800' :
                  'text-green-800'
                }`}>
                  {route.name.split(' →')[0]}
                </span>
                <span className={`${
                  route.weatherCondition === 'rain' ? 'text-red-600' :
                  route.weatherCondition === 'fog' ? 'text-yellow-600' :
                  'text-green-600'
                }`}>
                  {route.aiAction}
                </span>
              </div>
            ))}
            
            {/* Optimize Now Button */}
            <div className="mt-3 pt-3 border-t border-slate-200">
              <button 
                onClick={() => {
                  // Add your optimization logic here
                  console.log('Optimizing routes based on current weather conditions...')
                }}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2"
              >
                <Zap className="w-4 h-4" />
                <span>Optimize Now</span>
              </button>
            </div>
          </div>
        </div>

        {/* Weather Impact on Performance */}
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <h3 className="text-lg font-semibold mb-4 text-slate-900 flex items-center space-x-2">
            <TrendingUp className="w-5 h-5 text-green-600" />
            <span>AI Weather Advantage</span>
          </h3>
          
          <ResponsiveContainer width="100%" height={280}>
            <ComposedChart data={weatherPerformanceData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis 
                dataKey="condition" 
                stroke="#64748b"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis 
                stroke="#64748b"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip 
                formatter={(value, name) => [
                  `${value} min`,
                  name === 'normal_time' ? 'Traditional' : 'AI-Optimized'
                ]}
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
                }}
              />
              
              <Bar dataKey="normal_time" fill="#ef4444" name="normal_time" radius={[2, 2, 0, 0]} />
              <Bar dataKey="ai_time" fill="#10b981" name="ai_time" radius={[2, 2, 0, 0]} />
              <Line type="monotone" dataKey="delay_risk" stroke="#f59e0b" strokeWidth={3} name="delay_risk" dot={{ r: 4 }} />
            </ComposedChart>
          </ResponsiveContainer>
          
          <div className="mt-4 text-center">
            <div className="text-lg font-bold text-green-600">35% Better</div>
            <div className="text-sm text-slate-600">Performance in bad weather</div>
          </div>

          {/* Weather Performance Insights */}
          <div className="mt-4 grid grid-cols-2 gap-4">
            <div className="p-3 bg-green-50 rounded-lg border border-green-200">
              <div className="text-lg font-bold text-green-700">27 min</div>
              <div className="text-xs text-green-600">Avg. time saved in rain</div>
            </div>
            
            <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
              <div className="text-lg font-bold text-blue-700">65%</div>
              <div className="text-xs text-blue-600">Lower delay risk</div>
            </div>
          </div>
        </div>
      </div>

      {/* Today's Forecast & AI Response */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <h3 className="text-lg font-semibold mb-4 text-slate-900 flex items-center space-x-2">
          <Zap className="w-5 h-5 text-purple-600" />
          <span>Today's Forecast & AI Response</span>
        </h3>
        
        <ResponsiveContainer width="100%" height={200}>
          <ComposedChart data={todaysForecast}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis dataKey="time" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis yAxisId="temp" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis yAxisId="rain" orientation="right" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
            <Tooltip formatter={(value, name) => [
              name === 'temp' ? `${value}°C` : `${value}%`,
              name === 'temp' ? 'Temperature' : 'Rain Chance'
            ]} />
            
            <Area yAxisId="rain" type="monotone" dataKey="rain" fill="#3b82f6" fillOpacity={0.3} stroke="#3b82f6" />
            <Line yAxisId="temp" type="monotone" dataKey="temp" stroke="#ef4444" strokeWidth={3} dot={{ r: 4 }} />
          </ComposedChart>
        </ResponsiveContainer>
        
        <div className="mt-4 grid grid-cols-2 gap-4">
          <div className="space-y-2">
            {todaysForecast.slice(2, 4).map((forecast, index) => (
              <div key={index} className="flex justify-between items-center p-2 bg-slate-50 rounded text-sm">
                <span className="font-medium">{forecast.time}</span>
                <span className="text-blue-600">{forecast.ai_action}</span>
                <span className="text-green-600">{forecast.confidence}%</span>
              </div>
            ))}
          </div>
          
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-center space-x-2 mb-2">
              <CheckCircle className="w-4 h-4 text-blue-600" />
              <span className="font-semibold text-blue-800 text-sm">Smart Weather Response</span>
            </div>
            <p className="text-xs text-blue-700">
              AI monitors weather in real-time and automatically reroutes deliveries to avoid delays
            </p>
          </div>
        </div>
      </div>

      {/* Smart Weather Adaptations */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <h3 className="text-lg font-semibold mb-4 text-slate-900 flex items-center space-x-2">
          <Zap className="w-5 h-5 text-yellow-600" />
          <span>Smart Weather Adaptations</span>
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {weatherAdaptations.map((adaptation, index) => (
            <div key={index} className="p-4 border border-slate-200 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold text-slate-900">{adaptation.weather}</h4>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  adaptation.impact === 'Critical' ? 'bg-red-100 text-red-800' :
                  adaptation.impact === 'High' ? 'bg-orange-100 text-orange-800' :
                  'bg-yellow-100 text-yellow-800'
                }`}>
                  {adaptation.impact}
                </span>
              </div>
              
              <div className="space-y-2 text-sm">
                <div>
                  <span className="text-slate-600">AI Response:</span>
                  <div className="font-medium text-blue-600">{adaptation.ai_response}</div>
                </div>
                <div className="flex justify-between">
                  <span className="text-green-600">+{adaptation.time_saved} min saved</span>
                  <span className="text-purple-600">{adaptation.risk_reduced}% safer</span>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex items-center space-x-2">
            <CheckCircle className="w-5 h-5 text-blue-600" />
            <span className="font-semibold text-blue-800">Weather Intelligence Active</span>
          </div>
          <p className="text-sm text-blue-700 mt-1">
            AI automatically switches routes when weather conditions change, reducing delays by up to 35%
          </p>
        </div>
      </div>
    </div>
  )
}