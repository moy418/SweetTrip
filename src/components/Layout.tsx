import React from 'react'
import Header from './Header'
import Footer from './Footer'
import CartSidebar from './CartSidebar'
import { Toaster } from 'react-hot-toast'

interface LayoutProps {
  children: React.ReactNode
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="flex-1 pt-[120px] md:pt-[160px] lg:pt-[200px]">
        {children}
      </main>
      <Footer />
      <CartSidebar />
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#fff',
            color: '#333',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
          },
        }}
      />
    </div>
  )
}