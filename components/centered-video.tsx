import React from 'react'
import { VideoLogo } from './video-logo'

export function CenteredVideo() {
  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex justify-center">
          <div className="w-full max-w-3xl">
            <VideoLogo
              src="/sweet-trip-video-logo.mp4"
              poster="/sweet-trip-logo.png"
              size="large"
              className="rounded-lg shadow-2xl"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
