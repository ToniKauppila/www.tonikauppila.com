# www.tonikauppila.com
My personal portfolio. Feel free to request changes if you notice something silly in the code!

## Build (11ty)

The site is built with [Eleventy](https://www.11ty.dev/). To build:

```bash
npm install
npm run build
```

Output goes to `_site/`. Deploy the contents of `_site/` (or point your host at that folder).

- **Source:** `pages/*.njk` (one file per page) + `_includes/` (layout, head, navs, scripts).
- **Static assets** (images, style, scripts, JSON, .htaccess, CNAME) are copied into `_site/` as-is.

## CSS

Styles are split into `style/base.css`, `style/components.css`, `style/layout.css`, and `style/pages.css`. `style/main.css` imports all four so existing links still work.
