export const imageAssets = [
  '/assets/about-approach-define.png',
  '/assets/about-approach-deliver.png',
  '/assets/about-approach-design.png',
  '/assets/about-existing-space-bathroom.png',
  '/assets/about-one-team-bathroom.png',
  '/assets/commercial-toilet-1.png',
  '/assets/commercial-washroom-stall-corridor-view-large.png',
  '/assets/commercial-washroom-stall-corridor-view.png',
  '/assets/commercial-washroom-urinal-wall-view-large.png',
  '/assets/commercial-washroom-urinal-wall-view.png',
  '/assets/commercial-washroom-vanity-angle-large.png',
  '/assets/commercial-washroom-vanity-angle.png',
  '/assets/design-built-practical-detail.png',
  '/assets/design-commercial-washrooms.png',
  '/assets/design-family-utility.png',
  '/assets/design-hotel-inspired.png',
  '/assets/design-luxury-baths.png',
  '/assets/design-luxury-suite.png',
  '/assets/design-material-mood-detail.png',
  '/assets/design-modern-compact-2.png',
  '/assets/design-modern-compact-showcase.png',
  '/assets/design-modern-compact.png',
  '/assets/design-powder-room-showcase.png',
  '/assets/design-reference-sketch.jpeg',
  '/assets/design-room-first-detail.png',
  '/assets/design-spa-retreat.png',
  '/assets/design-vanity-showcase.png',
  '/assets/footer-bathroom-blueprint.png',
  '/assets/luxury-bath-reverse-view-large.png',
  '/assets/luxury-bath-reverse-view.jpg',
  '/assets/luxury-bath-shower-detail-large.png',
  '/assets/luxury-bath-shower-detail.jpg',
  '/assets/luxury-bath-vanity-detail-large.png',
  '/assets/luxury-bath-vanity-detail.jpg',
  '/assets/luxury-baths-2.png',
  '/assets/modern-compact-bathroom.png',
  '/assets/modern-compact-reverse-view.png',
  '/assets/modern-compact-shower-detail.png',
  '/assets/modern-compact-vanity-detail.png',
  '/assets/navkaya-bath-composition.png',
  '/assets/navkaya-logo-full.png',
  '/assets/navkaya-logo-icon.png',
  '/assets/navkaya-logo.png',
  '/assets/powder-room-angled-full-view.jpg',
  '/assets/powder-room-toilet-closeup.jpg',
  '/assets/powder-room-vanity-closeup.jpg',
  '/assets/powder-room.png',
  '/assets/prasadika-ai-logo.png',
  '/assets/vanity-black-cabinet-detail.png',
  '/assets/vanity-design.png',
  '/assets/vanity-partition-mirror-detail.png',
  '/assets/vanity-round-mirror-detail.png',
]

export const videoAssets = [
  '/assets/bathroom-build-scroll.mp4',
  '/assets/bathroom-build.mp4',
  '/assets/contact-page-video.mp4',
  '/assets/design-commercial-washrooms-video.mp4',
  '/assets/design-luxury-baths-video.mp4',
  '/assets/design-modern-compact-video.mp4',
  '/assets/design-powder-room-video.mp4',
  '/assets/design-vanity-video.mp4',
  '/assets/home-workers-building-luxury-bathroom-1080p.mp4',
  '/assets/navkaya-home-main.mp4',
  '/assets/navkaya-home-scroll.mp4',
  '/assets/navkaya-home-source.mp4',
  '/assets/workers-building-luxury-bathroom-1080p.mp4',
  '/assets/workers-building-modern-luxury-bath.mp4',
]

const preloadedImages = new Map()
const preloadedVideos = new Map()
let hasStartedPreloading = false

export function preloadSiteMedia() {
  if (hasStartedPreloading || typeof window === 'undefined') return

  hasStartedPreloading = true

  imageAssets.forEach((src) => {
    const image = new Image()
    image.decoding = 'async'
    image.loading = 'eager'
    image.src = src
    preloadedImages.set(src, image)
  })

  videoAssets.forEach((src) => {
    const video = document.createElement('video')
    video.muted = true
    video.playsInline = true
    video.preload = 'auto'
    video.src = src
    video.load()
    preloadedVideos.set(src, video)
  })
}
