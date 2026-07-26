<script setup>
// Memory bubbles yang melayang di seluruh halaman (di belakang konten).
// Naik pelan seperti gelembung sabun; isinya berganti-ganti foto/video.
import { nextTick, onMounted, onUnmounted, reactive, ref } from 'vue'
import gsap from 'gsap'
import { photos, videos } from '../data/content'
import { asset } from '../lib/assets'

const pool = [
  ...photos.map((p) => ({ type: 'image', src: p.src })),
  ...videos.map((src) => ({ type: 'video', src })),
]

// Maksimal 2 bubble menampilkan video bersamaan (hemat tenaga ponsel)
const MAX_VIDEO_BUBBLES = 2

const root = ref(null)
const bubbles = reactive([])
let ctx
let alive = true

// "Tumpukan kartu yang dikocok": seluruh foto & video diacak jadi satu
// tumpukan, diambil satu per satu, baru dikocok ulang setelah habis.
// Dengan begini setiap aset pasti kebagian tampil sebelum ada yang terulang.
let deck = []

function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function drawMedia() {
  const shown = new Set(bubbles.map((b) => b.media?.src))
  const videoCount = bubbles.filter((b) => b.media?.type === 'video').length
  const skipped = []
  let picked = null

  // Ambil kartu teratas yang layak; yang dilewati dikembalikan ke tumpukan
  // supaya tetap mendapat giliran nanti.
  for (let guard = 0; guard < pool.length + 1; guard++) {
    if (!deck.length) deck = shuffle(pool)
    const card = deck.shift()
    const tooManyVideos = card.type === 'video' && videoCount >= MAX_VIDEO_BUBBLES
    if (shown.has(card.src) || tooManyVideos) {
      skipped.push(card)
      continue
    }
    picked = card
    break
  }

  deck.push(...skipped)
  return picked || pool[Math.floor(Math.random() * pool.length)]
}

function scheduleSwap(bubble) {
  gsap.delayedCall(gsap.utils.random(5, 11), () => {
    if (!alive) return
    bubble.media = drawMedia()
    scheduleSwap(bubble)
  })
}

onMounted(async () => {
  const mobile = window.innerWidth < 768
  const count = mobile ? 6 : 10
  for (let i = 0; i < count; i++) {
    bubbles.push({
      id: i,
      size: Math.round(gsap.utils.random(mobile ? 54 : 72, mobile ? 112 : 150)),
      media: drawMedia(),
    })
  }
  await nextTick()

  ctx = gsap.context(() => {
    const els = Array.from(root.value.children)
    const vh = () => window.innerHeight
    const vw = () => window.innerWidth

    els.forEach((el, i) => {
      const bubble = bubbles[i]

      function rise() {
        if (!alive) return
        gsap.fromTo(
          el,
          { y: vh() + 180, x: gsap.utils.random(0, Math.max(0, vw() - bubble.size)) },
          {
            y: -200,
            duration: gsap.utils.random(28, 50),
            ease: 'none',
            onComplete: rise,
          },
        )
      }

      // Perjalanan pertama mulai dari posisi acak di layar supaya
      // bubble langsung tersebar, bukan menunggu naik dari bawah semua
      const startY = gsap.utils.random(-100, vh())
      gsap.set(el, {
        y: startY,
        x: gsap.utils.random(0, Math.max(0, vw() - bubble.size)),
        autoAlpha: 0,
      })
      gsap.to(el, { autoAlpha: 1, duration: 1.6, delay: i * 0.25 })
      gsap.to(el, {
        y: -200,
        duration: gsap.utils.random(20, 40) * ((startY + 200) / (vh() + 400)),
        ease: 'none',
        onComplete: rise,
      })

      // Goyangan halus + napas kecil
      gsap.to(el, {
        xPercent: '+=26',
        duration: gsap.utils.random(3, 6.5),
        yoyo: true,
        repeat: -1,
        ease: 'sine.inOut',
      })
      gsap.to(el, {
        scale: gsap.utils.random(1.04, 1.1),
        duration: gsap.utils.random(2.5, 4.5),
        yoyo: true,
        repeat: -1,
        ease: 'sine.inOut',
      })

      scheduleSwap(bubble)
    })
  }, root.value)
})

onUnmounted(() => {
  alive = false
  ctx?.revert()
})
</script>

<template>
  <div ref="root" class="pointer-events-none fixed inset-0 z-0 overflow-hidden">
    <div
      v-for="b in bubbles"
      :key="b.id"
      class="absolute top-0 left-0"
      :style="{ width: b.size + 'px', height: b.size + 'px' }"
    >
      <div
        class="relative h-full w-full overflow-hidden rounded-full opacity-45 shadow-[0_12px_30px_-10px_rgba(201,79,124,0.4)] ring-2 ring-white/80 md:opacity-65"
      >
        <Transition name="fm-fade" mode="out-in">
          <img
            v-if="b.media.type === 'image'"
            :key="b.media.src"
            :src="asset(b.media.src)"
            alt=""
            class="h-full w-full object-cover"
          />
          <video
            v-else
            :key="b.media.src"
            :src="asset(b.media.src)"
            autoplay
            loop
            muted
            playsinline
            class="h-full w-full object-cover"
          ></video>
        </Transition>
        <!-- kilau kaca -->
        <div
          class="pointer-events-none absolute inset-0 rounded-full bg-[radial-gradient(circle_at_30%_22%,rgba(255,255,255,0.6),transparent_45%)]"
        ></div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.fm-fade-enter-active,
.fm-fade-leave-active {
  transition: opacity 0.7s ease;
}
.fm-fade-enter-from,
.fm-fade-leave-to {
  opacity: 0;
}
</style>
