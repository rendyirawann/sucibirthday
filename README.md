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

Push ke branch `main` otomatis men-deploy ke GitHub Pages lewat GitHub Actions
(lihat `.github/workflows/deploy.yml`).

> Catatan: sumber Pages harus diset ke **GitHub Actions**
> (Settings → Pages → Build and deployment → Source), bukan "Deploy from a branch".

## Struktur

- `src/components/` — komponen layar (pintu masuk, splash, menu utama, misi, dll.)
- `src/data/content.js` — semua konten: playlist, misi, menu, teks ucapan
- `src/composables/useAudioPlayer.js` — state pemutar musik (dipakai bersama)
- `public/` — aset statis (audio, foto galeri, video kubus)
