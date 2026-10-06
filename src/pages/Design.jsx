import { useEffect, useRef, useState } from 'react'

const luxuryBathMorePhotos = [
  {
    src: '/assets/luxury-bath-vanity-detail-large.png',
    alt: 'Luxury bath vanity detail with basin, mirror, plants, and warm lighting',
  },
  {
    src: '/assets/luxury-bath-shower-detail-large.png',
    alt: 'Luxury bath shower detail with rainfall shower, grey stone tile, and recessed shelving',
  },
  {
    src: '/assets/luxury-bath-reverse-view-large.png',
    alt: 'Luxury bath reverse view with wall-hung toilet, shower glass, window, and vanity',
  },
]

const commercialWashroomMorePhotos = [
  {
    src: '/assets/commercial-washroom-vanity-angle-large.png',
    alt: 'Commercial washroom vanity angle with long counter, mirrors, warm lighting, and urinals',
  },
  {
    src: '/assets/commercial-washroom-urinal-wall-view-large.png',
    alt: 'Commercial washroom urinal wall view with warm marble finishes and divider panels',
  },
  {
    src: '/assets/commercial-washroom-stall-corridor-view-large.png',
    alt: 'Commercial washroom stall corridor with vanity counter and warm lighting',
  },
]

const modernCompactMorePhotos = [
  {
    src: '/assets/modern-compact-vanity-detail.png',
    alt: 'Modern compact bathroom vanity detail with warm lighting, recessed shelf, and wall-hung basin',
  },
  {
    src: '/assets/modern-compact-shower-detail.png',
    alt: 'Modern compact bathroom shower detail with glass partition, window, and recessed shelf',
  },
  {
    src: '/assets/modern-compact-reverse-view.png',
    alt: 'Modern compact bathroom reverse view with wall-hung toilet, shower fixtures, and wood door',
  },
]

const powderRoomMorePhotos = [
  {
    src: '/assets/powder-room-vanity-closeup.jpg',
    alt: 'Powder room vanity closeup with round mirror, pendant lights, brass fittings, and wall-hung basin',
  },
  {
    src: '/assets/powder-room-toilet-closeup.jpg',
    alt: 'Powder room toilet closeup with green wall tile, warm shelf lighting, and brass details',
  },
  {
    src: '/assets/powder-room-angled-full-view.jpg',
    alt: 'Powder room angled full view with compact vanity, wall-hung toilet, mirror, and warm lighting',
  },
]

const vanityMorePhotos = [
  {
    src: '/assets/vanity-round-mirror-detail.png',
    alt: 'Vanity unit design with round illuminated mirror, wood shelves, pendant lights, and basin counter',
  },
  {
    src: '/assets/vanity-partition-mirror-detail.png',
    alt: 'Vanity unit design with oval mirror, fluted glass partition, warm pendant light, and floating cabinet',
  },
  {
    src: '/assets/vanity-black-cabinet-detail.png',
    alt: 'Vanity unit design with black ribbed cabinet, oval mirror, gold accents, and warm backlighting',
  },
]

const designs = [
  {
    slug: 'luxury-baths',
    title: 'Luxury Baths',
    video: '/assets/design-luxury-baths-video.mp4',
    image: '/assets/design-luxury-baths.png',
    morePhotos: luxuryBathMorePhotos,
    description:
      'A modern luxury bathroom with warm stone textures and natural wood finishes. Soft ambient lighting creates a calm and relaxing atmosphere. The glass shower and matte-black fixtures add a contemporary touch. Smart storage and greenery complete the elegant, spa-like design.',
  },
  {
    slug: 'commercial-washrooms',
    title: 'Commercial Washrooms',
    video: '/assets/design-commercial-washrooms-video.mp4',
    image: '/assets/design-commercial-washrooms.png',
    morePhotos: commercialWashroomMorePhotos,
    description:
      'A refined commercial washroom designed with elegance, durability, and everyday functionality in mind. Spacious vanity areas and well-planned fixtures ensure comfort even during high-traffic hours. Warm lighting and premium finishes create a clean, welcoming, and sophisticated atmosphere. Easy-to-maintain surfaces make the space practical for offices, hotels, restaurants, and other commercial environments.',
  },
  {
    slug: 'modern-compact',
    title: 'Modern Compact',
    video: '/assets/design-modern-compact-video.mp4',
    image: '/assets/design-modern-compact-2.png',
    morePhotos: modernCompactMorePhotos,
    description:
      'Modern compact bathrooms combine smart design with efficient use of space. Clean lines and minimal fixtures create an open, clutter-free look. Warm lighting and contemporary finishes add comfort and elegance. Clever storage and practical layouts provide maximum functionality without compromising style.',
  },
  {
    slug: 'powder-room',
    title: 'Powder Room',
    video: '/assets/design-powder-room-video.mp4',
    image: '/assets/design-powder-room-showcase.png',
    morePhotos: powderRoomMorePhotos,
    description:
      'A powder room is a compact yet stylish space designed primarily for guests. Elegant finishes and thoughtful lighting create a welcoming, sophisticated atmosphere. Smart layouts maximize comfort and functionality within a smaller footprint. Designer fixtures and refined details give the space a distinctive, luxurious character.',
  },
  {
    slug: 'vanity',
    title: 'Vanity Unit',
    video: '/assets/design-vanity-video.mp4',
    image: '/assets/design-vanity-showcase.png',
    morePhotos: vanityMorePhotos,
    description:
      'A thoughtfully designed vanity unit that combines style, storage, and everyday functionality. The floating design creates a clean, spacious look while keeping essentials organised. Elegant lighting and a statement mirror add warmth and character. A refined centrepiece designed to elevate the overall bathroom experience.',
  },
]

const clamp = (value, min, max) => Math.min(Math.max(value, min), max)
const ease = (value) => value * value * (3 - 2 * value)
const easeInOutCubic = (value) =>
  value < 0.5 ? 4 * value * value * value : 1 - Math.pow(-2 * value + 2, 3) / 2
const visibleMorePhotoCount = 2

const prefersReducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

function smoothScrollToTop(targetTop, duration = 820) {
  const startTop = window.scrollY
  const distance = targetTop - startTop

  if (prefersReducedMotion() || Math.abs(distance) < 1) {
    window.scrollTo(0, targetTop)
    return () => {}
  }

  let frameId = 0
  let cancelled = false
  const startedAt = window.performance.now()

  const step = (time) => {
    if (cancelled) return

    const progress = clamp((time - startedAt) / duration, 0, 1)
    window.scrollTo(0, startTop + distance * easeInOutCubic(progress))

    if (progress < 1) {
      frameId = window.requestAnimationFrame(step)
    }
  }

  frameId = window.requestAnimationFrame(step)

  return () => {
    cancelled = true
    window.cancelAnimationFrame(frameId)
  }
}

const getDesignGallery = (item) => [
  {
    src: item.image,
    alt: `${item.title} bathroom design`,
  },
  ...(item.morePhotos || []),
]

const getRequestedDesignIndex = () => {
  const requestedSlug = new URLSearchParams(window.location.search).get('design')
  if (!requestedSlug) return -1

  return designs.findIndex((item) => item.slug === requestedSlug)
}

export default function Design({ onNavigate, navigationTick = 0 }) {
  const sectionRef = useRef(null)
  const videoRefs = useRef([])
  const settleTimerRef = useRef(0)
  const settleScrollCancelRef = useRef(null)
  const [scrollProgress, setScrollProgress] = useState(0)
  const [lightbox, setLightbox] = useState(null)
  const activeIndex = Math.round(scrollProgress)

  const openLightbox = (item, photoIndex) => {
    setLightbox({
      title: item.title,
      photos: getDesignGallery(item),
      index: photoIndex,
    })
  }

  const shiftLightbox = (direction) => {
    setLightbox((current) => {
      if (!current) return current

      const nextIndex = (current.index + direction + current.photos.length) % current.photos.length
      return { ...current, index: nextIndex }
    })
  }

  useEffect(() => {
    const requestedIndex = getRequestedDesignIndex()
    if (requestedIndex < 0) return undefined

    let frameId = 0
    let timeoutId = 0
    let cancelScroll = () => {}

    const scrollToRequestedDesign = () => {
      const section = sectionRef.current
      if (!section) return

      const rect = section.getBoundingClientRect()
      const sectionTop = window.scrollY + rect.top
      const scrollableDistance = Math.max(section.offsetHeight - window.innerHeight, 1)
      const targetTop = sectionTop + scrollableDistance * (requestedIndex / (designs.length - 1))

      setScrollProgress(requestedIndex)
      cancelScroll = smoothScrollToTop(targetTop, 900)
    }

    frameId = window.requestAnimationFrame(() => {
      timeoutId = window.setTimeout(scrollToRequestedDesign, 120)
    })

    return () => {
      window.cancelAnimationFrame(frameId)
      window.clearTimeout(timeoutId)
      cancelScroll()
    }
  }, [navigationTick])

  useEffect(() => {
    let progressFrameId = 0
    let currentProgress = 0
    let targetProgress = 0

    function measureProgress() {
      const section = sectionRef.current
      if (!section) return

      const rect = section.getBoundingClientRect()
      const scrollableDistance = Math.max(section.offsetHeight - window.innerHeight, 1)
      targetProgress = clamp((-rect.top / scrollableDistance) * (designs.length - 1), 0, designs.length - 1)

      if (!progressFrameId) {
        progressFrameId = window.requestAnimationFrame(animateProgress)
      }
    }

    function animateProgress() {
      currentProgress += (targetProgress - currentProgress) * 0.36

      if (Math.abs(targetProgress - currentProgress) < 0.002) {
        currentProgress = targetProgress
      }

      setScrollProgress(currentProgress)

      if (currentProgress !== targetProgress) {
        progressFrameId = window.requestAnimationFrame(animateProgress)
      } else {
        progressFrameId = 0
      }
    }

    measureProgress()
    window.addEventListener('scroll', measureProgress, { passive: true })
    window.addEventListener('resize', measureProgress)

    return () => {
      window.cancelAnimationFrame(progressFrameId)
      window.removeEventListener('scroll', measureProgress)
      window.removeEventListener('resize', measureProgress)
    }
  }, [])

  useEffect(() => {
    videoRefs.current.forEach((video, index) => {
      if (!video) return

      const shouldRun = index === activeIndex

      if (shouldRun) {
        const playPromise = video.play()
        if (playPromise) playPromise.catch(() => {})
      } else {
        video.pause()
      }
    })
  }, [activeIndex])

  useEffect(() => {
    function cancelSettleScroll() {
      if (!settleScrollCancelRef.current) return

      settleScrollCancelRef.current()
      settleScrollCancelRef.current = null
    }

    function getShowcaseMetrics() {
      const section = sectionRef.current
      if (!section) return null

      const rect = section.getBoundingClientRect()
      const top = window.scrollY + rect.top
      const scrollableDistance = Math.max(section.offsetHeight - window.innerHeight, 1)
      const bottom = top + scrollableDistance

      return { bottom, scrollableDistance, top }
    }

    function isInsideShowcase(metrics) {
      if (!metrics) return false

      return window.scrollY >= metrics.top - 2 && window.scrollY <= metrics.bottom + 2
    }

    function getTargetTop(index, metrics) {
      return metrics.top + metrics.scrollableDistance * (index / (designs.length - 1))
    }

    function handleScroll() {
      const metrics = getShowcaseMetrics()
      if (!isInsideShowcase(metrics)) return

      window.clearTimeout(settleTimerRef.current)
      settleTimerRef.current = window.setTimeout(() => {
        const latestMetrics = getShowcaseMetrics()
        if (!isInsideShowcase(latestMetrics)) return

        const progress = ((window.scrollY - latestMetrics.top) / latestMetrics.scrollableDistance) * (designs.length - 1)
        const nextIndex = clamp(Math.round(progress), 0, designs.length - 1)
        const targetTop = getTargetTop(nextIndex, latestMetrics)

        if (Math.abs(window.scrollY - targetTop) < 10) return

        cancelSettleScroll()
        settleScrollCancelRef.current = smoothScrollToTop(targetTop, 920)
      }, 320)
    }

    function handleUserScrollIntent() {
      window.clearTimeout(settleTimerRef.current)
      cancelSettleScroll()
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('wheel', handleUserScrollIntent, { passive: true })
    window.addEventListener('touchstart', handleUserScrollIntent, { passive: true })
    window.addEventListener('keydown', handleUserScrollIntent)

    return () => {
      window.clearTimeout(settleTimerRef.current)
      cancelSettleScroll()
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('wheel', handleUserScrollIntent)
      window.removeEventListener('touchstart', handleUserScrollIntent)
      window.removeEventListener('keydown', handleUserScrollIntent)
    }
  }, [])

  useEffect(() => {
    if (!lightbox) return undefined

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    function handleKeyDown(event) {
      if (event.key === 'Escape') {
        setLightbox(null)
      }

      if (event.key === 'ArrowLeft') {
        shiftLightbox(-1)
      }

      if (event.key === 'ArrowRight') {
        shiftLightbox(1)
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [lightbox])

  return (
    <div className="page inner-page design-page">
      <section className="page-heading design-page-heading">
        <p className="eyebrow">Design</p>
        <h1>Choose a direction, then make it personal.</h1>
        <p>
          NavKaya Baths creates bathroom concepts around room size, lifestyle,
          maintenance needs, material preference, and budget.
        </p>
        <p>
          Each direction below is built to show how the same essentials can feel
          completely different through layout, lighting, surfaces, fittings, and storage.
        </p>
        <div className="design-intro-details" aria-label="Design planning priorities">
          <article>
            <img
              src="/assets/design-room-first-detail.png"
              alt="Bathroom room planning with measurements and plumbing points"
              loading="lazy"
              decoding="async"
            />
            <h2>Room First</h2>
            <p>We study measurements, plumbing points, movement space, and daily use before choosing the design language.</p>
          </article>
          <article>
            <img
              src="/assets/design-material-mood-detail.png"
              alt="Bathroom material palette with tile, stone, glass, mirrors, lighting, and metal finishes"
              loading="lazy"
              decoding="async"
            />
            <h2>Material Mood</h2>
            <p>Tile scale, stone tone, glass, mirrors, lighting, and metal finishes shape the final feeling of the bathroom.</p>
          </article>
          <article>
            <img
              src="/assets/design-built-practical-detail.png"
              alt="Practical bathroom planning with cleaning, ventilation, storage, durability, and comfort"
              loading="lazy"
              decoding="async"
            />
            <h2>Built Practical</h2>
            <p>Every concept is balanced with cleaning, ventilation, storage, durability, and long-term comfort.</p>
          </article>
        </div>
      </section>

      <section
        className="design-showcase"
        ref={sectionRef}
        style={{ '--design-count': designs.length }}
        aria-label="NavKaya Baths design showcase"
      >
        <div className="design-showcase-sticky">
          {designs.map((item, index) => {
            const offset = index - scrollProgress
            const rawDistance = Math.abs(offset)
            const isActive = index === activeIndex
            const motionAmount = ease(clamp((rawDistance - 0.12) / 0.62, 0, 1))
            const layerOpacity = 1 - motionAmount
            const visibleMorePhotos = (item.morePhotos || []).slice(0, visibleMorePhotoCount)
            const hiddenMorePhotoCount = Math.max((item.morePhotos || []).length - visibleMorePhotoCount, 0)

            return (
              <article
                className="design-reel-panel"
                data-active={isActive ? 'true' : 'false'}
                key={item.title}
                aria-hidden={!isActive}
                style={{
                  '--panel-opacity': layerOpacity,
                  '--video-opacity': 0.42 + layerOpacity * 0.58,
                  '--video-scale': 1.01 + motionAmount * 0.024,
                  '--copy-shift': `${motionAmount * -38}px`,
                  '--photo-shift': `${motionAmount * 46}px`,
                  '--photo-scale': 1 + motionAmount * 0.016,
                }}
              >
                <video
                  className="design-reel-video"
                  ref={(node) => {
                    videoRefs.current[index] = node
                  }}
                  src={item.video}
                  muted
                  loop
                  preload={isActive ? 'auto' : 'metadata'}
                  playsInline
                  aria-hidden="true"
                />
                <div className="design-reel-overlay" />
                <div className="design-reel-content">
                  <div className="design-reel-copy">
                    <span>{String(index + 1).padStart(2, '0')}</span>
                    <h2>{item.title}</h2>
                    <p>{item.description}</p>
                    <button
                      type="button"
                      onClick={() => onNavigate('/contact')}
                      tabIndex={isActive ? 0 : -1}
                    >
                      Book Consultation
                    </button>
                  </div>
                  <div className="design-reel-media">
                    <figure className="design-reel-photo">
                      <button
                        className="design-photo-button"
                        type="button"
                        onClick={() => openLightbox(item, 0)}
                        tabIndex={isActive ? 0 : -1}
                        aria-label={`Open ${item.title} design photo`}
                      >
                        <img
                          src={item.image}
                          alt={`${item.title} bathroom design`}
                          loading={isActive ? 'eager' : 'lazy'}
                          decoding="async"
                        />
                      </button>
                    </figure>
                    {visibleMorePhotos.length > 0 && (
                      <div className="design-reel-more-photos" aria-label={`${item.title} more photos`}>
                        {visibleMorePhotos.map((photo, photoIndex) => (
                          <figure key={photo.src}>
                            <button
                              className="design-photo-button"
                              type="button"
                              onClick={() => openLightbox(item, photoIndex + 1)}
                              tabIndex={isActive ? 0 : -1}
                              aria-label={`Open ${photo.alt}`}
                            >
                              <img
                                src={photo.src}
                                alt={photo.alt}
                                loading={isActive ? 'eager' : 'lazy'}
                                decoding="async"
                              />
                              {photoIndex === visibleMorePhotoCount - 1 && hiddenMorePhotoCount > 0 && (
                                <span className="design-more-photo-count">+{hiddenMorePhotoCount}</span>
                              )}
                            </button>
                          </figure>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </article>
            )
          })}
        </div>
      </section>
      {lightbox && (
        <div className="design-lightbox" role="dialog" aria-modal="true" aria-label={`${lightbox.title} photo gallery`}>
          <button
            className="design-lightbox-close"
            type="button"
            onClick={() => setLightbox(null)}
            aria-label="Close photo gallery"
          >
            ×
          </button>
          <button
            className="design-lightbox-arrow design-lightbox-arrow-left"
            type="button"
            onClick={() => shiftLightbox(-1)}
            aria-label="Previous photo"
          >
            ‹
          </button>
          <figure className="design-lightbox-figure">
            <img
              src={lightbox.photos[lightbox.index].src}
              alt={lightbox.photos[lightbox.index].alt}
            />
            <figcaption>
              <span>{lightbox.title}</span>
              <span>{lightbox.index + 1} / {lightbox.photos.length}</span>
            </figcaption>
          </figure>
          <button
            className="design-lightbox-arrow design-lightbox-arrow-right"
            type="button"
            onClick={() => shiftLightbox(1)}
            aria-label="Next photo"
          >
            ›
          </button>
        </div>
      )}
    </div>
  )
}
