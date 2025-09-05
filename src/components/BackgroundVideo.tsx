import React from 'react'

type Props = {
  src?: string
  poster?: string
  className?: string
  loop?: boolean
  muted?: boolean
  autoPlay?: boolean
  playsInline?: boolean
  ariaLabel?: string
}

export default function BackgroundVideo({
  src = '/sweet-trip-video-logo.mp4',
  poster,
  className = '',
  loop = true,
  muted = true,
  autoPlay = true,
  playsInline = true,
  ariaLabel = 'Background animation'
}: Props) {
  // Video files placed in `public/` are served from the root path when built.
  // Example usage: <BackgroundVideo /> or <BackgroundVideo src="/anima.mp4" />
  return (
    <div className={`bg-video-wrapper absolute inset-0 overflow-hidden ${className}`} aria-hidden={ariaLabel ? 'false' : 'true'}>
      <video
        src={src}
        poster={poster}
        loop={loop}
        muted={muted}
        autoPlay={autoPlay}
        playsInline={playsInline}
        aria-label={ariaLabel}
        className="bg-video w-full h-full object-cover pointer-events-none"
      />
    </div>
  )
}
