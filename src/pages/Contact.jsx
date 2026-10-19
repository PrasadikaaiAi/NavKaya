import { useState } from 'react'

const whatsappNumber = '917850868117'
const contactEmail = 'info@navkayabaths.com'
const pinCodes = [
  '302001', '302002', '302003', '302004', '302005', '302006',
  '302011', '302012', '302013', '302015', '302016', '302017',
  '302018', '302019', '302020', '302021', '302022', '302023',
  '302024', '302025', '302026', '302027', '302028', '302029',
  '302031', '302033', '302034', '302039',
]

function getFormValue(formData, key) {
  return String(formData.get(key) || '').trim()
}

function buildLeadMessage(formData) {
  const name = getFormValue(formData, 'name')
  const phone = getFormValue(formData, 'phone')
  const city = getFormValue(formData, 'city')
  const pinCode = getFormValue(formData, 'pinCode')
  const details = getFormValue(formData, 'details')

  return [
    'Hi NavKaya Baths, I would like to book a bathroom consultation.',
    '',
    `Name: ${name}`,
    `Phone: ${phone}`,
    `City: ${city}`,
    `Pin Code: ${pinCode}`,
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
            City
            <select name="city" defaultValue="Jaipur" autoComplete="address-level2" required>
              <option value="Jaipur">Jaipur</option>
            </select>
          </label>
          <label>
            Pin Code
            <select name="pinCode" defaultValue="" autoComplete="postal-code" required>
              <option value="" disabled>Select Pin Code</option>
              {pinCodes.map((pinCode) => (
                <option key={pinCode} value={pinCode}>{pinCode}</option>
              ))}
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
          <button type="submit">Send enquiry</button>
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
