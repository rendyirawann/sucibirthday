// Kolase foto untuk Instagram Story (1080x1920).
// Foto hitam-putih hangat dalam bingkai polaroid putih, dimiringkan
// sedikit-sedikit dengan bayangan lembut di atas kertas pink. Tanpa teks.
//
// Jalankan: node scripts/make-collage.mjs
import sharp from 'sharp'
import { existsSync, mkdirSync, readFileSync, statSync } from 'node:fs'

// Urutan sumber = 25 foto galeri lama, lalu 103 foto hasil impor addon.
const ALL = [
  ...Array.from({ length: 25 }, (_, i) => `public/img/gallery/${i + 1}.jpg`),
  ...Array.from({ length: 103 }, (_, i) => `public/img/gallery/addon/${String(i + 1).padStart(3, '0')}.jpg`),
]

// 35 foto pilihan: potret Suci diselang-seling dengan foto berdua.
const SELECTED = [
  36, 5, 43, 17, 91,
  19, 64, 70, 44, 13,
  101, 89, 52, 14, 62,
  31, 84, 118, 49, 15,
  11, 92, 77, 40, 107,
  102, 88, 55, 97, 119,
  113, 111, 75, 127, 69,
]

// Potongan khusus untuk foto yang subjeknya tidak di tengah bingkai
const CROP = { 92: 'bottom', 31: 'bottom', 20: 'bottom', 114: 'bottom', 112: 'bottom' }

const W = 1080
const H = 1920
const COLS = 5
const ROWS = Math.ceil(SELECTED.length / COLS)

const PAD = 9 // tepi putih polaroid
const PAD_BOTTOM = 24 // tepi bawah lebih tebal, ciri khas polaroid
const PHOTO_W = 158
const PHOTO_H = 196 // ~4:5
const CARD_W = PHOTO_W + PAD * 2
const CARD_H = PHOTO_H + PAD + PAD_BOTTOM

const MARGIN_X = 30
const MARGIN_Y = 54
const CELL_W = (W - MARGIN_X * 2) / COLS
const CELL_H = (H - MARGIN_Y * 2) / ROWS

const OUT_DIR = 'media-src/export'
const OUT = `${OUT_DIR}/kolase-suci-story.jpg`
mkdirSync(OUT_DIR, { recursive: true })

// Kemiringan & geseran kecil yang tetap sama tiap kali dijalankan
const jitter = (i, span) => (((i * 2654435761) % 1000) / 1000 - 0.5) * 2 * span

const svg = (s) => Buffer.from(s)
const roundRect = (w, h, r, fill, extra = '') =>
  svg(`<svg width="${w}" height="${h}"><rect width="${w}" height="${h}" rx="${r}" ry="${r}" fill="${fill}" ${extra}/></svg>`)

console.log(`${SELECTED.length} foto -> ${COLS}x${ROWS} pada kanvas ${W}x${H}`)

const layers = []

for (let i = 0; i < SELECTED.length; i++) {
  const src = ALL[SELECTED[i]]
  if (!existsSync(src)) {
    console.log(`lewati (tidak ada): ${src}`)
    continue
  }

  const meta = await sharp(readFileSync(src), { failOn: 'none' }).metadata()
  const rotated = meta.orientation > 4
  const ratio = (rotated ? meta.height : meta.width) / (rotated ? meta.width : meta.height)
  const landscape = ratio > 1.05

  // Foto landscape ditampilkan utuh — dipotong ke bingkai potret selalu
  // memakan salah satu wajah. Sisanya dipotong dari tengah.
  let photo = await sharp(readFileSync(src), { failOn: 'none' })
    .rotate()
    .resize(PHOTO_W, PHOTO_H, {
      fit: landscape ? 'inside' : 'cover',
      position: CROP[SELECTED[i]] || 'centre',
    })
    .grayscale()
    .linear(1.1, -12)
    .tint('#fff7ee') // hitam-putih hangat, bukan abu-abu dingin
    .png()
    .toBuffer()

  if (landscape) {
    photo = await sharp({
      create: { width: PHOTO_W, height: PHOTO_H, channels: 3, background: '#ffffff' },
    })
      .composite([{ input: photo, gravity: 'centre' }])
      .png()
      .toBuffer()
  }

  // Kartu polaroid: kertas putih membulat + foto di dalamnya
  const card = await sharp({
    create: { width: CARD_W, height: CARD_H, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } },
  })
    .composite([
      { input: roundRect(CARD_W, CARD_H, 9, '#ffffff'), top: 0, left: 0 },
      { input: photo, top: PAD, left: PAD },
    ])
    .png()
    .toBuffer()

  const angle = jitter(i + 1, 5)
  const tilted = await sharp(card)
    .rotate(angle, { background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toBuffer()

  // Bayangan: kartu hitam kabur, dimiringkan sama, digeser sedikit ke bawah
  const shadow = await sharp(roundRect(CARD_W, CARD_H, 9, '#c98aa6', 'opacity="0.55"'))
    .rotate(angle, { background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .blur(7)
    .png()
    .toBuffer()

  const tm = await sharp(tilted).metadata()
  const cx = MARGIN_X + (i % COLS) * CELL_W + CELL_W / 2 + jitter(i + 7, 4)
  const cy = MARGIN_Y + Math.floor(i / COLS) * CELL_H + CELL_H / 2 + jitter(i + 13, 4)
  const left = Math.round(cx - tm.width / 2)
  const top = Math.round(cy - tm.height / 2)

  layers.push({ input: shadow, left, top: top + 5 })
  layers.push({ input: tilted, left, top })
}

// Hati kecil merah muda yang berserak di sela-sela kartu
const heart = (size, op) =>
  svg(
    `<svg width="${size}" height="${size}" viewBox="0 0 24 24">` +
      `<path fill="#f2a9c4" opacity="${op}" d="M12 21s-6.7-4.3-9.3-8.1C.6 9.7 2 5.6 5.6 4.7c2.1-.5 4.2.4 5.4 2.1h2c1.2-1.7 3.3-2.6 5.4-2.1 3.6.9 5 5 2.9 8.2C18.7 16.7 12 21 12 21z"/></svg>`,
  )
const HEARTS = [
  [42, 26, 20, 0.5], [1010, 120, 14, 0.45], [22, 640, 16, 0.4],
  [1036, 780, 20, 0.5], [30, 1180, 14, 0.45], [1022, 1420, 17, 0.4],
  [524, 1866, 22, 0.5], [180, 1872, 13, 0.4], [880, 1858, 15, 0.45],
]
for (const [x, y, s, o] of HEARTS) layers.push({ input: heart(s, o), left: x, top: y })

// Kertas pink lembut
const paper = svg(
  `<svg width="${W}" height="${H}"><defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1">` +
    `<stop offset="0%" stop-color="#fff4f8"/><stop offset="48%" stop-color="#ffe8f1"/>` +
    `<stop offset="100%" stop-color="#fff1f6"/></linearGradient></defs>` +
    `<rect width="${W}" height="${H}" fill="url(#g)"/></svg>`,
)

await sharp(paper).composite(layers).jpeg({ quality: 92 }).toFile(OUT)

console.log(`\nSelesai: ${OUT} — ${W}x${H}, ${(statSync(OUT).size / 1048576).toFixed(1)}MB`)
