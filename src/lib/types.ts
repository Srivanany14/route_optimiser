// Simple types for MTVRP functionality
export interface Location {
  id: number
  name: string
  x: number  // Normalized coordinates 0-1
  y: number  // Normalized coordinates 0-1
  demand: number
  type: 'depot' | 'customer' | 'pickup' | 'delivery'
  timeWindow?: {
    start: number  // Hours (0-24)
    end: number    // Hours (0-24)
  }
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
