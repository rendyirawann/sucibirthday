<script setup>
import { onMounted, onUnmounted, ref, watch } from 'vue'
import gsap from 'gsap'
import { eventInfo, hero, photos } from '../data/content'
import { asset } from '../lib/assets'

const props = defineProps({ opened: Boolean })
const root = ref(null)
let ctx

// Klaster foto miring di sisi kanan hero (desktop)
const cluster = [
  { src: photos[1].src, class: 'top-2 left-4 w-[52%] -rotate-6' },
  { src: photos[13].src, class: 'top-[28%] right-0 w-[46%] rotate-4' },
  { src: photos[21].src, class: 'bottom-0 left-[14%] w-[48%] -rotate-2' },
]

onMounted(() => {
  ctx = gsap.context(() => {
    gsap.set('.hero-stagger', { autoAlpha: 0, y: 40 })
    gsap.set('.hero-hint', { autoAlpha: 0 })
  }, root.value)
})

watch(
  () => props.opened,
  (opened) => {
    if (!opened) return
    const tl = gsap.timeline({ delay: 0.5 })
    tl.to('.hero-stagger', {
      autoAlpha: 1,
      y: 0,
      duration: 1,
      ease: 'power3.out',
      stagger: 0.16,
    })
    tl.to('.hero-hint', { autoAlpha: 1, duration: 0.8 }, '-=0.3')
    tl.to(
      '.hero-chev',
      { y: 8, duration: 0.8, yoyo: true, repeat: -1, ease: 'sine.inOut' },
      '<',
    )
  },
)

onUnmounted(() => ctx?.revert())
</script>

<template>
  <section
    ref="root"
    class="relative flex min-h-[100svh] items-center px-6 md:px-12 lg:px-16"
  >
    <!-- blob dekoratif -->
    <div class="pointer-events-none absolute top-[10%] left-[4%] h-64 w-64 rounded-full bg-petal opacity-60 blur-3xl"></div>
    <div class="pointer-events-none absolute right-[8%] bottom-[12%] h-72 w-72 rounded-full bg-softpink opacity-40 blur-3xl"></div>

    <div class="grid w-full items-center gap-12 md:grid-cols-[1.25fr_1fr]">
      <!-- kiri: tipografi besar rata kiri -->
      <div class="text-left">
        <p class="hero-stagger eyebrow">{{ eventInfo.day }} · {{ eventInfo.dateLong }}</p>
        <h1 class="hero-stagger script-title mt-4 text-[5.2rem] leading-[1.05] md:text-[8.5rem]">
          Happy<br />Birthday
        </h1>
        <p class="hero-stagger mt-5 text-2xl font-bold tracking-[0.28em] uppercase md:text-4xl">
          {{ hero.name }}
        </p>
        <p class="hero-stagger mt-3 text-base text-inksoft italic md:text-lg">{{ hero.sub }}</p>
      </div>

      <!-- kanan: klaster foto miring -->
      <div class="hero-stagger relative hidden h-[440px] md:block">
        <img
          v-for="c in cluster"
          :key="c.src"
          :src="asset(c.src)"
          alt=""
          class="absolute aspect-[4/5] rounded-2xl object-cover shadow-[0_20px_45px_-15px_rgba(201,79,124,0.45)] ring-8 ring-white"
          :class="c.class"
        />
      </div>
    </div>

    <div class="hero-hint absolute bottom-24 left-1/2 flex -translate-x-1/2 flex-col items-center gap-1 text-inksoft">
      <span class="text-xs font-medium tracking-[0.25em] uppercase">scroll pelan-pelan</span>
      <svg viewBox="0 0 24 24" class="hero-chev h-6 w-6 fill-none stroke-rose stroke-2">
        <path d="m6 9 6 6 6-6" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
    </div>
  </section>
</template>
