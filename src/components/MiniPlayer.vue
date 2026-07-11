<script setup>
import { onMounted, ref } from 'vue'
import gsap from 'gsap'
import { useAudioPlayer } from '../composables/useAudioPlayer'

const { state, currentTrack, toggle, next, prev } = useAudioPlayer()
const root = ref(null)

onMounted(() => {
  gsap.from(root.value, { y: 90, autoAlpha: 0, duration: 0.9, ease: 'power3.out', delay: 1.2 })
})
</script>

<template>
  <div
    ref="root"
    class="fixed bottom-[calc(1rem+env(safe-area-inset-bottom))] left-1/2 z-40 flex max-w-[94vw] -translate-x-1/2 items-center gap-3 rounded-full border border-petal bg-white/85 py-2 pr-2 pl-4 shadow-[0_14px_35px_-10px_rgba(201,79,124,0.45)] backdrop-blur"
  >
    <span class="eq shrink-0" :class="{ paused: !state.playing }"><i></i><i></i><i></i></span>
    <span class="min-w-0">
      <span class="block max-w-[150px] truncate text-sm font-bold text-ink md:max-w-[220px]">
        {{ currentTrack.title }}
      </span>
      <span class="block max-w-[150px] truncate text-xs text-inksoft md:max-w-[220px]">
        {{ currentTrack.artist }}
      </span>
    </span>

    <span class="flex shrink-0 gap-1.5">
      <button class="ctl" aria-label="Previous" @click="prev">
        <svg viewBox="0 0 24 24" class="h-4 w-4 fill-current"><path d="M6 6h2v12H6zm3.5 6 8.5 6V6z" /></svg>
      </button>
      <button class="ctl ctl-main" aria-label="Play / Pause" @click="toggle">
        <svg v-if="state.playing" viewBox="0 0 24 24" class="h-5 w-5 fill-current">
          <path d="M6 19h4V5H6zm8-14v14h4V5z" />
        </svg>
        <svg v-else viewBox="0 0 24 24" class="h-5 w-5 fill-current"><path d="M8 5v14l11-7z" /></svg>
      </button>
      <button class="ctl" aria-label="Next" @click="next">
        <svg viewBox="0 0 24 24" class="h-4 w-4 fill-current"><path d="m6 18 8.5-6L6 6zM16 6v12h2V6z" /></svg>
      </button>
    </span>
  </div>
</template>

<style scoped>
.ctl {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 38px;
  height: 38px;
  border-radius: 9999px;
  border: 1.5px solid var(--color-softpink);
  color: var(--color-rose);
  background: transparent;
  cursor: pointer;
  transition: all 0.2s ease;
}
.ctl:hover {
  background: var(--color-blush);
}
.ctl-main {
  background: var(--color-rose);
  border-color: var(--color-rose);
  color: #fff;
}
.ctl-main:hover {
  background: var(--color-deeprose);
}

.eq {
  display: inline-flex;
  gap: 2px;
  align-items: flex-end;
  height: 16px;
}
.eq i {
  width: 3px;
  height: 100%;
  background: var(--color-rose);
  border-radius: 2px;
  transform-origin: bottom;
  animation: eq-bounce 0.9s ease-in-out infinite;
}
.eq.paused i {
  animation-play-state: paused;
  transform: scaleY(0.3);
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
