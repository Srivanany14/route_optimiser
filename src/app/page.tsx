'use client'

import Link from 'next/link'
import { useEffect, useRef } from 'react'

export default function LandingPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    // 2D Routing Simulator - Clean & Structured
    const nodes = []
    const routes = []
    const vehicles = []

    // Create 5 strategic mother depots positioned around edges
    const depots = [
      { x: 120, y: 120, id: 0 },           // Top-left
      { x: canvas.width - 120, y: 120 },   // Top-right
      { x: 120, y: canvas.height - 120 },  // Bottom-left
      { x: canvas.width - 120, y: canvas.height - 120 }, // Bottom-right
      { x: canvas.width / 2, y: 80 }       // Top-center
    ]

    // Create depots
    depots.forEach((depot, index) => {
      nodes.push({
        x: depot.x,
        y: depot.y,
        id: index,
        type: 'depot',
        pulse: index * (Math.PI / 3),
        active: true,
        depotIndex: index
      })
    })

    // Create customer networks for each depot
    depots.forEach((depot, depotIndex) => {
      const customerLocations = []
      
      if (depotIndex === 0) { // Top-left depot customers
        customerLocations.push(
          { x: 60, y: 200 },
          { x: 180, y: 180 },
          { x: 80, y: 300 }
        )
      } else if (depotIndex === 1) { // Top-right depot customers
        customerLocations.push(
          { x: canvas.width - 60, y: 200 },
          { x: canvas.width - 180, y: 180 },
          { x: canvas.width - 80, y: 300 }
        )
      } else if (depotIndex === 2) { // Bottom-left depot customers
        customerLocations.push(
          { x: 60, y: canvas.height - 200 },
          { x: 180, y: canvas.height - 180 },
          { x: 80, y: canvas.height - 300 }
        )
      } else if (depotIndex === 3) { // Bottom-right depot customers
        customerLocations.push(
          { x: canvas.width - 60, y: canvas.height - 200 },
          { x: canvas.width - 180, y: canvas.height - 180 },
          { x: canvas.width - 80, y: canvas.height - 300 }
        )
      } else if (depotIndex === 4) { // Top-center depot customers
        customerLocations.push(
          { x: canvas.width / 2 - 100, y: 150 },
          { x: canvas.width / 2 + 100, y: 150 },
          { x: canvas.width / 2, y: 200 }
        )
      }

      customerLocations.forEach((location, customerIndex) => {
        nodes.push({
          x: location.x,
          y: location.y,
          id: nodes.length,
          type: 'customer',
          pulse: Math.random() * Math.PI * 2,
          active: true,
          depotIndex: depotIndex // Link customer to specific depot
        })
      })
    })

    // Create routes from each depot to its customers
    nodes.forEach(node => {
      if (node.type === 'customer' && node.active) {
        const depot = nodes.find(n => n.type === 'depot' && n.depotIndex === node.depotIndex)
        if (depot) {
          routes.push({
            from: depot,
            to: node,
            active: true,
            opacity: 0.3 + Math.random() * 0.2
          })
        }
      }
    })

    // Create vehicle fleet for each depot (2 vehicles per depot)
    const vehicleColors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6']
    
    depots.forEach((depot, depotIndex) => {
      const depotCustomers = nodes.filter(n => n.type === 'customer' && n.depotIndex === depotIndex)
      
      // Create 2 vehicles per depot
      for (let i = 0; i < 2; i++) {
        if (depotCustomers.length > 0) {
          vehicles.push({
            x: depot.x,
            y: depot.y,
            targetNode: depotCustomers[Math.floor(Math.random() * depotCustomers.length)].id,
            speed: 0.01 + Math.random() * 0.008,
            color: vehicleColors[depotIndex],
            trail: [],
            depotIndex: depotIndex,
            homeDepot: { x: depot.x, y: depot.y }
          })
        }
      }
    })

    let time = 0

    const animate = () => {
      time += 0.02
      
      // Clear canvas with clean background
      ctx.fillStyle = 'rgba(255, 255, 255, 0.1)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      
      // Draw clean route lines
      routes.forEach((route, index) => {
        if (route.active) {
          const opacity = route.opacity + Math.sin(time + index * 0.5) * 0.1
          
          // Create gradient line
          const gradient = ctx.createLinearGradient(
            route.from.x, route.from.y,
            route.to.x, route.to.y
          )
          gradient.addColorStop(0, `rgba(59, 130, 246, ${opacity})`)
          gradient.addColorStop(1, `rgba(16, 185, 129, ${opacity * 0.6})`)
          
          ctx.strokeStyle = gradient
          ctx.lineWidth = 2
          ctx.setLineDash([8, 8])
          ctx.lineCap = 'round'
          ctx.beginPath()
          ctx.moveTo(route.from.x, route.from.y)
          ctx.lineTo(route.to.x, route.to.y)
          ctx.stroke()
          ctx.setLineDash([])
        }
      })
      
      // Draw clean nodes
      nodes.forEach(node => {
        const pulseScale = 1 + Math.sin(time * 1.5 + node.pulse) * 0.15
        
        if (node.type === 'depot') {
          // Depot - larger and more prominent
          const depotGradient = ctx.createRadialGradient(node.x, node.y, 0, node.x, node.y, 20 * pulseScale)
          depotGradient.addColorStop(0, 'rgba(59, 130, 246, 0.8)')
          depotGradient.addColorStop(0.7, 'rgba(59, 130, 246, 0.3)')
          depotGradient.addColorStop(1, 'rgba(59, 130, 246, 0)')
          
          ctx.fillStyle = depotGradient
          ctx.beginPath()
          ctx.arc(node.x, node.y, 20 * pulseScale, 0, Math.PI * 2)
          ctx.fill()
          
          // Depot core
          ctx.fillStyle = '#3b82f6'
          ctx.beginPath()
          ctx.arc(node.x, node.y, 8, 0, Math.PI * 2)
          ctx.fill()
          
          // Depot border
          ctx.strokeStyle = '#ffffff'
          ctx.lineWidth = 3
          ctx.beginPath()
          ctx.arc(node.x, node.y, 8, 0, Math.PI * 2)
          ctx.stroke()
          
        } else if (node.active) {
          // Customer nodes - clean and organized
          const customerGradient = ctx.createRadialGradient(node.x, node.y, 0, node.x, node.y, 12 * pulseScale)
          customerGradient.addColorStop(0, 'rgba(16, 185, 129, 0.7)')
          customerGradient.addColorStop(0.8, 'rgba(16, 185, 129, 0.2)')
          customerGradient.addColorStop(1, 'rgba(16, 185, 129, 0)')
          
          ctx.fillStyle = customerGradient
          ctx.beginPath()
          ctx.arc(node.x, node.y, 12 * pulseScale, 0, Math.PI * 2)
          ctx.fill()
          
          // Customer core
          ctx.fillStyle = '#10b981'
          ctx.beginPath()
          ctx.arc(node.x, node.y, 5, 0, Math.PI * 2)
          ctx.fill()
          
          // Customer border
          ctx.strokeStyle = '#ffffff'
          ctx.lineWidth = 2
          ctx.beginPath()
          ctx.arc(node.x, node.y, 5, 0, Math.PI * 2)
          ctx.stroke()
        }
      })
      
      // Draw professional vehicles
      vehicles.forEach(vehicle => {
        const targetNode = nodes[vehicle.targetNode]
        if (!targetNode) return
        
        // Add current position to trail
        vehicle.trail.push({ x: vehicle.x, y: vehicle.y, time: time })
        // Keep trail length manageable
        if (vehicle.trail.length > 6) {
          vehicle.trail.shift()
        }
        
        // Move vehicle towards target
        const dx = targetNode.x - vehicle.x
        const dy = targetNode.y - vehicle.y
        const distance = Math.sqrt(dx * dx + dy * dy)
        
        if (distance < 25) {
          // Reached target, pick new customer from same depot network
          const depotCustomers = nodes.filter(n => 
            n.type === 'customer' && 
            n.active && 
            n.depotIndex === vehicle.depotIndex
          )
          
          if (depotCustomers.length > 0) {
            const randomCustomer = depotCustomers[Math.floor(Math.random() * depotCustomers.length)]
            vehicle.targetNode = randomCustomer.id
          }
        } else {
          // Smooth movement towards target
          const moveX = (dx / distance) * vehicle.speed * 50
          const moveY = (dy / distance) * vehicle.speed * 50
          vehicle.x += moveX
          vehicle.y += moveY
        }
        
        // Draw vehicle trail
        vehicle.trail.forEach((point, index) => {
          const trailOpacity = (index / vehicle.trail.length) * 0.3
          const trailSize = 1 + (index / vehicle.trail.length) * 1.5
          
          ctx.fillStyle = vehicle.color.replace(')', `, ${trailOpacity})`)
          ctx.beginPath()
          ctx.arc(point.x, point.y, trailSize, 0, Math.PI * 2)
          ctx.fill()
        })
        
        // Draw vehicle with professional styling
        const vehicleGradient = ctx.createRadialGradient(vehicle.x, vehicle.y, 0, vehicle.x, vehicle.y, 6)
        vehicleGradient.addColorStop(0, vehicle.color)
        vehicleGradient.addColorStop(1, vehicle.color.replace(')', ', 0.3)'))
        
        ctx.fillStyle = vehicleGradient
        ctx.beginPath()
        ctx.arc(vehicle.x, vehicle.y, 6, 0, Math.PI * 2)
        ctx.fill()
        
        // Vehicle core
        ctx.fillStyle = vehicle.color
        ctx.beginPath()
        ctx.arc(vehicle.x, vehicle.y, 3, 0, Math.PI * 2)
        ctx.fill()
        
        // Vehicle border
        ctx.strokeStyle = '#ffffff'
        ctx.lineWidth = 1.5
        ctx.beginPath()
        ctx.arc(vehicle.x, vehicle.y, 3, 0, Math.PI * 2)
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
            <div className="text-2xl font-bold text-blue-600">RouteAI</div>
            <div className="flex items-center space-x-8">
              <a href="#features" className="text-slate-600 hover:text-blue-600 transition-colors font-medium">Features</a>
              <a href="#how-it-works" className="text-slate-600 hover:text-blue-600 transition-colors font-medium">How It Works</a>
              <a href="#results" className="text-slate-600 hover:text-blue-600 transition-colors font-medium">Results</a>
              <Link 
                href="/workspace" 
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors shadow-sm"
              >
                Get Started
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
              Intelligent Route <span className="text-blue-600">Optimization</span>
            </h1>
            <p className="text-xl text-slate-600 mb-10 max-w-4xl mx-auto leading-relaxed">
              Transform your delivery operations with advanced reinforcement learning algorithms that continuously optimize routes, reduce costs, and enhance customer satisfaction through real-time analytics.
            </p>
            <div className="flex gap-6 justify-center">
              <Link 
                href="/workspace"
                className="bg-blue-600 hover:bg-blue-700 text-white px-10 py-4 rounded-xl font-semibold text-lg transition-all transform hover:-translate-y-1 shadow-lg hover:shadow-xl"
              >
                Start Free Trial
              </Link>
              <a 
                href="#how-it-works"
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-10 py-4 rounded-xl font-semibold text-lg transition-all border border-slate-300 hover:border-slate-400"
              >
                Learn More
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-24 px-6 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6 text-slate-900">How RouteAI Works</h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Our reinforcement learning engine continuously learns and adapts to optimize your delivery network in real-time
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: "🛡️",
                title: "Data Ingestion & Analysis",
                description: "Our AI ingests real-time data from multiple sources including traffic patterns, weather conditions, and delivery priorities."
              },
              {
                icon: "⚡",
                title: "RL Algorithm Processing", 
                description: "Advanced Deep Q-Networks (DQN) and PPO algorithms process data to identify optimal route combinations."
              },
              {
                icon: "📧",
                title: "Real-time Route Optimization",
                description: "Generate optimized routes instantly with dynamic adjustments for traffic, weather, and new delivery requests."
              },
              {
                icon: "📊",
                title: "Continuous Learning",
                description: "The system learns from every delivery, continuously improving decision-making capabilities."
              }
            ].map((step, index) => (
              <div key={index} className="bg-white rounded-2xl p-8 border border-slate-200 hover:border-blue-300 transition-all hover:shadow-lg">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center text-2xl mb-6 shadow-lg">
                  {step.icon}
                </div>
                <h3 className="text-xl font-bold mb-4 text-slate-900">{step.title}</h3>
                <p className="text-slate-600 leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-16">
            <p className="text-2xl text-slate-600 font-medium">
              Automate routes. Optimize performance. Scale operations.
            </p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6 text-slate-900">Advanced Capabilities</h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Enterprise-grade features designed for large-scale logistics operations
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: "⚡",
                title: "Dynamic Route Optimization",
                description: "Real-time route adjustments based on traffic conditions, weather patterns, and delivery priorities using advanced RL algorithms."
              },
              {
                icon: "🎯",
                title: "Predictive Analytics", 
                description: "Machine learning models predict delivery times, identify bottlenecks, and optimize resource allocation with 97% accuracy."
              },
              {
                icon: "📊",
                title: "Real-time Monitoring",
                description: "Comprehensive dashboards provide real-time insights into fleet performance and operational efficiency metrics."
              },
              {
                icon: "🗺️",
                title: "Multi-depot Management",
                description: "Optimize routes across multiple distribution centers and warehouses simultaneously for efficient operations."
              },
              {
                icon: "🔧",
                title: "API Integration",
                description: "RESTful APIs enable seamless integration with existing ERP, WMS, and TMS systems without disruption."
              },
              {
                icon: "🛡️",
                title: "Enterprise Security",
                description: "SOC 2 compliant infrastructure with end-to-end encryption and comprehensive audit logging."
              }
            ].map((feature, index) => (
              <div key={index} className="bg-slate-50 rounded-2xl p-8 border border-slate-200 hover:border-blue-300 transition-all hover:shadow-lg">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center text-xl mb-6 shadow-lg">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-4 text-slate-900">{feature.title}</h3>
                <p className="text-slate-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Results Section */}
      <section id="results" className="py-24 px-6 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6 text-slate-900">Proven Results</h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Measurable impact across enterprise implementations worldwide
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { number: "43%", label: "Cost Reduction", sublabel: "Average operational savings" },
              { number: "38%", label: "Faster Deliveries", sublabel: "Improved delivery times" },
              { number: "99.7%", label: "Route Accuracy", sublabel: "ML-powered precision" },
              { number: "25M+", label: "Routes Optimized", sublabel: "Across global deployments" }
            ].map((stat, index) => (
              <div key={index} className="bg-white rounded-2xl p-8 border border-slate-200 text-center shadow-lg hover:shadow-xl transition-shadow">
                <div className="text-5xl font-bold text-blue-600 mb-4">{stat.number}</div>
                <div className="text-xl font-semibold mb-2 text-slate-900">{stat.label}</div>
                <div className="text-slate-600">{stat.sublabel}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6 text-slate-900">Ready to Transform Your Logistics?</h2>
          <p className="text-xl text-slate-600 mb-10">
            Join leading enterprises already using RouteAI to optimize their delivery operations
          </p>
          <div className="flex gap-6 justify-center">
            <Link 
              href="/workspace"
              className="bg-blue-600 hover:bg-blue-700 text-white px-10 py-4 rounded-xl font-semibold text-lg transition-all transform hover:-translate-y-1 shadow-lg hover:shadow-xl"
            >
              Start Free Trial
            </Link>
            <a 
              href="#"
              className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-10 py-4 rounded-xl font-semibold text-lg transition-all border border-slate-300 hover:border-slate-400"
            >
              Schedule Demo
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-slate-200 bg-slate-50">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex justify-center gap-8 mb-6">
            <a href="#" className="text-slate-500 hover:text-blue-600 transition-colors">Privacy Policy</a>
            <a href="#" className="text-slate-500 hover:text-blue-600 transition-colors">Terms of Service</a>
            <a href="#" className="text-slate-500 hover:text-blue-600 transition-colors">Documentation</a>
            <a href="#" className="text-slate-500 hover:text-blue-600 transition-colors">Support</a>
          </div>
          <p className="text-slate-500">
            © 2025 RouteAI. All rights reserved. Enterprise route optimization powered by reinforcement learning.
          </p>
        </div>
      </footer>
    </div>
  )
}