<script setup>
import { onMounted, onUnmounted, ref } from 'vue'
import { gsap, revealUp } from '../lib/scroll'
import { finale } from '../data/content'
import { asset } from '../lib/assets'
import { useAudioPlayer } from '../composables/useAudioPlayer'

const root = ref(null)
const { pause, resume } = useAudioPlayer()
let ctx

onMounted(() => {
  ctx = gsap.context(() => {
    revealUp('.finale-stagger', { trigger: root.value })
  }, root.value)
})

onUnmounted(() => ctx?.revert())
</script>

<template>
  <section ref="root" class="px-6 py-20 md:px-12 md:py-28 lg:px-16">
    <div class="finale-stagger mb-10 max-w-2xl">
      <p class="eyebrow">05 — a little film</p>
      <h2 class="script-title mt-4 text-6xl md:text-7xl">{{ finale.title }}</h2>
      <p class="mt-3 text-inksoft">{{ finale.sub }}</p>
    </div>

    <div class="finale-stagger mx-auto max-w-5xl">
      <!-- preload none + poster: file video baru diunduh saat ditekan play.
           Musik latar otomatis jeda saat video diputar, lanjut saat selesai. -->
      <video
        :src="asset(finale.src)"
        :poster="asset(finale.poster)"
        controls
        playsinline
        preload="none"
        class="w-full rounded-3xl shadow-[0_25px_60px_-20px_rgba(201,79,124,0.5)] ring-8 ring-white"
        @play="pause"
        @ended="resume"
      ></video>
    </div>
  </section>
</template>
