import React, { useState } from 'react'
import { Vehicle } from '@/lib/types'
import { Plus, Trash2, Truck } from 'lucide-react'

interface VehicleInputProps {
  vehicles?: Vehicle[]  // Make optional
  setVehicles: (vehicles: Vehicle[]) => void
}

export default function VehicleInput({ vehicles = [], setVehicles }: VehicleInputProps) {  // Default to empty array
  const [newVehicle, setNewVehicle] = useState<Partial<Vehicle>>({
    name: '',
    capacity: 50,
    costPerKm: 1.0,
    maxDistance: 200
  })

  const addVehicle = () => {
    if (newVehicle.name) {
      const vehicle: Vehicle = {
        id: Math.max(...vehicles.map(v => v.id), 0) + 1,
        name: newVehicle.name,
        capacity: newVehicle.capacity || 50,
        costPerKm: newVehicle.costPerKm || 1.0,
        maxDistance: newVehicle.maxDistance
      }
      setVehicles([...vehicles, vehicle])
      setNewVehicle({
        name: '',
        capacity: 50,
        costPerKm: 1.0,
        maxDistance: 200
      })
    }
  }

  const removeVehicle = (id: number) => {
    setVehicles(vehicles.filter(v => v.id !== id))
  }

  const updateVehicle = (id: number, updates: Partial<Vehicle>) => {
    setVehicles(vehicles.map(v => 
      v.id === id ? { ...v, ...updates } : v
    ))
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold mb-4">Vehicles ({vehicles.length})</h3>
      
      <div className="mb-6 p-4 border border-gray-200 rounded-lg">
        <h4 className="font-medium mb-3">Add New Vehicle</h4>
        
        <div className="space-y-3">
          <input
            type="text"
            placeholder="Vehicle name"
            value={newVehicle.name}
            onChange={(e) => setNewVehicle({...newVehicle, name: e.target.value})}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
          
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Capacity</label>
              <input
                type="number"
                min="1"
                value={newVehicle.capacity}
                onChange={(e) => setNewVehicle({...newVehicle, capacity: parseInt(e.target.value) || 50})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Cost/km</label>
              <input
                type="number"
                min="0"
                step="0.1"
                value={newVehicle.costPerKm}
                onChange={(e) => setNewVehicle({...newVehicle, costPerKm: parseFloat(e.target.value) || 1.0})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Max Distance</label>
              <input
                type="number"
                min="0"
                value={newVehicle.maxDistance || ''}
                onChange={(e) => setNewVehicle({...newVehicle, maxDistance: parseInt(e.target.value) || undefined})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Optional"
              />
            </div>
          </div>
        </div>
        
        <button
          onClick={addVehicle}
          className="mt-3 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Add Vehicle</span>
        </button>
      </div>

      <div className="space-y-3">
        {vehicles && vehicles.map((vehicle) => (
          <div key={vehicle.id} className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg">
            <Truck className="w-5 h-5 text-green-600 flex-shrink-0" />
            
            <input
              type="text"
              value={vehicle.name}
              onChange={(e) => updateVehicle(vehicle.id, { name: e.target.value })}
              className="flex-1 px-2 py-1 border border-gray-300 rounded focus:ring-1 focus:ring-blue-500"
            />
            
            <div className="flex items-center space-x-2">
              <label className="text-xs text-gray-600">Cap:</label>
              <input
                type="number"
                min="1"
                value={vehicle.capacity}
                onChange={(e) => updateVehicle(vehicle.id, { capacity: parseInt(e.target.value) || 50 })}
                className="w-16 px-2 py-1 border border-gray-300 rounded focus:ring-1 focus:ring-blue-500"
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <label className="text-xs text-gray-600">$/km:</label>
              <input
                type="number"
                min="0"
                step="0.1"
                value={vehicle.costPerKm}
                onChange={(e) => updateVehicle(vehicle.id, { costPerKm: parseFloat(e.target.value) || 1.0 })}
                className="w-16 px-2 py-1 border border-gray-300 rounded focus:ring-1 focus:ring-blue-500"
              />
            </div>
            
            <button
              onClick={() => removeVehicle(vehicle.id)}
              className="text-red-600 hover:text-red-800 p-1 flex-shrink-0"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
      
      {(!vehicles || vehicles.length === 0) && (
        <div className="text-center py-8 text-gray-500">
          <Truck className="w-12 h-12 mx-auto mb-2 text-gray-400" />
          <p>No vehicles added yet.</p>
        </div>
      )}
    </div>
  )
}
