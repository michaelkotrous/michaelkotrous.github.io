# My Jekyll Site

## Project Structure
- `_layouts/` - page templates (currently: `default.html`)
- `_includes/` - reusable HTML partials (header, footer, head)
- `_data/` - structured content as JSON or YAML (to be added)
- `_config.yml` - site configuration
- `sass/` - SCSS source, organized into `base/`, `layouts/`, `libs/`, `settings/`
- `css/style.scss` - SCSS entry point (imports from `sass/`)
- `js/` - JavaScript
- `img/` - profile photos and site images
- `uploads/` - PDFs, research figures, and teaching materials
- `research/`, `teaching/`, `data/` - content section pages

## Stack
- Jekyll + GitHub Pages (deployed via GitHub Actions, see `.github/workflows/jekyll.yml`)
- Dart Sass (using `@use`/`@forward`, not `@import`)
- Bootstrap (partial, customized via `sass/libs/_bootstrap-custom.scss`)
- Ruby/Bundler for dependency management

## Conventions
- Structured/repeating content (papers, courses, datasets) goes in `_data/` as JSON
- Reusable HTML fragments go in `_includes/`; import them with `{% include file.html %}`
- Page-level content that varies layout goes in `_layouts/`
- SCSS: base rules in `sass/base/`, page-specific layouts in `sass/layouts/`
- `uploads/` is for binary assets (PDFs, large images) linked from content pages
- Jekyll front matter uses `layout:` to select from `_layouts/`

## Roadmap
- [ ] Create homepage layout that renders a content block written in Markdown (from "I am a Ph.D. candidate in ..." to "... and enjoy coding projects.") and accepts a relative path to the profile image used in the left column.
- [ ] Create research layout that dynamically loads content into each subsection: research interests from a Markdown file; working papers, works in progress, and refereed journal articles as cards generated from a `_data/` JSON file with fields like `type` (working paper | work in progress | journal article | other), `title`, `url`, `date`, `coverart`, `coauthors`, `abstract`, `slides`, `video`, `notes`.
- [ ] Create teaching and data layouts that similarly use `_data/` JSON to generate cards under "Instructor of Record" and "Teaching Assistant" subheadings (teaching) and dataset cards (data landing page).
- [ ] Migrate the two existing data posts (`downloading-faa-tfr-data-e20d56a/index.html` and `web-scraping-with-r-amazon-web-services-7eb5e27/index.html`) to proper Jekyll posts, and evaluate whether a shared post template makes sense across the data and teaching subpages (e.g., Econ 8040 recitation slides, Econ 8050 course resources).
