---
description: File/folder structure, naming conventions, and responsive breakpoints. Always active.
alwaysApply: true
---

# Project Structure & Conventions

## Folder layout (create exactly this shape)
```
portfolio/
├── public/
│   ├── assets/
│   │   ├── models/          # .glb 3D models (road, car, icosphere, etc.)
│   │   ├── images/          # project thumbnails, logos, favicon source
│   │   └── og-image.png     # social share preview image
│   ├── favicon.ico
│   ├── robots.txt
│   └── sitemap.xml
├── src/
│   ├── data/                 # ALL real content lives here, typed
│   │   ├── profile.ts        # name, title, bio, contact, socials
│   │   ├── experience.ts
│   │   ├── projects.ts
│   │   ├── skills.ts
│   │   └── certifications.ts
│   ├── components/           # small, reusable, dumb UI pieces
│   │   ├── ui/                # Button, Badge, Card, SectionHeading, etc.
│   │   └── layout/             # Navbar, Footer, SectionWrapper
│   ├── sections/              # one file per full page section (see design.md)
│   │   ├── Hero.tsx
│   │   ├── About.tsx
│   │   ├── SkillsOrbit.tsx
│   │   ├── ExperienceJourney.tsx
│   │   ├── Projects.tsx
│   │   ├── Certifications.tsx
│   │   └── Contact.tsx
│   ├── three/                  # all R3F/Three.js scene code, isolated from UI
│   │   ├── RoadScene.tsx       # the scroll-driven road + car
│   │   ├── SkillsSphere.tsx
│   │   ├── IntroLoader.tsx
│   │   └── helpers/
│   ├── hooks/
│   │   ├── useReducedMotion.ts
│   │   ├── useDevicePerformanceTier.ts   # decides 3D fidelity (see tech.md)
│   │   └── useScrollProgress.ts
│   ├── lib/                   # pure utility functions, email sending, validation schemas
│   ├── styles/
│   │   └── globals.css
│   ├── App.tsx
│   └── main.tsx
├── tests/
│   ├── unit/                  # vitest specs, mirrors src/ structure
│   └── e2e/                   # playwright specs
├── .agents/rules/              # product.md, tech.md, structure.md (this file)
├── specs/portfolio-website/    # requirements.md, design.md, tasks.md
├── .env.example
├── tailwind.config.ts
├── tsconfig.json
├── vite.config.ts
└── package.json
```

## Naming conventions
- React components: `PascalCase.tsx` (e.g. `ProjectCard.tsx`).
- Everything else (hooks, utils, data files): `camelCase.ts`.
- Test files mirror the source file name with `.test.ts(x)` suffix.
- CSS/Tailwind: no custom class names invented ad hoc — use Tailwind utilities + the design tokens
  defined in `tailwind.config.ts`.
- Path alias `@/` maps to `src/` — always import via `@/components/...`, never relative
  `../../../`.

## Breakpoints (use these exact Tailwind values everywhere — do not invent new ones)
| Name    | Min width | Typical device            |
|---------|-----------|----------------------------|
| `xs`    | 360px     | small Android phones       |
| `sm`    | 480px     | most phones                |
| `md`    | 768px     | tablets / large phones landscape |
| `lg`    | 1024px    | small laptops               |
| `xl`    | 1280px    | laptops/desktops            |
| `2xl`   | 1536px    | large desktops/monitors     |

Every section must be explicitly checked and styled at `xs`, `md`, and `xl` at minimum — these are
the three checkpoints used during the testing phase in `tasks.md`.

## One-section-per-file rule
Each item in `src/sections/` renders inside a shared `<SectionWrapper id="...">` layout component
(from `components/layout/`) so spacing, max-width, and scroll-anchor IDs stay consistent. Never
duplicate section padding/margin logic inside individual section files.

## Data flow rule
Sections must NOT contain hardcoded copy. They import from `src/data/*.ts` and render it. This
guarantees that updating bio/projects/experience later never requires touching component code —
only the data files.
