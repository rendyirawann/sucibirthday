import { computed, reactive } from 'vue'
import { initialTrackIndex, playlist } from '../data/content'
import { asset } from '../lib/assets'

// Satu elemen audio dipakai bersama seluruh aplikasi
const audio = new Audio()
audio.preload = 'none'

const state = reactive({
  index: initialTrackIndex,
  playing: false,
})

audio.addEventListener('play', () => (state.playing = true))
audio.addEventListener('pause', () => (state.playing = false))
audio.addEventListener('ended', () => next())

function load(index) {
  state.index = (index + playlist.length) % playlist.length
  audio.src = asset(playlist[state.index].src)
}

function play() {
  audio.play().catch(() => {
    /* autoplay diblokir browser — user bisa tekan play manual */
  })
}

function start() {
  load(initialTrackIndex)
  play()
}

function toggle() {
  if (audio.paused) {
    // Bila belum ada src (autoplay pernah gagal sebelum load), muat dulu
    if (!audio.src) load(state.index)
    play()
  } else {
    audio.pause()
  }
}

function next() {
  load(state.index + 1)
  play()
}

function prev() {
  load(state.index - 1)
  play()
}

function select(index) {
  load(index)
  play()
}

export function useAudioPlayer() {
  return {
    state,
    playlist,
    currentTrack: computed(() => playlist[state.index]),
    start,
    toggle,
    next,
    prev,
    select,
    // Untuk menjeda musik latar saat video montase diputar
    pause: () => audio.pause(),
    resume: play,
  }
}
