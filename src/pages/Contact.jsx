import { useRef, useState } from 'react'

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

export default function Contact() {
  const [status, setStatus] = useState('idle')
  const [error, setError] = useState('')
  const submission = useRef(null)
  const submitting = useRef(false)
  const isSubmitting = status === 'submitting'

  async function handleSubmit(event) {
    event.preventDefault()
    if (submitting.current) return

    const form = event.currentTarget
    const formData = new FormData(form)
    const lead = Object.fromEntries(
      ['name', 'phone', 'city', 'pinCode', 'details'].map((key) => [key, getFormValue(formData, key)]),
    )
    const fingerprint = JSON.stringify(lead)

    // Keep the same ID on retries if Google saved the row but the response was lost.
    if (submission.current?.fingerprint !== fingerprint) {
      submission.current = { fingerprint, requestId: crypto.randomUUID() }
    }

    submitting.current = true
    setStatus('submitting')
    setError('')

    try {
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...lead, requestId: submission.current.requestId }),
        signal: AbortSignal.timeout(30000),
      })
      const result = await response.json()

      if (!response.ok || result.success !== true) {
        throw new Error(result.error || 'We could not send your enquiry. Please try again.')
      }

      form.reset()
      submission.current = null
      setStatus('success')
    } catch {
      setStatus('error')
      setError('We could not confirm your enquiry. Your details are still here. Please try again, or call +91 78508 68117.')
    } finally {
      submitting.current = false
    }
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

        <form className="lead-form" onSubmit={handleSubmit} aria-busy={isSubmitting}>
          <label>
            Full name
            <input type="text" name="name" placeholder="Your name" autoComplete="name" maxLength={120} disabled={isSubmitting} required />
          </label>
          <label>
            Phone number
            <input type="tel" name="phone" placeholder="+91 98765 43210" autoComplete="tel" maxLength={30} pattern="[+0-9\s\(\)\-]{7,30}" title="Enter a valid phone number, including your country code if needed." disabled={isSubmitting} required />
          </label>
          <label>
            City
            <select name="city" defaultValue="Jaipur" autoComplete="address-level2" disabled={isSubmitting} required>
              <option value="Jaipur">Jaipur</option>
            </select>
          </label>
          <label>
            Pin Code
            <select name="pinCode" defaultValue="" autoComplete="postal-code" disabled={isSubmitting} required>
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
              maxLength={5000}
              disabled={isSubmitting}
              placeholder="Tell us about room size, location, preferred style, and timeline."
            />
          </label>
          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Sending enquiry…' : 'Send enquiry'}
          </button>
          {status === 'success' && (
            <p className="form-success" role="status">
              Thank you. Your enquiry has been received. The NavKaya Baths team will contact you shortly.
            </p>
          )}
          {error && <p className="form-error" role="alert">{error}</p>}
        </form>
      </section>
    </div>
  )
}
