# Fairoz Basha — Design in motion

A responsive personal portfolio for Shaik Fairoz Basha. Built with React, TypeScript, Vite, Tailwind CSS, React Three Fiber, Drei, Three.js, GSAP ScrollTrigger, AOS, Framer Motion, and Lenis.

## Develop

Use Node.js 24 and npm 11 (the cloud environment provides both).

```sh
npm ci
npm run dev
```

The development server listens on port 5173 and all interfaces. Run `npm run build` to type-check and create the production `dist/` directory; `npm run preview` serves that build for local verification. Deploy `dist/` to a static hosting service. No application secrets or backend services are required.

## Customize

- `src/data.ts`: editable project titles, descriptions, categories, status, optional media paths, optional real project URLs, email, and skill descriptions.
- `src/App.tsx`: biography, experience, education, navigation, and creative process.
- `src/components/Scene.tsx`: actual real-time metallic geometry, lights, orbit, and particles. The same scene appears in the hero and contact sections. Offscreen rendering pauses; reduced-motion preference stops continuous animation. A CSS artwork fallback handles unavailable WebGL or context loss.
- `src/components/ProjectGallery.tsx`: project filters, tilt cards, mobile horizontal gallery, and native keyboard-accessible modal. Escape closes the dialog and restores focus. Thumbnails are original abstract concept artwork, not claimed project deliverables. Add actual uploaded assets under `public/projects/` and set each project's optional `media` field; only add `url` for a verified real link.
- `src/components/Contact.tsx`: validated mailto fallback and copy-email control. The form opens the visitor's email app. It never claims delivery. Connect and verify a backend before changing this behavior or showing a sent confirmation.
- `src/styles.css`: common palette, responsive layouts, focus indicators, and reduced-motion fallbacks. Fonts are bundled locally; no font CDN or downloaded 3D assets are needed.

Personal story entries are clearly marked as creative concepts. The community survey is the resume-listed project. Social profiles are omitted until genuine URLs are supplied. No invented employer, internship dates, certificates, project outcomes, proficiency scores, or private personal information are included.

## Animation architecture

Three Fiber owns mesh rotation and cursor damping. GSAP owns scroll progress on separate timeline elements and hero background parallax, with scoped cleanup. AOS initializes once for directional section entrances. Motion owns project filtering, transition opacity, and page progress. Lenis supplies smooth scrolling and is cleaned up on unmount; native scrolling remains available with reduced motion. Dialog content opts out of Lenis. The scene module is loaded asynchronously, and continuous rendering pauses when offscreen.

## Validation

`npm run build` runs TypeScript and produces the static production bundle. Browser checks cover desktop and mobile layouts, real WebGL canvas rendering, navigation and mobile drawer, all category filters, all nine editable projects, modal next/previous/Escape and focus restoration, skill expansion, contact validation, mailto fallback, clipboard, and reduced-motion mode. Final assets and server responses can be checked with `npm run preview`.

No contact delivery is possible without the visitor sending the draft in their email app. Final project media and real external project/profile links remain content additions for the owner.

## Deploy to Netlify

Import `SHAIK20-del/3d_portfolio` from GitHub and deploy the `main` branch. The committed `netlify.toml` sets the build command (`npm run build`), publish directory (`dist`), and Node/npm versions. Leave the base directory at the repository root. No environment variables or secrets are required.

For a manual deployment, run `npm ci` and `npm run build`, then upload **the generated `dist` folder** to Netlify Drop. Uploading the repository root will serve the source `index.html`, which references TypeScript that a static host cannot execute. The source favicon also lives under `public/`; Vite copies it to the root of `dist` during the build.

If the browser reports a module MIME type of `application/octet-stream` and a missing `/favicon.svg`, inspect the deployed HTML. It must reference `assets/index-*.js`, not `/src/main.tsx`. In Netlify, confirm that the latest deployment uses the committed configuration, with no base directory pointing elsewhere, and redeploy the latest `main` commit. Do not change MIME headers to serve TypeScript as JavaScript; deploy the compiled output instead.

Run `npm run test:deployment` to build and verify that the publish folder includes compiled entry points, local assets, and the favicon, with no source TypeScript referenced by the deployed page. Asset paths are relative, so the built files also work from a static-host subdirectory.
