<script setup>
import { onMounted, ref, watch } from 'vue'
import gsap from 'gsap'
import { useAudioPlayer } from '../composables/useAudioPlayer'

const props = defineProps({ open: Boolean })
const { state, playlist, currentTrack, toggle, next, prev, select } = useAudioPlayer()
const panel = ref(null)

onMounted(() => {
  gsap.set(panel.value, { autoAlpha: 0, x: 60, scale: 0.95 })
})

watch(
  () => props.open,
  (open) => {
    if (open) {
      gsap.to(panel.value, { autoAlpha: 1, x: 0, scale: 1, duration: 0.5, ease: 'power3.out' })
    } else {
      gsap.to(panel.value, { autoAlpha: 0, x: 60, scale: 0.95, duration: 0.35, ease: 'power2.in' })
    }
  },
)
</script>

<template>
  <div class="player-anchor">
    <div ref="panel" class="player-panel">
      <div class="flex items-center justify-between gap-5 px-6 py-4">
        <div class="flex min-w-0 flex-col text-left">
          <div class="flex items-center gap-2">
            <div class="eq shrink-0" :class="{ running: state.playing }">
              <span></span><span></span><span></span><span></span>
            </div>
            <span class="truncate text-lg leading-tight font-bold text-p3-white">
              {{ currentTrack.title }}
            </span>
          </div>
          <span class="text-lg leading-tight text-p3-light">{{ currentTrack.artist }}</span>
        </div>

        <div class="flex shrink-0 gap-2">
          <button class="control-btn" aria-label="Previous" @click="prev">
            <svg viewBox="0 0 24 24" class="h-5 w-5" fill="currentColor">
              <path d="M6 6h2v12H6zm3.5 6 8.5 6V6z" />
            </svg>
          </button>
          <button class="control-btn" aria-label="Play / Pause" @click="toggle">
            <svg v-if="state.playing" viewBox="0 0 24 24" class="h-5 w-5" fill="currentColor">
              <path d="M6 19h4V5H6zm8-14v14h4V5z" />
            </svg>
            <svg v-else viewBox="0 0 24 24" class="h-5 w-5" fill="currentColor">
              <path d="M8 5v14l11-7z" />
            </svg>
          </button>
          <button class="control-btn" aria-label="Next" @click="next">
            <svg viewBox="0 0 24 24" class="h-5 w-5" fill="currentColor">
              <path d="m6 18 8.5-6L6 6zM16 6v12h2V6z" />
            </svg>
          </button>
        </div>
      </div>

      <div class="themed-scroll max-h-[170px] overflow-y-auto border-t border-p3-pink">
        <div
          v-for="(track, i) in playlist"
          :key="track.src"
          class="playlist-item"
          :class="{ active: i === state.index }"
          @click="select(i)"
        >
          <div class="text-sm leading-snug text-p3-white">{{ track.title }}</div>
          <div class="text-base leading-snug text-p3-light">{{ track.artist }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.player-anchor {
  position: absolute;
  top: 50%;
  left: 65%;
  width: 350px;
  z-index: 15;
  transform: translate(-50%, -50%);
  /* Wrapper tidak boleh menghalangi klik elemen di belakangnya saat panel tersembunyi */
  pointer-events: none;
}

.player-panel {
  pointer-events: auto;
  background-color: rgba(0, 0, 0, 0.85);
  border: 2px solid var(--color-p3-pink);
  border-radius: 10px;
  box-shadow: 0 0 20px rgba(255, 105, 180, 0.5);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.control-btn {
  width: 45px;
  height: 45px;
  border-radius: 9999px;
  border: 2px solid var(--color-p3-light);
  color: var(--color-p3-light);
  background: transparent;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
}
.control-btn:hover {
  background: var(--color-p3-pink);
  border-color: var(--color-p3-pink);
  color: var(--color-p3-white);
}

.playlist-item {
  padding: 0.7rem 1.5rem;
  cursor: pointer;
  border-bottom: 1px solid rgba(255, 105, 180, 0.1);
  transition: background-color 0.2s;
}
.playlist-item:last-child {
  border-bottom: none;
}
.playlist-item:hover {
  background-color: rgba(255, 105, 180, 0.1);
}
.playlist-item.active {
  background-color: rgba(255, 105, 180, 0.2);
  font-weight: bold;
}

/* Equalizer kecil di samping judul lagu */
.eq {
  display: flex;
  gap: 2px;
  align-items: flex-end;
  height: 14px;
}
.eq span {
  width: 3px;
  height: 100%;
  background: var(--color-p3-pink);
  transform-origin: bottom;
  transform: scaleY(0.25);
  animation: eq-bounce 0.9s ease-in-out infinite;
  animation-play-state: paused;
}
.eq.running span {
  animation-play-state: running;
}
.eq span:nth-child(2) {
  animation-delay: 0.2s;
  height: 80%;
}
.eq span:nth-child(3) {
  animation-delay: 0.35s;
}
.eq span:nth-child(4) {
  animation-delay: 0.5s;
  height: 70%;
}
@keyframes eq-bounce {
  0%,
  100% {
    transform: scaleY(0.25);
  }
  50% {
    transform: scaleY(1);
  }
}

@media (max-width: 768px) and (orientation: portrait) {
  .player-anchor {
    left: 50%;
    top: 60%;
    width: 85%;
    max-width: 350px;
  }
}
</style>
