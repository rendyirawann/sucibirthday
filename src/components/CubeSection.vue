<script setup>
import { onMounted, onUnmounted, ref } from 'vue'
import { gsap, revealUp } from '../lib/scroll'
import { cubeVideos } from '../data/content'
import { asset } from '../lib/assets'
import { lazyPlayVideos } from '../lib/lazyVideo'

const root = ref(null)
const cube = ref(null)
let ctx
let disposeLazy

onMounted(() => {
  disposeLazy = lazyPlayVideos(root.value)
  ctx = gsap.context(() => {
    revealUp('.cube-head, .cube-stage', { trigger: root.value })
    gsap.to(cube.value, {
      rotationY: 360,
      rotationX: 360,
      duration: 32,
      repeat: -1,
      ease: 'none',
    })
  }, root.value)
})

onUnmounted(() => {
  disposeLazy?.()
  ctx?.revert()
})
</script>

<template>
  <section ref="root" class="relative px-6 py-20 text-center md:py-28">
    <div
      class="pointer-events-none absolute top-1/2 left-1/2 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-petal opacity-50 blur-3xl"
    ></div>

    <div class="cube-head relative mx-auto mb-14 max-w-xl">
      <h2 class="script-title text-6xl md:text-7xl">Little Moments</h2>
      <p class="mt-3 text-inksoft">memory cube — video-video kecil kita, terus berputar 🤍</p>
    </div>

    <div class="cube-stage relative mx-auto cube-anchor">
      <div ref="cube" class="cube">
        <div v-for="v in cubeVideos" :key="v.face" class="face" :class="v.face">
          <!-- data-lazy: diputar/dijeda otomatis saat masuk/keluar viewport -->
          <video :src="asset(v.src)" data-lazy preload="metadata" loop muted playsinline></video>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.cube-anchor {
  /* 200px supaya sudut kubus yang berputar tidak terpotong di ponsel sempit */
  --cube-size: 200px;
  width: var(--cube-size);
  height: var(--cube-size);
  perspective: 1000px;
}
@media (min-width: 768px) {
  .cube-anchor {
    --cube-size: 280px;
  }
}

.cube {
  width: 100%;
  height: 100%;
  position: relative;
  transform-style: preserve-3d;
}

.face {
  position: absolute;
  inset: 0;
  border: 4px solid #ffffff;
  border-radius: 10px;
  box-shadow: 0 0 30px rgba(232, 115, 158, 0.35);
  opacity: 0.92;
  overflow: hidden;
}

.face video {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.front  { transform: rotateY(0deg) translateZ(calc(var(--cube-size) / 2)); }
.back   { transform: rotateY(180deg) translateZ(calc(var(--cube-size) / 2)); }
.right  { transform: rotateY(90deg) translateZ(calc(var(--cube-size) / 2)); }
.left   { transform: rotateY(-90deg) translateZ(calc(var(--cube-size) / 2)); }
.top    { transform: rotateX(90deg) translateZ(calc(var(--cube-size) / 2)); }
.bottom { transform: rotateX(-90deg) translateZ(calc(var(--cube-size) / 2)); }
</style>
