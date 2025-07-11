import { NextRequest, NextResponse } from 'next/server'
import { Location, Vehicle, OptimizationConfig, OptimizationResult } from '@/lib/types'

// Mock optimization - replace with your Python MTVRP model
async function runMTVRPOptimization(
  locations: Location[],
  vehicles: Vehicle[],
  config: OptimizationConfig
): Promise<OptimizationResult> {
  
  // Simulate processing time
  await new Promise(resolve => setTimeout(resolve, 2000))
  
  const depot = locations.find(l => l.type === 'depot') || locations[0]
  const customers = locations.filter(l => l.type !== 'depot')
  
  const calculateDistance = (loc1: Location, loc2: Location) => {
    return Math.sqrt(Math.pow(loc1.x - loc2.x, 2) + Math.pow(loc1.y - loc2.y, 2)) * 100
  }
  
  const routes = vehicles.map((vehicle, index) => {
    const assignedCustomers = customers.filter((_, i) => i % vehicles.length === index)
    
    let currentLocation = depot
    let totalDistance = 0
    let totalTime = 0
    let currentLoad = 0
    
    const stops = [
      {
        locationId: depot.id,
        arrivalTime: 0,
        load: 0,
        distance: 0
      }
    ]
    
    assignedCustomers.forEach(customer => {
      const distance = calculateDistance(currentLocation, customer)
      totalDistance += distance
      totalTime += distance * 0.6
      currentLoad += customer.demand
      
      stops.push({
        locationId: customer.id,
        arrivalTime: totalTime,
        load: currentLoad,
        distance: totalDistance
      })
      
      currentLocation = customer
    })
    
    const returnDistance = calculateDistance(currentLocation, depot)
    totalDistance += returnDistance
    totalTime += returnDistance * 0.6
    
    stops.push({
      locationId: depot.id,
      arrivalTime: totalTime,
      load: 0,
      distance: totalDistance
    })
    
    return {
      vehicleId: vehicle.id,
      stops,
      totalDistance,
      totalCost: totalDistance * vehicle.costPerKm,
      totalTime
    }
  })
  
  const totalCost = routes.reduce((sum, route) => sum + route.totalCost, 0)
  const totalDistance = routes.reduce((sum, route) => sum + route.totalDistance, 0)
  const totalTime = routes.reduce((sum, route) => sum + route.totalTime, 0)
  
  return {
    routes,
    totalCost,
    totalDistance,
    totalTime,
    solveTime: 2.1,
    algorithm: config.algorithm
  }
}

export async function POST(request: NextRequest) {
  try {
    const { locations, vehicles, config } = await request.json()
    
    if (!locations || !Array.isArray(locations) || locations.length < 2) {
      return NextResponse.json({ error: 'At least 2 locations required' }, { status: 400 })
    }
    
    if (!vehicles || !Array.isArray(vehicles) || vehicles.length < 1) {
      return NextResponse.json({ error: 'At least 1 vehicle required' }, { status: 400 })
    }
    
    const hasDepot = locations.some(l => l.type === 'depot')
    if (!hasDepot) {
      return NextResponse.json({ error: 'At least one depot location required' }, { status: 400 })
    }
    
    const result = await runMTVRPOptimization(locations, vehicles, config)
    return NextResponse.json(result)
    
  } catch (error) {
    console.error('Optimization error:', error)
    return NextResponse.json({ error: 'Optimization failed' }, { status: 500 })
  }
}
