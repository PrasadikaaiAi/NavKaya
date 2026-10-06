const exploreItems = [
  { label: 'Home', path: '/' },
  { label: 'About Us', path: '/about' },
  { label: 'Design', path: '/design' },
  { label: 'Contact Us', path: '/contact' },
]

export default function Footer({ onNavigate }) {
  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <div className="footer-hero">
          <div>
            <h2>Connect with us</h2>
          </div>

          <div className="footer-actions" aria-label="Footer actions">
            <span>Follow us</span>
            <a
              className="social-link social-link-linkedin"
              href="https://www.linkedin.com/company/navkaya-baths/"
              target="_blank"
              rel="noreferrer"
              aria-label="Follow NavKaya Baths on LinkedIn"
            >
              <svg aria-hidden="true" viewBox="0 0 24 24">
                <rect className="social-brand-bg" x="2.75" y="2.75" width="18.5" height="18.5" rx="3.25" />
                <path className="social-brand-mark" d="M6.94 8.98H3.72v10.35h3.22V8.98ZM5.34 4.67a1.86 1.86 0 1 0 0 3.72 1.86 1.86 0 0 0 0-3.72Zm13.9 8.73c0-3.12-1.66-4.57-3.88-4.57a3.34 3.34 0 0 0-3.02 1.66h-.05V8.98H9.2v10.35h3.22v-5.12c0-1.35.25-2.66 1.93-2.66 1.65 0 1.67 1.55 1.67 2.75v5.03h3.22V13.4Z" />
              </svg>
            </a>
            <a
              className="social-link social-link-instagram"
              href="https://www.instagram.com/navkaya.baths?utm_source=qr"
              target="_blank"
              rel="noreferrer"
              aria-label="Follow NavKaya Baths on Instagram"
            >
              <svg aria-hidden="true" viewBox="0 0 24 24">
                <defs>
                  <radialGradient id="instagramIconGradient" cx="30%" cy="105%" r="120%">
                    <stop offset="0%" stopColor="#feda75" />
                    <stop offset="28%" stopColor="#fa7e1e" />
                    <stop offset="52%" stopColor="#d62976" />
                    <stop offset="76%" stopColor="#962fbf" />
                    <stop offset="100%" stopColor="#4f5bd5" />
                  </radialGradient>
                </defs>
                <rect
                  className="social-brand-bg"
                  x="2.75"
                  y="2.75"
                  width="18.5"
                  height="18.5"
                  rx="5.1"
                />
                <path className="social-brand-mark" d="M7.55 2.75h8.9a4.8 4.8 0 0 1 4.8 4.8v8.9a4.8 4.8 0 0 1-4.8 4.8h-8.9a4.8 4.8 0 0 1-4.8-4.8v-8.9a4.8 4.8 0 0 1 4.8-4.8Zm0 1.85a2.95 2.95 0 0 0-2.95 2.95v8.9a2.95 2.95 0 0 0 2.95 2.95h8.9a2.95 2.95 0 0 0 2.95-2.95v-8.9a2.95 2.95 0 0 0-2.95-2.95h-8.9Zm4.45 3.05a4.35 4.35 0 1 1 0 8.7 4.35 4.35 0 0 1 0-8.7Zm0 1.85a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5Zm4.58-2.48a1.04 1.04 0 1 1 0 2.08 1.04 1.04 0 0 1 0-2.08Z" />
              </svg>
            </a>
            <a
              className="social-link social-link-facebook"
              href="https://www.facebook.com/share/1ezvfCoXFR/?mibextid=wwXIfr"
              target="_blank"
              rel="noreferrer"
              aria-label="Follow NavKaya Baths on Facebook"
            >
              <svg aria-hidden="true" viewBox="0 0 24 24">
                <circle className="social-brand-bg" cx="12" cy="12" r="9.25" />
                <path className="social-brand-mark" d="M14.02 9.35h2.66l-.42 3.07h-2.24v6.91h-3.26v-6.91H8.58V9.35h2.18V7.47c0-2.64 1.57-4.1 3.98-4.1 1.15 0 2.35.2 2.35.2v2.59h-1.32c-1.3 0-1.75.81-1.75 1.64v1.55Z" />
              </svg>
            </a>
            <a
              className="social-link social-link-whatsapp"
              href="https://wa.me/917850868117?text=Hi%20NavKaya%20Baths%2C%20I%20would%20like%20to%20book%20a%20bathroom%20consultation."
              target="_blank"
              rel="noreferrer"
              aria-label="Chat with NavKaya Baths on WhatsApp"
            >
              <svg aria-hidden="true" viewBox="0 0 24 24">
                <circle className="social-brand-bg" cx="12" cy="12" r="9.25" />
                <path className="social-brand-mark" d="M12.04 3.2a8.67 8.67 0 0 0-7.4 13.18L3.6 20.8l4.53-1.02a8.68 8.68 0 1 0 3.91-16.58Zm0 1.63a7.05 7.05 0 1 1-3.52 13.16l-.28-.16-2.42.55.56-2.35-.18-.3a7.05 7.05 0 0 1 5.84-10.9Zm-3.3 3.73c-.15 0-.4.05-.61.29-.21.24-.8.78-.8 1.91s.82 2.22.94 2.37c.11.16 1.58 2.54 3.93 3.46 1.95.77 2.35.62 2.78.58.42-.04 1.36-.55 1.55-1.09.19-.54.19-1 .13-1.09-.06-.1-.21-.16-.44-.28-.23-.12-1.36-.67-1.57-.74-.21-.08-.36-.12-.51.12-.15.23-.59.74-.72.89-.13.15-.27.17-.5.06-.23-.12-.96-.35-1.84-1.13-.68-.6-1.14-1.35-1.27-1.58-.13-.23-.01-.35.1-.47.1-.1.23-.27.35-.4.12-.14.15-.23.23-.39.08-.15.04-.29-.02-.4-.06-.12-.51-1.23-.7-1.68-.18-.44-.37-.38-.51-.39h-.44Z" />
              </svg>
            </a>
          </div>
        </div>

        <div className="footer-studio-layout">
          <div className="footer-contact-stack">
            <a className="footer-contact-card" href="mailto:info@navkayabaths.com">
              <span className="footer-card-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24">
                  <path d="M4 6.5h16v11H4z" />
                  <path d="m4.75 7.25 7.25 5.5 7.25-5.5" />
                  <path d="m4.75 17.25 5.2-5" />
                  <path d="m19.25 17.25-5.2-5" />
                </svg>
              </span>
              <span>
                <strong>Email Us</strong>
                <span className="footer-email-address">info@navkayabaths.com</span>
              </span>
            </a>

            <a className="footer-contact-card" href="tel:+917850868117">
              <span className="footer-card-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24">
                  <path d="M8.2 4.5 6.1 6.6c-.8.8-.8 2-.2 3.2 1.9 3.8 4.9 6.8 8.3 8.3 1.2.5 2.4.5 3.2-.3l2.1-2.1-3.1-3.1-2 1.4c-.4.3-.9.3-1.3 0-1.3-.8-2.3-1.8-3.1-3.1-.3-.4-.2-.9 0-1.3l1.4-2-3.2-3.1z" />
                </svg>
              </span>
              <span>
                <strong>Call Us</strong>
                +91-7850868117
              </span>
            </a>

            <div className="footer-contact-card footer-visit-card">
              <span className="footer-card-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24">
                  <path d="M12 21s6-5.2 6-10.4A6 6 0 0 0 6 10.6C6 15.8 12 21 12 21z" />
                  <path d="M12 13.2a2.4 2.4 0 1 0 0-4.8 2.4 2.4 0 0 0 0 4.8z" />
                </svg>
              </span>
              <span>
                <strong>Visit Us</strong>
                Jagatpura, Jaipur, Rajasthan
              </span>
            </div>
          </div>

          <nav className="footer-explore" aria-label="Footer navigation">
            <span>Explore</span>
            <div>
              {exploreItems.map((item) => (
                <button
                  key={item.path}
                  type="button"
                  onClick={() => onNavigate(item.path)}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </nav>

          <div className="footer-blueprint-panel">
            <img
              src="/assets/footer-bathroom-blueprint.png"
              alt="Bathroom design blueprint"
              loading="lazy"
              decoding="async"
            />
          </div>
        </div>

        <div className="footer-bottom">
          <p>© 2026 NavKaya Baths. All rights reserved.</p>
          <a className="footer-credit" href="https://www.prasadikaai.com/">
            <img
              src="/assets/prasadika-ai-logo.png"
              alt=""
              aria-hidden="true"
              loading="lazy"
              decoding="async"
            />
            Developed by Prasadika AI
          </a>
        </div>
      </div>
    </footer>
  )
}
