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
        console.log('Attempting to create NYC map...')
        console.log('window.L available:', !!(window as any).L)
        console.log('window.L.map available:', !!(window as any).L?.map)
        
        if (!(window as any).L || !(window as any).L.map) {
          console.error('Leaflet not properly loaded')
          return
        }

        const L = (window as any).L
        
        // Create map centered on NYC (Manhattan)
        const map = L.map(mapRef.current, {
          center: [40.7505, -73.9890], // NYC coordinates (near Herald Square)
          zoom: 14 // Higher zoom for city view
        })

        console.log('NYC Map created successfully')

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
        
        // Convert real NYC coordinates to normalized 0-1 scale
        // Using Manhattan bounds approximately
        const manhattanBounds = {
          north: 40.7831, // Upper Manhattan
          south: 40.7047, // Lower Manhattan  
          east: -73.9441, // East side
          west: -74.0200  // West side (Hudson River)
        }
        
        const x = (lng - manhattanBounds.west) / (manhattanBounds.east - manhattanBounds.west)
        const y = (manhattanBounds.north - lat) / (manhattanBounds.north - manhattanBounds.south)
        
        const newLocation: Location = {
          id: Date.now(), // Use timestamp for unique ID
          name: newLocationData.name || `Location ${locations.length + 1}`,
          x: Math.max(0, Math.min(1, x)), // Clamp between 0-1
          y: Math.max(0, Math.min(1, y)), // Clamp between 0-1
          demand: newLocationData.demand,
          type: newLocationData.type
        }

        console.log('Adding NYC location:', newLocation)
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

    console.log('Updating markers for', locations.length, 'NYC locations')

    // Clear existing markers
    markersRef.current.forEach(marker => {
      mapInstanceRef.current.removeLayer(marker)
    })
    markersRef.current = []

    const L = (window as any).L

    // Manhattan bounds for coordinate conversion
    const manhattanBounds = {
      north: 40.7831,
      south: 40.7047,
      east: -73.9441,
      west: -74.0200
    }

    // Add new markers
    locations.forEach(location => {
      try {
        // Convert normalized coordinates (0-1) back to NYC lat/lng
        const lat = manhattanBounds.north - (location.y * (manhattanBounds.north - manhattanBounds.south))
        const lng = manhattanBounds.west + (location.x * (manhattanBounds.east - manhattanBounds.west))

        const getMarkerConfig = (type: string) => {
          const configs = {
            depot: { color: '#dc2626', name: 'Depot', emoji: '🏠' },
            customer: { color: '#2563eb', name: 'Customer', emoji: '🏢' },
            pickup: { color: '#16a34a', name: 'Pickup', emoji: '📦' },
            delivery: { color: '#7c3aed', name: 'Delivery', emoji: '📍' }
          }
          return configs[type as keyof typeof configs] || configs.delivery
        }

        const config = getMarkerConfig(location.type)
        
        // Create enhanced marker for NYC
        const customIcon = L.divIcon({
          html: `
            <div style="
              width: 20px;
              height: 20px;
              background: ${config.color};
              border: 3px solid white;
              border-radius: 50%;
              box-shadow: 0 3px 8px rgba(0,0,0,0.4);
              display: flex;
              align-items: center;
              justify-content: center;
              font-size: 10px;
              position: relative;
            ">
              <div style="
                position: absolute;
                top: -25px;
                left: 50%;
                transform: translateX(-50%);
                background: rgba(0,0,0,0.8);
                color: white;
                padding: 2px 6px;
                border-radius: 4px;
                font-size: 11px;
                font-weight: 500;
                white-space: nowrap;
                pointer-events: none;
                opacity: 0;
                transition: opacity 0.2s;
              " class="marker-label">${location.name}</div>
            </div>
          `,
          className: 'nyc-marker',
          iconSize: [20, 20],
          iconAnchor: [10, 10]
        })

        const marker = L.marker([lat, lng], { icon: customIcon })
          .addTo(mapInstanceRef.current)
          .bindPopup(`
            <div style="padding: 12px; min-width: 200px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
              <div style="display: flex; align-items: center; margin-bottom: 10px;">
                <div style="width: 14px; height: 14px; background: ${config.color}; border-radius: 50%; margin-right: 10px;"></div>
                <h4 style="margin: 0; color: ${config.color}; font-size: 17px; font-weight: 600;">${location.name}</h4>
              </div>
              <div style="background: #f8f9fa; padding: 10px; border-radius: 8px; margin-bottom: 10px;">
                <p style="margin: 3px 0; font-size: 14px; color: #4b5563;"><strong>Type:</strong> ${config.emoji} ${config.name}</p>
                <p style="margin: 3px 0; font-size: 14px; color: #4b5563;"><strong>Demand:</strong> ${location.demand} units</p>
                <p style="margin: 3px 0; font-size: 14px; color: #4b5563;"><strong>Location:</strong> ${lat.toFixed(4)}, ${lng.toFixed(4)}</p>
                <p style="margin: 3px 0; font-size: 13px; color: #6b7280;"><strong>Zone:</strong> Manhattan, NYC</p>
              </div>
              <div style="display: flex; gap: 8px;">
                <button onclick="window.editLocation && window.editLocation(${location.id})" 
                  style="flex: 1; padding: 8px 12px; background: ${config.color}; color: white; border: none; border-radius: 6px; font-size: 13px; cursor: pointer; font-weight: 500; transition: opacity 0.2s;">
                  ✏️ Edit
                </button>
                <button onclick="window.deleteLocation && window.deleteLocation(${location.id})" 
                  style="flex: 1; padding: 8px 12px; background: #ef4444; color: white; border: none; border-radius: 6px; font-size: 13px; cursor: pointer; font-weight: 500; transition: opacity 0.2s;">
                  🗑️ Delete
                </button>
              </div>
            </div>
          `)
          .bindTooltip(`
            <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
              <div style="font-weight: 600; color: ${config.color}; font-size: 14px;">${config.emoji} ${location.name}</div>
              <div style="font-size: 12px; color: #6b7280; margin-top: 2px;">${config.name} • Demand: ${location.demand}</div>
            </div>
          `, {
            permanent: false,
            direction: 'top',
            offset: [0, -20],
            opacity: 0.95,
            className: 'nyc-tooltip'
          })

        // Add hover effect for marker labels
        marker.on('mouseover', () => {
          const markerElement = marker.getElement()
          if (markerElement) {
            const label = markerElement.querySelector('.marker-label')
            if (label) {
              (label as HTMLElement).style.opacity = '1'
            }
          }
        })

        marker.on('mouseout', () => {
          const markerElement = marker.getElement()
          if (markerElement) {
            const label = markerElement.querySelector('.marker-label')
            if (label) {
              (label as HTMLElement).style.opacity = '0'
            }
          }
        })

        markersRef.current.push(marker)
      } catch (error) {
        console.error('Error adding marker for NYC location:', location, error)
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

  // Add custom CSS for NYC styling
  useEffect(() => {
    if (!document.getElementById('leaflet-nyc-styles')) {
      const style = document.createElement('style')
      style.id = 'leaflet-nyc-styles'
      style.textContent = `
        .nyc-marker {
          background: transparent !important;
          border: none !important;
        }
        
        .nyc-tooltip {
          background: rgba(0, 0, 0, 0.85) !important;
          border: none !important;
          border-radius: 8px !important;
          color: white !important;
          font-size: 13px !important;
          padding: 8px 12px !important;
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3) !important;
          backdrop-filter: blur(10px) !important;
        }
        
        .nyc-tooltip:before {
          border-top-color: rgba(0, 0, 0, 0.85) !important;
        }
        
        .leaflet-popup-content-wrapper {
          border-radius: 12px !important;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2) !important;
          border: 1px solid #e5e7eb !important;
        }
        
        .leaflet-popup-content {
          margin: 0 !important;
          line-height: 1.5;
        }

        .leaflet-popup-close-button {
          font-size: 18px !important;
          padding: 8px !important;
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
        <h3 className="text-lg font-semibold text-slate-900">Interactive NYC Map</h3>
        <p className="text-sm text-slate-600">
          {!leafletLoaded ? 'Loading Leaflet...' :
           !isMapReady ? 'Initializing NYC map...' :
           'Configure locations and vehicles below, then click anywhere in Manhattan to add them to the map'}
        </p>
      </div>

      {/* Controls */}
      <div className="p-6 border-b border-slate-200 bg-slate-50">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Location Section */}
          <div className="bg-white p-4 rounded-lg border border-slate-200">
            <h4 className="font-semibold text-slate-800 mb-4 flex items-center">
              <MapPin className="w-5 h-5 mr-2 text-blue-600" />
              Add NYC Location
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
                  <span>Click to Add on NYC Map</span>
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
                  🗽 Click anywhere in Manhattan to place "{newLocationData.name}"
                </p>
              </div>
            )}
          </div>

          {/* Vehicle Section */}
          <div className="bg-white p-4 rounded-lg border border-slate-200">
            <h4 className="font-semibold text-slate-800 mb-4 flex items-center">
              <Truck className="w-5 h-5 mr-2 text-green-600" />
              Add NYC Vehicle
            </h4>
            
            <div className="space-y-3">
              <input
                type="text"
                placeholder="Vehicle name (e.g., NYC-005)"
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
          <div className="mt-4 p-3 bg-gradient-to-r from-blue-50 to-green-50 border border-blue-200 rounded-lg">
            <p className="text-sm font-medium text-gray-700">
              🗽 NYC Fleet: {locations.length} location(s), {vehicles.length} vehicle(s) ready for optimization
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
                {!leafletLoaded ? 'Loading Leaflet library...' : 'Loading NYC map...'}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Footer with Legend */}
      {isMapReady && (
        <div className="p-4 border-t border-slate-200 bg-gradient-to-r from-blue-50 to-slate-100">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-4 text-sm">
              <span className="font-semibold text-slate-700">NYC Location Types:</span>
              
              <div className="flex items-center space-x-2 px-3 py-1 bg-red-50 border border-red-200 rounded-full">
                <div className="w-3 h-3 bg-red-600 rounded-full"></div>
                <span className="text-red-700 font-medium">🏠 Depot</span>
              </div>
              
              <div className="flex items-center space-x-2 px-3 py-1 bg-blue-50 border border-blue-200 rounded-full">
                <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
                <span className="text-blue-700 font-medium">🏢 Customer</span>
              </div>
              
              <div className="flex items-center space-x-2 px-3 py-1 bg-green-50 border border-green-200 rounded-full">
                <div className="w-3 h-3 bg-green-600 rounded-full"></div>
                <span className="text-green-700 font-medium">📦 Pickup</span>
              </div>
              
              <div className="flex items-center space-x-2 px-3 py-1 bg-purple-50 border border-purple-200 rounded-full">
                <div className="w-3 h-3 bg-purple-600 rounded-full"></div>
                <span className="text-purple-700 font-medium">📍 Delivery</span>
              </div>
            </div>
            
            <div className="text-xs text-slate-500 bg-white px-3 py-1 rounded-full border border-slate-200">
              🗽 Manhattan, NYC • Hover over markers for info • Click for details
            </div>
          </div>
        </div>
      )}
    </div>
  )
}