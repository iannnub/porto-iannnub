# Tasks — Personal Portfolio Website
Work through phases in order. Each phase must satisfy "Definition of done" (`product.md`) for the
parts it touches before moving to the next phase. Check items off as you complete them.

## Phase 0 — Project setup
- [ ] Scaffold Vite + React + TypeScript project
- [ ] Install and configure Tailwind CSS with design tokens from `design.md`
- [ ] Install: three, @react-three/fiber, @react-three/drei, gsap, framer-motion, lucide-react,
      react-hook-form, zod, @emailjs/browser
- [ ] Install dev deps: vitest, @testing-library/react, @testing-library/jest-dom, playwright,
      eslint + typescript-eslint + eslint-plugin-react-hooks, prettier
- [ ] Set up path alias `@/` → `src/` in `tsconfig.json` and `vite.config.ts`
- [ ] Create the exact folder structure from `structure.md`
- [ ] Add `.env.example` with `VITE_EMAILJS_SERVICE_ID`, `VITE_EMAILJS_TEMPLATE_ID`,
      `VITE_EMAILJS_PUBLIC_KEY` placeholders; add `.env` to `.gitignore`
- [ ] Configure ESLint + Prettier; `npm run lint` runs clean on the empty scaffold

## Phase 1 — Data layer
- [ ] `src/data/profile.ts` — typed object with name, headline, location, bio paragraphs, stat
      row values, social links (mark unknown ones clearly, e.g. `github: null /* ADD LINK */`)
- [ ] `src/data/experience.ts` — array of the 4 roles from `requirements.md` §1.3, typed
- [ ] `src/data/projects.ts` — array of project entries from §1.4 (apply the dedup note for the
      two internship-overlap projects), typed, including `liveUrl?: string` for JemberTrip
- [ ] `src/data/skills.ts` — categorized skill list (Frontend / Backend & AI / Cloud & Tools /
      Soft Skills) derived from the bio + project skill tags
- [ ] `src/data/certifications.ts` — array of the 5 entries from §1.6, typed
- [ ] Unit test: a simple data-integrity test asserting every project/experience/cert object has
      all required fields non-empty (catches typos early, cheap to write)

## Phase 2 — Layout shell & design system
- [ ] Configure `tailwind.config.ts` with the full color/typography/spacing tokens from `design.md`
- [ ] Load Sora, Inter, JetBrains Mono fonts (self-hosted or Google Fonts link — prefer
      self-hosted `@fontsource` packages to avoid an external render-blocking request)
- [ ] Build `components/layout/Navbar.tsx` (desktop + mobile hamburger, scroll-spy active link)
- [ ] Build `components/layout/Footer.tsx`
- [ ] Build `components/layout/SectionWrapper.tsx` (shared max-width/padding/scroll-id wrapper)
- [ ] Build base `components/ui/` primitives: Button, Badge, Card, SectionHeading
- [ ] Wire up `App.tsx` with all section placeholders (empty sections OK at this point) and verify
      navbar scroll-to-section works end to end

## Phase 3 — Hero + intro loader
- [ ] Build `IntroLoader` per `design.md` §0, with the hard 2.5s timeout fallback
- [ ] Implement `useDevicePerformanceTier()` hook (Phase 3 is the first consumer of it)
- [ ] Build the `full`-tier `RoadScene` (R3F): road, idle car, ambient particles, mouse-parallax
      camera tilt — lazy-loaded via `React.lazy`/`Suspense`
- [ ] Build `lite` and `static` hero fallbacks
- [ ] Build `Hero.tsx`: name, typewriter role line, value statement, 2 CTAs, scroll-down indicator
- [ ] Verify: hero never shows a blank canvas if WebGL init fails (NFR-6) — test by forcing a
      WebGL context failure manually (e.g. via Chrome's "Disable WebGL" flag) and confirming
      graceful fallback

## Phase 4 — Experience journey
- [ ] Build the `full`-tier scroll-pinned road+car scene with 4 checkpoint signposts (GSAP
      ScrollTrigger `pin`)
- [ ] Build the `lite`-tier CSS `offset-path` version
- [ ] Build the `static`-tier plain vertical timeline with IntersectionObserver fade-ins
- [ ] Confirm content parity: all 4 roles, correct order, all bullets, across all 3 tiers
- [ ] Confirm the pinned scroll section has a clear "released" state — user is never stuck unable
      to scroll past it

## Phase 5 — Skills section
- [ ] Build the orbiting-icons 3D/CSS version (`full`/`lite`) with hover label + optional
      project-filter interaction (FR-10)
- [ ] Build the `static` flat tag-grid fallback
- [ ] Verify keyboard users can still reach and "activate" skill info (don't make hover the only
      way to read a label — also expose text on small screens/tap)

## Phase 6 — Projects
- [ ] Build `ProjectCard` with hover tilt (framer-motion, no R3F)
- [ ] Build the responsive grid (1/2/3 columns) per breakpoints
- [ ] Wire the JemberTrip live link; confirm `target=_blank` + `rel=noopener noreferrer`
- [ ] Implement skill-tag filtering bridge from Skills section if Phase 5's FR-10 hook was built

## Phase 7 — Certifications
- [ ] Build certification badge cards + stagger-fade-in grid

## Phase 8 — Contact
- [ ] Build the form with react-hook-form + zod schema (name required, email valid-format
      required, message required, min length)
- [ ] Wire EmailJS submission; success/error UI states per FR-17; preserve input on failure
- [ ] Add direct social/contact links column
- [ ] Add basic spam mitigation (honeypot field is sufficient for v1 — no CAPTCHA needed)

## Phase 9 — Responsive QA pass (do this as its own dedicated pass, not "as you go")
- [ ] Walk every section at `xs` (360px), `md` (768px), and `xl` (1280px) widths in Chrome
      DevTools device toolbar; fix any overflow, overlap, or truncation issues found
- [ ] Confirm the `full` → `lite` → `static` tier logic actually switches correctly when
      simulating throttled CPU / touch device / `prefers-reduced-motion` in DevTools
- [ ] Test on at least one real mobile device or BrowserStack-equivalent if available; note in the
      task log if this step was skipped and why

## Phase 10 — Accessibility pass
- [ ] Run axe DevTools (or equivalent) on every section, fix all critical/serious issues
- [ ] Verify full keyboard navigation: tab order, visible focus rings, mobile menu is
      keyboard-dismissible, form is fully keyboard-operable
- [ ] Verify all images have meaningful `alt` text (or `alt=""` for purely decorative ones)
- [ ] Verify color contrast for all text/background combinations meets AA
- [ ] Verify `prefers-reduced-motion: reduce` actually removes/reduces all motion as designed

## Phase 11 — SEO & meta
- [ ] `<title>`, meta description, canonical URL
- [ ] Open Graph + Twitter Card tags with `og-image.png`
- [ ] Single `<h1>`, logical `h2`/`h3` hierarchy throughout
- [ ] `sitemap.xml`, `robots.txt`, favicon set

## Phase 12 — Testing & debugging (formal pass before declaring "done")
- [ ] Write/finish unit tests (vitest) for: data integrity (Phase 1), form validation logic, the
      `useDevicePerformanceTier` hook's branching logic
- [ ] Write Playwright E2E specs covering: navbar navigation to every section, mobile menu
      open/close, contact form happy-path submission (mock the EmailJS call) and validation-error
      path, project live-link opens correctly
- [ ] Run Playwright across Chromium/Firefox/WebKit at mobile/tablet/desktop viewports per
      `tech.md`'s "Definition of no bugs" — fix every failure before continuing
- [ ] `npm run build` — zero TypeScript errors
- [ ] `npm run lint` — zero errors
- [ ] Run Lighthouse (mobile + desktop) on the production build (`vite preview`, not dev server)
      — fix anything below the targets in `product.md` (Perf ≥85, A11y ≥95, Best Practices ≥95,
      SEO ≥95) before moving on
- [ ] Manually click every external link, every nav link, submit the contact form for real once
      with valid EmailJS credentials, and resize the window slowly from 320px to 1920px watching
      for any visual break
- [ ] Fix all bugs found above, then re-run the full check list once more to confirm nothing
      regressed

## Phase 13 — Build & deploy (Vercel, frontend-only path)
- [ ] Confirm `npm run build` output in `dist/` is correct and `vite preview` serves it without
      errors
- [ ] Add a `vercel.json` only if needed (single-page anchor-link site usually needs none — verify
      before adding)
- [ ] Set the EmailJS env vars in the Vercel project settings (not committed to git)
- [ ] Deploy to Vercel; verify the live production URL matches the local preview exactly
- [ ] Test the live contact form end-to-end on the deployed site (not just localhost)
- [ ] Re-run Lighthouse against the live production URL (numbers can differ from local preview)
- [ ] Report the final live URL and a short summary of any known limitations/placeholders left
      (e.g. missing GitHub link) back to the user

## Phase 14 — Optional backend (ONLY if explicitly requested later)
- [ ] Do not start this phase unless the user asks for a feature that genuinely needs a backend
      (guestbook, visit counter, admin-editable content, etc.)
- [ ] If requested: build the minimal PHP API, deploy to InfinityFree, configure CORS for the
      Vercel domain, wire `VITE_API_BASE_URL`, and repeat the relevant parts of Phase 12/13 testing
      for the new integration
