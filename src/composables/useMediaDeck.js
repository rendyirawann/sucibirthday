// "Tumpukan kartu yang dikocok" berisi SELURUH foto & video proyek.
// Satu tumpukan dipakai bersama oleh bubble melayang dan kartu flip di hero,
// sehingga setiap aset dijamin mendapat giliran tampil sebelum ada yang
// terulang — bukan acak murni yang bisa melewatkan sebagian aset selamanya.
import { photos, videos } from '../data/content'

export const mediaPool = [
  ...photos.map((p) => ({ type: 'image', src: p.src })),
  ...videos.map((src) => ({ type: 'video', src })),
]

let deck = []

function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

// Ambil kartu teratas yang lolos `accept`. Kartu yang dilewati dikembalikan
// ke dasar tumpukan supaya tetap mendapat giliran nanti.
export function drawMedia(accept = () => true) {
  const skipped = []
  let picked = null

  for (let guard = 0; guard < mediaPool.length + 1; guard++) {
    if (!deck.length) deck = shuffle(mediaPool)
    const card = deck.shift()
    if (!accept(card)) {
      skipped.push(card)
      continue
    }
    picked = card
    break
  }

  deck.push(...skipped)
  return picked || mediaPool[Math.floor(Math.random() * mediaPool.length)]
}
