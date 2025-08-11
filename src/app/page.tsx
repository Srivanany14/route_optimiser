'use client'

import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import ChoroplethMap from '@/components/ChoroplethMap'

export default function LandingPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
  const canvas = canvasRef.current
  if (!canvas) return

  const ctx = canvas.getContext('2d')
  if (!ctx) return

  canvas.width = window.innerWidth
  canvas.height = window.innerHeight

  // Enhanced 2D Routing Simulator with Premium Visual Effects
  const nodes = []
  const routes = []
  const vehicles = []
  const particles = []
  const connectionPulses = []

  // Create 5 strategic mother depots with enhanced positioning
  const depots = [
    { x: 140, y: 140, id: 0 },           // Top-left
    { x: canvas.width - 140, y: 140 },   // Top-right
    { x: 140, y: canvas.height - 140 },  // Bottom-left
    { x: canvas.width - 140, y: canvas.height - 140 }, // Bottom-right
    { x: canvas.width / 2, y: 100 }      // Top-center
  ]

  // Enhanced depot colors with gradients
  const depotColors = [
    { primary: '#3b82f6', secondary: '#1e40af', accent: '#60a5fa' },
    { primary: '#10b981', secondary: '#047857', accent: '#34d399' },
    { primary: '#f59e0b', secondary: '#d97706', accent: '#fbbf24' },
    { primary: '#ef4444', secondary: '#dc2626', accent: '#f87171' },
    { primary: '#8b5cf6', secondary: '#7c3aed', accent: '#a78bfa' }
  ]

  // Create enhanced depots with pulsing effects
  depots.forEach((depot, index) => {
    nodes.push({
      x: depot.x,
      y: depot.y,
      id: index,
      type: 'depot',
      pulse: index * (Math.PI / 3),
      pulseSpeed: 0.8 + Math.random() * 0.4,
      active: true,
      depotIndex: index,
      colors: depotColors[index],
      energyField: 0,
      connectionStrength: 0.5 + Math.random() * 0.5
    })
  })

  // Create customer networks with better distribution
  depots.forEach((depot, depotIndex) => {
    const customerLocations = []
    const numCustomers = 4 + Math.floor(Math.random() * 3) // 4-6 customers per depot
    
    for (let i = 0; i < numCustomers; i++) {
      let customerPos
      const angle = (i / numCustomers) * Math.PI * 2 + Math.random() * 0.5
      const distance = 80 + Math.random() * 120
      
      if (depotIndex === 0) { // Top-left depot
        customerPos = {
          x: depot.x + Math.cos(angle) * distance,
          y: depot.y + Math.sin(angle) * distance
        }
      } else if (depotIndex === 1) { // Top-right depot
        customerPos = {
          x: depot.x + Math.cos(angle + Math.PI) * distance,
          y: depot.y + Math.sin(angle) * distance
        }
      } else if (depotIndex === 2) { // Bottom-left depot
        customerPos = {
          x: depot.x + Math.cos(angle) * distance,
          y: depot.y + Math.sin(angle + Math.PI) * distance
        }
      } else if (depotIndex === 3) { // Bottom-right depot
        customerPos = {
          x: depot.x + Math.cos(angle + Math.PI) * distance,
          y: depot.y + Math.sin(angle + Math.PI) * distance
        }
      } else { // Top-center depot
        customerPos = {
          x: depot.x + Math.cos(angle) * distance,
          y: depot.y + Math.sin(angle + Math.PI/4) * distance
        }
      }
      
      // Ensure customers stay within bounds
      customerPos.x = Math.max(50, Math.min(canvas.width - 50, customerPos.x))
      customerPos.y = Math.max(50, Math.min(canvas.height - 50, customerPos.y))
      
      customerLocations.push(customerPos)
    }

    customerLocations.forEach((location, customerIndex) => {
      nodes.push({
        x: location.x,
        y: location.y,
        id: nodes.length,
        type: 'customer',
        pulse: Math.random() * Math.PI * 2,
        pulseSpeed: 0.6 + Math.random() * 0.3,
        active: true,
        depotIndex: depotIndex,
        colors: depotColors[depotIndex],
        demandLevel: 0.3 + Math.random() * 0.7,
        lastVisited: 0,
        priority: Math.random()
      })
    })
  })

  // Create enhanced routes with dynamic properties
  nodes.forEach(node => {
    if (node.type === 'customer' && node.active) {
      const depot = nodes.find(n => n.type === 'depot' && n.depotIndex === node.depotIndex)
      if (depot) {
        routes.push({
          from: depot,
          to: node,
          active: true,
          opacity: 0.2 + Math.random() * 0.3,
          flowDirection: Math.random() > 0.5 ? 1 : -1,
          flowSpeed: 0.5 + Math.random() * 1.5,
          dataPackets: []
        })
      }
    }
  })

  // Create enhanced vehicle fleet with better AI
  const vehicleTypes = [
    { size: 8, speed: 0.006, color: '#3b82f6', trail: 12 },
    { size: 6, speed: 0.008, color: '#10b981', trail: 8 },
    { size: 7, speed: 0.007, color: '#f59e0b', trail: 10 },
    { size: 9, speed: 0.005, color: '#ef4444', trail: 15 },
    { size: 7, speed: 0.0065, color: '#8b5cf6', trail: 9 }
  ]
  
  depots.forEach((depot, depotIndex) => {
    const depotCustomers = nodes.filter(n => n.type === 'customer' && n.depotIndex === depotIndex)
    const vehicleType = vehicleTypes[depotIndex]
    
    // Create 2-3 vehicles per depot
    const numVehicles = 2 + Math.floor(Math.random() * 2)
    for (let i = 0; i < numVehicles; i++) {
      if (depotCustomers.length > 0) {
        vehicles.push({
          x: depot.x + (Math.random() - 0.5) * 20,
          y: depot.y + (Math.random() - 0.5) * 20,
          targetNode: depotCustomers[Math.floor(Math.random() * depotCustomers.length)].id,
          speed: vehicleType.speed + Math.random() * 0.002,
          color: vehicleType.color,
          size: vehicleType.size,
          trail: [],
          maxTrail: vehicleType.trail,
          depotIndex: depotIndex,
          homeDepot: { x: depot.x, y: depot.y },
          cargo: Math.random() * 0.8 + 0.2,
          efficiency: 0.7 + Math.random() * 0.3,
          route: [],
          lastUpdate: 0
        })
      }
    }
  })

  // Initialize particle system for ambient effects
  for (let i = 0; i < 30; i++) {
    particles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.2,
      vy: (Math.random() - 0.5) * 0.2,
      size: Math.random() * 2 + 1,
      opacity: Math.random() * 0.3 + 0.1,
      color: `rgba(59, 130, 246, ${Math.random() * 0.2 + 0.1})`
    })
  }

  let time = 0
  let frameCount = 0

  const animate = () => {
    time += 0.015
    frameCount++
    
    // Create sophisticated background with subtle gradients
    const bgGradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height)
    bgGradient.addColorStop(0, 'rgba(248, 250, 252, 0.95)')
    bgGradient.addColorStop(0.5, 'rgba(241, 245, 249, 0.98)')
    bgGradient.addColorStop(1, 'rgba(248, 250, 252, 0.95)')
    
    ctx.fillStyle = bgGradient
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    
    // Add subtle grid pattern
    if (frameCount % 3 === 0) {
      ctx.strokeStyle = 'rgba(148, 163, 184, 0.06)'
      ctx.lineWidth = 1
      ctx.setLineDash([2, 20])
      
      for (let x = 0; x < canvas.width; x += 60) {
        ctx.beginPath()
        ctx.moveTo(x, 0)
        ctx.lineTo(x, canvas.height)
        ctx.stroke()
      }
      
      for (let y = 0; y < canvas.height; y += 60) {
        ctx.beginPath()
        ctx.moveTo(0, y)
        ctx.lineTo(canvas.width, y)
        ctx.stroke()
      }
      ctx.setLineDash([])
    }

    // Update and render ambient particles
    particles.forEach(particle => {
      particle.x += particle.vx
      particle.y += particle.vy
      
      if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1
      if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1
      
      ctx.fillStyle = particle.color
      ctx.beginPath()
      ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
      ctx.fill()
    })

    // Enhanced route rendering with data flow animation
    routes.forEach((route, index) => {
      if (route.active) {
        const baseOpacity = route.opacity + Math.sin(time * 0.8 + index * 0.7) * 0.1
        const distance = Math.sqrt(
          Math.pow(route.to.x - route.from.x, 2) + 
          Math.pow(route.to.y - route.from.y, 2)
        )
        
        // Create flowing gradient effect
        const segments = 8
        for (let i = 0; i < segments; i++) {
          const t1 = i / segments
          const t2 = (i + 1) / segments
          
          const x1 = route.from.x + (route.to.x - route.from.x) * t1
          const y1 = route.from.y + (route.to.y - route.from.y) * t1
          const x2 = route.from.x + (route.to.x - route.from.x) * t2
          const y2 = route.from.y + (route.to.y - route.from.y) * t2
          
          const flowOffset = (time * route.flowSpeed * route.flowDirection) % 1
          const segmentOpacity = baseOpacity * (0.3 + 0.7 * Math.sin(Math.PI * 2 * (t1 + flowOffset)))
          
          const gradient = ctx.createLinearGradient(x1, y1, x2, y2)
          gradient.addColorStop(0, `rgba(59, 130, 246, ${segmentOpacity * 0.8})`)
          gradient.addColorStop(1, `rgba(16, 185, 129, ${segmentOpacity * 0.4})`)
          
          ctx.strokeStyle = gradient
          ctx.lineWidth = 2 + Math.sin(time * 1.2 + index * 0.5) * 0.5
          ctx.setLineDash([12, 6])
          ctx.lineCap = 'round'
          ctx.beginPath()
          ctx.moveTo(x1, y1)
          ctx.lineTo(x2, y2)
          ctx.stroke()
        }
        ctx.setLineDash([])
        
        // Add data packet effects
        if (Math.random() < 0.03) {
          route.dataPackets.push({
            position: 0,
            speed: 0.8 + Math.random() * 0.4,
            size: 2 + Math.random() * 2,
            color: route.from.colors.accent
          })
        }
        
        // Animate data packets
        route.dataPackets.forEach((packet, pIndex) => {
          packet.position += packet.speed * 0.01
          
          if (packet.position <= 1) {
            const x = route.from.x + (route.to.x - route.from.x) * packet.position
            const y = route.from.y + (route.to.y - route.from.y) * packet.position
            
            const packetGradient = ctx.createRadialGradient(x, y, 0, x, y, packet.size * 2)
            packetGradient.addColorStop(0, packet.color)
            packetGradient.addColorStop(1, 'transparent')
            
            ctx.fillStyle = packetGradient
            ctx.beginPath()
            ctx.arc(x, y, packet.size * 2, 0, Math.PI * 2)
            ctx.fill()
            
            ctx.fillStyle = packet.color
            ctx.beginPath()
            ctx.arc(x, y, packet.size, 0, Math.PI * 2)
            ctx.fill()
          }
        })
        
        // Remove finished packets
        route.dataPackets = route.dataPackets.filter(packet => packet.position <= 1)
      }
    })

    // Enhanced node rendering with sophisticated effects
    nodes.forEach((node, nodeIndex) => {
      const pulseScale = 1 + Math.sin(time * node.pulseSpeed + node.pulse) * 0.2
      const energyPulse = Math.sin(time * 2 + nodeIndex * 0.5) * 0.1
      
      if (node.type === 'depot') {
        // Depot energy field
        const fieldSize = 45 + energyPulse * 10
        const fieldGradient = ctx.createRadialGradient(node.x, node.y, 0, node.x, node.y, fieldSize)
        fieldGradient.addColorStop(0, `${node.colors.primary}20`)
        fieldGradient.addColorStop(0.6, `${node.colors.primary}10`)
        fieldGradient.addColorStop(1, 'transparent')
        
        ctx.fillStyle = fieldGradient
        ctx.beginPath()
        ctx.arc(node.x, node.y, fieldSize, 0, Math.PI * 2)
        ctx.fill()
        
        // Depot main glow
        const mainGradient = ctx.createRadialGradient(node.x, node.y, 0, node.x, node.y, 25 * pulseScale)
        mainGradient.addColorStop(0, `${node.colors.primary}80`)
        mainGradient.addColorStop(0.5, `${node.colors.primary}40`)
        mainGradient.addColorStop(1, 'transparent')
        
        ctx.fillStyle = mainGradient
        ctx.beginPath()
        ctx.arc(node.x, node.y, 25 * pulseScale, 0, Math.PI * 2)
        ctx.fill()
        
        // Depot core with sophisticated styling
        const coreGradient = ctx.createRadialGradient(node.x - 3, node.y - 3, 0, node.x, node.y, 12)
        coreGradient.addColorStop(0, node.colors.accent)
        coreGradient.addColorStop(0.7, node.colors.primary)
        coreGradient.addColorStop(1, node.colors.secondary)
        
        ctx.fillStyle = coreGradient
        ctx.beginPath()
        ctx.arc(node.x, node.y, 12, 0, Math.PI * 2)
        ctx.fill()
        
        // Depot ring indicator
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.9)'
        ctx.lineWidth = 3
        ctx.beginPath()
        ctx.arc(node.x, node.y, 12, 0, Math.PI * 2)
        ctx.stroke()
        
        // Activity indicator
        ctx.strokeStyle = node.colors.accent
        ctx.lineWidth = 2
        ctx.beginPath()
        ctx.arc(node.x, node.y, 18 + energyPulse * 3, time * 2, time * 2 + Math.PI * 1.5)
        ctx.stroke()
        
      } else if (node.active) {
        // Customer demand visualization
        const demandSize = 8 + node.demandLevel * 8
        const demandGradient = ctx.createRadialGradient(node.x, node.y, 0, node.x, node.y, demandSize * pulseScale)
        demandGradient.addColorStop(0, `${node.colors.primary}60`)
        demandGradient.addColorStop(0.6, `${node.colors.primary}30`)
        demandGradient.addColorStop(1, 'transparent')
        
        ctx.fillStyle = demandGradient
        ctx.beginPath()
        ctx.arc(node.x, node.y, demandSize * pulseScale, 0, Math.PI * 2)
        ctx.fill()
        
        // Customer core
        const customerGradient = ctx.createRadialGradient(node.x - 2, node.y - 2, 0, node.x, node.y, 7)
        customerGradient.addColorStop(0, node.colors.accent)
        customerGradient.addColorStop(0.8, node.colors.primary)
        customerGradient.addColorStop(1, node.colors.secondary)
        
        ctx.fillStyle = customerGradient
        ctx.beginPath()
        ctx.arc(node.x, node.y, 7, 0, Math.PI * 2)
        ctx.fill()
        
        // Customer border
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)'
        ctx.lineWidth = 2
        ctx.beginPath()
        ctx.arc(node.x, node.y, 7, 0, Math.PI * 2)
        ctx.stroke()
        
        // Priority indicator
        if (node.priority > 0.7) {
          ctx.fillStyle = `${node.colors.accent}80`
          ctx.beginPath()
          ctx.arc(node.x, node.y - 15, 3, 0, Math.PI * 2)
          ctx.fill()
        }
      }
    })

    // Enhanced vehicle rendering with premium effects
    vehicles.forEach((vehicle, vIndex) => {
      const targetNode = nodes[vehicle.targetNode]
      if (!targetNode) return
      
      // Add position to trail with timestamp
      if (frameCount % 2 === 0) {
        vehicle.trail.push({ 
          x: vehicle.x, 
          y: vehicle.y, 
          time: time,
          speed: vehicle.speed 
        })
      }
      
      // Maintain trail length
      if (vehicle.trail.length > vehicle.maxTrail) {
        vehicle.trail.shift()
      }
      
      // Advanced movement with smooth interpolation
      const dx = targetNode.x - vehicle.x
      const dy = targetNode.y - vehicle.y
      const distance = Math.sqrt(dx * dx + dy * dy)
      
      if (distance < 30) {
        // Reached target - intelligent route planning
        const depotCustomers = nodes.filter(n => 
          n.type === 'customer' && 
          n.active && 
          n.depotIndex === vehicle.depotIndex
        )
        
        if (depotCustomers.length > 0) {
          // Choose next target based on demand and distance
          const nextTarget = depotCustomers.reduce((best, customer) => {
            const customerDist = Math.sqrt(
              Math.pow(customer.x - vehicle.x, 2) + 
              Math.pow(customer.y - vehicle.y, 2)
            )
            const score = customer.demandLevel / (customerDist + 1)
            return score > best.score ? { customer, score } : best
          }, { customer: depotCustomers[0], score: 0 })
          
          vehicle.targetNode = nextTarget.customer.id
          vehicle.route.push(nextTarget.customer.id)
        }
      } else {
        // Smooth movement with easing
        const moveX = (dx / distance) * vehicle.speed * 30
        const moveY = (dy / distance) * vehicle.speed * 30
        vehicle.x += moveX
        vehicle.y += moveY
      }
      
      // Enhanced trail rendering
      vehicle.trail.forEach((point, index) => {
        const trailAge = (time - point.time) / 2
        const trailOpacity = Math.max(0, (index / vehicle.trail.length) * 0.6 * (1 - trailAge))
        const trailSize = 1 + (index / vehicle.trail.length) * 2
        
        if (trailOpacity > 0.05) {
          const trailGradient = ctx.createRadialGradient(
            point.x, point.y, 0, 
            point.x, point.y, trailSize * 2
          )
          trailGradient.addColorStop(0, `${vehicle.color}${Math.floor(trailOpacity * 255).toString(16).padStart(2, '0')}`)
          trailGradient.addColorStop(1, 'transparent')
          
          ctx.fillStyle = trailGradient
          ctx.beginPath()
          ctx.arc(point.x, point.y, trailSize * 2, 0, Math.PI * 2)
          ctx.fill()
        }
      })
      
      // Vehicle energy field
      const energySize = vehicle.size * 2 + Math.sin(time * 3 + vIndex) * 2
      const energyGradient = ctx.createRadialGradient(
        vehicle.x, vehicle.y, 0, 
        vehicle.x, vehicle.y, energySize
      )
      energyGradient.addColorStop(0, `${vehicle.color}40`)
      energyGradient.addColorStop(1, 'transparent')
      
      ctx.fillStyle = energyGradient
      ctx.beginPath()
      ctx.arc(vehicle.x, vehicle.y, energySize, 0, Math.PI * 2)
      ctx.fill()
      
      // Main vehicle body with 3D effect
      const vehicleGradient = ctx.createRadialGradient(
        vehicle.x - 2, vehicle.y - 2, 0, 
        vehicle.x, vehicle.y, vehicle.size
      )
      vehicleGradient.addColorStop(0, vehicle.color)
      vehicleGradient.addColorStop(0.6, vehicle.color)
      vehicleGradient.addColorStop(1, `${vehicle.color}80`)
      
      ctx.fillStyle = vehicleGradient
      ctx.beginPath()
      ctx.arc(vehicle.x, vehicle.y, vehicle.size, 0, Math.PI * 2)
      ctx.fill()
      
      // Vehicle highlight
      ctx.fillStyle = 'rgba(255, 255, 255, 0.4)'
      ctx.beginPath()
      ctx.arc(vehicle.x - 2, vehicle.y - 2, vehicle.size * 0.4, 0, Math.PI * 2)
      ctx.fill()
      
      // Vehicle border
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.9)'
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.arc(vehicle.x, vehicle.y, vehicle.size, 0, Math.PI * 2)
      ctx.stroke()
      
      // Cargo level indicator
      const cargoAngle = vehicle.cargo * Math.PI * 2
      ctx.strokeStyle = `${vehicle.color}aa`
      ctx.lineWidth = 3
      ctx.beginPath()
      ctx.arc(vehicle.x, vehicle.y, vehicle.size + 3, -Math.PI/2, -Math.PI/2 + cargoAngle)
      ctx.stroke()
    })
    
    requestAnimationFrame(animate)
  }
  
  animate()

  const handleResize = () => {
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
  }
  window.addEventListener('resize', handleResize)

  return () => {
    window.removeEventListener('resize', handleResize)
  }
}, [])

  return (
    <div className="min-h-screen bg-white text-slate-900">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-xl border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="text-2xl font-bold text-blue-600">TrafficRL</div>
            <div className="flex items-center space-x-8">
              <a href="#features" className="text-slate-600 hover:text-blue-600 transition-colors font-medium">Features</a>
              <a href="#methodology" className="text-slate-600 hover:text-blue-600 transition-colors font-medium">Methodology</a>
              <a href="#results" className="text-slate-600 hover:text-blue-600 transition-colors font-medium">Results</a>
              <Link 
                href="/workspace" 
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors shadow-sm"
              >
                Access System
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <canvas 
          ref={canvasRef}
          className="absolute inset-0 opacity-50"
        />
        <div className="relative z-10 text-center max-w-5xl mx-auto px-6">
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-16 border border-slate-200 shadow-2xl">
            <h1 className="text-6xl font-bold mb-8 text-slate-900">
              RL-Based Traffic <span className="text-blue-600">Route Optimization</span>
            </h1>
            <p className="text-xl text-slate-600 mb-10 max-w-4xl mx-auto leading-relaxed">
              Advanced reinforcement learning system solving MTVPR with integrated traffic and weather forecasting. Achieved 60% cost reduction through statistical analysis of 50+ features and real-time distance matrix optimization.
            </p>
            <div className="flex gap-6 justify-center">
              <Link 
                href="/workspace"
                className="bg-blue-600 hover:bg-blue-700 text-white px-10 py-4 rounded-xl font-semibold text-lg transition-all transform hover:-translate-y-1 shadow-lg hover:shadow-xl"
              >
                Access Research
              </Link>
              <a 
                href="#methodology"
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-10 py-4 rounded-xl font-semibold text-lg transition-all border border-slate-300 hover:border-slate-400"
              >
                View Methodology
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Choropleth Map */}
      <ChoroplethMap />

      {/* Methodology Section */}
      <section id="methodology" className="py-24 px-6 bg-gradient-to-br from-slate-50 to-blue-50/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-5xl font-bold mb-6 text-slate-900">Research Methodology</h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
              Advanced RL algorithms processing real-time data for optimal traffic route optimization
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: "📊",
                title: "Multi-Feature Processing",
                description: "Statistical analysis of 50+ features including traffic density, weather patterns, temporal constraints, and real-time conditions.",
                color: "from-blue-500 to-blue-600"
              },
              {
                icon: "🧠",
                title: "RL Algorithm Implementation", 
                description: "MTVPR solution with time windows and return trip constraints using Deep Q-Networks and policy optimization.",
                color: "from-emerald-500 to-emerald-600"
              },
              {
                icon: "🚛",
                title: "2x Better Vehicle Utilization",
                description: "Enhanced fleet efficiency with intelligent resource allocation and dynamic routing for optimal vehicle capacity utilization.",
                color: "from-amber-500 to-amber-600"
              },
              {
                icon: "🗺️",
                title: "Distance Matrix Analysis",
                description: "Real distance matrix processing for optimal path prediction with dynamic cost function optimization.",
                color: "from-purple-500 to-purple-600"
              }
            ].map((step, index) => (
              <div key={index} className="group relative">
                <div className="absolute inset-0 bg-gradient-to-br from-white to-blue-50/30 rounded-3xl shadow-lg group-hover:shadow-2xl transition-all duration-300 transform group-hover:-translate-y-2"></div>
                <div className="relative bg-white/80 backdrop-blur-sm rounded-3xl p-8 border border-slate-200/50 group-hover:border-blue-300/50 transition-all duration-300">
                  <div className={`w-20 h-20 bg-gradient-to-br ${step.color} rounded-2xl flex items-center justify-center text-3xl mb-6 shadow-lg group-hover:shadow-xl transition-all duration-300 transform group-hover:scale-110`}>
                    <span className="drop-shadow-sm">{step.icon}</span>
                  </div>
                  <h3 className="text-xl font-bold mb-4 text-slate-900 group-hover:text-blue-700 transition-colors">{step.title}</h3>
                  <p className="text-slate-600 leading-relaxed text-sm">{step.description}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-20">
            <div className="inline-flex items-center justify-center px-8 py-4 bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-200 shadow-lg">
              <p className="text-2xl text-slate-700 font-semibold">
                🚀 60% Cost Reduction • 📊 50+ Features • 🚛 2x Vehicle Efficiency
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-5xl font-bold mb-6 text-slate-900">Technical Capabilities</h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
              Research-grade optimization system with advanced RL implementations
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: "🎯",
                title: "MTVPR Solver",
                description: "Complete Multi-Trip Vehicle Routing Problem solution with return trip optimization and time window constraints.",
                color: "from-blue-500 to-blue-600",
                accent: "bg-blue-50 border-blue-200"
              },
              {
                icon: "🌦️",
                title: "Traffic-Weather Integration", 
                description: "Real-time traffic and weather forecast incorporation for enhanced route predictability and efficiency optimization.",
                color: "from-emerald-500 to-emerald-600",
                accent: "bg-emerald-50 border-emerald-200"
              },
              {
                icon: "📈",
                title: "Statistical Analysis",
                description: "50+ feature processing capability including temporal patterns, congestion analysis, and demand forecasting models.",
                color: "from-purple-500 to-purple-600",
                accent: "bg-purple-50 border-purple-200"
              },
              {
                icon: "🗺️",
                title: "Distance Optimization",
                description: "Real distance matrix analysis with dynamic cost function optimization for minimum travel time and fuel consumption.",
                color: "from-amber-500 to-amber-600",
                accent: "bg-amber-50 border-amber-200"
              },
              {
                icon: "⏰",
                title: "Time Window Constraints",
                description: "Efficient scheduling optimization with hard and soft time window constraint satisfaction and delivery prioritization.",
                color: "from-rose-500 to-rose-600",
                accent: "bg-rose-50 border-rose-200"
              },
              {
                icon: "💰",
                title: "Cost Efficiency",
                description: "60% improvement over baseline methods through advanced RL-based decision making and continuous learning algorithms.",
                color: "from-indigo-500 to-indigo-600",
                accent: "bg-indigo-50 border-indigo-200"
              }
            ].map((feature, index) => (
              <div key={index} className="group relative">
                <div className="absolute inset-0 bg-gradient-to-br from-slate-50 to-white rounded-3xl shadow-lg group-hover:shadow-2xl transition-all duration-300 transform group-hover:-translate-y-2"></div>
                <div className={`relative ${feature.accent} rounded-3xl p-8 border transition-all duration-300 group-hover:border-opacity-60`}>
                  <div className={`w-16 h-16 bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center text-2xl mb-6 shadow-lg group-hover:shadow-xl transition-all duration-300 transform group-hover:scale-110`}>
                    <span className="text-white drop-shadow-sm">{feature.icon}</span>
                  </div>
                  <h3 className="text-xl font-bold mb-4 text-slate-900 group-hover:text-blue-700 transition-colors">{feature.title}</h3>
                  <p className="text-slate-600 leading-relaxed text-sm">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Results Section */}
      <section id="results" className="py-24 px-6 bg-gradient-to-br from-slate-50 to-blue-50/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-5xl font-bold mb-6 text-slate-900">Research Results</h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
              Quantitative performance metrics demonstrating system effectiveness
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { 
                number: "60%", 
                label: "Cost Reduction", 
                sublabel: "vs. baseline methods",
                color: "from-blue-500 to-blue-600",
                bg: "bg-blue-50 border-blue-200"
              },
              { 
                number: "50+", 
                label: "Features Processed", 
                sublabel: "statistical analysis",
                color: "from-emerald-500 to-emerald-600",
                bg: "bg-emerald-50 border-emerald-200"
              },
              { 
                number: "2x Better", 
                label: "Vehicle Utilization", 
                sublabel: "efficiency & capacity",
                color: "from-purple-500 to-purple-600",
                bg: "bg-purple-50 border-purple-200",
                extended: true
              },
              { 
                number: "MTVPR", 
                label: "Complete Solution", 
                sublabel: "with time windows",
                color: "from-amber-500 to-amber-600",
                bg: "bg-amber-50 border-amber-200",
                extended: true
              }
            ].map((stat, index) => (
              <div key={index} className="group relative">
                <div className="absolute inset-0 bg-gradient-to-br from-white to-blue-50/30 rounded-3xl shadow-lg group-hover:shadow-2xl transition-all duration-300 transform group-hover:-translate-y-2"></div>
                <div className={`relative ${stat.bg} rounded-3xl ${stat.extended ? 'p-10' : 'p-8'} border text-center transition-all duration-300`}>
                  <div className={`inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br ${stat.color} rounded-2xl mb-6 shadow-lg group-hover:shadow-xl transition-all duration-300 transform group-hover:scale-110`}>
                    <div className="text-2xl font-bold text-white drop-shadow-sm">{stat.number}</div>
                  </div>
                  <div className="text-lg font-bold mb-2 text-slate-900 group-hover:text-blue-700 transition-colors">{stat.label}</div>
                  <div className="text-slate-600 text-sm">{stat.sublabel}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-5xl font-bold mb-6 text-slate-900">Access Advanced Route Optimization</h2>
          <p className="text-xl text-slate-600 mb-12 leading-relaxed">
            Experience cutting-edge RL-based traffic optimization with proven 60% cost reduction
          </p>
          <div className="flex gap-6 justify-center">
            <Link 
              href="/workspace"
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-12 py-5 rounded-xl font-semibold text-lg transition-all transform hover:-translate-y-1 shadow-lg hover:shadow-2xl"
            >
              Access Research System
            </Link>
            <a 
              href="#"
              className="bg-gradient-to-r from-slate-100 to-slate-200 hover:from-slate-200 hover:to-slate-300 text-slate-700 px-12 py-5 rounded-xl font-semibold text-lg transition-all border border-slate-300 hover:border-slate-400 shadow-lg hover:shadow-xl"
            >
              View Documentation
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-slate-200 bg-slate-50">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex justify-center gap-8 mb-6">
            <a href="#" className="text-slate-500 hover:text-blue-600 transition-colors font-medium">Research Paper</a>
            <a href="#" className="text-slate-500 hover:text-blue-600 transition-colors font-medium">Methodology</a>
            <a href="#" className="text-slate-500 hover:text-blue-600 transition-colors font-medium">Documentation</a>
            <a href="#" className="text-slate-500 hover:text-blue-600 transition-colors font-medium">Contact</a>
          </div>
          <p className="text-slate-500">
            © 2025 TrafficRL. Advanced reinforcement learning for traffic route optimization research.
          </p>
        </div>
      </footer>
    </div>
  )
}