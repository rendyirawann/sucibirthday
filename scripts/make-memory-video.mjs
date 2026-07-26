// Membuat montase sinematik "A Little Film" dari SELURUH foto & video:
// aset lama (img/gallery/1-25, video/1-6) + semua hasil impor media-src/addon.
//
// Tampilan: letterbox ala layar lebar, latar blur gelap, color grade hangat,
// vignette, butiran film (grain), transisi fade-to-black, plus title card
// pembuka & penutup.
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
const BAR = 62 // tinggi bilah hitam atas & bawah -> area gambar 1280x596 (~2.15:1)
const FPS = 25
const FADE = 0.34
const VID_CLIP = 2.2
const AUDIO = 'public/audio/cahaya.mp3'
const OUT = 'public/video/memories-2026.mp4'
const TMP = 'scripts/.videotmp'

// ffmpeg di Windows perlu escape khusus untuk path font
const FONT = 'C\\:/Windows/Fonts/constan.ttf' // Constantia — serif elegan
const FONT_I = 'C\\:/Windows/Fonts/constani.ttf'

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

// ---- rantai filter sinematik -----------------------------------------
const CONTENT_H = H - BAR * 2

// Latar: gambar diperbesar menutup layar, di-blur, digelapkan & dikurangi
// saturasinya — seperti pantulan cahaya layar di dinding bioskop.
// Depan: gambar utuh, muat di dalam area 1280x596.
const frame =
  `split=2[bg][fg];` +
  `[bg]scale=${W}:${H}:force_original_aspect_ratio=increase,crop=${W}:${H},` +
  `gblur=sigma=32,eq=brightness=-0.16:saturation=0.5[bgb];` +
  `[fg]scale=${W}:${CONTENT_H}:force_original_aspect_ratio=decrease[fgs];` +
  `[bgb][fgs]overlay=(W-w)/2:(H-h)/2`

// Sentuhan akhir: grade hangat lembut, vignette, grain, lalu bilah hitam.
const look =
  `eq=contrast=1.07:saturation=0.95:gamma=0.99,` +
  `colorbalance=rs=.03:gs=.005:bs=-.03:rm=.02:bm=-.02,` +
  `vignette=PI/4.5,` +
  `noise=alls=7:allf=t+u,` +
  `drawbox=x=0:y=0:w=${W}:h=${BAR}:color=black@1:t=fill,` +
  `drawbox=x=0:y=${H - BAR}:w=${W}:h=${BAR}:color=black@1:t=fill`

const tail = `setsar=1,format=yuv420p`

// ---- kumpulkan sumber -------------------------------------------------
const addon = existsSync('scripts/addon-sources.json')
  ? JSON.parse(readFileSync('scripts/addon-sources.json', 'utf8'))
  : { photos: [], videos: [] }

const photos = [
  ...Array.from({ length: 25 }, (_, i) => `public/img/gallery/${i + 1}.jpg`),
  ...addon.photos.map((_, i) => `public/img/gallery/addon/${String(i + 1).padStart(3, '0')}.jpg`),
].filter(existsSync)

// video memakai file ASLI (kualitas penuh), bukan versi kecil untuk bubble
const videos = [
  ...Array.from({ length: 6 }, (_, i) => `public/video/${i + 1}.mp4`),
  ...addon.videos,
].filter(existsSync)

const CARD_IN = 5.5
const CARD_MID = 5
const CARD_OUT = 6.5

console.log(`Sumber: ${photos.length} foto, ${videos.length} video — target ${TARGET}s`)

const vidDurs = videos.map((v) => Math.min(VID_CLIP, Math.max(0.8, duration(v))))
const vidTotal = vidDurs.reduce((a, b) => a + b, 0)
const photoDur = Math.max(
  0.9,
  (TARGET - vidTotal - CARD_IN - CARD_MID - CARD_OUT) / photos.length,
)
const photoFrames = Math.round(photoDur * FPS)
console.log(`Foto ${photoDur.toFixed(2)}s masing-masing, video ${vidTotal.toFixed(1)}s total`)

// ---- susun urutan -----------------------------------------------------
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

// Kartu antar-babak di tengah film
seq.splice(Math.floor(seq.length / 2), 0, {
  t: 'card',
  dur: CARD_MID,
  lines: [
    { text: 'a year and a half later,', size: 40, y: 290, italic: true },
    { text: 'almost two on our journey !!', size: 40, y: 356, italic: true },
  ],
})

// ---- render -----------------------------------------------------------
rmSync(TMP, { recursive: true, force: true })
mkdirSync(TMP, { recursive: true })

const clips = []
let total = 0

// Title card: layar hitam, teks muncul & hilang perlahan
function card(file, dur, lines) {
  const draws = lines
    .map((l, i) => {
      const st = 0.7 + i * 0.55
      return (
        `drawtext=fontfile='${l.italic ? FONT_I : FONT}':text='${l.text}':` +
        `fontcolor=white@${l.dim ? 0.62 : 0.95}:fontsize=${l.size}:` +
        `x=(w-text_w)/2:y=${l.y}:` +
        `alpha='if(lt(t,${st}),0,if(lt(t,${st + 1.1}),(t-${st})/1.1,` +
        `if(lt(t,${dur - 1.2}),1,max(0,(${dur}-t)/1.2))))'`
      )
    })
    .join(',')
  run([
    '-f', 'lavfi', '-i', `color=c=black:s=${W}x${H}:d=${dur}:r=${FPS}`,
    '-vf', `${draws},noise=alls=6:allf=t+u,${tail}`,
    '-c:v', 'libx264', '-crf', '22', '-preset', 'veryfast', '-an', '-r', String(FPS),
    file,
  ])
}

const cardIn = join(TMP, 'clip_0000.mp4')
card(cardIn, CARD_IN, [
  { text: 'A LITTLE FILM', size: 58, y: 292, italic: false },
  { text: 'for Suci Wulandari', size: 30, y: 372, italic: true, dim: true },
])
clips.push(cardIn)
total += CARD_IN

seq.forEach((item, idx) => {
  const out = join(TMP, `clip_${String(idx + 1).padStart(4, '0')}.mp4`)
  try {
    if (item.t === 'card') {
      card(out, item.dur, item.lines)
      total += item.dur
    } else if (item.t === 'p') {
      // Tanpa zoompan: filter itu menggeser gambar per piksel bulat sehingga
      // fotonya terlihat bergetar. Foto ditahan diam, transisinya saja yang halus.
      const vf =
        `${frame},${look},` +
        `fade=t=in:st=0:d=${FADE},fade=t=out:st=${(photoDur - FADE).toFixed(2)}:d=${FADE},${tail}`
      run(['-loop', '1', '-framerate', String(FPS), '-t', photoDur.toFixed(2), '-i', item.src, '-filter_complex', vf, '-c:v', 'libx264', '-crf', '23', '-preset', 'veryfast', '-an', '-r', String(FPS), out])
      total += photoDur
    } else {
      const full = duration(item.src)
      const start = full > item.dur + 1 ? Math.min(full * 0.15, full - item.dur - 0.2) : 0
      const vf =
        `${frame},fps=${FPS},${look},` +
        `fade=t=in:st=0:d=${FADE},fade=t=out:st=${(item.dur - FADE).toFixed(2)}:d=${FADE},${tail}`
      run(['-ss', String(start.toFixed(2)), '-i', item.src, '-t', String(item.dur.toFixed(2)), '-filter_complex', vf, '-c:v', 'libx264', '-crf', '23', '-preset', 'veryfast', '-an', '-r', String(FPS), out])
      total += item.dur
    }
    clips.push(out)
  } catch (e) {
    console.log(`  lewati (gagal render): ${item.src}`)
    return
  }
  if ((idx + 1) % 25 === 0) console.log(`  ${idx + 1}/${seq.length} klip`)
})

const cardOut = join(TMP, 'clip_9999.mp4')
card(cardOut, CARD_OUT, [
  { text: 'happy birthday, sayang', size: 46, y: 280, italic: true },
  { text: '27 . 07 . 2026', size: 26, y: 358, italic: false, dim: true },
  { text: 'and many more to come', size: 24, y: 404, italic: true, dim: true },
])
clips.push(cardOut)
total += CARD_OUT

// ---- gabung + musik ---------------------------------------------------
writeFileSync(
  join(TMP, 'list.txt'),
  clips.map((c) => `file '${c.split(/[\\/]/).pop()}'`).join('\n'),
)

run([
  '-f', 'concat', '-safe', '0', '-i', join(TMP, 'list.txt'),
  '-stream_loop', '-1', '-i', AUDIO,
  '-filter_complex', `[1:a]afade=t=in:st=0:d=3,afade=t=out:st=${(total - 6).toFixed(2)}:d=6[a]`,
  '-map', '0:v', '-map', '[a]',
  '-c:v', 'copy', '-c:a', 'aac', '-b:a', '128k',
  '-t', String(total.toFixed(2)),
  '-movflags', '+faststart',
  OUT,
])

run(['-ss', '9', '-i', OUT, '-frames:v', '1', '-q:v', '3', 'public/img/memories-poster.jpg'])

rmSync(TMP, { recursive: true, force: true })
console.log(
  `\nSelesai: ${OUT} — ${Math.floor(total / 60)}m ${Math.round(total % 60)}s, ` +
    `${(statSync(OUT).size / 1048576).toFixed(1)}MB, ${clips.length} klip`,
)
