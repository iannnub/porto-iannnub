# 📄 PROJECT CONTEXT & ARCHITECTURE DOCUMENTATION
> **Catatan untuk AI:** Dokumen ini berisi spesifikasi teknis, alur kerja (workflow), arsitektur komponen, dan *tech stack* lengkap dari project **Portofolio Pribadi Septian Putra Rachman Hakim (iannnub)**. Gunakan dokumen ini sebagai *ground truth* / konteks utama saat menganalisis, memodifikasi, atau mengembangkan fitur baru pada project ini.

---

## 1. 📌 Ringkasan Project (Project Overview)
- **Nama Project:** `porto-iannnub` (Personal Portfolio Website)
- **Pemilik Portofolio:** Septian Putra Rachman Hakim (He/Him)
- **Role/Identitas:** Software Engineer | Technical Support & Operations Specialist | AI Enthusiast
- **Lokasi:** Jember, Jawa Timur, Indonesia
- **Live Demo:** [porto-iannnub.vercel.app](https://porto-iannnub.vercel.app/)
- **Repository:** [github.com/iannnub/iannnub-port](https://github.com/iannnub/iannnub-port)
- **Tujuan Project:** Web portofolio interaktif berperforma tinggi dengan tema modern cyber/JDM aesthetic untuk memamerkan proyek AI/Web, sertifikasi, keahlian teknis, dan perjalanan karier secara interaktif tanpa mengorbankan performa mobile.

---

## 2. 🛠️ Tech Stack & Dependencies Lengkap

### Core Framework & Build Tools
- **Runtime & Language:** TypeScript (Strict mode aktif, tanpa `any` tanpa justifikasi)
- **Framework:** React 19 / 18 (Functional Components + Hooks only)
- **Build Tool & Dev Server:** Vite 8 (ESM Native, lightning-fast HMR)
- **Package Manager:** npm

### Styling & Design System
- **CSS Framework:** Tailwind CSS v3 (Utility-first) + PostCSS + Autoprefixer
- **Design Tokens (CSS Variables):**
  - Background: `--bg-base` (`#050508`), `--bg-elevated` (`#0a0a12`), `--bg-elevated-2` (`#12121e`)
  - Accent Colors: `--accent-red` (`#E0282E`), `--accent-blue` (`#2D6CDF`), `--accent-blue-glow`
  - Typography Colors: `--text-primary` (`#F3F4F6`), `--text-secondary` (`#9CA3AF`)
- **Typography / Fonts:**
  - `@fontsource/anton` (Display font untuk judul/heading uppercase)
  - `@fontsource/inter` (Body text font yang clean dan readable)
  - `@fontsource/jetbrains-mono` (Monospace untuk tags, status, coding labels)
- **Utilities:** `clsx`, `tailwind-merge` untuk dynamic classnames

### 3D Graphics & Animations
- **3D Engine:** `three` (Three.js v0.170)
- **React 3D Integrations:**
  - `@react-three/fiber` (R3F v9) — React renderer untuk Three.js
  - `@react-three/drei` (Drei v10) — Helper komponen 3D (Points, PointMaterial, dll.)
- **Timeline & Scroll Animations:** `gsap` (GSAP v3.15) + `ScrollTrigger` (untuk pinning & scrubbing pengalaman perjalanan horisontal)
- **UI Micro-interactions:** `framer-motion` v12 (Spring physics, layout animations, AnimatePresence)

### Form Handling & Communication
- **Form State:** `react-hook-form` v7
- **Schema Validation:** `zod` v4
- **Form Resolver:** `@hookform/resolvers`
- **Email Dispatching:** `@emailjs/browser` (Client-side dispatching tanpa memerlukan backend server)

### Icons & Media Assets
- **Icons:** `lucide-react`, `react-icons` (FaLinkedin, dll.)
- **Audio:** Web Audio API / HTML5 Audio (`/jdm-engine.mp3` untuk efek starter engine)

### Testing & Code Quality
- **Unit Testing:** `vitest` + `@testing-library/react`
- **Linting & Formatting:** ESLint v10 (`typescript-eslint`, `eslint-plugin-react-hooks`, `eslint-plugin-react-refresh`) + Prettier

---

## 3. 📂 Struktur Folder & Konvensi Arsitektur

```text
porto-iannnub/
├── .agents/                      # Context rules untuk AI agent (product, tech, structure)
│   └── rules/
│       ├── product.md            # Definisi produk, persona pengguna, dan standar kualitas
│       ├── structure.md          # Konvensi penamaan, hierarki folder, breakpoint
│       └── tech.md               # Aturan teknis ketat, budget bundle, hosting
├── public/                       # Aset statis publik
│   ├── projects/                 # Tangkapan layar proyek (jembertrip, kakyo-lesson, dll.)
│   ├── jdm-engine.mp3            # Efek suara turbo flutter & ignition engine
│   └── *.jpg / *.png             # Sertifikat (dicoding.jpg, gc.jpg, dll.) & avatar
├── specs/portfolio-website/      # Dokumentasi spesifikasi SDD (Spec-Driven Development)
│   ├── design.md                 # Konsep visual, layout, warna, dan performance tiers
│   ├── requirements.md           # Kebutuhan fungsional dan data profil asli
│   └── tasks.md                  # Daftar pengerjaan fase implementasi
├── src/
│   ├── assets/                   # Aset gambar lokal (hero.png, react.svg, dll.)
│   ├── components/
│   │   ├── layout/               # Komponen kerangka halaman
│   │   │   ├── Footer.tsx        # Footer dengan navigasi sosial & copyright
│   │   │   ├── IntroLoader.tsx   # Loader interaktif "Start Engine" JDM + Porsche GT3 RS SVG
│   │   │   ├── Navbar.tsx        # Floating navbar dengan Glassmorphism & active spy
│   │   │   └── SectionWrapper.tsx# Wrapper seragam untuk kontainer setiap seksi
│   │   └── ui/                   # Reusable UI Atoms/Molecules
│   │       ├── Badge.tsx         # Tag badge (solid/outline varian red & blue)
│   │       ├── Button.tsx        # Tombol interaktif dengan efek glow/hover
│   │       ├── Card.tsx          # Card kontainer dengan border gradient & hover effect
│   │       ├── CustomCursor.tsx  # Custom pointer trail
│   │       ├── ProjectGalleryModal.tsx # Modal lightbox gambar untuk preview multi-screenshot proyek
│   │       └── SectionHeading.tsx# Header judul seksi seragam (title + subtitle)
│   ├── data/                     # Single Source of Truth (Semua Konten Bertipe Data TypeScript)
│   │   ├── certifications.ts     # Data sertifikat (AWS, Google Cloud, Dicoding)
│   │   ├── experience.ts         # Riwayat magang & kerja (Puskesmas, PT Antosa, dll.)
│   │   ├── profile.ts            # Bio, nama, headline peran, sosmed, kontak
│   │   ├── projects.ts           # Daftar proyek (JemberTrip, RAG Chatbot, Kakyo Lesson, dll.)
│   │   ├── skills.ts             # Pengelompokan keahlian (Frontend, Backend & AI, Cloud, Soft Skills)
│   │   └── types.ts              # Deklarasi interface TypeScript untuk semua data
│   ├── hooks/
│   │   ├── useDevicePerformanceTier.ts # Deteksi kapabilitas WebGL & device (Full vs Lite vs Static)
│   │   └── useScrollSpy.ts       # Mengamati scroll posisi untuk mengaktifkan tab nav yang sesuai
│   ├── lib/
│   │   └── utils.ts              # Helper classnames merger (cn = twMerge(clsx(...)))
│   ├── sections/                 # Modul Seksi Halaman Utama
│   │   ├── About.tsx             # Seksi biografi, profil singkat, dan metrik pengalaman
│   │   ├── Certifications.tsx    # Seksi kartu sertifikasi resmi
│   │   ├── Contact.tsx           # Form kontak EmailJS + validasi Zod + info sosmed
│   │   ├── ExperienceFull.tsx    # Seksi pengalaman desktop: GSAP Pinning horisontal + 3D Road
│   │   ├── ExperienceJourney.tsx # Controller switcher seksi pengalaman (Desktop vs Mobile)
│   │   ├── ExperienceLite.tsx    # Seksi pengalaman mobile: Timeline vertikal animasi
│   │   ├── ExperienceStatic.tsx  # Fallback murni jika WebGL / JS berat dinonaktifkan
│   │   ├── Hero.tsx              # Banner pembuka: Animated typewriter title + 3D spider web
│   │   ├── Projects.tsx          # Grid proyek dengan badge tag & tombol buka modal galeri
│   │   └── SkillsOrbit.tsx       # Seksi visualisasi skill tata surya (Orbiting) / fallback badge
│   ├── styles/
│   │   └── globals.css           # CSS variabel tema, scrollbar kustom, reset browser
│   ├── three/                    # Modul Three.js & R3F Khusus
│   │   ├── ExperienceRoadScene.tsx # Jalan 3D & wireframe gedung bergerak sesuai scroll scrub
│   │   ├── RoadScene.tsx         # Cyber spider interaktif dengan web bercahaya di Hero
│   │   └── SkillsSphere.tsx      # Komponen 3D sphere skill cadangan
│   ├── types/
│   ├── App.tsx                   # Main entry root komponen yang merangkai seluruh seksi
│   └── main.tsx                  # Vite React DOM root entrypoint
├── index.html                    # Root HTML + meta tags SEO + PWA viewport settings
├── tailwind.config.ts            # Konfigurasi token warna, font, dan screen breakpoints
├── vite.config.ts                # Konfigurasi plugin Vite & path alias '@' -> 'src/'
└── .env.example                  # Contoh variabel environment untuk EmailJS
```

---

## 4. 🔄 Alur Kerja Aplikasi (Application Flow & User Journey)

```
[1. User Membuka Website]
         │
         ▼
[IntroLoader: Interaktif "TAP TO START ENGINE"]
         │ (User klik / sentuh)
         ▼
[Memutar Audio Engine Rev & Turbo Flutter (/jdm-engine.mp3)]
         │
         ▼
[Animasi Transisi Porsche GT3 RS SVG Meluncur dengan Speed Lines]
         │ (Setelah 3.5 detik)
         ▼
[Halaman Utama Dimuat (Hero Section Render)]
  ├── Fixed Navbar (Kaca transparan + Auto Active Spy)
  ├── Background Neon Ambient Orbs (Fixed di background)
  │
  ├── 1. Hero: Teks Typewriter berputar + Canvas 3D Cyber Spider (Three.js)
  │
  ├── 2. About: Ringkasan pengalaman 5+ tahun, profil Information Systems, kartu statistik
  │
  ├── 3. Skills: Orbiting Skill Cards (animasi tata surya melingkar berputar otomatis)
  │
  ├── 4. Experience (Adaptive Performance Flow):
  │     ├── Jika Desktop & Performance "Full":
  │     │   └── ExperienceFull (Horizontal scroll pinning via GSAP ScrollTrigger + 3D wireframe road)
  │     └── Jika Mobile / Screen < 768px / Low GPU:
  │         └── ExperienceLite (Vertical timeline interaktif menggunakan Framer Motion)
  │
  ├── 5. Projects: Grid proyek interaktif + tombol Screenshot Gallery (ProjectGalleryModal)
  │
  ├── 6. Certifications: Showcase sertifikasi AWS, GCP, Dicoding dengan link kredensial
  │
  ├── 7. Contact: Form kontak divalidasi via Zod + terkirim via EmailJS API langsung ke email pemilik
  │
  └── Footer: Quick links, social handles (LinkedIn, GitHub, Instagram), copyright
```

---

## 5. 💡 Fitur Kunci & Pola Arsitektur (Architectural Patterns)

### 1. Data-Driven Content Separation (Pemisahan Data & UI)
- Semua konten tidak di-hardcode di file JSX/TSX.
- Jika ingin menambah/mengubah riwayat proyek, skill, pengalaman, atau profil, cukup perbarui file di `src/data/*.ts`.
- Tipe data terkontrol ketat oleh interface di `src/data/types.ts`:
  - `Profile`, `Project`, `Experience`, `SkillCategory`, `Certification`.

### 2. Multi-tier Performance & Responsive Fallback
- Menggunakan hook `useDevicePerformanceTier` untuk mendeteksi ketersediaan WebGL.
- Bagian **Experience** memiliki logika adaptif cerdas:
  - Layar desktop (> 768px): Memicu *GSAP horizontal scroll pinning* di mana card bergeser ke samping selaras dengan scrubbing kamera 3D di jalan raya cyberpunk (`ExperienceRoadScene`).
  - Layar ponsel (< 768px): Otomatis beralih ke `ExperienceLite` (timeline vertikal) untuk mencegah lag dan memastikan UX mobile tetap mulus 60 FPS.

### 3. Serverless Client-Side Form Delivery
- Form kontak dihandle oleh `react-hook-form` dan divalidasi real-time oleh `zod`.
- Pengiriman pesan menggunakan `@emailjs/browser` langsung dari browser pengguna ke email pemilik tanpa membutuhkan backend server Express/Node.js/PHP.
- Memiliki fallback simulasi sukses jika kunci environment (`.env`) belum disetup saat testing lokal.

---

## 6. ⚙️ Konfigurasi Environment (`.env`)
Untuk mengaktifkan fungsi form kontak secara riil, buat file `.env` di root project:
```env
VITE_EMAILJS_SERVICE_ID=service_xxxxxxx
VITE_EMAILJS_TEMPLATE_ID=template_xxxxxxx
VITE_EMAILJS_PUBLIC_KEY=user_xxxxxxxxxxxx
```

---

## 7. 🚀 Panduan Menjalankan Project (Commands)

```bash
# 1. Install seluruh dependensi
npm install

# 2. Jalankan server development lokal (http://localhost:5173)
npm run dev

# 3. Jalankan type checking TypeScript
npm run typecheck

# 4. Jalankan linter dan format checker
npm run lint
npm run format:check

# 5. Menjalankan unit test Vitest
npm test

# 6. Build untuk produksi (output ke dist/)
npm run build

# 7. Preview hasil build produksi secara lokal
npm run preview
```

---

## 8. 🤖 Instruksi untuk AI Assistant yang Membaca Dokumen Ini
Ketika diminta untuk membantu mengembangkan, memodifikasi, atau memecahkan masalah dalam project ini:
1. **Patuhi Arsitektur Data:** Jangan pernah meletakkan data mentah baru langsung di dalam komponen `.tsx`. Selalu buat atau perbarui entri di `src/data/*.ts`.
2. **Pertahankan TypeScript Strict:** Pastikan semua prop, state, dan data memiliki tipe data yang eksplisit. Hindari `any`.
3. **Desain & Warna:** Gunakan token warna Tailwind yang sudah didefinisikan (`accent-red`, `accent-blue`, `base`, `elevated`, `primary`, `secondary`). Jangan memasukkan sembarang hex color baru.
4. **Perhatikan Performa:** Jangan memasukkan library 3D tambahan (seperti Babylon.js atau anime.js). Gunakan stack yang sudah ada: Three.js/R3F untuk 3D, GSAP untuk scroll timeline, Framer Motion untuk UI micro-interactions.
5. **Responsif Mobile:** Setiap komponen baru harus diuji dan memiliki tampilan yang responsif baik di mobile (`< 768px`) maupun desktop.
