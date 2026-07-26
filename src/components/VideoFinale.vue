<script setup>
import { onMounted, onUnmounted, ref } from 'vue'
import { gsap, revealUp } from '../lib/scroll'
import { finale, laneItems } from '../data/content'
import { asset } from '../lib/assets'
import { useAudioPlayer } from '../composables/useAudioPlayer'

const root = ref(null)
const video = ref(null)
const started = ref(false)
const { pause, resume } = useAudioPlayer()
let ctx

const memoryCount = laneItems.length

function play() {
  started.value = true
  video.value.play()
}

onMounted(() => {
  ctx = gsap.context(() => {
    revealUp('.finale-stagger', { trigger: root.value })

    // Layar "membuka" saat masuk viewport — seperti tirai bioskop
    gsap.from('.screen', {
      scaleX: 0.86,
      scaleY: 0.9,
      autoAlpha: 0,
      duration: 1.2,
      ease: 'power3.out',
      scrollTrigger: { trigger: '.screen', start: 'top 85%', once: true },
    })
    // Cahaya proyektor bernapas pelan
    gsap.to('.projector-glow', {
      opacity: 0.55,
      duration: 3.5,
      yoyo: true,
      repeat: -1,
      ease: 'sine.inOut',
    })
  }, root.value)
})

onUnmounted(() => ctx?.revert())
</script>

<template>
  <section ref="root" class="theater relative overflow-hidden py-20 md:py-28">
    <!-- butiran film halus di seluruh section -->
    <div class="grain pointer-events-none absolute inset-0 opacity-[0.12]"></div>
    <!-- pendar proyektor di belakang layar -->
    <div
      class="projector-glow pointer-events-none absolute top-1/2 left-1/2 h-[520px] w-[85%] max-w-4xl -translate-x-1/2 -translate-y-1/2 rounded-full bg-rose/25 opacity-25 blur-[110px]"
    ></div>

    <div class="relative px-6 md:px-12 lg:px-16">
      <div class="finale-stagger mb-3 flex items-center gap-3">
        <span class="h-px w-10 bg-petal/50"></span>
        <p class="eyebrow text-petal/90">06 — now showing</p>
      </div>
      <h2 class="finale-stagger script-title text-6xl text-blush md:text-7xl">
        {{ finale.title }}
      </h2>
      <p class="finale-stagger mt-3 max-w-md text-sm text-petal/70">{{ finale.sub }}</p>

      <!-- layar -->
      <div class="screen relative mx-auto mt-10 max-w-5xl">
        <div
          class="relative overflow-hidden rounded-lg bg-black shadow-[0_40px_90px_-30px_rgba(0,0,0,0.9)] ring-1 ring-petal/20"
        >
          <video
            ref="video"
            :src="asset(finale.src)"
            :poster="asset(finale.poster)"
            :controls="started"
            playsinline
            preload="none"
            class="block aspect-video w-full"
            @play="pause"
            @ended="resume"
            @pause="resume"
          ></video>

          <!-- overlay poster + tombol play, hilang setelah diputar -->
          <button
            v-if="!started"
            class="group absolute inset-0 flex cursor-pointer items-center justify-center bg-black/35 transition-colors hover:bg-black/20"
            aria-label="Putar film"
            @click="play"
          >
            <span
              class="flex h-20 w-20 items-center justify-center rounded-full bg-white/95 shadow-2xl transition-transform duration-300 group-hover:scale-110 md:h-24 md:w-24"
            >
              <svg viewBox="0 0 24 24" class="ml-1 h-8 w-8 fill-rose md:h-10 md:w-10">
                <path d="M8 5v14l11-7z" />
              </svg>
            </span>
          </button>
        </div>

        <!-- keping info ala kredit film -->
        <div
          class="finale-stagger mt-5 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-[0.68rem] tracking-[0.28em] text-petal/55 uppercase"
        >
          <span>7 min 25 s</span>
          <span class="h-1 w-1 rounded-full bg-petal/40"></span>
          <span>{{ memoryCount }} memories</span>
          <span class="h-1 w-1 rounded-full bg-petal/40"></span>
          <span>narrated by abang</span>
          <span class="h-1 w-1 rounded-full bg-petal/40"></span>
          <span>music · cahaya</span>
          <span class="h-1 w-1 rounded-full bg-petal/40"></span>
          <span>2025 – 2026</span>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
/* Pita gelap yang memutus tema pink — kesan masuk ke ruang bioskop */
.theater {
  background:
    radial-gradient(ellipse 70% 60% at 50% 45%, #3a2430 0%, transparent 70%),
    linear-gradient(180deg, #171014 0%, #241722 45%, #171014 100%);
}

/* Butiran film: derau halus yang bergeser tiap frame */
.grain {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3'/%3E%3C/filter%3E%3Crect width='160' height='160' filter='url(%23n)' opacity='0.55'/%3E%3C/svg%3E");
  animation: grain-shift 0.6s steps(3) infinite;
}
@keyframes grain-shift {
  0% {
    transform: translate(0, 0);
  }
  33% {
    transform: translate(-3%, 2%);
  }
  66% {
    transform: translate(2%, -3%);
  }
  100% {
    transform: translate(0, 0);
  }
}

@media (prefers-reduced-motion: reduce) {
  .grain {
    animation: none;
  }
}
</style>
