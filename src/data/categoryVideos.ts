// Video Management System for Category Video Reel
// This file allows you to easily manage and provide videos for the categories page

export interface VideoItem {
  id: string
  title: string
  description: string
  videoUrl: string
  thumbnailUrl: string
  category: string
  duration: number // in seconds
  featured: boolean
  tags?: string[]
  country?: string
  region?: string
}

// Video Categories Configuration
export const VIDEO_CATEGORIES = {
  JAPANESE: 'Japanese',
  EUROPEAN: 'European', 
  AMERICAN: 'American',
  ASIAN: 'Asian',
  LATIN_AMERICAN: 'Latin American',
  MIDDLE_EASTERN: 'Middle Eastern',
  AFRICAN: 'African',
  AUSTRALIAN: 'Australian'
}

// Default Video Collection
// Replace these with your actual video URLs and thumbnails
export const CATEGORY_VIDEOS: VideoItem[] = [
  {
    id: 'japanese-collection',
    title: 'Japanese Candy Collection',
    description: 'Discover the unique flavors of Japan with our curated selection of traditional and modern treats. From matcha Kit Kats to traditional wagashi.',
    videoUrl: '/videos/japanese-candy-reel.mp4',
    thumbnailUrl: '/images/japanese-candy-thumb.jpg',
    category: VIDEO_CATEGORIES.JAPANESE,
    duration: 30,
    featured: true,
    tags: ['matcha', 'kit kat', 'wagashi', 'traditional'],
    country: 'Japan',
    region: 'Asia'
  },
  {
    id: 'european-chocolate',
    title: 'European Chocolate Delights',
    description: 'From Swiss chocolate to Belgian pralines, explore the finest chocolates from Europe. Premium quality and authentic recipes.',
    videoUrl: '/videos/european-chocolate-reel.mp4',
    thumbnailUrl: '/images/european-chocolate-thumb.jpg',
    category: VIDEO_CATEGORIES.EUROPEAN,
    duration: 25,
    featured: true,
    tags: ['chocolate', 'swiss', 'belgian', 'premium'],
    country: 'Switzerland',
    region: 'Europe'
  },
  {
    id: 'american-classics',
    title: 'American Classic Candies',
    description: 'Nostalgic flavors and iconic brands that define American candy culture. From Hershey\'s to Skittles, rediscover the classics.',
    videoUrl: '/videos/american-candy-reel.mp4',
    thumbnailUrl: '/images/american-candy-thumb.jpg',
    category: VIDEO_CATEGORIES.AMERICAN,
    duration: 35,
    featured: true,
    tags: ['hershey', 'skittles', 'classic', 'nostalgic'],
    country: 'United States',
    region: 'North America'
  },
  {
    id: 'asian-treats',
    title: 'Asian Sweet Treats',
    description: 'From Korean snacks to Thai desserts, experience the diverse sweetness of Asia. Unique flavors and innovative textures.',
    videoUrl: '/videos/asian-treats-reel.mp4',
    thumbnailUrl: '/images/asian-treats-thumb.jpg',
    category: VIDEO_CATEGORIES.ASIAN,
    duration: 28,
    featured: true,
    tags: ['korean', 'thai', 'mochi', 'innovative'],
    country: 'South Korea',
    region: 'Asia'
  },
  {
    id: 'latin-flavors',
    title: 'Latin American Flavors',
    description: 'Spicy, sweet, and tropical flavors from Latin America. From Mexican dulces to Brazilian brigadeiros.',
    videoUrl: '/videos/latin-american-reel.mp4',
    thumbnailUrl: '/images/latin-american-thumb.jpg',
    category: VIDEO_CATEGORIES.LATIN_AMERICAN,
    duration: 32,
    featured: true,
    tags: ['spicy', 'tropical', 'dulces', 'brigadeiros'],
    country: 'Mexico',
    region: 'Latin America'
  },
  {
    id: 'middle-eastern-sweets',
    title: 'Middle Eastern Sweets',
    description: 'Traditional Middle Eastern confections with rich flavors and unique textures. From Turkish delight to baklava.',
    videoUrl: '/videos/middle-eastern-reel.mp4',
    thumbnailUrl: '/images/middle-eastern-thumb.jpg',
    category: VIDEO_CATEGORIES.MIDDLE_EASTERN,
    duration: 27,
    featured: true,
    tags: ['turkish delight', 'baklava', 'traditional', 'rich'],
    country: 'Turkey',
    region: 'Middle East'
  }
]

// Helper Functions for Video Management

/**
 * Get all videos for a specific category
 */
export const getVideosByCategory = (category: string): VideoItem[] => {
  return CATEGORY_VIDEOS.filter(video => video.category === category)
}

/**
 * Get featured videos only
 */
export const getFeaturedVideos = (): VideoItem[] => {
  return CATEGORY_VIDEOS.filter(video => video.featured)
}

/**
 * Get videos by region
 */
export const getVideosByRegion = (region: string): VideoItem[] => {
  return CATEGORY_VIDEOS.filter(video => video.region === region)
}

/**
 * Get videos by tags
 */
export const getVideosByTags = (tags: string[]): VideoItem[] => {
  return CATEGORY_VIDEOS.filter(video => 
    video.tags?.some(tag => tags.includes(tag))
  )
}

/**
 * Add a new video to the collection
 */
export const addVideo = (video: Omit<VideoItem, 'id'>): VideoItem => {
  const newVideo: VideoItem = {
    ...video,
    id: `video-${Date.now()}`
  }
  CATEGORY_VIDEOS.push(newVideo)
  return newVideo
}

/**
 * Update an existing video
 */
export const updateVideo = (id: string, updates: Partial<VideoItem>): VideoItem | null => {
  const index = CATEGORY_VIDEOS.findIndex(video => video.id === id)
  if (index !== -1) {
    CATEGORY_VIDEOS[index] = { ...CATEGORY_VIDEOS[index], ...updates }
    return CATEGORY_VIDEOS[index]
  }
  return null
}

/**
 * Remove a video from the collection
 */
export const removeVideo = (id: string): boolean => {
  const index = CATEGORY_VIDEOS.findIndex(video => video.id === id)
  if (index !== -1) {
    CATEGORY_VIDEOS.splice(index, 1)
    return true
  }
  return false
}

// Video Upload Instructions
export const VIDEO_UPLOAD_INSTRUCTIONS = {
  videoFormats: ['MP4', 'WebM', 'MOV'],
  recommendedResolution: '1920x1080 (Full HD)',
  maxFileSize: '50MB',
  recommendedDuration: '25-35 seconds',
  thumbnailFormats: ['JPG', 'PNG'],
  thumbnailResolution: '1920x1080 or 16:9 aspect ratio',
  
  // Directory structure for organizing videos
  directoryStructure: {
    videos: '/public/videos/',
    thumbnails: '/public/images/',
    categories: {
      japanese: '/public/videos/japanese/',
      european: '/public/videos/european/',
      american: '/public/videos/american/',
      asian: '/public/videos/asian/'
    }
  },
  
  // Naming conventions
  namingConventions: {
    videos: 'category-name-reel.mp4',
    thumbnails: 'category-name-thumb.jpg',
    examples: [
      'japanese-candy-reel.mp4',
      'european-chocolate-reel.mp4',
      'american-classics-reel.mp4'
    ]
  }
}

// Export default for easy importing
export default CATEGORY_VIDEOS
