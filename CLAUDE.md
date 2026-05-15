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
- Structured/repeating content (papers, courses, datasets) goes in `_data/` as JSON or YAML
- Reusable HTML fragments go in `_includes/`; import them with `{% include file.html %}`
- Page-level content that varies layout goes in `_layouts/`
- SCSS: base rules in `sass/base/`, page-specific layouts in `sass/layouts/`
- `uploads/` is for binary assets (PDFs, large images) linked from content pages
- Jekyll front matter uses `layout:` to select from `_layouts/`
- Markdown strings in data files should be rendered in templates with the `| markdownify` Liquid filter

## Roadmap

### Homepage layout
Convert `index.html` to `index.md` so the bio content can be written in Markdown. The layout
will accept `profile_image` (desktop) and `profile_image_mobile` as front matter variables and
render the profile image in the left column. The bio text becomes the page's `{{ content }}`.

### Research layout
Load paper cards from `_data/papers.yml`. Each entry should include fields like `type`
(working paper | work in progress | journal article | resting | other), `title`, `url`, `date`,
`publisher`, `coverart`, `coauthors`, `abstract`, `slides`, `video`, and `notes`. Fields that
may contain inline links or lists (`coauthors`, `notes`) should be Markdown strings rendered
with `| markdownify`. Group cards into sections using Liquid's `where` filter
(`site.data.papers | where: "type", "working paper"`).

Research interests are short prose — keep them as Markdown content in the page file itself.
Jekyll's `_data/` directory does not support standalone `.md` files; it only parses JSON, YAML,
CSV, and TSV.

### Teaching layout
Teaching subpages (course resource pages, recitation slide indexes) are Jekyll posts in `_posts/`
with `category: teaching`. The global permalink `/post/:slug/` in `_config.yml` routes all posts
to that path. The teaching landing page generates cards by looping over
`site.posts | where: "category", "teaching"`, reading card fields (`role`, `title`, `institution`,
`date`, `links`) from each post's front matter. Adding a new course page = writing one `.md` file.

Cards for courses with no standalone page (e.g. a one-line entry) can be added to
`_data/teaching.yml` instead. The landing page merges both sources.

Teaching philosophy and reference sections remain as static Markdown content in the page file.

### Data layout
Data tutorial pages are Jekyll posts in `_posts/` with `category: data`. The data landing page
generates cards by looping over `site.posts | where: "category", "data"`, reading card fields
(`title`, `summary`, `links`, `languages`) from each post's front matter. Adding a new tutorial
= writing one `.md` file.

Datasets without a tutorial page (e.g. FCC Form 477, NTSB aviation accidents) are listed in
`_data/datasets.yml`. The landing page merges both sources.

### Post layout
Simple article layout: title, optional subtitle, date, body content, and an optional "About"
sidebar block (author photo, name, date posted). Posts with substantial content also support a
"Skip Around" table of contents sidebar, built by a JS snippet that scans the rendered article
body for `h2`/`h3` elements and populates the list dynamically — no front matter list to
maintain. The layout renders the ToC sidebar container only when `toc: true` is set in the
post's front matter; posts without that flag omit it.

### Post migration
Migrate `data/downloading-faa-tfr-data-e20d56a/index.html` and
`data/web-scraping-with-r-amazon-web-services-7eb5e27/index.html` to `_posts/`. Existing URLs
do not need to be preserved.
