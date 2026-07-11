<script setup>
import { onMounted, onUnmounted, ref } from 'vue'
import { gsap, revealUp } from '../lib/scroll'
import { letter } from '../data/content'

const root = ref(null)
let ctx

onMounted(() => {
  ctx = gsap.context(() => {
    revealUp('.letter-card', { trigger: root.value })
  }, root.value)
})

onUnmounted(() => ctx?.revert())
</script>

<template>
  <section ref="root" class="px-6 py-20 md:py-28">
    <div class="letter-card soft-card relative mx-auto max-w-2xl px-7 py-10 md:px-14 md:py-14">
      <span class="washi -top-3 left-8 -rotate-6"></span>
      <span class="washi -top-3 right-8 rotate-6"></span>

      <p class="script-title text-4xl md:text-5xl">{{ letter.greeting }}</p>
      <p
        v-for="(p, i) in letter.paragraphs"
        :key="i"
        class="mt-5 leading-relaxed text-ink md:text-lg"
      >
        {{ p }}
      </p>
      <p class="script-title mt-8 text-right text-3xl text-deeprose">{{ letter.closing }}</p>
    </div>
  </section>
</template>
