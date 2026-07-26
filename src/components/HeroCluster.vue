<script setup>
// Tumpukan tiga kartu foto di hero. Diklik -> kartunya terlempar keluar
// sambil berputar (seperti membuang kartu), lalu kartu baru jatuh
// menggantikannya dengan foto/video lain. Juga berganti sendiri pelan-pelan.
import { nextTick, onMounted, onUnmounted, reactive, ref } from 'vue'
import gsap from 'gsap'
import { asset } from '../lib/assets'
import { drawMedia } from '../composables/useMediaDeck'
import { useLightbox } from '../composables/useLightbox'

// Posisi dibuat agak renggang supaya ketiga kartu tetap kelihatan;
// sudut miringnya diatur GSAP (bukan class) agar tidak bentrok saat animasi.
const LAYOUT = [
  { pos: 'top-0 left-0 w-[45%]', rot: -8, z: 10 },
  { pos: 'top-[7%] right-0 w-[45%]', rot: 5, z: 20 },
  { pos: 'bottom-0 left-[27%] w-[47%]', rot: -2, z: 30 },
]

const root = ref(null)
const cards = reactive([])
const busy = new Set()
let ctx
let alive = true

// Maksimal satu kartu berisi video sekaligus
function pick() {
  const shown = new Set(cards.map((c) => c.media?.src))
  const hasVideo = cards.some((c) => c.media?.type === 'video')
  return drawMedia((card) => !shown.has(card.src) && !(hasVideo && card.type === 'video'))
}

function toss(i) {
  if (busy.has(i) || !alive) return
  busy.add(i)

  const el = root.value.children[i]
  const base = LAYOUT[i].rot
  const dir = i === 1 ? 1 : -1 // dilempar ke kanan/kiri sesuai posisinya

  gsap
    .timeline({
      onComplete: () => {
        gsap.set(el, { zIndex: LAYOUT[i].z })
        busy.delete(i)
      },
    })
    // kartu lama terlempar keluar sambil berputar
    .set(el, { zIndex: 60 })
    .to(el, {
      x: dir * 190,
      y: -120,
      rotation: base + dir * 34,
      rotationY: dir * 75,
      scale: 0.82,
      autoAlpha: 0,
      duration: 0.5,
      ease: 'power2.in',
    })
    .call(() => (cards[i].media = pick()))
    // kartu baru jatuh dari bawah tumpukan
    .fromTo(
      el,
      { x: 0, y: 70, rotation: base - dir * 12, rotationY: -dir * 45, scale: 0.88, autoAlpha: 0 },
      {
        y: 0,
        rotation: base,
        rotationY: 0,
        scale: 1,
        autoAlpha: 1,
        duration: 0.62,
        ease: 'back.out(1.5)',
      },
    )
}

onMounted(async () => {
  for (let i = 0; i < 3; i++) cards.push({ media: pick() })
  await nextTick()

  ctx = gsap.context(() => {
    // sudut miring awal tiap kartu
    Array.from(root.value.children).forEach((el, i) =>
      gsap.set(el, { rotation: LAYOUT[i].rot, zIndex: LAYOUT[i].z }),
    )

    // giliran otomatis
    let turn = 0
    function cycle() {
      if (!alive) return
      gsap.delayedCall(gsap.utils.random(3.5, 6), () => {
        toss(turn % 3)
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
  <div ref="root" class="relative h-[320px] [perspective:1400px] md:h-[440px]">
    <div
      v-for="(card, i) in cards"
      :key="i"
      class="absolute cursor-pointer [transform-style:preserve-3d]"
      :class="LAYOUT[i].pos"
      @click="toss(i)"
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
      <!-- petunjuk kecil di bawah kartu paling depan -->
      <span
        v-if="i === 2"
        class="pointer-events-none absolute -bottom-6 left-1/2 -translate-x-1/2 text-[0.6rem] tracking-[0.25em] whitespace-nowrap text-inksoft/70 uppercase"
      >
        tap to change
      </span>
    </div>
  </div>
</template>
