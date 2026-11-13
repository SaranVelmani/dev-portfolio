# Saran — Developer Portfolio

Personal portfolio: animated, single-page, no build step.

- **Content:** edit `js/data.js` (projects, skills, timeline, work). Everything renders from there.
- **Motion:** GSAP 3.12.5 + ScrollTrigger, Lenis 1.1.13 smooth scroll (CDN, pinned versions).
- **Sections:** loader → hero (particles, split-text name) → about (scroll-scrubbed text) → stack constellation → horizontal project gallery → journey timeline → football & cricket → contact.
- **Accessibility:** respects `prefers-reduced-motion` (no smooth scroll, no animation, all content visible), keyboard-navigable skill tabs, skip link, mobile menu with Escape.
- **Mobile:** horizontal gallery becomes a vertical stack; custom cursor and 3D tilt only on fine pointers.

Run locally: `python -m http.server 5173` then open http://127.0.0.1:5173

Deploy: push to GitHub and enable Pages (main branch, root).
