const fs = require("fs");
const {
  buildConverterSeo,
  buildHandCraftedToolSeo,
  buildHowToSeo,
  buildBlogIndexSeo,
  buildBlogPostSeo,
  buildLegalSeo,
  buildDocumentationSeo,
  renderSeoHeadBlock,
  escapeAttr,
  SITE,
  BRAND,
  OG_IMAGE,
} = require("./seo-utils");

const HAND_CRAFTED_TOOLS = [
  { file: "merge-pdf.html", name: "Merge PDF", category: "pdf", description: "Combine multiple PDF files into one document instantly. Free online PDF merger that runs entirely in your browser — zero uploads, fully private.", keywordsExtra: ["merge pdf", "combine pdf", "join pdf"] },
  { file: "compress-pdf.html", name: "Compress PDF", category: "pdf", description: "Shrink PDF file size in your browser without uploading. Free, private PDF compression — files never leave your device.", keywordsExtra: ["compress pdf", "reduce pdf size", "shrink pdf"] },
  { file: "watermark.html", name: "Watermark PDF", category: "pdf", description: "Add text or image watermarks to PDF files locally in your browser. No uploads, no account — 100% private PDF watermarking.", keywordsExtra: ["watermark pdf", "add watermark to pdf"] },
  { file: "protect-pdf.html", name: "Protect / Unlock PDF", category: "pdf", description: "Password-protect PDF files or remove passwords in your browser. Free, private PDF encryption with no server uploads.", keywordsExtra: ["protect pdf", "encrypt pdf", "unlock pdf"] },
  { file: "reorder-pdf.html", name: "Reorder PDF Pages", category: "pdf", description: "Rearrange PDF pages by drag-and-drop in your browser. Free, private PDF page reordering with zero uploads.", keywordsExtra: ["reorder pdf", "rearrange pdf pages", "sort pdf"] },
  { file: "ocr.html", name: "Image to Text (OCR)", category: "image", description: "Extract text from images and PDFs using OCR in your browser. Free, private text recognition — no file uploads.", keywordsExtra: ["ocr online", "image to text", "extract text"] },
  { file: "image-resizer.html", name: "Image Resizer", category: "image", description: "Resize images to exact dimensions in your browser. Free, private image resizing — no uploads required.", keywordsExtra: ["image resizer", "resize image online", "scale image"] },
  { file: "image-rounder.html", name: "Image Rounder", category: "image", description: "Crop images into circles or apply rounded corners in your browser. Free, private — no uploads.", keywordsExtra: ["round image corners", "circular image crop"] },
  { file: "image-blur.html", name: "Image Blur", category: "image", description: "Blur images or specific regions for privacy and effects. Free local blur tool — runs entirely in your browser, zero uploads.", keywordsExtra: ["blur image", "gaussian blur", "pixelate image"] },
  { file: "color-palette-extractor.html", name: "Color Palette Extractor", category: "image", description: "Extract prominent color palettes from any photo in your browser. Free, private — no uploads.", keywordsExtra: ["color palette", "extract colors from image"] },
  { file: "eyedropper.html", name: "EyeDropper", category: "image", description: "Pick pixel-perfect hex, RGB, or HSL colors from uploaded images locally in your browser.", keywordsExtra: ["color picker", "eyedropper tool", "hex color picker"] },
  { file: "image-to-base64.html", name: "Image to Base64", category: "image", description: "Convert images to Base64 data URI strings for web embeds. Free, private — processed entirely in your browser.", keywordsExtra: ["image to base64", "base64 encoder", "data uri"] },
  { file: "exif-reader.html", name: "EXIF Reader", category: "image", description: "Read camera model, settings, and metadata from images locally. Free EXIF viewer — no uploads.", keywordsExtra: ["exif reader", "image metadata", "photo exif"] },
  { file: "metadata-stripper.html", name: "Metadata Stripper", category: "image", description: "Remove private camera metadata, locations, and EXIF tags from photos in your browser.", keywordsExtra: ["remove exif", "strip metadata", "privacy photo"] },
  { file: "pixel-art.html", name: "Pixel Art Converter", category: "image", description: "Convert photos into retro-styled pixel art graphics locally in your browser. Free and private.", keywordsExtra: ["pixel art converter", "pixelate image"] },
  { file: "image-to-json.html", name: "Image to JSON", category: "image", description: "Extract pixel colors and structure maps into JSON objects locally. Free, private image analysis.", keywordsExtra: ["image to json", "pixel data json"] },
  { file: "brightness-map.html", name: "Brightness Map", category: "image", description: "Analyze and render contrast levels and brightness distribution from images in your browser.", keywordsExtra: ["brightness map", "image contrast analysis"] },
  { file: "stereogram.html", name: "Stereogram Creator", category: "image", description: "Generate classic hidden-image 3D stereogram patterns locally in your browser.", keywordsExtra: ["stereogram maker", "magic eye generator"] },
  { file: "steganography.html", name: "Steganography", category: "image", description: "Conceal secret messages inside image pixels or extract hidden text. Free, private, browser-based.", keywordsExtra: ["steganography tool", "hide text in image"] },
  { file: "video-trimmer.html", name: "Video Trimmer", category: "video", description: "Trim, cut, and slice video clips entirely in your browser. Free, private video editing — no uploads.", keywordsExtra: ["video trimmer", "cut video online", "trim mp4"] },
  { file: "video-frame-extractor.html", name: "Video Frame Extractor", category: "video", description: "Extract high-resolution frames from video files in your browser. Free, private — no server uploads.", keywordsExtra: ["extract video frame", "video to image", "frame grabber"] },
  { file: "video-compressor.html", name: "Video Compressor", category: "video", description: "Compress video files with customizable quality and resolution. 100% private, browser-based video compression.", keywordsExtra: ["video compressor", "reduce video size", "compress mp4"] },
  { file: "video-speed.html", name: "Video Speed Changer", category: "video", description: "Adjust video playback speed from 0.25x to 4x locally in your browser. Free, private video encoding.", keywordsExtra: ["change video speed", "slow motion video", "speed up video"] },
  { file: "audio-trimmer.html", name: "Audio Trimmer", category: "audio", description: "Trim MP3 and WAV audio clips in your browser. Free, private audio editing — no uploads.", keywordsExtra: ["audio trimmer", "trim mp3", "cut audio"] },
  { file: "audio-merger.html", name: "Audio Merger", category: "audio", description: "Merge multiple audio files into one track in your browser. Free, private — no server uploads.", keywordsExtra: ["merge audio", "combine mp3", "audio joiner"] },
  { file: "qr-code-generator.html", name: "QR Code Generator", category: "generate", description: "Generate QR codes instantly in your browser. Free, private QR code maker — no server uploads.", keywordsExtra: ["qr code generator", "create qr code"] },
  { file: "barcode-generator.html", name: "Barcode Generator", category: "generate", description: "Create barcodes locally in your browser. Free, private barcode maker — no uploads.", keywordsExtra: ["barcode generator", "create barcode"] },
  { file: "lorem-ipsum.html", name: "Lorem Ipsum Generator", category: "generate", description: "Generate placeholder Lorem Ipsum text instantly in your browser. Free and private.", keywordsExtra: ["lorem ipsum generator", "placeholder text"] },
  { file: "word-counter.html", name: "Word Counter", category: "generate", description: "Count words, characters, and sentences in text locally in your browser. Free, private word counter.", keywordsExtra: ["word counter", "character count", "text statistics"] },
  { file: "file-hash-checker.html", name: "File Hash Checker", category: "utility", description: "Compute SHA-256 and MD5 hashes locally in your browser. Free, private file integrity verification — no uploads.", keywordsExtra: ["file hash checker", "sha256", "md5 checksum"] },
];

const BLOG_POSTS = [
  {
    file: "blog-best-ocr-2026.html",
    headline: "Best Free OCR Tools in 2026",
    metaDescription:
      "Discover the top-rated free OCR tools for 2026. Compare accuracy, speed, and privacy to find the best image-to-text solution for your workflow.",
    datePublished: "2026-06-14",
  },
  {
    file: "blog-local-vs-cloud.html",
    headline: "Why Local File Processing is Safer than Cloud Uploads",
    metaDescription:
      "Learn why client-side file processing keeps your data safer than cloud upload converters. Privacy, speed, and control explained.",
    datePublished: "2026-06-14",
  },
];

const STATIC_PAGES = [
  {
    file: "privacy.html",
    build: () =>
      buildLegalSeo({
        file: "privacy.html",
        headline: "Privacy Policy",
        metaDescription:
          "Learn how Covertfily protects your data. All files are processed locally in your browser — your data never leaves your device.",
      }),
  },
  {
    file: "terms.html",
    build: () =>
      buildLegalSeo({
        file: "terms.html",
        headline: "Terms of Use",
        metaDescription:
          "Covertfily terms of use. Free browser-based file tools with 100% client-side processing and no file uploads to servers.",
      }),
  },
  {
    file: "documentation.html",
    build: () => buildDocumentationSeo(),
  },
  {
    file: "documents.html",
    build: () =>
      buildHandCraftedToolSeo({
        file: "documents.html",
        name: "Documents Tool",
        category: "utility",
        description:
          "Process document files securely in your browser. 100% private, no server uploads, and completely free.",
        keywordsExtra: ["document converter", "text to pdf"],
      }),
  },
  {
    file: "fusion.html",
    build: () =>
      buildHandCraftedToolSeo({
        file: "fusion.html",
        name: "Covertfily Fusion",
        category: "utility",
        description:
          "Advanced file fusion and processing tool that runs entirely in your browser. 100% private with no server uploads.",
        keywordsExtra: ["file fusion", "advanced converter"],
      }),
  },
];

function stripOldSeoTags(html) {
  return html
    .replace(/<title>[\s\S]*?<\/title>\s*/gi, "")
    .replace(/<meta\s+name=["']description["'][^>]*>\s*/gi, "")
    .replace(/<meta\s+name=["']keywords["'][^>]*>\s*/gi, "")
    .replace(/<meta\s+name=["']author["'][^>]*>\s*/gi, "")
    .replace(/<meta\s+name=["']robots["'][^>]*>\s*/gi, "")
    .replace(/<meta\s+name=["']googlebot["'][^>]*>\s*/gi, "")
    .replace(/<link\s+rel=["']canonical["'][^>]*>\s*/gi, "")
    .replace(/<meta\s+property=["']og:[^"']+["'][^>]*>\s*/gi, "")
    .replace(/<meta\s+name=["']twitter:[^"']+["'][^>]*>\s*/gi, "")
    .replace(/<meta\s+name=["']theme-color["'][^>]*>\s*/gi, "")
    .replace(/<script\s+type=["']application\/ld\+json["']>[\s\S]*?<\/script>\s*/gi, "");
}

function injectSeoBlock(html, seoBlock) {
  const viewportRe = /(<meta\s+name=["']viewport["'][^>]*>)/i;
  if (viewportRe.test(html)) {
    return html.replace(viewportRe, `$1\n${seoBlock}`);
  }

  const charsetRe = /(<meta\s+charset[^>]*>)/i;
  if (charsetRe.test(html)) {
    return html.replace(charsetRe, `$1\n${seoBlock}`);
  }

  return html.replace(/<head>/i, `<head>\n${seoBlock}`);
}

function syncPage(file, seo, indent = 8) {
  if (!fs.existsSync(file)) {
    console.log(`Skip ${file} (not found)`);
    return;
  }

  const seoBlock = `${renderSeoHeadBlock(seo, indent)}\n`;
  let html = fs.readFileSync(file, "utf8");
  html = stripOldSeoTags(html);
  html = injectSeoBlock(html, seoBlock);
  fs.writeFileSync(file, html);
  console.log(`Synced SEO: ${file}`);
}

function syncPdfToWord() {
  syncPage("pdf-to-word.html", buildConverterSeo("pdf", "docx", { slug: "pdf-to-word.html" }));
}

function syncHomepage() {
  const file = "index.html";
  if (!fs.existsSync(file)) return;

  const { buildHomepageSeo, renderSocialMetaTags } = require("./seo-utils");
  const seo = buildHomepageSeo();

  const socialBlock = `${renderSocialMetaTags(seo, "    ")}\n`;

  let html = fs.readFileSync(file, "utf8");

  html = html
    .replace(/<meta name="keywords"[^>]*>\s*/i, "")
    .replace(/<meta name="author"[^>]*>\s*/i, "")
    .replace(/<meta name="robots"[^>]*>\s*/i, "")
    .replace(/<meta name="googlebot"[^>]*>\s*/i, "")
    .replace(/<link rel="canonical"[^>]*>\s*/i, "")
    .replace(/<meta property="og:[^"]*"[^>]*>\s*/gi, "")
    .replace(/<meta name="twitter:[^"]*"[^>]*>\s*/gi, "")
    .replace(/<meta name="theme-color"[^>]*>\s*/i, "");

  html = html.replace(
    /(<meta name="description" content="[^"]*">)/,
    `$1\n${socialBlock}`,
  );

  html = html.replace(
    /<title>[^<]*<\/title>/,
    `<title>${escapeAttr(seo.pageTitle)}</title>`,
  );

  fs.writeFileSync(file, html);
  console.log("Synced SEO: index.html");
}

function syncHowToPages() {
  const files = fs.readdirSync(".").filter((f) => /^how-to-.+\.html$/.test(f));
  for (const file of files) {
    try {
      syncPage(file, buildHowToSeo(file), 4);
    } catch (err) {
      console.error(`Failed ${file}: ${err.message}`);
    }
  }
}

// --- Run sync pipeline ---

for (const tool of HAND_CRAFTED_TOOLS) {
  syncPage(tool.file, buildHandCraftedToolSeo(tool));
}

syncPdfToWord();

for (const post of BLOG_POSTS) {
  syncPage(post.file, buildBlogPostSeo(post), 4);
}

syncPage("blog.html", buildBlogIndexSeo(), 4);

for (const page of STATIC_PAGES) {
  syncPage(page.file, page.build(), page.file === "documentation.html" ? 4 : 4);
}

syncHowToPages();
syncHomepage();

console.log("SEO sync complete.");