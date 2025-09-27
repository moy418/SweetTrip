import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ShoppingBag, Lock, ArrowLeft, CreditCard } from 'lucide-react'
import { useCartStore } from '../store/cartStore'
import { useAuth } from '../contexts/AuthContext'
import toast from 'react-hot-toast'

export default function CheckoutPage() {
  const { items, getTotalPrice, clearCart } = useCartStore()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)

  const subtotal = getTotalPrice()
  const shippingCost = subtotal >= 60 ? 0 : 5.99
  const total = subtotal + shippingCost

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price)
  }

  const handleCheckout = async () => {
    if (items.length === 0) {
      toast.error('Tu carrito está vacío')
      navigate('/cart')
      return
    }

    setLoading(true)

    try {
      // Prepare cart items for Stripe
      const cartItems = items.map(item => ({
        product_id: item.product.id,
        product_name: item.product.name,
        quantity: item.quantity,
        price: item.product.price,
        product_image_url: item.product.image_urls?.[0] || null,
        origin_country: item.product.origin_country || null
      }))

      // Create Stripe Checkout Session
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/stripe-checkout-session`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`
        },
        body: JSON.stringify({
          cartItems,
          customerEmail: user?.email || '',
          successUrl: `${window.location.origin}/checkout/success`,
          cancelUrl: `${window.location.origin}/cart`
        })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error?.message || 'Error al crear la sesión de pago')
      }

      const { url } = await response.json()
      
      // Clear cart before redirecting
      clearCart()
      
      // Redirect to Stripe Checkout
      window.location.href = url

    } catch (error) {
      console.error('Checkout error:', error)
      toast.error(error instanceof Error ? error.message : 'Error al procesar el checkout')
    } finally {
      setLoading(false)
    }
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <ShoppingBag className="h-24 w-24 text-gray-300 mx-auto mb-6" />
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Tu carrito está vacío</h1>
          <Link
            to="/products"
            className="inline-flex items-center space-x-2 bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            <span>Continuar Comprando</span>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center mb-8">
          <Link 
            to="/cart" 
            className="flex items-center text-blue-600 hover:text-blue-800 transition-colors"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Volver al Carrito
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Order Summary */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center space-x-2 mb-6">
              <ShoppingBag className="h-5 w-5 text-blue-600" />
              <h2 className="text-xl font-semibold text-gray-900">Resumen de Orden</h2>
            </div>

            {/* Cart Items */}
            <div className="space-y-4 mb-6">
              {items.map((item) => (
                <div key={item.product.id} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                  <img
                    src={item.product.image_urls?.[0] || '/placeholder.jpg'}
                    alt={item.product.name}
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">{item.product.name}</h3>
                    <p className="text-sm text-gray-500">Cantidad: {item.quantity}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900">
                      {formatPrice(item.product.price * item.quantity)}
                    </p>
                    <p className="text-sm text-gray-500">
                      {formatPrice(item.product.price)} c/u
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Totals */}
            <div className="border-t pt-4 space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span className="text-gray-900">{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">
                  Envío {subtotal >= 60 && <span className="text-green-600 text-sm">(¡Gratis!)</span>}
                </span>
                <span className="text-gray-900">{formatPrice(shippingCost)}</span>
              </div>
              <div className="flex justify-between text-lg font-semibold pt-2 border-t">
                <span className="text-gray-900">Total</span>
                <span className="text-blue-600">{formatPrice(total)}</span>
              </div>
            </div>

            {/* Free Shipping Notice */}
            {subtotal < 60 && (
              <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-800">
                  💡 Añade {formatPrice(60 - subtotal)} más para obtener envío gratuito
                </p>
              </div>
            )}
          </div>

          {/* Checkout Button */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center space-x-2 mb-6">
              <CreditCard className="h-5 w-5 text-blue-600" />
              <h2 className="text-xl font-semibold text-gray-900">Checkout Seguro</h2>
            </div>

            {/* User Info */}
            {user ? (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-sm text-green-800">
                  ✅ Conectado como: <strong>{user.email}</strong>
                </p>
              </div>
            ) : (
              <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-800">
                  💡 Puedes completar tu compra como invitado o{' '}
                  <Link to="/login" className="font-semibold underline">
                    iniciar sesión
                  </Link>
                </p>
              </div>
            )}

            {/* Stripe Checkout Info */}
            <div className="mb-6 space-y-4">
              <h3 className="text-lg font-medium text-gray-900">¿Qué incluye el pago seguro?</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center space-x-2">
                  <span className="text-green-500">✓</span>
                  <span>Formulario de pago seguro de Stripe</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span className="text-green-500">✓</span>
                  <span>Información de envío y facturación</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span className="text-green-500">✓</span>
                  <span>Soporte para tarjetas y wallets digitales</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span className="text-green-500">✓</span>
                  <span>Confirmación automática por email</span>
                </li>
              </ul>
            </div>

            {/* Checkout Button */}
            <button
              onClick={handleCheckout}
              disabled={loading}
              className="w-full bg-blue-600 text-white py-4 px-6 rounded-lg font-semibold text-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                  <span>Creando Checkout...</span>
                </>
              ) : (
                <>
                  <Lock className="h-5 w-5" />
                  <span>Pagar {formatPrice(total)} con Stripe</span>
                </>
              )}
            </button>

            {/* Security Notice */}
            <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center space-x-2">
                <Lock className="h-5 w-5 text-green-600" />
                <div>
                  <h3 className="font-medium text-green-800">Pago 100% Seguro</h3>
                  <p className="text-sm text-green-700 mt-1">
                    Serás redirigido a la página de pago segura de Stripe, el procesador de pagos más confiable del mundo.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
