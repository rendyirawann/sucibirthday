<script setup>
import { onMounted, onUnmounted, ref } from 'vue'
import { gsap, revealUp } from '../lib/scroll'
import { board } from '../data/content'
import { asset } from '../lib/assets'
import { useLightbox } from '../composables/useLightbox'

const root = ref(null)
const { show } = useLightbox()
let ctx

onMounted(() => {
  ctx = gsap.context(() => {
    revealUp('.board-stagger', { trigger: root.value })
    // papannya masuk sambil meluruskan diri, seperti baru ditempel
    gsap.from('.board-photo', {
      rotation: -4,
      y: 60,
      autoAlpha: 0,
      duration: 1.1,
      ease: 'power3.out',
      scrollTrigger: { trigger: '.board-photo', start: 'top 88%', once: true },
    })
  }, root.value)
})

onUnmounted(() => ctx?.revert())
</script>

<template>
  <section ref="root" class="relative px-6 py-20 md:px-12 md:py-28 lg:px-16">
    <div class="pointer-events-none absolute top-1/3 right-[6%] h-72 w-72 rounded-full bg-petal opacity-50 blur-3xl"></div>

    <div class="board-stagger mb-12 max-w-2xl">
      <p class="eyebrow">05 — the board</p>
      <h2 class="script-title mt-4 text-6xl md:text-7xl">{{ board.title }}</h2>
      <p class="mt-3 text-inksoft">{{ board.sub }}</p>
    </div>

    <div class="flex justify-center">
      <figure
        class="board-photo group relative w-full max-w-[420px] cursor-pointer transition-transform duration-500 hover:-rotate-1 hover:scale-[1.02]"
        @click="show('image', asset(board.src))"
      >
        <!-- pita washi di sudut atas, seperti ditempel ke dinding -->
        <span class="washi -top-3 left-6 -rotate-12"></span>
        <span class="washi -top-3 right-6 rotate-12"></span>

        <img
          :src="asset(board.src)"
          alt="Papan kenangan Suci"
          loading="lazy"
          class="w-full rounded-md bg-white p-3 shadow-[0_28px_60px_-24px_rgba(201,79,124,0.55)] ring-1 ring-rose/10"
        />

        <figcaption
          class="mt-4 text-center text-[0.65rem] tracking-[0.3em] text-inksoft/70 uppercase"
        >
          35 moments · 2025 – 2026
        </figcaption>
      </figure>
    </div>
  </section>
</template>
