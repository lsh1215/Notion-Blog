# Design

## Source of truth
- Status: Active
- Last refreshed: 2026-09-25
- Primary product surfaces: Home, post list, post detail, categories, tags, archives, about
- Evidence reviewed: `frontend/src/app/*`, `frontend/src/components/*`, `frontend/src/app/globals.css`, `docs/CONVENTIONS.md`, and the live reference at `https://yceffort.kr/` (desktop viewport 1512 x 769)

## Brand
- Personality: Curious, rigorous, editorial, technical, and quietly playful.
- Trust signals: Strong content hierarchy, visible dates and categories, restrained motion, readable long-form typography.
- Avoid: Generic SaaS hero sections, excessive pills, glossy gradients, heavy shadows, or copying the reference site's identity, illustrations, or wording.

## Product goals
- Goals: Make recent writing immediately scannable; give Korean technical writing a distinctive editorial frame; keep long-form reading comfortable.
- Non-goals: Reproduce the reference brand, add new content types, or change the Notion-backed publishing model.
- Success signals: Visitors can identify the blog's subject and newest posts above the fold; text remains comfortable on mobile and desktop; existing routes and theme behavior remain intact.

## Personas and jobs
- Primary personas: Software engineers and technically curious readers.
- User jobs: Discover recent posts, scan categories and summaries, and read long-form articles without visual distraction.
- Key contexts of use: Desktop research/reading and mobile link-driven reading.

## Information architecture
- Primary navigation: Blog, Categories, Tags, Archives, About, plus theme control.
- Core routes/screens: `/`, `/blog`, `/blog/[slug]`, `/categories`, `/tags`, `/archives`, `/about`.
- Content hierarchy: Brand/navigation -> editorial hero -> recent posts -> supporting discovery routes -> footer.

## Design principles
- Editorial before ornamental: type, rhythm, and rules create the visual identity.
- Dense but legible: show useful metadata without reducing reading comfort.
- Borrow atmosphere, not identity: translate the reference's hierarchy and energy into this blog's existing content and violet accent.
- Tradeoffs: Prefer fewer decorative cards and larger type even when fewer posts fit above the fold.

## Visual language
- Color: Warm near-white canvas, near-black ink, graphite secondary text, violet accent, and subtle violet/pink radial ambient washes. Dark mode uses near-black surfaces with restrained violet glow.
- Typography: System sans stack for Korean and UI; extra-bold display headlines with tight tracking; serif italic used only as a small editorial counterpoint; mono labels for metadata.
- Spacing/layout rhythm: 4/8px base rhythm, editorial max width near 1180px, generous section spacing, compact metadata spacing.
- Shape/radius/elevation: Thin borders, 12-16px radii where containers need them, minimal shadows, pill shape reserved for navigation/control clusters.
- Motion: Small translate/underline/color transitions; honor reduced motion.
- Imagery/iconography: Existing post cover imagery only; simple line icons; no copied brand art or logo.

## Components
- Existing components to reuse: `Header`, `Footer`, `PostCard`, `PostGrid`, `Tag`, `ThemeToggle`, `TableOfContents`.
- New/changed components: Editorial home hero, numbered recent-post rows/cards, compact section eyebrow, simplified navigation shell.
- Variants and states: Image/no-image post previews, hover/focus, light/dark theme, desktop/mobile navigation.
- Token/component ownership: Global tokens in `frontend/src/app/globals.css`; component layout in existing TSX components.

## Accessibility
- Target standard: WCAG 2.2 AA where practical.
- Keyboard/focus behavior: Visible focus rings for every interactive element; mobile navigation remains keyboard operable.
- Contrast/readability: Body copy at least 16px with comfortable line-height; muted text must retain AA contrast for its size.
- Screen-reader semantics: Preserve landmarks, headings, link names, dates, and button labels.
- Reduced motion and sensory considerations: Disable transforms and smooth scrolling under `prefers-reduced-motion`.

## Responsive behavior
- Supported breakpoints/devices: Mobile from 320px, tablet, and desktop through wide screens.
- Layout adaptations: Display type scales down with `clamp()`; desktop metadata columns collapse into stacked rows; navigation becomes a menu.
- Touch/hover differences: Touch targets remain at least 44px; hover effects are supplementary.

## Interaction states
- Loading: Keep existing route skeletons and restyle with the new surface tokens.
- Empty: Explain the absence of posts and offer navigation back to all writing.
- Error: Preserve framework error handling; image failure falls back to text-first cards.
- Success: Not applicable to the read-only public surfaces.
- Disabled: Use only where a control truly cannot be used.
- Offline/slow network: The text-first hierarchy must remain useful before images finish loading.

## Content voice
- Tone: Direct, thoughtful, technical, and unforced.
- Terminology: Prefer plain Korean for navigation and descriptions while keeping established technical terms.
- Microcopy rules: Short labels, no hype language, sentence case, dates in a consistent format.

## Implementation constraints
- Framework/styling system: Next.js 16 App Router, React 19, Tailwind CSS 4, CSS custom properties, `next-themes`.
- Design-token constraints: Extend the existing semantic color/font tokens rather than introducing a second design-system layer.
- Performance constraints: Avoid new client-side dependencies and decorative image payloads; system fonts are preferred for the redesign.
- Compatibility constraints: Preserve Notion data contracts, current routes, light/dark themes, and responsive behavior.
- Test/screenshot expectations: Build and lint must pass; compare home at 1512 x 769 against the approved reference direction and verify a mobile viewport.

## Open questions
- [x] The captured desktop reference direction was approved before frontend implementation.
- [ ] Replace the placeholder `Blog` identity when the final blog name/owner name is available.
