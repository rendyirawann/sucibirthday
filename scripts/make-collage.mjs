// Kolase foto polaroid: versi Instagram Story dan versi siap cetak.
// Foto hitam-putih hangat dalam bingkai polaroid putih, dimiringkan
// sedikit-sedikit dengan bayangan lembut di atas kertas pink. Tanpa teks.
//
//   node scripts/make-collage.mjs           -> IG Story 1080x1920
//   node scripts/make-collage.mjs --print   -> A3 300 DPI (3508x4961)
import sharp from 'sharp'
import { existsSync, mkdirSync, readFileSync, statSync } from 'node:fs'

// Urutan sumber = 25 foto galeri lama, lalu 103 foto hasil impor addon.
const ALL = [
  ...Array.from({ length: 25 }, (_, i) => `public/img/gallery/${i + 1}.jpg`),
  ...Array.from({ length: 103 }, (_, i) => `public/img/gallery/addon/${String(i + 1).padStart(3, '0')}.jpg`),
]

// Foto pilihan, sudah diselang-seling: potret Suci lalu foto berdua.
// Angkanya adalah indeks pada ALL di atas.
const STORY_PICKS = [
  36, 5, 43, 17, 91,
  19, 64, 70, 44, 13,
  101, 89, 52, 14, 62,
  31, 84, 118, 49, 15,
  11, 92, 77, 40, 107,
  102, 88, 55, 97, 119,
  113, 111, 75, 127, 69,
]

// Versi cetak lebih lebar, jadi muat 6 kolom dan 7 foto tambahan
const PRINT_PICKS = [
  36, 5, 43, 17, 91, 19,
  64, 70, 44, 13, 101, 89,
  52, 14, 62, 31, 84, 118,
  49, 15, 11, 92, 77, 40,
  107, 102, 88, 55, 97, 119,
  113, 111, 75, 127, 69, 120,
  78, 33, 8, 65, 50, 29,
]

// Potongan khusus untuk foto yang subjeknya tidak di tengah bingkai
const CROP = { 92: 'bottom', 31: 'bottom', 20: 'bottom', 114: 'bottom', 112: 'bottom' }

const PRINT = process.argv.includes('--print')

const preset = PRINT
  ? { W: 3508, H: 4961, cols: 6, picks: PRINT_PICKS, dpi: 300, out: 'kolase-suci-print-a3.jpg' }
  : { W: 1080, H: 1920, cols: 5, picks: STORY_PICKS, dpi: 72, out: 'kolase-suci-story.jpg' }

const { W, H, cols: COLS, picks: SELECTED } = preset
const ROWS = Math.ceil(SELECTED.length / COLS)

const MARGIN_X = Math.round(W * 0.028)
const MARGIN_Y = Math.round(H * 0.028)
const CELL_W = (W - MARGIN_X * 2) / COLS
const CELL_H = (H - MARGIN_Y * 2) / ROWS

// Ukuran kartu diturunkan dari ukuran sel, lalu dikecilkan sampai muat
// (termasuk ruang untuk kemiringan dan bayangan).
let CARD_W = Math.round(CELL_W * 0.86)
let PAD, PAD_BOTTOM, PHOTO_W, PHOTO_H, CARD_H
for (;;) {
  PAD = Math.round(CARD_W * 0.052)
  PAD_BOTTOM = Math.round(CARD_W * 0.135)
  PHOTO_W = CARD_W - PAD * 2
  PHOTO_H = Math.round(PHOTO_W * 1.24)
  CARD_H = PHOTO_H + PAD + PAD_BOTTOM
  if (CARD_H <= CELL_H * 0.93) break
  CARD_W -= 4
}

const RADIUS = Math.max(4, Math.round(CARD_W * 0.05))
const BLUR = Math.max(3, Math.round(CARD_W * 0.04))
const TILT = 5 // derajat
const SCALE = W / 1080 // untuk hati kecil & geseran

const OUT_DIR = 'media-src/export'
const OUT = `${OUT_DIR}/${preset.out}`
mkdirSync(OUT_DIR, { recursive: true })

// Kemiringan & geseran kecil yang tetap sama tiap kali dijalankan
const jitter = (i, span) => (((i * 2654435761) % 1000) / 1000 - 0.5) * 2 * span

const svg = (s) => Buffer.from(s)
const roundRect = (w, h, r, fill, extra = '') =>
  svg(`<svg width="${w}" height="${h}"><rect width="${w}" height="${h}" rx="${r}" ry="${r}" fill="${fill}" ${extra}/></svg>`)

console.log(
  `${SELECTED.length} foto -> ${COLS}x${ROWS} pada kanvas ${W}x${H}` +
    (PRINT ? ` (A3 @ ${preset.dpi} DPI)` : ''),
)

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
      { input: roundRect(CARD_W, CARD_H, RADIUS, '#ffffff'), top: 0, left: 0 },
      { input: photo, top: PAD, left: PAD },
    ])
    .png()
    .toBuffer()

  const angle = jitter(i + 1, TILT)
  const tilted = await sharp(card)
    .rotate(angle, { background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toBuffer()

  // Bayangan: kartu pink kabur, dimiringkan sama, digeser sedikit ke bawah
  const shadow = await sharp(roundRect(CARD_W, CARD_H, RADIUS, '#c98aa6', 'opacity="0.55"'))
    .rotate(angle, { background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .blur(BLUR)
    .png()
    .toBuffer()

  const tm = await sharp(tilted).metadata()
  const cx = MARGIN_X + (i % COLS) * CELL_W + CELL_W / 2 + jitter(i + 7, 4 * SCALE)
  const cy = MARGIN_Y + Math.floor(i / COLS) * CELL_H + CELL_H / 2 + jitter(i + 13, 4 * SCALE)
  const left = Math.round(cx - tm.width / 2)
  const top = Math.round(cy - tm.height / 2)

  layers.push({ input: shadow, left, top: top + Math.round(5 * SCALE) })
  layers.push({ input: tilted, left, top })

  if ((i + 1) % 12 === 0) console.log(`  ${i + 1}/${SELECTED.length}`)
}

// Hati merah muda & putih yang berserak — sebagian menempel di tepi kartu
// seperti stiker. Yang putih diberi garis pink tipis supaya tetap terbaca
// di atas kertas pink, dan bayangan halus supaya tidak terlihat "menempel rata".
const heart = (size, fill, stroke, op, rot) =>
  svg(
    `<svg width="${size}" height="${size}" viewBox="0 0 24 24">` +
      `<g transform="rotate(${rot} 12 12)" opacity="${op}">` +
      `<path fill="${fill}" stroke="${stroke}" stroke-width="${stroke === 'none' ? 0 : 1}" ` +
      `d="M12 21s-6.7-4.3-9.3-8.1C.6 9.7 2 5.6 5.6 4.7c2.1-.5 4.2.4 5.4 2.1h2c1.2-1.7 3.3-2.6 5.4-2.1 3.6.9 5 5 2.9 8.2C18.7 16.7 12 21 12 21z"/>` +
      `</g></svg>`,
  )

const PINK = '#f4a3c0'
const WHITE = '#ffffff'
// [x, y, ukuran, warna, opasitas, putaran] — posisi relatif (0-1)
const HEARTS = [
  [0.035, 0.012, 30, PINK, 0.85, -12], [0.945, 0.055, 22, WHITE, 0.95, 14],
  [0.30, 0.145, 20, WHITE, 0.9, -8], [0.665, 0.128, 17, PINK, 0.8, 10],
  [0.018, 0.30, 25, WHITE, 0.95, 6], [0.955, 0.275, 19, PINK, 0.85, -14],
  [0.50, 0.415, 22, PINK, 0.8, 8], [0.145, 0.44, 16, WHITE, 0.9, -10],
  [0.958, 0.545, 27, WHITE, 0.95, 12], [0.025, 0.60, 20, PINK, 0.85, -6],
  [0.80, 0.685, 18, WHITE, 0.9, 16], [0.36, 0.72, 17, PINK, 0.8, -12],
  [0.95, 0.84, 24, PINK, 0.85, 9], [0.03, 0.875, 22, WHITE, 0.95, -8],
  [0.485, 0.968, 32, PINK, 0.9, 5], [0.175, 0.972, 20, WHITE, 0.95, -14],
  [0.80, 0.965, 23, WHITE, 0.9, 11], [0.63, 0.978, 15, PINK, 0.8, -5],
]
for (const [fx, fy, s, fill, o, rot] of HEARTS) {
  const size = Math.max(12, Math.round(s * SCALE))
  const left = Math.max(0, Math.min(W - size, Math.round(fx * W)))
  const top = Math.max(0, Math.min(H - size, Math.round(fy * H)))
  const stroke = fill === WHITE ? '#f0b9cd' : 'none'
  layers.push({
    input: await sharp(heart(size, '#d98fae', 'none', 0.3, rot)).blur(Math.max(1, size * 0.06)).png().toBuffer(),
    left,
    top: top + Math.max(1, Math.round(size * 0.06)),
  })
  layers.push({ input: heart(size, fill, stroke, o, rot), left, top })
}

// Kertas pink lembut
const paper = svg(
  `<svg width="${W}" height="${H}"><defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1">` +
    `<stop offset="0%" stop-color="#fff4f8"/><stop offset="48%" stop-color="#ffe8f1"/>` +
    `<stop offset="100%" stop-color="#fff1f6"/></linearGradient></defs>` +
    `<rect width="${W}" height="${H}" fill="url(#g)"/></svg>`,
)

await sharp(paper, { limitInputPixels: false })
  .composite(layers)
  .withMetadata({ density: preset.dpi }) // supaya percetakan membaca DPI-nya
  .jpeg({ quality: PRINT ? 95 : 92, chromaSubsampling: '4:4:4' })
  .toFile(OUT)

console.log(
  `\nSelesai: ${OUT} — ${W}x${H}, ${(statSync(OUT).size / 1048576).toFixed(1)}MB` +
    (PRINT ? ' (A3, 29.7 x 42 cm @ 300 DPI)' : ''),
)

// Versi story sekaligus dipakai di situs (section "The Board")
if (!PRINT) {
  const WEB = 'public/img/kolase-suci.jpg'
  await sharp(OUT).jpeg({ quality: 84 }).toFile(WEB)
  console.log(`         ${WEB} — untuk situs, ${(statSync(WEB).size / 1048576).toFixed(1)}MB`)
}
