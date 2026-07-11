<script setup>
import { onMounted, onUnmounted, ref } from 'vue'
import { gsap, revealUp } from '../lib/scroll'
import { letter } from '../data/content'

const root = ref(null)
let ctx

onMounted(() => {
  ctx = gsap.context(() => {
    revealUp('.letter-stagger', { trigger: root.value })
  }, root.value)
})

onUnmounted(() => ctx?.revert())
</script>

<template>
  <section ref="root" class="px-6 py-20 md:px-12 md:py-28 lg:px-16">
    <div class="grid gap-8 md:grid-cols-[1fr_1.6fr] md:gap-16">
      <div>
        <p class="letter-stagger eyebrow">01 — surat kecil</p>
        <h2 class="letter-stagger script-title mt-4 text-5xl md:text-6xl">{{ letter.greeting }}</h2>
      </div>

      <div class="border-l-2 border-petal pl-6 md:pl-10">
        <p
          v-for="(p, i) in letter.paragraphs"
          :key="i"
          class="letter-stagger mt-4 max-w-2xl leading-relaxed text-ink first:mt-0 md:text-lg"
        >
          {{ p }}
        </p>
        <p class="letter-stagger script-title mt-8 text-3xl text-deeprose">{{ letter.closing }}</p>
      </div>
    </div>
  </section>
</template>
