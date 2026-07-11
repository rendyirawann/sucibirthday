<script setup>
import { onMounted, onUnmounted, ref } from 'vue'
import { gsap, ScrollTrigger, revealUp } from '../lib/scroll'
import { photos } from '../data/content'
import { asset } from '../lib/assets'
import { useLightbox } from '../composables/useLightbox'

const root = ref(null)
const { show } = useLightbox()
let ctx

// Bento grid: tiap 6 foto = 2 besar + 4 kecil.
// Dengan grid-flow-dense, posisi foto besar otomatis berselang kiri/kanan.
// (i % 3 === 1 supaya urutan diakhiri foto kecil, bukan foto besar sendirian)
function isBig(i) {
  return i % 3 === 1
}

onMounted(() => {
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

onUnmounted(() => ctx?.revert())
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
        v-for="(ph, i) in photos"
        :key="ph.src"
        class="lane-item group cursor-pointer overflow-hidden rounded-xl shadow-[0_16px_40px_-16px_rgba(201,79,124,0.45)] ring-4 ring-white md:rounded-2xl"
        :class="isBig(i) ? 'col-span-2 row-span-2' : ''"
        @click="show('image', asset(ph.src))"
      >
        <img
          :src="asset(ph.src)"
          :alt="ph.caption || 'memory'"
          loading="lazy"
          class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </figure>
    </div>
  </section>
</template>
