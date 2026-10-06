import { useState } from 'react'

const whatsappNumber = '917850868117'
const contactEmail = 'info@navkayabaths.com'

function getFormValue(formData, key) {
  return String(formData.get(key) || '').trim()
}

function buildLeadMessage(formData) {
  const name = getFormValue(formData, 'name')
  const phone = getFormValue(formData, 'phone')
  const email = getFormValue(formData, 'email')
  const design = getFormValue(formData, 'design')
  const details = getFormValue(formData, 'details')

  return [
    'Hi NavKaya Baths, I would like to book a bathroom consultation.',
    '',
    `Name: ${name}`,
    `Phone: ${phone}`,
    email ? `Email: ${email}` : '',
    `Design: ${design}`,
    details ? `Project details: ${details}` : '',
  ]
    .filter(Boolean)
    .join('\n')
}

export default function Contact() {
  const [leadLinks, setLeadLinks] = useState(null)

  function handleSubmit(event) {
    event.preventDefault()

    const form = event.currentTarget
    const formData = new FormData(form)
    const message = buildLeadMessage(formData)
    const encodedMessage = encodeURIComponent(message)
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`
    const emailUrl = `mailto:${contactEmail}?subject=${encodeURIComponent('Bathroom consultation request')}&body=${encodedMessage}`
    const openedWindow = window.open(whatsappUrl, '_blank', 'noopener,noreferrer')

    if (openedWindow) {
      openedWindow.opener = null
    }

    setLeadLinks({ emailUrl, whatsappUrl })
    form.reset()
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
          <button type="submit">Send enquiry on WhatsApp</button>
          {leadLinks && (
            <p className="form-success">
              Thank you. Your enquiry is ready to send on WhatsApp. If it did not open,{' '}
              <a href={leadLinks.whatsappUrl} target="_blank" rel="noreferrer">
                open WhatsApp
              </a>{' '}
              or{' '}
              <a href={leadLinks.emailUrl}>
                send it by email
              </a>
              .
            </p>
          )}
        </form>
      </section>
    </div>
  )
}
