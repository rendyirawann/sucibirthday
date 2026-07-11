// ===============================================================
//  SEMUA KONTEN SITUS ADA DI FILE INI — edit di sini saja.
//  Menambah foto : taruh file di public/img/... lalu daftarkan
//  Menambah video: taruh file di public/video/... lalu daftarkan
//  Setelah menambah media, jalankan: node scripts/compress-assets.mjs
// ===============================================================

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
  greeting: 'Untuk sayangku,',
  paragraphs: [
    'Selamat ulang tahun, sayang. Setahun lagi berlalu, dan rasanya setiap harinya jadi cerita yang pengen aku simpan terus.',
    'Halaman ini kecil saja — kumpulan potongan memori kita. Scroll pelan-pelan ya, sambil dengerin lagu-lagunya. 🤍',
  ],
  closing: 'with love, always',
}

// Foto-foto memory lane. Tambahkan { src, caption } baru di sini.
// caption boleh dikosongkan ('').
export const photos = Array.from({ length: 25 }, (_, i) => ({
  src: `img/gallery/${i + 1}.jpg`,
  caption: '',
}))

// Memory bubbles melayang di seluruh halaman — isinya otomatis
// diambil bergantian dari semua foto galeri + video di atas.

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
  sub: 'sembilan puluh detik tentang kita — tekan play 🤍',
  src: 'video/memories-2026.mp4',
  poster: 'img/memories-poster.jpg',
}

export const closing = {
  script: 'see you on your day',
  note: 'Sampai ketemu tanggal 27 Juli ya, sayang. 🤍',
}
