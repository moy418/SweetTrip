# Sweet Trip - E-commerce Platform

**Discover Candy from Around the World**

A complete self-hosted Shopify-style e-commerce platform for selling exotic and international candies online. Built with modern web technologies for a professional, scalable solution.

![Sweet Trip Logo](public/sweetland-logo.jpeg)

## 🎯 Project Overview

Sweet Trip is a full-featured e-commerce platform designed to compete with Shopify while being completely self-hosted. It offers all the essential features needed to run a successful online candy store, from product management to order processing.

### ✨ Key Features

#### Customer Features
- **Modern Shopping Experience**: Responsive design optimized for all devices
- **Product Catalog**: Browse exotic candies from around the world
- **Advanced Search & Filtering**: Find products by country, brand, price, and more
- **Shopping Cart**: Persistent cart with real-time updates
- **Secure Checkout**: Complete order processing with payment integration ready
- **User Accounts**: Registration, login, and profile management
- **Wishlist**: Save favorite products for later
- **Product Reviews**: Customer ratings and reviews system
- **Multi-currency Support**: Shop in preferred currency
- **Free Shipping**: Automatic free shipping on orders over $60

#### Business Features
- **Inventory Management**: Real-time stock tracking
- **Order Management**: Complete order lifecycle management
- **Discount System**: Coupon codes and promotional pricing
- **Admin Dashboard**: Comprehensive management interface
- **Analytics Ready**: Built-in tracking capabilities
- **SEO Optimized**: Search engine friendly URLs and structure
- **Mobile-First Design**: Optimized for mobile commerce

#### Technical Features
- **Self-Hosted**: Complete control over your platform
- **Modern Stack**: React 18, TypeScript, TailwindCSS
- **Real-time Updates**: Powered by Supabase
- **Scalable Architecture**: PostgreSQL database
- **Secure Authentication**: JWT-based user management
- **File Upload**: Product image management
- **API-First Design**: RESTful API architecture

## 🛠 Technology Stack

### Frontend
- **React 18.3** - Modern UI framework
- **TypeScript** - Type-safe development
- **Vite 6.0** - Fast build tool
- **TailwindCSS** - Utility-first styling
- **React Router** - Client-side routing
- **React Query** - Data fetching and caching
- **Zustand** - State management
- **React Hook Form** - Form management
- **Framer Motion** - Animations

### Backend
- **Supabase** - Backend-as-a-Service
- **PostgreSQL** - Robust database
- **Edge Functions** - Serverless functions
- **Real-time Subscriptions** - Live updates
- **Row Level Security** - Data protection

### Design System
- **Vibrant Color Scheme** - Bright blues and playful accents
- **Shopify-Inspired UI** - Professional e-commerce design
- **Lucide Icons** - Consistent iconography
- **Responsive Grid** - Mobile-first approach

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- PNPM (recommended) or NPM
- Supabase account (for backend services)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd sweet-trip-ecommerce
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Configure environment**
   ```bash
   cp .env.example .env
   # Edit .env with your Supabase credentials
   ```

4. **Start development server**
   ```bash
   pnpm dev
   ```

5. **Build for production**
   ```bash
   pnpm build
   ```

## 📊 Database Schema

The platform uses a comprehensive database schema:

### Core Tables
- **categories** - Product categorization
- **products** - Main product catalog
- **profiles** - User profile data
- **orders** - Order management
- **order_items** - Order line items
- **cart_items** - Shopping cart persistence
- **wishlists** - Customer wishlists
- **reviews** - Product reviews and ratings
- **coupons** - Discount codes
- **shipping_zones** - Shipping configuration

### Sample Data Included
- **18 Products** from 6 categories
- **International Brands**: Kit Kat, Pocky, Feastables, Haribo, and more
- **Authentic Origins**: Japan, Korea, USA, Europe, and exotic locations
- **Sample Coupons**: WELCOME10, SWEET20, FREESHIP, BULK15
- **Shipping Zones**: USA, Canada, Europe, Asia Pacific, Rest of World

## 🎨 Design Philosophy

### Visual Identity
- **Primary Colors**: Bright blue (#2563EB) inspired by SWEETLAND branding
- **Accent Colors**: Cyan, teal, yellow, and vibrant highlights
- **Typography**: Clean, modern fonts with excellent readability
- **Imagery**: High-quality product photos with consistent styling

### User Experience
- **Intuitive Navigation**: Clear category structure and search
- **Fast Performance**: Optimized loading and smooth interactions
- **Accessibility**: WCAG compliant design patterns
- **Mobile-First**: Touch-friendly interface on all devices

## 🌍 International Products Catalog

### Japanese Snacks
- Kit Kat Matcha Green Tea
- Kit Kat Sake Flavor
- Pocky Strawberry
- Japanese Mochi Mix

### Korean Treats
- Pocari Sweat Candy
- Korean Honey Butter Chips
- Choco Pie Original

### American Favorites
- Feastables Milk Chocolate
- Feastables Dark Chocolate
- American Candy Mix

### European Delights
- Belgian Chocolate Truffles
- German Haribo Gummy Bears
- Swiss Alpine Chocolate

### Exotic International
- Thai Coconut Candy
- Mexican Chili Lollipops
- Brazilian Brigadeiro Bites

### Chocolate Collection
- Premium Dark Chocolate 85%
- Milk Chocolate Hazelnut
- White Chocolate Raspberry

## 🔧 Configuration

### Environment Variables
```env
# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# Optional: Analytics
VITE_GA_TRACKING_ID=your_google_analytics_id
```

### Customization
- **Brand Colors**: Edit `tailwind.config.js`
- **Product Categories**: Update database and navigation
- **Shipping Rates**: Configure in shipping_zones table
- **Currency**: Modify price formatting functions

## 📱 API Integration

### Supabase Edge Functions
- **image-upload**: Secure file upload handling
- **inventory-management**: Stock level operations
- **order-processing**: Complete order workflow
- **payment-processing**: Payment integration ready

### External APIs Ready
- **Stripe**: Payment processing integration
- **SendGrid**: Email notifications
- **Google Analytics**: E-commerce tracking
- **Shipstation**: Shipping management

## 🛡 Security Features

### Authentication
- JWT-based user sessions
- Email verification
- Password strength requirements
- Account recovery system

### Data Protection
- Row Level Security (RLS)
- Input validation and sanitization
- CORS configuration
- Rate limiting ready

### Payment Security
- Stripe-ready integration
- PCI compliance architecture
- Secure checkout flow
- Fraud prevention ready

## 📈 Performance Optimizations

### Frontend
- Code splitting and lazy loading
- Image optimization
- Caching strategies
- Bundle size optimization (710KB gzipped)

### Backend
- Database indexing
- Query optimization
- Real-time subscriptions
- Edge function deployment

### SEO
- Semantic HTML structure
- Meta tags optimization
- Open Graph integration
- Sitemap generation ready

## 🚀 Deployment Options

### Self-Hosted (Recommended)
See [DEPLOYMENT.md](DEPLOYMENT.md) for complete Linux server setup guide.

### Cloud Platforms
- **Vercel**: Frontend deployment
- **Netlify**: Static site hosting
- **DigitalOcean**: Full-stack deployment
- **AWS/GCP**: Enterprise deployment

### Docker Support
```bash
# Build Docker image
docker build -t sweet-trip .

# Run container
docker run -p 3000:3000 sweet-trip
```

## 🧪 Testing

### Development Testing
```bash
# Run development server
pnpm dev

# Build and preview
pnpm build && pnpm preview
```

### Production Testing
```bash
# Build for production
pnpm build

# Serve production build
npx serve dist
```

## 📝 Contributing

### Development Workflow
1. Fork the repository
2. Create feature branch
3. Make changes
4. Test thoroughly
5. Submit pull request

### Code Standards
- TypeScript strict mode
- ESLint configuration
- Prettier formatting
- Component-based architecture

## 📞 Support

### Documentation
- [Deployment Guide](DEPLOYMENT.md)
- [API Documentation](docs/api.md)
- [Component Library](docs/components.md)

### Community
- GitHub Issues for bug reports
- Discussions for feature requests
- Wiki for additional documentation

## 📄 License

This project is licensed under the MIT License. See [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **SWEETLAND Branding**: Logo and visual inspiration
- **Supabase**: Backend infrastructure
- **TailwindCSS**: Design system foundation
- **Lucide**: Icon library
- **React Community**: Framework and ecosystem

---

**Sweet Trip** - *Discover Candy from Around the World*

Built with ❤️ for candy lovers everywhere

---

## 🎯 Live Demo

**Deployed Website**: [Sweet Trip E-commerce](https://jt78e35lez58.space.minimax.io)

Explore the full functionality including:
- Product browsing and search
- Shopping cart and checkout
- User registration and login
- Admin dashboard
- Mobile-responsive design

*Note: This is a demo deployment. For production use, follow the deployment guide for your own server setup.*