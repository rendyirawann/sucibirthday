<script setup>
import { onMounted, ref } from 'vue'
import Lenis from 'lenis'
import { gsap, ScrollTrigger } from './lib/scroll'
import IntroOverlay from './components/IntroOverlay.vue'
import FloatingBits from './components/FloatingBits.vue'
import FloatingMemories from './components/FloatingMemories.vue'
import MarqueeStrip from './components/MarqueeStrip.vue'
import HeroSection from './components/HeroSection.vue'
import LetterSection from './components/LetterSection.vue'
import PolaroidGallery from './components/PolaroidGallery.vue'
import CubeSection from './components/CubeSection.vue'
import PlaylistSection from './components/PlaylistSection.vue'
import VideoFinale from './components/VideoFinale.vue'
import ClosingSection from './components/ClosingSection.vue'
import MiniPlayer from './components/MiniPlayer.vue'
import Lightbox from './components/Lightbox.vue'
import { useAudioPlayer } from './composables/useAudioPlayer'
import { lenisRef } from './lib/lenisRef'

const opened = ref(false)
const introVisible = ref(true)
const { start } = useAudioPlayer()
let lenis

onMounted(() => {
  // Smooth scroll (Lenis) + sinkron dengan ScrollTrigger
  lenis = new Lenis({ duration: 1.15 })
  lenisRef.current = lenis
  lenis.on('scroll', ScrollTrigger.update)
  gsap.ticker.add((time) => lenis.raf(time * 1000))
  gsap.ticker.lagSmoothing(0)
  lenis.stop() // terkunci selama intro
})

function onOpen() {
  // Dipanggil sinkron dari klik user — autoplay musik diizinkan browser
  start()
  opened.value = true
  lenis?.start()
  window.scrollTo(0, 0)
  ScrollTrigger.refresh()
}
</script>

<template>
  <!-- Gradien latar dipasang fixed (background-attachment:fixed diabaikan iOS) -->
  <div class="bg-scene pointer-events-none fixed inset-0"></div>
  <FloatingBits />
  <!-- Memory bubbles melayang di seluruh halaman, di belakang konten -->
  <FloatingMemories />

  <main class="relative z-10">
    <HeroSection :opened="opened" />
    <MarqueeStrip />
    <LetterSection />
    <PolaroidGallery />
    <CubeSection />
    <PlaylistSection />
    <VideoFinale />
    <ClosingSection />
  </main>

  <MiniPlayer v-if="opened" />
  <Lightbox />
  <IntroOverlay v-if="introVisible" @open="onOpen" @gone="introVisible = false" />
</template>
