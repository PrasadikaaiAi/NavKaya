import { useEffect, useRef, useState } from 'react'

const approachSteps = [
  {
    number: '1',
    title: 'DEFINE',
    lead: 'Understand. Plan. Finalise.',
    image: '/assets/about-approach-define.png',
    imageAlt: 'Bathroom renovation definition stage with site inspection and measurements',
    paragraphs: [
      'We begin by understanding your requirements and evaluating your existing bathroom.',
      'Through an initial consultation and site visit, we study the space, discuss your expectations and establish a clear scope for the renovation. Based on this assessment, we prepare a detailed proposal and quotation before the project moves forward.',
    ],
  },
  {
    number: '2',
    title: 'DESIGN',
    lead: 'Visualise. Select. Approve.',
    image: '/assets/about-approach-design.png',
    imageAlt: 'Bathroom design stage with layouts, material selections, and visual planning',
    paragraphs: [
      'Once the project is booked, our team conducts detailed measurements and a technical evaluation of the space.',
      'We then create 2D layouts and 3D visualisations so you can understand the proposed layout, finishes and overall appearance before construction begins.',
      'Together, we finalise the design, tiles, sanitaryware, CP fittings, other products and the final project budget before moving into execution.',
    ],
  },
  {
    number: '3',
    title: 'DELIVER',
    lead: 'Build. Transform. Handover.',
    image: '/assets/about-approach-deliver.png',
    imageAlt: 'Bathroom delivery stage with final inspection and completed renovation',
    paragraphs: [
      'Once the design is approved, our team turns the vision into reality.',
      'From dismantling and civil work to waterproofing, plumbing, electrical work, tiling and final fixture installation, every stage is professionally coordinated and supervised.',
      'We keep you informed throughout the execution and conduct a final inspection before handover to ensure the completed bathroom aligns with the agreed design and quality standards.',
    ],
  },
]

export default function About({ onNavigate }) {
  const approachRef = useRef(null)
  const principlesRef = useRef(null)
  const existingSpaceVisualRef = useRef(null)
  const closingVisualRef = useRef(null)
  const [visibleSteps, setVisibleSteps] = useState(() => new Set())
  const [visiblePrinciples, setVisiblePrinciples] = useState(() => new Set())
  const [isExistingSpaceVisualVisible, setIsExistingSpaceVisualVisible] = useState(false)
  const [isClosingVisualVisible, setIsClosingVisualVisible] = useState(false)

  useEffect(() => {
    const cards = approachRef.current?.querySelectorAll('.about-process-card')
    if (!cards?.length) return undefined

    const observer = new IntersectionObserver(
      (entries) => {
        setVisibleSteps((currentSteps) => {
          const nextSteps = new Set(currentSteps)

          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              nextSteps.add(entry.target.dataset.step)
            }
          })

          return nextSteps
        })
      },
      {
        root: null,
        rootMargin: '0px 0px -18% 0px',
        threshold: 0.24,
      },
    )

    cards.forEach((card) => observer.observe(card))

    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const cards = principlesRef.current?.querySelectorAll('.about-principle-card')
    if (!cards?.length) return undefined

    const observer = new IntersectionObserver(
      (entries) => {
        setVisiblePrinciples((currentPrinciples) => {
          const nextPrinciples = new Set(currentPrinciples)

          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              nextPrinciples.add(entry.target.dataset.principle)
            }
          })

          return nextPrinciples
        })
      },
      {
        root: null,
        rootMargin: '0px 0px -18% 0px',
        threshold: 0.22,
      },
    )

    cards.forEach((card) => observer.observe(card))

    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const visual = existingSpaceVisualRef.current
    if (!visual) return undefined

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsExistingSpaceVisualVisible(true)
        }
      },
      {
        root: null,
        rootMargin: '0px 0px -18% 0px',
        threshold: 0.24,
      },
    )

    observer.observe(visual)

    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const visual = closingVisualRef.current
    if (!visual) return undefined

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsClosingVisualVisible(true)
        }
      },
      {
        root: null,
        rootMargin: '0px 0px -18% 0px',
        threshold: 0.24,
      },
    )

    observer.observe(visual)

    return () => observer.disconnect()
  }, [])

  return (
    <div className="page inner-page about-page">
      <section className="page-heading about-hero">
        <h1>About NavKaya Baths</h1>
        <div className="about-hero-copy">
          <p className="about-hero-statement">
            We Don&apos;t Just Renovate Bathrooms. We Transform Them.
          </p>
          <p>
            NavKaya Baths is a Jaipur-based bathroom renovation company founded by an
            experienced Civil Engineer and supported by a team of skilled professionals
            specialising in complete bathroom transformations.
          </p>
          <p>
            We believe a well-designed bathroom should do more than look beautiful. It should
            be practical, comfortable, durable and thoughtfully planned around the people who
            use it every day.
          </p>
          <p>
            That is why we bring engineering expertise, contemporary design and professional execution
            together under one roof.
          </p>
          <p>
            From understanding your existing space and developing the right layout to selecting
            finishes and managing the complete on-site execution, our team takes care of every
            stage of your bathroom renovation.
          </p>
        </div>
      </section>

      <section className="section about-split-section">
        <div className="about-existing-space-copy">
          <p className="eyebrow">From an Existing Space to a Better Bathroom</p>
          <h2>Every bathroom comes with its own possibilities and challenges.</h2>
          <div className="about-copy-stack">
            <p>
              Before thinking about finishes and aesthetics, we study the existing space,
              measurements, plumbing requirements, movement, functionality and available area.
              This allows us to create a bathroom that is not only visually appealing but also
              works efficiently in everyday life.
            </p>
            <p>
              Our complete renovation solutions cover space planning, 2D &amp; 3D design,
              civil work, waterproofing, plumbing, electrical work, tiling, sanitaryware, CP
              fittings, fixture installation and final finishing.
            </p>
            <p>
              Instead of coordinating multiple contractors, vendors and different stages of work
              yourself, you get one team managing the entire transformation from start to finish.
            </p>
          </div>
        </div>
        <figure
          className={`about-existing-space-visual${isExistingSpaceVisualVisible ? ' is-visible' : ''}`}
          ref={existingSpaceVisualRef}
        >
          <img
            src="/assets/about-existing-space-bathroom.png"
            alt="3D bathroom layout showing vanity, toilet, shower, storage, lighting, and plants"
            loading="eager"
            decoding="async"
          />
        </figure>
      </section>

      <section className="about-principles" aria-label="Our vision and mission" ref={principlesRef}>
        <article
          className={`about-principle-card${visiblePrinciples.has('vision') ? ' is-visible' : ''}`}
          data-principle="vision"
        >
          <p className="eyebrow">Our Vision</p>
          <h2>Better Bathrooms. Better Everyday Living.</h2>
          <p>
            Our vision is to redefine bathroom renovation by creating spaces where{' '}
            thoughtful design, engineering precision and everyday functionality come together seamlessly.
          </p>
          <p>
            We aim to make professionally designed and executed bathrooms more accessible while
            setting a higher standard for quality, transparency and customer experience in
            bathroom renovation.
          </p>
        </article>
        <article
          className={`about-principle-card${visiblePrinciples.has('mission') ? ' is-visible' : ''}`}
          data-principle="mission"
        >
          <p className="eyebrow">Our Mission</p>
          <h2>Designed with Purpose. Built with Precision.</h2>
          <p>
            Our mission is to simplify the entire bathroom renovation journey by providing a{' '}
            complete, professionally managed solution under one roof.
          </p>
          <p>
            From understanding the space and visualising the design to selecting the right
            materials and managing execution, we are committed to delivering bathrooms that
            balance aesthetics, functionality, durability and comfort.
          </p>
          <p>
            Every project is approached with clear communication, transparent processes, careful
            planning and attention to detail&mdash;so our clients can renovate with greater
            confidence and less complexity.
          </p>
        </article>
      </section>

      <section className="section about-approach-section">
        <div className="about-section-heading">
          <h2>Our Approach</h2>
          <p>Your dream bathroom, professionally planned and beautifully delivered.</p>
          <p>
            From the first conversation to the final handover, we follow a clear, structured
            and transparent process that keeps you informed at every stage.
          </p>
        </div>

        <div className="about-process-grid" ref={approachRef}>
          {approachSteps.map((step) => (
            <article
              className={`about-process-card${visibleSteps.has(step.number) ? ' is-visible' : ''}`}
              data-step={step.number}
              key={step.number}
            >
              <span className="about-process-number">{step.number}</span>
              <div className="about-process-copy">
                <h3>{step.title}</h3>
                <p className="about-step-lead">{step.lead}</p>
                {step.paragraphs.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
              <figure className="about-process-visual">
                <img
                  src={step.image}
                  alt={step.imageAlt}
                  loading="eager"
                  decoding="async"
                />
              </figure>
            </article>
          ))}
        </div>
      </section>

      <section className="section about-closing">
        <div className="about-closing-panel">
          <div className="about-closing-copy">
            <h2>Bathroom renovation shouldn&apos;t mean coordinating multiple contractors, vendors and timelines.</h2>
            <p>
              With NavKaya Baths, design, engineering and execution come together under one roof,
              giving you a simpler, more transparent and professionally managed renovation experience.
            </p>
            <button
              className="about-consultation-button"
              type="button"
              onClick={() => onNavigate('/contact')}
            >
              Book Consultation
            </button>
          </div>
          <figure
            className={`about-closing-visual${isClosingVisualVisible ? ' is-visible' : ''}`}
            ref={closingVisualRef}
          >
            <img
              src="/assets/about-one-team-bathroom.png"
              alt="NavKaya Baths team renovating a bathroom together"
              loading="eager"
              decoding="async"
            />
          </figure>
        </div>
      </section>
    </div>
  )
}
