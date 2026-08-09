const fs = require("fs");
const {
  SITE,
  buildHubSeo,
  renderSeoHeadBlock,
} = require("./seo-utils");

const BASIC_MAPPING = {
  jpg: ["png", "webp", "bmp", "pdf"],
  png: ["jpg", "webp", "bmp", "pdf"],
  webp: ["jpg", "png", "bmp", "pdf"],
  bmp: ["jpg", "png", "webp", "pdf"],
  gif: ["jpg", "png", "webp", "pdf"],
  avif: ["jpg", "png", "webp"],
  tiff: ["jpg", "png", "pdf"],
  heic: ["jpg", "png", "pdf"],
  pdf: ["jpg", "png", "webp", "txt", "md", "docx"],
  mp4: ["webm", "mov", "avi", "mkv", "mp3"],
  webm: ["mp4", "mov", "avi", "mkv", "mp3"],
  mov: ["mp4", "webm", "avi", "mkv", "mp3"],
  avi: ["mp4", "webm", "mov", "mp3"],
  mkv: ["mp4", "webm", "mov", "mp3"],
  flv: ["mp4"],
  wmv: ["mp4"],
  mp3: ["wav", "ogg", "aac", "m4a", "flac"],
  wav: ["mp3", "ogg", "aac", "m4a", "flac"],
  ogg: ["mp3", "wav", "aac"],
  aac: ["mp3", "wav"],
  m4a: ["mp3", "wav"],
  flac: ["mp3", "wav"],
  xlsx: ["csv", "json", "ods", "pdf"],
  xls: ["xlsx", "csv", "json", "pdf"],
  csv: ["xlsx", "json", "ods", "pdf"],
  ods: ["xlsx", "csv", "json", "pdf"],
  json: ["xlsx", "csv", "pdf"],
  md: ["html", "pdf", "txt", "docx"],
  html: ["md", "pdf", "txt", "docx"],
  txt: ["pdf", "md", "html", "docx"],
  docx: ["pdf", "txt", "md"],
  xml: ["json", "txt"],
};

const IMAGE = new Set(["jpg", "png", "webp", "bmp", "gif", "avif", "tiff", "heic"]);
const MEDIA = new Set([
  "mp4", "webm", "mov", "avi", "mkv", "flv", "wmv",
  "mp3", "wav", "ogg", "aac", "m4a", "flac",
]);
const DOCUMENT = new Set([
  "docx", "xlsx", "xls", "csv", "ods", "json", "md", "html", "txt", "xml",
]);

const HUBS = [
  {
    file: "pdf-tools.html",
    title: "PDF Converters",
    h1: "Free PDF Converters",
    description:
      "Convert PDF to images, Word, text, and more — or create PDFs from other formats. Every tool runs locally in your browser with zero uploads.",
    metaDescription:
      "Free online PDF converters that run in your browser. Convert PDF to JPG, PNG, Word, text and more — 100% private, no uploads.",
    match: (from, to) => from === "pdf" || to === "pdf",
  },
  {
    file: "image-tools.html",
    title: "Image Converters",
    h1: "Free Image Converters",
    description:
      "Convert between JPG, PNG, WebP, HEIC, AVIF, TIFF, and more. Fast, free, and completely private — files never leave your device.",
    metaDescription:
      "Free image format converters: PNG to JPG, HEIC to JPG, WebP to PNG and more. 100% browser-based, no file uploads.",
    match: (from, to) => IMAGE.has(from) || IMAGE.has(to),
  },
  {
    file: "document-tools.html",
    title: "Document Converters",
    h1: "Free Document Converters",
    description:
      "Convert Word, Excel, CSV, Markdown, HTML, and JSON files locally. Ideal for sensitive documents that should never be uploaded to the cloud.",
    metaDescription:
      "Convert documents online for free: DOCX, XLSX, CSV, Markdown, HTML, JSON and more. Private browser-based conversion on Covertfily.",
    match: (from, to) => DOCUMENT.has(from) || DOCUMENT.has(to),
  },
  {
    file: "media-tools.html",
    title: "Media Converters",
    h1: "Free Video & Audio Converters",
    description:
      "Convert MP4, WebM, MOV, MKV, MP3, WAV, and other media formats in your browser using FFmpeg.wasm — no server uploads required.",
    metaDescription:
      "Free video and audio converters: MP4 to MP3, MOV to WebM, WAV to MP3 and more. Client-side conversion, zero uploads.",
    match: (from, to) => MEDIA.has(from) || MEDIA.has(to),
  },
];

function extractBlock(html, startMarker, endMarker) {
  const start = html.indexOf(startMarker);
  const end = html.indexOf(endMarker, start) + endMarker.length;
  if (start === -1 || end === -1) return "";
  return html.slice(start, end);
}

const templateHtml = fs.readFileSync("png-to-jpg.html", "utf8");
const navHTML = extractBlock(templateHtml, "<nav", "</nav>");
const footerHTML = extractBlock(templateHtml, "<footer>", "</footer>");

function getConverters(matchFn) {
  const items = [];
  const seen = new Set();

  for (const [from, tos] of Object.entries(BASIC_MAPPING)) {
    for (const to of tos) {
      if (!matchFn(from, to)) continue;

      if (from === "pdf" && to === "docx") {
        const href = "pdf-to-word.html";
        if (fs.existsSync(href) && !seen.has(href)) {
          items.push({ href, label: "PDF to Word (DOCX)" });
          seen.add(href);
        }
        continue;
      }

      const href = `${from}-to-${to}.html`;
      if (seen.has(href)) continue;
      items.push({
        href,
        label: `${from.toUpperCase()} to ${to.toUpperCase()}`,
      });
      seen.add(href);
    }
  }

  return items.sort((a, b) => a.label.localeCompare(b.label));
}

function getHowTos(matchFn) {
  return fs
    .readdirSync(".")
    .filter((f) => f.startsWith("how-to-convert-") && f.endsWith(".html"))
    .filter((f) => {
      const m = f.match(/^how-to-convert-(.+)-to-(.+)\.html$/);
      if (!m) return false;
      return matchFn(m[1], m[2]);
    })
    .map((f) => ({
      href: f,
      label: f
        .replace(/^how-to-convert-/, "")
        .replace(/\.html$/, "")
        .replace(/-to-/g, " to ")
        .replace(/-/g, " ")
        .replace(/\b\w/g, (c) => c.toUpperCase()),
    }))
    .sort((a, b) => a.label.localeCompare(b.label));
}

function hubSearchTerms(item) {
  const slug = item.href.replace(/\.html$/, "").replace(/-/g, " ");
  return `${item.label} ${slug}`.toLowerCase();
}

function renderSearchBar(totalCount) {
  return `<div class="relative max-w-xl">
    <input type="search" id="hubToolsSearch" class="hub-tools-search w-full bg-white/50 border border-white/60 rounded-2xl px-4 py-3 pl-11 pr-10 text-[14px] font-semibold text-slate-800 placeholder-slate-400 outline-none focus:border-blue-500 focus:bg-white/80 transition-all shadow-[inset_0_1px_2px_rgba(0,0,0,0.02)]" placeholder="Search ${totalCount} converters and guides…" autocomplete="off" aria-label="Search converters and guides">
    <i class="fas fa-search absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" aria-hidden="true"></i>
    <button type="button" id="hubToolsSearchClear" class="hub-tools-search-clear absolute right-3 top-1/2 -translate-y-1/2 flex w-7 h-7 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 items-center justify-center transition-colors" aria-label="Clear search" hidden>
      <i class="fas fa-times text-xs"></i>
    </button>
  </div>
  <p id="hubToolsEmpty" class="hub-tools-empty text-sm text-slate-500" hidden>No tools match your search. Try a format like &quot;png to jpg&quot; or &quot;mp4&quot;.</p>`;
}

function renderGrid(items) {
  if (items.length === 0) return "<p class=\"text-sm text-slate-500\">No tools in this category yet.</p>";
  return `<div class="hub-tools-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
${items
  .map(
    (item) =>
      `    <a href="${item.href}" data-search="${hubSearchTerms(item)}" class="hub-tool-link cf-panel px-4 py-3 text-sm font-semibold text-slate-800 hover:text-blue-700 hover:border-blue-200 transition-colors">${item.label}</a>`,
  )
  .join("\n")}
</div>`;
}

for (const hub of HUBS) {
  const converters = getConverters(hub.match);
  const howTos = getHowTos(hub.match);
  const seo = buildHubSeo(hub, converters);
  const seoHead = renderSeoHeadBlock(seo);

  const page = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
${seoHead}
    <link rel="icon" type="image/png" href="favicon.png" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
    <link rel="stylesheet" href="style.css?v=2.1.0" />
    <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="elevra-theme">
    <div class="elevra-workspace w-full flex flex-col gap-12 relative overflow-hidden">
        ${navHTML}

        <main class="w-full max-w-5xl mx-auto flex flex-col gap-10">
            <div class="flex flex-col gap-4">
                <div class="cf-badge"><i class="fas fa-shield-halved"></i> 100% client-side</div>
                <h1 class="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight">${hub.h1}</h1>
                <p class="text-lg text-slate-600 max-w-2xl leading-relaxed">${hub.description}</p>
            </div>

            ${renderSearchBar(converters.length + howTos.length)}

            <section class="hub-tools-section flex flex-col gap-4">
                <h2 class="text-xl font-bold text-slate-900">All converters</h2>
                ${renderGrid(converters)}
            </section>

            ${
              howTos.length
                ? `<section class="hub-tools-section flex flex-col gap-4">
                <h2 class="text-xl font-bold text-slate-900">Step-by-step guides</h2>
                ${renderGrid(howTos)}
            </section>`
                : ""
            }

            <section class="cf-panel p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h3 class="font-semibold text-slate-900">Want more formats?</h3>
                    <p class="text-sm text-slate-500">Browse all tools or read privacy-focused articles on our blog.</p>
                </div>
                <div class="flex flex-wrap gap-2">
                    <a href="index.html#convert" class="cf-btn-primary">Open converter</a>
                    <a href="blog.html" class="cf-btn-ghost">Read blog</a>
                </div>
            </section>
        </main>

        ${footerHTML}
    </div>
    <script src="main.js"></script>
</body>
</html>`;

  fs.writeFileSync(hub.file, page);
  console.log(`Wrote ${hub.file} (${converters.length} converters, ${howTos.length} guides)`);
}