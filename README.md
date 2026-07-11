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

## Video montase ("A Little Film")

Video 90 detik di bagian akhir dibuat otomatis dari semua foto galeri + video:

```bash
node scripts/make-memory-video.mjs
```

Untuk memakai video buatanmu sendiri: cukup timpa `public/video/memories-2026.mp4`
(dan `public/img/memories-poster.jpg` untuk gambar sampulnya).

## Kompresi aset

Kalau menambah foto galeri / gambar / video baru, jalankan:

```bash
node scripts/compress-assets.mjs
```

Foto galeri di-resize ke 720px (mozjpeg q80, auto-rotate EXIF), gambar misi jadi
WebP 240px, video di-encode ulang tanpa track audio (kubus selalu muted) dengan
`+faststart`. Hanya menimpa bila hasilnya lebih kecil.

## Struktur

- `src/components/` — komponen layar (pintu masuk, splash, menu utama, misi, dll.)
- `src/data/content.js` — semua konten: playlist, misi, menu, teks ucapan
- `src/composables/useAudioPlayer.js` — state pemutar musik (dipakai bersama)
- `public/` — aset statis (audio, foto galeri, video kubus)
