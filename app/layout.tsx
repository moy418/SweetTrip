import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from './providers'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Toaster } from 'react-hot-toast'

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  preload: true,
  variable: '--font-inter'
})

export const metadata: Metadata = {
  title: {
    default: 'Sweet Trip - Discover Candy from Around the World',
    template: '%s | Sweet Trip'
  },
  description: 'Explore exotic flavors and unique treats from every corner of the globe. From Japanese Kit Kats to Korean snacks, embark on a sweet journey with Sweet Trip.',
  keywords: ['candy', 'international candy', 'Japanese Kit Kat', 'Korean snacks', 'exotic treats', 'world candy'],
  authors: [{ name: 'Sweet Trip' }],
  creator: 'Sweet Trip',
  publisher: 'Sweet Trip',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://sweettripcandy.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://sweettripcandy.com',
    title: 'Sweet Trip - Discover Candy from Around the World',
    description: 'Explore exotic flavors and unique treats from every corner of the globe. From Japanese Kit Kats to Korean snacks, embark on a sweet journey with Sweet Trip.',
    siteName: 'Sweet Trip',
    images: [
      {
        url: '/sweet-trip-logo.png',
        width: 1200,
        height: 630,
        alt: 'Sweet Trip - International Candy Store',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Sweet Trip - Discover Candy from Around the World',
    description: 'Explore exotic flavors and unique treats from every corner of the globe.',
    images: ['/sweet-trip-logo.png'],
    creator: '@sweettripcandy',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#2563eb" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
      </head>
      <body className={`${inter.className} antialiased`}>
        <Providers>
          <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-1">
              {children}
            </main>
            <Footer />
          </div>
          <Toaster 
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#363636',
                color: '#fff',
              },
            }}
          />
        </Providers>
      </body>
    </html>
  )
}


