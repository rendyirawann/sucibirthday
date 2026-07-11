// Putar video hanya saat terlihat di viewport; jeda saat keluar.
// Hemat data & baterai dibanding autoplay semua video sekaligus.
export function lazyPlayVideos(container) {
  const videos = container.querySelectorAll('video[data-lazy]')
  const io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (e.isIntersecting) e.target.play().catch(() => {})
        else e.target.pause()
      }
    },
    { threshold: 0.15 },
  )
  videos.forEach((v) => io.observe(v))
  return () => io.disconnect()
}
