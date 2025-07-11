import React from 'react'
import { OptimizationResult, Location, Vehicle } from '@/lib/types'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { Clock, DollarSign, Route, Truck, Target } from 'lucide-react'

interface ResultsProps {
 results: OptimizationResult
 locations: Location[]
 vehicles: Vehicle[]
}

export default function Results({ results, locations, vehicles }: ResultsProps) {
 const routeData = results.routes.map((route, index) => ({
   name: `Vehicle ${route.vehicleId}`,
   distance: Math.round(route.totalDistance * 10) / 10,
   cost: Math.round(route.totalCost * 100) / 100,
   stops: route.stops.length - 1
 }))

 const getLocationName = (id: number) => {
   return locations.find(loc => loc.id === id)?.name || `Location ${id}`
 }

 const getVehicleName = (id: number) => {
   return vehicles.find(v => v.id === id)?.name || `Vehicle ${id}`
 }

 const formatTime = (hours: number) => {
   const h = Math.floor(hours)
   const m = Math.round((hours - h) * 60)
   return `${h}h ${m}m`
 }

 return (
   <div className="space-y-6">
     {/* Summary Stats */}
     <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
       <div className="bg-white p-6 rounded-lg shadow border">
         <div className="flex items-center justify-between">
           <div>
             <p className="text-sm font-medium text-gray-600">Total Cost</p>
             <p className="text-2xl font-bold text-blue-600">
               ${results.totalCost.toFixed(2)}
             </p>
           </div>
           <DollarSign className="w-8 h-8 text-blue-600" />
         </div>
       </div>
       
       <div className="bg-white p-6 rounded-lg shadow border">
         <div className="flex items-center justify-between">
           <div>
             <p className="text-sm font-medium text-gray-600">Total Distance</p>
             <p className="text-2xl font-bold text-green-600">
               {results.totalDistance.toFixed(1)} km
             </p>
           </div>
           <Route className="w-8 h-8 text-green-600" />
         </div>
       </div>
       
       <div className="bg-white p-6 rounded-lg shadow border">
         <div className="flex items-center justify-between">
           <div>
             <p className="text-sm font-medium text-gray-600">Total Time</p>
             <p className="text-2xl font-bold text-purple-600">
               {formatTime(results.totalTime)}
             </p>
           </div>
           <Clock className="w-8 h-8 text-purple-600" />
         </div>
       </div>
       
       <div className="bg-white p-6 rounded-lg shadow border">
         <div className="flex items-center justify-between">
           <div>
             <p className="text-sm font-medium text-gray-600">Solve Time</p>
             <p className="text-2xl font-bold text-orange-600">
               {results.solveTime.toFixed(1)}s
             </p>
             <p className="text-xs text-gray-500">{results.algorithm}</p>
           </div>
           <Target className="w-8 h-8 text-orange-600" />
         </div>
       </div>
     </div>

     {/* Chart */}
     <div className="bg-white p-6 rounded-lg shadow">
       <h3 className="text-lg font-semibold mb-4">Route Performance</h3>
       <ResponsiveContainer width="100%" height={300}>
         <BarChart data={routeData}>
           <CartesianGrid strokeDasharray="3 3" />
           <XAxis dataKey="name" />
           <YAxis />
           <Tooltip />
           <Bar dataKey="distance" fill="#3b82f6" name="Distance (km)" />
           <Bar dataKey="cost" fill="#ef4444" name="Cost ($)" />
         </BarChart>
       </ResponsiveContainer>
     </div>

     {/* Detailed Routes */}
     <div className="bg-white rounded-lg shadow">
       <div className="px-6 py-4 border-b border-gray-200">
         <h3 className="text-lg font-semibold">Detailed Routes</h3>
       </div>
       
       <div className="divide-y divide-gray-200">
         {results.routes.map((route) => (
           <div key={route.vehicleId} className="p-6">
             <div className="flex items-center justify-between mb-4">
               <div className="flex items-center space-x-3">
                 <Truck className="w-5 h-5 text-blue-600" />
                 <h4 className="text-lg font-medium">{getVehicleName(route.vehicleId)}</h4>
               </div>
               
               <div className="flex space-x-6 text-sm text-gray-600">
                 <span>Distance: {route.totalDistance.toFixed(1)} km</span>
                 <span>Cost: ${route.totalCost.toFixed(2)}</span>
                 <span>Time: {formatTime(route.totalTime)}</span>
               </div>
             </div>
             
             <div className="space-y-2">
               {route.stops.map((stop, stopIndex) => {
                 const location = locations.find(loc => loc.id === stop.locationId)
                 const isDepot = location?.type === 'depot'
                 
                 return (
                   <div key={stopIndex} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                     <div className="flex items-center space-x-2 flex-1">
                       <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium ${
                         isDepot ? 'bg-red-500' : 'bg-blue-500'
                       }`}>
                         {stopIndex + 1}
                       </div>
                       
                       <div className="flex-1">
                         <span className="font-medium">{getLocationName(stop.locationId)}</span>
                         {location?.demand && location.demand > 0 && (
                           <span className="ml-2 text-sm text-gray-600">
                             (Demand: {location.demand})
                           </span>
                         )}
                       </div>
                     </div>
                     
                     <div className="flex space-x-4 text-sm text-gray-600">
                       <span>Arrival: {formatTime(stop.arrivalTime)}</span>
                       <span>Load: {stop.load}</span>
                       {stop.distance > 0 && (
                         <span>Distance: {stop.distance.toFixed(1)} km</span>
                       )}
                     </div>
                   </div>
                 )
               })}
             </div>
           </div>
         ))}
       </div>
     </div>
   </div>
 )
}
