// components/MLAnalytics.tsx
'use client'

import React, { useState } from 'react'
import { OptimizationResult, Location, Vehicle, OptimizationConfig } from '@/lib/types'
import { Cloud, Navigation, MapPin, Clock, Activity, Zap, Users } from 'lucide-react'

// Import the sub-components
import TrafficAnalysis from './analytics/TrafficAnalysis'
import WeatherAnalysis from './analytics/WeatherAnalysis'
import CustomerAnalytics from './analytics/CustomerAnalytics'
import MLPerformance from './analytics/MLPerformance'

interface MLAnalyticsProps {
  results: OptimizationResult | null
  locations: Location[]
  vehicles: Vehicle[]
  config: OptimizationConfig
}

export default function MLAnalytics({ results, locations, vehicles, config }: MLAnalyticsProps) {
  const [activeAnalysis, setActiveAnalysis] = useState<'traffic' | 'weather' | 'training' | 'customer'>('traffic')

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

      {/* Render the appropriate analysis component */}
      {activeAnalysis === 'traffic' && <TrafficAnalysis />}
      {activeAnalysis === 'weather' && <WeatherAnalysis />}
      {activeAnalysis === 'customer' && <CustomerAnalytics />}
      {activeAnalysis === 'training' && <MLPerformance />}
    </div>
  )
}