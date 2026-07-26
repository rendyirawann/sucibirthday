<script setup>
import { onMounted, onUnmounted, ref, watch } from 'vue'
import gsap from 'gsap'
import { eventInfo, hero } from '../data/content'
import HeroCluster from './HeroCluster.vue'

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

    <div class="grid w-full items-center gap-14 py-12 md:gap-12 md:py-0 md:grid-cols-[1.25fr_1fr]">
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

      <!-- kanan: kartu foto/video yang bisa dibalik -->
      <div class="hero-stagger">
        <HeroCluster />
      </div>
    </div>

    <!-- disembunyikan di ponsel: ruangnya bertabrakan dengan kartu & mini player -->
    <div
      class="hero-hint absolute bottom-24 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-1 text-inksoft md:flex"
    >
      <span class="text-xs font-medium tracking-[0.25em] uppercase">scroll pelan-pelan</span>
      <svg viewBox="0 0 24 24" class="hero-chev h-6 w-6 fill-none stroke-rose stroke-2">
        <path d="m6 9 6 6 6-6" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
    </div>
  </section>
</template>
