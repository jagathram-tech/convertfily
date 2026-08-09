const fs = require("fs");
const {
  BASIC_LABELS,
  buildConverterSeo,
  renderSeoHeadBlock,
} = require("./seo-utils");

const BASIC_MAPPING = {
  jpg: ["png", "webp", "bmp", "pdf"],
  png: ["jpg", "webp", "bmp", "pdf"],
  webp: ["jpg", "png", "bmp", "pdf"],
  bmp: ["jpg", "png", "webp", "pdf"],
  gif: ["jpg", "png", "webp", "pdf"],
  svg: ["png", "jpg", "pdf"],
  avif: ["jpg", "png", "webp"],
  tiff: ["jpg", "png", "pdf"],
  heic: ["jpg", "png", "pdf"],
  pdf: ["jpg", "png", "webp", "txt", "md", "docx"],
  mp4: ["webm", "mov", "avi", "mkv", "mp3"],
  webm: ["mp4", "mov", "avi", "mkv", "mp3"],
  mov: ["mp4", "webm", "avi", "mkv", "mp3"],
  avi: ["mp4", "webm", "mov", "mp3"],
  mkv: ["mp4", "webm", "mov", "mp3"],
  flv: ["mp4", "mp3"],
  wmv: ["mp4", "mp3"],
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

const IMAGE_FORMATS = new Set([
  "jpg", "png", "webp", "bmp", "gif", "svg", "avif", "tiff", "heic",
]);
const MEDIA_FORMATS = new Set([
  "mp4", "webm", "mov", "avi", "mkv", "flv", "wmv",
  "mp3", "wav", "ogg", "aac", "m4a", "flac",
]);

function loadTemplate() {
  let html = fs.readFileSync("png-to-jpg.html", "utf8");
  if (html.includes("__SEO_HEAD_BLOCK__")) return html;

  return html
    .replace(
      /        <title>[\s\S]*?        <script type="application\/ld\+json">[\s\S]*?<\/script>/,
      "__SEO_HEAD_BLOCK__",
    )
    .replace(
      /                <nav aria-label="Breadcrumb"[\s\S]*?                <\/nav>\n/,
      "                __BREADCRUMB_NAV__\n",
    )
    .replace(
      /                    <div class="bg-blue-50 border border-blue-100 rounded-lg p-4">[\s\S]*?                    <\/div>\n                    <h2 class="text-xl font-bold text-slate-900 tracking-tight">How to convert/,
      "                    __HOW_TO_SECTION__\n                    <h2 class=\"text-xl font-bold text-slate-900 tracking-tight\">How to convert",
    )
    .replace(
      /                    <div class="mt-2 pt-6 border-t border-slate-200">[\s\S]*?                    <\/div>\n                <\/div>\n            <\/main>/,
      "                    __RELATED_SECTION__\n                </div>\n            </main>",
    )
    .replace(/PNG to JPG/g, "PNG to JPG")
    .replace(/Upload PNG/gi, "Upload PNG")
    .replace(/Download JPG/gi, "Download JPG")
    .replace(/'png', 'jpg'/g, "'png', 'jpg'")
    .replace(/"png", "jpg"/g, '"png", "jpg"');
}

const template = loadTemplate();

function getIcon(ext) {
  if (IMAGE_FORMATS.has(ext)) return "fa-file-image";
  if (["mp4", "webm", "mov", "avi", "mkv", "flv", "wmv"].includes(ext))
    return "fa-file-video";
  if (["mp3", "wav", "ogg", "aac", "m4a", "flac"].includes(ext))
    return "fa-file-audio";
  if (ext === "pdf") return "fa-file-pdf";
  if (ext === "docx") return "fa-file-word";
  if (["xlsx", "xls", "csv", "ods"].includes(ext)) return "fa-file-excel";
  if (ext === "zip") return "fa-file-archive";
  if (["json", "xml", "html"].includes(ext)) return "fa-file-code";
  return "fa-file-alt";
}

function converterSlug(from, to) {
  if (from === "pdf" && to === "docx") return "pdf-to-word.html";
  return `${from}-to-${to}.html`;
}

function howToSlug(from, to) {
  return `how-to-convert-${from}-to-${to}.html`;
}

function buildMeta(from, to) {
  const seo = buildConverterSeo(from, to);
  const fromUpper = from.toUpperCase();
  const toUpper = to.toUpperCase();
  const fromLabel = BASIC_LABELS[from] || fromUpper;
  const toLabel = BASIC_LABELS[to] || toUpper;

  return {
    ...seo,
    fromUpper,
    toUpper,
    fromLabel,
    toLabel,
    seoHeadBlock: renderSeoHeadBlock(seo),
    icon: getIcon(from),
  };
}

function buildHowToSection(from, to, fromUpper, toUpper) {
  const howToFile = howToSlug(from, to);
  if (!fs.existsSync(howToFile)) return "";

  return `<div class="bg-blue-50 border border-blue-100 rounded-lg p-4">
                        <a href="${howToFile}" class="text-sm font-semibold text-blue-700 hover:text-blue-900 flex items-center gap-2">
                            <i class="fas fa-book-open"></i>
                            Step-by-step guide: How to convert ${fromUpper} to ${toUpper}
                        </a>
                    </div>`;
}

function buildRelatedSection(from, to, fromUpper) {
  const targets = (BASIC_MAPPING[from] || []).filter((t) => t !== to).slice(0, 5);
  if (targets.length === 0) return "";

  const links = targets
    .map((t) => {
      const tUpper = t.toUpperCase();
      return `<a href="${converterSlug(from, t)}" class="inline-flex items-center px-3 py-1.5 text-sm font-medium text-blue-700 bg-blue-50 border border-blue-100 rounded-lg hover:bg-blue-100 transition-colors">${fromUpper} to ${tUpper}</a>`;
    })
    .join("\n                            ");

  return `<div class="mt-2 pt-6 border-t border-slate-200">
                        <h3 class="text-sm font-semibold text-slate-800 mb-3">More ${fromUpper} conversions</h3>
                        <div class="flex flex-wrap gap-2">
                            ${links}
                        </div>
                    </div>`;
}

function applyPlaceholders(html, meta, from, to) {
  const { fromUpper, toUpper, fromLabel, toLabel } = meta;

  return html
    .replace(/__SEO_HEAD_BLOCK__/g, meta.seoHeadBlock)
    .replace(/__BREADCRUMB_NAV__/g, meta.breadcrumbHtml)
    .replace(/__HOW_TO_SECTION__/g, buildHowToSection(from, to, fromUpper, toUpper))
    .replace(/__RELATED_SECTION__/g, buildRelatedSection(from, to, fromUpper))
    .replace(/Convert PNG to JPG/g, `Convert ${fromUpper} to ${toUpper}`)
    .replace(/PNG to JPG/g, `${fromUpper} to ${toUpper}`)
    .replace(/PNG images to JPEG/g, `${fromLabel} to ${toLabel}`)
    .replace(/PNG images to JPG/g, `${fromLabel} to ${toLabel}`)
    .replace(/class="fas fa-file-image"/g, `class="fas ${meta.icon}"`)
    .replace(/Upload PNG/gi, `Upload ${fromUpper}`)
    .replace(/Download JPG/gi, `Download ${toUpper}`)
    .replace(/converted\.jpg/gi, `converted.${to}`)
    .replace(/'png', 'jpg'/g, `'${from}', '${to}'`)
    .replace(/"png", "jpg"/g, `"${from}", "${to}"`)
    .replace(
      /How to convert PNG to JPG/gi,
      `How to convert ${fromUpper} to ${toUpper}`,
    )
    .replace(
      /convert PNG files to JPG/gi,
      `convert ${fromUpper} files to ${toUpper}`,
    )
    .replace(
      /Convert PNG files to JPG/gi,
      `Convert ${fromUpper} files to ${toUpper}`,
    )
    .replace(
      /your PNG files to JPG/gi,
      `your ${fromUpper} files to ${toUpper}`,
    )
    .replace(/PNG To JPG/gi, `${fromUpper} to ${toUpper}`)
    .replace(/PNG images to JPEG/gi, `${fromLabel} to ${toLabel}`)
    .replace(/PNG images to JPG/gi, `${fromLabel} to ${toLabel}`);
}

function fillTemplateForPngToJpg() {
  const meta = buildMeta("png", "jpg");
  const filled = applyPlaceholders(template, meta, "png", "jpg");
  fs.writeFileSync("png-to-jpg.html", filled);
}

let count = 0;

for (const [from, tos] of Object.entries(BASIC_MAPPING)) {
  for (const to of tos) {
    if (from === "png" && to === "jpg") continue;
    if (from === "pdf" && to === "docx") continue;

    const meta = buildMeta(from, to);
    const newHtml = applyPlaceholders(template, meta, from, to);
    fs.writeFileSync(converterSlug(from, to), newHtml);
    count++;
  }
}

fillTemplateForPngToJpg();

console.log(`Generated ${count} conversion pages with full SEO metadata.`);