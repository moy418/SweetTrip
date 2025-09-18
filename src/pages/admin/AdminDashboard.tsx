import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { 
  Package, 
  DollarSign, 
  Users, 
  TrendingUp, 
  ShoppingCart,
  AlertCircle,
  CheckCircle,
  Clock,
  XCircle,
  Video,
  Settings
} from 'lucide-react'
import { supabase } from '../../lib/supabase'

interface AdminDashboardProps {}

export default function AdminDashboard({}: AdminDashboardProps) {
  const [stats, setStats] = useState({
    totalOrders: 0,
    pendingOrders: 0,
    confirmedOrders: 0,
    failedOrders: 0,
    totalRevenue: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadStats()
  }, [])

  const loadStats = async () => {
    try {
      // Get all orders from Supabase
      const { data: orders, error } = await supabase
        .from('orders')
        .select('*')
      
      if (error) {
        console.error('Error loading stats:', error)
        return
      }

      // Calculate stats
      const totalOrders = orders?.length || 0
      const pendingOrders = orders?.filter(o => o.status === 'pending').length || 0
      const confirmedOrders = orders?.filter(o => o.status === 'confirmed').length || 0
      const failedOrders = orders?.filter(o => o.status === 'failed').length || 0
      const totalRevenue = orders?.filter(o => o.status === 'confirmed').reduce((sum, o) => sum + (o.total_amount || 0), 0) || 0

      setStats({
        totalOrders,
        pendingOrders,
        confirmedOrders,
        failedOrders,
        totalRevenue
      })
    } catch (error) {
      console.error('Error loading stats:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price)
  }

  const StatCard = ({ title, value, icon: Icon, color, description }: {
    title: string
    value: string | number
    icon: React.ElementType
    color: string
    description?: string
  }) => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-2">{value}</p>
          {description && (
            <p className="text-xs text-gray-500 mt-1">{description}</p>
          )}
        </div>
        <div className={`p-3 rounded-full ${color}`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
            <p className="text-gray-600">Welcome to the Sweet Trip Admin Panel</p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard
              title="Total Orders"
              value={loading ? "..." : stats.totalOrders}
              icon={Package}
              color="bg-blue-500"
              description="All time orders"
            />
            <StatCard
              title="Pending Orders"
              value={loading ? "..." : stats.pendingOrders}
              icon={Clock}
              color="bg-yellow-500"
              description="Awaiting confirmation"
            />
            <StatCard
              title="Confirmed Orders"
              value={loading ? "..." : stats.confirmedOrders}
              icon={CheckCircle}
              color="bg-green-500"
              description="Successfully processed"
            />
            <StatCard
              title="Total Revenue"
              value={loading ? "..." : formatPrice(stats.totalRevenue)}
              icon={DollarSign}
              color="bg-purple-500"
              description="From paid orders"
            />
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Order Management */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center space-x-3 mb-4">
                <ShoppingCart className="h-6 w-6 text-blue-600" />
                <h2 className="text-xl font-semibold text-gray-900">Order Management</h2>
              </div>
              <p className="text-gray-600 mb-6">
                Manage orders, verify payments, and track order status.
              </p>
              <div className="space-y-3">
                <Link
                  to="/admin/orders"
                  className="block w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors text-center"
                >
                  View All Orders
                </Link>
                <Link
                  to="/admin/orders?filter=pending"
                  className="block w-full bg-yellow-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-yellow-700 transition-colors text-center"
                >
                  Pending Orders ({stats.pendingOrders})
                </Link>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center space-x-3 mb-4">
                <TrendingUp className="h-6 w-6 text-green-600" />
                <h2 className="text-xl font-semibold text-gray-900">Quick Stats</h2>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600">Success Rate</span>
                  <span className="font-medium text-green-600">
                    {stats.totalOrders > 0 ? Math.round((stats.confirmedOrders / stats.totalOrders) * 100) : 0}%
                  </span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600">Failed Orders</span>
                  <span className="font-medium text-red-600">{stats.failedOrders}</span>
                </div>
                <div className="flex items-center justify-between py-2">
                  <span className="text-gray-600">Average Order Value</span>
                  <span className="font-medium">
                    {stats.confirmedOrders > 0 ? formatPrice(stats.totalRevenue / stats.confirmedOrders) : '$0.00'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Management Tools */}
          <div className="mt-8 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Management Tools</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Link
                to="/admin/videos"
                className="flex items-center space-x-3 p-4 bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg hover:shadow-md transition-all duration-300 group"
              >
                <div className="p-2 bg-purple-100 rounded-lg group-hover:bg-purple-200 transition-colors">
                  <Video className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">Video Management</h3>
                  <p className="text-sm text-gray-600">Manage category reel videos</p>
                </div>
              </Link>
              
              <div className="flex items-center space-x-3 p-4 bg-gradient-to-r from-green-50 to-teal-50 border border-green-200 rounded-lg">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Settings className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">Site Settings</h3>
                  <p className="text-sm text-gray-600">Configure site preferences</p>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="mt-8 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Activity</h2>
            <div className="text-center py-8 text-gray-500">
              <Package className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>Recent activity will be displayed here</p>
              <p className="text-sm">This feature can be expanded to show real-time order updates</p>
            </div>
          </div>

          {/* System Status */}
          <div className="mt-8 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">System Status</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <div>
                  <p className="font-medium text-green-800">Payment System</p>
                  <p className="text-sm text-green-600">Manual payments active</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                <Clock className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="font-medium text-blue-800">Stripe Integration</p>
                  <p className="text-sm text-blue-600">Coming soon</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <div>
                  <p className="font-medium text-green-800">Order Management</p>
                  <p className="text-sm text-green-600">Fully operational</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}