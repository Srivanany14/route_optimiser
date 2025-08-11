// components/analytics/MLPerformance.tsx
'use client'

import React from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { Activity } from 'lucide-react'

interface MLPerformanceProps {
  // Add any props needed from the parent component
}

export default function MLPerformance({ }: MLPerformanceProps) {
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

  return (
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
  )
}