'use client'

import React, { useEffect, useRef, useState } from 'react'
import { Location, Vehicle, OptimizedRoute } from '@/lib/types'
import { MapPin, Plus, Truck } from 'lucide-react'

interface InteractiveMapProps {
  locations: Location[]
  setLocations: (locations: Location[]) => void
  vehicles: Vehicle[]
  setVehicles: (vehicles: Vehicle[]) => void
  routes?: OptimizedRoute[]
}

export default function InteractiveMap({ 
  locations, 
  setLocations, 
  vehicles, 
  setVehicles, 
  routes = [] 
}: InteractiveMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<any>(null)
  const markersRef = useRef<any[]>([])
  
  const [isMapReady, setIsMapReady] = useState(false)
  const [leafletLoaded, setLeafletLoaded] = useState(false)
  const [addingMode, setAddingMode] = useState<'location' | null>(null)
  const [newLocationData, setNewLocationData] = useState({
    name: '',
    type: 'customer' as Location['type'],
    demand: 0
  })
  const [newVehicleData, setNewVehicleData] = useState({
    name: '',
    capacity: 50,
    costPerKm: 1.0
  })

  // Load Leaflet
  useEffect(() => {
    const loadLeaflet = async () => {
      try {
        // Check if already loaded
        if ((window as any).L) {
          setLeafletLoaded(true)
          return
        }

        // Add CSS
        const cssLink = document.createElement('link')
        cssLink.rel = 'stylesheet'
        cssLink.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'
        cssLink.onload = () => console.log('Leaflet CSS loaded')
        document.head.appendChild(cssLink)

        // Add JS
        const script = document.createElement('script')
        script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js'
        
        script.onload = () => {
          console.log('Leaflet script loaded')
          // Wait a bit more for Leaflet to be fully ready
          setTimeout(() => {
            if ((window as any).L && (window as any).L.map) {
              console.log('Leaflet is ready!')
              setLeafletLoaded(true)
            } else {
              console.error('Leaflet loaded but L.map not available')
            }
          }, 500)
        }
        
        script.onerror = () => {
          console.error('Failed to load Leaflet script')
        }
        
        document.head.appendChild(script)

      } catch (error) {
        console.error('Error loading Leaflet:', error)
      }
    }

    loadLeaflet()
  }, [])

  // Initialize map
  useEffect(() => {
    if (!leafletLoaded || !mapRef.current || isMapReady) return

    const initMap = () => {
      try {
        console.log('Attempting to create map...')
        console.log('window.L available:', !!(window as any).L)
        console.log('window.L.map available:', !!(window as any).L?.map)
        
        if (!(window as any).L || !(window as any).L.map) {
          console.error('Leaflet not properly loaded')
          return
        }

        const L = (window as any).L
        
        // Create map
        const map = L.map(mapRef.current, {
          center: [51.505, -0.09],
          zoom: 13
        })

        console.log('Map created successfully')

        // Add tile layer
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© OpenStreetMap contributors'
        }).addTo(map)

        console.log('Tile layer added')

        mapInstanceRef.current = map
        setIsMapReady(true)

      } catch (error) {
        console.error('Error creating map:', error)
      }
    }

    // Try to initialize with a small delay
    setTimeout(initMap, 100)
  }, [leafletLoaded])

  // Handle map clicks
  useEffect(() => {
    if (!mapInstanceRef.current || !isMapReady) return

    const handleMapClick = (e: any) => {
      console.log('Map clicked:', e.latlng)
      
      if (addingMode === 'location') {
        const { lat, lng } = e.latlng
        
        // Simple coordinate conversion
        const bounds = mapInstanceRef.current.getBounds()
        const x = (lng - bounds.getWest()) / (bounds.getEast() - bounds.getWest())
        const y = (bounds.getNorth() - lat) / (bounds.getNorth() - bounds.getSouth())
        
        const newLocation: Location = {
          id: Date.now(), // Use timestamp for unique ID
          name: newLocationData.name || `Location ${locations.length + 1}`,
          x: Math.max(0, Math.min(1, x)),
          y: Math.max(0, Math.min(1, y)),
          demand: newLocationData.demand,
          type: newLocationData.type
        }

        console.log('Adding location:', newLocation)
        setLocations([...locations, newLocation])
        setAddingMode(null)
        setNewLocationData({ name: '', type: 'customer', demand: 0 })
      }
    }

    mapInstanceRef.current.on('click', handleMapClick)

    // Update cursor
    const container = mapInstanceRef.current.getContainer()
    if (addingMode === 'location') {
      container.style.cursor = 'crosshair'
    } else {
      container.style.cursor = ''
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.off('click', handleMapClick)
      }
    }
  }, [addingMode, isMapReady, newLocationData, locations, setLocations])

  // Update markers
  useEffect(() => {
    if (!mapInstanceRef.current || !isMapReady || !(window as any).L) return

    console.log('Updating markers for', locations.length, 'locations')

    // Clear existing markers
    markersRef.current.forEach(marker => {
      mapInstanceRef.current.removeLayer(marker)
    })
    markersRef.current = []

    const L = (window as any).L

    // Add new markers
    locations.forEach(location => {
      try {
        // Convert normalized coordinates back to lat/lng
        const bounds = mapInstanceRef.current.getBounds()
        const lat = bounds.getNorth() - (location.y * (bounds.getNorth() - bounds.getSouth()))
        const lng = bounds.getWest() + (location.x * (bounds.getEast() - bounds.getWest()))

        const getMarkerConfig = (type: string) => {
          const configs = {
            depot: { color: '#dc2626', name: 'Depot' },
            customer: { color: '#2563eb', name: 'Customer' },
            pickup: { color: '#16a34a', name: 'Pickup' },
            delivery: { color: '#7c3aed', name: 'Delivery' }
          }
          return configs[type as keyof typeof configs] || configs.delivery
        }

        const config = getMarkerConfig(location.type)
        
        // Create simple colored circle marker
        const customIcon = L.divIcon({
          html: `
            <div style="
              width: 16px;
              height: 16px;
              background: ${config.color};
              border: 3px solid white;
              border-radius: 50%;
              box-shadow: 0 2px 6px rgba(0,0,0,0.3);
            "></div>
          `,
          className: 'simple-marker',
          iconSize: [16, 16],
          iconAnchor: [8, 8]
        })

        const marker = L.marker([lat, lng], { icon: customIcon })
          .addTo(mapInstanceRef.current)
          .bindPopup(`
            <div style="padding: 12px; min-width: 180px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
              <div style="display: flex; align-items: center; margin-bottom: 8px;">
                <div style="width: 12px; height: 12px; background: ${config.color}; border-radius: 50%; margin-right: 8px;"></div>
                <h4 style="margin: 0; color: ${config.color}; font-size: 16px; font-weight: 600;">${location.name}</h4>
              </div>
              <div style="background: #f8f9fa; padding: 8px; border-radius: 6px; margin-bottom: 8px;">
                <p style="margin: 2px 0; font-size: 14px; color: #4b5563;"><strong>Type:</strong> ${config.name}</p>
                <p style="margin: 2px 0; font-size: 14px; color: #4b5563;"><strong>Demand:</strong> ${location.demand}</p>
                <p style="margin: 2px 0; font-size: 14px; color: #4b5563;"><strong>Coordinates:</strong> ${lat.toFixed(4)}, ${lng.toFixed(4)}</p>
              </div>
              <div style="display: flex; gap: 6px;">
                <button onclick="window.editLocation && window.editLocation(${location.id})" 
                  style="flex: 1; padding: 6px 12px; background: ${config.color}; color: white; border: none; border-radius: 4px; font-size: 12px; cursor: pointer; font-weight: 500;">
                  Edit
                </button>
                <button onclick="window.deleteLocation && window.deleteLocation(${location.id})" 
                  style="flex: 1; padding: 6px 12px; background: #ef4444; color: white; border: none; border-radius: 4px; font-size: 12px; cursor: pointer; font-weight: 500;">
                  Delete
                </button>
              </div>
            </div>
          `)
          .bindTooltip(`
            <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
              <div style="font-weight: 600; color: ${config.color};">${location.name}</div>
              <div style="font-size: 12px; color: #6b7280; margin-top: 2px;">${config.name} • Demand: ${location.demand}</div>
            </div>
          `, {
            permanent: false,
            direction: 'top',
            offset: [0, -15],
            opacity: 0.9,
            className: 'custom-tooltip'
          })

        markersRef.current.push(marker)
      } catch (error) {
        console.error('Error adding marker for location:', location, error)
      }
    })

    // Global functions
    ;(window as any).editLocation = (id: number) => {
      const location = locations.find(l => l.id === id)
      if (location) {
        const newName = prompt('Enter new name:', location.name)
        if (newName && newName.trim()) {
          setLocations(locations.map(l => 
            l.id === id ? { ...l, name: newName.trim() } : l
          ))
        }
      }
    }

    ;(window as any).deleteLocation = (id: number) => {
      if (confirm('Are you sure you want to delete this location?')) {
        console.log('Deleting location:', id)
        setLocations(locations.filter(l => l.id !== id))
      }
    }
  }, [locations, isMapReady, setLocations])

  // Add custom CSS for tooltips
  useEffect(() => {
    if (!document.getElementById('leaflet-custom-styles')) {
      const style = document.createElement('style')
      style.id = 'leaflet-custom-styles'
      style.textContent = `
        .simple-marker {
          background: transparent !important;
          border: none !important;
        }
        
        .custom-tooltip {
          background: rgba(0, 0, 0, 0.8) !important;
          border: none !important;
          border-radius: 6px !important;
          color: white !important;
          font-size: 13px !important;
          padding: 6px 10px !important;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3) !important;
        }
        
        .custom-tooltip:before {
          border-top-color: rgba(0, 0, 0, 0.8) !important;
        }
        
        .leaflet-popup-content-wrapper {
          border-radius: 8px !important;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15) !important;
        }
        
        .leaflet-popup-content {
          margin: 0 !important;
          line-height: 1.4;
        }
      `
      document.head.appendChild(style)
    }
  }, [])

  const addVehicle = () => {
    if (!newVehicleData.name.trim()) return
    
    const newVehicle: Vehicle = {
      id: Date.now(),
      name: newVehicleData.name,
      capacity: newVehicleData.capacity,
      costPerKm: newVehicleData.costPerKm
    }
    setVehicles([...vehicles, newVehicle])
    setNewVehicleData({ name: '', capacity: 50, costPerKm: 1.0 })
  }

  const startAdding = () => {
    if (!newLocationData.name.trim()) {
      alert('Please enter a location name first')
      return
    }
    setAddingMode('location')
  }

  const cancelAdding = () => {
    setAddingMode(null)
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 mb-8">
      {/* Header */}
      <div className="p-6 border-b border-slate-200">
        <h3 className="text-lg font-semibold text-slate-900">Interactive Map</h3>
        <p className="text-sm text-slate-600">
          {!leafletLoaded ? 'Loading Leaflet...' :
           !isMapReady ? 'Initializing map...' :
           'Configure locations and vehicles below, then click to add them to the map'}
        </p>
      </div>

      {/* Controls */}
      <div className="p-6 border-b border-slate-200 bg-slate-50">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Location Section */}
          <div className="bg-white p-4 rounded-lg border border-slate-200">
            <h4 className="font-semibold text-slate-800 mb-4 flex items-center">
              <MapPin className="w-5 h-5 mr-2 text-blue-600" />
              Add Location
            </h4>
            
            <div className="space-y-3">
              <input
                type="text"
                placeholder="Location name (required)"
                value={newLocationData.name}
                onChange={(e) => setNewLocationData({...newLocationData, name: e.target.value})}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
              />
              
              <div className="grid grid-cols-2 gap-3">
                <select
                  value={newLocationData.type}
                  onChange={(e) => setNewLocationData({...newLocationData, type: e.target.value as Location['type']})}
                  className="px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                >
                  <option value="depot">🏠 Depot</option>
                  <option value="customer">🏢 Customer</option>
                  <option value="pickup">📦 Pickup</option>
                  <option value="delivery">📍 Delivery</option>
                </select>
                
                <input
                  type="number"
                  placeholder="Demand"
                  min="0"
                  value={newLocationData.demand}
                  onChange={(e) => setNewLocationData({...newLocationData, demand: parseInt(e.target.value) || 0})}
                  className="px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {addingMode !== 'location' ? (
                <button
                  onClick={startAdding}
                  disabled={!isMapReady || !newLocationData.name.trim()}
                  className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>Click to Add on Map</span>
                </button>
              ) : (
                <button
                  onClick={cancelAdding}
                  className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center justify-center space-x-2"
                >
                  <span>Cancel Adding</span>
                </button>
              )}
            </div>

            {addingMode === 'location' && (
              <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-700 font-medium">
                  ✨ Click anywhere on the map to place "{newLocationData.name}"
                </p>
              </div>
            )}
          </div>

          {/* Vehicle Section */}
          <div className="bg-white p-4 rounded-lg border border-slate-200">
            <h4 className="font-semibold text-slate-800 mb-4 flex items-center">
              <Truck className="w-5 h-5 mr-2 text-green-600" />
              Add Vehicle
            </h4>
            
            <div className="space-y-3">
              <input
                type="text"
                placeholder="Vehicle name (required)"
                value={newVehicleData.name}
                onChange={(e) => setNewVehicleData({...newVehicleData, name: e.target.value})}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500"
              />
              
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="number"
                  placeholder="Capacity"
                  min="1"
                  value={newVehicleData.capacity}
                  onChange={(e) => setNewVehicleData({...newVehicleData, capacity: parseInt(e.target.value) || 50})}
                  className="px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500"
                />
                
                <input
                  type="number"
                  step="0.1"
                  placeholder="Cost/km"
                  min="0"
                  value={newVehicleData.costPerKm}
                  onChange={(e) => setNewVehicleData({...newVehicleData, costPerKm: parseFloat(e.target.value) || 1.0})}
                  className="px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500"
                />
              </div>

              <button
                onClick={addVehicle}
                disabled={!newVehicleData.name.trim()}
                className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                <Plus className="w-4 h-4" />
                <span>Add Vehicle</span>
              </button>
            </div>
          </div>
        </div>

        {/* Status */}
        {(locations.length > 0 || vehicles.length > 0) && (
          <div className="mt-4 p-3 bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg">
            <p className="text-sm font-medium text-gray-700">
              📊 Current: {locations.length} location(s), {vehicles.length} vehicle(s)
            </p>
          </div>
        )}
      </div>

      {/* Map */}
      <div className="relative">
        <div 
          ref={mapRef} 
          className="h-96 w-full"
          style={{ minHeight: '400px' }}
        />
        
        {(!leafletLoaded || !isMapReady) && (
          <div className="absolute inset-0 flex items-center justify-center bg-slate-100">
            <div className="text-center">
              <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
              <p className="text-slate-600">
                {!leafletLoaded ? 'Loading Leaflet library...' : 'Creating map...'}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Footer with Legend */}
      {isMapReady && (
        <div className="p-4 border-t border-slate-200 bg-gradient-to-r from-slate-50 to-slate-100">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-4 text-sm">
              <span className="font-semibold text-slate-700">Location Types:</span>
              
              <div className="flex items-center space-x-2 px-3 py-1 bg-red-50 border border-red-200 rounded-full">
                <div className="w-3 h-3 bg-red-600 rounded-full"></div>
                <span className="text-red-700 font-medium">Depot</span>
              </div>
              
              <div className="flex items-center space-x-2 px-3 py-1 bg-blue-50 border border-blue-200 rounded-full">
                <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
                <span className="text-blue-700 font-medium">Customer</span>
              </div>
              
              <div className="flex items-center space-x-2 px-3 py-1 bg-green-50 border border-green-200 rounded-full">
                <div className="w-3 h-3 bg-green-600 rounded-full"></div>
                <span className="text-green-700 font-medium">Pickup</span>
              </div>
              
              <div className="flex items-center space-x-2 px-3 py-1 bg-purple-50 border border-purple-200 rounded-full">
                <div className="w-3 h-3 bg-purple-600 rounded-full"></div>
                <span className="text-purple-700 font-medium">Delivery</span>
              </div>
            </div>
            
            <div className="text-xs text-slate-500 bg-white px-3 py-1 rounded-full border border-slate-200">
              💡 Hover over markers for quick info • Click for details
            </div>
          </div>
        </div>
      )}
    </div>
  )
}