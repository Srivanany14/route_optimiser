// components/MLAnalytics.tsx
'use client'

import React, { useState } from 'react'
import { OptimizationResult, Location, Vehicle, OptimizationConfig } from '@/lib/types'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, AreaChart, Area, ScatterChart, Scatter, PieChart, Pie, Cell, ComposedChart, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts'
import { Cloud, Navigation, TrendingUp, MapPin, Clock, Thermometer, Wind, Droplets, Activity, Zap, Users, Star, ThumbsUp, AlertTriangle } from 'lucide-react'

interface MLAnalyticsProps {
  results: OptimizationResult | null
  locations: Location[]
  vehicles: Vehicle[]
  config: OptimizationConfig
}

export default function MLAnalytics({ results, locations, vehicles, config }: MLAnalyticsProps) {
  const [activeAnalysis, setActiveAnalysis] = useState<'traffic' | 'weather' | 'training' | 'customer'>('traffic')

  // Enhanced traffic prediction with more data points
  const trafficPrediction = [
    { time: '06:00', current: 0.3, predicted: 0.32, confidence: 0.92, vehicles: 120, avg_speed: 45 },
    { time: '06:30', current: 0.45, predicted: 0.48, confidence: 0.90, vehicles: 180, avg_speed: 38 },
    { time: '07:00', current: 0.6, predicted: 0.65, confidence: 0.89, vehicles: 250, avg_speed: 32 },
    { time: '07:30', current: 0.75, predicted: 0.78, confidence: 0.91, vehicles: 320, avg_speed: 28 },
    { time: '08:00', current: 0.9, predicted: 0.92, confidence: 0.94, vehicles: 410, avg_speed: 22 },
    { time: '08:30', current: 0.85, predicted: 0.88, confidence: 0.93, vehicles: 380, avg_speed: 25 },
    { time: '09:00', current: 0.8, predicted: 0.82, confidence: 0.91, vehicles: 340, avg_speed: 30 },
    { time: '09:30', current: 0.65, predicted: 0.68, confidence: 0.89, vehicles: 280, avg_speed: 35 },
    { time: '10:00', current: 0.5, predicted: 0.52, confidence: 0.88, vehicles: 220, avg_speed: 42 },
    { time: '10:30', current: 0.45, predicted: 0.47, confidence: 0.90, vehicles: 200, avg_speed: 44 },
    { time: '11:00', current: 0.4, predicted: 0.42, confidence: 0.93, vehicles: 180, avg_speed: 46 },
    { time: '11:30', current: 0.55, predicted: 0.58, confidence: 0.87, vehicles: 240, avg_speed: 38 },
    { time: '12:00', current: 0.7, predicted: 0.72, confidence: 0.85, vehicles: 300, avg_speed: 32 },
    { time: '12:30', current: 0.75, predicted: 0.77, confidence: 0.88, vehicles: 320, avg_speed: 30 },
    { time: '13:00', current: 0.8, predicted: 0.78, confidence: 0.95, vehicles: 350, avg_speed: 28 },
    { time: '13:30', current: 0.7, predicted: 0.72, confidence: 0.92, vehicles: 310, avg_speed: 32 },
    { time: '14:00', current: 0.6, predicted: 0.62, confidence: 0.89, vehicles: 260, avg_speed: 36 },
    { time: '14:30', current: 0.55, predicted: 0.58, confidence: 0.91, vehicles: 240, avg_speed: 38 },
    { time: '15:00', current: 0.5, predicted: 0.52, confidence: 0.89, vehicles: 220, avg_speed: 42 },
    { time: '15:30', current: 0.65, predicted: 0.68, confidence: 0.86, vehicles: 280, avg_speed: 35 },
    { time: '16:00', current: 0.8, predicted: 0.82, confidence: 0.91, vehicles: 350, avg_speed: 28 },
    { time: '16:30', current: 0.9, predicted: 0.92, confidence: 0.89, vehicles: 390, avg_speed: 24 },
    { time: '17:00', current: 0.95, predicted: 0.97, confidence: 0.86, vehicles: 420, avg_speed: 20 },
    { time: '17:30', current: 0.92, predicted: 0.94, confidence: 0.88, vehicles: 400, avg_speed: 22 },
    { time: '18:00', current: 0.9, predicted: 0.88, confidence: 0.94, vehicles: 380, avg_speed: 25 }
  ]

  // Enhanced route traffic with congestion levels
  const routeTrafficImpact = [
    { route: 'Main St → Downtown', baseline_time: 25, current_time: 32, predicted_time: 28, traffic_index: 0.8, congestion_level: 'High', fuel_cost: 15.2 },
    { route: 'Highway → Industrial', baseline_time: 18, current_time: 22, predicted_time: 20, traffic_index: 0.6, congestion_level: 'Medium', fuel_cost: 12.8 },
    { route: 'Suburbs → Central', baseline_time: 15, current_time: 19, predicted_time: 17, traffic_index: 0.7, congestion_level: 'Medium', fuel_cost: 11.5 },
    { route: 'Airport → City', baseline_time: 22, current_time: 35, predicted_time: 29, traffic_index: 0.9, congestion_level: 'Very High', fuel_cost: 18.6 },
    { route: 'Port → Warehouse', baseline_time: 12, current_time: 14, predicted_time: 13, traffic_index: 0.4, congestion_level: 'Low', fuel_cost: 8.9 },
    { route: 'Mall → Residential', baseline_time: 20, current_time: 26, predicted_time: 23, traffic_index: 0.65, congestion_level: 'Medium', fuel_cost: 14.1 }
  ]

  // Enhanced weather data with more metrics
  const weatherForecast = [
    { time: '09:00', temp: 22, humidity: 65, wind: 12, rain_prob: 10, visibility: 15, pressure: 1013, delivery_impact: 'Low', uv_index: 3 },
    { time: '10:00', temp: 24, humidity: 60, wind: 10, rain_prob: 8, visibility: 16, pressure: 1014, delivery_impact: 'Low', uv_index: 4 },
    { time: '11:00', temp: 26, humidity: 58, wind: 9, rain_prob: 5, visibility: 18, pressure: 1015, delivery_impact: 'Low', uv_index: 5 },
    { time: '12:00', temp: 28, humidity: 55, wind: 8, rain_prob: 5, visibility: 20, pressure: 1015, delivery_impact: 'Low', uv_index: 6 },
    { time: '13:00', temp: 30, humidity: 50, wind: 12, rain_prob: 15, visibility: 18, pressure: 1014, delivery_impact: 'Low', uv_index: 7 },
    { time: '14:00', temp: 31, humidity: 48, wind: 15, rain_prob: 20, visibility: 16, pressure: 1013, delivery_impact: 'Medium', uv_index: 7 },
    { time: '15:00', temp: 31, humidity: 45, wind: 15, rain_prob: 25, visibility: 14, pressure: 1012, delivery_impact: 'Medium', uv_index: 6 },
    { time: '16:00', temp: 29, humidity: 55, wind: 18, rain_prob: 40, visibility: 12, pressure: 1011, delivery_impact: 'Medium', uv_index: 5 },
    { time: '17:00', temp: 28, humidity: 65, wind: 20, rain_prob: 55, visibility: 10, pressure: 1010, delivery_impact: 'High', uv_index: 4 },
    { time: '18:00', temp: 26, humidity: 70, wind: 20, rain_prob: 60, visibility: 8, pressure: 1009, delivery_impact: 'High', uv_index: 3 },
    { time: '19:00', temp: 25, humidity: 75, wind: 22, rain_prob: 70, visibility: 6, pressure: 1008, delivery_impact: 'High', uv_index: 2 },
    { time: '20:00', temp: 24, humidity: 78, wind: 24, rain_prob: 75, visibility: 5, pressure: 1007, delivery_impact: 'Very High', uv_index: 1 },
    { time: '21:00', temp: 23, humidity: 80, wind: 25, rain_prob: 80, visibility: 4, pressure: 1006, delivery_impact: 'Very High', uv_index: 0 }
  ]

  const weatherImpactAnalysis = [
    { condition: 'Clear Sky', delivery_delay: 0, cost_increase: 0, success_rate: 98.5, customer_satisfaction: 4.8 },
    { condition: 'Partly Cloudy', delivery_delay: 2, cost_increase: 1, success_rate: 97.8, customer_satisfaction: 4.7 },
    { condition: 'Light Rain', delivery_delay: 8, cost_increase: 5, success_rate: 95.2, customer_satisfaction: 4.4 },
    { condition: 'Heavy Rain', delivery_delay: 25, cost_increase: 15, success_rate: 87.3, customer_satisfaction: 3.9 },
    { condition: 'Snow', delivery_delay: 45, cost_increase: 30, success_rate: 78.1, customer_satisfaction: 3.5 },
    { condition: 'Storm', delivery_delay: 120, cost_increase: 60, success_rate: 65.8, customer_satisfaction: 2.8 }
  ]

  // Customer satisfaction data
  const customerSatisfactionData = [
    { time_slot: '8-9 AM', satisfaction: 4.8, delivery_count: 45, on_time_rate: 96, avg_rating: 4.8 },
    { time_slot: '9-10 AM', satisfaction: 4.7, delivery_count: 52, on_time_rate: 94, avg_rating: 4.7 },
    { time_slot: '10-11 AM', satisfaction: 4.9, delivery_count: 38, on_time_rate: 98, avg_rating: 4.9 },
    { time_slot: '11-12 PM', satisfaction: 4.6, delivery_count: 41, on_time_rate: 92, avg_rating: 4.6 },
    { time_slot: '12-1 PM', satisfaction: 4.2, delivery_count: 35, on_time_rate: 85, avg_rating: 4.2 },
    { time_slot: '1-2 PM', satisfaction: 4.4, delivery_count: 43, on_time_rate: 88, avg_rating: 4.4 },
    { time_slot: '2-3 PM', satisfaction: 4.7, delivery_count: 48, on_time_rate: 93, avg_rating: 4.7 },
    { time_slot: '3-4 PM', satisfaction: 4.5, delivery_count: 50, on_time_rate: 90, avg_rating: 4.5 },
    { time_slot: '4-5 PM', satisfaction: 4.3, delivery_count: 55, on_time_rate: 87, avg_rating: 4.3 },
    { time_slot: '5-6 PM', satisfaction: 4.1, delivery_count: 62, on_time_rate: 82, avg_rating: 4.1 },
    { time_slot: '6-7 PM', satisfaction: 3.9, delivery_count: 58, on_time_rate: 78, avg_rating: 3.9 },
    { time_slot: '7-8 PM', satisfaction: 4.0, delivery_count: 47, on_time_rate: 80, avg_rating: 4.0 }
  ]

  const deliveryTimeAnalysis = [
    { delivery_window: 'Same Day', satisfaction: 4.9, preference: 35, premium_willingness: 85 },
    { delivery_window: 'Next Day', satisfaction: 4.6, preference: 45, premium_willingness: 60 },
    { delivery_window: '2-3 Days', satisfaction: 4.2, preference: 15, premium_willingness: 25 },
    { delivery_window: '3-5 Days', satisfaction: 3.8, preference: 5, premium_willingness: 10 }
  ]

  const customerFeedbackTrends = [
    { month: 'Jan', satisfaction: 4.2, complaints: 12, compliments: 78, delivery_speed: 4.1 },
    { month: 'Feb', satisfaction: 4.3, complaints: 10, compliments: 82, delivery_speed: 4.2 },
    { month: 'Mar', satisfaction: 4.5, complaints: 8, compliments: 89, delivery_speed: 4.4 },
    { month: 'Apr', satisfaction: 4.4, complaints: 9, compliments: 85, delivery_speed: 4.3 },
    { month: 'May', satisfaction: 4.6, complaints: 7, compliments: 94, delivery_speed: 4.5 },
    { month: 'Jun', satisfaction: 4.7, complaints: 6, compliments: 98, delivery_speed: 4.6 },
    { month: 'Jul', satisfaction: 4.8, complaints: 5, compliments: 102, delivery_speed: 4.7 }
  ]

  const satisfactionFactors = [
    { factor: 'On-Time Delivery', importance: 95, current_score: 92 },
    { factor: 'Package Condition', importance: 88, current_score: 96 },
    { factor: 'Delivery Speed', importance: 82, current_score: 90 },
    { factor: 'Communication', importance: 76, current_score: 86 },
    { factor: 'Delivery Person', importance: 71, current_score: 94 },
    { factor: 'Tracking Accuracy', importance: 68, current_score: 88 }
  ]
  const trainingMetrics = [
    { epoch: 0, loss: 2.45, traffic_mse: 0.089, weather_mae: 0.156, route_accuracy: 0.72 },
    { epoch: 10, loss: 1.23, traffic_mse: 0.045, weather_mae: 0.089, route_accuracy: 0.84 },
    { epoch: 20, loss: 0.65, traffic_mse: 0.028, weather_mae: 0.052, route_accuracy: 0.91 },
    { epoch: 30, loss: 0.43, traffic_mse: 0.019, weather_mae: 0.034, route_accuracy: 0.95 },
    { epoch: 40, loss: 0.35, traffic_mse: 0.015, weather_mae: 0.028, route_accuracy: 0.97 },
    { epoch: 50, loss: 0.31, traffic_mse: 0.012, weather_mae: 0.024, route_accuracy: 0.98 }
  ]

  const modelPerformance = [
    { metric: 'Traffic Prediction Accuracy', value: 94.7, unit: '%' },
    { metric: 'Weather Forecast RMSE', value: 2.3, unit: '°C' },
    { metric: 'Route Optimization Score', value: 97.8, unit: '%' },
    { metric: 'Real-time Inference', value: 23, unit: 'ms' },
    { metric: 'Model Size', value: 8.2, unit: 'MB' },
    { metric: 'GPU Memory Usage', value: 512, unit: 'MB' }
  ]

  if (!results) {
    return (
      <div className="p-6">
        <div className="bg-white rounded-xl border border-slate-200 p-16 text-center">
          <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Activity className="w-10 h-10 text-slate-400" />
          </div>
          <h3 className="text-xl font-semibold text-slate-900 mb-3">No Analytics Available</h3>
          <p className="text-slate-600 mb-8 max-w-md mx-auto">
            Run the route optimization to generate traffic predictions, weather analytics, and ML insights.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-50 to-emerald-50 rounded-xl p-6 border border-blue-200">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Predictive Analytics Dashboard</h2>
            <p className="text-slate-600">Real-time traffic, weather forecasting & ML performance insights</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 bg-white rounded-lg px-3 py-2 border">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-slate-700">Live Data</span>
            </div>
            <div className="flex items-center space-x-2 bg-white rounded-lg px-3 py-2 border">
              <Zap className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-600">AI-Powered</span>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-4 gap-4">
          <div className="bg-white rounded-lg p-4 border border-slate-200">
            <div className="flex items-center space-x-2 mb-1">
              <Navigation className="w-4 h-4 text-blue-600" />
              <span className="text-xs font-medium text-slate-600">Traffic Accuracy</span>
            </div>
            <p className="text-lg font-bold text-slate-900">94.7%</p>
          </div>
          <div className="bg-white rounded-lg p-4 border border-slate-200">
            <div className="flex items-center space-x-2 mb-1">
              <Cloud className="w-4 h-4 text-emerald-600" />
              <span className="text-xs font-medium text-slate-600">Weather RMSE</span>
            </div>
            <p className="text-lg font-bold text-slate-900">2.3°C</p>
          </div>
          <div className="bg-white rounded-lg p-4 border border-slate-200">
            <div className="flex items-center space-x-2 mb-1">
              <MapPin className="w-4 h-4 text-purple-600" />
              <span className="text-xs font-medium text-slate-600">Route Score</span>
            </div>
            <p className="text-lg font-bold text-slate-900">97.8%</p>
          </div>
          <div className="bg-white rounded-lg p-4 border border-slate-200">
            <div className="flex items-center space-x-2 mb-1">
              <Clock className="w-4 h-4 text-amber-600" />
              <span className="text-xs font-medium text-slate-600">Inference</span>
            </div>
            <p className="text-lg font-bold text-slate-900">23ms</p>
          </div>
        </div>
      </div>

      {/* Analysis Navigation */}
      <div className="bg-white rounded-xl border border-slate-200 p-2">
        <nav className="flex space-x-1">
          {[
            { id: 'traffic', label: 'Traffic Prediction', icon: Navigation },
            { id: 'weather', label: 'Weather Analytics', icon: Cloud },
            { id: 'customer', label: 'Customer Insights', icon: Users },
            { id: 'training', label: 'ML Performance', icon: Activity }
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveAnalysis(id as any)}
              className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-lg text-sm font-medium transition-colors ${
                activeAnalysis === id
                  ? 'bg-blue-100 text-blue-700 border border-blue-200'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Traffic Analysis */}
      {activeAnalysis === 'traffic' && (
        <div className="space-y-6">
          {/* Enhanced Real-time Traffic Prediction */}
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <h3 className="text-lg font-semibold mb-4 text-slate-900 flex items-center space-x-2">
              <Navigation className="w-5 h-5 text-blue-600" />
              <span>Real-time Traffic Prediction & Vehicle Density</span>
            </h3>
            <ResponsiveContainer width="100%" height={350}>
              <ComposedChart data={trafficPrediction}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis yAxisId="traffic" domain={[0, 1]} />
                <YAxis yAxisId="vehicles" orientation="right" />
                <Tooltip formatter={(value, name) => [
                  name === 'current' || name === 'predicted' ? `${(value * 100).toFixed(0)}%` : 
                  name === 'confidence' ? `${(value * 100).toFixed(1)}%` :
                  name === 'vehicles' ? `${value} vehicles` :
                  `${value} km/h`,
                  name === 'current' ? 'Current Traffic' :
                  name === 'predicted' ? 'Predicted Traffic' : 
                  name === 'confidence' ? 'Confidence' :
                  name === 'vehicles' ? 'Vehicle Count' : 'Avg Speed'
                ]} />
                <Area yAxisId="traffic" type="monotone" dataKey="confidence" fill="#f59e0b" fillOpacity={0.2} stroke="none" />
                <Line yAxisId="traffic" type="monotone" dataKey="current" stroke="#3b82f6" strokeWidth={3} name="current" />
                <Line yAxisId="traffic" type="monotone" dataKey="predicted" stroke="#10b981" strokeWidth={3} strokeDasharray="5 5" name="predicted" />
                <Bar yAxisId="vehicles" dataKey="vehicles" fill="#8b5cf6" fillOpacity={0.3} name="vehicles" />
                <Line yAxisId="vehicles" type="monotone" dataKey="avg_speed" stroke="#ef4444" strokeWidth={2} name="avg_speed" />
              </ComposedChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Enhanced Route-specific Traffic Impact */}
            <div className="bg-white rounded-xl border border-slate-200 p-6">
              <h3 className="text-lg font-semibold mb-4 text-slate-900">Route Performance & Costs</h3>
              <ResponsiveContainer width="100%" height={300}>
                <ComposedChart data={routeTrafficImpact}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="route" angle={-45} textAnchor="end" height={100} />
                  <YAxis yAxisId="time" />
                  <YAxis yAxisId="cost" orientation="right" />
                  <Tooltip />
                  <Bar yAxisId="time" dataKey="baseline_time" fill="#e2e8f0" name="Baseline Time (min)" />
                  <Bar yAxisId="time" dataKey="current_time" fill="#ef4444" name="Current Time (min)" />
                  <Bar yAxisId="time" dataKey="predicted_time" fill="#10b981" name="Predicted Time (min)" />
                  <Line yAxisId="cost" type="monotone" dataKey="fuel_cost" stroke="#f59e0b" strokeWidth={3} name="Fuel Cost ($)" />
                </ComposedChart>
              </ResponsiveContainer>
              
              {/* Congestion Level Indicators */}
              <div className="mt-4 space-y-2">
                {routeTrafficImpact.map((route, index) => (
                  <div key={index} className="flex justify-between items-center p-2 bg-slate-50 rounded">
                    <span className="text-sm font-medium text-slate-700">{route.route}</span>
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        route.congestion_level === 'Very High' ? 'bg-red-100 text-red-800' :
                        route.congestion_level === 'High' ? 'bg-orange-100 text-orange-800' :
                        route.congestion_level === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {route.congestion_level}
                      </span>
                      <span className="text-xs text-slate-500">${route.fuel_cost}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Traffic Congestion Heatmap */}
            <div className="bg-white rounded-xl border border-slate-200 p-6">
              <h3 className="text-lg font-semibold mb-4 text-slate-900">Traffic Congestion Zones</h3>
              <div className="grid grid-cols-8 gap-1 h-48">
                {Array.from({ length: 64 }, (_, i) => {
                  const intensity = Math.sin(i * 0.3) * Math.cos(i * 0.2) + 1
                  return (
                    <div
                      key={i}
                      className="rounded-sm transition-opacity duration-300 hover:opacity-80"
                      style={{
                        backgroundColor: intensity > 1.5 ? '#ef4444' : intensity > 1 ? '#f59e0b' : intensity > 0.5 ? '#10b981' : '#3b82f6',
                        opacity: 0.3 + intensity * 0.4
                      }}
                      title={`Zone ${i + 1}: ${intensity > 1.5 ? 'Heavy' : intensity > 1 ? 'Moderate' : intensity > 0.5 ? 'Light' : 'Clear'} Traffic`}
                    />
                  )
                })}
              </div>
              <div className="flex justify-between items-center mt-4 text-xs">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-blue-600 rounded-sm opacity-70"></div>
                  <span>Clear</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-emerald-600 rounded-sm opacity-70"></div>
                  <span>Light</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-amber-600 rounded-sm opacity-70"></div>
                  <span>Moderate</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-red-600 rounded-sm opacity-70"></div>
                  <span>Heavy</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Weather Analysis */}
      {activeAnalysis === 'weather' && (
        <div className="space-y-6">
          {/* Enhanced Weather Forecast */}
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <h3 className="text-lg font-semibold mb-4 text-slate-900 flex items-center space-x-2">
              <Cloud className="w-5 h-5 text-blue-600" />
              <span>Weather Forecast & Multi-Parameter Analysis</span>
            </h3>
            <ResponsiveContainer width="100%" height={350}>
              <ComposedChart data={weatherForecast}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis yAxisId="temp" orientation="left" />
                <YAxis yAxisId="rain" orientation="right" />
                <Tooltip formatter={(value, name) => [
                  name === 'temp' ? `${value}°C` :
                  name === 'rain_prob' ? `${value}%` :
                  name === 'humidity' ? `${value}%` :
                  name === 'wind' ? `${value} km/h` :
                  name === 'pressure' ? `${value} hPa` :
                  `${value} km`,
                  name === 'temp' ? 'Temperature' :
                  name === 'rain_prob' ? 'Rain Probability' :
                  name === 'humidity' ? 'Humidity' :
                  name === 'wind' ? 'Wind Speed' :
                  name === 'pressure' ? 'Pressure' : 'Visibility'
                ]} />
                <Area yAxisId="temp" type="monotone" dataKey="temp" stackId="1" stroke="#ef4444" fill="#ef4444" fillOpacity={0.3} name="temp" />
                <Area yAxisId="rain" type="monotone" dataKey="rain_prob" stackId="2" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.3} name="rain_prob" />
                <Line yAxisId="temp" type="monotone" dataKey="humidity" stroke="#10b981" strokeWidth={2} name="humidity" />
                <Line yAxisId="rain" type="monotone" dataKey="wind" stroke="#f59e0b" strokeWidth={2} name="wind" />
                <Line yAxisId="temp" type="monotone" dataKey="visibility" stroke="#8b5cf6" strokeWidth={2} name="visibility" />
              </ComposedChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Enhanced Weather Impact Analysis */}
            <div className="bg-white rounded-xl border border-slate-200 p-6">
              <h3 className="text-lg font-semibold mb-4 text-slate-900">Weather Impact on Operations</h3>
              <ResponsiveContainer width="100%" height={300}>
                <ComposedChart data={weatherImpactAnalysis}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="condition" angle={-45} textAnchor="end" height={80} />
                  <YAxis yAxisId="delay" />
                  <YAxis yAxisId="satisfaction" orientation="right" domain={[0, 5]} />
                  <Tooltip />
                  <Bar yAxisId="delay" dataKey="delivery_delay" fill="#ef4444" name="Avg Delay (min)" />
                  <Bar yAxisId="delay" dataKey="cost_increase" fill="#f59e0b" name="Cost Increase %" />
                  <Line yAxisId="satisfaction" type="monotone" dataKey="customer_satisfaction" stroke="#10b981" strokeWidth={3} name="Customer Rating" />
                  <Line yAxisId="satisfaction" type="monotone" dataKey="success_rate" stroke="#3b82f6" strokeWidth={2} name="Success Rate %" />
                </ComposedChart>
              </ResponsiveContainer>
            </div>

            {/* Weather Alerts and Recommendations */}
            <div className="bg-white rounded-xl border border-slate-200 p-6">
              <h3 className="text-lg font-semibold mb-4 text-slate-900">Weather Alerts & Recommendations</h3>
              
              {/* Current Alert */}
              <div className="mb-4 p-4 bg-amber-50 rounded-lg border border-amber-200">
                <div className="flex items-center space-x-2 mb-2">
                  <AlertTriangle className="w-5 h-5 text-amber-600" />
                  <span className="font-semibold text-amber-800">Weather Advisory</span>
                </div>
                <p className="text-sm text-amber-700">
                  Rain probability increasing to 80% by evening. Consider rescheduling non-urgent deliveries after 6 PM.
                </p>
              </div>

              {/* Detailed Current Conditions */}
              <div className="grid grid-cols-2 gap-3">
                <div className="text-center p-3 bg-gradient-to-br from-orange-50 to-red-50 rounded-lg border border-orange-200">
                  <Thermometer className="w-6 h-6 text-orange-600 mx-auto mb-1" />
                  <p className="text-xl font-bold text-orange-900">28°C</p>
                  <p className="text-xs text-orange-700">Temperature</p>
                </div>
                <div className="text-center p-3 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg border border-blue-200">
                  <Droplets className="w-6 h-6 text-blue-600 mx-auto mb-1" />
                  <p className="text-xl font-bold text-blue-900">55%</p>
                  <p className="text-xs text-blue-700">Humidity</p>
                </div>
                <div className="text-center p-3 bg-gradient-to-br from-gray-50 to-slate-50 rounded-lg border border-gray-200">
                  <Wind className="w-6 h-6 text-gray-600 mx-auto mb-1" />
                  <p className="text-xl font-bold text-gray-900">8 km/h</p>
                  <p className="text-xs text-gray-700">Wind Speed</p>
                </div>
                <div className="text-center p-3 bg-gradient-to-br from-purple-50 to-indigo-50 rounded-lg border border-purple-200">
                  <Cloud className="w-6 h-6 text-purple-600 mx-auto mb-1" />
                  <p className="text-xl font-bold text-purple-900">25%</p>
                  <p className="text-xs text-purple-700">Rain Chance</p>
                </div>
              </div>

              {/* Hourly Recommendations */}
              <div className="mt-4 space-y-2">
                <h4 className="font-medium text-slate-900">Delivery Recommendations:</h4>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between items-center p-2 bg-green-50 rounded border border-green-200">
                    <span className="text-green-800">Morning (9-12 PM)</span>
                    <span className="text-green-600 font-medium">Optimal</span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-yellow-50 rounded border border-yellow-200">
                    <span className="text-yellow-800">Afternoon (3-6 PM)</span>
                    <span className="text-yellow-600 font-medium">Caution</span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-red-50 rounded border border-red-200">
                    <span className="text-red-800">Evening (6+ PM)</span>
                    <span className="text-red-600 font-medium">High Risk</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Customer Satisfaction Analysis */}
      {activeAnalysis === 'customer' && (
        <div className="space-y-6">
          {/* Customer Satisfaction by Time Slot */}
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <h3 className="text-lg font-semibold mb-4 text-slate-900 flex items-center space-x-2">
              <Users className="w-5 h-5 text-purple-600" />
              <span>Customer Satisfaction vs Delivery Time Analysis</span>
            </h3>
            <ResponsiveContainer width="100%" height={350}>
              <ComposedChart data={customerSatisfactionData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time_slot" />
                <YAxis yAxisId="satisfaction" domain={[0, 5]} />
                <YAxis yAxisId="count" orientation="right" />
                <Tooltip formatter={(value, name) => [
                  name === 'satisfaction' || name === 'avg_rating' ? `${value}/5.0` :
                  name === 'on_time_rate' ? `${value}%` :
                  `${value} deliveries`,
                  name === 'satisfaction' ? 'Satisfaction Score' :
                  name === 'avg_rating' ? 'Average Rating' :
                  name === 'on_time_rate' ? 'On-Time Rate' : 'Delivery Count'
                ]} />
                <Area yAxisId="satisfaction" type="monotone" dataKey="on_time_rate" fill="#10b981" fillOpacity={0.2} stroke="none" />
                <Line yAxisId="satisfaction" type="monotone" dataKey="satisfaction" stroke="#8b5cf6" strokeWidth={4} name="satisfaction" />
                <Line yAxisId="satisfaction" type="monotone" dataKey="on_time_rate" stroke="#10b981" strokeWidth={2} name="on_time_rate" />
                <Bar yAxisId="count" dataKey="delivery_count" fill="#3b82f6" fillOpacity={0.6} name="delivery_count" />
              </ComposedChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Delivery Time Preferences */}
            <div className="bg-white rounded-xl border border-slate-200 p-6">
              <h3 className="text-lg font-semibold mb-4 text-slate-900">Delivery Time Preferences & Satisfaction</h3>
              <ResponsiveContainer width="100%" height={300}>
                <ComposedChart data={deliveryTimeAnalysis}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="delivery_window" />
                  <YAxis yAxisId="satisfaction" domain={[0, 5]} />
                  <YAxis yAxisId="preference" orientation="right" />
                  <Tooltip />
                  <Bar yAxisId="preference" dataKey="preference" fill="#f59e0b" fillOpacity={0.7} name="Customer Preference %" />
                  <Bar yAxisId="preference" dataKey="premium_willingness" fill="#ef4444" fillOpacity={0.7} name="Premium Willingness %" />
                  <Line yAxisId="satisfaction" type="monotone" dataKey="satisfaction" stroke="#10b981" strokeWidth={3} name="Satisfaction Score" />
                </ComposedChart>
              </ResponsiveContainer>
            </div>

            {/* Satisfaction Factors Radar */}
            <div className="bg-white rounded-xl border border-slate-200 p-6">
              <h3 className="text-lg font-semibold mb-4 text-slate-900">Key Satisfaction Factors</h3>
              <ResponsiveContainer width="100%" height={300}>
                <RadarChart data={satisfactionFactors}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="factor" />
                  <PolarRadiusAxis angle={90} domain={[0, 100]} />
                  <Tooltip />
                  <Radar name="Importance" dataKey="importance" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.3} strokeWidth={2} />
                  <Radar name="Current Score" dataKey="current_score" stroke="#10b981" fill="#10b981" fillOpacity={0.3} strokeWidth={2} />
                </RadarChart>
              </ResponsiveContainer>
              
              {/* Factor Analysis */}
              <div className="mt-4 space-y-2">
                {satisfactionFactors.map((factor, index) => (
                  <div key={index} className="flex justify-between items-center p-2 bg-slate-50 rounded">
                    <span className="text-sm font-medium text-slate-700">{factor.factor}</span>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs text-blue-600">Imp: {factor.importance}%</span>
                      <span className="text-xs text-green-600">Score: {factor.current_score}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Customer Feedback Trends */}
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <h3 className="text-lg font-semibold mb-4 text-slate-900">Customer Feedback Trends & Sentiment Analysis</h3>
            <ResponsiveContainer width="100%" height={300}>
              <ComposedChart data={customerFeedbackTrends}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis yAxisId="satisfaction" domain={[0, 5]} />
                <YAxis yAxisId="feedback" orientation="right" />
                <Tooltip />
                <Area yAxisId="satisfaction" type="monotone" dataKey="satisfaction" fill="#8b5cf6" fillOpacity={0.3} stroke="#8b5cf6" strokeWidth={3} name="Overall Satisfaction" />
                <Line yAxisId="satisfaction" type="monotone" dataKey="delivery_speed" stroke="#10b981" strokeWidth={2} name="Delivery Speed Rating" />
                <Bar yAxisId="feedback" dataKey="compliments" fill="#10b981" fillOpacity={0.7} name="Compliments" />
                <Bar yAxisId="feedback" dataKey="complaints" fill="#ef4444" fillOpacity={0.7} name="Complaints" />
              </ComposedChart>
            </ResponsiveContainer>
            
            {/* Key Insights */}
            <div className="mt-4 grid grid-cols-3 gap-4">
              <div className="text-center p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg border border-green-200">
                <ThumbsUp className="w-8 h-8 text-green-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-green-900">102</p>
                <p className="text-sm text-green-700">Compliments This Month</p>
              </div>
              <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
                <Star className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-blue-900">4.8/5</p>
                <p className="text-sm text-blue-700">Average Rating</p>
              </div>
              <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg border border-purple-200">
                <TrendingUp className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-purple-900">+14%</p>
                <p className="text-sm text-purple-700">Satisfaction Growth</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ML Training Analysis */}
      {activeAnalysis === 'training' && (
        <div className="space-y-6">
          {/* Training Progress */}
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <h3 className="text-lg font-semibold mb-4 text-slate-900 flex items-center space-x-2">
              <Activity className="w-5 h-5 text-purple-600" />
              <span>Model Training Progress</span>
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={trainingMetrics}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="epoch" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="loss" stroke="#8b5cf6" strokeWidth={2} name="Overall Loss" />
                <Line type="monotone" dataKey="traffic_mse" stroke="#3b82f6" strokeWidth={2} name="Traffic MSE" />
                <Line type="monotone" dataKey="weather_mae" stroke="#10b981" strokeWidth={2} name="Weather MAE" />
                <Line type="monotone" dataKey="route_accuracy" stroke="#f59e0b" strokeWidth={2} name="Route Accuracy" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Model Performance Metrics */}
            <div className="bg-white rounded-xl border border-slate-200 p-6">
              <h3 className="text-lg font-semibold mb-4 text-slate-900">Performance Metrics</h3>
              <div className="space-y-4">
                {modelPerformance.map((metric, index) => (
                  <div key={index} className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                    <span className="text-sm font-medium text-slate-700">{metric.metric}</span>
                    <div className="text-right">
                      <span className="text-lg font-bold text-slate-900">{metric.value}</span>
                      <span className="text-sm text-slate-500 ml-1">{metric.unit}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Model Architecture Summary */}
            <div className="bg-white rounded-xl border border-slate-200 p-6">
              <h3 className="text-lg font-semibold mb-4 text-slate-900">Model Architecture</h3>
              <div className="space-y-4">
                <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200">
                  <h4 className="font-semibold text-blue-900 mb-2">Traffic Prediction Network</h4>
                  <div className="text-sm space-y-1">
                    <p className="text-blue-800">• LSTM + Attention (256 units)</p>
                    <p className="text-blue-800">• Temporal CNN layers</p>
                    <p className="text-blue-800">• Dropout: 0.2, BatchNorm</p>
                  </div>
                </div>
                
                <div className="p-4 bg-gradient-to-r from-emerald-50 to-cyan-50 rounded-lg border border-emerald-200">
                  <h4 className="font-semibold text-emerald-900 mb-2">Weather Forecasting</h4>
                  <div className="text-sm space-y-1">
                    <p className="text-emerald-800">• Transformer Encoder (128d)</p>
                    <p className="text-emerald-800">• Multi-head attention (8 heads)</p>
                    <p className="text-emerald-800">• Positional encoding</p>
                  </div>
                </div>
                
                <div className="p-4 bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg border border-amber-200">
                  <h4 className="font-semibold text-amber-900 mb-2">Route Optimization</h4>
                  <div className="text-sm space-y-1">
                    <p className="text-amber-800">• Graph Neural Network</p>
                    <p className="text-amber-800">• Pointer Network decoder</p>
                    <p className="text-amber-800">• Reinforcement learning (PPO)</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}