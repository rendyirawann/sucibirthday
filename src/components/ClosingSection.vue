<script setup>
import { onMounted, onUnmounted, ref } from 'vue'
import { gsap, revealUp } from '../lib/scroll'
import { closing, eventInfo } from '../data/content'

const root = ref(null)
let ctx

onMounted(() => {
  ctx = gsap.context(() => {
    revealUp('.closing-stagger', { trigger: root.value })
    gsap.to('.closing-heart', {
      scale: 1.18,
      duration: 1,
      yoyo: true,
      repeat: -1,
      ease: 'sine.inOut',
    })
  }, root.value)
})

onUnmounted(() => ctx?.revert())
</script>

<template>
  <section ref="root" class="flex min-h-[75svh] flex-col items-center justify-center px-6 pb-28 text-center">
    <div class="closing-stagger closing-heart text-5xl">🤍</div>
    <h2 class="closing-stagger script-title mt-4 text-6xl md:text-8xl">{{ closing.script }}</h2>
    <p class="closing-stagger mt-5 max-w-md text-inksoft md:text-lg">{{ closing.note }}</p>
    <p class="closing-stagger eyebrow mt-8">{{ eventInfo.day }} · {{ eventInfo.dateLong }}</p>
    <p class="closing-stagger mt-14 text-xs tracking-[0.25em] text-inksoft/70 uppercase">
      made with 🤍 · 2026
    </p>
  </section>
</template>
