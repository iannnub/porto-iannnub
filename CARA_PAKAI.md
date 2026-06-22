# Cara Pakai Paket Ini di Antigravity

Paket ini berisi 6 file inti + 1 prompt pemicu, sudah disusun sesuai cara kerja native Antigravity
(Rules vs spec files biasa) — bukan format yang harus diketik manual satu per satu.

## Struktur folder yang sudah dibuat
```
antigravity-portfolio/
├── .agents/rules/
│   ├── product.md       ← konteks permanen: untuk siapa, tujuan, "definisi selesai"
│   ├── tech.md          ← stack teknis yang dikunci + strategi hosting (Vercel/EmailJS, opsional InfinityFree)
│   └── structure.md     ← struktur folder, breakpoint, konvensi nama
├── specs/portfolio-website/
│   ├── requirements.md  ← SEMUA konten asli dari LinkedIn-mu + requirement fungsional (format EARS)
│   ├── design.md        ← konsep visual "The Journey" (jalan + mobil 3D), warna, tipografi, animasi
│   └── tasks.md         ← daftar tugas per-fase, termasuk fase testing/debugging & deploy
└── MASTER_PROMPT.md     ← prompt yang kamu tempel ke chat Antigravity
```

## Langkah-langkah

1. **Buat folder project baru di komputermu**, misalnya `portfolio-septian/`, lalu copy seluruh isi
   `antigravity-portfolio/` (termasuk folder `.agents/` dan `specs/`) ke dalamnya.

2. **Buka folder itu di Antigravity** (File → Add Folder to Workspace / Open Folder).

3. Antigravity otomatis membaca `product.md`, `tech.md`, dan `structure.md` dari `.agents/rules/`
   sebagai konteks permanen — kamu tidak perlu apa-apakan lagi, cukup pastikan folder `.agents`
   ikut ter-copy.

4. Buka chat Agent di Antigravity, **copy-paste seluruh isi `MASTER_PROMPT.md`** sebagai pesan
   pertama.

5. Antigravity akan menunjukkan **Implementation Plan** dulu (artifact bawaan Antigravity) —
   baca sebentar, kalau sudah masuk akal klik **Proceed/Approve**.

6. Antigravity lalu mulai membangun per-fase sesuai `tasks.md`. Sesekali dia akan menunjukkan
   **Task List** artifact — kamu bisa pantau progres dari situ tanpa harus scroll chat.

7. Kalau di tengah jalan dia berhenti dan bertanya (misalnya minta link GitHub/email/CV), jawab
   langsung di chat. Kalau kamu belum punya jawabannya, suruh dia lanjut dulu dan tandai sebagai
   placeholder — sudah diinstruksikan di prompt untuk tidak mengarang data.

8. Setelah Phase 12 (testing/debugging) selesai, **benar-benar buka hasilnya di browser sendiri**
   sebelum lanjut ke deploy — perkecil/perbesar window, coba di HP kalau bisa. AI bisa lolos dari
   tes otomatisnya sendiri tapi tetap meleset secara visual; mata kamu adalah pengecekan terakhir.

9. Phase 13 = deploy ke Vercel. Kalau kamu belum punya akun Vercel, hubungkan repo GitHub-nya nanti
   lewat dashboard Vercel (import project → pilih repo → deploy). Environment variable EmailJS
   (3 buah, lihat `.env.example` yang akan dibuatkan) diisi di Vercel Project Settings → Environment
   Variables, bukan di kode.

## Soal hosting — ringkasannya
- **Default (disarankan): frontend-only di Vercel.** Form kontak pakai EmailJS, gratis, tidak perlu
  server sama sekali. Ini cukup untuk 95% kebutuhan portfolio.
- **InfinityFree baru relevan** kalau suatu saat kamu mau menambah fitur yang benar-benar butuh
  server+database (guestbook, visitor counter, panel admin untuk edit konten tanpa push kode).
  Itu sudah saya siapkan sebagai **Phase 14 (opsional)** di `tasks.md` — tidak akan dikerjakan
  kecuali kamu minta secara eksplisit, supaya project utamamu tetap sederhana dan cepat.

## Kalau mau ubah konsep animasinya
Konsep "jalan + mobil 3D" di `design.md` adalah satu pilihan yang kuat dan cocok dengan latar
belakangmu (proyek tourism + cerita karier sebagai "perjalanan"), tapi itu bisa kamu ganti. Tinggal
edit bagian "Creative concept" di `specs/portfolio-website/design.md` sebelum mulai prompt ke
Antigravity — misalnya kalau kamu lebih suka tema "jaringan AI/RAG" (bola partikel bercahaya) tanpa
elemen mobil sama sekali, cukup tulis ulang bagian itu, sisanya (warna, tipografi, breakpoint,
performance tier) tetap berlaku.
