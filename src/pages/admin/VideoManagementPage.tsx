import React from 'react'
import VideoManagementPanel from '../../components/VideoManagementPanel'
import { VideoItem } from '../../data/categoryVideos'

export default function VideoManagementPage() {
  const handleVideoUpdate = (videos: VideoItem[]) => {
    console.log('Videos updated:', videos)
    // Here you could save to localStorage or send to a backend
    localStorage.setItem('categoryVideos', JSON.stringify(videos))
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Video Management</h1>
          <p className="text-gray-600">
            Manage and upload videos for the category reel on the categories page.
          </p>
        </div>
        
        <VideoManagementPanel onVideoUpdate={handleVideoUpdate} />
      </div>
    </div>
  )
}
