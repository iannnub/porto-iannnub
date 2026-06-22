---
description: Product context — who this site is for, why it exists, and what "done" means. Always active.
alwaysApply: true
---

# Product: Septian Putra Rachman Hakim — Personal Portfolio Website

## What this is
A single, modern, animated personal portfolio website for **Septian Putra Rachman Hakim**, an
Information Systems student / Technical Support & AI-Web project builder based in Jember, East
Java, Indonesia. The site is the canonical, owned alternative to his LinkedIn profile: same
content, far better presentation, full control over design and hosting.

## Why it exists
- He is job-hunting / freelance-hunting for roles that blend **Technical Support, Customer
  Support, Web/API troubleshooting, and AI-assisted web development**.
- Recruiters and clients currently only see a LinkedIn page. This site must work harder: it should
  prove technical competence (clean code, smooth 3D animation, fast load) while still reading as
  approachable and people-friendly (because his actual job history is customer-facing).
- Secondary goal: a living showcase for his AI/RAG projects (JemberTrip, Jember RAG Chatbot) with
  working live links.

## Who it's for (primary personas)
1. **Recruiters / HR** scanning quickly on mobile — need the headline, role, and top 3 projects in
   the first 10 seconds, zero friction.
2. **Technical hiring managers / clients** who will actually click into project links and read the
   experience section closely, and may judge code quality via "View Source" or GitHub.
3. **Peers / lecturers / HIMAFORSI community** who want to see JemberTrip and the RAG chatbot.

## Source of truth for content
All real content (bio, experience, projects, certifications, skills) comes from
`specs/portfolio-website/requirements.md`, which was transcribed directly from his LinkedIn
export. Do not invent achievements, dates, or metrics that are not present there. If something is
ambiguous or missing, leave a clearly marked placeholder (e.g. `[ADD LINK]`) instead of guessing.

## Tone & voice
- Confident but warm — not corporate-stiff, not overly casual. Mirrors his own bio: "tech-savvy
  problem solver" who is also a people person.
- Bilingual-friendly: primary language is **English** for the UI copy (better for international
  recruiters), but it's fine/expected that some certificate/project names stay in Indonesian
  exactly as sourced (e.g. "Spec-Driven Development dengan Kiro").

## Definition of done
A feature/page is NOT done until:
1. It matches `requirements.md` and `design.md`.
2. It works and looks correct at all breakpoints in `structure.md` (mobile, tablet, laptop,
   desktop) — verified visually, not assumed.
3. It has zero console errors/warnings in the browser.
4. 3D/animated elements degrade gracefully on low-end devices and respect
   `prefers-reduced-motion`.
5. Lighthouse (mobile + desktop) scores: Performance ≥ 85, Accessibility ≥ 95, Best Practices ≥
   95, SEO ≥ 95.
6. It builds cleanly for production (`npm run build`) with no type errors.

## Explicit non-goals
- No CMS, no database, no user login/auth — this is a static personal site.
- No e-commerce, no blog engine (a future blog can be a separate project later).
- Don't over-engineer: this is a portfolio for one person, not a SaaS product. Prefer the simplest
  implementation that meets the design spec.
