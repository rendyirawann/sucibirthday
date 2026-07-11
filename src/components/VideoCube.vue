<script setup>
import { onMounted, onUnmounted, ref, watch } from 'vue'
import gsap from 'gsap'
import { cubeVideos } from '../data/content'
import { asset } from '../lib/assets'

const props = defineProps({ playerOpen: Boolean })
const emit = defineEmits(['toggle-player'])

const anchor = ref(null)
const shell = ref(null)
const cube = ref(null)
let ctx

onMounted(() => {
  ctx = gsap.context(() => {
    gsap.fromTo(
      shell.value,
      { scale: 0, autoAlpha: 0 },
      { scale: 1, autoAlpha: 1, duration: 1.4, delay: 0.7, ease: 'elastic.out(1, 0.6)' },
    )
    gsap.to(cube.value, {
      rotationY: 360,
      rotationX: 360,
      duration: 25,
      repeat: -1,
      ease: 'none',
    })
  }, anchor.value)
})

watch(
  () => props.playerOpen,
  (open) => {
    // overwrite 'auto' membunuh bagian scale tween entrance yang mungkin masih jalan
    gsap.to(shell.value, { scale: open ? 0.85 : 1, duration: 0.6, ease: 'power3.out', overwrite: 'auto' })
  },
)

onUnmounted(() => ctx?.revert())
</script>

<template>
  <div ref="anchor" class="cube-anchor" @click="emit('toggle-player')">
    <div ref="shell" class="h-full w-full opacity-0">
      <div ref="cube" class="cube">
        <div v-for="v in cubeVideos" :key="v.face" class="face" :class="v.face">
          <video :src="asset(v.src)" autoplay loop muted playsinline></video>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.cube-anchor {
  --cube-size: 300px;
  position: absolute;
  top: 50%;
  left: 48%;
  width: var(--cube-size);
  height: var(--cube-size);
  margin-left: calc(var(--cube-size) / -2);
  margin-top: calc(var(--cube-size) / -2);
  cursor: pointer;
  z-index: 6;
  perspective: 1000px;
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
  border: 2px solid var(--color-p3-pink);
  box-shadow: 0 0 20px var(--color-p3-pink);
  opacity: 0.7;
  overflow: hidden;
  transition: box-shadow 0.3s ease;
}

.cube-anchor:hover .face {
  box-shadow: 0 0 35px var(--color-p3-pink);
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

@media (max-width: 768px) and (orientation: portrait) {
  .cube-anchor {
    --cube-size: 120px;
    left: 50%;
    top: 48%;
    z-index: 12;
  }
}
</style>
