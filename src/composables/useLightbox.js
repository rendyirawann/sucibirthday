import { reactive } from 'vue'

const state = reactive({ open: false, type: 'image', src: '' })

export function useLightbox() {
  return {
    state,
    show(type, src) {
      state.type = type
      state.src = src
      state.open = true
    },
    hide() {
      state.open = false
    },
  }
}
