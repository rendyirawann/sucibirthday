<script setup>
import { onMounted, onUnmounted, ref, watch } from 'vue'
import gsap from 'gsap'
import { eventInfo, hero } from '../data/content'

const props = defineProps({ opened: Boolean })
const root = ref(null)
let ctx

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
      stagger: 0.18,
    })
    tl.to('.hero-hint', { autoAlpha: 1, duration: 0.8 }, '-=0.3')
    tl.to('.hero-chev', {
      y: 8,
      duration: 0.8,
      yoyo: true,
      repeat: -1,
      ease: 'sine.inOut',
    }, '<')
  },
)

onUnmounted(() => ctx?.revert())
</script>

<template>
  <section ref="root" class="relative flex min-h-[100svh] flex-col items-center justify-center px-6 text-center">
    <!-- blob dekoratif -->
    <div class="pointer-events-none absolute top-[12%] left-[8%] h-64 w-64 rounded-full bg-petal opacity-60 blur-3xl"></div>
    <div class="pointer-events-none absolute right-[6%] bottom-[15%] h-72 w-72 rounded-full bg-softpink opacity-40 blur-3xl"></div>

    <p class="hero-stagger mb-2 text-sm font-semibold tracking-[0.4em] text-inksoft uppercase">
      {{ eventInfo.dateDots }}
    </p>
    <h1 class="hero-stagger script-title text-7xl md:text-9xl">{{ hero.script }}</h1>
    <p class="hero-stagger mt-4 text-xl font-bold tracking-[0.35em] uppercase md:text-3xl">
      {{ hero.name }}
    </p>
    <p class="hero-stagger mt-3 text-base text-inksoft italic md:text-lg">{{ hero.sub }}</p>

    <div
      class="hero-stagger mt-8 rounded-full border border-rose/25 bg-white/70 px-7 py-2.5 font-semibold text-rose shadow-sm backdrop-blur"
    >
      {{ eventInfo.day }}, {{ eventInfo.dateLong }}
    </div>

    <!-- bottom-24 supaya tidak tertutup pill MiniPlayer -->
    <div class="hero-hint absolute bottom-24 flex flex-col items-center gap-1 text-inksoft">
      <span class="text-xs font-medium tracking-[0.25em] uppercase">scroll pelan-pelan</span>
      <svg viewBox="0 0 24 24" class="hero-chev h-6 w-6 fill-none stroke-rose stroke-2">
        <path d="m6 9 6 6 6-6" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
    </div>
  </section>
</template>
