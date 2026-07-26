// Kolase foto hitam-putih di atas kertas krem — gaya papan kenangan.
// Foto dipilih manual (lihat SELECTED): potret terbaik Suci + foto berdua.
//
// Jalankan: node scripts/make-collage.mjs
import sharp from 'sharp'
import ffmpegPath from 'ffmpeg-static'
import { execFileSync } from 'node:child_process'
import { existsSync, mkdirSync, readFileSync, rmSync, statSync } from 'node:fs'

// Urutan sumber = 25 foto galeri lama, lalu 103 foto hasil impor addon.
const ALL = [
  ...Array.from({ length: 25 }, (_, i) => `public/img/gallery/${i + 1}.jpg`),
  ...Array.from({ length: 103 }, (_, i) => `public/img/gallery/addon/${String(i + 1).padStart(3, '0')}.jpg`),
]

// 49 foto pilihan: potret Suci diselang-seling dengan foto berdua supaya
// susunannya tidak menumpuk di satu sisi.
const SELECTED = [
  36, 5, 43, 17, 91, 19, 64,
  120, 70, 44, 13, 101, 89, 52,
  14, 62, 31, 84, 118, 49, 15,
  78, 11, 92, 39, 112, 77, 40,
  20, 107, 8, 102, 88, 55, 97,
  115, 50, 119, 65, 33, 113, 72,
  127, 114, 111, 80, 29, 75, 69,
]

// Potongan khusus untuk foto yang subjeknya tidak di tengah bingkai.
// Kunci = indeks di ALL, nilai = posisi crop sharp.
const CROP = {
  92: 'bottom',
  31: 'bottom',
  20: 'bottom',
  114: 'bottom',
  112: 'bottom',
}

const COLS = 7
const CELL_W = 380
const CELL_H = 475 // potret 4:5
const GAP = 12
const MARGIN = 80
const HEADER = 300
const FOOTER = 110
const PAPER = '#f2ece1'

const ROWS = Math.ceil(SELECTED.length / COLS)
const W = MARGIN * 2 + COLS * CELL_W + (COLS - 1) * GAP
const H = MARGIN + HEADER + ROWS * CELL_H + (ROWS - 1) * GAP + FOOTER

const OUT_DIR = 'media-src/export'
const TMP = 'scripts/.collagetmp.png'
const OUT = `${OUT_DIR}/kolase-suci.jpg`

mkdirSync(OUT_DIR, { recursive: true })

console.log(`${SELECTED.length} foto -> ${COLS}x${ROWS}, kanvas ${W}x${H}`)

const comps = []
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

  const tone = (p) =>
    p
      .grayscale()
      .linear(1.12, -14) // kontras hitam-putih yang lebih tegas
      .tint('#fffaf2') // hangat tipis agar menyatu dengan kertas krem

  // Foto landscape ditampilkan utuh — kalau dipotong jadi potret, salah satu
  // wajah pasti hilang.
  let buf = await tone(
    sharp(readFileSync(src), { failOn: 'none' })
      .rotate()
      .resize(CELL_W, CELL_H, {
        fit: landscape ? 'inside' : 'cover',
        position: CROP[SELECTED[i]] || 'centre',
      }),
  )
    .png()
    .toBuffer()

  if (landscape) {
    // Ditempel di atas kotak kertas. Tidak memakai background bawaan resize:
    // sharp menerapkan grayscale/tint SETELAH resize, jadi bilahnya akan
    // ikut memutih dan warnanya meleset dari kanvas.
    buf = await sharp({
      create: { width: CELL_W, height: CELL_H, channels: 3, background: PAPER },
    })
      .composite([{ input: buf, gravity: 'centre' }])
      .png()
      .toBuffer()
  }

  comps.push({
    input: buf,
    left: MARGIN + (i % COLS) * (CELL_W + GAP),
    top: MARGIN + HEADER + Math.floor(i / COLS) * (CELL_H + GAP),
  })
  if ((i + 1) % 14 === 0) console.log(`  ${i + 1}/${SELECTED.length}`)
}

await sharp({ create: { width: W, height: H, channels: 3, background: PAPER } })
  .composite(comps)
  .png()
  .toFile(TMP)

// Teks ditulis dengan ffmpeg (font sistem terbaca pasti, tidak seperti SVG)
const FONT = 'C\\:/Windows/Fonts/constan.ttf'
const FONT_I = 'C\\:/Windows/Fonts/constani.ttf'
const INK = '0x3a2f33'

const text = [
  { t: 'M O N D A Y   ·   2 7   J U L Y   2 0 2 6', size: 26, y: 96, font: FONT, alpha: 0.55 },
  { t: 'Suci Wulandari', size: 104, y: 140, font: FONT_I, alpha: 0.95 },
  { t: 'a year and a half later, almost two on our journey', size: 32, y: 268, font: FONT_I, alpha: 0.6 },
]
  .map(
    (l) =>
      `drawtext=fontfile='${l.font}':text='${l.t}':fontcolor=${INK}@${l.alpha}:` +
      `fontsize=${l.size}:x=(w-text_w)/2:y=${l.y}`,
  )
  .concat([
    `drawtext=fontfile='${FONT}':text='made with love by abang rendy':` +
      `fontcolor=${INK}@0.4:fontsize=24:x=(w-text_w)/2:y=${H - 78}`,
  ])
  .join(',')

execFileSync(
  ffmpegPath,
  ['-y', '-hide_banner', '-loglevel', 'error', '-i', TMP, '-vf', text, '-q:v', '2', OUT],
  { stdio: 'inherit' },
)

rmSync(TMP, { force: true })

// Versi kecil untuk dikirim lewat WhatsApp / diunggah ke Instagram
const SHARE = `${OUT_DIR}/kolase-suci-share.jpg`
await sharp(OUT).resize({ width: 1440 }).jpeg({ quality: 88 }).toFile(SHARE)

const mb = (f) => (statSync(f).size / 1048576).toFixed(1)
console.log(`\nSelesai:`)
console.log(`  ${OUT} — ${W}x${H}, ${mb(OUT)}MB (cetak / kualitas penuh)`)
console.log(`  ${SHARE} — 1440px, ${mb(SHARE)}MB (untuk dibagikan)`)
