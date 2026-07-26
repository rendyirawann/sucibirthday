// ===============================================================
//  SEMUA KONTEN SITUS ADA DI FILE INI — edit di sini saja.
//
//  Menambah foto/video baru dalam jumlah banyak:
//    1. taruh file mentahnya di media-src/addon/
//    2. jalankan: node scripts/import-addon.mjs
//    3. jalankan: node scripts/make-memory-video.mjs  (montase A Little Film)
//
//  Menambah satu-dua file secara manual: taruh di public/img atau
//  public/video, lalu daftarkan di array di bawah.
// ===============================================================

import { addonPhotos, addonVideos } from './addon-media'

export const eventInfo = {
  day: 'Monday',
  dateLong: '27 July 2026',
  dateDots: '27 · 07 · 2026',
}

export const hero = {
  script: 'Happy Birthday',
  name: 'Suci Wulandari',
  sub: 'my lovelyy cute girlfriend >.<',
}

// Surat kecil — silakan personalisasi kata-katanya 🤍
export const letter = {
  greeting: 'Untuk Suci sayang,',
  paragraphs: [
    'Selamat ulang tahun, sayang. Setahun lagi berlalu, dan rasanya setiap harinya jadi cerita yang pengen Abang simpan terus.',
    'Halaman ini kecil saja — kumpulan potongan memori kita. Suci scroll pelan-pelan ya, sambil dengerin lagu-lagunya. 🤍',
  ],
  closing: 'with love, always',
}

// 25 foto asli + semua foto dari media-src/addon
export const photos = [
  ...Array.from({ length: 25 }, (_, i) => `img/gallery/${i + 1}.jpg`),
  ...addonPhotos,
].map((src) => ({ src, caption: '' }))

// 6 video asli + semua video dari media-src/addon
export const videos = [
  ...Array.from({ length: 6 }, (_, i) => `video/${i + 1}.mp4`),
  ...addonVideos,
]

// Isi Memory Lane: semua foto, dengan video disisipkan berkala
// supaya grid-nya hidup (tidak menumpuk di satu tempat).
export const laneItems = (() => {
  const items = photos.map((p) => ({ type: 'image', src: p.src, caption: p.caption }))
  const gap = Math.max(4, Math.floor(items.length / (videos.length + 1)))
  videos.forEach((src, i) => {
    const at = Math.min(items.length, gap * (i + 1) + i)
    items.splice(at, 0, { type: 'video', src, caption: '' })
  })
  return items
})()

// Memory bubbles melayang di seluruh halaman — isinya diambil
// bergantian dari seluruh foto + video di atas.

// Kubus memory 3D (6 sisi video)
export const cubeVideos = [
  { face: 'front', src: 'video/1.mp4' },
  { face: 'back', src: 'video/2.mp4' },
  { face: 'right', src: 'video/3.mp4' },
  { face: 'left', src: 'video/5.mp4' },
  { face: 'top', src: 'video/4.mp4' },
  { face: 'bottom', src: 'video/6.mp4' },
]

export const playlist = [
  { title: 'Everything You Are', artist: 'Hindia', src: 'audio/hindia.mp3' },
  { title: 'Kita Usahakan Rumah Itu', artist: 'Sal Priadi', src: 'audio/kitausahakanrumahitu.mp3' },
  { title: 'Last Night on Earth', artist: 'Green Day', src: 'audio/lastnight.mp3' },
  { title: 'Nobody Else', artist: 'LANY', src: 'audio/nobodyelse.mp3' },
  { title: 'Nothing', artist: 'Bruno Major', src: 'audio/nothing.mp3' },
  { title: 'Anything 4 U', artist: 'LANY', src: 'audio/anything4u.mp3' },
  { title: 'No', artist: 'LANY', src: 'audio/no.mp3' },
  { title: 'Happiness', artist: 'Rex Orange County', src: 'audio/happiness.mp3' },
  { title: 'Bercinta Lewat Kata', artist: 'Donne Maula', src: 'audio/bercintalewatkata.mp3' },
  { title: 'Cahaya', artist: 'TULUS', src: 'audio/cahaya.mp3' },
  { title: 'Blessed', artist: 'Daniel Cesar', src: 'audio/blessed.mp3' },
]

// Lagu pertama yang diputar saat halaman dibuka: Cahaya - TULUS
export const initialTrackIndex = 9

// Video montase di bagian akhir. Untuk menggantinya dengan video buatanmu:
// timpa file public/video/memories-2026.mp4 (dan poster-nya bila mau).
// Untuk membuat ulang montase otomatis: node scripts/make-memory-video.mjs
export const finale = {
  title: 'A Little Film',
  sub: 'lima menit tentang kita — matikan lampu, tekan play 🤍',
  src: 'video/memories-2026.mp4',
  poster: 'img/memories-poster.jpg',
}

export const closing = {
  script: 'see you on your day',
  note: 'Sampai ketemu tanggal 27 Juli ya, sayang. Abang tunggu. 🤍',
}
