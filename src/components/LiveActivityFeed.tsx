import React, { useState, useEffect } from 'react'

interface ActivityItem {
  id: number
  action: string
  location: string
  product: string
  time: string
  emoji: string
}

export default function LiveActivityFeed() {
  const [activities, setActivities] = useState<ActivityItem[]>([
    {
      id: 1,
      action: 'just purchased',
      location: 'Tokyo, Japan',
      product: 'Matcha Kit Kat',
      time: '2 minutes ago',
      emoji: '🍵'
    },
    {
      id: 2,
      action: 'discovered',
      location: 'London, UK',
      product: 'Cadbury Flake',
      time: '5 minutes ago',
      emoji: '🍫'
    },
    {
      id: 3,
      action: 'bought',
      location: 'New York, USA',
      product: 'Toblerone',
      time: '8 minutes ago',
      emoji: '🏔️'
    }
  ])

  const [currentActivity, setCurrentActivity] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentActivity((prev) => (prev + 1) % activities.length)
    }, 3000)

    return () => clearInterval(interval)
  }, [activities.length])

  const addNewActivity = () => {
    const newActivities = [
      'Haribo Goldbears',
      'Lindt Excellence',
      'Ferrero Rocher',
      'Milka Oreo',
      'Toblerone Dark',
      'Cadbury Dairy Milk',
      'Kit Kat Green Tea',
      'Snickers Peanut Butter',
      'Twix Caramel',
      'Mars Bar'
    ]
    
    const newLocations = [
      'Paris, France',
      'Berlin, Germany',
      'Madrid, Spain',
      'Rome, Italy',
      'Amsterdam, Netherlands',
      'Vienna, Austria',
      'Zurich, Switzerland',
      'Stockholm, Sweden',
      'Copenhagen, Denmark',
      'Oslo, Norway'
    ]
    
    const newEmojis = ['🍭', '🍫', '🍪', '🍬', '🍩', '🧁', '🍰', '🍯', '🥜', '🌰']
    
    const randomProduct = newActivities[Math.floor(Math.random() * newActivities.length)]
    const randomLocation = newLocations[Math.floor(Math.random() * newLocations.length)]
    const randomEmoji = newEmojis[Math.floor(Math.random() * newEmojis.length)]
    const randomAction = ['purchased', 'discovered', 'bought', 'found'][Math.floor(Math.random() * 4)]

    const newActivity: ActivityItem = {
      id: Date.now(),
      action: randomAction,
      location: randomLocation,
      product: randomProduct,
      time: 'just now',
      emoji: randomEmoji
    }

    setActivities(prev => [newActivity, ...prev.slice(0, 2)])
  }

  useEffect(() => {
    const activityInterval = setInterval(addNewActivity, 8000)
    return () => clearInterval(activityInterval)
  }, [])

  return (
    <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-2xl p-4 mb-6 relative overflow-hidden">
      {/* Live indicator */}
      <div className="absolute top-3 right-3 flex items-center space-x-2">
        <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
        <span className="text-xs font-bold text-red-600">LIVE</span>
      </div>
      
      {/* Header */}
      <div className="flex items-center space-x-2 mb-3">
        <span className="text-lg">🔥</span>
        <h3 className="font-bold text-gray-800 text-sm">Live Activity</h3>
      </div>
      
      {/* Activity feed */}
      <div className="space-y-2">
        {activities.slice(0, 3).map((activity, index) => (
          <div 
            key={activity.id}
            className={`flex items-center space-x-2 text-xs transition-all duration-500 ${
              index === 0 ? 'opacity-100 scale-100' : 'opacity-70 scale-95'
            }`}
          >
            <span className="text-lg">{activity.emoji}</span>
            <span className="text-gray-700">
              <span className="font-semibold text-gray-900">{activity.location}</span>
              {' '}{activity.action}{' '}
              <span className="font-bold text-blue-600">{activity.product}</span>
            </span>
            <span className="text-gray-500 ml-auto">{activity.time}</span>
          </div>
        ))}
      </div>
      
      {/* Footer */}
      <div className="mt-3 pt-2 border-t border-green-200">
        <p className="text-xs text-gray-600 text-center">
          <span className="font-bold text-green-600">+{Math.floor(Math.random() * 50) + 20}</span> more explorers discovering treats today!
        </p>
      </div>
    </div>
  )
}
