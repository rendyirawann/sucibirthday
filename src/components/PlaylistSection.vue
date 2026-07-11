<script setup>
import { onMounted, onUnmounted, ref } from 'vue'
import { gsap, revealUp } from '../lib/scroll'
import { useAudioPlayer } from '../composables/useAudioPlayer'

const root = ref(null)
const { state, playlist, currentTrack, select } = useAudioPlayer()
let ctx

onMounted(() => {
  ctx = gsap.context(() => {
    revealUp('.playlist-stagger', { trigger: root.value })
  }, root.value)
})

onUnmounted(() => ctx?.revert())
</script>

<template>
  <section ref="root" class="px-6 py-20 md:px-12 md:py-28 lg:px-16">
    <div class="grid gap-10 md:grid-cols-[1fr_1.4fr] md:gap-16">
      <!-- kiri: judul + now playing -->
      <div>
        <p class="playlist-stagger eyebrow">04 — our soundtrack</p>
        <h2 class="playlist-stagger script-title mt-4 text-6xl md:text-7xl">Our Soundtrack</h2>
        <p class="playlist-stagger mt-3 max-w-sm text-inksoft">
          lagu-lagu yang rasanya kayak kita — klik untuk memutar 🎧
        </p>
        <div class="playlist-stagger mt-8 hidden md:block">
          <p class="text-xs font-semibold tracking-[0.25em] text-inksoft uppercase">now playing</p>
          <p class="mt-2 text-3xl font-bold text-rose">{{ currentTrack.title }}</p>
          <p class="text-lg text-inksoft">{{ currentTrack.artist }}</p>
        </div>
      </div>

      <!-- kanan: daftar lagu -->
      <div class="playlist-stagger soft-card overflow-hidden">
        <button
          v-for="(track, i) in playlist"
          :key="track.src"
          class="group flex w-full cursor-pointer items-center gap-4 border-b border-petal/60 px-6 py-3.5 text-left transition-colors last:border-b-0 hover:bg-blush"
          :class="{ 'bg-blush': i === state.index }"
          @click="select(i)"
        >
          <span class="w-6 shrink-0 text-center">
            <span v-if="i === state.index && state.playing" class="eq"><i></i><i></i><i></i></span>
            <span v-else class="text-sm font-semibold text-softpink">{{ i + 1 }}</span>
          </span>
          <span class="min-w-0 flex-1">
            <span
              class="block truncate font-semibold"
              :class="i === state.index ? 'text-rose' : 'text-ink'"
            >
              {{ track.title }}
            </span>
            <span class="block truncate text-sm text-inksoft">{{ track.artist }}</span>
          </span>
          <svg
            v-if="i !== state.index"
            viewBox="0 0 24 24"
            class="h-5 w-5 shrink-0 fill-softpink opacity-0 transition-opacity group-hover:opacity-100"
          >
            <path d="M8 5v14l11-7z" />
          </svg>
        </button>
      </div>
    </div>
  </section>
</template>

<style scoped>
.eq {
  display: inline-flex;
  gap: 2px;
  align-items: flex-end;
  height: 14px;
}
.eq i {
  width: 3px;
  height: 100%;
  background: var(--color-rose);
  border-radius: 2px;
  transform-origin: bottom;
  animation: eq-bounce 0.9s ease-in-out infinite;
}
.eq i:nth-child(2) {
  animation-delay: 0.25s;
  height: 75%;
}
.eq i:nth-child(3) {
  animation-delay: 0.45s;
}
@keyframes eq-bounce {
  0%,
  100% {
    transform: scaleY(0.3);
  }
  50% {
    transform: scaleY(1);
  }
}
</style>
