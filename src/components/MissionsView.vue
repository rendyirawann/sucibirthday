<script setup>
import { onMounted, ref, watch } from 'vue'
import gsap from 'gsap'
import { missions } from '../data/content'
import { asset } from '../lib/assets'

const props = defineProps({ active: Boolean })
const emit = defineEmits(['back'])
const root = ref(null)

onMounted(() => {
  gsap.set(root.value, { autoAlpha: 0 })
})

watch(
  () => props.active,
  (active) => {
    const heads = root.value.querySelectorAll('.missions-head')
    const cards = root.value.querySelectorAll('.mission-card')

    // Matikan tween buka/tutup yang masih berjalan agar toggle cepat tidak
    // meninggalkan layar dalam keadaan setengah-tersembunyi
    gsap.killTweensOf([root.value, ...heads, ...cards])

    if (active) {
      gsap
        .timeline()
        .set(root.value, { autoAlpha: 1 })
        .fromTo(
          heads,
          { y: -30, autoAlpha: 0 },
          { y: 0, autoAlpha: 1, duration: 0.5, ease: 'power3.out', stagger: 0.08 },
          0.1,
        )
        .fromTo(
          cards,
          { x: (i) => (i % 2 ? 70 : -70), autoAlpha: 0 },
          { x: 0, autoAlpha: 1, duration: 0.6, ease: 'back.out(1.5)', stagger: 0.12 },
          0.25,
        )
    } else {
      gsap.to(root.value, { autoAlpha: 0, duration: 0.35, ease: 'power2.in' })
    }
  },
)
</script>

<template>
  <div ref="root" class="mission-screen">
    <div class="missions-head back-button" @click="emit('back')">&lt; BACK</div>
    <h2 class="missions-head mission-title text-glow-pink">RUNDOWNNNNNNNN</h2>

    <div class="missions-list themed-scroll">
      <div v-for="m in missions" :key="m.title" class="mission-card">
        <div class="mission-image shrink-0">
          <img :src="asset(m.image)" :alt="m.title" />
        </div>
        <div>
          <h3 class="m-0 mb-2 text-3xl leading-none text-p3-light">{{ m.title }}</h3>
          <p class="m-0 font-sans text-[1.05rem] leading-relaxed text-p3-white" v-html="m.html"></p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.mission-screen {
  position: absolute;
  inset: 0;
  padding: 2rem 5rem;
  box-sizing: border-box;
  z-index: 20;
  display: flex;
  flex-direction: column;
}

.back-button {
  position: absolute;
  /* padding memperbesar area tap (target sentuh >= 44px), posisi visual tetap */
  top: 2.25rem;
  left: 4rem;
  padding: 0.75rem 1rem;
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--color-p3-light);
  cursor: pointer;
  transition: color 0.2s;
  z-index: 5;
}
.back-button:hover {
  color: var(--color-p3-pink);
}

.mission-title {
  font-size: 3.5rem;
  text-align: center;
  color: var(--color-p3-white);
  margin: 0 0 2rem;
  border-bottom: 2px solid var(--color-p3-pink);
  padding-bottom: 1rem;
  flex-shrink: 0;
}

.missions-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  overflow-y: auto;
  padding-right: 1rem;
}

.mission-card {
  display: flex;
  align-items: center;
  gap: 2rem;
  background-color: rgba(255, 105, 180, 0.05);
  border-left: 5px solid var(--color-p3-pink);
  padding: 1rem 1.5rem;
  border-radius: 0 8px 8px 0;
  transition: background-color 0.25s ease, box-shadow 0.25s ease;
}
.mission-card:hover {
  background-color: rgba(255, 105, 180, 0.12);
  box-shadow: 0 0 18px rgba(255, 105, 180, 0.25);
}

.mission-image img {
  width: 80px;
  height: 80px;
}

@media (max-width: 768px) and (orientation: portrait) {
  .mission-screen {
    position: fixed;
    z-index: 50;
    padding: 4.5rem 1.5rem 1.5rem;
    background-color: var(--color-p3-dark);
    overflow-y: auto;
  }
  .back-button {
    top: 0.75rem;
    left: 0.5rem;
  }
  .mission-title {
    font-size: 2.5rem;
  }
  .missions-list {
    flex-grow: 1;
    padding-right: 0;
  }
  .mission-card {
    flex-direction: column;
    text-align: center;
    gap: 1rem;
    border-left: none;
    border-top: 3px solid var(--color-p3-pink);
    border-radius: 0 0 8px 8px;
  }
  .mission-image img {
    width: 60px;
    height: 60px;
  }
}
</style>
