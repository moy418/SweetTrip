import React, { useState } from 'react'
import { Upload, Play, Edit, Trash2, Plus, Save, X } from 'lucide-react'
import { VideoItem, CATEGORY_VIDEOS, VIDEO_CATEGORIES, addVideo, updateVideo, removeVideo } from '../data/categoryVideos'

interface VideoManagementPanelProps {
  onVideoUpdate?: (videos: VideoItem[]) => void
}

export default function VideoManagementPanel({ onVideoUpdate }: VideoManagementPanelProps) {
  const [videos, setVideos] = useState<VideoItem[]>(CATEGORY_VIDEOS)
  const [isAdding, setIsAdding] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [newVideo, setNewVideo] = useState<Partial<VideoItem>>({
    title: '',
    description: '',
    videoUrl: '',
    thumbnailUrl: '',
    category: VIDEO_CATEGORIES.JAPANESE,
    duration: 30,
    featured: true
  })

  const handleAddVideo = () => {
    if (newVideo.title && newVideo.videoUrl) {
      const addedVideo = addVideo(newVideo as Omit<VideoItem, 'id'>)
      setVideos([...videos, addedVideo])
      setNewVideo({
        title: '',
        description: '',
        videoUrl: '',
        thumbnailUrl: '',
        category: VIDEO_CATEGORIES.JAPANESE,
        duration: 30,
        featured: true
      })
      setIsAdding(false)
      onVideoUpdate?.([...videos, addedVideo])
    }
  }

  const handleUpdateVideo = (id: string, updates: Partial<VideoItem>) => {
    const updatedVideo = updateVideo(id, updates)
    if (updatedVideo) {
      const updatedVideos = videos.map(video => 
        video.id === id ? updatedVideo : video
      )
      setVideos(updatedVideos)
      setEditingId(null)
      onVideoUpdate?.(updatedVideos)
    }
  }

  const handleDeleteVideo = (id: string) => {
    if (window.confirm('Are you sure you want to delete this video?')) {
      const success = removeVideo(id)
      if (success) {
        const updatedVideos = videos.filter(video => video.id !== id)
        setVideos(updatedVideos)
        onVideoUpdate?.(updatedVideos)
      }
    }
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold text-gray-900">Video Management</h2>
        <button
          onClick={() => setIsAdding(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
        >
          <Plus className="h-4 w-4" />
          <span>Add Video</span>
        </button>
      </div>

      {/* Upload Instructions */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <h3 className="font-semibold text-blue-900 mb-2">📁 Video Upload Instructions</h3>
        <div className="text-sm text-blue-800 space-y-1">
          <p><strong>Video Formats:</strong> MP4, WebM, MOV</p>
          <p><strong>Resolution:</strong> 1920x1080 (Full HD) recommended</p>
          <p><strong>Duration:</strong> 25-35 seconds ideal</p>
          <p><strong>File Size:</strong> Max 50MB</p>
          <p><strong>Thumbnails:</strong> JPG/PNG, 1920x1080 or 16:9 aspect ratio</p>
        </div>
        <div className="mt-3">
          <p className="text-sm text-blue-700">
            <strong>Directory Structure:</strong> Place videos in <code>/public/videos/</code> and thumbnails in <code>/public/images/</code>
          </p>
        </div>
      </div>

      {/* Add New Video Form */}
      {isAdding && (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-6">
          <h3 className="text-lg font-semibold mb-4">Add New Video</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
              <input
                type="text"
                value={newVideo.title}
                onChange={(e) => setNewVideo({...newVideo, title: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., Japanese Candy Collection"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select
                value={newVideo.category}
                onChange={(e) => setNewVideo({...newVideo, category: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {Object.values(VIDEO_CATEGORIES).map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                value={newVideo.description}
                onChange={(e) => setNewVideo({...newVideo, description: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={3}
                placeholder="Describe the video content and featured products..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Video URL</label>
              <input
                type="text"
                value={newVideo.videoUrl}
                onChange={(e) => setNewVideo({...newVideo, videoUrl: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="/videos/category-reel.mp4"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Thumbnail URL</label>
              <input
                type="text"
                value={newVideo.thumbnailUrl}
                onChange={(e) => setNewVideo({...newVideo, thumbnailUrl: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="/images/category-thumb.jpg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Duration (seconds)</label>
              <input
                type="number"
                value={newVideo.duration}
                onChange={(e) => setNewVideo({...newVideo, duration: parseInt(e.target.value)})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                min="10"
                max="120"
              />
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="featured"
                checked={newVideo.featured}
                onChange={(e) => setNewVideo({...newVideo, featured: e.target.checked})}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="featured" className="ml-2 text-sm text-gray-700">Featured Video</label>
            </div>
          </div>
          <div className="flex justify-end space-x-3 mt-4">
            <button
              onClick={() => setIsAdding(false)}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleAddVideo}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
            >
              <Save className="h-4 w-4" />
              <span>Save Video</span>
            </button>
          </div>
        </div>
      )}

      {/* Video List */}
      <div className="space-y-4">
        {videos.map((video) => (
          <div key={video.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
            <div className="flex items-start space-x-4">
              {/* Thumbnail */}
              <div className="flex-shrink-0">
                <div className="w-24 h-16 bg-gray-200 rounded-lg overflow-hidden">
                  {video.thumbnailUrl ? (
                    <img
                      src={video.thumbnailUrl}
                      alt={video.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      <Play className="h-6 w-6" />
                    </div>
                  )}
                </div>
              </div>

              {/* Video Info */}
              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{video.title}</h3>
                    <p className="text-sm text-gray-600 mt-1">{video.description}</p>
                    <div className="flex items-center space-x-4 mt-2">
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
                        {video.category}
                      </span>
                      <span className="text-sm text-gray-500">{video.duration}s</span>
                      {video.featured && (
                        <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-medium">
                          Featured
                        </span>
                      )}
                    </div>
                  </div>
                  
                  {/* Actions */}
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setEditingId(editingId === video.id ? null : video.id)}
                      className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteVideo(video.id)}
                      className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* Edit Form */}
                {editingId === video.id && (
                  <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                        <input
                          type="text"
                          defaultValue={video.title}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                        <select
                          defaultValue={video.category}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          {Object.values(VIDEO_CATEGORIES).map(category => (
                            <option key={category} value={category}>{category}</option>
                          ))}
                        </select>
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                        <textarea
                          defaultValue={video.description}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          rows={2}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Video URL</label>
                        <input
                          type="text"
                          defaultValue={video.videoUrl}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Thumbnail URL</label>
                        <input
                          type="text"
                          defaultValue={video.thumbnailUrl}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                    <div className="flex justify-end space-x-3 mt-4">
                      <button
                        onClick={() => setEditingId(null)}
                        className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                      >
                        Cancel
                      </button>
                      <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors">
                        Save Changes
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Upload Guide */}
      <div className="mt-8 bg-green-50 border border-green-200 rounded-lg p-4">
        <h3 className="font-semibold text-green-900 mb-2">🚀 Quick Start Guide</h3>
        <ol className="text-sm text-green-800 space-y-1 list-decimal list-inside">
          <li>Upload your video files to <code>/public/videos/</code> directory</li>
          <li>Upload thumbnail images to <code>/public/images/</code> directory</li>
          <li>Use the "Add Video" button above to add new videos</li>
          <li>Fill in all required fields (title, video URL, thumbnail URL)</li>
          <li>Save and your video will appear in the category reel immediately</li>
        </ol>
      </div>
    </div>
  )
}
