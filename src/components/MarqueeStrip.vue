<script setup>
import { eventInfo, hero } from '../data/content'

const phrase = `HAPPY BIRTHDAY SAYANGKUU ✦ ${hero.name.toUpperCase()} ✦ ${eventInfo.dateDots} ✦ `
</script>

<template>
  <div class="overflow-hidden border-y border-petal/80 bg-white/65 py-3 backdrop-blur">
    <div class="marquee-track">
      <!-- dua salinan identik supaya loop -50% mulus -->
      <span v-for="n in 2" :key="n" class="shrink-0 text-sm font-bold tracking-[0.3em] whitespace-nowrap text-rose">
        {{ phrase.repeat(3) }}
      </span>
    </div>
  </div>
</template>
