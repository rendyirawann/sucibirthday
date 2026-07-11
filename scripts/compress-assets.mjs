import sharp from 'sharp'
import ffmpegPath from 'ffmpeg-static'
import { execFileSync } from 'node:child_process'
import { statSync, readFileSync, writeFileSync, copyFileSync, unlinkSync } from 'node:fs'

const results = []

// 1) Galeri: auto-rotate (EXIF), resize maks 720px, mozjpeg q80.
//    Hanya menimpa bila hasilnya lebih kecil.
for (let i = 1; i <= 25; i++) {
  const p = `public/img/gallery/${i}.jpg`
  const before = statSync(p).size
  // Baca ke buffer dulu supaya sharp tidak memegang handle file saat ditimpa
  const buf = await sharp(readFileSync(p))
    .rotate()
    .resize({ width: 720, height: 720, fit: 'inside', withoutEnlargement: true })
    .jpeg({ quality: 80, mozjpeg: true })
    .toBuffer()
  if (buf.length < before) writeFileSync(p, buf)
  results.push([p, before, Math.min(buf.length, before)])
}

// 2) Gambar misi & PNG besar lain -> WebP.
//    Yang dipakai situs (tampil 80x80): 240px. Sisanya arsip: 512-1024px.
const pngs = [
  ['mission_1a.png', 240],
  ['mission_2a.png', 240],
  ['mission_3.png', 240],
  ['mission_4a.png', 240],
  ['mission_1.png', 512],
  ['mission_2.png', 512],
  ['mission_3a.png', 512],
  ['mission_4.png', 512],
  ['dc.png', 1024],
]
for (const [name, size] of pngs) {
  const p = `public/img/${name}`
  const out = p.replace(/\.png$/, '.webp')
  const before = statSync(p).size
  await sharp(readFileSync(p))
    .resize({ width: size, height: size, fit: 'inside', withoutEnlargement: true })
    .webp({ quality: 87 })
    .toFile(out)
  results.push([`${p} -> .webp`, before, statSync(out).size])
}

// 3) Video: coba (a) re-encode crf 23 tanpa audio, (b) copy stream tanpa audio.
//    Pakai yang paling kecil; keduanya + faststart agar mulai diputar lebih cepat.
for (let i = 1; i <= 6; i++) {
  const p = `public/video/${i}.mp4`
  const before = statSync(p).size
  const re = `public/video/_re_${i}.mp4`
  const cp = `public/video/_cp_${i}.mp4`
  execFileSync(ffmpegPath, ['-y', '-i', p, '-an', '-c:v', 'libx264', '-crf', '23', '-preset', 'slow', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', re], { stdio: 'pipe' })
  execFileSync(ffmpegPath, ['-y', '-i', p, '-an', '-c:v', 'copy', '-movflags', '+faststart', cp], { stdio: 'pipe' })
  const best = [[statSync(re).size, re], [statSync(cp).size, cp]].sort((a, b) => a[0] - b[0])[0]
  if (best[0] < before) copyFileSync(best[1], p)
  unlinkSync(re)
  unlinkSync(cp)
  results.push([p, before, Math.min(best[0], before)])
}

let tb = 0
let ta = 0
for (const [p, b, a] of results) {
  tb += b
  ta += a
  console.log(`${p}\t${(b / 1024).toFixed(0)}KB -> ${(a / 1024).toFixed(0)}KB`)
}
console.log(`\nTOTAL: ${(tb / 1048576).toFixed(1)}MB -> ${(ta / 1048576).toFixed(1)}MB`)
