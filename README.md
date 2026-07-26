# 🎂 sucibirthday

Website undangan ulang tahun interaktif untuk Suci Wulandari — dibangun dengan
**Vue 3 + Vite + Tailwind CSS 4 + GSAP**.

Live: https://rendyirawann.github.io/sucibirthday/

## Development

```bash
npm install
npm run dev      # server development di http://localhost:5173
npm run build    # build production ke dist/
npm run preview  # preview hasil build
```

## Deploy

```bash
npm run deploy   # build lalu push hasil build ke branch gh-pages
```

Sumber Pages harus diset ke branch **gh-pages** (root):
Settings → Pages → Build and deployment → Deploy from a branch → `gh-pages` / `/ (root)`,
atau via CLI:

```bash
gh api -X PUT repos/rendyirawann/sucibirthday/pages -f build_type=legacy -f "source[branch]=gh-pages" -f "source[path]=/"
```

> Alternatif: deploy otomatis lewat GitHub Actions. File workflow-nya sudah
> disiapkan di `.github/workflows/deploy.yml` (belum di-commit karena butuh
> token dengan scope `workflow`). Jika mau memakainya: jalankan
> `gh auth refresh -s workflow`, commit file tersebut, lalu set sumber Pages
> ke "GitHub Actions".

## Menambah foto & video baru (banyak sekaligus)

1. Taruh file mentah dari HP di **`media-src/addon/`** (folder ini tidak ikut
   ter-upload ke GitHub karena terlalu besar — simpan cadangannya sendiri).
2. `node scripts/import-addon.mjs` — menghasilkan versi web ringan:
   foto 1080px ke `public/img/gallery/addon/`, potongan video 4 detik ke
   `public/video/addon/`, dan memperbarui `src/data/addon-media.js`.
3. `node scripts/make-memory-video.mjs` — membangun ulang montasenya.
4. `npm run deploy`

Aset lama (`img/gallery/1-25.jpg`, `video/1-6.mp4`) tidak pernah disentuh
script ini — folder addon murni tambahan.

## Video montase ("A Little Film")

Video di bagian akhir dibuat otomatis dari **seluruh** foto & video (lama + addon):

```bash
node scripts/make-memory-video.mjs           # versi web: 720p, ringan
node scripts/make-memory-video.mjs 180       # tentukan durasinya (detik)
node scripts/make-memory-video.mjs --master  # 1080p kualitas tinggi untuk diedit
```

Versi `--master` disimpan di `media-src/export/memories-2026-master-1080p.mp4`
(tidak ikut ter-upload). Pakai file itu kalau mau diedit di CapCut, lalu
timpa `public/video/memories-2026.mp4` dengan hasil ekspornya.

Durasi tiap foto dihitung otomatis supaya totalnya pas target.

Untuk memakai video buatanmu sendiri: cukup timpa `public/video/memories-2026.mp4`
(dan `public/img/memories-poster.jpg` untuk gambar sampulnya).

## Kompresi aset

Kalau menambah foto galeri / gambar / video baru, jalankan:

```bash
node scripts/compress-assets.mjs
```

Foto galeri di-resize ke 1080px (mozjpeg q80, auto-rotate EXIF), video di-encode
ulang tanpa track audio (kubus selalu muted) dengan `+faststart`. Hanya menimpa
bila hematnya berarti, supaya tidak terjadi re-encode berulang.

## Struktur

- `src/components/` — komponen layar (pintu masuk, splash, menu utama, misi, dll.)
- `src/data/content.js` — semua konten: playlist, misi, menu, teks ucapan
- `src/composables/useAudioPlayer.js` — state pemutar musik (dipakai bersama)
- `public/` — aset statis (audio, foto galeri, video kubus)
