import React from 'react'
import { Link } from 'react-router-dom'
import { MapPin, Heart, Users, Globe2, Award, Truck, Shield, Star } from 'lucide-react'

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              About Sweet Trip
            </h1>
            <p className="text-xl text-blue-100 mb-8 leading-relaxed">
              Your passport to the world's sweetest destinations. We bring you authentic candies 
              and confections from every corner of the globe, one delicious bite at a time.
            </p>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Our Sweet Story
              </h2>
              <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-purple-600 mx-auto mb-6"></div>
            </div>
            
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  A Journey That Started with Curiosity
                </h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  Sweet Trip began with a simple question: "What do people around the world 
                  consider sweet?" Our founders, passionate travelers and confectionery enthusiasts, 
                  discovered that every culture has its own unique interpretation of sweetness.
                </p>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  From the delicate mochi of Japan to the rich chocolates of Belgium, from the 
                  spicy-sweet tamarind candies of Mexico to the traditional halva of the Middle East, 
                  we realized that candy is more than just a treat—it's a cultural bridge.
                </p>
                <p className="text-gray-600 leading-relaxed">
                  Today, we're proud to bring you the most authentic and diverse collection of 
                  international candies, carefully sourced from local artisans and trusted 
                  manufacturers worldwide.
                </p>
              </div>
              <div className="bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl p-8">
                <div className="text-6xl mb-4 text-center">🍭</div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-2">48+</div>
                  <div className="text-gray-600 mb-4">Countries Represented</div>
                  <div className="text-3xl font-bold text-purple-600 mb-2">500+</div>
                  <div className="text-gray-600 mb-4">Unique Products</div>
                  <div className="text-3xl font-bold text-green-600 mb-2">50K+</div>
                  <div className="text-gray-600">Happy Customers</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                What Drives Us
              </h2>
              <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-purple-600 mx-auto mb-6"></div>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Our mission is to make the world's sweetest treasures accessible to everyone, 
                while supporting local communities and preserving cultural traditions.
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="bg-white rounded-xl p-8 shadow-lg border border-gray-200 hover:shadow-xl transition-shadow">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-6">
                  <Globe2 className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Global Authenticity</h3>
                <p className="text-gray-600">
                  We source directly from local producers and authentic manufacturers to ensure 
                  you experience the true taste of each culture.
                </p>
              </div>
              
              <div className="bg-white rounded-xl p-8 shadow-lg border border-gray-200 hover:shadow-xl transition-shadow">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6">
                  <Heart className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Quality First</h3>
                <p className="text-gray-600">
                  Every product undergoes rigorous quality checks and taste testing to meet our 
                  high standards for freshness and flavor.
                </p>
              </div>
              
              <div className="bg-white rounded-xl p-8 shadow-lg border border-gray-200 hover:shadow-xl transition-shadow">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-6">
                  <Users className="h-8 w-8 text-purple-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Community Support</h3>
                <p className="text-gray-600">
                  We believe in supporting local artisans and small businesses around the world, 
                  ensuring fair trade and sustainable practices.
                </p>
              </div>
              
              <div className="bg-white rounded-xl p-8 shadow-lg border border-gray-200 hover:shadow-xl transition-shadow">
                <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mb-6">
                  <Award className="h-8 w-8 text-yellow-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Expert Curation</h3>
                <p className="text-gray-600">
                  Our team of confectionery experts carefully selects each product based on taste, 
                  cultural significance, and uniqueness.
                </p>
              </div>
              
              <div className="bg-white rounded-xl p-8 shadow-lg border border-gray-200 hover:shadow-xl transition-shadow">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-6">
                  <Truck className="h-8 w-8 text-red-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Fast & Fresh</h3>
                <p className="text-gray-600">
                  Temperature-controlled shipping and strategic warehousing ensure your candies 
                  arrive fresh and in perfect condition.
                </p>
              </div>
              
              <div className="bg-white rounded-xl p-8 shadow-lg border border-gray-200 hover:shadow-xl transition-shadow">
                <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mb-6">
                  <Shield className="h-8 w-8 text-indigo-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Safe & Secure</h3>
                <p className="text-gray-600">
                  All products meet international food safety standards, and we provide secure 
                  payment processing and data protection.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Meet Our Sweet Team
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-purple-600 mx-auto mb-8"></div>
            <p className="text-xl text-gray-600 mb-12">
              Our diverse team of food enthusiasts, cultural experts, and logistics specialists 
              work together to bring you the world's best candies.
            </p>
            
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-8">
              <div className="flex items-center justify-center space-x-8 mb-6">
                <div className="text-4xl">🍫</div>
                <div className="text-4xl">🌍</div>
                <div className="text-4xl">❤️</div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Passionate About Every Sweet Detail
              </h3>
              <p className="text-gray-600 leading-relaxed">
                From our sourcing specialists who travel the world to find unique treats, 
                to our customer service team who ensures every order is perfect, we're all 
                united by our love for bringing sweetness to your life.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Start Your Sweet Journey?
            </h2>
            <p className="text-xl text-blue-100 mb-8">
              Explore our collection of international candies and discover flavors 
              you never knew existed.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/products"
                className="bg-white text-blue-600 px-8 py-4 rounded-lg font-bold text-lg hover:bg-gray-100 transition-colors inline-flex items-center justify-center space-x-2"
              >
                <span>Shop All Products</span>
                <Star className="h-5 w-5" />
              </Link>
              <Link
                to="/contact"
                className="border-2 border-white text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-white hover:text-blue-600 transition-colors"
              >
                Get in Touch
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
