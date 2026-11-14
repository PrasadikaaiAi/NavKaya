import { useEffect, useRef, useState } from 'react'
import Footer from '../components/Footer.jsx'

const mobileQuery = '(max-width: 767px), (hover: none) and (pointer: coarse)'
const videoFrameRate = 24
const videoEvents = ['loadedmetadata', 'loadeddata', 'canplay', 'seeked']
const scrollSmoothingMs = 32

const designs = [
  {
    slug: 'vanity',
    title: 'Vanity Unit',
    description: 'A thoughtfully composed vanity unit with floating storage, warm mirror lighting, refined surfaces, and a calm centrepiece that makes everyday routines feel elevated.',
    notes: [],
    image: '/assets/vanity-design.png',
  },
  {
    slug: 'commercial-washrooms',
    title: 'Commercial Washrooms',
    description: 'Durable, easy-maintenance washrooms planned for high traffic, clear circulation, bright mirrors, resilient finishes, and fixtures that keep public spaces polished.',
    notes: [],
    image: '/assets/commercial-toilet-1.png',
  },
  {
    slug: 'luxury-baths',
    title: 'Luxury Baths',
    description: 'A refined bath environment with layered lighting, rich stone textures, concealed storage, glass partitions, and premium fittings composed for a calm daily ritual.',
    notes: [],
    image: '/assets/luxury-baths-2.png',
  },
  {
    slug: 'modern-compact',
    title: 'Modern compact',
    description: 'Space-smart bathrooms using wall-hung fixtures, open shower zones, recessed niches, warm lighting, and clean proportions to make compact rooms feel generous.',
    notes: [],
    image: '/assets/modern-compact-bathroom.png',
  },
  {
    slug: 'powder-room',
    title: 'Powder Room',
    description: 'A compact guest-focused room with expressive lighting, elegant brass details, soft textures, and a memorable focal wall that feels considered from every angle.',
    notes: [],
    image: '/assets/powder-room.png',
  },
  {
    slug: 'senior-citizen-washrooms',
    title: 'Senior Citizen Washrooms',
    description: 'A thoughtfully designed senior citizen washroom that combines safety, comfort, and elegance. Featuring anti-slip flooring, sturdy grab bars, accessible fixtures, and spacious layouts, it ensures ease of movement, independence, and a secure bathing experience.',
    notes: [],
    image: '/assets/design-senior-citizen-washrooms.png',
  },
]

const whyReasons = [
  {
    title: 'One-Stop Bathroom Renovation Solutions',
    text: 'Complete renovation from concept to completion.',
  },
  {
    title: 'Transparency at Every Step',
    text: 'Clear quotations, stage-wise payments and hassle-free execution.',
  },
  {
    title: 'Quality You Can Trust',
    text: 'Premium brands, expert craftsmanship and lasting durability.',
  },
  {
    title: 'Luxury Meets Functionality',
    text: 'Thoughtfully designed bathrooms for everyday comfort.',
  },
]

const getDesignOffset = (index, activeIndex) => {
  const rawOffset = index - activeIndex
  const halfLength = designs.length / 2

  if (rawOffset > halfLength) return rawOffset - designs.length
  if (rawOffset < -halfLength) return rawOffset + designs.length
  return rawOffset
}

const renderDesignDescription = (item) => {
  if (!item.descriptionHighlight) return item.description

  const [beforeHighlight, afterHighlight] = item.description.split(item.descriptionHighlight)

  return (
    <>
      {beforeHighlight}
      <strong>{item.descriptionHighlight}</strong>
      {afterHighlight}
    </>
  )
}

function HomeScrollBackground({ pageRef }) {
  const videoRef = useRef(null)

  useEffect(() => {
    const video = videoRef.current
    const page = pageRef.current
    if (!video || !page) return undefined

    const mobile = window.matchMedia(mobileQuery)
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    let scrollableDistance = 0
    let displayedScroll = null
    let previousFrameTime
    let animationFrameId = 0
    let priming = false
    let disposed = false

    const update = (frameTime) => {
      animationFrameId = 0
      if (document.hidden) return

      const scrollY = window.scrollY
      if (!scrollableDistance) {
        const pageBottom = scrollY + page.getBoundingClientRect().top + page.offsetHeight
        scrollableDistance = Math.max(pageBottom - window.innerHeight, 1)
      }

      const reduceMotion = motionQuery.matches
      const targetScroll = reduceMotion
        ? 0
        : Math.min(Math.max(scrollY, 0), scrollableDistance)
      if (displayedScroll === null || reduceMotion) displayedScroll = targetScroll

      // Use elapsed time so the motion feels the same at different refresh rates.
      const elapsed = previousFrameTime === undefined ? 16 : frameTime - previousFrameTime
      const remaining = targetScroll - displayedScroll
      displayedScroll = Math.abs(remaining) <= 0.5
        ? targetScroll
        : displayedScroll + remaining * -Math.expm1(-elapsed / scrollSmoothingMs)
      previousFrameTime = displayedScroll === targetScroll ? undefined : frameTime
      if (previousFrameTime !== undefined) requestUpdate()

      const progress = Math.min(displayedScroll / scrollableDistance, 1)
      video.style.setProperty('--video-y', `${-70 * progress}px`)
      video.style.setProperty('--video-scale', 1.04 + progress * 0.035)

      if (priming || video.seeking || video.readyState < video.HAVE_CURRENT_DATA) return
      if (!Number.isFinite(video.duration) || video.duration <= 0) return

      const targetTime = progress * Math.max(video.duration - 1 / videoFrameRate, 0)
      const seekThreshold = targetTime === 0 ? 0 : 0.5 / videoFrameRate
      if (Math.abs(video.currentTime - targetTime) > seekThreshold) {
        video.currentTime = targetTime
      }
    }

    const requestUpdate = () => {
      if (!animationFrameId) animationFrameId = window.requestAnimationFrame(update)
    }

    const measureOnNextFrame = () => {
      scrollableDistance = 0
      requestUpdate()
    }

    const primeVideo = () => {
      if (!mobile.matches || motionQuery.matches || document.hidden || priming) return
      if (video.error || video.readyState >= video.HAVE_CURRENT_DATA) return

      // Some mobile browsers need a playback request before decoding the first frame.
      priming = true
      video.play().then(() => {
        if (!disposed) video.pause()
      }).catch(() => {
        // The first touch can retry if the browser blocks this initial request.
      }).finally(() => {
        priming = false
        if (!disposed) requestUpdate()
      })
    }

    const refresh = () => {
      primeVideo()
      measureOnNextFrame()
    }

    const layoutObserver = new ResizeObserver(measureOnNextFrame)
    layoutObserver.observe(page)
    layoutObserver.observe(document.body)
    videoEvents.forEach((event) => video.addEventListener(event, requestUpdate))
    motionQuery.addEventListener('change', refresh)
    document.addEventListener('visibilitychange', refresh)
    window.addEventListener('scroll', requestUpdate, { passive: true })
    window.addEventListener('resize', measureOnNextFrame)
    window.addEventListener('touchend', primeVideo, { passive: true })
    refresh()

    return () => {
      disposed = true
      if (animationFrameId) window.cancelAnimationFrame(animationFrameId)
      layoutObserver.disconnect()
      video.pause()
      videoEvents.forEach((event) => video.removeEventListener(event, requestUpdate))
      motionQuery.removeEventListener('change', refresh)
      document.removeEventListener('visibilitychange', refresh)
      window.removeEventListener('scroll', requestUpdate)
      window.removeEventListener('resize', measureOnNextFrame)
      window.removeEventListener('touchend', primeVideo)
    }
  }, [pageRef])

  return (
    <video
      ref={videoRef}
      className="scroll-video"
      src="/assets/home-renovation.mp4"
      poster="/assets/home-renovation-poster.jpg"
      preload="auto"
      muted
      playsInline
      aria-label="NavKaya Baths home page bathroom showcase video"
    />
  )
}

export default function Home({ onNavigate }) {
  const homePageRef = useRef(null)
  const whySectionRef = useRef(null)
  const homeParagraphPhotoRef = useRef(null)
  const [activeDesignIndex, setActiveDesignIndex] = useState(0)
  const [isCarouselPaused, setIsCarouselPaused] = useState(false)
  const [isWhySectionVisible, setIsWhySectionVisible] = useState(false)
  const [visibleWhyReasons, setVisibleWhyReasons] = useState(() => new Set())
  const [isHomeParagraphPhotoVisible, setIsHomeParagraphPhotoVisible] = useState(false)

  const showPreviousDesign = () => {
    setActiveDesignIndex((currentIndex) =>
      currentIndex === 0 ? designs.length - 1 : currentIndex - 1,
    )
  }

  const showNextDesign = () => {
    setActiveDesignIndex((currentIndex) => (currentIndex + 1) % designs.length)
  }

  const openDesign = (slug) => {
    setIsCarouselPaused(false)
    onNavigate(`/design?design=${slug}`)
  }

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion || isCarouselPaused) return undefined

    const carouselInterval = window.setInterval(() => {
      setActiveDesignIndex((currentIndex) => (currentIndex + 1) % designs.length)
    }, 3000)

    return () => window.clearInterval(carouselInterval)
  }, [isCarouselPaused])

  useEffect(() => {
    const section = whySectionRef.current
    if (!section) return undefined

    const cards = Array.from(section.querySelectorAll('.why-reason-card'))

    if (!('IntersectionObserver' in window)) {
      setIsWhySectionVisible(true)
      setVisibleWhyReasons(new Set(cards.map((card) => card.dataset.reason)))
      return undefined
    }

    const sectionObserver = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsWhySectionVisible(true)
        }
      },
      {
        root: null,
        rootMargin: '0px 0px -18% 0px',
        threshold: 0.22,
      },
    )

    const cardObserver = new IntersectionObserver(
      (entries) => {
        setVisibleWhyReasons((currentReasons) => {
          const nextReasons = new Set(currentReasons)
          let hasChanged = false

          entries.forEach((entry) => {
            const reason = entry.target.dataset.reason

            if (entry.isIntersecting && reason && !nextReasons.has(reason)) {
              nextReasons.add(reason)
              hasChanged = true
              cardObserver.unobserve(entry.target)
            }
          })

          return hasChanged ? nextReasons : currentReasons
        })
      },
      {
        root: null,
        rootMargin: '0px 0px -14% 0px',
        threshold: 0.2,
      },
    )

    sectionObserver.observe(section)
    cards.forEach((card) => cardObserver.observe(card))

    return () => {
      sectionObserver.disconnect()
      cardObserver.disconnect()
    }
  }, [])

  useEffect(() => {
    const photo = homeParagraphPhotoRef.current
    if (!photo) return undefined

    if (!('IntersectionObserver' in window)) {
      setIsHomeParagraphPhotoVisible(true)
      return undefined
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsHomeParagraphPhotoVisible(true)
          observer.disconnect()
        }
      },
      {
        root: null,
        rootMargin: '0px 0px -18% 0px',
        threshold: 0.24,
      },
    )

    observer.observe(photo)

    return () => observer.disconnect()
  }, [])

  return (
    <div className="page home-page" ref={homePageRef}>
      <HomeScrollBackground pageRef={homePageRef} />

      <div className="home-content">
        <section className="hero">
          <div className="hero-copy">
            <p className="eyebrow hero-welcome">
              <span>Welcome to</span>
              <span className="hero-brand-line">
                NavKaya Baths
              </span>
            </p>
            <p>
              NavKaya Baths transforms compact washrooms, master suites, and guest
              bathrooms into calm, practical, high-finish spaces.
            </p>
          </div>
        </section>

        <section
          ref={whySectionRef}
          className={`section why-section${isWhySectionVisible ? ' is-visible' : ''}`}
          aria-labelledby="why-section-title"
        >
          <h2 className="why-section-title" id="why-section-title">Why clients choose us?</h2>
          <div className="why-heading">
            <h3>Durable <span>bathrooms</span> that still feel refined.</h3>
            <p>
              Every bathroom is planned for real routines: easy cleaning, reliable
              drainage, smart storage, warm lighting, and finishes that hold up after
              years of use.
            </p>
          </div>

          <div className="why-reasons" aria-label="Reasons to choose NavKaya Baths">
            {whyReasons.map((reason, index) => (
              <article
                key={reason.title}
                className={`why-reason-card${visibleWhyReasons.has(String(index)) ? ' is-visible' : ''}`}
                data-reason={String(index)}
              >
                <span className="why-check" aria-hidden="true">
                  <img src="/assets/why-choose-us-tick.png" alt="" width="44" height="44" />
                </span>
                <div>
                  <h3>{reason.title}</h3>
                  <p>{reason.text}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <div className="home-blue-section">
          <section className="section home-design-section">
            <div>
              <p className="eyebrow">Our Design</p>
              <h2>Thoughtfully composed bathrooms for graceful, everyday living.</h2>
            </div>
            <div
              className={`design-carousel${isCarouselPaused ? ' is-paused' : ''}`}
              aria-label="Bathroom design concepts"
            >
              <button
                className="carousel-arrow carousel-arrow-left"
                type="button"
                onClick={showPreviousDesign}
                aria-label="Show previous design"
              >
                <span aria-hidden="true" />
              </button>
              <div className="design-carousel-window">
                <div className="design-carousel-track" role="list">
                  {designs.map((item, index) => {
                    const offset = getDesignOffset(index, activeDesignIndex)
                    const position =
                      offset === 0
                        ? 'center'
                        : offset === -1
                          ? 'left'
                          : offset === 1
                            ? 'right'
                            : 'hidden'

                    return (
                      <article
                        className="design-carousel-card"
                        aria-label={`${item.title}: ${item.description}`}
                        aria-hidden={position === 'hidden'}
                        data-position={position}
                        key={item.title}
                        onClick={() => {
                          if (position === 'center') openDesign(item.slug)
                        }}
                        onKeyDown={(event) => {
                          if (position !== 'center') return
                          if (event.key !== 'Enter' && event.key !== ' ') return

                          event.preventDefault()
                          openDesign(item.slug)
                        }}
                        onMouseEnter={() => {
                          if (position === 'center') setIsCarouselPaused(true)
                        }}
                        onMouseLeave={() => setIsCarouselPaused(false)}
                        onFocus={() => setIsCarouselPaused(true)}
                        onBlur={() => setIsCarouselPaused(false)}
                        role="button"
                        style={{ '--design-offset': offset }}
                        tabIndex={position === 'center' ? 0 : -1}
                      >
                        <img
                          className="design-photo"
                          src={item.image}
                          alt={`${item.title} bathroom design`}
                          loading="eager"
                          decoding="async"
                        />
                        <div className="design-card-shade">
                          <h3>{item.title}</h3>
                          <div
                            className={`design-brief${item.notes.length === 0 ? ' design-brief-text-only' : ''}`}
                          >
                            <div>
                              <span>Design brief</span>
                              <p>{renderDesignDescription(item)}</p>
                            </div>
                            {item.notes.length > 0 && (
                              <ul className="design-brief-points">
                                {item.notes.map((note) => (
                                  <li key={note}>{note}</li>
                                ))}
                              </ul>
                            )}
                          </div>
                        </div>
                      </article>
                    )
                  })}
                </div>
              </div>
              <button
                className="carousel-arrow carousel-arrow-right"
                type="button"
                onClick={showNextDesign}
                aria-label="Show next design"
              >
                <span aria-hidden="true" />
              </button>
            </div>
          </section>

          <section className="section home-paragraph-section">
            <div className="home-paragraph-content">
              <div className="home-paragraph-copy">
                <div>
                  <h2>Start Your Dream Bathroom Transformation<br />with NavKaya Baths</h2>
                </div>
                <p>
                  Are you ready to finally transform your outdated or inefficient bathroom
                  into a beautiful, functional, and durable bathroom?
                </p>
                <p>
                  NavKaya Baths is your trusted partner specializing in high quality
                  bathroom remodelling across Jaipur.
                </p>
                <button type="button" onClick={() => onNavigate('/contact')}>
                  Book free consultation
                </button>
              </div>
              <img
                ref={homeParagraphPhotoRef}
                className={`home-paragraph-photo${isHomeParagraphPhotoVisible ? ' is-visible' : ''}`}
                src="/assets/navkaya-bath-composition.png"
                alt="Complete bathroom fittings and design materials"
                loading="eager"
                decoding="async"
              />
            </div>
          </section>
        </div>
      </div>
      <div>
        <Footer onNavigate={onNavigate} />
      </div>
    </div>
  )
}
