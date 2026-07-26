// Membuat montase "A Little Film" dari SELURUH foto & video:
// aset lama (img/gallery/1-25, video/1-6) + semua hasil impor media-src/addon.
//
// Jalankan: node scripts/make-memory-video.mjs
// Durasi target bisa diubah: node scripts/make-memory-video.mjs 300
import ffmpegPath from 'ffmpeg-static'
import { execFileSync } from 'node:child_process'
import { existsSync, mkdirSync, readFileSync, rmSync, statSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

const TARGET = Number(process.argv[2]) || 300 // detik (default 5 menit, pas untuk voice-over)
const W = 1280
const H = 720
const FPS = 25
const FADE = 0.3 // fade putih di ujung tiap klip
const VID_CLIP = 2.2 // durasi potongan tiap video
const AUDIO = 'public/audio/cahaya.mp3'
const OUT = 'public/video/memories-2026.mp4'
const TMP = 'scripts/.videotmp'

function run(args) {
  execFileSync(ffmpegPath, ['-y', '-hide_banner', '-loglevel', 'error', ...args], {
    stdio: 'inherit',
  })
}

function duration(file) {
  try {
    execFileSync(ffmpegPath, ['-i', file], { stdio: 'pipe' })
  } catch (e) {
    const m = e.stderr.toString().match(/Duration: (\d+):(\d+):([\d.]+)/)
    if (m) return +m[1] * 3600 + +m[2] * 60 + +m[3]
  }
  return 0
}

// ---- kumpulkan sumber -------------------------------------------------
const addon = existsSync('scripts/addon-sources.json')
  ? JSON.parse(readFileSync('scripts/addon-sources.json', 'utf8'))
  : { photos: [], videos: [] }

const photos = [
  ...Array.from({ length: 25 }, (_, i) => `public/img/gallery/${i + 1}.jpg`),
  // foto addon dipakai versi 1080px-nya: cukup tajam untuk output 720p
  ...addon.photos.map((_, i) => `public/img/gallery/addon/${String(i + 1).padStart(3, '0')}.jpg`),
].filter(existsSync)

// video memakai file ASLI (kualitas penuh), bukan versi kecil untuk bubble
const videos = [
  ...Array.from({ length: 6 }, (_, i) => `public/video/${i + 1}.mp4`),
  ...addon.videos,
].filter(existsSync)

console.log(`Sumber: ${photos.length} foto, ${videos.length} video — target ${TARGET}s`)

// ---- hitung durasi per foto agar total mendekati TARGET ---------------
const vidDurs = videos.map((v) => Math.min(VID_CLIP, Math.max(0.8, duration(v))))
const vidTotal = vidDurs.reduce((a, b) => a + b, 0)
const photoDur = Math.max(0.9, (TARGET - vidTotal) / photos.length)
const photoFrames = Math.round(photoDur * FPS)
console.log(`Foto ${photoDur.toFixed(2)}s masing-masing, video ${vidTotal.toFixed(1)}s total`)

// ---- susun urutan: video disisipkan berkala di antara foto ------------
const seq = []
const gap = Math.max(1, Math.floor(photos.length / videos.length))
let vi = 0
photos.forEach((p, i) => {
  seq.push({ t: 'p', src: p })
  if (i % gap === gap - 1 && vi < videos.length) {
    seq.push({ t: 'v', src: videos[vi], dur: vidDurs[vi] })
    vi++
  }
})
while (vi < videos.length) {
  seq.push({ t: 'v', src: videos[vi], dur: vidDurs[vi] })
  vi++
}

// ---- render tiap klip -------------------------------------------------
rmSync(TMP, { recursive: true, force: true })
mkdirSync(TMP, { recursive: true })

// latar blur mengisi frame, konten utuh di tengah (foto portrait tidak terpotong)
const blurFill = `split=2[bg][fg];[bg]scale=${W}:${H}:force_original_aspect_ratio=increase,crop=${W}:${H},gblur=sigma=25[bgb];[fg]scale=${W}:${H}:force_original_aspect_ratio=decrease[fgs];[bgb][fgs]overlay=(W-w)/2:(H-h)/2`

const clips = []
let total = 0

seq.forEach((item, idx) => {
  const out = join(TMP, `clip_${String(idx).padStart(4, '0')}.mp4`)
  try {
    if (item.t === 'p') {
      const vf = `${blurFill},scale=1920:1080,zoompan=z='1+0.06*on/${photoFrames}':x='(iw-iw/zoom)/2':y='(ih-ih/zoom)/2':d=${photoFrames}:s=${W}x${H}:fps=${FPS},fade=t=in:st=0:d=${FADE}:color=white,fade=t=out:st=${(photoDur - FADE).toFixed(2)}:d=${FADE}:color=white,setsar=1,format=yuv420p`
      run(['-i', item.src, '-filter_complex', vf, '-c:v', 'libx264', '-crf', '24', '-preset', 'veryfast', '-an', '-r', String(FPS), out])
      total += photoDur
    } else {
      // mulai sedikit ke dalam klip supaya tidak kena bagian goyang di awal
      const full = duration(item.src)
      const start = full > item.dur + 1 ? Math.min(full * 0.15, full - item.dur - 0.2) : 0
      const vf = `${blurFill},fps=${FPS},fade=t=in:st=0:d=${FADE}:color=white,fade=t=out:st=${(item.dur - FADE).toFixed(2)}:d=${FADE}:color=white,setsar=1,format=yuv420p`
      run(['-ss', String(start.toFixed(2)), '-i', item.src, '-t', String(item.dur.toFixed(2)), '-filter_complex', vf, '-c:v', 'libx264', '-crf', '24', '-preset', 'veryfast', '-an', '-r', String(FPS), out])
      total += item.dur
    }
    clips.push(out)
  } catch (e) {
    console.log(`  lewati (gagal render): ${item.src}`)
    return
  }
  if ((idx + 1) % 20 === 0) console.log(`  ${idx + 1}/${seq.length} klip`)
})

// ---- gabung + musik ---------------------------------------------------
writeFileSync(
  join(TMP, 'list.txt'),
  clips.map((c) => `file '${c.split(/[\\/]/).pop()}'`).join('\n'),
)

run([
  '-f', 'concat', '-safe', '0', '-i', join(TMP, 'list.txt'),
  // stream_loop: lagu diulang bila lebih pendek dari videonya
  '-stream_loop', '-1', '-i', AUDIO,
  '-filter_complex', `[1:a]afade=t=in:st=0:d=2,afade=t=out:st=${(total - 5).toFixed(2)}:d=5[a]`,
  '-map', '0:v', '-map', '[a]',
  '-c:v', 'copy', '-c:a', 'aac', '-b:a', '128k',
  '-t', String(total.toFixed(2)),
  '-movflags', '+faststart',
  OUT,
])

run(['-ss', '2', '-i', OUT, '-frames:v', '1', '-q:v', '3', 'public/img/memories-poster.jpg'])

rmSync(TMP, { recursive: true, force: true })
const mins = Math.floor(total / 60)
console.log(
  `\nSelesai: ${OUT} — ${mins}m ${Math.round(total % 60)}s, ` +
    `${(statSync(OUT).size / 1048576).toFixed(1)}MB, ${clips.length} klip`,
)
