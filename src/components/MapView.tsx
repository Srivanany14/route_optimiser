import React from 'react'
import { Location, OptimizedRoute } from '@/lib/types'
import { MapPin } from 'lucide-react'

interface MapViewProps {
  locations?: Location[]  // Make locations optional too
  routes?: OptimizedRoute[]
}

export default function MapView({ locations = [], routes = [] }: MapViewProps) {  // Default both to empty arrays
  const mapSize = 500
  const padding = 40
  
  const toSVG = (x: number, y: number) => ({
    x: padding + (x * (mapSize - 2 * padding)),
    y: padding + ((1 - y) * (mapSize - 2 * padding))
  })
  
  const getLocationColor = (type: Location['type']) => {
    switch (type) {
      case 'depot': return '#dc2626'
      case 'customer': return '#2563eb'
      case 'pickup': return '#16a34a'
      case 'delivery': return '#9333ea'
      default: return '#6b7280'
    }
  }
  
  const routeColors = ['#ef4444', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6']
  
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold mb-4">
        Map Visualization
        {routes && routes.length > 0 && (
          <span className="text-sm font-normal text-gray-600 ml-2">
            ({routes.length} routes)
          </span>
        )}
      </h3>
      
      <div className="flex justify-center">
        <svg width={mapSize} height={mapSize} className="border border-gray-200 rounded-lg">
          <defs>
            <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
              <path d="M 50 0 L 0 0 0 50" fill="none" stroke="#f3f4f6" strokeWidth="1"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
          
          {/* Routes */}
          {routes && routes.length > 0 && routes.map((route, routeIndex) => {
            const color = routeColors[routeIndex % routeColors.length]
            const routeLocations = route.stops.map(stop => 
              locations.find(loc => loc.id === stop.locationId)
            ).filter(Boolean) as Location[]
            
            return (
              <g key={`route-${route.vehicleId}`}>
                {routeLocations.slice(0, -1).map((location, index) => {
                  const nextLocation = routeLocations[index + 1]
                  if (!nextLocation) return null
                  
                  const start = toSVG(location.x, location.y)
                  const end = toSVG(nextLocation.x, nextLocation.y)
                  
                  return (
                    <line
                      key={`line-${index}`}
                      x1={start.x}
                      y1={start.y}
                      x2={end.x}
                      y2={end.y}
                      stroke={color}
                      strokeWidth="3"
                      opacity="0.7"
                    />
                  )
                })}
              </g>
            )
          })}
          
          {/* Location points */}
          {locations && locations.length > 0 && locations.map((location) => {
            const { x, y } = toSVG(location.x, location.y)
            const color = getLocationColor(location.type)
            
            return (
              <g key={location.id}>
                <circle
                  cx={x}
                  cy={y}
                  r={location.type === 'depot' ? 12 : 8}
                  fill={color}
                  stroke="white"
                  strokeWidth="2"
                />
                
                <text
                  x={x}
                  y={y - (location.type === 'depot' ? 18 : 14)}
                  textAnchor="middle"
                  fontSize="12"
                  fontWeight="500"
                  fill="#374151"
                >
                  {location.name}
                </text>
                
                {location.demand > 0 && (
                  <text
                    x={x}
                    y={y + (location.type === 'depot' ? 20 : 16)}
                    textAnchor="middle"
                    fontSize="10"
                    fill="#6b7280"
                  >
                    {location.demand}
                  </text>
                )}
              </g>
            )
          })}
        </svg>
      </div>
      
      {/* Legend */}
      <div className="mt-6 space-y-4">
        <div>
          <h4 className="font-medium text-sm text-gray-700 mb-2">Location Types</h4>
          <div className="flex flex-wrap gap-4">
            {[
              { type: 'depot', label: 'Depot' },
              { type: 'customer', label: 'Customer' },
              { type: 'pickup', label: 'Pickup' },
              { type: 'delivery', label: 'Delivery' }
            ].map(({ type, label }) => (
              <div key={type} className="flex items-center space-x-2">
                <div
                  className="w-4 h-4 rounded-full border-2 border-white"
                  style={{ backgroundColor: getLocationColor(type as Location['type']) }}
                />
                <span className="text-sm text-gray-600">{label}</span>
              </div>
            ))}
          </div>
        </div>
        
        {routes && routes.length > 0 && (
          <div>
            <h4 className="font-medium text-sm text-gray-700 mb-2">Routes</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {routes.map((route, index) => (
                <div key={route.vehicleId} className="flex items-center space-x-2">
                  <div
                    className="w-4 h-1 rounded"
                    style={{ backgroundColor: routeColors[index % routeColors.length] }}
                  />
                  <span className="text-sm text-gray-600">
                    Vehicle {route.vehicleId}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      
      {(!locations || locations.length === 0) && (
        <div className="text-center py-16 text-gray-500">
          <MapPin className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <p className="text-lg font-medium">No locations to display</p>
          <p className="text-sm">Add some locations in the Input Data tab to see them here</p>
        </div>
      )}
      
      {locations && locations.length > 0 && (!routes || routes.length === 0) && (
        <div className="text-center py-8 text-gray-500">
          <p className="text-sm">Locations displayed • Run optimization to see routes</p>
        </div>
      )}
    </div>
  )
}
