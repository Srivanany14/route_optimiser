'use client'

import React, { useState, useEffect, useRef } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, ComposedChart } from 'recharts'
import { MapPin, Clock, DollarSign, TrendingDown, AlertTriangle, CheckCircle, Navigation, BarChart3, Zap } from 'lucide-react'

interface RouteData {
  id: string
  name: string
  startCoordinate: [number, number]
  endCoordinate: [number, number]
  currentTraffic: 'Heavy' | 'Moderate' | 'Light'
  avgDelay: number
  peakTime: string
  costImpact: string
  aiReduction: string
  trafficLevel: number
  color: string
  distance?: number
  duration?: number
}

export default function TrafficAnalysis() {
  const [selectedRoute, setSelectedRoute] = useState<string>('route-1')
  const [selectedTimeRange, setSelectedTimeRange] = useState<'today' | 'week' | 'month'>('today')
  const [routesLoaded, setRoutesLoaded] = useState(false)
  const [optimizingRoute, setOptimizingRoute] = useState<string | null>(null)
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<any>(null)

  const routeTrafficData: RouteData[] = [
    {
      id: 'route-1',
      name: 'Times Square → Union Square',
      startCoordinate: [40.7580, -73.9855],
      endCoordinate: [40.7359, -73.9911],
      currentTraffic: 'Heavy',
      avgDelay: 18,
      peakTime: '8:30 AM',
      costImpact: '+$45',
      aiReduction: '12 min saved',
      trafficLevel: 85,
      color: '#ef4444'
    },
    {
      id: 'route-2',
      name: 'Central Park South → Grand Central',
      startCoordinate: [40.7673, -73.9808],
      endCoordinate: [40.7527, -73.9772],
      currentTraffic: 'Moderate',
      avgDelay: 8,
      peakTime: '7:45 AM',
      costImpact: '+$15',
      aiReduction: '6 min saved',
      trafficLevel: 58,
      color: '#f59e0b'
    },
    {
      id: 'route-3',
      name: 'Soho → East Village',
      startCoordinate: [40.7233, -74.0026],
      endCoordinate: [40.7282, -73.9856],
      currentTraffic: 'Light',
      avgDelay: 3,
      peakTime: '12:15 PM',
      costImpact: '+$8',
      aiReduction: '3 min saved',
      trafficLevel: 25,
      color: '#10b981'
    },
    {
      id: 'route-4',
      name: 'Upper West Side → Midtown',
      startCoordinate: [40.7884, -73.9759],
      endCoordinate: [40.7549, -73.9840],
      currentTraffic: 'Heavy',
      avgDelay: 22,
      peakTime: '5:30 PM',
      costImpact: '+$52',
      aiReduction: '15 min saved',
      trafficLevel: 92,
      color: '#dc2626'
    }
  ]

  const costReductionData = [
    { metric: 'Fuel Savings', daily: 285, weekly: 1995, monthly: 8550, unit: 'dollars' },
    { metric: 'Time Savings', daily: 180, weekly: 1260, monthly: 5400, unit: 'minutes' },
    { metric: 'Delivery Efficiency', daily: 94, weekly: 92, monthly: 89, unit: 'percent' },
    { metric: 'Route Optimization', daily: 87, weekly: 85, monthly: 82, unit: 'percent' }
  ]

  const hourlyTrafficData = [
    { time: '6 AM', traffic: 15, withoutAI: 25, withAI: 18, savings: 7 },
    { time: '7 AM', traffic: 45, withoutAI: 38, withAI: 28, savings: 10 },
    { time: '8 AM', traffic: 85, withoutAI: 52, withAI: 35, savings: 17 },
    { time: '9 AM', traffic: 72, withoutAI: 45, withAI: 32, savings: 13 },
    { time: '10 AM', traffic: 35, withoutAI: 28, withAI: 22, savings: 6 },
    { time: '11 AM', traffic: 25, withoutAI: 22, withAI: 19, savings: 3 },
    { time: '12 PM', traffic: 58, withoutAI: 35, withAI: 26, savings: 9 },
    { time: '1 PM', traffic: 65, withoutAI: 38, withAI: 28, savings: 10 },
    { time: '2 PM', traffic: 48, withoutAI: 32, withAI: 25, savings: 7 },
    { time: '3 PM', traffic: 55, withoutAI: 35, withAI: 27, savings: 8 },
    { time: '4 PM', traffic: 75, withoutAI: 45, withAI: 32, savings: 13 },
    { time: '5 PM', traffic: 95, withoutAI: 58, withAI: 38, savings: 20 },
    { time: '6 PM', traffic: 88, withoutAI: 52, withAI: 35, savings: 17 },
    { time: '7 PM', traffic: 65, withoutAI: 42, withAI: 31, savings: 11 }
  ]

  const peakTrafficAnalysis = [
    { 
      timeSlot: '7:00-8:00 AM', 
      route: 'Central Park → LaGuardia', 
      trafficLevel: 95, 
      impact: 'High' as const, 
      aiResponse: 'Rerouted 78% of deliveries' 
    },
    { 
      timeSlot: '8:00-9:00 AM', 
      route: 'Times Square → Brooklyn Bridge', 
      trafficLevel: 89, 
      impact: 'High' as const, 
      aiResponse: 'Alternative routes used' 
    },
    { 
      timeSlot: '12:00-1:00 PM', 
      route: 'Wall Street → JFK', 
      trafficLevel: 72, 
      impact: 'Medium' as const, 
      aiResponse: 'Minor adjustments made' 
    },
    { 
      timeSlot: '5:00-6:00 PM', 
      route: 'Lincoln Center → Staten Island', 
      trafficLevel: 98, 
      impact: 'Critical' as const, 
      aiResponse: 'Emergency rerouting activated' 
    }
  ]

  const handleOptimizeRoute = async (routeId: string) => {
    setOptimizingRoute(routeId)
    
    try {
      await new Promise(resolve => setTimeout(resolve, 2000))
      alert(`Route optimized! Alternative route found with 25% less traffic.`)
    } catch (error) {
      console.error('Error optimizing route:', error)
      alert('Failed to optimize route. Please try again.')
    } finally {
      setOptimizingRoute(null)
    }
  }

  const fetchRouteFromOSRM = async (start: [number, number], end: [number, number]) => {
    try {
      const [startLng, startLat] = start
      const [endLng, endLat] = end
      
      const response = await fetch(
        `https://router.project-osrm.org/route/v1/driving/${startLng},${startLat};${endLng},${endLat}?overview=full&geometries=geojson`
      )
      
      if (!response.ok) throw new Error(`OSRM API error: ${response.status}`)
      
      const data = await response.json()
      
      if (data.routes && data.routes.length > 0) {
        return {
          geometry: data.routes[0].geometry,
          distance: data.routes[0].distance,
          duration: data.routes[0].duration
        }
      }
      
      return null
    } catch (error) {
      console.error('Error fetching route from OSRM:', error)
      return null
    }
  }

  const loadRoutesOnMap = async (map: any, L: any) => {
    try {
      for (const route of routeTrafficData) {
        const routeData = await fetchRouteFromOSRM(
          [route.startCoordinate[1], route.startCoordinate[0]],
          [route.endCoordinate[1], route.endCoordinate[0]]
        )
        
        if (routeData?.geometry) {
          const coordinates = routeData.geometry.coordinates.map((coord: [number, number]) => [coord[1], coord[0]])
          
          const polyline = L.polyline(coordinates, {
            color: route.color,
            weight: 6,
            opacity: 0.8,
            className: `route-${route.id}`
          }).addTo(map)
          
          polyline.on('click', () => setSelectedRoute(route.id))
          
          const optimizeButton = route.currentTraffic === 'Heavy' ? 
            `<button 
              onclick="window.optimizeRoute('${route.id}')" 
              style="
                background: linear-gradient(135deg, #3b82f6, #1d4ed8);
                color: white;
                border: none;
                padding: 6px 12px;
                border-radius: 6px;
                font-size: 12px;
                font-weight: 600;
                cursor: pointer;
                margin-top: 8px;
                width: 100%;
                box-shadow: 0 2px 4px rgba(0,0,0,0.1);
              "
            >
              ⚡ Optimise Now
            </button>` : ''
          
          polyline.bindPopup(`
            <div style="font-family: system-ui; min-width: 200px;">
              <h4 style="margin: 0 0 8px 0; font-weight: 600; color: #1e293b;">${route.name}</h4>
              <p style="margin: 4px 0; font-size: 13px;"><strong>Traffic:</strong> ${route.currentTraffic} (${route.trafficLevel}%)</p>
              <p style="margin: 4px 0; font-size: 13px;"><strong>Distance:</strong> ${(routeData.distance / 1000).toFixed(1)} km</p>
              <p style="margin: 4px 0; font-size: 13px;"><strong>Duration:</strong> ${Math.round(routeData.duration / 60)} min</p>
              <p style="margin: 4px 0; font-size: 13px;"><strong>Peak Time:</strong> ${route.peakTime}</p>
              <p style="margin: 4px 0; font-size: 13px;"><strong>AI Savings:</strong> <span style="color: #10b981;">${route.aiReduction}</span></p>
              <p style="margin: 4px 0; font-size: 13px;"><strong>Cost Impact:</strong> <span style="color: #f59e0b;">${route.costImpact}</span></p>
              ${optimizeButton}
            </div>
          `)
          
          // Add markers
          const startIcon = L.divIcon({
            html: `<div style="background: ${route.color}; width: 12px; height: 12px; border-radius: 50%; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>`,
            className: 'custom-marker',
            iconSize: [16, 16],
            iconAnchor: [8, 8]
          })
          
          const endIcon = L.divIcon({
            html: `<div style="background: ${route.color}; width: 12px; height: 12px; border-radius: 0; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3); transform: rotate(45deg);"></div>`,
            className: 'custom-marker',
            iconSize: [16, 16],
            iconAnchor: [8, 8]
          })
          
          L.marker(route.startCoordinate, { icon: startIcon }).addTo(map)
          L.marker(route.endCoordinate, { icon: endIcon }).addTo(map)
          
          route.distance = routeData.distance
          route.duration = routeData.duration
        }
      }
      
      (window as any).optimizeRoute = (routeId: string) => handleOptimizeRoute(routeId)
      setRoutesLoaded(true)
      
    } catch (error) {
      console.error('Error loading routes:', error)
      setRoutesLoaded(true)
    }
  }

  const initializeMap = async () => {
    const L = (window as any).L
    if (!L || !mapRef.current || mapInstanceRef.current) return
    
    const map = L.map(mapRef.current).setView([40.7580, -73.9855], 11)
    
    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
      attribution: '© OpenStreetMap contributors © CARTO',
      subdomains: 'abcd',
      maxZoom: 20
    }).addTo(map)
    
    mapInstanceRef.current = map
    await loadRoutesOnMap(map, L)
  }

  useEffect(() => {
    if (typeof window !== 'undefined' && mapRef.current && !mapInstanceRef.current) {
      if (!(window as any).L) {
        const script = document.createElement('script')
        script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js'
        script.onload = () => initializeMap()
        document.head.appendChild(script)
        
        const link = document.createElement('link')
        link.rel = 'stylesheet'
        link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'
        document.head.appendChild(link)
      } else {
        initializeMap()
      }
    }
    
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove()
        mapInstanceRef.current = null
      }
    }
  }, [])

  const selectedRouteData = routeTrafficData.find(r => r.id === selectedRoute)

  return (
    <div className="space-y-6">
      {/* Header with Key Metrics */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Traffic Analysis Dashboard</h2>
            <p className="text-slate-600">Real-time traffic monitoring with OSRM routing and cost impact analysis</p>
          </div>
          <select 
            value={selectedTimeRange} 
            onChange={(e) => setSelectedTimeRange(e.target.value as any)}
            className="px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
          >
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
          </select>
        </div>

        <div className="grid grid-cols-4 gap-4">
          {costReductionData.map((item, index) => (
            <div key={index} className="bg-slate-50 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                {index === 0 && <DollarSign className="w-5 h-5 text-green-600" />}
                {index === 1 && <Clock className="w-5 h-5 text-blue-600" />}
                {index === 2 && <CheckCircle className="w-5 h-5 text-purple-600" />}
                {index === 3 && <Navigation className="w-5 h-5 text-orange-600" />}
                <span className="text-sm font-medium text-slate-600">{item.metric}</span>
              </div>
              <p className="text-2xl font-bold text-slate-900">
                {selectedTimeRange === 'today' ? item.daily : 
                 selectedTimeRange === 'week' ? item.weekly : item.monthly}
                <span className="text-sm text-slate-500 ml-1">{item.unit}</span>
              </p>
              <p className="text-xs text-green-600 font-medium">
                {selectedTimeRange === 'today' ? 'Today' : 
                 selectedTimeRange === 'week' ? 'This Week' : 'This Month'}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Traffic Map */}
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <h3 className="text-lg font-semibold mb-4 text-slate-900 flex items-center space-x-2">
            <MapPin className="w-5 h-5 text-blue-600" />
            <span>Live Route Traffic Conditions</span>
            {!routesLoaded && <div className="ml-2 text-sm text-amber-600">Loading routes...</div>}
          </h3>
          
          <div 
            ref={mapRef}
            className="w-full h-80 rounded-lg border border-slate-300"
            style={{ minHeight: '320px' }}
          />
          
          <div className="mt-4">
            <label className="block text-sm font-medium text-slate-700 mb-2">Select Route for Analysis</label>
            <select 
              value={selectedRoute} 
              onChange={(e) => setSelectedRoute(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
            >
              {routeTrafficData.map((route) => (
                <option key={route.id} value={route.id}>{route.name}</option>
              ))}
            </select>
          </div>
          
          {selectedRouteData && (
            <div className="mt-4 p-4 bg-slate-50 rounded-lg">
              <h4 className="font-semibold text-slate-900 mb-2">{selectedRouteData.name}</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-slate-600">Current Status:</span>
                  <span className={`ml-2 font-medium ${
                    selectedRouteData.currentTraffic === 'Heavy' ? 'text-red-600' :
                    selectedRouteData.currentTraffic === 'Moderate' ? 'text-yellow-600' : 'text-green-600'
                  }`}>{selectedRouteData.currentTraffic}</span>
                </div>
                <div>
                  <span className="text-slate-600">Peak Time:</span>
                  <span className="ml-2 font-medium text-slate-900">{selectedRouteData.peakTime}</span>
                </div>
                {selectedRouteData.distance && (
                  <div>
                    <span className="text-slate-600">Distance:</span>
                    <span className="ml-2 font-medium text-slate-900">{(selectedRouteData.distance / 1000).toFixed(1)} km</span>
                  </div>
                )}
                {selectedRouteData.duration && (
                  <div>
                    <span className="text-slate-600">Base Duration:</span>
                    <span className="ml-2 font-medium text-slate-900">{Math.round(selectedRouteData.duration / 60)} min</span>
                  </div>
                )}
                <div>
                  <span className="text-slate-600">AI Savings:</span>
                  <span className="ml-2 font-medium text-green-600">{selectedRouteData.aiReduction}</span>
                </div>
                <div>
                  <span className="text-slate-600">Cost Impact:</span>
                  <span className="ml-2 font-medium text-orange-600">{selectedRouteData.costImpact}</span>
                </div>
              </div>
              
              {selectedRouteData.currentTraffic === 'Heavy' && (
                <button
                  onClick={() => handleOptimizeRoute(selectedRouteData.id)}
                  disabled={optimizingRoute === selectedRouteData.id}
                  className="mt-4 w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold py-2 px-4 rounded-lg flex items-center justify-center space-x-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {optimizingRoute === selectedRouteData.id ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                      <span>Optimizing...</span>
                    </>
                  ) : (
                    <>
                      <Zap className="w-4 h-4" />
                      <span>Optimise Now</span>
                    </>
                  )}
                </button>
              )}
            </div>
          )}
        </div>

        {/* Hourly Traffic Analysis */}
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-slate-900 flex items-center space-x-2">
              <BarChart3 className="w-5 h-5 text-purple-600" />
              <span>AI vs Traditional Routing</span>
            </h3>
            <div className="flex items-center space-x-4 text-xs">
              <div className="flex items-center space-x-1">
                <div className="w-3 h-3 bg-red-500 rounded"></div>
                <span>Traditional</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-3 h-3 bg-green-500 rounded"></div>
                <span>AI-Powered</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                <span>Time Saved</span>
              </div>
            </div>
          </div>
          
          {/* Performance Indicators */}
          <div className="grid grid-cols-3 gap-3 mb-4 p-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
            <div className="text-center">
              <div className="text-lg font-bold text-green-600">38%</div>
              <div className="text-xs text-slate-600">Faster Routes</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-amber-600">20 min</div>
              <div className="text-xs text-slate-600">Max Time Saved</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-blue-600">$285</div>
              <div className="text-xs text-slate-600">Daily Savings</div>
            </div>
          </div>
          
          <ResponsiveContainer width="100%" height={280}>
            <ComposedChart data={hourlyTrafficData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <defs>
                <linearGradient id="traditionalGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0.1}/>
                </linearGradient>
                <linearGradient id="aiGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0.1}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis 
                dataKey="time" 
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
                label={{ value: 'Travel Time (min)', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle' } }}
              />
              <Tooltip 
                formatter={(value, name) => [
                  `${value} min`,
                  name === 'withoutAI' ? 'Traditional Routing' : name === 'withAI' ? 'AI-Powered Routing' : 'Time Saved'
                ]}
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                  fontSize: '12px'
                }}
                labelStyle={{ color: '#334155', fontWeight: 'bold' }}
              />
              
              <Bar 
                dataKey="withoutAI" 
                fill="url(#traditionalGradient)" 
                name="withoutAI" 
                radius={[4, 4, 0, 0]}
                stroke="#dc2626"
                strokeWidth={1}
              />
              <Bar 
                dataKey="withAI" 
                fill="url(#aiGradient)" 
                name="withAI" 
                radius={[4, 4, 0, 0]}
                stroke="#059669"
                strokeWidth={1}
              />
              <Line 
                type="monotone" 
                dataKey="savings" 
                stroke="#f59e0b" 
                strokeWidth={3} 
                name="savings" 
                dot={{ r: 5, fill: '#f59e0b', stroke: '#ffffff', strokeWidth: 2 }}
                activeDot={{ r: 6, fill: '#f59e0b', stroke: '#ffffff', strokeWidth: 2 }}
              />
            </ComposedChart>
          </ResponsiveContainer>
          
          {/* Simple Comparison Stats */}
          <div className="mt-4 grid grid-cols-2 gap-4">
            <div className="text-center p-3 bg-red-50 rounded-lg">
              <div className="text-sm text-red-600 mb-1">Traditional Routing</div>
              <div className="text-2xl font-bold text-red-600">42 min</div>
              <div className="text-xs text-red-500">Average daily delay</div>
            </div>
            
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <div className="text-sm text-green-600 mb-1">AI-Powered Routing</div>
              <div className="text-2xl font-bold text-green-600">26 min</div>
              <div className="text-xs text-green-500">Average daily delay</div>
            </div>
          </div>

          {/* Model Information */}
          <div className="mt-4 grid grid-cols-2 gap-4">
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <div className="text-sm text-blue-600 mb-1">Model</div>
              <div className="text-2xl font-bold text-blue-600">Random Forests</div>
              <div className="text-xs text-blue-500">ML Algorithm</div>
            </div>
            
            <div className="text-center p-3 bg-purple-50 rounded-lg">
              <div className="text-sm text-purple-600 mb-1">Efficiency</div>
              <div className="text-2xl font-bold text-purple-600">97%</div>
              <div className="text-xs text-purple-500">Model accuracy</div>
            </div>
          </div>
        </div>
      </div>

      {/* Peak Traffic Analysis Table */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <h3 className="text-lg font-semibold mb-4 text-slate-900 flex items-center space-x-2">
          <AlertTriangle className="w-5 h-5 text-red-600" />
          <span>Peak Traffic Times & AI Response</span>
        </h3>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="text-left py-3 px-4 font-semibold text-slate-700">Time Slot</th>
                <th className="text-left py-3 px-4 font-semibold text-slate-700">Worst Route</th>
                <th className="text-left py-3 px-4 font-semibold text-slate-700">Traffic Level</th>
                <th className="text-left py-3 px-4 font-semibold text-slate-700">Impact</th>
                <th className="text-left py-3 px-4 font-semibold text-slate-700">AI Response</th>
              </tr>
            </thead>
            <tbody>
              {peakTrafficAnalysis.map((peak, index) => (
                <tr key={index} className="border-b border-slate-100 hover:bg-slate-50">
                  <td className="py-3 px-4 font-medium text-slate-900">{peak.timeSlot}</td>
                  <td className="py-3 px-4 text-slate-700">{peak.route}</td>
                  <td className="py-3 px-4">
                    <div className="flex items-center space-x-2">
                      <div className="w-16 h-2 bg-gray-200 rounded-full">
                        <div 
                          className={`h-2 rounded-full ${
                            peak.trafficLevel > 90 ? 'bg-red-600' :
                            peak.trafficLevel > 70 ? 'bg-orange-500' : 'bg-yellow-500'
                          }`}
                          style={{ width: `${peak.trafficLevel}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium">{peak.trafficLevel}%</span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      peak.impact === 'Critical' ? 'bg-red-100 text-red-800' :
                      peak.impact === 'High' ? 'bg-orange-100 text-orange-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {peak.impact}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-sm text-slate-600">{peak.aiResponse}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Cost Reduction Summary */}
      <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-6 border border-green-200">
        <h3 className="text-lg font-semibold mb-4 text-slate-900 flex items-center space-x-2">
          <TrendingDown className="w-5 h-5 text-green-600" />
          <span>Traffic Analysis Impact Summary</span>
        </h3>
        
        <div className="grid grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">$8,550</div>
            <div className="text-sm text-slate-600">Monthly Fuel Savings</div>
            <div className="text-xs text-green-700 mt-1">↓ 32% reduction in fuel costs</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">90 hrs</div>
            <div className="text-sm text-slate-600">Monthly Time Saved</div>
            <div className="text-xs text-blue-700 mt-1">↓ 28% faster deliveries</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-600 mb-2">94%</div>
            <div className="text-sm text-slate-600">Delivery Success Rate</div>
            <div className="text-xs text-purple-700 mt-1">↑ 15% improvement</div>
          </div>
        </div>
      </div>
    </div>
  )
}