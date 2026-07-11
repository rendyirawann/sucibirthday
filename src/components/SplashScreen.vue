<script setup>
import { onMounted, onUnmounted, ref } from 'vue'
import gsap from 'gsap'
import { birthdayText } from '../data/content'
import { asset } from '../lib/assets'

const emit = defineEmits(['done'])

const root = ref(null)
const countdownEl = ref(null)
const messageEl = ref(null)
const gifEl = ref(null)
const count = ref(3)

// Pecah per kata supaya baris patah di spasi, lalu per huruf untuk stagger
const words = birthdayText.split(' ')
let ctx

onMounted(() => {
  ctx = gsap.context(() => {
    // Countdown mulai saat pintu masih membuka — angka tampak lewat celah pintu
    const tl = gsap.timeline({ delay: 0.4, onComplete: () => emit('done') })

    // Gif tampil sejak countdown, seperti versi asli
    tl.fromTo(
      gifEl.value,
      { scale: 0, autoAlpha: 0 },
      { scale: 1, autoAlpha: 1, duration: 0.9, ease: 'elastic.out(1, 0.5)' },
      0,
    )

    ;[3, 2, 1].forEach((n) => {
      tl.call(() => (count.value = n))
      tl.fromTo(
        countdownEl.value,
        { scale: 2.4, autoAlpha: 0, filter: 'blur(8px)' },
        { scale: 1, autoAlpha: 1, filter: 'blur(0px)', duration: 0.4, ease: 'back.out(2)' },
      )
      tl.to(countdownEl.value, { scale: 0.5, autoAlpha: 0, duration: 0.25, ease: 'power2.in' }, '+=0.2')
    })

    tl.set(countdownEl.value, { display: 'none' })
    tl.set(messageEl.value, { opacity: 1 })
    tl.fromTo(
      '.birthday-char',
      { autoAlpha: 0, y: 45, rotationX: -90, transformPerspective: 600 },
      { autoAlpha: 1, y: 0, rotationX: 0, duration: 0.5, ease: 'back.out(1.8)', stagger: 0.02 },
    )
    tl.to(root.value, { autoAlpha: 0, duration: 0.9, ease: 'power2.inOut' }, '+=1.5')
  }, root.value)
})

onUnmounted(() => ctx?.revert())
</script>

<template>
  <div
    ref="root"
    class="fixed inset-0 z-40 flex flex-col items-center justify-center bg-p3-dark px-4"
  >
    <div ref="countdownEl" class="text-glow-pink text-8xl font-bold opacity-0 md:text-9xl">
      {{ count }}
    </div>

    <h1
      ref="messageEl"
      class="text-glow-pink-lg m-0 text-center text-4xl leading-tight font-bold opacity-0 md:text-6xl"
    >
      <span v-for="(word, wi) in words" :key="wi" class="inline-block whitespace-nowrap">
        <span v-for="(ch, ci) in word.split('')" :key="ci" class="birthday-char inline-block">{{ ch }}</span
        ><span class="inline-block">&nbsp;</span>
      </span>
    </h1>

    <div ref="gifEl" class="mt-8 w-[260px] opacity-0 md:w-[300px]">
      <img
        :src="asset('img/birthday.gif')"
        alt="Happy Birthday"
        class="block w-full rounded-[10px] shadow-[0_0_20px_var(--color-p3-pink)]"
      />
    </div>
  </div>
</template>
