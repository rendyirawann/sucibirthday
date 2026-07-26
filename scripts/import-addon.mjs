// Mengubah foto/video mentah di media-src/addon menjadi aset web ringan:
//   public/img/gallery/addon/NNN.jpg   (foto, 1080px)
//   public/video/addon/NNN.mp4         (video pendek untuk bubble & grid)
//   src/data/addon-media.js            (daftar file, dipakai content.js)
//
// Aset lama (img/gallery/1..25.jpg, video/1..6.mp4) tidak disentuh.
// Jalankan: node scripts/import-addon.mjs
import sharp from 'sharp'
import ffmpegPath from 'ffmpeg-static'
import { execFileSync } from 'node:child_process'
import { createHash } from 'node:crypto'
import { mkdirSync, readdirSync, readFileSync, rmSync, statSync, writeFileSync } from 'node:fs'
import { extname, join } from 'node:path'

const SRC = 'media-src/addon'
const IMG_OUT = 'public/img/gallery/addon'
const VID_OUT = 'public/video/addon'

const IMG_EXT = new Set(['.jpg', '.jpeg', '.png', '.webp'])
const VID_EXT = new Set(['.mp4', '.mov', '.m4v'])

// Video dipakai utuh (tanpa audio). Hanya klip yang sangat panjang dipotong,
// supaya satu video 15 menit tidak membuat situs jadi berat.
const MAX_CLIP = 45 // detik

// Urutkan kronologis dari nama file (IMG-20260307-WA0085, 2026-01-03-..., dst).
// Yang tidak punya tanggal ditaruh paling akhir.
function dateKey(name) {
  const m =
    name.match(/(20\d{2})[-_]?(\d{2})[-_]?(\d{2})/) || // IMG-20260307 / 2026-01-03 / IMG_20260628
    name.match(/_(20\d{2})(\d{2})(\d{2})\d{6}/) // lv_..._20260301223428
  return m ? `${m[1]}${m[2]}${m[3]}` : '99999999'
}

const files = readdirSync(SRC)
  .filter((f) => statSync(join(SRC, f)).isFile())
  .sort((a, b) => dateKey(a).localeCompare(dateKey(b)) || a.localeCompare(b))

// Buang duplikat (mis. "VID-... (1).mp4") lewat hash 256KB pertama + ukuran
const seen = new Set()
const unique = []
for (const f of files) {
  const p = join(SRC, f)
  const size = statSync(p).size
  const head = readFileSync(p).subarray(0, 262144)
  const key = `${size}:${createHash('sha1').update(head).digest('hex')}`
  if (seen.has(key)) {
    console.log(`lewati duplikat: ${f}`)
    continue
  }
  seen.add(key)
  unique.push(f)
}

rmSync(IMG_OUT, { recursive: true, force: true })
rmSync(VID_OUT, { recursive: true, force: true })
mkdirSync(IMG_OUT, { recursive: true })
mkdirSync(VID_OUT, { recursive: true })

const photos = []
const videos = []
const sources = { photos: [], videos: [] } // file asli, dipakai montase
const skipped = []

let iImg = 0
let iVid = 0

for (const f of unique) {
  const ext = extname(f).toLowerCase()
  const src = join(SRC, f)

  try {
  if (IMG_EXT.has(ext)) {
    iImg++
    const name = `${String(iImg).padStart(3, '0')}.jpg`
    // failOn 'none': foto yang terpotong tetap dipakai sebisanya, tidak menggagalkan impor
    await sharp(readFileSync(src), { failOn: 'none' })
      .rotate()
      .resize({ width: 1080, height: 1080, fit: 'inside', withoutEnlargement: true })
      .jpeg({ quality: 80, mozjpeg: true })
      .toFile(join(IMG_OUT, name))
    photos.push(`img/gallery/addon/${name}`)
    sources.photos.push(src.replace(/\\/g, '/'))
    console.log(`foto ${iImg}: ${f}`)
  } else if (VID_EXT.has(ext)) {
    iVid++
    const name = `${String(iVid).padStart(3, '0')}.mp4`
    // Versi web: durasi asli (dibatasi MAX_CLIP), sisi terpanjang 640px,
    // tanpa audio. Hanya tampil di petak grid & lingkaran bubble.
    execFileSync(
      ffmpegPath,
      [
        '-y', '-hide_banner', '-loglevel', 'error',
        '-i', src,
        '-t', String(MAX_CLIP),
        '-an',
        // scale kedua membulatkan ke angka genap — libx264 menolak dimensi ganjil
        '-vf',
        "scale='min(640,iw)':'min(640,ih)':force_original_aspect_ratio=decrease," +
          'scale=trunc(iw/2)*2:trunc(ih/2)*2,fps=24',
        '-c:v', 'libx264', '-crf', '30', '-preset', 'fast', '-pix_fmt', 'yuv420p',
        '-movflags', '+faststart',
        join(VID_OUT, name),
      ],
      { stdio: 'pipe' },
    )
    videos.push(`video/addon/${name}`)
    sources.videos.push(src.replace(/\\/g, '/'))
    console.log(`video ${iVid}: ${f}`)
  }
  } catch (e) {
    // File rusak/tidak terbaca — lewati, jangan gagalkan seluruh impor
    if (IMG_EXT.has(ext)) iImg--
    else if (VID_EXT.has(ext)) iVid--
    skipped.push(f)
    console.log(`GAGAL, dilewati: ${f} (${String(e.message).split('\n')[0]})`)
  }
}

const banner = `// DIBUAT OTOMATIS oleh scripts/import-addon.mjs — jangan diedit manual.
// Sumbernya: media-src/addon (tidak ikut di-upload ke repo).
`

writeFileSync(
  'src/data/addon-media.js',
  `${banner}
export const addonPhotos = ${JSON.stringify(photos, null, 2)}

export const addonVideos = ${JSON.stringify(videos, null, 2)}
`,
)

// Dipakai make-memory-video.mjs supaya montase memakai file asli (kualitas penuh)
writeFileSync('scripts/addon-sources.json', JSON.stringify(sources, null, 2))

const mb = (dir) =>
  readdirSync(dir).reduce((s, f) => s + statSync(join(dir, f)).size, 0) / 1048576

console.log(
  `\nSelesai: ${photos.length} foto (${mb(IMG_OUT).toFixed(1)}MB), ` +
    `${videos.length} video (${mb(VID_OUT).toFixed(1)}MB)`,
)
if (skipped.length) console.log(`Dilewati (${skipped.length}): ${skipped.join(', ')}`)
