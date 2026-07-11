// Membuat montase memori ±90 detik dari semua foto galeri + video kubus.
// Jalankan ulang kapan pun dengan: node scripts/make-memory-video.mjs
import ffmpegPath from 'ffmpeg-static'
import { execFileSync } from 'node:child_process'
import { mkdirSync, rmSync, writeFileSync, statSync } from 'node:fs'
import { join } from 'node:path'

const TMP = 'scripts/.videotmp'
rmSync(TMP, { recursive: true, force: true })
mkdirSync(TMP, { recursive: true })

const W = 1280
const H = 720
const FPS = 25
const PHOTO_FRAMES = 68 // 2.72 detik per foto
const PHOTO_DUR = PHOTO_FRAMES / FPS
const FADE = 0.35 // fade putih masuk/keluar per klip

// Durasi tiap video sumber (detik)
const VIDEO_DUR = { 1: 2.39, 2: 3.23, 3: 6.5, 4: 1.11, 5: 6.63, 6: 1.72 }

function run(args) {
  execFileSync(ffmpegPath, ['-y', '-hide_banner', '-loglevel', 'error', ...args], {
    stdio: 'inherit',
  })
}

// Urutan: video pembuka, lalu 4 foto per video, sisanya foto di akhir
const photos = Array.from({ length: 25 }, (_, i) => ({ t: 'p', src: `public/img/gallery/${i + 1}.jpg` }))
const vids = [1, 2, 3, 4, 5, 6].map((n) => ({ t: 'v', n, src: `public/video/${n}.mp4` }))
const seq = [vids[0]]
let pi = 0
for (let v = 1; v <= 5; v++) {
  seq.push(...photos.slice(pi, pi + 4))
  pi += 4
  seq.push(vids[v])
}
seq.push(...photos.slice(pi))

// Latar blur + konten fit di tengah (foto portrait tidak terpotong)
const blurFill = `split=2[bg][fg];[bg]scale=${W}:${H}:force_original_aspect_ratio=increase,crop=${W}:${H},gblur=sigma=25[bgb];[fg]scale=${W}:${H}:force_original_aspect_ratio=decrease[fgs];[bgb][fgs]overlay=(W-w)/2:(H-h)/2`

const clips = []
let total = 0
seq.forEach((item, idx) => {
  const out = join(TMP, `clip_${String(idx).padStart(2, '0')}.mp4`)
  if (item.t === 'p') {
    // Foto: blur-fill lalu zoom pelan (Ken Burns), fade putih di ujung
    const vf = `${blurFill},scale=2560:1440,zoompan=z='1+0.07*on/${PHOTO_FRAMES}':x='(iw-iw/zoom)/2':y='(ih-ih/zoom)/2':d=${PHOTO_FRAMES}:s=${W}x${H}:fps=${FPS},fade=t=in:st=0:d=${FADE}:color=white,fade=t=out:st=${(PHOTO_DUR - FADE).toFixed(2)}:d=${FADE}:color=white,format=yuv420p`
    run(['-i', item.src, '-filter_complex', vf, '-c:v', 'libx264', '-crf', '21', '-preset', 'fast', '-an', out])
    total += PHOTO_DUR
  } else {
    const dur = VIDEO_DUR[item.n]
    const vf = `${blurFill},fps=${FPS},fade=t=in:st=0:d=${FADE}:color=white,fade=t=out:st=${(dur - FADE).toFixed(2)}:d=${FADE}:color=white,format=yuv420p`
    run(['-i', item.src, '-filter_complex', vf, '-c:v', 'libx264', '-crf', '21', '-preset', 'fast', '-an', out])
    total += dur
  }
  clips.push(out)
  console.log(`clip ${idx + 1}/${seq.length} selesai (${item.src})`)
})

// Gabungkan + lagu (fade in/out), potong pas durasi video.
// Entri concat relatif terhadap lokasi list.txt — cukup nama file.
writeFileSync(join(TMP, 'list.txt'), clips.map((c, i) => `file 'clip_${String(i).padStart(2, '0')}.mp4'`).join('\n'))
const AUDIO = 'public/audio/bercintalewatkata.mp3'
run([
  '-f', 'concat', '-safe', '0', '-i', join(TMP, 'list.txt'),
  '-i', AUDIO,
  '-filter_complex', `[1:a]afade=t=in:st=0:d=1.5,afade=t=out:st=${(total - 4).toFixed(2)}:d=4[a]`,
  '-map', '0:v', '-map', '[a]',
  '-c:v', 'copy', '-c:a', 'aac', '-b:a', '128k',
  '-shortest', '-movflags', '+faststart',
  'public/video/memories-2026.mp4',
])

// Poster untuk elemen <video>
run(['-ss', '3.2', '-i', 'public/video/memories-2026.mp4', '-frames:v', '1', '-q:v', '3', 'public/img/memories-poster.jpg'])

rmSync(TMP, { recursive: true, force: true })
const size = statSync('public/video/memories-2026.mp4').size
console.log(`\nSelesai: public/video/memories-2026.mp4 — ${total.toFixed(1)}s, ${(size / 1048576).toFixed(1)}MB`)
