import React from 'react'
import { Link } from 'react-router-dom'
import { ShoppingBag, Plus, Minus, X, ArrowRight } from 'lucide-react'
import { useCartStore } from '../store/cartStore'

export default function CartPage() {
  const { items, updateQuantity, removeItem, getTotalPrice, clearCart } = useCartStore()

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price)
  }

  const subtotal = getTotalPrice()
  const shippingCost = subtotal >= 60 ? 0 : 5.99
  const total = subtotal + shippingCost

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <ShoppingBag className="h-24 w-24 text-gray-300 mx-auto mb-6" />
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Your cart is empty</h1>
            <p className="text-gray-600 mb-8">
              Looks like you haven't added any sweet treats to your cart yet.
            </p>
            <Link
              to="/products"
              className="inline-flex items-center space-x-2 bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              <span>Start Shopping</span>
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
            <button
              onClick={clearCart}
              className="text-red-600 hover:text-red-700 font-medium transition-colors"
            >
              Clear Cart
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {items.map((item) => (
                <div key={item.product.id} className="bg-white rounded-lg shadow-sm p-6">
                  <div className="flex items-center space-x-4">
                    {/* Product Image */}
                    <Link to={`/product/${item.product.slug}`} className="flex-shrink-0">
                      <img
                        src={item.product.image_urls?.[0] || '/candy-fallback.jpg'}
                        alt={item.product.name}
                        className="w-20 h-20 object-cover rounded-lg"
                      />
                    </Link>
                    
                    {/* Product Info */}
                    <div className="flex-1 min-w-0">
                      <Link 
                        to={`/product/${item.product.slug}`}
                        className="text-lg font-semibold text-gray-900 hover:text-blue-600 transition-colors block truncate"
                      >
                        {item.product.name}
                      </Link>
                      
                      <div className="flex items-center space-x-4 mt-2">
                        {item.product.brand && (
                          <span className="text-sm text-blue-600 font-medium">
                            {item.product.brand}
                          </span>
                        )}
                        {item.product.origin_country && (
                          <span className="text-sm text-gray-500">
                            From {item.product.origin_country}
                          </span>
                        )}
                      </div>
                      
                      <p className="text-lg font-bold text-gray-900 mt-2">
                        {formatPrice(item.product.price)}
                        {item.product.weight_grams && (
                          <span className="text-sm text-gray-500 ml-2">({item.product.weight_grams}g)</span>
                        )}
                      </p>
                    </div>
                    
                    {/* Quantity Controls */}
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center border border-gray-300 rounded-lg">
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                          className="p-2 hover:bg-gray-100 transition-colors"
                          disabled={item.quantity <= 1}
                        >
                          <Minus className="h-4 w-4" />
                        </button>
                        <span className="px-4 py-2 text-center min-w-[60px] font-medium">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                          className="p-2 hover:bg-gray-100 transition-colors"
                          disabled={item.quantity >= item.product.stock_quantity}
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>
                      
                      {/* Item Total */}
                      <div className="text-right">
                        <p className="text-lg font-bold text-gray-900">
                          {formatPrice(item.product.price * item.quantity)}
                        </p>
                        <button
                          onClick={() => removeItem(item.product.id)}
                          className="text-red-500 hover:text-red-700 text-sm mt-1 transition-colors flex items-center space-x-1"
                        >
                          <X className="h-4 w-4" />
                          <span>Remove</span>
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  {/* Stock Warning */}
                  {item.product.stock_quantity <= 5 && (
                    <div className="mt-4 p-3 bg-orange-50 border border-orange-200 rounded-lg">
                      <p className="text-sm text-orange-800">
                        Only {item.product.stock_quantity} left in stock
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="space-y-6">
              <div className="bg-white rounded-lg shadow-sm p-6 sticky top-4">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Order Summary</h2>
                
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal ({items.length} items)</span>
                    <span className="font-medium">{formatPrice(subtotal)}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600">Shipping</span>
                    <span className="font-medium">
                      {shippingCost === 0 ? (
                        <span className="text-green-600 font-semibold">FREE</span>
                      ) : (
                        formatPrice(shippingCost)
                      )}
                    </span>
                  </div>
                  
                  <div className="border-t pt-4">
                    <div className="flex justify-between text-lg font-bold">
                      <span>Total</span>
                      <span>{formatPrice(total)}</span>
                    </div>
                  </div>
                </div>
                
                {/* Free Shipping Message */}
                {subtotal < 60 && (
                  <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-sm text-blue-800">
                      Add {formatPrice(60 - subtotal)} more for free shipping!
                    </p>
                  </div>
                )}
                
                {subtotal >= 60 && (
                  <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-sm text-green-800 font-medium">
                      You qualify for free shipping!
                    </p>
                  </div>
                )}
                
                {/* Checkout Button */}
                <Link
                  to="/checkout"
                  className="block w-full bg-blue-600 text-white text-center py-3 rounded-lg font-semibold text-lg hover:bg-blue-700 transition-colors mt-6"
                >
                  Proceed to Checkout
                </Link>
                
                {/* Continue Shopping */}
                <Link
                  to="/products"
                  className="block w-full bg-gray-200 text-gray-800 text-center py-2 rounded-lg font-medium hover:bg-gray-300 transition-colors mt-3"
                >
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}