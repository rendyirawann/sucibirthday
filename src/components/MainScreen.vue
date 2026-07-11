<script setup>
import { onMounted, onUnmounted, ref, watch } from 'vue'
import gsap from 'gsap'
import GalleryGrid from './GalleryGrid.vue'
import VideoCube from './VideoCube.vue'
import MediaPlayer from './MediaPlayer.vue'
import NavMenu from './NavMenu.vue'
import MissionsView from './MissionsView.vue'

const view = ref('menu') // 'menu' | 'missions'
const playerOpen = ref(false)
const root = ref(null)
const waves = ref(null)
const menuLayer = ref(null)
let ctx

function onKeydown(e) {
  if (e.key === 'Escape' && view.value === 'missions') view.value = 'menu'
}

// Klik di luar panel player (dan di luar kubus) menutup player —
// penting di mobile, karena panel yang terbuka menutupi kubus.
function onDocClick(e) {
  if (!playerOpen.value) return
  if (e.target.closest('.player-panel') || e.target.closest('.cube-anchor')) return
  playerOpen.value = false
}

onMounted(() => {
  document.addEventListener('keydown', onKeydown)
  document.addEventListener('click', onDocClick)
  ctx = gsap.context(() => {
    gsap.from(root.value, { autoAlpha: 0, duration: 1 })
    gsap.to(waves.value, {
      backgroundPosition: '256px 0px',
      duration: 18,
      repeat: -1,
      ease: 'none',
    })
  }, root.value)
})

onUnmounted(() => {
  document.removeEventListener('keydown', onKeydown)
  document.removeEventListener('click', onDocClick)
  ctx?.revert()
})

watch(view, (v) => {
  if (v === 'missions') {
    // playerOpen sengaja tidak di-reset: player yang terbuka muncul lagi saat kembali
    gsap.to(menuLayer.value, { autoAlpha: 0, x: -50, duration: 0.45, ease: 'power2.in' })
  } else {
    // clearProps transform: sisa translate() inline membuat stacking context baru
    // yang menjatuhkan kubus/nav/player ke bawah lapisan kelopak bunga
    gsap.to(menuLayer.value, {
      autoAlpha: 1,
      x: 0,
      duration: 0.6,
      ease: 'power2.out',
      delay: 0.1,
      clearProps: 'transform',
    })
  }
})
</script>

<template>
  <div ref="root" class="relative h-full w-full overflow-hidden">
    <div ref="waves" class="waves pointer-events-none absolute inset-0 opacity-[0.08]"></div>
    <div class="pointer-events-none absolute inset-0 shadow-[inset_0_0_200px_rgba(0,0,0,0.8)]"></div>

    <div ref="menuLayer" class="absolute inset-0">
      <GalleryGrid />
      <VideoCube :player-open="playerOpen" @toggle-player="playerOpen = !playerOpen" />
      <MediaPlayer :open="playerOpen" />
      <NavMenu
        :disabled="view !== 'menu'"
        :player-open="playerOpen"
        @open-missions="view = 'missions'"
      />
    </div>

    <MissionsView :active="view === 'missions'" @back="view = 'menu'" />
  </div>
</template>

<style scoped>
.waves {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='256' height='256'%3E%3Cg fill='none' stroke='%23ffffff' stroke-width='1.5' stroke-opacity='0.5'%3E%3Cpath d='M0 32 Q32 16 64 32 T128 32 T192 32 T256 32'/%3E%3Cpath d='M0 96 Q32 80 64 96 T128 96 T192 96 T256 96'/%3E%3Cpath d='M0 160 Q32 144 64 160 T128 160 T192 160 T256 160'/%3E%3Cpath d='M0 224 Q32 208 64 224 T128 224 T192 224 T256 224'/%3E%3C/g%3E%3C/svg%3E");
  background-repeat: repeat;
}
</style>
