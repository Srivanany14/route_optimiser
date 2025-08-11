// components/analytics/CustomerAnalytics.tsx
'use client'

import React, { useState, useEffect } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts'
import { Users, Star, ThumbsUp, TrendingUp, MessageCircle, Award, ArrowUp } from 'lucide-react'

interface CustomerAnalyticsProps {
  // Add any props needed from the parent component
}

export default function CustomerAnalytics({ }: CustomerAnalyticsProps) {
  const [currentRating, setCurrentRating] = useState(4.7)
  
  // Simulate live rating updates for demo
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentRating(4.6 + Math.random() * 0.3)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  // Simple satisfaction trend over months
  const satisfactionTrend = [
    { month: 'Jan', beforeAI: 3.1, withAI: 3.1 },
    { month: 'Feb', beforeAI: 3.2, withAI: 3.8 },
    { month: 'Mar', beforeAI: 3.0, withAI: 4.2 },
    { month: 'Apr', beforeAI: 3.1, withAI: 4.5 },
    { month: 'May', beforeAI: 3.2, withAI: 4.6 },
    { month: 'Jun', beforeAI: 3.1, withAI: 4.7 }
  ]

  // Simple customer feedback
  const customerReviews = [
    {
      name: "Sarah M.",
      rating: 5,
      comment: "Delivery was 15 minutes faster than expected! Amazing service.",
      improvement: "Time"
    },
    {
      name: "Mike R.",
      rating: 5,
      comment: "Always on time now. Much better than before.",
      improvement: "Reliability" 
    },
    {
      name: "Lisa K.",
      rating: 4,
      comment: "Great tracking and delivery was smooth.",
      improvement: "Experience"
    }
  ]

  // Key metrics
  const keyMetrics = [
    { 
      title: "Average Rating", 
      value: currentRating.toFixed(1), 
      unit: "/5", 
      change: "+47%", 
      icon: Star,
      color: "text-yellow-600 bg-yellow-50 border-yellow-200"
    },
    { 
      title: "Customer Satisfaction", 
      value: "94", 
      unit: "%", 
      change: "+35%", 
      icon: ThumbsUp,
      color: "text-green-600 bg-green-50 border-green-200"
    },
    { 
      title: "Repeat Customers", 
      value: "78", 
      unit: "%", 
      change: "+28%", 
      icon: Users,
      color: "text-blue-600 bg-blue-50 border-blue-200"
    },
    { 
      title: "Complaints Reduced", 
      value: "67", 
      unit: "%", 
      change: "-67%", 
      icon: TrendingUp,
      color: "text-purple-600 bg-purple-50 border-purple-200"
    }
  ]

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star 
        key={i} 
        className={`w-4 h-4 ${i < rating ? 'text-yellow-500 fill-current' : 'text-gray-300'}`} 
      />
    ))
  }

  return (
    <div className="space-y-6">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold mb-2">Customer Satisfaction</h2>
            <p className="text-green-100">How AI routing improves customer experience</p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold">{currentRating.toFixed(1)}★</div>
            <div className="text-green-200 text-sm">Current Rating</div>
          </div>
        </div>

        {/* Before vs After */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white/10 rounded-lg p-4 backdrop-blur text-center">
            <div className="text-2xl font-bold mb-2">3.2★</div>
            <div className="text-sm text-green-200">Before AI</div>
          </div>
          <div className="bg-white/10 rounded-lg p-4 backdrop-blur text-center">
            <div className="text-2xl font-bold mb-2">4.7★</div>
            <div className="text-sm text-green-200">With AI</div>
            <div className="flex items-center justify-center mt-1">
              <ArrowUp className="w-4 h-4 mr-1" />
              <span className="text-xs font-medium">+47% Better</span>
            </div>
          </div>
        </div>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {keyMetrics.map((metric, index) => (
          <div key={index} className={`p-4 rounded-lg border ${metric.color}`}>
            <div className="flex items-center space-x-2 mb-2">
              <metric.icon className="w-5 h-5" />
              <span className="text-sm font-medium">{metric.title}</span>
            </div>
            <div className="text-2xl font-bold">
              {metric.value}
              <span className="text-sm font-normal ml-1">{metric.unit}</span>
            </div>
            <div className="text-xs font-medium mt-1">{metric.change}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Simple Satisfaction Trend */}
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <h3 className="text-lg font-semibold mb-4 text-slate-900 flex items-center space-x-2">
            <TrendingUp className="w-5 h-5 text-green-600" />
            <span>Satisfaction Improvement</span>
          </h3>
          
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={satisfactionTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis 
                dataKey="month" 
                stroke="#64748b"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis 
                domain={[2.5, 5]}
                stroke="#64748b"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip 
                formatter={(value, name) => [
                  `${value}★`,
                  name === 'beforeAI' ? 'Before AI' : 'With AI'
                ]}
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
                }}
              />
              
              <Line 
                type="monotone" 
                dataKey="beforeAI" 
                stroke="#ef4444" 
                strokeWidth={3} 
                name="beforeAI"
                dot={{ fill: '#ef4444', strokeWidth: 2, r: 4 }}
              />
              <Line 
                type="monotone" 
                dataKey="withAI" 
                stroke="#10b981" 
                strokeWidth={3} 
                name="withAI"
                dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
          
          <div className="mt-4 text-center">
            <div className="text-lg font-bold text-green-600">47% Better</div>
            <div className="text-sm text-slate-600">Rating improvement since AI</div>
          </div>
        </div>

        {/* Customer Reviews */}
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <h3 className="text-lg font-semibold mb-4 text-slate-900 flex items-center space-x-2">
            <MessageCircle className="w-5 h-5 text-blue-600" />
            <span>Recent Customer Feedback</span>
          </h3>
          
          <div className="space-y-4">
            {customerReviews.map((review, index) => (
              <div key={index} className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-slate-900">{review.name}</span>
                  <div className="flex space-x-1">
                    {renderStars(review.rating)}
                  </div>
                </div>
                <p className="text-sm text-slate-700 mb-2">"{review.comment}"</p>
                <div className="text-xs text-blue-600 font-medium">
                  Improved: {review.improvement}
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-center space-x-2">
              <Award className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-semibold text-blue-800">Customer Impact</span>
            </div>
            <p className="text-xs text-blue-700 mt-1">
              AI routing consistently delivers faster, more reliable service
            </p>
          </div>
        </div>
      </div>

      {/* Simple Summary */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <h3 className="text-lg font-semibold mb-4 text-slate-900">Customer Success Summary</h3>
        
        <div className="grid grid-cols-3 gap-6 text-center">
          <div>
            <div className="text-3xl font-bold text-green-600 mb-2">+47%</div>
            <div className="text-sm text-slate-600">Higher Ratings</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-blue-600 mb-2">+28%</div>
            <div className="text-sm text-slate-600">More Repeat Orders</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-purple-600 mb-2">-67%</div>
            <div className="text-sm text-slate-600">Fewer Complaints</div>
          </div>
        </div>
        
        <div className="mt-6 p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border border-green-200">
          <div className="text-center">
            <div className="text-lg font-bold text-slate-900 mb-2">Bottom Line</div>
            <div className="text-slate-700">
              AI-powered routing creates happier customers, leading to more business and higher profits
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}