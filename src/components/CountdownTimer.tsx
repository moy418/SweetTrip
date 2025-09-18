import React, { useState, useEffect } from 'react'

export default function CountdownTimer() {
  const [timeLeft, setTimeLeft] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0
  })

  useEffect(() => {
    // Set a random time between 2-6 hours for the sale
    const endTime = Date.now() + (Math.random() * 4 + 2) * 60 * 60 * 1000

    const timer = setInterval(() => {
      const now = Date.now()
      const difference = endTime - now

      if (difference > 0) {
        const hours = Math.floor(difference / (1000 * 60 * 60))
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60))
        const seconds = Math.floor((difference % (1000 * 60)) / 1000)

        setTimeLeft({ hours, minutes, seconds })
      } else {
        // Reset timer when it reaches zero
        const newEndTime = Date.now() + (Math.random() * 4 + 2) * 60 * 60 * 1000
        const hours = Math.floor((newEndTime - now) / (1000 * 60 * 60))
        const minutes = Math.floor(((newEndTime - now) % (1000 * 60 * 60)) / (1000 * 60))
        const seconds = Math.floor(((newEndTime - now) % (1000 * 60)) / 1000)
        
        setTimeLeft({ hours, minutes, seconds })
      }
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  return (
    <div className="bg-gradient-to-r from-red-500 to-pink-500 rounded-2xl p-4 text-white relative overflow-hidden">
      {/* Background animation */}
      <div className="absolute inset-0 bg-gradient-to-r from-red-400 to-pink-400 opacity-50 animate-pulse"></div>
      
      <div className="relative z-10 text-center">
        <div className="flex items-center justify-center space-x-2 mb-2">
          <span className="text-lg">⏰</span>
          <h3 className="font-bold text-lg">Flash Sale Ending Soon!</h3>
        </div>
        
        <div className="flex items-center justify-center space-x-4">
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 min-w-[60px]">
            <div className="text-2xl font-black">{timeLeft.hours.toString().padStart(2, '0')}</div>
            <div className="text-xs opacity-80">Hours</div>
          </div>
          
          <div className="text-2xl font-bold">:</div>
          
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 min-w-[60px]">
            <div className="text-2xl font-black">{timeLeft.minutes.toString().padStart(2, '0')}</div>
            <div className="text-xs opacity-80">Minutes</div>
          </div>
          
          <div className="text-2xl font-bold">:</div>
          
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 min-w-[60px]">
            <div className="text-2xl font-black">{timeLeft.seconds.toString().padStart(2, '0')}</div>
            <div className="text-xs opacity-80">Seconds</div>
          </div>
        </div>
        
        <p className="text-sm mt-3 opacity-90">
          <span className="font-bold">Free Gift</span> + Free Shipping on orders $60+
        </p>
      </div>
    </div>
  )
}
