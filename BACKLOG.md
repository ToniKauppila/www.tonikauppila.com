# Portfolio improvement backlog

Overview of improvements: **done** vs **backlog**. Use this to pick the next tasks.

---

## Done

| Area | What was done |
|------|----------------|
| **main.js** | Removed redundant `modal.display`; added shared navbar hide-on-scroll for desktop `#navbar`. |
| **k-ai** | Fixed invalid meta tag → proper `name="description"`. |
| **work.html** | Fixed duplicate K-Plussa `data-tippy-content` / `rel="tooltip"`. |
| **Lottie** | New `scripts/lottie-init.js` (data-driven); removed extensionless `scripts/script`; illustrations use `data-lottie-path`. |
| **Scripts** | All pages use `main.js`; removed jQuery and duplicate inline scripts (modal, AOS, tippy, form-button, smooth scroll, navbar hide). |
| **Accessibility** | Skip link + `.skip-link` CSS; `aria-label="Main"` on both navs; `id="main"` / `#wrapper` as skip targets. |

---

## Backlog

### High impact

| # | Item | Notes |
|---|------|--------|
| ~~1~~ | ~~**Templating / single source for head & nav**~~ | **Done.** 11ty: `pages/*.njk` + `_includes/` (layout, head, nav-home, nav-default, scripts-*). Build with `npm run build` → `_site/`. |
| ~~2~~ | ~~**Split main.css**~~ | **Done.** Split into `base.css`, `components.css`, `layout.css`, `pages.css`. `main.css` now imports all four. |

### Medium impact

| # | Item | Notes |
|---|------|--------|
| 3 | **Fix Rellax deprecation in main.js** | Replace `x.addListener(destroyRellax)` with `x.addEventListener('change', destroyRellax)` (and `addEventListener('change', …)` for the initial call pattern if needed). |
| 4 | **Remove redundant `rel="tooltip"`** | Many elements have both `data-tippy-content` and `rel="tooltip"`. Tippy only needs `data-tippy-content`; remove `rel="tooltip"` site-wide. |
| 5 | **Lazy load images on work + case studies** | Lazy loading is only on index and photos. Add `data-src` + lazyload (or `loading="lazy"`) for below-the-fold images on work grid and case study pages. |
| 6 | **Meta/SEO per page** | Ensure every page has a unique `<title>` and a useful `meta name="description"`. Audit and add where missing. |

### Lower priority / polish

| # | Item | Notes |
|---|------|--------|
| 7 | **Focus states** | In `main.css`, add visible `:focus` / `:focus-visible` for links and buttons (you already have hover). |
| 8 | **Third-party scripts** | Consider self-hosting or bundling AOS, Tippy, Rellax so one script tag and better caching; document script order in README or a small dev doc. |
| 9 | **JSON-LD (optional)** | Add a small JSON-LD block on the homepage for Person/portfolio to help search engines. |

---

## Quick reference

- **Done:** 8 areas (main.js, k-ai, work K-Plussa, Lottie refactor, scripts + jQuery removal, accessibility, **11ty templating**, **CSS split**).
- **Backlog:** 7 items (0 high, 4 medium, 3 lower).
- **Suggest starting with:** #3 (Rellax deprecation) or #4 (remove redundant rel="tooltip") for quick cleanups.
