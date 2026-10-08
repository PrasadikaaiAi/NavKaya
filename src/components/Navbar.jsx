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
    <>
      <button className="fixed-logo" type="button" onClick={() => handleNavigate('/')}>
        <img
          src="/assets/navkaya-logo-full.png"
          alt="NavKaya Baths logo"
          loading="eager"
          decoding="async"
          fetchPriority="high"
        />
      </button>

      <header className="site-header">
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
              key={item.path}
              type="button"
              onClick={() => handleNavigate(item.path)}
            >
              {item.label}
            </button>
          ))}
        </nav>
      </header>
    </>
  )
}
