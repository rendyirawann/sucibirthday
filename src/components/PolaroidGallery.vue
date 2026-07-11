<script setup>
import { onMounted, onUnmounted, ref } from 'vue'
import { gsap, ScrollTrigger, revealUp } from '../lib/scroll'
import { photos } from '../data/content'
import { asset } from '../lib/assets'
import { useLightbox } from '../composables/useLightbox'

const root = ref(null)
const { show } = useLightbox()
let ctx

// Rotasi kecil deterministik supaya terasa seperti tempelan scrapbook
function rot(i) {
  return ((i * 137) % 7) - 3
}

onMounted(() => {
  ctx = gsap.context(() => {
    revealUp('.gallery-head', { trigger: root.value })
    gsap.set('.polaroid', { autoAlpha: 0, y: 50 })
    ScrollTrigger.batch('.polaroid', {
      start: 'top 88%',
      once: true,
      onEnter: (batch) =>
        gsap.to(batch, { autoAlpha: 1, y: 0, duration: 0.8, ease: 'power3.out', stagger: 0.08 }),
    })
  }, root.value)
})

onUnmounted(() => ctx?.revert())
</script>

<template>
  <section ref="root" class="px-5 py-20 md:py-28">
    <div class="gallery-head mx-auto mb-12 max-w-xl text-center">
      <h2 class="script-title text-6xl md:text-7xl">Memory Lane</h2>
      <p class="mt-3 text-inksoft">potongan-potongan cerita kita — klik fotonya ya 🤍</p>
    </div>

    <div class="mx-auto max-w-6xl columns-2 gap-4 sm:columns-3 lg:columns-4">
      <figure
        v-for="(photo, i) in photos"
        :key="photo.src"
        class="polaroid mb-4 inline-block w-full cursor-pointer break-inside-avoid rounded-[4px] bg-white p-2 pb-7 shadow-[0_10px_30px_-12px_rgba(201,79,124,0.35)] transition-all duration-300 hover:z-10 hover:!rotate-0 hover:scale-[1.04] hover:shadow-[0_18px_40px_-12px_rgba(201,79,124,0.5)]"
        :style="{ rotate: rot(i) + 'deg' }"
        @click="show('image', asset(photo.src))"
      >
        <img
          :src="asset(photo.src)"
          :alt="photo.caption || 'memory'"
          loading="lazy"
          class="aspect-[4/5] w-full rounded-[2px] object-cover"
        />
        <figcaption
          v-if="photo.caption"
          class="mt-2 text-center text-xs font-medium text-inksoft"
        >
          {{ photo.caption }}
        </figcaption>
      </figure>
    </div>
  </section>
</template>
