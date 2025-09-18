import React, { useState, useEffect } from 'react'
import { 
  CheckCircle, 
  Clock, 
  XCircle, 
  Eye, 
  Filter, 
  Search,
  Package,
  DollarSign,
  User,
  Mail,
  Phone,
  Calendar,
  AlertCircle,
  Check,
  X,
  LogOut,
  RefreshCw,
  Send
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { supabase } from '../../lib/supabase'
import { buildOrderWebhookPayload, sendOrderWebhookToZapier } from '../../lib/orderProcessor'

interface OrderData {
  id: number
  order_number: string
  customer_email: string | null
  customer_first_name?: string
  customer_last_name?: string
  customer_phone?: string
  shipping_address: any
  billing_address: any
  items?: Array<{
    product_id: number
    product_name: string
    quantity: number
    price_at_time: number
  }>
  total_amount: number
  currency: string
  status: string
  stripe_payment_intent_id: string | null
  created_at: string
  updated_at: string
  shipping_cost?: number
  payment_method?: string
  payment_reference?: string
  payment_notes?: string
  delivery_method?: string
}

type OrderStatus = 'pending' | 'confirmed' | 'cancelled' | 'failed'
type FilterStatus = 'all' | OrderStatus

export default function OrderManagementPage() {
  const navigate = useNavigate()
  const [orders, setOrders] = useState<OrderData[]>([])
  const [filteredOrders, setFilteredOrders] = useState<OrderData[]>([])
  const [selectedOrder, setSelectedOrder] = useState<OrderData | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<FilterStatus>('all')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    loadOrders()
  }, [])

  useEffect(() => {
    filterOrders()
  }, [orders, searchTerm, statusFilter])

  const loadOrders = async () => {
    setLoading(true)
    
    try {
      // Fetch orders from Supabase
      const { data: ordersData, error: ordersError } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100)
      
      if (ordersError) {
        console.error('Error fetching orders:', ordersError)
        toast.error('Error loading orders')
        return
      }

      // Fetch order items for each order
      const ordersWithItems: OrderData[] = []
      
      for (const order of ordersData || []) {
        const { data: itemsData, error: itemsError } = await supabase
          .from('order_items')
          .select('*')
          .eq('order_id', order.id)
        
        if (itemsError) {
          console.error('Error fetching order items:', itemsError)
        }
        
        ordersWithItems.push({
          ...order,
          items: itemsData || []
        })
      }
      
      setOrders(ordersWithItems)
      toast.success(`Loaded ${ordersWithItems.length} orders`)
    } catch (error) {
      console.error('Error loading orders:', error)
      toast.error('Failed to load orders')
    } finally {
      setLoading(false)
    }
  }

  const filterOrders = () => {
    let filtered = orders

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(order => order.status === statusFilter)
    }

    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      filtered = filtered.filter(order =>
        order.order_number.toLowerCase().includes(term) ||
        (order.customer_email && order.customer_email.toLowerCase().includes(term)) ||
        (order.customer_first_name && order.customer_first_name.toLowerCase().includes(term)) ||
        (order.customer_last_name && order.customer_last_name.toLowerCase().includes(term)) ||
        (order.stripe_payment_intent_id && order.stripe_payment_intent_id.toLowerCase().includes(term))
      )
    }

    setFilteredOrders(filtered)
  }

  const updateOrderStatus = async (orderNumber: string, newStatus: OrderStatus) => {
    setLoading(true)
    
    try {
      // Update in Supabase
      const { error } = await supabase
        .from('orders')
        .update({ 
          status: newStatus,
          updated_at: new Date().toISOString()
        })
        .eq('order_number', orderNumber)
      
      if (error) {
        console.error('Error updating order:', error)
        toast.error('Error al actualizar la orden')
        return
      }
      
      // Reload orders
      await loadOrders()
      
      toast.success(`Orden ${orderNumber} actualizada a ${getStatusLabel(newStatus)}`)
    } catch (error) {
      console.error('Error updating order:', error)
      toast.error('Error al actualizar la orden')
    } finally {
      setLoading(false)
    }
  }

  const getStatusLabel = (status: OrderStatus) => {
    const labels = {
      pending: 'Pendiente',
      confirmed: 'Confirmado',
      cancelled: 'Cancelado',
      failed: 'Fallido'
    }
    return labels[status]
  }

  const getStatusColor = (status: OrderStatus) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      confirmed: 'bg-green-100 text-green-800',
      cancelled: 'bg-gray-100 text-gray-800',
      failed: 'bg-red-100 text-red-800'
    }
    return colors[status]
  }

  const getStatusIcon = (status: OrderStatus) => {
    const icons = {
      pending: <Clock className="h-4 w-4" />,
      confirmed: <CheckCircle className="h-4 w-4" />,
      cancelled: <XCircle className="h-4 w-4" />,
      failed: <AlertCircle className="h-4 w-4" />
    }
    return icons[status]
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const handleLogout = () => {
    sessionStorage.removeItem('admin_authenticated')
    sessionStorage.removeItem('admin_login_time')
    toast.success('Logged out successfully')
    navigate('/admin/login')
  }

  const refreshOrders = () => {
    loadOrders()
    toast.success('Orders refreshed')
  }

  const resendOrderEmail = async (order: OrderData) => {
    if (!order.customer_email) {
      toast.error('No hay email del cliente para reenviar')
      return
    }

    try {
      setLoading(true)
      toast.loading('Reenviando email de confirmación...')

      const webhookPayload = buildOrderWebhookPayload({
        orderNumber: order.order_number,
        customerFirstName: order.customer_first_name,
        customerLastName: order.customer_last_name,
        customerEmail: order.customer_email || '',
        totalAmount: order.total_amount,
        deliveryMethod: (order.delivery_method as any) || 'shipping',
        shippingAddress: typeof order.shipping_address === 'string' ? JSON.parse(order.shipping_address || '{}') : order.shipping_address,
        items: (order.items || []).map((i: any) => ({
          product_name: i.product_name,
          quantity: i.quantity,
          price: i.price_at_time
        }))
      })

      let success = false
      try {
        await sendOrderWebhookToZapier(webhookPayload)
        success = true
      } catch (e) {
        success = false
      }
      
      if (success) {
        toast.dismiss()
        toast.success(`Email reenviado exitosamente a ${order.customer_email}`)
      } else {
        toast.dismiss()
        toast.error('Error al reenviar el email')
      }
    } catch (error) {
      console.error('Error resending email:', error)
      toast.dismiss()
      toast.error('Error al reenviar el email')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Gestión de Órdenes</h1>
                <p className="text-gray-600">Administra las órdenes y verifica los pagos</p>
              </div>
              <div className="flex items-center space-x-3">
                <button
                  onClick={refreshOrders}
                  className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <RefreshCw className="h-4 w-4" />
                  <span>Refresh</span>
                </button>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          </div>

          {/* Filters and Search */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search */}
              <div className="flex-1">
                <div className="relative">
                  <Search className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Buscar por número de orden, email, nombre o referencia..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Status Filter */}
              <div className="flex items-center space-x-2">
                <Filter className="h-5 w-5 text-gray-400" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as FilterStatus)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all">Todos los estados</option>
                  <option value="pending">Pendiente</option>
                  <option value="confirmed">Confirmado</option>
                  <option value="cancelled">Cancelado</option>
                  <option value="failed">Fallido</option>
                </select>
              </div>
            </div>
          </div>

          {/* Orders Table */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Orden
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Cliente
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Método de Pago
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Estado
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Fecha
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredOrders.map((order) => (
                    <tr key={order.order_number} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          #{order.order_number}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {order.customer_first_name || 'N/A'} {order.customer_last_name || ''}
                        </div>
                        <div className="text-sm text-gray-500">
                          {order.customer_email || 'N/A'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {formatPrice(order.total_amount)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 capitalize">
                          {order.payment_method || (order.stripe_payment_intent_id ? 'Stripe' : 'Manual')}
                        </div>
                        <div className="text-sm text-gray-500">
                          Ref: {order.payment_reference || (order.stripe_payment_intent_id ? order.stripe_payment_intent_id.substring(0, 20) + '...' : 'N/A')}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.status as OrderStatus)}`}>
                          {getStatusIcon(order.status as OrderStatus)}
                          <span className="ml-1">{getStatusLabel(order.status as OrderStatus)}</span>
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(order.created_at)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => setSelectedOrder(order)}
                            className="text-blue-600 hover:text-blue-900 p-1"
                            title="Ver detalles"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          
                          {order.customer_email && (
                            <button
                              onClick={() => resendOrderEmail(order)}
                              className="text-purple-600 hover:text-purple-900 p-1"
                              title="Reenviar email de confirmación"
                              disabled={loading}
                            >
                              <Send className="h-4 w-4" />
                            </button>
                          )}
                          
                          {order.status === 'pending' && (
                            <>
                              <button
                                onClick={() => updateOrderStatus(order.order_number, 'confirmed')}
                                className="text-green-600 hover:text-green-900 p-1"
                                title="Marcar como confirmado"
                                disabled={loading}
                              >
                                <Check className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => updateOrderStatus(order.order_number, 'failed')}
                                className="text-red-600 hover:text-red-900 p-1"
                                title="Marcar como fallido"
                                disabled={loading}
                              >
                                <X className="h-4 w-4" />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredOrders.length === 0 && (
              <div className="text-center py-12">
                <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No hay órdenes</h3>
                <p className="text-gray-500">
                  {searchTerm || statusFilter !== 'all' 
                    ? 'No se encontraron órdenes con los filtros aplicados.'
                    : 'Aún no hay órdenes en el sistema.'
                  }
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  Orden #{selectedOrder.order_number}
                </h2>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {/* Order Details */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Detalles de la Orden</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total:</span>
                      <span className="font-medium">{formatPrice(selectedOrder.total_amount)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Estado:</span>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(selectedOrder.status as OrderStatus)}`}>
                        {getStatusIcon(selectedOrder.status as OrderStatus)}
                        <span className="ml-1">{getStatusLabel(selectedOrder.status as OrderStatus)}</span>
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Fecha:</span>
                      <span className="font-medium">{formatDate(selectedOrder.created_at)}</span>
                    </div>
                  </div>

                  <h3 className="text-lg font-semibold mb-4 mt-6">Productos</h3>
                  <div className="space-y-2">
                    {selectedOrder.items && selectedOrder.items.length > 0 ? (
                      selectedOrder.items.map((item, index) => (
                        <div key={index} className="flex justify-between text-sm border-b pb-2">
                          <span>{item.product_name} x{item.quantity}</span>
                          <span>{formatPrice(item.price_at_time * item.quantity)}</span>
                        </div>
                      ))
                    ) : (
                      <div className="text-sm text-gray-500">No hay productos disponibles</div>
                    )}
                  </div>
                </div>

                {/* Customer & Payment Info */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Información del Cliente</h3>
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center space-x-2">
                      <User className="h-4 w-4 text-gray-400" />
                      <span>{selectedOrder.customer_first_name || 'N/A'} {selectedOrder.customer_last_name || ''}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Mail className="h-4 w-4 text-gray-400" />
                      <span>{selectedOrder.customer_email || 'N/A'}</span>
                    </div>
                    {selectedOrder.customer_phone && (
                      <div className="flex items-center space-x-2">
                        <Phone className="h-4 w-4 text-gray-400" />
                        <span>{selectedOrder.customer_phone}</span>
                      </div>
                    )}
                  </div>

                  <h3 className="text-lg font-semibold mb-4">Información de Pago</h3>
                  <div className="space-y-3">
                    <div>
                      <span className="text-gray-600">Método:</span>
                      <span className="ml-2 font-medium capitalize">
                        {selectedOrder.payment_method || (selectedOrder.stripe_payment_intent_id ? 'Stripe' : 'N/A')}
                      </span>
                    </div>
                    {selectedOrder.payment_reference && (
                      <div>
                        <span className="text-gray-600">Referencia de Pago:</span>
                        <div className="mt-1 p-2 bg-gray-100 rounded font-mono text-sm">
                          {selectedOrder.payment_reference}
                        </div>
                      </div>
                    )}
                    {selectedOrder.stripe_payment_intent_id && (
                      <div>
                        <span className="text-gray-600">Payment Intent ID:</span>
                        <div className="mt-1 p-2 bg-gray-100 rounded font-mono text-sm">
                          {selectedOrder.stripe_payment_intent_id}
                        </div>
                      </div>
                    )}
                    {selectedOrder.payment_notes && (
                      <div>
                        <span className="text-gray-600">Notas de Pago:</span>
                        <div className="mt-1 p-2 bg-gray-100 rounded text-sm">
                          {selectedOrder.payment_notes}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Delivery Information */}
                  <h3 className="text-lg font-semibold mb-4 mt-6">Información de Entrega</h3>
                  <div className="space-y-3">
                    <div>
                      <span className="text-gray-600">Método de Entrega:</span>
                      <span className="ml-2 font-medium capitalize">
                        {selectedOrder.delivery_method === 'pickup' ? '🏪 Recoger en Tienda' : 
                         selectedOrder.delivery_method === 'shipping' ? '📦 Envío a Domicilio' : 
                         'Envío a Domicilio'}
                      </span>
                    </div>
                    {selectedOrder.delivery_method === 'pickup' && (
                      <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                        <div className="flex items-center space-x-2">
                          <span className="text-green-800 font-medium">Dirección de la Tienda:</span>
                        </div>
                        <div className="text-green-700 mt-1">
                          402 S El Paso St<br />
                          El Paso, TX
                        </div>
                      </div>
                    )}
                    {(selectedOrder.delivery_method === 'shipping' || !selectedOrder.delivery_method) && selectedOrder.shipping_address && (
                      <div>
                        <span className="text-gray-600">Dirección de Envío:</span>
                        <div className="mt-1 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                          <div className="text-blue-800">
                            {typeof selectedOrder.shipping_address === 'string' ? 
                              selectedOrder.shipping_address : 
                              selectedOrder.shipping_address ? 
                                `${selectedOrder.shipping_address.line1 || ''}${selectedOrder.shipping_address.line2 ? ', ' + selectedOrder.shipping_address.line2 : ''}${selectedOrder.shipping_address.city ? ', ' + selectedOrder.shipping_address.city : ''}${selectedOrder.shipping_address.state ? ', ' + selectedOrder.shipping_address.state : ''}${selectedOrder.shipping_address.postal_code ? ' ' + selectedOrder.shipping_address.postal_code : ''}` :
                                'No hay dirección disponible'
                            }
                          </div>
                        </div>
                      </div>
                    )}
                    <div>
                      <span className="text-gray-600">Costo de Envío:</span>
                      <span className="ml-2 font-medium">
                        {selectedOrder.shipping_cost === 0 ? 'GRATIS' : formatPrice(selectedOrder.shipping_cost || 0)}
                      </span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="mt-6 space-y-3">
                    {/* Resend Email Button - Always available if customer has email */}
                    {selectedOrder.customer_email && (
                      <button
                        onClick={() => resendOrderEmail(selectedOrder)}
                        className="w-full bg-purple-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-purple-700 transition-colors flex items-center justify-center space-x-2"
                        disabled={loading}
                      >
                        <Send className="h-4 w-4" />
                        <span>Reenviar Email de Confirmación</span>
                      </button>
                    )}
                    
                    {/* Status Change Buttons - Only for pending orders */}
                    {selectedOrder.status === 'pending' && (
                      <>
                        <button
                          onClick={() => {
                            updateOrderStatus(selectedOrder.order_number, 'confirmed')
                            setSelectedOrder(null)
                          }}
                          className="w-full bg-green-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center justify-center space-x-2"
                        >
                          <Check className="h-4 w-4" />
                          <span>Marcar como Confirmado</span>
                        </button>
                        <button
                          onClick={() => {
                            updateOrderStatus(selectedOrder.order_number, 'failed')
                            setSelectedOrder(null)
                          }}
                          className="w-full bg-red-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-red-700 transition-colors flex items-center justify-center space-x-2"
                        >
                          <X className="h-4 w-4" />
                          <span>Marcar como Fallido</span>
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
