# MASTER PROMPT — tempel ini ke chat Antigravity setelah file rules & specs sudah ditaruh di tempatnya

Kamu adalah senior front-end engineer sekaligus UI/UX designer yang akan membangun SATU website
portfolio pribadi dari nol, untuk Septian Putra Rachman Hakim.

Sebelum menulis kode apa pun, baca dan ikuti aturan permanen berikut (sudah otomatis kamu muat
sebagai Rules dari `.agents/rules/`):
- @.agents/rules/product.md
- @.agents/rules/tech.md
- @.agents/rules/structure.md

Lalu jalankan alur Spec-Driven Development penuh menggunakan dokumen berikut sebagai spec untuk
fitur "portfolio-website" (ini adalah satu-satunya fitur di repo ini, isinya seluruh website):
- @specs/portfolio-website/requirements.md
- @specs/portfolio-website/design.md
- @specs/portfolio-website/tasks.md

Instruksi kerja:

1. **Specify/Clarify** — Baca ketiga file spec di atas. Kalau menurutmu ada hal yang ambigu atau
   informasi yang hilang (misalnya link GitHub, email kontak, atau foto/CV), JANGAN mengarang
   nilai apa pun. Tandai sebagai placeholder yang jelas di `src/data/profile.ts` dan beri tahu saya
   di akhir, jangan tanya satu-satu di tengah proses kecuali benar-benar memblokir langkah
   berikutnya.

2. **Plan** — Buat Implementation Plan singkat berdasarkan urutan fase di
   `specs/portfolio-website/tasks.md`. Tunjukkan plan itu ke saya sebelum mulai eksekusi fase
   pertama.

3. **Implement, fase demi fase** — Kerjakan `tasks.md` dari Phase 0 sampai Phase 13 SECARA BERURUT.
   Jangan lompat ke fase 3D (Hero/Experience) sebelum Phase 0–2 (setup, data layer, layout shell)
   benar-benar selesai dan berjalan tanpa error. Setelah setiap fase, jalankan `npm run build` dan
   `npm run lint` untuk memastikan tidak ada yang rusak sebelum lanjut ke fase berikutnya.

4. **Jangan menyimpang dari stack** yang sudah ditetapkan di `tech.md` (Vite + React + TypeScript +
   Tailwind + Three.js/R3F + GSAP + framer-motion). Kalau menurutmu ada alasan kuat untuk
   menyimpang, jelaskan alasannya ke saya dulu sebelum melakukannya.

5. **Tingkat fidelitas 3D wajib tiga lapis** (`full` / `lite` / `static`) sesuai
   `design.md` — JANGAN kirim scene 3D berat tanpa fallback untuk HP/low-end device. Ini bukan opsional.

6. **Fase Testing & Debugging (Phase 12) wajib dijalankan secara formal**, bukan cuma "sambil
   jalan". Tulis unit test (vitest) dan E2E test (Playwright), jalankan di Chromium/Firefox/WebKit
   pada breakpoint mobile/tablet/desktop, jalankan Lighthouse pada production build (`vite
   preview`, bukan dev server), dan PERBAIKI semua bug/temuan sebelum lanjut ke deploy. Target skor
   Lighthouse ada di `product.md`.

7. **Deploy (Phase 13)** — Siapkan project untuk deploy ke **Vercel** (frontend-only, tanpa backend
   — form kontak pakai EmailJS sesuai `tech.md`). Jangan buat backend PHP/InfinityFree kecuali saya
   minta secara eksplisit (lihat Phase 14, ini opsional dan tidak untuk dikerjakan sekarang).

8. Di akhir, beri saya: (a) ringkasan apa yang sudah dibangun, (b) daftar placeholder/link yang
   masih perlu saya isi (GitHub, email, CV, dst), (c) hasil Lighthouse terakhir, dan (d) langkah
   persis untuk saya deploy ke Vercel (atau konfirmasi kalau kamu sudah men-deploy-nya).

Mulai dari Phase 0 sekarang. Tunjukkan dulu Implementation Plan-nya sebelum mengeksekusi kode.
