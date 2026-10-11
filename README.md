# Septian Putra Rachman Hakim (iannnub) — Personal Portfolio

Source code for the personal portfolio of Septian Putra Rachman Hakim, featuring web development projects, AI systems, certifications, and professional background.

Live site: [porto-iannnub.vercel.app](https://porto-iannnub.vercel.app/)

## Features

- **JDM Ignition sequence:** Interactive start screen using HTML5 Web Audio API to play turbo flutter audio, paired with SVG animation.
- **Adaptive 3D and scroll timeline:** Pinned horizontal experience on desktop using GSAP ScrollTrigger and Three.js wireframes, falling back to an animated vertical timeline on mobile viewports.
- **Project gallery lightbox:** Image modal supporting swipe gestures, keyboard navigation (Escape, arrow keys), and scroll-locking.
- **Serverless contact form:** Form validation via Zod and React Hook Form, delivered client-side via EmailJS with bot honeypot and submit cooldown protection.
- **Responsive design:** Styled with Tailwind CSS and CSS design tokens across breakpoints from 360px to 1536px.

## Tech Stack

- **Framework:** React 19, TypeScript
- **Bundler:** Vite 8
- **Styling:** Tailwind CSS v3
- **3D & Animation:** Three.js, React Three Fiber, GSAP ScrollTrigger, Framer Motion
- **Icons & Fonts:** Lucide React, Fontsource (Anton, Inter, JetBrains Mono)
- **Forms & Validation:** React Hook Form, Zod, EmailJS Browser
- **Testing & Code Quality:** Vitest, ESLint, Prettier

## Local Development

Prerequisites: Node.js 18+ and npm.

```bash
# 1. Install dependencies
npm install

# 2. Start development server
npm run dev

# 3. Run typecheck
npm run typecheck

# 4. Run tests
npm test

# 5. Run linter and formatting check
npm run lint
npm run format:check

# 6. Build for production
npm run build
```

## Environment Configuration

Create a `.env` file in the project root if you want the contact form to dispatch live emails:

```env
VITE_EMAILJS_SERVICE_ID=your_service_id
VITE_EMAILJS_TEMPLATE_ID=your_template_id
VITE_EMAILJS_PUBLIC_KEY=your_public_key
```

When these keys are omitted, the form runs in demonstration mode with a simulated delivery response.

## Project Structure

```text
public/       Static assets (images, jdm-engine.mp3, certificates)
src/
  components/ Layout shell (Navbar, Footer, IntroLoader) and atomic UI widgets
  data/       Typed content files (profile, projects, experience, skills, certs)
  hooks/      Custom hooks (useDevicePerformanceTier, useScrollSpy)
  sections/   Page sections (Hero, About, SkillsOrbit, ExperienceJourney, Projects, Contact)
  three/      Three.js / React Three Fiber canvas scenes
tests/        Unit test suite (Vitest)
```

## Contact

- LinkedIn: [linkedin.com/in/iannnub](https://www.linkedin.com/in/iannnub/)
- GitHub: [github.com/iannnub](https://github.com/iannnub)
- Email: mlayusek@gmail.com
