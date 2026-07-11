<script setup>
import { onMounted, onUnmounted, ref } from 'vue'
import { gsap, revealUp } from '../lib/scroll'
import { bubbles } from '../data/content'
import { asset } from '../lib/assets'
import { useLightbox } from '../composables/useLightbox'
import { lazyPlayVideos } from '../lib/lazyVideo'

const root = ref(null)
const { show } = useLightbox()
let ctx
let disposeLazy

const SIZES = [120, 160, 96, 180, 128, 150, 104, 168]
function size(i) {
  return SIZES[i % SIZES.length]
}
// offset vertikal kecil supaya susunannya tidak kaku
function lift(i) {
  return ((i * 53) % 48) - 24
}

onMounted(() => {
  disposeLazy = lazyPlayVideos(root.value)
  ctx = gsap.context(() => {
    revealUp('.bubble-head', { trigger: root.value })
    gsap.set('.bubble', { autoAlpha: 0, scale: 0.6 })
    gsap.to('.bubble', {
      autoAlpha: 1,
      scale: 1,
      duration: 0.9,
      ease: 'back.out(1.6)',
      stagger: 0.1,
      scrollTrigger: { trigger: '.bubble-field', start: 'top 80%', once: true },
    })
    // mengambang pelan, tiap bubble beda irama
    gsap.utils.toArray('.bubble-float').forEach((el) => {
      gsap.to(el, {
        y: gsap.utils.random(-18, -34),
        duration: gsap.utils.random(2.4, 4),
        yoyo: true,
        repeat: -1,
        ease: 'sine.inOut',
        delay: gsap.utils.random(0, 1.5),
      })
      gsap.to(el, {
        rotation: gsap.utils.random(-5, 5),
        duration: gsap.utils.random(3, 5),
        yoyo: true,
        repeat: -1,
        ease: 'sine.inOut',
      })
    })
  }, root.value)
})

onUnmounted(() => {
  disposeLazy?.()
  ctx?.revert()
})
</script>

<template>
  <section ref="root" class="px-6 py-20 md:py-28">
    <div class="bubble-head mx-auto mb-14 max-w-xl text-center">
      <h2 class="script-title text-6xl md:text-7xl">Memory Bubbles</h2>
      <p class="mt-3 text-inksoft">gelembung-gelembung kecil berisi kita — coba klik ✨</p>
    </div>

    <div class="bubble-field mx-auto flex max-w-4xl flex-wrap items-center justify-center gap-6 md:gap-10">
      <div
        v-for="(b, i) in bubbles"
        :key="b.src"
        class="bubble"
        :style="{ marginTop: lift(i) + 'px' }"
      >
        <div
          class="bubble-float group relative cursor-pointer overflow-hidden rounded-full shadow-[0_18px_40px_-12px_rgba(201,79,124,0.45)] ring-4 ring-white transition-shadow duration-300 hover:shadow-[0_22px_50px_-10px_rgba(201,79,124,0.6)]"
          :style="{ width: size(i) + 'px', height: size(i) + 'px' }"
          @click="show(b.type, asset(b.src))"
        >
          <img
            v-if="b.type === 'image'"
            :src="asset(b.src)"
            alt="memory bubble"
            loading="lazy"
            class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <video
            v-else
            :src="asset(b.src)"
            data-lazy
            preload="metadata"
            loop
            muted
            playsinline
            class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
          ></video>
          <!-- kilau kaca -->
          <div
            class="pointer-events-none absolute inset-0 rounded-full bg-[radial-gradient(circle_at_30%_22%,rgba(255,255,255,0.55),transparent_45%)]"
          ></div>
        </div>
      </div>
    </div>
  </section>
</template>
