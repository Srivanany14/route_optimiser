// app/workspace/page.tsx
'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { Location, Vehicle, OptimizationResult, OptimizationConfig } from '@/lib/types'
import LocationInput from '@/components/LocationInput'
import VehicleInput from '@/components/VehicleInput'
import MapView from '@/components/MapView'
import Results from '@/components/Results'
import MLAnalytics from '@/components/MLAnalytics'
import { Play, Settings, Download, Upload, Loader2, BarChart3, ArrowLeft, Map, Target } from 'lucide-react'
import InteractiveMap from '@/components/InteractiveMap'

export default function WorkspacePage() {
  // Start with just a depot to showcase the add functionality
  const [locations, setLocations] = useState<Location[]>([
    { id: 1, name: 'Main Depot', x: 0.5, y: 0.5, demand: 0, type: 'depot' },
  ])

  const [vehicles, setVehicles] = useState<Vehicle[]>([
    { id: 1, name: 'Truck 1', capacity: 50, costPerKm: 1.0, maxDistance: 200 },
  ])

  const [config, setConfig] = useState<OptimizationConfig>({
    algorithm: 'attention_model',
    maxEpochs: 50,
    batchSize: 64,
    useGPU: true,
    learningRate: '0.001',
    earlyStoping: false,
    optimizationPolicy: 'balanced',
    features: {
      weather: false,
      traffic: false,
      carbonOptimal: false,
      customerSatisfaction: false,
      priorityDelivery: false,
      dynamicRouting: false
    },
    weights: {
      cost: 40,
      time: 30,
      satisfaction: 20,
      environment: 10
    }
  })

  const [isOptimizing, setIsOptimizing] = useState(false)
  const [results, setResults] = useState<OptimizationResult | null>(null)
  const [activeTab, setActiveTab] = useState<'input' | 'map' | 'results' | 'analytics'>('input')

  const handleOptimize = async () => {
    setIsOptimizing(true)
    try {
      // Simulate API call with delay
      await new Promise(resolve => setTimeout(resolve, 3000))
      
      // Mock results for demo using your structure
      const mockResults: OptimizationResult = {
        routes: [
          {
            vehicleId: 1,
            stops: [
              { locationId: 1, arrivalTime: 0, load: 0, distance: 0 },
              { locationId: 2, arrivalTime: 0.5, load: 15, distance: 12.3 },
              { locationId: 4, arrivalTime: 1.2, load: 25, distance: 8.7 },
              { locationId: 1, arrivalTime: 2.0, load: 0, distance: 15.8 }
            ],
            totalDistance: 36.8,
            totalCost: 36.8,
            totalTime: 2.0
          }
        ],
        totalCost: 36.8,
        totalDistance: 36.8,
        totalTime: 2.0,
        solveTime: 2.8,
        algorithm: config.algorithm
      }
      
      setResults(mockResults)
      setActiveTab('results')
    } catch (error) {
      console.error('Optimization failed:', error)
      alert('Optimization failed. Please try again.')
    } finally {
      setIsOptimizing(false)
    }
  }

  const exportData = () => {
    const data = { locations, vehicles, config }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'mtvrp-data.json'
    a.click()
    URL.revokeObjectURL(url)
  }

  const importData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target?.result as string)
          if (data.locations) setLocations(data.locations)
          if (data.vehicles) setVehicles(data.vehicles)
          if (data.config) setConfig(data.config)
        } catch (error) {
          console.error('Import failed:', error)
          alert('Failed to import data. Please check the file format.')
        }
      }
      reader.readAsText(file)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Custom CSS for smart sliders */}
      <style jsx>{`
        input[type="range"] {
          -webkit-appearance: none;
          appearance: none;
          height: 6px;
          border-radius: 3px;
          outline: none;
        }
        
        input[type="range"]::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          height: 18px;
          width: 18px;
          border-radius: 50%;
          background: #fff;
          border: 2px solid #3b82f6;
          cursor: pointer;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        
        input[type="range"]::-moz-range-thumb {
          height: 18px;
          width: 18px;
          border-radius: 50%;
          background: #fff;
          border: 2px solid #3b82f6;
          cursor: pointer;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
      `}</style>

      {/* Header */}
      <header className="bg-white shadow-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <Link 
                href="/"
                className="text-slate-600 hover:text-slate-800 transition-colors flex items-center space-x-2"
              >
                <ArrowLeft className="w-5 h-5" />
                <span>Back to Home</span>
              </Link>
              <div className="border-l border-slate-300 pl-4">
                <h1 className="text-2xl font-bold text-slate-900">RouteAI Workspace</h1>
                <p className="text-slate-600">Multi-Task Vehicle Routing Problem Solver</p>
              </div>
            </div>
            
            <div className="flex space-x-3">
              <label className="cursor-pointer bg-slate-100 hover:bg-slate-200 px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors">
                <Upload className="w-4 h-4" />
                <span>Import</span>
                <input
                  type="file"
                  accept=".json"
                  onChange={importData}
                  className="hidden"
                />
              </label>
              
              <button
                onClick={exportData}
                className="bg-slate-100 hover:bg-slate-200 px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
              >
                <Download className="w-4 h-4" />
                <span>Export</span>
              </button>
              
              <button
                onClick={handleOptimize}
                disabled={isOptimizing || locations.length < 2}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-slate-400 text-white px-6 py-2 rounded-lg flex items-center space-x-2 transition-colors shadow-sm"
              >
                {isOptimizing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Optimizing...</span>
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4" />
                    <span>Optimize Routes</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className="bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex space-x-8">
            {[
              { id: 'input', label: 'Input Data', icon: Settings },
              { id: 'map', label: 'Map View', icon: Map },
              { id: 'results', label: 'Results', icon: BarChart3 },
              { id: 'analytics', label: 'ML Analytics', icon: Target }
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id as any)}
                className={`flex items-center space-x-2 py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{label}</span>
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {activeTab === 'input' && (
          <div className="space-y-8">
            {/* Interactive Map */}
            <InteractiveMap 
              locations={locations}
              setLocations={setLocations}
              vehicles={vehicles}
              setVehicles={setVehicles}
              routes={results?.routes || []}
            />
            
            {/* Input Forms Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Column - Locations & ML Configuration */}
              <div className="space-y-8">
                {/* Locations */}
                <LocationInput 
                  locations={locations} 
                  setLocations={setLocations} 
                />
                
                {/* ML Configuration - Extended */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                  <h3 className="text-lg font-semibold mb-4 text-slate-900">ML Configuration</h3>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          Algorithm
                        </label>
                        <select
                          value={config.algorithm}
                          onChange={(e) => setConfig({...config, algorithm: e.target.value as any})}
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                        >
                          <option value="attention_model">Attention Model</option>
                          <option value="pomo">POMO</option>
                          <option value="classical">Classical Solver</option>
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          Max Epochs
                        </label>
                        <input
                          type="number"
                          value={config.maxEpochs}
                          onChange={(e) => setConfig({...config, maxEpochs: parseInt(e.target.value)})}
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          Batch Size
                        </label>
                        <input
                          type="number"
                          value={config.batchSize}
                          onChange={(e) => setConfig({...config, batchSize: parseInt(e.target.value)})}
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          Learning Rate
                        </label>
                        <select
                          value={config.learningRate || '0.001'}
                          onChange={(e) => setConfig({...config, learningRate: e.target.value})}
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                        >
                          <option value="0.01">0.01 (High)</option>
                          <option value="0.001">0.001 (Medium)</option>
                          <option value="0.0001">0.0001 (Low)</option>
                        </select>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <label className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={config.useGPU}
                          onChange={(e) => setConfig({...config, useGPU: e.target.checked})}
                          className="w-4 h-4 text-blue-600 border-slate-300 rounded"
                        />
                        <span className="text-sm text-slate-700">GPU Acceleration</span>
                      </label>

                      <label className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={config.earlyStoping || false}
                          onChange={(e) => setConfig({...config, earlyStoping: e.target.checked})}
                          className="w-4 h-4 text-blue-600 border-slate-300 rounded"
                        />
                        <span className="text-sm text-slate-700">Early Stopping</span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column - Vehicles & Policy */}
              <div className="space-y-8">
                {/* Vehicles */}
                <VehicleInput 
                  vehicles={vehicles} 
                  setVehicles={setVehicles} 
                />

                {/* Policy Configuration */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                  <h3 className="text-lg font-semibold mb-4 text-slate-900 flex items-center">
                    <Target className="w-5 h-5 mr-2 text-indigo-600" />
                    Policy Configuration
                  </h3>
                  
                  <div className="space-y-4">
                    {/* Optimization Strategy */}
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Optimization Strategy
                      </label>
                      <select
                        value={config.optimizationPolicy || 'balanced'}
                        onChange={(e) => setConfig({...config, optimizationPolicy: e.target.value})}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm"
                      >
                        <option value="cost_optimal">Cost Minimization</option>
                        <option value="time_optimal">Time Optimization</option>
                        <option value="balanced">Balanced Approach</option>
                        <option value="customer_first">Customer Priority</option>
                        <option value="green_routing">Environmental Focus</option>
                      </select>
                    </div>

                    {/* Features Grid */}
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-3">
                        Policy Features
                      </label>
                      <div className="grid grid-cols-2 gap-3">
                        <label className="flex items-center p-2 border border-slate-200 rounded cursor-pointer hover:bg-slate-50">
                          <input
                            type="checkbox"
                            checked={config.features?.weather || false}
                            onChange={(e) => setConfig({
                              ...config, 
                              features: { ...config.features, weather: e.target.checked }
                            })}
                            className="w-4 h-4 text-blue-600 border-slate-300 rounded mr-2"
                          />
                          <span className="text-sm text-slate-700">Weather Analysis</span>
                        </label>

                        <label className="flex items-center p-2 border border-slate-200 rounded cursor-pointer hover:bg-slate-50">
                          <input
                            type="checkbox"
                            checked={config.features?.traffic || false}
                            onChange={(e) => setConfig({
                              ...config, 
                              features: { ...config.features, traffic: e.target.checked }
                            })}
                            className="w-4 h-4 text-red-600 border-slate-300 rounded mr-2"
                          />
                          <span className="text-sm text-slate-700">Traffic Optimization</span>
                        </label>

                        <label className="flex items-center p-2 border border-slate-200 rounded cursor-pointer hover:bg-slate-50">
                          <input
                            type="checkbox"
                            checked={config.features?.customerSatisfaction || false}
                            onChange={(e) => setConfig({
                              ...config, 
                              features: { ...config.features, customerSatisfaction: e.target.checked }
                            })}
                            className="w-4 h-4 text-green-600 border-slate-300 rounded mr-2"
                          />
                          <span className="text-sm text-slate-700">Customer Priority</span>
                        </label>

                        <label className="flex items-center p-2 border border-slate-200 rounded cursor-pointer hover:bg-slate-50">
                          <input
                            type="checkbox"
                            checked={config.features?.carbonOptimal || false}
                            onChange={(e) => setConfig({
                              ...config, 
                              features: { ...config.features, carbonOptimal: e.target.checked }
                            })}
                            className="w-4 h-4 text-emerald-600 border-slate-300 rounded mr-2"
                          />
                          <span className="text-sm text-slate-700">Carbon Reduction</span>
                        </label>

                        <label className="flex items-center p-2 border border-slate-200 rounded cursor-pointer hover:bg-slate-50">
                          <input
                            type="checkbox"
                            checked={config.features?.priorityDelivery || false}
                            onChange={(e) => setConfig({
                              ...config, 
                              features: { ...config.features, priorityDelivery: e.target.checked }
                            })}
                            className="w-4 h-4 text-purple-600 border-slate-300 rounded mr-2"
                          />
                          <span className="text-sm text-slate-700">Priority Orders</span>
                        </label>

                        <label className="flex items-center p-2 border border-slate-200 rounded cursor-pointer hover:bg-slate-50">
                          <input
                            type="checkbox"
                            checked={config.features?.dynamicRouting || false}
                            onChange={(e) => setConfig({
                              ...config, 
                              features: { ...config.features, dynamicRouting: e.target.checked }
                            })}
                            className="w-4 h-4 text-indigo-600 border-slate-300 rounded mr-2"
                          />
                          <span className="text-sm text-slate-700">Dynamic Updates</span>
                        </label>
                      </div>
                    </div>

                    {/* Smart Weight Sliders - Interdependent */}
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-3">
                        Optimization Weights (Total: 100%)
                      </label>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-slate-600 w-20">Cost</span>
                          <div className="flex-1 mx-3">
                            <input
                              type="range"
                              min="0"
                              max="100"
                              value={config.weights?.cost || 40}
                              onChange={(e) => {
                                const newCost = parseInt(e.target.value)
                                const remaining = 100 - newCost
                                const currentOthers = (config.weights?.time || 30) + (config.weights?.satisfaction || 20) + (config.weights?.environment || 10)
                                
                                if (remaining >= 0) {
                                  const scale = currentOthers > 0 ? remaining / currentOthers : 1
                                  setConfig({
                                    ...config, 
                                    weights: { 
                                      cost: newCost,
                                      time: Math.round((config.weights?.time || 30) * scale),
                                      satisfaction: Math.round((config.weights?.satisfaction || 20) * scale),
                                      environment: Math.round((config.weights?.environment || 10) * scale)
                                    }
                                  })
                                }
                              }}
                              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                              style={{
                                background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${config.weights?.cost || 40}%, #e2e8f0 ${config.weights?.cost || 40}%, #e2e8f0 100%)`
                              }}
                            />
                          </div>
                          <span className="text-sm font-medium text-slate-800 w-10 text-right">{config.weights?.cost || 40}%</span>
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="text-sm text-slate-600 w-20">Time</span>
                          <div className="flex-1 mx-3">
                            <input
                              type="range"
                              min="0"
                              max="100"
                              value={config.weights?.time || 30}
                              onChange={(e) => {
                                const newTime = parseInt(e.target.value)
                                const remaining = 100 - newTime
                                const currentOthers = (config.weights?.cost || 40) + (config.weights?.satisfaction || 20) + (config.weights?.environment || 10)
                                
                                if (remaining >= 0) {
                                  const scale = currentOthers > 0 ? remaining / currentOthers : 1
                                  setConfig({
                                    ...config, 
                                    weights: { 
                                      time: newTime,
                                      cost: Math.round((config.weights?.cost || 40) * scale),
                                      satisfaction: Math.round((config.weights?.satisfaction || 20) * scale),
                                      environment: Math.round((config.weights?.environment || 10) * scale)
                                    }
                                  })
                                }
                              }}
                              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                              style={{
                                background: `linear-gradient(to right, #10b981 0%, #10b981 ${config.weights?.time || 30}%, #e2e8f0 ${config.weights?.time || 30}%, #e2e8f0 100%)`
                              }}
                            />
                          </div>
                          <span className="text-sm font-medium text-slate-800 w-10 text-right">{config.weights?.time || 30}%</span>
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="text-sm text-slate-600 w-20">Service</span>
                          <div className="flex-1 mx-3">
                            <input
                              type="range"
                              min="0"
                              max="100"
                              value={config.weights?.satisfaction || 20}
                              onChange={(e) => {
                                const newSatisfaction = parseInt(e.target.value)
                                const remaining = 100 - newSatisfaction
                                const currentOthers = (config.weights?.cost || 40) + (config.weights?.time || 30) + (config.weights?.environment || 10)
                                
                                if (remaining >= 0) {
                                  const scale = currentOthers > 0 ? remaining / currentOthers : 1
                                  setConfig({
                                    ...config, 
                                    weights: { 
                                      satisfaction: newSatisfaction,
                                      cost: Math.round((config.weights?.cost || 40) * scale),
                                      time: Math.round((config.weights?.time || 30) * scale),
                                      environment: Math.round((config.weights?.environment || 10) * scale)
                                    }
                                  })
                                }
                              }}
                              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                              style={{
                                background: `linear-gradient(to right, #f59e0b 0%, #f59e0b ${config.weights?.satisfaction || 20}%, #e2e8f0 ${config.weights?.satisfaction || 20}%, #e2e8f0 100%)`
                              }}
                            />
                          </div>
                          <span className="text-sm font-medium text-slate-800 w-10 text-right">{config.weights?.satisfaction || 20}%</span>
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="text-sm text-slate-600 w-20">Green</span>
                          <div className="flex-1 mx-3">
                            <input
                              type="range"
                              min="0"
                              max="100"
                              value={config.weights?.environment || 10}
                              onChange={(e) => {
                                const newEnvironment = parseInt(e.target.value)
                                const remaining = 100 - newEnvironment
                                const currentOthers = (config.weights?.cost || 40) + (config.weights?.time || 30) + (config.weights?.satisfaction || 20)
                                
                                if (remaining >= 0) {
                                  const scale = currentOthers > 0 ? remaining / currentOthers : 1
                                  setConfig({
                                    ...config, 
                                    weights: { 
                                      environment: newEnvironment,
                                      cost: Math.round((config.weights?.cost || 40) * scale),
                                      time: Math.round((config.weights?.time || 30) * scale),
                                      satisfaction: Math.round((config.weights?.satisfaction || 20) * scale)
                                    }
                                  })
                                }
                              }}
                              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                              style={{
                                background: `linear-gradient(to right, #22c55e 0%, #22c55e ${config.weights?.environment || 10}%, #e2e8f0 ${config.weights?.environment || 10}%, #e2e8f0 100%)`
                              }}
                            />
                          </div>
                          <span className="text-sm font-medium text-slate-800 w-10 text-right">{config.weights?.environment || 10}%</span>
                        </div>

                        {/* Visual Total Display */}
                        <div className="mt-4 p-3 bg-slate-50 rounded-lg border border-slate-200">
                          <div className="flex items-center justify-between text-sm">
                            <span className="font-medium text-slate-700">Total Weight:</span>
                            <span className={`font-bold ${
                              ((config.weights?.cost || 40) + (config.weights?.time || 30) + (config.weights?.satisfaction || 20) + (config.weights?.environment || 10)) === 100 
                                ? 'text-green-600' 
                                : 'text-red-600'
                            }`}>
                              {(config.weights?.cost || 40) + (config.weights?.time || 30) + (config.weights?.satisfaction || 20) + (config.weights?.environment || 10)}%
                            </span>
                          </div>
                          
                          {/* Visual Weight Distribution Bar */}
                          <div className="mt-2 h-3 bg-slate-200 rounded-full overflow-hidden flex">
                            <div 
                              className="bg-blue-500 h-full transition-all duration-300"
                              style={{ width: `${config.weights?.cost || 40}%` }}
                              title={`Cost: ${config.weights?.cost || 40}%`}
                            ></div>
                            <div 
                              className="bg-green-500 h-full transition-all duration-300"
                              style={{ width: `${config.weights?.time || 30}%` }}
                              title={`Time: ${config.weights?.time || 30}%`}
                            ></div>
                            <div 
                              className="bg-orange-500 h-full transition-all duration-300"
                              style={{ width: `${config.weights?.satisfaction || 20}%` }}
                              title={`Service: ${config.weights?.satisfaction || 20}%`}
                            ></div>
                            <div 
                              className="bg-emerald-500 h-full transition-all duration-300"
                              style={{ width: `${config.weights?.environment || 10}%` }}
                              title={`Green: ${config.weights?.environment || 10}%`}
                            ></div>
                          </div>
                          
                          <div className="flex items-center justify-between mt-2 text-xs text-slate-500">
                            <span>Cost</span>
                            <span>Time</span>
                            <span>Service</span>
                            <span>Green</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'map' && (
          <MapView 
            locations={locations} 
            routes={results?.routes || []} 
          />
        )}

        {activeTab === 'results' && results && (
          <Results 
            results={results} 
            locations={locations} 
            vehicles={vehicles} 
          />
        )}

        {activeTab === 'analytics' && (
          <MLAnalytics 
            results={results}
            locations={locations}
            vehicles={vehicles}
            config={config}
          />
        )}

        {activeTab === 'results' && !results && (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-16 text-center">
            <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <BarChart3 className="w-10 h-10 text-slate-400" />
            </div>
            <h3 className="text-xl font-semibold text-slate-900 mb-3">No Results Yet</h3>
            <p className="text-slate-600 mb-8 max-w-md mx-auto">
              Configure your locations and vehicles, then click "Optimize Routes" to see detailed analysis and results.
            </p>
            <button
              onClick={() => setActiveTab('input')}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              Configure Input Data
            </button>
          </div>
        )}
      </main>

      {/* Optimization Status Modal */}
      {isOptimizing && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-8 max-w-md mx-4 text-center shadow-2xl">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
            </div>
            <h3 className="text-xl font-semibold text-slate-900 mb-2">Optimizing Routes</h3>
            <p className="text-slate-600 mb-4">
              Our AI is analyzing your data and finding the optimal delivery routes...
            </p>
            <div className="w-full bg-slate-200 rounded-full h-2">
              <div className="bg-blue-600 h-2 rounded-full w-2/3 animate-pulse"></div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// Updated lib/types.ts
export interface Location {
  id: number
  name: string
  x: number
  y: number
  demand: number
  type: 'depot' | 'customer' | 'pickup' | 'delivery'
}

export interface Vehicle {
  id: number
  name: string
  capacity: number
  costPerKm: number
  maxDistance?: number
}

export interface OptimizationConfig {
  algorithm: 'attention_model' | 'pomo' | 'classical'
  maxEpochs: number
  batchSize: number
  useGPU: boolean
  learningRate?: string
  earlyStoping?: boolean
  optimizationPolicy?: string
  features?: {
    weather?: boolean
    traffic?: boolean
    carbonOptimal?: boolean
    customerSatisfaction?: boolean
    priorityDelivery?: boolean
    dynamicRouting?: boolean
  }
  weights?: {
    cost?: number
    time?: number
    satisfaction?: number
    environment?: number
  }
}

export interface RouteStop {
  locationId: number
  arrivalTime: number
  load: number
  distance: number
}

export interface OptimizedRoute {
  vehicleId: number
  stops: RouteStop[]
  totalDistance: number
  totalCost: number
  totalTime: number
}

export interface OptimizationResult {
  routes: OptimizedRoute[]
  totalCost: number
  totalDistance: number
  totalTime: number
  solveTime: number
  algorithm: string
}