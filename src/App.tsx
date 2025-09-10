import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AuthProvider } from './contexts/AuthContext'
import { LanguageProvider } from './hooks/useLanguage'
import Layout from './components/Layout'

// Pages
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import ProductListPage from './pages/ProductListPage'
import ProductDetailPage from './pages/ProductDetailPage'
import CartPage from './pages/CartPage'
import CheckoutPage from './pages/CheckoutPage'
import CheckoutSuccessPage from './pages/CheckoutSuccessPage'
import AccountPage from './pages/AccountPage'
import OrdersPage from './pages/OrdersPage'
import WishlistPage from './pages/WishlistPage'
import CategoryPage from './pages/CategoryPage'
import SearchPage from './pages/SearchPage'
import AdminDashboard from './pages/admin/AdminDashboard'
import NotFoundPage from './pages/NotFoundPage'

// New Navigation Pages
import CategoriesPage from './pages/CategoriesPage'
import RegionsPage from './pages/RegionsPage'
import CountriesListPage from './pages/CountriesListPage'
import AboutPage from './pages/AboutPage'
import ContactPage from './pages/ContactPage'

// Legal Pages
import PrivacyPage from './pages/PrivacyPage'
import TermsPage from './pages/TermsPage'
import ShippingPage from './pages/ShippingPage'
import ReturnsPage from './pages/ReturnsPage'

// World Cup 2026 Pages
import WorldCup2026Page from './pages/WorldCup2026Page'
import CountriesPage from './pages/CountriesPage'
import PredictionsPage from './pages/PredictionsPage'
import LeaderboardPage from './pages/LeaderboardPage'
import MyCollectionPage from './pages/MyCollectionPage'
import CulturalStoriesPage from './pages/CulturalStoriesPage'

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 1,
    },
  },
})

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <AuthProvider>
          <Router>
            <Layout>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/products" element={<ProductListPage />} />
              <Route path="/product/:slug" element={<ProductDetailPage />} />
              <Route path="/category/:slug" element={<CategoryPage />} />
              <Route path="/search" element={<SearchPage />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/checkout" element={<CheckoutPage />} />
              <Route path="/checkout/success" element={<CheckoutSuccessPage />} />
              <Route path="/account" element={<AccountPage />} />
              <Route path="/orders" element={<OrdersPage />} />
              <Route path="/wishlist" element={<WishlistPage />} />
              <Route path="/featured" element={<ProductListPage />} />
              <Route path="/new-arrivals" element={<ProductListPage />} />
              
              {/* New Navigation Pages */}
              <Route path="/categories" element={<CategoriesPage />} />
              <Route path="/regions" element={<RegionsPage />} />
              <Route path="/region/:slug" element={<ProductListPage />} />
              <Route path="/countries" element={<CountriesListPage />} />
              <Route path="/country/:code" element={<ProductListPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/contact" element={<ContactPage />} />
              
              {/* Legal Pages */}
              <Route path="/privacy" element={<PrivacyPage />} />
              <Route path="/terms" element={<TermsPage />} />
              <Route path="/shipping" element={<ShippingPage />} />
              <Route path="/returns" element={<ReturnsPage />} />
              
              {/* World Cup 2026 Routes */}
              <Route path="/worldcup2026" element={<WorldCup2026Page />} />
              <Route path="/worldcup2026/countries" element={<CountriesPage />} />
              <Route path="/worldcup2026/predictions" element={<PredictionsPage />} />
              <Route path="/worldcup2026/leaderboard" element={<LeaderboardPage />} />
              <Route path="/worldcup2026/my-collection" element={<MyCollectionPage />} />
              <Route path="/stories" element={<CulturalStoriesPage />} />
              <Route path="/stories/:type/:id" element={<CulturalStoriesPage />} />
              
              <Route path="/admin/*" element={<AdminDashboard />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
            </Layout>
          </Router>
        </AuthProvider>
      </LanguageProvider>
    </QueryClientProvider>
  )
}

export default App