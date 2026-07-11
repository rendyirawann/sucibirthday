<script setup>
import { nextTick, onMounted, onUnmounted, ref, watch } from 'vue'
import gsap from 'gsap'
import { useLightbox } from '../composables/useLightbox'
import { lenisRef } from '../lib/lenisRef'

const { state, hide } = useLightbox()
const panel = ref(null)

function onKeydown(e) {
  if (e.key === 'Escape' && state.open) hide()
}

onMounted(() => document.addEventListener('keydown', onKeydown))
onUnmounted(() => document.removeEventListener('keydown', onKeydown))

watch(
  () => state.open,
  async (open) => {
    // Kunci scroll halaman selama lightbox terbuka
    if (open) {
      lenisRef.current?.stop()
      document.documentElement.style.overflow = 'hidden'
    } else {
      lenisRef.current?.start()
      document.documentElement.style.overflow = ''
    }
    if (!open) return
    await nextTick()
    gsap.fromTo(
      panel.value,
      { scale: 0.85, autoAlpha: 0, y: 20 },
      { scale: 1, autoAlpha: 1, y: 0, duration: 0.45, ease: 'back.out(1.6)' },
    )
  },
)
</script>

<template>
  <div
    v-if="state.open"
    class="fixed inset-0 z-[60] flex items-center justify-center bg-[rgba(255,240,246,0.88)] p-4 backdrop-blur-md md:p-10"
    @click.self="hide"
  >
    <div ref="panel" class="relative max-h-full max-w-3xl">
      <img
        v-if="state.type === 'image'"
        :src="state.src"
        alt="memory"
        class="max-h-[82vh] w-auto max-w-full rounded-2xl shadow-2xl ring-8 ring-white"
      />
      <video
        v-else
        :src="state.src"
        autoplay
        loop
        playsinline
        controls
        class="max-h-[82vh] w-auto max-w-full rounded-2xl shadow-2xl ring-8 ring-white"
      ></video>

      <button
        class="absolute -top-3 -right-3 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-rose text-white shadow-lg transition-transform hover:scale-110"
        aria-label="Tutup"
        @click="hide"
      >
        <svg viewBox="0 0 24 24" class="h-5 w-5 fill-none stroke-current stroke-2">
          <path d="M6 6l12 12M18 6L6 18" stroke-linecap="round" />
        </svg>
      </button>
    </div>
  </div>
</template>
