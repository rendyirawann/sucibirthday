<script setup>
// Tiga kartu foto miring di hero. Diklik -> membalik (flip) dan berganti
// ke foto/video lain. Juga berganti sendiri pelan-pelan supaya terasa hidup.
import { nextTick, onMounted, onUnmounted, reactive, ref } from 'vue'
import gsap from 'gsap'
import { asset } from '../lib/assets'
import { drawMedia } from '../composables/useMediaDeck'
import { useLightbox } from '../composables/useLightbox'

const LAYOUT = [
  'top-0 left-2 w-[54%] -rotate-6 z-10',
  'top-[26%] right-0 w-[48%] rotate-4 z-20',
  'bottom-0 left-[16%] w-[50%] -rotate-2 z-10',
]

const root = ref(null)
const cards = reactive([])
const flipping = new Set()
let ctx
let alive = true

// Maksimal satu kartu berisi video sekaligus
function pick() {
  const shown = new Set(cards.map((c) => c.media?.src))
  const hasVideo = cards.some((c) => c.media?.type === 'video')
  return drawMedia((card) => !shown.has(card.src) && !(hasVideo && card.type === 'video'))
}

function flip(i) {
  if (flipping.has(i) || !alive) return
  flipping.add(i)
  const el = root.value.children[i]
  gsap
    .timeline({ onComplete: () => flipping.delete(i) })
    .to(el, { rotationY: 90, scale: 0.94, duration: 0.34, ease: 'power2.in' })
    .call(() => (cards[i].media = pick()))
    .fromTo(
      el,
      { rotationY: -90 },
      { rotationY: 0, scale: 1, duration: 0.42, ease: 'power2.out' },
    )
}

onMounted(async () => {
  for (let i = 0; i < 3; i++) cards.push({ media: pick() })
  await nextTick()

  ctx = gsap.context(() => {
    // giliran otomatis: satu kartu berganti tiap beberapa detik
    let turn = 0
    function cycle() {
      if (!alive) return
      gsap.delayedCall(gsap.utils.random(3.5, 6), () => {
        flip(turn % 3)
        turn++
        cycle()
      })
    }
    cycle()
  }, root.value)
})

onUnmounted(() => {
  alive = false
  ctx?.revert()
})

const { show } = useLightbox()
</script>

<template>
  <div ref="root" class="relative h-[300px] [perspective:1400px] md:h-[440px]">
    <div
      v-for="(card, i) in cards"
      :key="i"
      class="absolute cursor-pointer [transform-style:preserve-3d]"
      :class="LAYOUT[i]"
      @click="flip(i)"
      @dblclick="show(card.media.type, asset(card.media.src))"
    >
      <div
        class="relative aspect-[4/5] w-full overflow-hidden rounded-2xl bg-black shadow-[0_20px_45px_-15px_rgba(201,79,124,0.45)] ring-8 ring-white"
      >
        <img
          v-if="card.media.type === 'image'"
          :src="asset(card.media.src)"
          alt=""
          class="h-full w-full object-cover"
        />
        <video
          v-else
          :src="asset(card.media.src)"
          autoplay
          loop
          muted
          playsinline
          class="h-full w-full object-cover"
        ></video>
      </div>
      <!-- petunjuk kecil hanya di kartu tengah -->
      <span
        v-if="i === 1"
        class="pointer-events-none absolute -bottom-7 left-1/2 -translate-x-1/2 text-[0.6rem] tracking-[0.25em] whitespace-nowrap text-inksoft/70 uppercase"
      >
        tap to flip
      </span>
    </div>
  </div>
</template>
