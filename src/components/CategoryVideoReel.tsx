import React, { useState, useEffect, useRef } from 'react'
import { Play, Pause, Volume2, VolumeX, ChevronLeft, ChevronRight } from 'lucide-react'

interface VideoItem {
  id: string
  title: string
  description: string
  videoUrl: string
  thumbnailUrl: string
  category: string
  duration: number
  featured: boolean
}

interface CategoryVideoReelProps {
  videos?: VideoItem[]
  autoPlay?: boolean
  showControls?: boolean
}

export default function CategoryVideoReel({ 
  videos = [], 
  autoPlay = true, 
  showControls = true 
}: CategoryVideoReelProps) {
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(true)
  const [showThumbnail, setShowThumbnail] = useState(true)
  const videoRef = useRef<HTMLVideoElement>(null)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)

  // Default videos if none provided
  const defaultVideos: VideoItem[] = [
    {
      id: '1',
      title: 'Japanese Candy Collection',
      description: 'Discover the unique flavors of Japan with our curated selection of traditional and modern treats.',
      videoUrl: '/videos/japanese-candy-reel.mp4',
      thumbnailUrl: '/images/japanese-candy-thumb.jpg',
      category: 'Japanese',
      duration: 30,
      featured: true
    },
    {
      id: '2',
      title: 'European Chocolate Delights',
      description: 'From Swiss chocolate to Belgian pralines, explore the finest chocolates from Europe.',
      videoUrl: '/videos/european-chocolate-reel.mp4',
      thumbnailUrl: '/images/european-chocolate-thumb.jpg',
      category: 'European',
      duration: 25,
      featured: true
    },
    {
      id: '3',
      title: 'American Classic Candies',
      description: 'Nostalgic flavors and iconic brands that define American candy culture.',
      videoUrl: '/videos/american-candy-reel.mp4',
      thumbnailUrl: '/images/american-candy-thumb.jpg',
      category: 'American',
      duration: 35,
      featured: true
    },
    {
      id: '4',
      title: 'Asian Sweet Treats',
      description: 'From Korean snacks to Thai desserts, experience the diverse sweetness of Asia.',
      videoUrl: '/videos/asian-treats-reel.mp4',
      thumbnailUrl: '/images/asian-treats-thumb.jpg',
      category: 'Asian',
      duration: 28,
      featured: true
    }
  ]

  const videoList = videos.length > 0 ? videos : defaultVideos
  const currentVideo = videoList[currentVideoIndex]

  useEffect(() => {
    if (autoPlay && videoRef.current && showThumbnail === false) {
      videoRef.current.play()
      setIsPlaying(true)
    }
  }, [currentVideoIndex, autoPlay, showThumbnail])

  const handlePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause()
        setIsPlaying(false)
      } else {
        videoRef.current.play()
        setIsPlaying(true)
      }
    }
  }

  const handleMuteToggle = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted
      setIsMuted(!isMuted)
    }
  }

  const handleVideoStart = () => {
    setShowThumbnail(false)
    setIsPlaying(true)
  }

  const nextVideo = () => {
    setCurrentVideoIndex((prev) => (prev + 1) % videoList.length)
    setShowThumbnail(true)
    setIsPlaying(false)
  }

  const prevVideo = () => {
    setCurrentVideoIndex((prev) => (prev - 1 + videoList.length) % videoList.length)
    setShowThumbnail(true)
    setIsPlaying(false)
  }

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime)
    }
  }

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration)
    }
  }

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  if (!currentVideo) return null

  return (
    <div className="w-full max-w-4xl mx-auto bg-black rounded-3xl overflow-hidden shadow-2xl relative">
      {/* Video Container */}
      <div className="relative aspect-video bg-gray-900">
        {/* Video Element */}
        <video
          ref={videoRef}
          className="w-full h-full object-cover"
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
          onEnded={nextVideo}
          muted={isMuted}
          loop={false}
          preload="metadata"
        >
          <source src={currentVideo.videoUrl} type="video/mp4" />
          Your browser does not support the video tag.
        </video>

        {/* Thumbnail Overlay */}
        {showThumbnail && (
          <div 
            className="absolute inset-0 bg-cover bg-center cursor-pointer"
            style={{ backgroundImage: `url(${currentVideo.thumbnailUrl})` }}
            onClick={handleVideoStart}
          >
            <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
              <div className="bg-white/20 backdrop-blur-sm rounded-full p-6 hover:bg-white/30 transition-all duration-300">
                <Play className="h-12 w-12 text-white ml-1" />
              </div>
            </div>
          </div>
        )}

        {/* Video Info Overlay */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
          <div className="flex items-end justify-between">
            <div className="text-white">
              <h3 className="text-2xl font-bold mb-2">{currentVideo.title}</h3>
              <p className="text-white/80 text-sm max-w-md">{currentVideo.description}</p>
              <div className="flex items-center space-x-4 mt-3">
                <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-medium">
                  {currentVideo.category}
                </span>
                <span className="text-white/60 text-sm">
                  {formatTime(duration)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Controls */}
        <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
          <button
            onClick={prevVideo}
            className="bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-all duration-300"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
        </div>

        <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
          <button
            onClick={nextVideo}
            className="bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-all duration-300"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        </div>

        {/* Video Controls */}
        {showControls && (
          <div className="absolute bottom-4 right-4 flex space-x-2">
            <button
              onClick={handleMuteToggle}
              className="bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-all duration-300"
            >
              {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
            </button>
            <button
              onClick={handlePlayPause}
              className="bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-all duration-300"
            >
              {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
            </button>
          </div>
        )}
      </div>

      {/* Video Progress Bar */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20">
        <div 
          className="h-full bg-blue-500 transition-all duration-300"
          style={{ width: `${duration > 0 ? (currentTime / duration) * 100 : 0}%` }}
        />
      </div>

      {/* Video Thumbnails */}
      <div className="p-4 bg-gray-900">
        <div className="flex space-x-3 overflow-x-auto pb-2">
          {videoList.map((video, index) => (
            <button
              key={video.id}
              onClick={() => {
                setCurrentVideoIndex(index)
                setShowThumbnail(true)
                setIsPlaying(false)
              }}
              className={`flex-shrink-0 w-20 h-12 rounded-lg overflow-hidden transition-all duration-300 ${
                index === currentVideoIndex 
                  ? 'ring-2 ring-blue-500 scale-105' 
                  : 'opacity-70 hover:opacity-100'
              }`}
            >
              <img
                src={video.thumbnailUrl}
                alt={video.title}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
