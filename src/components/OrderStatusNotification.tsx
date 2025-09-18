import React, { useState, useEffect } from 'react'
import { CheckCircle, Clock, XCircle, AlertCircle, Mail, Bell, X } from 'lucide-react'
import toast from 'react-hot-toast'

interface NotificationData {
  id: string
  orderNumber: string
  status: 'pending_verification' | 'paid' | 'failed' | 'refunded'
  message: string
  timestamp: string
  read: boolean
}

interface OrderStatusNotificationProps {
  orderNumber?: string
  onClose?: () => void
}

export default function OrderStatusNotification({ orderNumber, onClose }: OrderStatusNotificationProps) {
  const [notifications, setNotifications] = useState<NotificationData[]>([])
  const [showNotifications, setShowNotifications] = useState(false)

  useEffect(() => {
    loadNotifications()
    
    // Check for order updates every 30 seconds
    const interval = setInterval(checkOrderUpdates, 30000)
    
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (orderNumber) {
      checkSpecificOrder(orderNumber)
    }
  }, [orderNumber])

  const loadNotifications = () => {
    const stored = localStorage.getItem('order_notifications')
    if (stored) {
      try {
        setNotifications(JSON.parse(stored))
      } catch (error) {
        console.error('Error loading notifications:', error)
      }
    }
  }

  const saveNotifications = (newNotifications: NotificationData[]) => {
    localStorage.setItem('order_notifications', JSON.stringify(newNotifications))
    setNotifications(newNotifications)
  }

  const checkOrderUpdates = () => {
    // Check all orders for status changes
    const allOrders: string[] = []
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key && key.startsWith('order_ST-')) {
        allOrders.push(key.replace('order_', ''))
      }
    }

    allOrders.forEach(orderNum => {
      checkSpecificOrder(orderNum)
    })
  }

  const checkSpecificOrder = (orderNum: string) => {
    try {
      const orderData = JSON.parse(localStorage.getItem(`order_${orderNum}`) || '{}')
      if (!orderData.payment_status) return

      const existingNotification = notifications.find(n => n.orderNumber === orderNum)
      
      // Check if status changed
      if (!existingNotification || existingNotification.status !== orderData.payment_status) {
        createNotification(orderNum, orderData.payment_status)
      }
    } catch (error) {
      console.error('Error checking order:', error)
    }
  }

  const createNotification = (orderNum: string, status: string) => {
    const notificationId = `notification_${orderNum}_${Date.now()}`
    
    const statusMessages = {
      pending_verification: 'Tu orden está siendo verificada. Revisaremos tu pago pronto.',
      paid: '¡Excelente! Tu pago ha sido verificado y tu orden está siendo procesada.',
      failed: 'Hubo un problema con tu pago. Por favor, contacta soporte.',
      refunded: 'Tu reembolso ha sido procesado.'
    }

    const newNotification: NotificationData = {
      id: notificationId,
      orderNumber: orderNum,
      status: status as any,
      message: statusMessages[status as keyof typeof statusMessages] || 'Estado de orden actualizado.',
      timestamp: new Date().toISOString(),
      read: false
    }

    // Remove old notifications for this order
    const updatedNotifications = notifications.filter(n => n.orderNumber !== orderNum)
    updatedNotifications.unshift(newNotification)
    
    // Keep only last 10 notifications
    const finalNotifications = updatedNotifications.slice(0, 10)
    
    saveNotifications(finalNotifications)
    
    // Show toast notification
    if (status === 'paid') {
      toast.success(`¡Orden ${orderNum} confirmada!`)
    } else if (status === 'failed') {
      toast.error(`Problema con la orden ${orderNum}`)
    }
  }

  const markAsRead = (notificationId: string) => {
    const updatedNotifications = notifications.map(n =>
      n.id === notificationId ? { ...n, read: true } : n
    )
    saveNotifications(updatedNotifications)
  }

  const markAllAsRead = () => {
    const updatedNotifications = notifications.map(n => ({ ...n, read: true }))
    saveNotifications(updatedNotifications)
  }

  const getStatusIcon = (status: string) => {
    const icons = {
      pending_verification: <Clock className="h-4 w-4" />,
      paid: <CheckCircle className="h-4 w-4" />,
      failed: <XCircle className="h-4 w-4" />,
      refunded: <AlertCircle className="h-4 w-4" />
    }
    return icons[status as keyof typeof icons] || <Bell className="h-4 w-4" />
  }

  const getStatusColor = (status: string) => {
    const colors = {
      pending_verification: 'text-yellow-600',
      paid: 'text-green-600',
      failed: 'text-red-600',
      refunded: 'text-blue-600'
    }
    return colors[status as keyof typeof colors] || 'text-gray-600'
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))
    
    if (diffInMinutes < 1) return 'Ahora'
    if (diffInMinutes < 60) return `Hace ${diffInMinutes}m`
    if (diffInMinutes < 1440) return `Hace ${Math.floor(diffInMinutes / 60)}h`
    return date.toLocaleDateString('es-ES', { month: 'short', day: 'numeric' })
  }

  const unreadCount = notifications.filter(n => !n.read).length

  if (onClose) {
    // Single notification mode (for specific order)
    const orderNotification = notifications.find(n => n.orderNumber === orderNumber)
    
    if (!orderNotification) {
      return null
    }

    return (
      <div className="fixed top-4 right-4 bg-white rounded-lg shadow-lg border border-gray-200 p-4 max-w-sm z-50">
        <div className="flex items-start space-x-3">
          <div className={`flex-shrink-0 ${getStatusColor(orderNotification.status)}`}>
            {getStatusIcon(orderNotification.status)}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900">
              Orden #{orderNotification.orderNumber}
            </p>
            <p className="text-sm text-gray-600 mt-1">
              {orderNotification.message}
            </p>
            <p className="text-xs text-gray-400 mt-1">
              {formatDate(orderNotification.timestamp)}
            </p>
          </div>
          <button
            onClick={onClose}
            className="flex-shrink-0 text-gray-400 hover:text-gray-600"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    )
  }

  // Notification center mode
  return (
    <div className="relative">
      {/* Notification Bell */}
      <button
        onClick={() => setShowNotifications(!showNotifications)}
        className="relative p-2 text-gray-600 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-full"
      >
        <Bell className="h-6 w-6" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Notifications Dropdown */}
      {showNotifications && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setShowNotifications(false)}
          />
          
          {/* Dropdown */}
          <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50 max-h-96 overflow-hidden">
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Notificaciones</h3>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className="text-sm text-blue-600 hover:text-blue-800"
                  >
                    Marcar todo como leído
                  </button>
                )}
              </div>
            </div>

            <div className="max-h-80 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="p-6 text-center text-gray-500">
                  <Bell className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                  <p>No hay notificaciones</p>
                </div>
              ) : (
                notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer ${
                      !notification.read ? 'bg-blue-50' : ''
                    }`}
                    onClick={() => markAsRead(notification.id)}
                  >
                    <div className="flex items-start space-x-3">
                      <div className={`flex-shrink-0 ${getStatusColor(notification.status)}`}>
                        {getStatusIcon(notification.status)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900">
                          Orden #{notification.orderNumber}
                        </p>
                        <p className="text-sm text-gray-600 mt-1">
                          {notification.message}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          {formatDate(notification.timestamp)}
                        </p>
                      </div>
                      {!notification.read && (
                        <div className="flex-shrink-0">
                          <div className="h-2 w-2 bg-blue-500 rounded-full"></div>
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>

            {notifications.length > 0 && (
              <div className="p-3 bg-gray-50 border-t border-gray-200">
                <button
                  onClick={() => setShowNotifications(false)}
                  className="w-full text-sm text-gray-600 hover:text-gray-800"
                >
                  Cerrar
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}

// Hook for using notifications in components
export const useOrderNotifications = () => {
  const [notifications, setNotifications] = useState<NotificationData[]>([])

  useEffect(() => {
    const loadNotifications = () => {
      const stored = localStorage.getItem('order_notifications')
      if (stored) {
        try {
          setNotifications(JSON.parse(stored))
        } catch (error) {
          console.error('Error loading notifications:', error)
        }
      }
    }

    loadNotifications()
    
    // Listen for storage changes
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'order_notifications') {
        loadNotifications()
      }
    }

    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [])

  const unreadCount = notifications.filter(n => !n.read).length

  return {
    notifications,
    unreadCount,
    hasUnread: unreadCount > 0
  }
}
