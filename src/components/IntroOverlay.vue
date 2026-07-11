<script setup>
import { onMounted, onUnmounted, ref } from 'vue'
import gsap from 'gsap'

const emit = defineEmits(['open', 'gone'])
const root = ref(null)
const card = ref(null)
const heart = ref(null)
let opened = false
let ctx

onMounted(() => {
  ctx = gsap.context(() => {
    gsap.from(card.value, { y: 30, autoAlpha: 0, duration: 1, ease: 'power3.out', delay: 0.2 })
    gsap.to(heart.value, {
      scale: 1.15,
      duration: 0.9,
      yoyo: true,
      repeat: -1,
      ease: 'sine.inOut',
    })
  }, root.value)
})

onUnmounted(() => ctx?.revert())

function open() {
  if (opened) return
  opened = true
  emit('open')
  gsap
    .timeline({ onComplete: () => emit('gone') })
    .to(card.value, { y: -40, autoAlpha: 0, scale: 0.95, duration: 0.5, ease: 'power2.in' })
    .to(root.value, { autoAlpha: 0, duration: 0.7, ease: 'power2.inOut' }, '-=0.15')
}
</script>

<template>
  <div
    ref="root"
    class="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-b from-white via-blush to-petal px-6"
  >
    <div
      ref="card"
      class="soft-card flex max-h-[92svh] flex-col items-center overflow-y-auto px-10 py-12 text-center md:px-16"
    >
      <div ref="heart" class="mb-5 text-5xl">🤍</div>
      <p class="script-title text-5xl md:text-6xl">for you</p>
      <p class="mt-3 text-sm font-medium tracking-[0.25em] text-inksoft uppercase">
        ada sesuatu untukmu
      </p>
      <button
        class="mt-8 cursor-pointer rounded-full bg-rose px-10 py-3 font-semibold tracking-wide text-white shadow-lg shadow-rose/30 transition-transform duration-200 hover:scale-105"
        @click="open"
      >
        Buka 🤍
      </button>
      <p class="mt-4 text-xs text-inksoft">nyalakan suaramu ya</p>
    </div>
  </div>
</template>
