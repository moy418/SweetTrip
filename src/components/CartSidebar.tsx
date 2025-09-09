import React from 'react'
import { X, Plus, Minus, ShoppingBag } from 'lucide-react'
import { useCartStore } from '../store/cartStore'
import { Link } from 'react-router-dom'

export default function CartSidebar() {
  const { items, isOpen, toggleCart, updateQuantity, removeItem, getTotalPrice } = useCartStore()

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price)
  }

  if (!isOpen) return null

  return (
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-50"
        onClick={toggleCart}
      />
      
      {/* Sidebar */}
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-xl z-50 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold">Shopping Cart ({items.length})</h2>
          <button
            onClick={toggleCart}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-4">
          {items.length === 0 ? (
            <div className="text-center py-8">
              <ShoppingBag className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 mb-4">Your cart is empty</p>
              <button
                onClick={toggleCart}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <div key={item.product.id} className="flex items-center space-x-3 bg-gray-50 p-3 rounded-lg">
                  {/* Product Image */}
                  <div className="flex-shrink-0">
                    <img
                      src={item.product.image_urls?.[0] || '/candy-fallback.jpg'}
                      alt={item.product.name}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                  </div>
                  
                  {/* Product Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-medium text-gray-900 truncate">
                      {item.product.name}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {formatPrice(item.product.price)} each
                    </p>
                    
                    {/* Quantity Controls */}
                    <div className="flex items-center space-x-2 mt-2">
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                        className="p-1 hover:bg-gray-200 rounded transition-colors"
                        disabled={item.quantity <= 1}
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      <span className="text-sm font-medium w-8 text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                        className="p-1 hover:bg-gray-200 rounded transition-colors"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  
                  {/* Price and Remove */}
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">
                      {formatPrice(item.product.price * item.quantity)}
                    </p>
                    <button
                      onClick={() => removeItem(item.product.id)}
                      className="text-red-500 hover:text-red-700 text-xs mt-1 transition-colors"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t p-4 space-y-4">
            {/* Subtotal */}
            <div className="flex justify-between items-center">
              <span className="text-lg font-semibold">Subtotal:</span>
              <span className="text-lg font-bold text-blue-600">
                {formatPrice(getTotalPrice())}
              </span>
            </div>
            
            {/* Free Shipping Notice */}
            {getTotalPrice() < 60 && (
              <p className="text-sm text-gray-600 text-center">
                Add {formatPrice(60 - getTotalPrice())} more for free shipping!
              </p>
            )}
            
            {/* Checkout Button */}
            <Link
              to="/checkout"
              onClick={toggleCart}
              className="block w-full bg-blue-600 text-white text-center py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Proceed to Checkout
            </Link>
            
            <button
              onClick={toggleCart}
              className="block w-full bg-gray-200 text-gray-800 text-center py-2 rounded-lg font-medium hover:bg-gray-300 transition-colors"
            >
              Continue Shopping
            </button>
          </div>
        )}
      </div>
    </>
  )
}