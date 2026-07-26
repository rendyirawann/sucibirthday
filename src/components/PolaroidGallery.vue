<script setup>
import { onMounted, onUnmounted, ref } from 'vue'
import { gsap, ScrollTrigger, revealUp } from '../lib/scroll'
import { laneItems } from '../data/content'
import { asset } from '../lib/assets'
import { useLightbox } from '../composables/useLightbox'
import { lazyPlayVideos } from '../lib/lazyVideo'

const root = ref(null)
const { show } = useLightbox()
let ctx
let disposeLazy

// Bento grid: tiap 6 foto = 2 besar + 4 kecil.
// Dengan grid-flow-dense, posisi foto besar otomatis berselang kiri/kanan.
// (i % 3 === 1 supaya urutan diakhiri foto kecil, bukan foto besar sendirian)
function isBig(i) {
  return i % 3 === 1
}

onMounted(() => {
  disposeLazy = lazyPlayVideos(root.value)
  ctx = gsap.context(() => {
    revealUp('.lane-head', { trigger: root.value })
    gsap.set('.lane-item', { autoAlpha: 0, y: 55 })
    ScrollTrigger.batch('.lane-item', {
      start: 'top 90%',
      once: true,
      onEnter: (batch) =>
        gsap.to(batch, { autoAlpha: 1, y: 0, duration: 0.9, ease: 'power3.out', stagger: 0.1 }),
    })
  }, root.value)
})

onUnmounted(() => {
  disposeLazy?.()
  ctx?.revert()
})
</script>

<template>
  <section ref="root" class="px-5 py-20 md:px-16 md:py-28">
    <div class="lane-head mb-12 max-w-2xl">
      <p class="eyebrow">02 — memory lane</p>
      <h2 class="script-title mt-4 text-6xl md:text-7xl">Memory Lane</h2>
      <p class="mt-3 text-inksoft">potongan-potongan cerita kita — klik fotonya ya 🤍</p>
    </div>

    <!-- auto-rows dihitung supaya setiap sel persegi; foto besar (2x2)
         tetap persegi karena ikut memakai 1 gap di tengahnya -->
    <div
      class="mx-auto grid max-w-[1400px] grid-flow-dense grid-cols-2 gap-3 [grid-auto-rows:calc((min(100vw,1400px)-2.5rem-0.75rem)/2)] md:grid-cols-4 md:gap-5 md:[grid-auto-rows:calc((min(100vw,1400px)-8rem-3.75rem)/4)]"
    >
      <figure
        v-for="(item, i) in laneItems"
        :key="item.src"
        class="lane-item group relative cursor-pointer overflow-hidden rounded-xl shadow-[0_16px_40px_-16px_rgba(201,79,124,0.45)] ring-4 ring-white md:rounded-2xl"
        :class="isBig(i) ? 'col-span-2 row-span-2' : ''"
        @click="show(item.type, asset(item.src))"
      >
        <img
          v-if="item.type === 'image'"
          :src="asset(item.src)"
          :alt="item.caption || 'memory'"
          loading="lazy"
          class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <template v-else>
          <!-- data-lazy: video hanya diputar saat petaknya terlihat di layar -->
          <video
            :src="asset(item.src)"
            data-lazy
            preload="none"
            loop
            muted
            playsinline
            class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          ></video>
          <span
            class="pointer-events-none absolute right-2 bottom-2 flex h-7 w-7 items-center justify-center rounded-full bg-white/85 shadow md:h-8 md:w-8"
          >
            <svg viewBox="0 0 24 24" class="h-3.5 w-3.5 fill-rose md:h-4 md:w-4">
              <path d="M8 5v14l11-7z" />
            </svg>
          </span>
        </template>
      </figure>
    </div>
  </section>
</template>
