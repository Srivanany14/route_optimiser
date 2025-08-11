import React, { useState, useEffect } from 'react';

const AccurateFleetDashboard = () => {
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [mapError, setMapError] = useState(false);
  const [deliveryProgress, setDeliveryProgress] = useState({});

  // Accurate data from your hardcoded routes
  const fleetData = {
    operationDate: '2024-01-15',
    depot: {
      name: 'Midtown Manhattan Depot',
      address: '34th Street & 7th Avenue, New York, NY 10001',
      coordinates: { lat: 40.7505, lng: -73.9934 }
    },
    // Accurate route data matching your hardcoded implementation
    vehicles: [
      {
        id: 'NYC-001',
        driver: 'Michael Rodriguez',
        vehicleType: 'Ford Transit',
        capacity: '15 packages',
        status: 'Active',
        route: 'Mixed zones + Home Depot',
        customers: 7, // Accurate: 7 customers + Home Depot
        estimatedTime: '15m',
        distance: '6.8 km',
        routeSequence: [0, 1, 8, 10, 7, 4, 9, 25, 0],
        stops: [
          { id: 1, name: 'Macy\'s Herald Square', address: '151 W 34th St', time: '08:02', status: 'pending', demand: 3 },
          { id: 8, name: 'Murray Hill', address: '200 Lexington Ave', time: '08:04', status: 'pending', demand: 2 },
          { id: 10, name: 'Grand Central South', address: '89 E 42nd St', time: '08:06', status: 'pending', demand: 3 },
          { id: 7, name: '38th & Lexington', address: '120 E 38th St', time: '08:08', status: 'pending', demand: 3 },
          { id: 4, name: 'Bryant Park Cafe', address: '1065 Avenue of Americas', time: '08:10', status: 'pending', demand: 2 },
          { id: 9, name: '42nd & Park Avenue', address: '230 Park Ave', time: '08:12', status: 'pending', demand: 4 },
          { id: 25, name: 'Home Depot Manhattan', address: '40 W 23rd St', time: '08:14', status: 'pending', demand: 5 }
        ],
        currentLocation: { lat: 40.7505, lng: -73.9934 } // At depot
      },
      {
        id: 'NYC-002',
        driver: 'Sarah Chen',
        vehicleType: 'Mercedes Sprinter',
        capacity: '12 packages',
        status: 'Active',
        route: 'North + West zones',
        customers: 5, // Accurate: 5 customers
        estimatedTime: '15m',
        distance: '5.9 km',
        routeSequence: [0, 5, 3, 2, 16, 17, 0],
        stops: [
          { id: 5, name: '40th & Broadway', address: '1540 Broadway', time: '08:02', status: 'pending', demand: 3 },
          { id: 3, name: 'Times Square Plaza', address: '1560 Broadway', time: '08:05', status: 'pending', demand: 4 },
          { id: 2, name: '42nd & 7th Avenue', address: '229 W 42nd St', time: '08:08', status: 'pending', demand: 2 },
          { id: 16, name: '42nd & 9th Avenue', address: '630 9th Ave', time: '08:11', status: 'pending', demand: 2 },
          { id: 17, name: '38th & 9th Avenue', address: '420 9th Ave', time: '08:14', status: 'pending', demand: 3 }
        ],
        currentLocation: { lat: 40.7505, lng: -73.9934 } // At depot
      },
      {
        id: 'NYC-003',
        driver: 'James Wilson',
        vehicleType: 'Isuzu NPR',
        capacity: '18 packages',
        status: 'Active',
        route: 'Central + West zones',
        customers: 7, // Accurate: 7 customers
        estimatedTime: '15m',
        distance: '7.2 km',
        routeSequence: [0, 22, 21, 24, 20, 19, 18, 23, 0],
        stops: [
          { id: 22, name: 'Penn Plaza East', address: '2 Penn Plaza', time: '08:01', status: 'pending', demand: 2 },
          { id: 21, name: 'Madison Square Garden', address: '4 Pennsylvania Plaza', time: '08:03', status: 'pending', demand: 4 },
          { id: 24, name: '33rd & 7th Avenue', address: '1 Penn Plaza', time: '08:05', status: 'pending', demand: 2 },
          { id: 20, name: 'Hudson Yards South', address: '500 W 33rd St', time: '08:08', status: 'pending', demand: 4 },
          { id: 19, name: '30th & 10th Avenue', address: '300 10th Ave', time: '08:10', status: 'pending', demand: 3 },
          { id: 18, name: '34th & 9th Avenue', address: '340 9th Ave', time: '08:12', status: 'pending', demand: 2 },
          { id: 23, name: 'Penn Plaza West', address: '3 Penn Plaza', time: '08:14', status: 'pending', demand: 3 }
        ],
        currentLocation: { lat: 40.7505, lng: -73.9934 } // At depot
      },
      {
        id: 'NYC-004',
        driver: 'Elena Vasquez',
        vehicleType: 'Ford Transit',
        capacity: '14 packages',
        status: 'Active',
        route: 'East + South zones',
        customers: 6, // Accurate: 6 customers
        estimatedTime: '15m',
        distance: '5.5 km',
        routeSequence: [0, 6, 12, 11, 15, 14, 13, 0],
        stops: [
          { id: 6, name: '34th & Park Avenue', address: '200 Park Ave S', time: '08:02', status: 'pending', demand: 2 },
          { id: 12, name: 'Koreatown 32nd', address: '2 W 32nd St', time: '08:04', status: 'pending', demand: 2 },
          { id: 11, name: 'Empire State South', address: '20 W 34th St', time: '08:07', status: 'pending', demand: 3 },
          { id: 15, name: 'Madison Square Park', address: '11 Madison Ave', time: '08:10', status: 'pending', demand: 3 },
          { id: 14, name: '28th & 6th Avenue', address: '875 6th Ave', time: '08:12', status: 'pending', demand: 2 },
          { id: 13, name: '30th & Broadway', address: '1350 Broadway', time: '08:14', status: 'pending', demand: 3 }
        ],
        currentLocation: { lat: 40.7505, lng: -73.9934 } // At depot
      }
    ]
  };

  // Initialize delivery progress
  useEffect(() => {
    const initialProgress = {};
    fleetData.vehicles.forEach(vehicle => {
      initialProgress[vehicle.id] = {
        completed: 0,
        total: vehicle.stops.length
      };
    });
    setDeliveryProgress(initialProgress);
  }, []);

  // Toggle delivery status
  const toggleDeliveryStatus = (vehicleId, stopIndex) => {
    const vehicle = fleetData.vehicles.find(v => v.id === vehicleId);
    const stop = vehicle.stops[stopIndex];
    
    // Toggle status
    if (stop.status === 'pending') {
      stop.status = 'completed';
    } else if (stop.status === 'completed') {
      stop.status = 'in-progress';
    } else {
      stop.status = 'pending';
    }

    // Update progress
    setDeliveryProgress(prev => ({
      ...prev,
      [vehicleId]: {
        ...prev[vehicleId],
        completed: vehicle.stops.filter(s => s.status === 'completed').length
      }
    }));
  };

  // Accurate statistics
  const totalStats = {
    totalVehicles: 4,
    totalLocations: 26, // 1 depot + 25 delivery locations (including Home Depot)
    totalCustomers: 25, // All delivery stops
    totalDistance: 25.4, // Sum of all vehicle distances (6.8 + 5.9 + 7.2 + 5.5)
    totalTime: 60, // Total 15 minutes per vehicle × 4 vehicles = 60 minutes
    averageTimePerVehicle: 15, // 15 minutes per vehicle
    completedDeliveries: Object.values(deliveryProgress).reduce((sum, progress) => sum + progress.completed, 0),
    totalDeliveries: Object.values(deliveryProgress).reduce((sum, progress) => sum + progress.total, 0)
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-50 border-green-200';
      case 'in-progress': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'pending': return 'text-gray-600 bg-gray-50 border-gray-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>;
      case 'in-progress':
        return <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 9l3 3m0 0l-3 3m3-3H8m13 0a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>;
      case 'pending':
        return <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>;
      default:
        return <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>;
    }
  };

  const getVehicleStatusColor = (status) => {
    switch (status) {
      case 'Active': return 'text-green-600 bg-green-100';
      case 'Delayed': return 'text-yellow-600 bg-yellow-100';
      case 'Offline': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">F</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">FleetOps Dashboard</h1>
                <p className="text-sm text-gray-600">Manhattan Distribution Operations • {fleetData.operationDate}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                ● All Systems Operational
              </span>
              <div className="text-right">
                <div className="text-sm font-medium text-gray-900">08:30 EST</div>
                <div className="text-xs text-gray-500">Routes Starting</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Accurate KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2v0a2 2 0 01-2-2v-2a2 2 0 00-2-2H8z" />
                </svg>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{totalStats.totalVehicles}</p>
                <p className="text-sm text-gray-600">Active Vehicles</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M9 21V9l3-1.5" />
                </svg>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{totalStats.completedDeliveries}/{totalStats.totalDeliveries}</p>
                <p className="text-sm text-gray-600">Deliveries Complete</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mr-4">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{totalStats.totalDistance} km</p>
                <p className="text-sm text-gray-600">Total Distance</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mr-4">
                <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{totalStats.averageTimePerVehicle}m</p>
                <p className="text-sm text-gray-600">Avg Time/Vehicle</p>
              </div>
            </div>
          </div>
        </div>

        {/* Interactive Map Section */}
        <div className="mb-8">
          <div className="bg-white rounded-lg shadow-sm">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                    <svg className="w-5 h-5 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-1.447-.894L15 4m0 13V4m0 0L9 7" />
                    </svg>
                    Live Route Tracking Map
                  </h2>
                  <p className="text-sm text-gray-600">Real-time vehicle positions and optimized delivery routes</p>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="flex items-center space-x-1">
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-sm text-gray-600">Live Tracking</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Map Container */}
            <div className="relative">
              {!mapLoaded && !mapError && (
                <div className="absolute inset-0 bg-white bg-opacity-90 flex items-center justify-center z-10">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading NYC route map...</p>
                  </div>
                </div>
              )}
              
              {mapError ? (
                <div className="h-96 bg-red-50 flex items-center justify-center">
                  <div className="text-center">
                    <svg className="w-12 h-12 text-red-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                    <h3 className="text-lg font-medium text-red-900 mb-2">Map Not Found</h3>
                    <p className="text-red-700 mb-4">
                      Could not load /maps/hardcoded_nyc_routes.html<br/>
                      Please ensure the map file is in your public/maps/ folder
                    </p>
                    <button 
                      onClick={() => {setMapError(false); setMapLoaded(false);}}
                      className="inline-flex items-center px-3 py-2 border border-red-300 shadow-sm text-sm font-medium rounded-md text-red-700 bg-white hover:bg-red-50"
                    >
                      Retry Loading Map
                    </button>
                  </div>
                </div>
              ) : (
                <iframe
                  src="/maps/hardcoded_nyc_routes.html"
                  className="w-full h-96 border-0"
                  title="NYC Delivery Routes Interactive Map"
                  onLoad={() => {
                    setMapLoaded(true);
                    console.log('Map loaded successfully from /maps/hardcoded_nyc_routes.html');
                  }}
                  onError={() => {
                    setMapError(true);
                    console.error('Failed to load map from /maps/hardcoded_nyc_routes.html');
                  }}
                  style={{ minHeight: '400px' }}
                />
              )}
              
              {/* Map Legend */}
              <div className="p-4 bg-gray-50 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-6">
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 bg-red-500 rounded-full"></div>
                      <span className="text-sm font-medium text-gray-700">NYC-001 (Mixed Route)</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
                      <span className="text-sm font-medium text-gray-700">NYC-002 (North-West)</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                      <span className="text-sm font-medium text-gray-700">NYC-003 (Central-West)</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 bg-purple-500 rounded-full"></div>
                      <span className="text-sm font-medium text-gray-700">NYC-004 (East-South)</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>Routes updated every 30 seconds</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Vehicle Fleet Status */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Vehicle Fleet Status</h2>
                <p className="text-sm text-gray-600">Real-time vehicle tracking and status</p>
              </div>
              <div className="p-6 space-y-4">
                {fleetData.vehicles.map((vehicle) => (
                  <div
                    key={vehicle.id}
                    className={`border rounded-lg p-4 cursor-pointer transition-all ${
                      selectedVehicle === vehicle.id 
                        ? 'border-blue-500 bg-blue-50' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => setSelectedVehicle(selectedVehicle === vehicle.id ? null : vehicle.id)}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                          <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2v0a2 2 0 01-2-2v-2a2 2 0 00-2-2H8z" />
                          </svg>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{vehicle.id}</p>
                          <p className="text-sm text-gray-600">{vehicle.driver}</p>
                        </div>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getVehicleStatusColor(vehicle.status)}`}>
                        {vehicle.status}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-600">Route</p>
                        <p className="font-medium">{vehicle.route}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Progress</p>
                        <p className="font-medium">{deliveryProgress[vehicle.id]?.completed || 0}/{vehicle.customers}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Distance</p>
                        <p className="font-medium">{vehicle.distance}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">ETA</p>
                        <p className="font-medium">{vehicle.estimatedTime}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Route Details */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">
                      {selectedVehicle ? `Vehicle ${selectedVehicle} - Route Details` : 'Route Overview'}
                    </h2>
                    <p className="text-sm text-gray-600">
                      {selectedVehicle ? 'Click on stops to update delivery status' : 'Select a vehicle to view detailed route'}
                    </p>
                  </div>
                  {selectedVehicle && (
                    <button
                      onClick={() => setSelectedVehicle(null)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      ✕
                    </button>
                  )}
                </div>
              </div>

              {selectedVehicle ? (
                <div className="p-6">
                  {(() => {
                    const vehicle = fleetData.vehicles.find(v => v.id === selectedVehicle);
                    return (
                      <div>
                        {/* Vehicle Info */}
                        <div className="bg-gray-50 rounded-lg p-4 mb-6">
                          <div className="grid md:grid-cols-3 gap-4">
                            <div>
                              <p className="text-sm text-gray-600">Driver</p>
                              <p className="font-medium">{vehicle.driver}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-600">Vehicle</p>
                              <p className="font-medium">{vehicle.vehicleType}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-600">Capacity</p>
                              <p className="font-medium">{vehicle.capacity}</p>
                            </div>
                          </div>
                        </div>

                        {/* Route Timeline */}
                        <div className="space-y-4">
                          <h3 className="font-semibold text-gray-900 mb-4">Route Timeline</h3>
                          
                          {/* Depot Start */}
                          <div className="flex items-start space-x-4">
                            <div className="w-8 h-8 bg-gray-900 rounded-full flex items-center justify-center flex-shrink-0">
                              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                              </svg>
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center justify-between">
                                <p className="font-medium text-gray-900">Distribution Center (Start)</p>
                                <span className="text-sm text-gray-500">08:00</span>
                              </div>
                              <p className="text-sm text-gray-600">{fleetData.depot.address}</p>
                            </div>
                          </div>

                          {/* Route Stops */}
                          {vehicle.stops.map((stop, index) => (
                            <div key={stop.id} className="flex items-start space-x-4">
                              <button
                                onClick={() => toggleDeliveryStatus(vehicle.id, index)}
                                className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 border-2 transition-all hover:scale-110 ${getStatusColor(stop.status)}`}
                              >
                                {getStatusIcon(stop.status)}
                              </button>
                              <div className="flex-1">
                                <div className="flex items-center justify-between">
                                  <p className="font-medium text-gray-900">
                                    Stop {index + 1}: {stop.name}
                                  </p>
                                  <span className="text-sm text-gray-500">{stop.time}</span>
                                </div>
                                <p className="text-sm text-gray-600">{stop.address}</p>
                                <div className="flex items-center space-x-3 mt-1">
                                  <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(stop.status)}`}>
                                    {stop.status.charAt(0).toUpperCase() + stop.status.slice(1)}
                                  </span>
                                  <span className="text-xs text-gray-500">
                                    Demand: {stop.demand} packages
                                  </span>
                                </div>
                              </div>
                            </div>
                          ))}

                          {/* Depot Return */}
                          <div className="flex items-start space-x-4">
                            <div className="w-8 h-8 bg-gray-900 rounded-full flex items-center justify-center flex-shrink-0">
                              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                              </svg>
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center justify-between">
                                <p className="font-medium text-gray-900">Return to Distribution Center</p>
                                <span className="text-sm text-gray-500">~08:15</span>
                              </div>
                              <p className="text-sm text-gray-600">{fleetData.depot.address}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })()}
                </div>
              ) : (
                <div className="p-12 text-center">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-1.447-.894L15 4m0 13V4m0 0L9 7" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Select a Vehicle</h3>
                  <p className="text-gray-600">Click on any vehicle in the fleet status panel to view detailed route information and update delivery status.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer Stats */}
        <div className="mt-8 bg-white rounded-lg shadow-sm p-6">
          <div className="grid md:grid-cols-4 gap-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">{totalStats.totalVehicles}</p>
              <p className="text-sm text-gray-600">Vehicles Deployed</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">{totalStats.totalCustomers}</p>
              <p className="text-sm text-gray-600">Delivery Locations</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-purple-600">{totalStats.totalDistance} km</p>
              <p className="text-sm text-gray-600">Total Route Distance</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-orange-600">{totalStats.totalTime} min</p>
              <p className="text-sm text-gray-600">Total Route Time</p>
            </div>
          </div>
        </div>

        {/* Real-time Status Summary */}
        <div className="mt-8 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                📊 Operation Summary
              </h3>
              <div className="grid md:grid-cols-4 gap-6">
                <div>
                  <p className="text-sm text-gray-600">Route Optimization</p>
                  <p className="font-medium text-gray-900">Hardcoded Custom Routes</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Street Routing</p>
                  <p className="font-medium text-gray-900">Real NYC Streets (OSRM)</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Coverage Area</p>
                  <p className="font-medium text-gray-900">Manhattan, NYC</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Avg Time Per Vehicle</p>
                  <p className="font-medium text-gray-900">{totalStats.averageTimePerVehicle} minutes</p>
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-blue-600">
                {Math.round((totalStats.completedDeliveries / totalStats.totalDeliveries) * 100)}%
              </div>
              <div className="text-sm text-gray-600">Route Progress</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccurateFleetDashboard;