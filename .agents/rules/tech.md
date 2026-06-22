---
description: Technology stack and engineering constraints. Always active — do not substitute libraries without a strong reason; if you must deviate, say why before doing it.
alwaysApply: true
---

# Tech Stack & Engineering Rules

## Stack (locked — do not swap frameworks mid-project)
- **Build tool:** Vite
- **Framework:** React 18 + TypeScript (strict mode on)
- **Styling:** Tailwind CSS (utility-first). Global tokens (colors, fonts, spacing) defined once in
  `tailwind.config.ts` per `design.md` — never hardcode hex colors in components.
- **3D:** `three`, `@react-three/fiber`, `@react-three/drei`
- **Scroll/timeline animation:** `gsap` + `gsap/ScrollTrigger`, used together with R3F (see
  `design.md` for how the road/journey scene syncs to scroll)
- **UI micro-interactions (non-3D):** `framer-motion`
- **Icons:** `lucide-react`
- **Forms:** `react-hook-form` + `zod` for validation
- **Contact form delivery:** `@emailjs/browser` (client-side, no backend required) — see Hosting
  section below for the alternative
- **Testing:** `vitest` + `@testing-library/react` (unit/component), `playwright` (E2E + visual
  smoke tests across breakpoints)
- **Lint/format:** ESLint (typescript-eslint + react-hooks plugin) + Prettier
- **Package manager:** npm

Do not introduce Next.js, Redux, a CSS-in-JS library, jQuery, Bootstrap, or any second 3D engine
(e.g. Babylon.js). One job, one tool.

## Hosting strategy (decide this before writing deployment config)
**Default: frontend-only, 100% free.**
1. The whole site is a static Vite/React build (`npm run build` → `dist/`).
2. Deploy `dist/` to **Vercel** (free Hobby tier). Add `vercel.json` only if SPA routing rewrites
   are needed (this project uses a single page with anchor-link sections, so a rewrite rule is
   usually unnecessary — confirm before adding one).
3. The contact form sends mail client-side via **EmailJS** (free tier, no server). Public key /
   service ID / template ID go in a `.env` file (`VITE_EMAILJS_*`), never hardcoded, and `.env` is
   git-ignored. Document required env vars in `.env.example`.
4. No database, no Node/PHP server process is required for v1.

**Optional path B — only if the user explicitly asks for a real backend later** (e.g. a guestbook,
visitor counter, or admin-editable content):
- Build a minimal REST API in PHP (InfinityFree only supports PHP/MySQL, not Node.js).
- Host that PHP API on **InfinityFree** free hosting.
- Enable CORS on the PHP API for the Vercel production domain.
- The React app calls it via `fetch()` using an env-configured `VITE_API_BASE_URL`.
- Be aware of InfinityFree limits: no guaranteed uptime SLA, free subdomains look unprofessional
  for a portfolio (prefer a custom domain pointed at Vercel for the main site even if a small PHP
  API lives on InfinityFree), and there's no native HTTPS for some free subdomains — check before
  relying on it for anything sensitive.
- Do NOT build this unless asked — it adds real complexity and a second deployment target for a
  site that doesn't need it.

## Performance budget (hard constraints, not suggestions)
- Initial JS bundle (gzipped) for first paint ≤ 250KB before the 3D scene lazy-loads.
- The Three.js/R3F bundle must be **code-split** and lazy-loaded (`React.lazy` + `Suspense`) — it
  must not block first contentful paint of the hero text.
- All 3D models/textures live in `public/assets/models` as `.glb` (compressed via Draco/Meshopt if
  >1MB) — never load uncompressed `.obj`/large PNG textures.
- Images: WebP/AVIF with explicit `width`/`height` to avoid layout shift; lazy-load below-the-fold
  images.
- On any viewport narrower than 768px OR when `navigator.hardwareConcurrency <= 4` OR when
  `prefers-reduced-motion: reduce` is set, the heavy scroll-driven 3D journey scene MUST fall back
  to a lighter version (static 3D render + CSS-based timeline, or fully static image) — see
  `design.md` → "Performance tiers". Never ship a 3D scene that drops below ~30fps on a mid-range
  phone; if you can't verify, default to the lighter tier.

## Code conventions
- Functional components only, no class components.
- One component per file, file name matches component name (`ProjectCard.tsx` exports
  `ProjectCard`).
- Strict TypeScript: no `any` unless justified with a comment.
- Co-locate component-specific styles as Tailwind classes in JSX; only use a separate CSS file for
  truly global resets/keyframes (`src/styles/globals.css`).
- Content (bio text, project list, experience, skills, certifications) lives in typed data files
  under `src/data/`, never inlined directly into JSX — components import and map over data.
- Every exported component gets a one-line JSDoc comment describing its purpose.
- No `console.log` left in committed code.

## Definition of "no bugs" for this project
- `npm run build` exits 0 with no TypeScript errors.
- `npm run lint` exits 0.
- `npx playwright test` passes on Chromium, Firefox, and WebKit, at mobile (390×844), tablet
  (768×1024), and desktop (1440×900) viewports.
- Manual check in real Chrome + Safari (mobile) before calling anything "shippable."
