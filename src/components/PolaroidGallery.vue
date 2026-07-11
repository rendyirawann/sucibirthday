<script setup>
import { onMounted, onUnmounted, ref } from 'vue'
import { gsap, ScrollTrigger, revealUp } from '../lib/scroll'
import { photos } from '../data/content'
import { asset } from '../lib/assets'
import { useLightbox } from '../composables/useLightbox'

const root = ref(null)
const { show } = useLightbox()
let ctx

// Pola bergaya undangan digital: 1 foto besar, lalu 2x dua kolom, berulang.
const pattern = ['feature', 'pair', 'pair']
const blocks = []
{
  let i = 0
  let p = 0
  while (i < photos.length) {
    const kind = pattern[p % pattern.length]
    const take = kind === 'feature' ? 1 : 2
    const items = photos.slice(i, i + take)
    blocks.push({ kind: items.length === 1 ? 'feature' : 'pair', items })
    i += items.length
    p++
  }
}

// Rotasi kecil deterministik untuk kartu polaroid dua kolom
function rot(bi, pi) {
  return (((bi * 7 + pi * 13) % 5) - 2)
}

onMounted(() => {
  ctx = gsap.context(() => {
    revealUp('.lane-head', { trigger: root.value })
    gsap.set('.lane-item', { autoAlpha: 0, y: 55 })
    ScrollTrigger.batch('.lane-item', {
      start: 'top 88%',
      once: true,
      onEnter: (batch) =>
        gsap.to(batch, { autoAlpha: 1, y: 0, duration: 0.9, ease: 'power3.out', stagger: 0.12 }),
    })
  }, root.value)
})

onUnmounted(() => ctx?.revert())
</script>

<template>
  <section ref="root" class="px-6 py-20 md:py-28">
    <div class="lane-head mx-auto mb-14 max-w-xl text-center">
      <h2 class="script-title text-6xl md:text-7xl">Memory Lane</h2>
      <p class="mt-3 text-inksoft">potongan-potongan cerita kita — klik fotonya ya 🤍</p>
    </div>

    <div class="mx-auto flex max-w-3xl flex-col gap-10 md:gap-14">
      <template v-for="(block, bi) in blocks" :key="bi">
        <!-- ornamen pembatas tiap masuk siklus baru -->
        <div
          v-if="bi > 0 && block.kind === 'feature'"
          class="lane-item flex items-center justify-center gap-4"
        >
          <span class="h-px w-16 bg-softpink/70"></span>
          <span class="text-xl">🤍</span>
          <span class="h-px w-16 bg-softpink/70"></span>
        </div>

        <!-- satu foto besar -->
        <figure
          v-if="block.kind === 'feature'"
          class="lane-item cursor-pointer transition-transform duration-300 hover:scale-[1.015]"
          @click="show('image', asset(block.items[0].src))"
        >
          <img
            :src="asset(block.items[0].src)"
            :alt="block.items[0].caption || 'memory'"
            loading="lazy"
            class="aspect-[4/5] w-full rounded-[2rem] object-cover shadow-[0_25px_60px_-20px_rgba(201,79,124,0.45)] ring-8 ring-white md:aspect-square"
          />
          <figcaption
            v-if="block.items[0].caption"
            class="mt-4 text-center font-medium text-inksoft"
          >
            {{ block.items[0].caption }}
          </figcaption>
        </figure>

        <!-- dua kolom polaroid -->
        <div v-else class="grid grid-cols-2 gap-4 md:gap-6">
          <figure
            v-for="(ph, pi) in block.items"
            :key="ph.src"
            class="lane-item cursor-pointer rounded-md bg-white p-2 pb-7 shadow-[0_14px_35px_-14px_rgba(201,79,124,0.4)] transition-all duration-300 hover:z-10 hover:!rotate-0 hover:scale-[1.04] hover:shadow-[0_20px_45px_-14px_rgba(201,79,124,0.55)]"
            :style="{ rotate: rot(bi, pi) + 'deg' }"
            @click="show('image', asset(ph.src))"
          >
            <img
              :src="asset(ph.src)"
              :alt="ph.caption || 'memory'"
              loading="lazy"
              class="aspect-[4/5] w-full rounded-sm object-cover"
            />
            <figcaption
              v-if="ph.caption"
              class="mt-2 text-center text-xs font-medium text-inksoft"
            >
              {{ ph.caption }}
            </figcaption>
          </figure>
        </div>
      </template>
    </div>
  </section>
</template>
