<script setup>
// Kelopak & hati kecil melayang di belakang konten — lembut dan pelan.
import { onMounted, onUnmounted, ref } from 'vue'
import gsap from 'gsap'
import { asset } from '../lib/assets'

const NUM = 14
const root = ref(null)
const petalSrc = asset('img/petal.png')
let ctx
let alive = true

onMounted(() => {
  ctx = gsap.context(() => {
    const bits = Array.from(root.value.children)

    function fall(bit, first) {
      if (!alive) return
      gsap.fromTo(
        bit,
        { y: -70, x: gsap.utils.random(0, window.innerWidth) },
        {
          y: window.innerHeight + 90,
          duration: gsap.utils.random(12, 22),
          delay: first ? gsap.utils.random(0, 14) : 0,
          ease: 'none',
          onComplete: () => fall(bit, false),
        },
      )
    }

    bits.forEach((bit) => {
      gsap.set(bit, {
        scale: gsap.utils.random(0.4, 0.9),
        opacity: gsap.utils.random(0.25, 0.5),
        filter: `blur(${gsap.utils.random(0, 1.5)}px)`,
      })
      gsap.to(bit, {
        xPercent: '+=140',
        duration: gsap.utils.random(2.5, 4.5),
        yoyo: true,
        repeat: -1,
        ease: 'sine.inOut',
      })
      gsap.to(bit, {
        rotation: gsap.utils.random(240, 720),
        duration: gsap.utils.random(10, 20),
        repeat: -1,
        ease: 'none',
      })
      fall(bit, true)
    })
  }, root.value)
})

onUnmounted(() => {
  alive = false
  ctx?.revert()
})
</script>

<template>
  <div ref="root" class="pointer-events-none fixed inset-0 z-0 overflow-hidden">
    <template v-for="i in NUM" :key="i">
      <img v-if="i % 3 !== 0" :src="petalSrc" alt="" class="absolute top-0 left-0 h-6 w-6 select-none" />
      <svg v-else viewBox="0 0 24 24" class="absolute top-0 left-0 h-5 w-5 fill-softpink">
        <path
          d="M12 21s-6.7-4.3-9.3-8.1C.6 9.7 2 5.6 5.6 4.7c2.1-.5 4.2.4 5.4 2.1h2c1.2-1.7 3.3-2.6 5.4-2.1 3.6.9 5 5 2.9 8.2C18.7 16.7 12 21 12 21z"
        />
      </svg>
    </template>
  </div>
</template>
