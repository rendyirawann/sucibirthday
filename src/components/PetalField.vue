<script setup>
// Kelopak bunga berguguran — selalu terpasang selama aplikasi hidup.
import { onMounted, onUnmounted, ref } from 'vue'
import gsap from 'gsap'
import { asset } from '../lib/assets'

const NUM_PETALS = 22
const root = ref(null)
const petalSrc = asset('img/petal.png')
let ctx
let alive = true

onMounted(() => {
  ctx = gsap.context(() => {
    const petals = Array.from(root.value.children)

    function fall(petal, first) {
      if (!alive) return
      gsap.fromTo(
        petal,
        { y: -80, x: gsap.utils.random(0, window.innerWidth) },
        {
          y: window.innerHeight + 100,
          duration: gsap.utils.random(6, 13),
          delay: first ? gsap.utils.random(0, 8) : 0,
          ease: 'none',
          onComplete: () => fall(petal, false),
        },
      )
    }

    petals.forEach((petal) => {
      gsap.set(petal, {
        scale: gsap.utils.random(0.5, 1.1),
        opacity: gsap.utils.random(0.5, 0.9),
        filter: `blur(${gsap.utils.random(0, 1.2)}px)`,
      })
      // Goyangan horizontal + putaran, terpisah dari tween jatuh
      gsap.to(petal, {
        xPercent: '+=120',
        duration: gsap.utils.random(1.5, 3.5),
        yoyo: true,
        repeat: -1,
        ease: 'sine.inOut',
      })
      gsap.to(petal, {
        rotation: gsap.utils.random(360, 1080),
        duration: gsap.utils.random(6, 14),
        repeat: -1,
        ease: 'none',
      })
      fall(petal, true)
    })
  }, root.value)
})

onUnmounted(() => {
  alive = false
  ctx?.revert()
})
</script>

<template>
  <div ref="root" class="pointer-events-none fixed inset-0 z-[5] overflow-hidden">
    <img
      v-for="i in NUM_PETALS"
      :key="i"
      :src="petalSrc"
      alt=""
      class="absolute top-0 left-0 h-6 w-6 select-none"
    />
  </div>
</template>
