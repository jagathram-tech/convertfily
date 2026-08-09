# Covertfily

**100% private, browser-based file conversion.** Convert PDFs, images, video, audio, and documents without uploading anything to a server — all processing happens locally in your browser.

🌐 **Live site:** [covertfily.com](https://covertfily.com)

## Features

- **Privacy-first** — files never leave your device
- **No signup or watermarks** — free to use
- **Wide format support** — images, PDFs, documents, audio, and video
- **Specialized tools** — PDF merge/compress/watermark, OCR, video trim/compress, image utilities, and more
- **Static site** — no backend, no database, no build step

## Quick Start

Clone the repo and serve it over HTTP (opening files via `file://` blocks CDN scripts):

```bash
npx serve .
```

Then open the URL shown in your terminal (usually `http://localhost:3000`).

## Project Structure

| Path | Purpose |
|------|---------|
| `index.html` | Homepage with format picker and dropzone |
| `main.js` | Core conversion logic and shared UI helpers |
| `style.css` | Global styles |
| `png-to-jpg.html` | Converter template **and** working page — edit this, not generated files |
| `generator.js` | Regenerates all `*-to-*.html` converter pages from the template |
| `seo-utils.js` | SEO metadata helpers used by the generator |
| `check-ids.js` | Scans HTML files for duplicate `id` attributes |
| `*-to-*.html` | Auto-generated converter pages (do not edit directly) |
| Hand-crafted `*.html` | Custom tools (e.g. `merge-pdf.html`, `ocr.html`, `pdf-to-word.html`) |

## Development

### Regenerate converter pages

After editing `png-to-jpg.html`, propagate changes to all converter pages:

```bash
node generator.js
```

The generator skips `png→jpg` (the template itself) and `pdf→docx` (hand-crafted as `pdf-to-word.html`).

### Validate before committing

```bash
node check-ids.js
```

### Nav / charset fix (Windows)

After manual HTML edits, run the PowerShell script to enforce UTF-8 charset and repair broken Unicode:

```powershell
.\fix_nav_and_charset.ps1
```

Use `fix_nav_only.ps1` to skip Unicode repair.

## Architecture

- **Static HTML** — no package manager, no bundler, no CI
- **Client-side only** — libraries loaded from CDNs (SheetJS, PDF.js, FFmpeg.wasm, Tesseract.js, etc.)
- **Node.js** — used only for `generator.js` and `check-ids.js`

### Hand-crafted vs generated pages

- **Generated converters** — lowercase `<!doctype html>`, share logic via `main.js`
- **Hand-crafted tools** — uppercase `<!DOCTYPE html>`, custom logic, SEO keywords, some include Google Analytics

### Adding a new format

Keep these in sync:

1. `BASIC_MAPPING` in `generator.js`
2. `formatMapping` in `main.js`
3. Inline `FORMAT_MAPPING` in `index.html`
4. Label tables (`BASIC_LABELS` / `FORMAT_LABELS`) in each location

Then run `node generator.js`.

## For AI Agents / Contributors

See [AGENTS.md](AGENTS.md) for detailed conventions: CDN version pins, required DOM IDs, global JS API names, Google Analytics policy, and common pitfalls.

## License

See repository license terms on GitHub.