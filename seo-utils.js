const fs = require("fs");

const SITE = "https://covertfily.com";
const BRAND = "Covertfily";

// Social-share image. To get correctly-sized link previews on Twitter/X,
// Facebook, LinkedIn, Slack, etc., replace this with a dedicated 1200x630 PNG
// (e.g. og-image.png) and update OG_IMAGE_WIDTH/HEIGHT to match. The declared
// dimensions MUST match the real file or crawlers may reject the image.
const OG_IMAGE = `${SITE}/logo.png`;
const OG_IMAGE_WIDTH = 1024;
const OG_IMAGE_HEIGHT = 261;
const OG_IMAGE_TYPE = "image/png";

// Bump this when site content meaningfully changes. Used for schema.org
// dateModified so search engines see fresh-content signals without every
// regenerate churning the date in git.
const SITE_MODIFIED = "2026-06-17";
const SITE_PUBLISHED = "2025-05-07";

const BASIC_LABELS = {
  jpg: "JPG/JPEG Image",
  png: "PNG Image",
  webp: "WebP Image",
  bmp: "BMP Image",
  gif: "GIF Image",
  svg: "SVG Image",
  avif: "AVIF Image",
  tiff: "TIFF Image",
  heic: "HEIC/HEIF Image",
  pdf: "PDF Document",
  mp4: "MP4 Video",
  webm: "WebM Video",
  mov: "MOV Video",
  avi: "AVI Video",
  mkv: "MKV Video",
  flv: "FLV Video",
  wmv: "WMV Video",
  mp3: "MP3 Audio",
  wav: "WAV Audio",
  ogg: "OGG Audio",
  aac: "AAC Audio",
  m4a: "M4A Audio",
  flac: "FLAC Audio",
  json: "JSON Data File",
  md: "Markdown Document",
  html: "HTML Document",
  txt: "Plain Text File",
  xml: "XML Document",
  docx: "Word Document (DOCX)",
};

const FORMAT_ALIASES = {
  jpg: ["jpeg", "jpg"],
  png: ["png"],
  pdf: ["pdf"],
  docx: ["docx", "word", "doc"],
  mp3: ["mp3"],
  mp4: ["mp4"],
};

const IMAGE_FORMATS = new Set([
  "jpg", "png", "webp", "bmp", "gif", "svg", "avif", "tiff", "heic",
]);
const MEDIA_FORMATS = new Set([
  "mp4", "webm", "mov", "avi", "mkv", "flv", "wmv",
  "mp3", "wav", "ogg", "aac", "m4a", "flac",
]);

function getCategory(from, to) {
  if (from === "pdf" || to === "pdf") {
    return { name: "PDF Converters", slug: "pdf-tools.html" };
  }
  if (IMAGE_FORMATS.has(from) || IMAGE_FORMATS.has(to)) {
    return { name: "Image Converters", slug: "image-tools.html" };
  }
  if (MEDIA_FORMATS.has(from) || MEDIA_FORMATS.has(to)) {
    return { name: "Media Converters", slug: "media-tools.html" };
  }
  return { name: "Document Converters", slug: "document-tools.html" };
}

function formatPair(from, to) {
  return `${from.toUpperCase()} to ${to.toUpperCase()}`;
}

function buildKeywordList(from, to) {
  const pair = `${from} to ${to}`;
  const aliasesFrom = FORMAT_ALIASES[from] || [from];
  const aliasesTo = FORMAT_ALIASES[to] || [to];
  const terms = new Set([
    pair,
    `${pair} converter`,
    `${pair} online`,
    `${pair} free`,
    `${pair} converter free`,
    `convert ${from} to ${to}`,
    `convert ${from} to ${to} online`,
    `convert ${from} to ${to} free`,
    `${from} to ${to} no upload`,
    `${from} to ${to} without uploading`,
    `${from} to ${to} browser`,
    `${from} to ${to} offline`,
    `${from} converter`,
    `${to} converter`,
    "free online file converter",
    "private file converter",
    "no upload converter",
    "client side converter",
    BRAND.toLowerCase(),
  ]);

  for (const af of aliasesFrom) {
    for (const at of aliasesTo) {
      if (af !== from || at !== to) {
        terms.add(`${af} to ${at}`);
        terms.add(`convert ${af} to ${at}`);
      }
    }
  }

  return [...terms].join(", ");
}

function buildConverterSeo(from, to, options = {}) {
  const fromUpper = from.toUpperCase();
  const toUpper = to.toUpperCase();
  const fromLabel = BASIC_LABELS[from] || fromUpper;
  const toLabel = BASIC_LABELS[to] || toUpper;
  const pair = formatPair(from, to);
  const slug = options.slug || `${from}-to-${to}.html`;
  const canonicalUrl = `${SITE}/${slug}`;
  const category = getCategory(from, to);
  const howToFile = `how-to-convert-${from}-to-${to}.html`;
  const hasHowTo = fs.existsSync(howToFile);

  const pageTitle = `Free ${pair} Converter Online — No Upload | ${BRAND}`;
  const metaDescription = `Convert ${pair} free in your browser. No uploads, no signup, no watermarks. 100% private ${fromLabel} to ${toLabel} conversion — files never leave your device.`;
  const ogTitle = `Free ${pair} Converter — Private & Online`;
  const keywords = buildKeywordList(from, to);

  const jsonLd = buildConverterJsonLd({
    from,
    to,
    fromUpper,
    toUpper,
    pair,
    canonicalUrl,
    metaDescription,
    category,
    hasHowTo,
    howToFile,
  });

  return {
    pageTitle,
    metaDescription,
    ogTitle,
    keywords,
    canonicalUrl,
    jsonLd: JSON.stringify(jsonLd),
    breadcrumbHtml: "",
    ogType: "website",
  };
}

function buildConverterJsonLd(ctx) {
  const {
    from,
    to,
    fromUpper,
    toUpper,
    pair,
    canonicalUrl,
    metaDescription,
    category,
    hasHowTo,
    howToFile,
  } = ctx;

  const graph = [
    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "@id": `${canonicalUrl}#webpage`,
      url: canonicalUrl,
      name: `Free ${pair} Converter`,
      description: metaDescription,
      isPartOf: { "@id": `${SITE}/#website` },
      about: { "@type": "Thing", name: `${pair} file conversion` },
      inLanguage: "en-US",
      primaryImageOfPage: { "@type": "ImageObject", url: OG_IMAGE },
    },
    {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      "@id": `${canonicalUrl}#app`,
      name: `${pair} Converter`,
      url: canonicalUrl,
      description: metaDescription,
      applicationCategory: "UtilitiesApplication",
      applicationSubCategory: "File Converter",
      operatingSystem: "Web Browser",
      browserRequirements: "Requires JavaScript. Works in Chrome, Firefox, Safari, Edge.",
      softwareVersion: "1.0",
      isAccessibleForFree: true,
      inLanguage: "en-US",
      image: OG_IMAGE,
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "USD",
        availability: "https://schema.org/InStock",
      },
      featureList: [
        "100% client-side file processing",
        "No file uploads to servers",
        "No account or signup required",
        "No watermarks on output files",
        "Works offline after page load",
        "Free and open source (MIT)",
      ],
      provider: { "@id": `${SITE}/#organization` },
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: `${SITE}/` },
        {
          "@type": "ListItem",
          position: 2,
          name: category.name,
          item: `${SITE}/${category.slug}`,
        },
        { "@type": "ListItem", position: 3, name: pair, item: canonicalUrl },
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: `Is ${pair} conversion free on ${BRAND}?`,
          acceptedAnswer: {
            "@type": "Answer",
            text: `Yes. ${BRAND} converts ${fromUpper} to ${toUpper} completely free with no account, no watermarks, and no hidden limits.`,
          },
        },
        {
          "@type": "Question",
          name: `Are my files uploaded when I convert ${fromUpper} to ${toUpper}?`,
          acceptedAnswer: {
            "@type": "Answer",
            text: "No. All conversion happens locally in your web browser. Your files are never sent to any server.",
          },
        },
        {
          "@type": "Question",
          name: `What is the maximum file size for ${pair} conversion?`,
          acceptedAnswer: {
            "@type": "Answer",
            text: "Because processing runs on your device, limits depend on your browser memory. Most files under 100MB convert reliably.",
          },
        },
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "HowTo",
      name: `How to convert ${pair} online`,
      description: `Convert ${fromUpper} files to ${toUpper} privately in your browser using ${BRAND}.`,
      totalTime: "PT1M",
      tool: [{ "@type": "HowToTool", name: `${BRAND} ${pair} Converter` }],
      step: [
        {
          "@type": "HowToStep",
          position: 1,
          name: `Upload your ${fromUpper} file`,
          text: `Open the converter and drag-and-drop or select your ${fromUpper} file.`,
        },
        {
          "@type": "HowToStep",
          position: 2,
          name: "Convert locally",
          text: `${BRAND} processes the file entirely in your browser with no upload.`,
        },
        {
          "@type": "HowToStep",
          position: 3,
          name: `Download ${toUpper}`,
          text: `Save the converted ${toUpper} file to your device instantly.`,
        },
      ],
    },
  ];

  if (hasHowTo) {
    graph.push({
      "@context": "https://schema.org",
      "@type": "Article",
      headline: `How to convert ${pair} online`,
      url: `${SITE}/${howToFile}`,
      mainEntityOfPage: `${SITE}/${howToFile}`,
      author: { "@id": `${SITE}/#organization` },
      publisher: { "@id": `${SITE}/#organization` },
    });
  }

  return graph;
}

function buildPageSeo({
  pageTitle,
  metaDescription,
  ogTitle,
  keywords,
  canonicalPath,
  ogType = "website",
  jsonLd,
}) {
  const canonicalUrl = canonicalPath.startsWith("http")
    ? canonicalPath
    : `${SITE}/${canonicalPath.replace(/^\//, "")}`;

  return {
    pageTitle,
    metaDescription,
    ogTitle: ogTitle || pageTitle,
    keywords,
    canonicalUrl,
    jsonLd: JSON.stringify(jsonLd),
    ogType,
    breadcrumbHtml: "",
  };
}

const TOOL_CATEGORIES = {
  pdf: { name: "PDF Tools", slug: "pdf-tools.html" },
  image: { name: "Image Tools", slug: "image-tools.html" },
  video: { name: "Media Tools", slug: "media-tools.html" },
  audio: { name: "Media Tools", slug: "media-tools.html" },
  generate: { name: "Generators", slug: "index.html#tools-dashboard" },
  utility: { name: "Utilities", slug: "index.html#tools-dashboard" },
};

function renderSocialMetaTags(seo, p) {
  const ogImage = seo.ogImage || OG_IMAGE;
  const ogAlt = seo.ogImageAlt || `${BRAND} — private browser-based file converter`;
  // Only emit dimensions when using the default image, whose size we know.
  // Declaring wrong dimensions for a custom image makes crawlers reject it.
  const dims = seo.ogImage
    ? ""
    : `\n${p}<meta property="og:image:width" content="${OG_IMAGE_WIDTH}" />` +
      `\n${p}<meta property="og:image:height" content="${OG_IMAGE_HEIGHT}" />` +
      `\n${p}<meta property="og:image:type" content="${OG_IMAGE_TYPE}" />`;

  return `${p}<meta name="keywords" content="${escapeAttr(seo.keywords)}" />
${p}<meta name="author" content="${BRAND}" />
${p}<meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
${p}<meta name="googlebot" content="index, follow" />
${p}<link rel="canonical" href="${escapeAttr(seo.canonicalUrl)}" />
${p}<meta property="og:title" content="${escapeAttr(seo.ogTitle)}" />
${p}<meta property="og:description" content="${escapeAttr(seo.metaDescription)}" />
${p}<meta property="og:type" content="${escapeAttr(seo.ogType)}" />
${p}<meta property="og:url" content="${escapeAttr(seo.canonicalUrl)}" />
${p}<meta property="og:site_name" content="${BRAND}" />
${p}<meta property="og:locale" content="en_US" />
${p}<meta property="og:image" content="${escapeAttr(ogImage)}" />
${p}<meta property="og:image:secure_url" content="${escapeAttr(ogImage)}" />${dims}
${p}<meta property="og:image:alt" content="${escapeAttr(ogAlt)}" />
${p}<meta name="twitter:card" content="summary_large_image" />
${p}<meta name="twitter:title" content="${escapeAttr(seo.ogTitle)}" />
${p}<meta name="twitter:description" content="${escapeAttr(seo.metaDescription)}" />
${p}<meta name="twitter:image" content="${escapeAttr(ogImage)}" />
${p}<meta name="twitter:image:alt" content="${escapeAttr(ogAlt)}" />
${p}<meta name="theme-color" content="#0f172a" />`;
}

function renderSeoHeadBlock(seo, indentSpaces = 8) {
  const p = " ".repeat(indentSpaces);
  return `${p}<title>${escapeAttr(seo.pageTitle)}</title>
${p}<meta name="description" content="${escapeAttr(seo.metaDescription)}" />
${renderSocialMetaTags(seo, p)}
${p}<script type="application/ld+json">${seo.jsonLd}</script>`;
}

function extractTagContent(html, tag) {
  const re = new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, "i");
  const match = html.match(re);
  return match ? match[1].replace(/<[^>]+>/g, "").trim() : "";
}

function extractHowToMeta(file) {
  if (!fs.existsSync(file)) return null;
  const html = fs.readFileSync(file, "utf8");
  const headline = extractTagContent(html, "h1");
  const ctaMatch = html.match(/class="btn-primary"[^>]*href="([^"]+)"/i);
  const relatedTool = ctaMatch ? ctaMatch[1] : null;
  return { headline, relatedTool };
}

function buildHowToKeywords(slug, headline) {
  const base = slug.replace(/^how-to-/, "").replace(/\.html$/, "").replace(/-/g, " ");
  const terms = new Set([
    headline.toLowerCase(),
    base,
    `${base} guide`,
    `${base} tutorial`,
    `${base} step by step`,
    "how to guide",
    "free online tutorial",
    "browser based",
    "no upload",
    "private file processing",
    "covertfily guide",
    BRAND.toLowerCase(),
  ]);

  const convertMatch = slug.match(/^how-to-convert-(.+)-to-(.+)\.html$/);
  if (convertMatch) {
    const [, from, to] = convertMatch;
    terms.add(`${from} to ${to}`);
    terms.add(`convert ${from} to ${to}`);
    terms.add(`how to convert ${from} to ${to}`);
    terms.add(`${from} to ${to} online free`);
  }

  return [...terms].join(", ");
}

function getHowToCategory(slug, relatedTool) {
  const convertMatch = slug.match(/^how-to-convert-(.+)-to-(.+)\.html$/);
  if (convertMatch) {
    let [, from, to] = convertMatch;
    if (to === "word") to = "docx";
    if (from === "excel") from = "xlsx";
    if (to === "excel") to = "xlsx";
    if (from === "powerpoint" || slug.includes("ppt")) return TOOL_CATEGORIES.pdf;
    return getCategory(from, to);
  }

  if (/pdf|watermark|merge|compress|password|unlock|split|rotate|crop|extract|remove-pages|smaller|email/.test(slug)) {
    return TOOL_CATEGORIES.pdf;
  }
  if (/image|png|jpg|jpeg|webp|bmp|gif|heic|tiff|svg|batch/.test(slug)) {
    return TOOL_CATEGORIES.image;
  }
  if (/mp4|gif|video|audio/.test(slug)) {
    return TOOL_CATEGORIES.video;
  }
  return TOOL_CATEGORIES.utility;
}

function buildHowToJsonLd({ slug, headline, metaDescription, canonicalUrl, relatedTool }) {
  const category = getHowToCategory(slug, relatedTool);
  const graph = [
    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "@id": `${canonicalUrl}#webpage`,
      url: canonicalUrl,
      name: headline,
      description: metaDescription,
      isPartOf: { "@id": `${SITE}/#website` },
      inLanguage: "en-US",
      primaryImageOfPage: { "@type": "ImageObject", url: OG_IMAGE },
    },
    {
      "@context": "https://schema.org",
      "@type": "Article",
      "@id": `${canonicalUrl}#article`,
      headline,
      name: headline,
      description: metaDescription,
      url: canonicalUrl,
      mainEntityOfPage: canonicalUrl,
      image: OG_IMAGE,
      author: { "@id": `${SITE}/#organization` },
      publisher: { "@id": `${SITE}/#organization` },
      datePublished: SITE_PUBLISHED,
      dateModified: SITE_MODIFIED,
      isAccessibleForFree: true,
      inLanguage: "en-US",
    },
    {
      "@context": "https://schema.org",
      "@type": "HowTo",
      name: headline,
      description: metaDescription,
      totalTime: "PT5M",
      tool: [{ "@type": "HowToTool", name: `${BRAND} — browser-based file tools` }],
      step: [
        {
          "@type": "HowToStep",
          position: 1,
          name: "Open the tool",
          text: relatedTool
            ? `Go to the ${BRAND} tool page and open it in your browser.`
            : `Visit ${BRAND} and choose the right tool for your task.`,
        },
        {
          "@type": "HowToStep",
          position: 2,
          name: "Add your file",
          text: "Upload or drag-and-drop your file. Processing stays on your device — nothing is sent to a server.",
        },
        {
          "@type": "HowToStep",
          position: 3,
          name: "Apply the conversion or edit",
          text: "Follow the on-screen options to convert, compress, merge, or edit your file.",
        },
        {
          "@type": "HowToStep",
          position: 4,
          name: "Download the result",
          text: "Save the output file directly to your computer.",
        },
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: `${SITE}/` },
        { "@type": "ListItem", position: 2, name: "Blog", item: `${SITE}/blog.html` },
        {
          "@type": "ListItem",
          position: 3,
          name: category.name,
          item: `${SITE}/${category.slug}`,
        },
        { "@type": "ListItem", position: 4, name: headline, item: canonicalUrl },
      ],
    },
  ];

  if (relatedTool && relatedTool !== "index.html") {
    graph.push({
      "@context": "https://schema.org",
      "@type": "WebApplication",
      name: `Related ${BRAND} tool`,
      url: `${SITE}/${relatedTool}`,
      isAccessibleForFree: true,
      applicationCategory: "UtilitiesApplication",
    });
  }

  return graph;
}

function buildHowToSeo(slug) {
  const meta = extractHowToMeta(slug);
  if (!meta || !meta.headline) {
    throw new Error(`Could not parse how-to page: ${slug}`);
  }

  const { headline, relatedTool } = meta;
  const canonicalUrl = `${SITE}/${slug}`;
  const metaDescription = `Step-by-step guide: ${headline}. Free, private, and browser-based — no uploads or software installs. Try it on ${BRAND}.`;
  const pageTitle = `${headline} — Step-by-Step Guide | ${BRAND}`;
  const ogTitle = `${headline} | ${BRAND} Guide`;
  const keywords = buildHowToKeywords(slug, headline);

  return buildPageSeo({
    pageTitle,
    metaDescription,
    ogTitle,
    keywords,
    canonicalPath: slug,
    ogType: "article",
    jsonLd: buildHowToJsonLd({
      slug,
      headline,
      metaDescription,
      canonicalUrl,
      relatedTool,
    }),
  });
}

function buildHandCraftedToolSeo(tool) {
  const category = TOOL_CATEGORIES[tool.category] || TOOL_CATEGORIES.utility;
  const pageTitle = `${tool.name} Online — Free, Private & No Upload | ${BRAND}`;
  const ogTitle = `${tool.name} — Free Private Online Tool`;
  const keywords = [
    tool.name.toLowerCase(),
    `${tool.name.toLowerCase()} online`,
    `${tool.name.toLowerCase()} free`,
    "no upload",
    "private",
    "browser based",
    "client side",
    BRAND.toLowerCase(),
    ...tool.keywordsExtra || [],
  ].join(", ");

  const canonicalUrl = `${SITE}/${tool.file}`;
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "@id": `${canonicalUrl}#webpage`,
      url: canonicalUrl,
      name: pageTitle,
      description: tool.description,
      isPartOf: { "@id": `${SITE}/#website` },
      inLanguage: "en-US",
      primaryImageOfPage: { "@type": "ImageObject", url: OG_IMAGE },
    },
    {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      "@id": `${canonicalUrl}#app`,
      name: tool.name,
      url: canonicalUrl,
      description: tool.description,
      applicationCategory: "UtilitiesApplication",
      operatingSystem: "Web Browser",
      isAccessibleForFree: true,
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
      provider: { "@id": `${SITE}/#organization` },
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: `${SITE}/` },
        {
          "@type": "ListItem",
          position: 2,
          name: category.name,
          item: `${SITE}/${category.slug}`,
        },
        { "@type": "ListItem", position: 3, name: tool.name, item: canonicalUrl },
      ],
    },
  ];

  return buildPageSeo({
    pageTitle,
    metaDescription: tool.description,
    ogTitle,
    keywords,
    canonicalPath: tool.file,
    jsonLd,
  });
}

function buildBlogIndexSeo() {
  const pageTitle = `${BRAND} Blog — Guides, Tips & Privacy Resources`;
  const metaDescription =
    "Step-by-step file conversion guides, PDF tutorials, image tips, and privacy resources. All tools run locally in your browser with zero uploads.";
  const keywords = [
    "file conversion guide",
    "pdf tutorial",
    "image converter tips",
    "how to convert files",
    "privacy first tools",
    "browser based tutorials",
    "covertfily blog",
    BRAND.toLowerCase(),
  ].join(", ");

  const canonicalUrl = `${SITE}/blog.html`;
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      "@id": `${canonicalUrl}#webpage`,
      url: canonicalUrl,
      name: pageTitle,
      description: metaDescription,
      isPartOf: { "@id": `${SITE}/#website` },
      inLanguage: "en-US",
    },
    {
      "@context": "https://schema.org",
      "@type": "Blog",
      name: `${BRAND} Blog`,
      url: canonicalUrl,
      description: metaDescription,
      publisher: { "@id": `${SITE}/#organization` },
      inLanguage: "en-US",
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: `${SITE}/` },
        { "@type": "ListItem", position: 2, name: "Blog", item: canonicalUrl },
      ],
    },
  ];

  return buildPageSeo({
    pageTitle,
    metaDescription,
    ogTitle: `${BRAND} Blog — Guides & Tutorials`,
    keywords,
    canonicalPath: "blog.html",
    jsonLd,
  });
}

function buildBlogPostSeo({ file, headline, metaDescription, datePublished, dateModified }) {
  const canonicalUrl = `${SITE}/${file}`;
  const pageTitle = `${headline} | ${BRAND} Blog`;
  const keywords = [
    headline.toLowerCase(),
    "covertfily blog",
    "file conversion",
    "privacy",
    "browser based tools",
    BRAND.toLowerCase(),
  ].join(", ");

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "@id": `${canonicalUrl}#webpage`,
      url: canonicalUrl,
      name: headline,
      description: metaDescription,
      isPartOf: { "@id": `${SITE}/#website` },
      inLanguage: "en-US",
      primaryImageOfPage: { "@type": "ImageObject", url: OG_IMAGE },
    },
    {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      "@id": `${canonicalUrl}#article`,
      headline,
      name: headline,
      description: metaDescription,
      url: canonicalUrl,
      mainEntityOfPage: canonicalUrl,
      image: OG_IMAGE,
      author: { "@id": `${SITE}/#organization` },
      publisher: { "@id": `${SITE}/#organization` },
      datePublished: datePublished || SITE_PUBLISHED,
      dateModified: dateModified || datePublished || SITE_MODIFIED,
      isAccessibleForFree: true,
      inLanguage: "en-US",
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: `${SITE}/` },
        { "@type": "ListItem", position: 2, name: "Blog", item: `${SITE}/blog.html` },
        { "@type": "ListItem", position: 3, name: headline, item: canonicalUrl },
      ],
    },
  ];

  return buildPageSeo({
    pageTitle,
    metaDescription,
    ogTitle: headline,
    keywords,
    canonicalPath: file,
    ogType: "article",
    jsonLd,
  });
}

function buildLegalSeo({ file, headline, metaDescription }) {
  const canonicalUrl = `${SITE}/${file}`;
  const pageTitle = `${headline} — ${BRAND}`;
  const keywords = [
    headline.toLowerCase(),
    "covertfily legal",
    "privacy first file converter",
    "data protection",
    BRAND.toLowerCase(),
  ].join(", ");

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "@id": `${canonicalUrl}#webpage`,
      url: canonicalUrl,
      name: pageTitle,
      description: metaDescription,
      isPartOf: { "@id": `${SITE}/#website` },
      inLanguage: "en-US",
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: `${SITE}/` },
        { "@type": "ListItem", position: 2, name: headline, item: canonicalUrl },
      ],
    },
  ];

  return buildPageSeo({
    pageTitle,
    metaDescription,
    ogTitle: pageTitle,
    keywords,
    canonicalPath: file,
    jsonLd,
  });
}

function buildDocumentationSeo() {
  const pageTitle = `Documentation — ${BRAND} | Privacy-First File Tools`;
  const metaDescription =
    "Learn how to use Covertfily's private, browser-based conversion tools. Tutorials for PDF, image, video, audio, and document processing with 100% client-side privacy.";
  const keywords = [
    "covertfily documentation",
    "file converter help",
    "browser based converter guide",
    "pdf tools tutorial",
    "private file processing",
    BRAND.toLowerCase(),
  ].join(", ");

  const canonicalUrl = `${SITE}/documentation.html`;
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "TechArticle",
      "@id": `${canonicalUrl}#article`,
      headline: "Covertfily Documentation",
      name: pageTitle,
      description: metaDescription,
      url: canonicalUrl,
      author: { "@id": `${SITE}/#organization` },
      publisher: { "@id": `${SITE}/#organization` },
      datePublished: SITE_PUBLISHED,
      dateModified: SITE_MODIFIED,
      inLanguage: "en-US",
      isAccessibleForFree: true,
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: `${SITE}/` },
        { "@type": "ListItem", position: 2, name: "Documentation", item: canonicalUrl },
      ],
    },
  ];

  return buildPageSeo({
    pageTitle,
    metaDescription,
    ogTitle: `Documentation — ${BRAND}`,
    keywords,
    canonicalPath: "documentation.html",
    jsonLd,
  });
}

function escapeAttr(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function buildHubSeo(hub, converters) {
  const keywords = [
    hub.title.toLowerCase(),
    hub.h1.toLowerCase(),
    "free online converter",
    "no upload converter",
    "private file converter",
    "browser based converter",
    "client side converter",
    BRAND.toLowerCase(),
    ...converters.slice(0, 12).map((c) => c.label.toLowerCase()),
  ].join(", ");

  const pageTitle = `${hub.h1} — Free & Private | ${BRAND}`;
  const ogTitle = `${hub.title} — ${BRAND}`;

  return buildPageSeo({
    pageTitle,
    metaDescription: hub.metaDescription,
    ogTitle,
    keywords,
    canonicalPath: hub.file,
    jsonLd: buildHubJsonLd(hub, converters),
  });
}

function buildHomepageSeo() {
  const pageTitle = `${BRAND} — 100% Private Browser-Based File Converter`;
  const metaDescription =
    "Convert PDF, images, video, audio, and documents free in your browser. No uploads, no signup, no tracking — 100% client-side file conversion that keeps your files on your device.";
  const keywords = [
    "file converter",
    "online file converter",
    "free file converter",
    "browser based converter",
    "no upload converter",
    "private file converter",
    "pdf converter",
    "image converter",
    "video converter",
    "audio converter",
    "document converter",
    "client side converter",
    "offline file converter",
    BRAND.toLowerCase(),
  ].join(", ");

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "@id": `${SITE}/#webpage`,
      url: `${SITE}/`,
      name: pageTitle,
      description: metaDescription,
      isPartOf: { "@id": `${SITE}/#website` },
      inLanguage: "en-US",
      primaryImageOfPage: { "@type": "ImageObject", url: OG_IMAGE },
    },
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "@id": `${SITE}/#website`,
      name: BRAND,
      url: SITE,
      description: metaDescription,
      publisher: { "@id": `${SITE}/#organization` },
      potentialAction: {
        "@type": "SearchAction",
        target: {
          "@type": "EntryPoint",
          urlTemplate: `${SITE}/?q={search_term_string}`,
        },
        "query-input": "required name=search_term_string",
      },
      inLanguage: "en-US",
    },
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      "@id": `${SITE}/#organization`,
      name: BRAND,
      url: SITE,
      logo: { "@type": "ImageObject", url: OG_IMAGE },
      sameAs: ["https://github.com/jagathram-tech/covertfily"],
    },
  ];

  return buildPageSeo({
    pageTitle,
    metaDescription,
    ogTitle: `${BRAND} — Private File Converter`,
    keywords,
    canonicalPath: "/",
    jsonLd,
  });
}

function sitemapMetaFor(file) {
  if (file === "index.html") {
    return { priority: "1.0", changefreq: "daily" };
  }
  if (/^(pdf-tools|image-tools|document-tools|media-tools)/.test(file)) {
    return { priority: "0.95", changefreq: "weekly" };
  }
  if (/-to-/.test(file)) {
    return { priority: "0.9", changefreq: "monthly" };
  }
  if (file.startsWith("how-to-")) {
    return { priority: "0.85", changefreq: "monthly" };
  }
  if (file.startsWith("blog")) {
    return { priority: "0.8", changefreq: "weekly" };
  }
  return { priority: "0.7", changefreq: "monthly" };
}

function buildHubJsonLd(hub, converters) {
  return [
    {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      name: hub.title,
      description: hub.metaDescription,
      url: `${SITE}/${hub.file}`,
      inLanguage: "en-US",
      isPartOf: { "@id": `${SITE}/#website` },
    },
    {
      "@context": "https://schema.org",
      "@type": "ItemList",
      name: `${hub.title} on ${BRAND}`,
      numberOfItems: converters.length,
      itemListElement: converters.slice(0, 50).map((item, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: item.label,
        url: `${SITE}/${item.href}`,
      })),
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: `${SITE}/` },
        {
          "@type": "ListItem",
          position: 2,
          name: hub.title,
          item: `${SITE}/${hub.file}`,
        },
      ],
    },
  ];
}

module.exports = {
  SITE,
  BRAND,
  OG_IMAGE,
  BASIC_LABELS,
  TOOL_CATEGORIES,
  getCategory,
  buildConverterSeo,
  buildPageSeo,
  buildHubSeo,
  buildHomepageSeo,
  buildHowToSeo,
  buildHandCraftedToolSeo,
  buildBlogIndexSeo,
  buildBlogPostSeo,
  buildLegalSeo,
  buildDocumentationSeo,
  extractHowToMeta,
  renderSeoHeadBlock,
  buildHubJsonLd,
  buildKeywordList,
  sitemapMetaFor,
  escapeAttr,
  renderSocialMetaTags,
  SITE_MODIFIED,
  SITE_PUBLISHED,
};