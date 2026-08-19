# Hillary Atindah George: Profile Website

A single-page profile/portfolio site for Hillary Atindah George, STEM, EdTech & Digital Skills Leader
based in Nanyuki, Laikipia County, Kenya. Built from his LinkedIn profile and resume, and designed to
be shared with recruiters, funders and collaborators.

**Live site:** https://atindahhillary.github.io/my-profile-/

No build step, no dependencies, no framework. Plain HTML, CSS and JavaScript.

## Files

```
.
├── index.html      # All page content and sections
├── style.css       # Design system: colour tokens, layout, responsive + print rules
├── main.js         # Nav toggle, scroll progress bar, reveal animations
├── 404.html        # Not-found page for GitHub Pages
├── *.jpg           # Photography used across the page
└── Hillary-Atindah-George-Resume.pdf   # Downloadable resume
```

Assets sit at the repository root because GitHub Pages serves this repo directly from `/`. If the file
list ever gets unwieldy, move the media into `assets/img/` and update the `src` paths in `index.html`.

## Preview locally

```bash
git clone https://github.com/atindahhillary/my-profile-.git
cd my-profile-
python3 -m http.server 8080
# open http://localhost:8080
```

Opening `index.html` directly with `file://` mostly works, but the local server is closer to how the
live site behaves.

## Deploying

The site is published with **GitHub Pages**: *Settings → Pages → Source: Deploy from a branch →
`main` / `(root)`*. Every push to `main` redeploys within a minute or two.

Any other static host works too. Netlify, Vercel, or Cloudflare Pages will serve the repo root as-is
with no build command.

## Editing content

All copy lives in `index.html`, organised by section: `#about`, `#skills`, `#stem`, `#experience`,
`#achievements`, `#certifications`, `#community`, `#work`, `#contact`. The hero is followed by an impact
band whose figures (learners, teachers, schools, cohort pass rate) are plain markup in the
`.impact-grid` list. Update them there when the numbers move, and keep each `data-target` in sync with
the visible text.

Colours, spacing and typography are CSS custom properties at the top of `style.css` (`--teal-800`,
`--amber`, `--radius`, …). Change the palette there rather than hunting through individual rules.

## Swapping an image

1. Add the new file to the repository root.
2. Update the matching `<img src="...">` in `index.html`.
3. Update the `width` and `height` attributes to the new image's real pixel dimensions, because they reserve
   layout space and prevent content jumping around while the page loads.
4. Keep the `alt` text descriptive; it is read aloud by screen readers and shown if the image fails.

Photos are exported at roughly 900–1000px on the long edge and saved as progressive JPEG. That is enough
for the layout, and about 1 MB for every image on the page combined.

## Built-in behaviour worth knowing

- **Social previews.** Open Graph and Twitter Card tags in `<head>` control how links look when shared
  on LinkedIn, WhatsApp or X. They point at absolute `https://atindahhillary.github.io/my-profile-/` URLs,
  so update them if the site ever moves to a custom domain.
- **Structured data.** A `schema.org/Person` JSON-LD block helps search engines identify the profile.
- **Accessibility.** Skip link, keyboard focus outlines, labelled mobile nav, and full
  `prefers-reduced-motion` support for visitors who disable animation.
- **Print.** Printing the page hides the nav and progress bar and prints on a white background.
- **Captioned photography.** Timeline entries can carry a `<figure class="tl-figure">` with a
  `<figcaption>`; the caption sits inside the card under the full-bleed image. A second, shorter image
  can follow in a `.tl-inline-media` wrapper (21:9 crop).
- **Community cards.** Each `.community-card` may carry a `.community-meta` line (role only, no dates)
  and a `.card-link` footer, which pins itself to the bottom so links line up across a row.
- **Animated counters.** Any element with `class="count"`, `data-target` and `data-suffix` counts up
  from zero over 3 seconds the first time it scrolls into view. The final value stays in the markup, so
  the real number shows if JavaScript never runs, and `prefers-reduced-motion` skips the animation.

## Note on references

The resume lists named references with personal emails. Those were intentionally left off the public
site so they are not scraped. The site says "available upon request" instead. Add them back only if
each referee has agreed to have their contact details published.
