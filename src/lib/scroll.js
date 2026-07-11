import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export { gsap, ScrollTrigger }

// Reveal standar: elemen naik lembut saat masuk viewport (sekali saja)
export function revealUp(targets, { trigger, start = 'top 82%', stagger = 0.12, y = 44, ...rest } = {}) {
  return gsap.from(targets, {
    y,
    autoAlpha: 0,
    duration: 0.9,
    ease: 'power3.out',
    stagger,
    scrollTrigger: { trigger, start, once: true },
    ...rest,
  })
}
