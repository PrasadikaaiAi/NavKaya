import { useEffect, useRef, useState } from 'react'
import Footer from '../components/Footer.jsx'

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
]

const whyReasons = [
  {
    title: 'Everything Under One Roof',
    text: 'One team manages the complete renovation, from planning and design to construction, installation and final handover.',
  },
  {
    title: 'See It Before We Build It',
    text: 'Our 2D layouts and 3D visualisations give you greater clarity and confidence before execution begins.',
  },
  {
    title: 'Transparent from the Beginning',
    text: 'Clear quotations, defined scope and a structured payment process help keep your project transparent and predictable.',
  },
  {
    title: 'Designed Around Everyday Life',
    text: 'We optimise available space with careful attention to movement, storage, ventilation, cleaning and long-term comfort.',
  },
  {
    title: 'Quality Beyond the Finish',
    text: 'A beautiful bathroom is only as good as what lies beneath it. We focus on proper waterproofing, plumbing, quality materials and professional workmanship for lasting performance.',
  },
  {
    title: 'Professionally Managed',
    text: 'Every stage is planned and coordinated with a focus on quality, communication and completion according to the agreed project schedule, backed by our applicable workmanship warranty.',
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

export default function Home({ onNavigate }) {
  const videoRef = useRef(null)
  const whySectionRef = useRef(null)
  const footerBoundaryRef = useRef(null)
  const homeParagraphPhotoRef = useRef(null)
  const [activeDesignIndex, setActiveDesignIndex] = useState(0)
  const [isCarouselPaused, setIsCarouselPaused] = useState(false)
  const [isWhySectionVisible, setIsWhySectionVisible] = useState(false)
  const [visibleWhyReasons, setVisibleWhyReasons] = useState(() => new Set())
  const [isHomeParagraphPhotoVisible, setIsHomeParagraphPhotoVisible] = useState(false)
  const [isHomeVideoActive, setIsHomeVideoActive] = useState(true)

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
    }, 2600)

    return () => window.clearInterval(carouselInterval)
  }, [isCarouselPaused])

  useEffect(() => {
    const video = videoRef.current
    if (!video) return undefined

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) {
      video.currentTime = 0
      return undefined
    }

    let duration = 0
    let animationFrame = 0
    let currentTime = 0
    let lastSeekAt = 0
    let targetTime = 0
    const maxSeekRate = 1000 / 24

    const clamp = (value) => Math.min(Math.max(value, 0), 1)

    const updateTargetTime = () => {
      if (!duration || Number.isNaN(duration)) return
      const footerBoundary = footerBoundaryRef.current
      const videoEnd = footerBoundary
        ? window.scrollY + footerBoundary.getBoundingClientRect().top
        : document.documentElement.scrollHeight
      const maxVideoScroll = Math.max(videoEnd - window.innerHeight, 1)
      const progress = clamp(window.scrollY / maxVideoScroll)
      setIsHomeVideoActive((currentValue) => {
        const nextValue = window.scrollY < maxVideoScroll - 2
        return currentValue === nextValue ? currentValue : nextValue
      })
      targetTime = progress * duration
    }

    const scrubVideo = (timestamp = 0) => {
      if (duration && !Number.isNaN(duration)) {
        const timeGap = targetTime - currentTime
        currentTime = Math.abs(timeGap) > 1.1 ? targetTime : currentTime + timeGap * 0.18
        const nextTime = clamp(currentTime / duration) * duration

        if (
          !video.seeking &&
          timestamp - lastSeekAt >= maxSeekRate &&
          Math.abs(video.currentTime - nextTime) > 0.025
        ) {
          video.currentTime = nextTime
          lastSeekAt = timestamp
        }
      }

      animationFrame = window.requestAnimationFrame(scrubVideo)
    }

    const handleMetadataLoaded = () => {
      duration = video.duration
      updateTargetTime()
      currentTime = targetTime
      video.currentTime = targetTime
    }

    const handleScroll = () => {
      updateTargetTime()
    }

    if (video.readyState >= 1) {
      handleMetadataLoaded()
    }

    video.pause()
    animationFrame = window.requestAnimationFrame(scrubVideo)
    video.addEventListener('loadedmetadata', handleMetadataLoaded)
    window.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('resize', handleScroll)

    return () => {
      video.removeEventListener('loadedmetadata', handleMetadataLoaded)
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', handleScroll)
      window.cancelAnimationFrame(animationFrame)
    }
  }, [])

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
    <div className="page home-page">
      <video
        ref={videoRef}
        className={`scroll-video${isHomeVideoActive ? '' : ' is-stopped'}`}
        src="/assets/workers-building-luxury-bathroom-1080p.mp4"
        muted
        playsInline
        preload="auto"
        aria-label="NavKaya Baths home page bathroom showcase video"
      />

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
        >
          <div className="why-heading">
            <p className="eyebrow">Why clients choose us</p>
            <h2>Durable <span>bathrooms</span> that still feel refined.</h2>
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
                  <h2>Designed with care, built for everyday comfort.</h2>
                </div>
                <p>
                  At NavKaya Baths, every bathroom begins with the way you live. From
                  layout planning and material selection to fittings, lighting, storage,
                  and final execution, we shape each detail into a calm, durable, and
                  beautifully finished space made for everyday comfort.
                </p>
                <button type="button" onClick={() => onNavigate('/contact')}>
                  Book Consultation
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
      <div ref={footerBoundaryRef}>
        <Footer onNavigate={onNavigate} />
      </div>
    </div>
  )
}
