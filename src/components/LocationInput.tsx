import React, { useState } from 'react'
import { Location } from '@/lib/types'
import { Plus, Trash2, MapPin, Home, Building2, Package } from 'lucide-react'

interface LocationInputProps {
  locations?: Location[]  // Make optional
  setLocations: (locations: Location[]) => void
}

export default function LocationInput({ locations = [], setLocations }: LocationInputProps) {  // Default to empty array
  const [newLocation, setNewLocation] = useState<Partial<Location>>({
    name: '',
    x: 0.5,
    y: 0.5,
    demand: 0,
    type: 'customer'
  })

  const addLocation = () => {
    if (newLocation.name) {
      const location: Location = {
        id: Math.max(...locations.map(l => l.id), 0) + 1,
        name: newLocation.name,
        x: newLocation.x || 0.5,
        y: newLocation.y || 0.5,
        demand: newLocation.demand || 0,
        type: newLocation.type || 'customer'
      }
      setLocations([...locations, location])
      setNewLocation({
        name: '',
        x: 0.5,
        y: 0.5,
        demand: 0,
        type: 'customer'
      })
    }
  }

  const removeLocation = (id: number) => {
    setLocations(locations.filter(l => l.id !== id))
  }

  const updateLocation = (id: number, updates: Partial<Location>) => {
    setLocations(locations.map(l => 
      l.id === id ? { ...l, ...updates } : l
    ))
  }

  const getLocationIcon = (type: Location['type']) => {
    switch (type) {
      case 'depot': return <Home className="w-4 h-4 text-red-600" />
      case 'customer': return <Building2 className="w-4 h-4 text-blue-600" />
      case 'pickup': return <Package className="w-4 h-4 text-green-600" />
      case 'delivery': return <MapPin className="w-4 h-4 text-purple-600" />
    }
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold mb-4">Locations ({locations.length})</h3>
      
      <div className="mb-6 p-4 border border-gray-200 rounded-lg">
        <h4 className="font-medium mb-3">Add New Location</h4>
        <div className="grid grid-cols-2 gap-3 mb-3">
          <input
            type="text"
            placeholder="Location name"
            value={newLocation.name}
            onChange={(e) => setNewLocation({...newLocation, name: e.target.value})}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
          <select
            value={newLocation.type}
            onChange={(e) => setNewLocation({...newLocation, type: e.target.value as Location['type']})}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="depot">Depot</option>
            <option value="customer">Customer</option>
            <option value="pickup">Pickup</option>
            <option value="delivery">Delivery</option>
          </select>
        </div>
        
        <div className="grid grid-cols-3 gap-3 mb-3">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">X (0-1)</label>
            <input
              type="number"
              min="0"
              max="1"
              step="0.1"
              value={newLocation.x}
              onChange={(e) => setNewLocation({...newLocation, x: parseFloat(e.target.value)})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Y (0-1)</label>
            <input
              type="number"
              min="0"
              max="1"
              step="0.1"
              value={newLocation.y}
              onChange={(e) => setNewLocation({...newLocation, y: parseFloat(e.target.value)})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Demand</label>
            <input
              type="number"
              min="0"
              value={newLocation.demand}
              onChange={(e) => setNewLocation({...newLocation, demand: parseInt(e.target.value) || 0})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
        
        <button
          onClick={addLocation}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Add Location</span>
        </button>
      </div>

      <div className="space-y-2 max-h-96 overflow-y-auto">
        {locations && locations.map((location) => (
          <div key={location.id} className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg">
            <div className="flex items-center space-x-2 flex-1">
              {getLocationIcon(location.type)}
              <input
                type="text"
                value={location.name}
                onChange={(e) => updateLocation(location.id, { name: e.target.value })}
                className="flex-1 px-2 py-1 border border-gray-300 rounded focus:ring-1 focus:ring-blue-500"
              />
            </div>
            
            <select
              value={location.type}
              onChange={(e) => updateLocation(location.id, { type: e.target.value as Location['type'] })}
              className="px-2 py-1 border border-gray-300 rounded focus:ring-1 focus:ring-blue-500"
            >
              <option value="depot">Depot</option>
              <option value="customer">Customer</option>
              <option value="pickup">Pickup</option>
              <option value="delivery">Delivery</option>
            </select>
            
            <input
              type="number"
              min="0"
              max="1"
              step="0.1"
              value={location.x}
              onChange={(e) => updateLocation(location.id, { x: parseFloat(e.target.value) })}
              className="w-16 px-2 py-1 border border-gray-300 rounded focus:ring-1 focus:ring-blue-500"
            />
            
            <input
              type="number"
              min="0"
              max="1"
              step="0.1"
              value={location.y}
              onChange={(e) => updateLocation(location.id, { y: parseFloat(e.target.value) })}
              className="w-16 px-2 py-1 border border-gray-300 rounded focus:ring-1 focus:ring-blue-500"
            />
            
            <input
              type="number"
              min="0"
              value={location.demand}
              onChange={(e) => updateLocation(location.id, { demand: parseInt(e.target.value) || 0 })}
              className="w-16 px-2 py-1 border border-gray-300 rounded focus:ring-1 focus:ring-blue-500"
            />
            
            <button
              onClick={() => removeLocation(location.id)}
              className="text-red-600 hover:text-red-800 p-1"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
      
      {(!locations || locations.length === 0) && (
        <div className="text-center py-8 text-gray-500">
          <MapPin className="w-12 h-12 mx-auto mb-2 text-gray-400" />
          <p>No locations added yet. Add some locations to get started.</p>
        </div>
      )}
    </div>
  )
}
