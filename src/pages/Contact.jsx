import { useState } from 'react'

export default function Contact() {
  const [submitted, setSubmitted] = useState(false)

  function handleSubmit(event) {
    event.preventDefault()
    setSubmitted(true)
    event.currentTarget.reset()
  }

  return (
    <div className="page inner-page contact-page">
      <section className="contact-layout">
        <div className="contact-copy">
          <h1>Tell us about the <span className="bathroom-accent">bathroom</span> you want to build.</h1>
          <p>
            Share your project details and the NavKaya Baths team will follow up for a
            consultation, measurement, and estimate.
          </p>
        </div>

        <form className="lead-form" onSubmit={handleSubmit}>
          <label>
            Full name
            <input type="text" name="name" placeholder="Your name" required />
          </label>
          <label>
            Phone number
            <input type="tel" name="phone" placeholder="+91 98765 43210" required />
          </label>
          <label>
            Email address
            <input type="email" name="email" placeholder="you@example.com" />
          </label>
          <label>
            Design
            <select name="design" defaultValue="luxury-baths">
              <option value="luxury-baths">Luxury Baths</option>
              <option value="commercial-washrooms">Commercial Washrooms</option>
              <option value="modern-compact">Modern Compact</option>
              <option value="powder-room">Powder Room</option>
              <option value="vanity">Vanity Unit</option>
            </select>
          </label>
          <label>
            Project details
            <textarea
              name="details"
              rows="5"
              placeholder="Tell us about room size, location, preferred style, and timeline."
            />
          </label>
          <button type="submit">Submit lead</button>
          {submitted && (
            <p className="form-success">
              Thank you. NavKaya Baths will contact you shortly.
            </p>
          )}
        </form>
      </section>
    </div>
  )
}
