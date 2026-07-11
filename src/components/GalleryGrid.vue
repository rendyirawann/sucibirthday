<script setup>
import { onMounted, onUnmounted, ref } from 'vue'
import gsap from 'gsap'
import { galleryCount } from '../data/content'
import { asset } from '../lib/assets'

const root = ref(null)
let ctx
let alive = true

onMounted(() => {
  ctx = gsap.context(() => {
    const items = gsap.utils.toArray('.gallery-item', root.value)

    gsap.to(root.value, { opacity: 0.3, duration: 1.2, delay: 0.3, ease: 'power1.inOut' })
    // Kolase terbangun pelan satu foto per detik, seperti versi asli
    gsap.fromTo(
      items,
      { opacity: 0, scale: 0.7, rotation: () => gsap.utils.random(-8, 8) },
      {
        opacity: 1,
        scale: 1,
        rotation: 0,
        duration: 0.8,
        ease: 'back.out(1.4)',
        stagger: 1,
        delay: 0.4,
      },
    )

    // Sesekali satu foto "menyala" pelan supaya galeri terasa hidup
    function glimmer() {
      if (!alive) return
      const item = gsap.utils.random(items)
      gsap.to(item, {
        filter: 'brightness(2.1)',
        scale: 1.07,
        duration: 0.7,
        yoyo: true,
        repeat: 1,
        ease: 'sine.inOut',
        onComplete: () => gsap.delayedCall(gsap.utils.random(0.5, 1.8), glimmer),
      })
    }
    // Mulai setelah seluruh kolase muncul
    gsap.delayedCall(27, glimmer)
  }, root.value)
})

onUnmounted(() => {
  alive = false
  ctx?.revert()
})
</script>

<template>
  <div ref="root" class="gallery-container themed-scroll opacity-0">
    <img
      v-for="i in galleryCount"
      :key="i"
      :src="asset(`img/gallery/${i}.jpg`)"
      alt=""
      class="gallery-item"
    />
  </div>
</template>

<style scoped>
.gallery-container {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 45vw;
  height: 70vh;
  border: 2px solid var(--color-p3-pink);
  box-shadow: 0 0 30px var(--color-p3-pink);
  border-radius: 10px;
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  grid-template-rows: repeat(5, 1fr);
  gap: 4px;
  padding: 4px;
  pointer-events: none;
  z-index: 2;
}

.gallery-item {
  width: 100%;
  height: 100%;
  /* min-size 0 mencegah ukuran intrinsik foto membesarkan track grid */
  min-width: 0;
  min-height: 0;
  object-fit: cover;
  border-radius: 4px;
}

@media (max-width: 768px) and (orientation: portrait) {
  .gallery-container {
    width: 90vw;
    height: auto;
    grid-template-rows: auto;
    top: 5%;
    transform: translateX(-50%);
    overflow-y: auto;
  }
  .gallery-item {
    aspect-ratio: 1 / 1;
  }
}
</style>
