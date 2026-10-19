import { useEffect, useState } from 'react'

const navItems = [
  { label: 'Home', path: '/' },
  { label: 'About Us', path: '/about' },
  { label: 'Design', path: '/design' },
  { label: 'Contact Us', path: '/contact' },
]

export default function Navbar({ currentPath, onNavigate }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  useEffect(() => {
    setIsMenuOpen(false)
  }, [currentPath])

  useEffect(() => {
    const desktopQuery = window.matchMedia('(min-width: 981px)')

    function closeForDesktop(event) {
      if (event.matches) {
        setIsMenuOpen(false)
      }
    }

    closeForDesktop(desktopQuery)
    desktopQuery.addEventListener('change', closeForDesktop)
    return () => desktopQuery.removeEventListener('change', closeForDesktop)
  }, [])

  useEffect(() => {
    if (!isMenuOpen) return undefined

    function closeOnEscape(event) {
      if (event.key === 'Escape') {
        setIsMenuOpen(false)
      }
    }

    window.addEventListener('keydown', closeOnEscape)
    return () => window.removeEventListener('keydown', closeOnEscape)
  }, [isMenuOpen])

  function handleNavigate(path) {
    setIsMenuOpen(false)
    onNavigate(path)
  }

  return (
    <header className="site-header">
      <div className="site-header-inner">
        <button className="site-logo" type="button" onClick={() => handleNavigate('/')}>
          <img
            src="/assets/navkaya-logo-full.png"
            alt="NavKaya Baths logo"
            loading="eager"
            decoding="async"
            fetchPriority="high"
          />
        </button>

        <div className="nav-panel">
          <button
            className="nav-menu-toggle"
            type="button"
            aria-label={isMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-controls="primary-navigation"
            aria-expanded={isMenuOpen}
            onClick={() => setIsMenuOpen((open) => !open)}
          >
            <span />
            <span />
            <span />
          </button>

          <nav
            id="primary-navigation"
            className={`nav-links${isMenuOpen ? ' open' : ''}`}
            aria-label="Primary navigation"
          >
            {navItems.map((item) => (
              <button
                className={currentPath === item.path ? 'active' : ''}
                aria-current={currentPath === item.path ? 'page' : undefined}
                key={item.path}
                type="button"
                onClick={() => handleNavigate(item.path)}
              >
                {item.label}
              </button>
            ))}
            <a
              className="nav-call"
              href="tel:+917850868117"
              aria-label="Call NavKaya Baths at +91-7850868117"
              onClick={() => setIsMenuOpen(false)}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M8.2 4.5 6.1 6.6c-.8.8-.8 2-.2 3.2 1.9 3.8 4.9 6.8 8.3 8.3 1.2.5 2.4.5 3.2-.3l2.1-2.1-3.1-3.1-2 1.4c-.4.3-.9.3-1.3 0-1.3-.8-2.3-1.8-3.1-3.1-.3-.4-.2-.9 0-1.3l1.4-2-3.2-3.1z" />
              </svg>
              <span>+91-7850868117</span>
            </a>
          </nav>
        </div>
      </div>
    </header>
  )
}
