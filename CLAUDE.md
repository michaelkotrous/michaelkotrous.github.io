# My Jekyll Site

## Project Structure
- `_layouts/` - page templates: `default.html` (base), `home.html` (homepage), `post.html` (teaching/data posts)
- `_includes/` - reusable HTML partials (header, footer, head); `heroes/` subdirectory holds ASCII art HTML files used as post hero sections
- `_data/` - structured content:
  - `papers.yml` - research papers rendered on the Research page
  - `teaching.yml` - static teaching cards (courses without a dedicated post page)
  - `datasets.yml` - static dataset cards (datasets without a tutorial post page)
- `_posts/` - Markdown posts; `category: teaching` → teaching resource pages, `category: data` → data tutorial pages
- `_config.yml` - site configuration; global permalink is `/post/:slug/`
- `sass/` - SCSS source, organized into `base/`, `layouts/`, `libs/`, `settings/`
- `css/style.scss` - SCSS entry point (imports from `sass/`)
- `js/` - JavaScript
- `uploads/` - binary assets organized by subdirectory:
  - `cv/` - CV PDF
  - `research/` - working papers, presentations, and research figures
  - `teaching/` - teaching statement and portfolio PDFs
  - `econ2105/`, `econ8040/`, `econ8050/` - course-specific materials (syllabus, recitation slides, notes, etc.)
  - `headshot/` - homepage profile photos
  - `heroes/` - hero images for post pages (displayed at 728×420px, CSS-cropped)
- `index.md` - homepage (uses `home` layout)
- `research/index.html`, `teaching/index.html`, `data/index.html` - section landing pages

## Stack
- Jekyll + GitHub Pages (deployed via GitHub Actions, see `.github/workflows/jekyll.yml`)
- Dart Sass (using `@use`/`@forward`, not `@import`)
- Bootstrap (partial, customized via `sass/libs/_bootstrap-custom.scss`)
- Ruby/Bundler for dependency management

## Conventions
- Structured/repeating content (papers, courses, datasets) goes in `_data/` as JSON or YAML
- Reusable HTML fragments go in `_includes/`; import them with `{% include file.html %}`
- Page-level content that varies layout goes in `_layouts/`
- SCSS: base rules in `sass/base/`, page-specific layouts in `sass/layouts/`; use `@use`/`@forward` and `sass:math`/`sass:color` — never `@import` or legacy globals
- Typography uses the Adobe Source family (Source Serif 4, Source Sans 3, Source Code Pro) loaded from Google Fonts; font stacks are defined as CSS custom properties in `sass/base/_typography.scss` — use `var(--font-serif)`, `var(--font-sans)`, or `var(--font-mono)` in all new styles, never hardcode font names
- `uploads/` is for binary assets (PDFs, large images) linked from content pages; place new assets in the appropriate subdirectory (`research/`, `teaching/`, `cv/`, or a course folder)
- Jekyll front matter uses `layout:` to select from `_layouts/`
- Markdown strings in data files should be rendered in templates with the `| markdownify` Liquid filter
- Teaching and data posts use a global permalink `/post/:slug/` set in `_config.yml`

## Content editing
See `CONTENT_GUIDE.md` for step-by-step instructions on adding datasets, creating course pages, posting new working papers, and promoting works in progress.
