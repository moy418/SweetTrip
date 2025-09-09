import React, { useState } from 'react'
import { Mail, Phone, MapPin, Clock, Send, MessageCircle, HelpCircle, Truck } from 'lucide-react'
import toast from 'react-hot-toast'

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    category: 'general',
    message: ''
  })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Here you would typically send the form data to your backend
      // For now, we'll just simulate a successful submission
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      toast.success('Message sent successfully! We\'ll get back to you soon.')
      setFormData({
        name: '',
        email: '',
        subject: '',
        category: 'general',
        message: ''
      })
    } catch (error) {
      toast.error('Failed to send message. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-green-600 to-blue-600 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Get in Touch
            </h1>
            <p className="text-xl text-green-100 mb-8">
              Have a question about our products? Need help with your order? 
              We're here to help make your sweet experience even better.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Information */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Multiple Ways to Reach Us
              </h2>
              <div className="w-24 h-1 bg-gradient-to-r from-green-600 to-blue-600 mx-auto mb-6"></div>
              <p className="text-xl text-gray-600">
                Choose the method that works best for you
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
              <div className="text-center p-6 bg-gray-50 rounded-xl">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Mail className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Email Us</h3>
                <p className="text-gray-600 mb-3">Get a response within 24 hours</p>
                <a href="mailto:hello@sweettrip.com" className="text-green-600 font-medium hover:text-green-700">
                  hello@sweettrip.com
                </a>
              </div>
              
              <div className="text-center p-6 bg-gray-50 rounded-xl">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Phone className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Call Us</h3>
                <p className="text-gray-600 mb-3">Mon-Fri, 9AM-6PM EST</p>
                <a href="tel:+1-555-SWEET-01" className="text-blue-600 font-medium hover:text-blue-700">
                  +1 (555) SWEET-01
                </a>
              </div>
              
              <div className="text-center p-6 bg-gray-50 rounded-xl">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MessageCircle className="h-8 w-8 text-purple-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Live Chat</h3>
                <p className="text-gray-600 mb-3">Instant support available</p>
                <button className="text-purple-600 font-medium hover:text-purple-700">
                  Start Chat
                </button>
              </div>
              
              <div className="text-center p-6 bg-gray-50 rounded-xl">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MapPin className="h-8 w-8 text-red-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Visit Us</h3>
                <p className="text-gray-600 mb-3">By appointment only</p>
                <p className="text-red-600 font-medium text-sm">
                  123 Sweet Street<br />
                  Candy City, CC 12345
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Form and FAQ */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12">
              {/* Contact Form */}
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-6">
                  Send Us a Message
                </h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        placeholder="Your full name"
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        placeholder="your@email.com"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                      Category
                    </label>
                    <select
                      id="category"
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    >
                      <option value="general">General Inquiry</option>
                      <option value="order">Order Support</option>
                      <option value="product">Product Question</option>
                      <option value="shipping">Shipping Issue</option>
                      <option value="returns">Returns & Refunds</option>
                      <option value="wholesale">Wholesale Inquiry</option>
                      <option value="feedback">Feedback & Suggestions</option>
                    </select>
                  </div>
                  
                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                      Subject *
                    </label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      required
                      value={formData.subject}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="Brief description of your inquiry"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                      Message *
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      required
                      rows={6}
                      value={formData.message}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
                      placeholder="Please provide as much detail as possible..."
                    ></textarea>
                  </div>
                  
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-green-600 to-blue-600 text-white py-4 px-6 rounded-lg font-bold text-lg hover:from-green-700 hover:to-blue-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                  >
                    {loading ? (
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    ) : (
                      <>
                        <Send className="h-5 w-5" />
                        <span>Send Message</span>
                      </>
                    )}
                  </button>
                </form>
              </div>
              
              {/* FAQ Section */}
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-6">
                  Frequently Asked Questions
                </h2>
                
                <div className="space-y-6">
                  <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <div className="flex items-start space-x-3">
                      <HelpCircle className="h-6 w-6 text-green-600 mt-1 flex-shrink-0" />
                      <div>
                        <h3 className="text-lg font-bold text-gray-900 mb-2">
                          How long does shipping take?
                        </h3>
                        <p className="text-gray-600">
                          Standard shipping takes 3-7 business days within the US. International 
                          shipping varies by location (7-21 days). Express shipping options available.
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <div className="flex items-start space-x-3">
                      <Truck className="h-6 w-6 text-blue-600 mt-1 flex-shrink-0" />
                      <div>
                        <h3 className="text-lg font-bold text-gray-900 mb-2">
                          Do you ship internationally?
                        </h3>
                        <p className="text-gray-600">
                          Yes! We ship to over 50 countries worldwide. Shipping costs and delivery 
                          times vary by destination. Some restrictions may apply for certain products.
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <div className="flex items-start space-x-3">
                      <Clock className="h-6 w-6 text-purple-600 mt-1 flex-shrink-0" />
                      <div>
                        <h3 className="text-lg font-bold text-gray-900 mb-2">
                          What's your return policy?
                        </h3>
                        <p className="text-gray-600">
                          We offer a 30-day return policy for unopened items in original packaging. 
                          Due to food safety regulations, opened candy items cannot be returned.
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <div className="flex items-start space-x-3">
                      <MessageCircle className="h-6 w-6 text-red-600 mt-1 flex-shrink-0" />
                      <div>
                        <h3 className="text-lg font-bold text-gray-900 mb-2">
                          How can I track my order?
                        </h3>
                        <p className="text-gray-600">
                          Once your order ships, you'll receive a tracking number via email. 
                          You can also track your order in your account dashboard.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-8 p-6 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border border-green-200">
                  <h3 className="text-lg font-bold text-gray-900 mb-2">
                    Still have questions?
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Check out our comprehensive help center or contact our support team directly.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <button className="bg-green-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-700 transition-colors">
                      Visit Help Center
                    </button>
                    <button className="border border-green-600 text-green-600 px-4 py-2 rounded-lg font-medium hover:bg-green-50 transition-colors">
                      Start Live Chat
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Business Hours */}
      <section className="py-12 bg-white border-t border-gray-200">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Business Hours</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="p-4">
                <h3 className="font-bold text-gray-900 mb-2">Customer Support</h3>
                <p className="text-gray-600 text-sm">
                  Monday - Friday: 9:00 AM - 6:00 PM EST<br />
                  Saturday: 10:00 AM - 4:00 PM EST<br />
                  Sunday: Closed
                </p>
              </div>
              <div className="p-4">
                <h3 className="font-bold text-gray-900 mb-2">Order Processing</h3>
                <p className="text-gray-600 text-sm">
                  Monday - Friday: Orders placed by 2:00 PM EST ship same day<br />
                  Weekend orders ship Monday
                </p>
              </div>
              <div className="p-4">
                <h3 className="font-bold text-gray-900 mb-2">Live Chat</h3>
                <p className="text-gray-600 text-sm">
                  Available 24/7 with instant responses<br />
                  AI-powered support with human backup
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
