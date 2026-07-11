<script setup>
import { ref } from 'vue'
import PetalField from './components/PetalField.vue'
import DoorEntrance from './components/DoorEntrance.vue'
import SplashScreen from './components/SplashScreen.vue'
import MainScreen from './components/MainScreen.vue'
import { useAudioPlayer } from './composables/useAudioPlayer'

// Alur: door -> splash -> main
const stage = ref('door')
const doorVisible = ref(true)
const { start } = useAudioPlayer()

function onDoorOpen() {
  // Dipanggil sinkron dari klik user, jadi autoplay audio diizinkan browser
  start()
  stage.value = 'splash'
}
</script>

<template>
  <PetalField />
  <SplashScreen v-if="stage === 'splash'" @done="stage = 'main'" />
  <MainScreen v-if="stage === 'main'" />
  <!-- Pintu dirender terakhir (z tertinggi) dan tetap ada selama animasi keluar -->
  <DoorEntrance v-if="doorVisible" @open="onDoorOpen" @gone="doorVisible = false" />
</template>
