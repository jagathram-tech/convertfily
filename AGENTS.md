# AGENTS.md

## Architecture

Static HTML site, no build system, no package manager, no tests, no CI, no linting. All conversion logic runs client-side via CDN-loaded libraries. Node.js used only for `generator.js` and `check-ids.js`.

## Commands

- **Serve locally:** `npx serve .` — `file://` blocks CDN scripts.
- **Regenerate converters:** `node generator.js` — reads `png-to-jpg.html` as template, writes all `*-to-*.html`. Generator's `index.html` regex replacements are currently stale/no-op (index.html structure has drifted); it still safely regenerates converter pages.
- **Nav/charset fix:** `.ix_nav_and_charset.ps1` — enforces UTF-8 `<meta charset>`, repairs broken Unicode (â€¢ → •, â€” → —). Run **after** manual edits. `.ix_nav_only.ps1` skips Unicode repair. The nav-reorder regex is currently a no-op.
- **Check duplicate IDs:** `node check-ids.js` — scans all `.html` for non-unique `id=` attributes.

## Generator Rules

- `generator.js` reads **only** `png-to-jpg.html` as template. That file serves dual purpose: working converter *and* generator template.
- **Never edit generated `*-to-*.html` directly** — they are overwritten on each generator run.
- Generator skips `png→jpg` (the template itself) and `pdf→docx` (hand-crafted as `pdf-to-word.html`).
- After editing `png-to-jpg.html`, run `node generator.js` to propagate changes to all converter pages.

## Sync Rules

- Keep `BASIC_MAPPING` (generator.js:3) and `formatMapping` (main.js:2) in sync. `formatMapping` includes `svg` (hand-managed); `BASIC_MAPPING` does not. When adding formats, update both plus their label tables (`BASIC_LABELS` / `FORMAT_LABELS`).
- `index.html` contains an **inline** `FORMAT_MAPPING` + `FORMAT_LABELS` + `selectFromFormat` / `selectToFormat` / `filterDropdownItems` in its own `<script>` block. These shadow the versions in `main.js`. If you change homepage dropdown behavior or add formats, update all three copies.
- FFmpeg.wasm versions: always `ffmpeg@0.12.10` + `util@0.12.1` + `core@0.12.6` in both main.js and hand-crafted video tools.
- PDF.js: `3.11.174` everywhere. Set `pdfjsLib.GlobalWorkerOptions.workerSrc` explicitly on every page that imports PDF.js.

## Hand-Crafted vs Generated Pages

- **Auto-generated:** lowercase `<!doctype html>`, no keywords `<meta>`, no GA, rely on main.js for all logic.
- **Hand-crafted:** uppercase `<!DOCTYPE html>`, have keywords meta, some include GA. `pdf-to-word.html` is hand-crafted (uses mammoth) despite being an `x-to-y` converter.

## Global JS API (Do Not Rename)

All attached to `window` and referenced inline in HTML:
`FORMAT_MAPPING`, `FORMAT_LABELS`, `updateProgress`, `hideProgress`, `setConversionProgress`, `processFile`, `handleFiles`, `updateTargetDropdown`, `selectFromFormat`, `selectToFormat`, `toggleDropdown`, `filterFormats`, `downloadFile`.

## Required DOM IDs

`#dropzone`, `#formatFromContainer`, `#formatToContainer`, `.progress-bar-fill`, `#downloadBtn`, `#loading`, `#downloadContainer` — renaming breaks converters.

## CDN Versions (Locked)

Font Awesome 6.4.0 (cdnjs) · Inter wght@400-800 (Google Fonts) · SheetJS 0.20.1 · PDF.js 3.11.174 · pdf-lib (unpkg) · jspdf 2.5.1 · mammoth 1.6.0 · docx 7.1.1 · marked + Turndown · jszip 3.10.1 · FFmpeg.wasm 0.12.10+0.12.6 (video only) · SortableJS 1.15.0 · Tesseract.js v5 · UTIF 3.1.0

## Tool Library Patterns

- **PDF manipulation (merge/reorder/protect/watermark/compress):** pdf-lib via unpkg; must set `workerSrc` before PDF.js load. Local `pdf-worker.js` wraps the CDN worker.
- **Image→PDF / DOCX→PDF:** jspdf (simple writes), no pdf-lib.
- **Video tools (compressor/speed/trimmer/extractor):** load FFmpeg.wasm inline, delegate to shared `loadFFmpeg()` in main.js.
- **Audio merger:** Web Audio API + SortableJS, outputs WAV (no external encoding lib).

## Google Analytics Policy

Add `gtag.js` (ID: `G-4Z6LTJ67E2`) **only** on hand-crafted tool pages with substantial custom logic. **Never** add to `index.html` or auto-generated converters.

Currently on: merge-pdf, compress-pdf, watermark, pdf-to-word, ocr, image-tools, qr-code-generator, file-hash-checker, image-to-json, image-to-base64, exif-reader, metadata-stripper, color-palette-extractor, eyedropper, pixel-art, stereogram, steganography, brightness-map, nasa-earth-imagery, nasa-apod.

## Homepage Dropzone

`index.html` dropzone calls `goToDedicatedPage()` — function defined inline in `index.html`. Removing it breaks dropzone navigation.

## Validation

- `node check-ids.js` before committing.
- Test locally: `npx serve .` (CDN scripts need HTTP, not `file://`).

## Common Pitfalls

- Opening via `file://` blocks all CDN scripts and fetch requests.
- Editing generated `*-to-*.html` directly → changes lost on next generator run.
- Forgetting PDF.js `workerSrc` on hand-crafted PDF pages → silent failure.
- Mismatched FFmpeg.wasm versions → `loadFFmpeg()` fails to initialize.
- Changing required DOM IDs without updating main.js + all page scripts.
- Adding GA to generated converters → violates policy and will be reverted.
- Copy-pasting HTML blocks with `id` attributes can create duplicate IDs across files.
