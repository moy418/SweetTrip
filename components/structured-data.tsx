import { Product, Category } from '@/lib/types'

interface StructuredDataProps {
  type: 'website' | 'product' | 'breadcrumb' | 'organization'
  data?: any
}

export function StructuredData({ type, data }: StructuredDataProps) {
  const getStructuredData = () => {
    const baseUrl = 'https://sweettripcandy.com'
    
    switch (type) {
      case 'website':
        return {
          '@context': 'https://schema.org',
          '@type': 'WebSite',
          name: 'Sweet Trip',
          description: 'Discover Candy from Around the World',
          url: baseUrl,
          potentialAction: {
            '@type': 'SearchAction',
            target: `${baseUrl}/search?q={search_term_string}`,
            'query-input': 'required name=search_term_string'
          }
        }
      
      case 'organization':
        return {
          '@context': 'https://schema.org',
          '@type': 'Organization',
          name: 'Sweet Trip',
          description: 'International candy and treat retailer',
          url: baseUrl,
          logo: `${baseUrl}/sweet-trip-logo.png`,
          contactPoint: {
            '@type': 'ContactPoint',
            telephone: '+1-555-SWEET-TRIP',
            contactType: 'customer service',
            availableLanguage: 'English'
          },
          sameAs: [
            'https://facebook.com/sweettripcandy',
            'https://instagram.com/sweettripcandy',
            'https://twitter.com/sweettripcandy'
          ]
        }
      
      case 'product':
        if (!data) return null
        return {
          '@context': 'https://schema.org',
          '@type': 'Product',
          name: data.name,
          description: data.description,
          image: data.image_urls,
          brand: {
            '@type': 'Brand',
            name: data.brand || 'Sweet Trip'
          },
          offers: {
            '@type': 'Offer',
            price: data.price,
            priceCurrency: 'USD',
            availability: data.stock_quantity > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
            seller: {
              '@type': 'Organization',
              name: 'Sweet Trip'
            }
          },
          aggregateRating: {
            '@type': 'AggregateRating',
            ratingValue: '4.5',
            reviewCount: '24'
          }
        }
      
      case 'breadcrumb':
        if (!data) return null
        return {
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: data.map((item: any, index: number) => ({
            '@type': 'ListItem',
            position: index + 1,
            name: item.name,
            item: `${baseUrl}${item.url}`
          }))
        }
      
      default:
        return null
    }
  }

  const structuredData = getStructuredData()
  
  if (!structuredData) return null

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  )
}
