<script setup>
import { onMounted, onUnmounted, ref } from 'vue'
import gsap from 'gsap'
import { eventInfo, menuItems } from '../data/content'

const props = defineProps({ disabled: Boolean, playerOpen: Boolean })
const emit = defineEmits(['open-missions'])

const root = ref(null)
const activeIndex = ref(0)
// Transisi CSS .menu-item baru aktif setelah animasi masuk GSAP selesai,
// supaya keduanya tidak berebut menulis transform/opacity tiap frame
const introDone = ref(false)
let ctx

function activate(item) {
  if (item.id === 'mission') emit('open-missions')
  else if (item.link) window.open(item.link, '_blank')
}

function onKeydown(e) {
  if (props.disabled) return
  if (e.key === 'ArrowUp' && activeIndex.value > 0) activeIndex.value--
  else if (e.key === 'ArrowDown' && activeIndex.value < menuItems.length - 1) activeIndex.value++
  else if (e.key === 'Enter') activate(menuItems[activeIndex.value])
}

onMounted(() => {
  document.addEventListener('keydown', onKeydown)
  ctx = gsap.context(() => {
    // clearProps supaya transform inline tidak menimpa efek CSS .active
    gsap.from('.nav-stagger', {
      x: -60,
      autoAlpha: 0,
      duration: 0.8,
      stagger: 0.12,
      ease: 'power3.out',
      delay: 0.5,
      clearProps: 'all',
      onComplete: () => (introDone.value = true),
    })
  }, root.value)
})

onUnmounted(() => {
  document.removeEventListener('keydown', onKeydown)
  ctx?.revert()
})
</script>

<template>
  <nav
    ref="root"
    class="nav-container"
    :class="{ 'player-active': playerOpen, 'intro-done': introDone }"
  >
    <div class="nav-stagger menu-header">
      <span>{{ eventInfo.date }}</span>
      <span>{{ eventInfo.day }}</span>
      <span class="text-p3-light">{{ eventInfo.year }}</span>
    </div>
    <ul class="m-0 list-none p-0">
      <li
        v-for="(item, i) in menuItems"
        :key="item.id"
        class="nav-stagger menu-item"
        :class="{ active: i === activeIndex, clickable: item.id === 'mission' || item.link }"
        @mouseover="!disabled && (activeIndex = i)"
        @click="activate(item)"
      >
        <span class="item-name">{{ item.name }}</span>
        <span class="item-desc font-sans" v-html="item.desc"></span>
      </li>
    </ul>
  </nav>
</template>

<style scoped>
.nav-container {
  position: absolute;
  top: 50%;
  left: 0;
  transform: translateY(-50%);
  width: 45%;
  padding: 2rem 4rem;
  z-index: 10;
}

.menu-header {
  margin-bottom: 2rem;
  font-size: 2.5rem;
  font-weight: 700;
  letter-spacing: 2px;
  border-bottom: 2px solid var(--color-p3-pink);
  padding-bottom: 1rem;
}
.menu-header span {
  margin-right: 1.5rem;
}

.menu-item {
  padding: 0.5rem 1.5rem;
  margin: 0.5rem 0;
  position: relative;
  opacity: 0.6;
  cursor: default;
}
.nav-container.intro-done .menu-item {
  transition: opacity 0.25s ease-in-out, transform 0.25s ease-in-out;
}
.menu-item.clickable {
  cursor: pointer;
}

.item-name {
  font-size: 3.5rem;
  font-weight: 500;
  letter-spacing: 1px;
  display: block;
  line-height: 1.1;
}

.item-desc {
  display: block;
  max-height: 0;
  opacity: 0;
  overflow: hidden;
  font-size: 1.15rem;
  color: var(--color-p3-light);
  transition: max-height 0.35s ease, opacity 0.35s ease;
}

.menu-item.active {
  opacity: 1;
  transform: translateX(20px);
}
.menu-item.active .item-desc {
  max-height: 90px;
  opacity: 1;
}

.menu-item.active::before {
  content: '';
  position: absolute;
  left: -10px;
  top: 50%;
  transform: translateY(-50%);
  width: 0;
  height: 0;
  border-top: 15px solid transparent;
  border-bottom: 15px solid transparent;
  border-left: 20px solid var(--color-p3-pink);
}

@media (max-width: 768px) and (orientation: portrait) {
  .nav-container {
    position: absolute;
    /* Dipatok mulai 55% tinggi layar (seperti versi asli) supaya
       tidak tumbuh ke atas menabrak area tap kubus di ponsel pendek */
    top: 55%;
    bottom: 0;
    left: 0;
    width: 100%;
    transform: none;
    height: auto;
    padding: 1.5rem;
    text-align: center;
    background: linear-gradient(to top, var(--color-p3-dark) 70%, transparent 100%);
    transition: transform 0.5s ease-in-out;
    overflow-y: auto;
  }
  .nav-container.player-active {
    transform: translateY(25%);
  }

  .menu-header {
    font-size: 1.8rem;
    margin-bottom: 1rem;
    padding-bottom: 0.5rem;
    border: none;
  }
  .menu-header span {
    margin: 0 0.5rem;
  }

  .menu-item {
    padding: 0.2rem 0;
    text-align: center;
  }
  .item-name {
    font-size: 2.8rem;
  }
  .item-desc {
    font-size: 1rem;
  }
  .menu-item.active {
    transform: translateX(0);
  }
  .menu-item.active::before {
    display: none;
  }
}
</style>
