import { useEffect, useMemo, useState } from 'react'
import Navbar from './components/Navbar.jsx'
import Footer from './components/Footer.jsx'
import Home from './pages/Home.jsx'
import About from './pages/About.jsx'
import Design from './pages/Design.jsx'
import Contact from './pages/Contact.jsx'

const routes = {
  '/': Home,
  '/about': About,
  '/design': Design,
  '/contact': Contact,
}

function getPath() {
  return window.location.pathname in routes ? window.location.pathname : '/'
}

function resetScrollToTop() {
  const root = document.documentElement
  const previousScrollBehavior = root.style.scrollBehavior

  root.style.scrollBehavior = 'auto'
  window.scrollTo(0, 0)
  root.scrollTop = 0
  document.body.scrollTop = 0
  document.querySelectorAll('main, .app-shell, .page').forEach((element) => {
    element.scrollTop = 0
  })

  root.style.scrollBehavior = previousScrollBehavior
}

export default function App() {
  const [path, setPath] = useState(getPath)
  const [showSplash, setShowSplash] = useState(true)
  const [isFooterVisible, setIsFooterVisible] = useState(false)
  const [navigationTick, setNavigationTick] = useState(0)
  const Page = useMemo(() => routes[path] || Home, [path])

  useEffect(() => {
    const onPopState = () => setPath(getPath())
    window.addEventListener('popstate', onPopState)
    return () => window.removeEventListener('popstate', onPopState)
  }, [])

  useEffect(() => {
    document.body.classList.add('splash-lock')
    const splashTimer = window.setTimeout(() => {
      setShowSplash(false)
      document.body.classList.remove('splash-lock')
    }, 2200)

    return () => {
      window.clearTimeout(splashTimer)
      document.body.classList.remove('splash-lock')
    }
  }, [])

  useEffect(() => {
    const footer = document.querySelector('.site-footer')
    if (!footer) {
      setIsFooterVisible(false)
      return undefined
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsFooterVisible(entry.isIntersecting)
      },
      {
        root: null,
        rootMargin: '0px 0px -12% 0px',
        threshold: 0.04,
      },
    )

    observer.observe(footer)

    return () => observer.disconnect()
  }, [path])

  useEffect(() => {
    if (navigationTick === 0) return

    resetScrollToTop()

    const frameId = window.requestAnimationFrame(() => {
      resetScrollToTop()
    })

    return () => window.cancelAnimationFrame(frameId)
  }, [navigationTick])

  function navigate(nextPath) {
    const currentPath = `${window.location.pathname}${window.location.search}`

    resetScrollToTop()

    if (nextPath !== currentPath) {
      window.history.pushState({}, '', nextPath)
      setPath(getPath())
    }

    setNavigationTick((tick) => tick + 1)
  }

  const shellClass =
    path === '/'
      ? 'app-shell home-shell'
      : path === '/contact'
        ? 'app-shell inner-shell contact-shell'
        : path === '/design'
          ? 'app-shell inner-shell design-shell'
          : path === '/about'
            ? 'app-shell inner-shell about-shell'
            : 'app-shell inner-shell'

  return (
    <div className={shellClass}>
      {showSplash && (
        <div className="splash-screen" role="status" aria-label="Loading NavKaya Baths">
          <div className="splash-content">
            <img
              src="/assets/navkaya-logo-full.png"
              alt="NavKaya Baths"
              decoding="async"
              fetchPriority="high"
            />
          </div>
        </div>
      )}
      {path === '/contact' ? (
        <div className="contact-video-section">
          <video
            className="contact-shell-video"
            src="/assets/contact-page-video.mp4"
            autoPlay
            muted
            loop
            preload="metadata"
            playsInline
            aria-hidden="true"
          />
          <Navbar currentPath={path} onNavigate={navigate} />
          <main>
            <Page onNavigate={navigate} navigationTick={navigationTick} />
          </main>
        </div>
      ) : (
        <>
          <Navbar currentPath={path} onNavigate={navigate} />
          <main>
            <Page onNavigate={navigate} navigationTick={navigationTick} />
          </main>
        </>
      )}
      {path !== '/contact' && (
        <a
          className={`whatsapp-chat-button${isFooterVisible ? ' is-footer-docked' : ''}`}
          href="https://wa.me/917850868117?text=Hi%20NavKaya%20Baths%2C%20I%20would%20like%20to%20book%20a%20bathroom%20consultation."
          target="_blank"
          rel="noreferrer"
          aria-label="Chat with NavKaya Baths on WhatsApp"
        >
          <span className="whatsapp-chat-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24">
              <path d="M12.04 3.2a8.67 8.67 0 0 0-7.4 13.18L3.6 20.8l4.53-1.02a8.68 8.68 0 1 0 3.91-16.58Zm0 1.63a7.05 7.05 0 1 1-3.52 13.16l-.28-.16-2.42.55.56-2.35-.18-.3a7.05 7.05 0 0 1 5.84-10.9Zm-3.3 3.73c-.15 0-.4.05-.61.29-.21.24-.8.78-.8 1.91s.82 2.22.94 2.37c.11.16 1.58 2.54 3.93 3.46 1.95.77 2.35.62 2.78.58.42-.04 1.36-.55 1.55-1.09.19-.54.19-1 .13-1.09-.06-.1-.21-.16-.44-.28-.23-.12-1.36-.67-1.57-.74-.21-.08-.36-.12-.51.12-.15.23-.59.74-.72.89-.13.15-.27.17-.5.06-.23-.12-.96-.35-1.84-1.13-.68-.6-1.14-1.35-1.27-1.58-.13-.23-.01-.35.1-.47.1-.1.23-.27.35-.4.12-.14.15-.23.23-.39.08-.15.04-.29-.02-.4-.06-.12-.51-1.23-.7-1.68-.18-.44-.37-.38-.51-.39h-.44Z" />
            </svg>
          </span>
          <span className="whatsapp-chat-label">Chat with us</span>
        </a>
      )}
      {path !== '/' && <Footer onNavigate={navigate} />}
    </div>
  )
}
