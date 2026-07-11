<script setup>
import { onMounted, onUnmounted, ref } from 'vue'
import gsap from 'gsap'

const emit = defineEmits(['open', 'gone'])

const root = ref(null)
const leftDoor = ref(null)
const rightDoor = ref(null)
const message = ref(null)
const glow = ref(null)
let opened = false
let ctx

onMounted(() => {
  ctx = gsap.context(() => {
    gsap.from('.door-word', {
      y: 45,
      opacity: 0,
      filter: 'blur(8px)',
      stagger: 0.08,
      duration: 0.9,
      ease: 'power3.out',
      delay: 0.3,
    })
    gsap.from('.door-cta', {
      opacity: 0,
      y: 20,
      duration: 0.8,
      ease: 'power2.out',
      delay: 1.1,
    })
    gsap.to('.door-cta', {
      boxShadow: '0 0 25px #ff69b4',
      duration: 1,
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

  const tl = gsap.timeline({ onComplete: () => emit('gone') })
  tl.to(message.value, { scale: 1.2, autoAlpha: 0, duration: 0.5, ease: 'power2.in' })
    .to(glow.value, { opacity: 1, scaleX: 30, duration: 0.5, ease: 'power2.in' }, '-=0.25')
    .to(leftDoor.value, { xPercent: -104, rotationY: 24, duration: 1.5, ease: 'power4.inOut' }, '-=0.1')
    .to(rightDoor.value, { xPercent: 104, rotationY: -24, duration: 1.5, ease: 'power4.inOut' }, '<')
    .to(glow.value, { opacity: 0, duration: 0.6 }, '-=0.9')
    .to(root.value, { autoAlpha: 0, duration: 0.4 }, '-=0.4')
}
</script>

<template>
  <div
    ref="root"
    class="fixed inset-0 z-50 cursor-pointer overflow-hidden [perspective:1400px]"
    @click="open"
  >
    <div ref="leftDoor" class="door absolute top-0 left-0 h-full w-[50.5%] origin-left"></div>
    <div ref="rightDoor" class="door absolute top-0 right-0 h-full w-[50.5%] origin-right"></div>

    <!-- Cahaya di celah tengah saat pintu terbuka -->
    <div
      ref="glow"
      class="absolute top-0 left-1/2 h-full w-1 -translate-x-1/2 bg-p3-pink opacity-0 blur-md"
    ></div>

    <div
      ref="message"
      class="absolute top-1/2 left-1/2 w-[90%] -translate-x-1/2 -translate-y-1/2 text-center"
    >
      <h1 class="text-glow-pink m-0 text-5xl font-bold md:text-6xl">
        <span v-for="(word, i) in 'Hey, Look at This! She already here!'.split(' ')" :key="i" class="door-word inline-block">{{ word }}&nbsp;</span>
      </h1>
      <p
        class="door-cta mt-6 inline-block border border-p3-light px-5 py-2 text-xl tracking-[2px] text-p3-light md:text-2xl"
      >
        Click to Open Your First Gift Sayang! 🤍
      </p>
    </div>
  </div>
</template>

<style scoped>
.door {
  background-color: var(--color-p3-dark);
  border: 2px solid var(--color-p3-pink);
  box-shadow: inset 0 0 60px rgba(255, 105, 180, 0.25);
}
</style>
