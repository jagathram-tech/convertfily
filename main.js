// Global format selection state and labels
const formatMapping = {
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
  flv: ["mp4"],
  wmv: ["mp4"],
  mp3: ["wav", "ogg", "aac", "m4a", "flac"],
  wav: ["mp3", "ogg", "aac", "m4a", "flac"],
  ogg: ["mp3", "wav", "aac"],
  aac: ["mp3", "wav"],
  m4a: ["mp3", "wav"],
  flac: ["mp3", "wav"],
  md: ["html", "pdf", "txt", "docx"],
  html: ["md", "pdf", "txt", "docx"],
  txt: ["pdf", "md", "html", "docx"],
  docx: ["pdf", "txt", "md"],
  xml: ["json", "txt"],
};

const formatLabels = {
  jpg: "JPG/JPEG",
  png: "PNG",
  webp: "WebP",
  bmp: "BMP",
  gif: "GIF",
  svg: "SVG",
  avif: "AVIF",
  tiff: "TIFF",
  heic: "HEIC/HEIF",
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
  json: "JSON Data",
  md: "Markdown (MD)",
  html: "HTML Page",
  txt: "Plain Text (TXT)",
  xml: "XML Data",
  docx: "Word Document (DOCX)",
};

window.FORMAT_MAPPING = formatMapping;
window.FORMAT_LABELS = formatLabels;

window.updateTargetDropdown = function (sourceFormat) {
  const toContainer = document.getElementById("formatToContainer");
  const toItems = document.getElementById("toItems");
  if (!toContainer || !toItems) return;

  const trigger = toContainer.querySelector(".dropdown-trigger");
  const valueSpan = toContainer.querySelector(".dropdown-value");
  const targets = formatMapping[sourceFormat] || [];

  toContainer.dataset.value = "";
  if (valueSpan) valueSpan.textContent = "To: Select output...";
  if (trigger) trigger.disabled = targets.length === 0;

  if (targets.length === 0) {
    toItems.innerHTML =
      '<div class="dropdown-placeholder" style="padding:20px;text-align:center;color:var(--text-muted);font-size:0.9rem;">No output formats available</div>';
    return;
  }

  toItems.innerHTML = targets
    .map((target) => {
      const label = formatLabels[target] || target.toUpperCase();
      return `<div class="dropdown-item" data-value="${target}" onclick="selectToFormat('${target}','${label}')">${label}</div>`;
    })
    .join("");
};

window.filterFormats = function (input, containerId) {
  const query = input.value.toLowerCase();
  const container = document.getElementById(containerId);
  if (!container) return;

  const items = container.querySelectorAll(".dropdown-item");
  const labels = container.querySelectorAll(".dropdown-group-label");
  let visibleCount = 0;

  items.forEach((item) => {
    const text = item.textContent.toLowerCase();
    const matches = text.includes(query);
    item.style.display = matches ? "block" : "none";
    if (matches) visibleCount++;
  });

  const noResults = container.parentElement.querySelector(".no-results");
  if (noResults)
    noResults.style.display = visibleCount === 0 ? "block" : "none";
};

window.toggleDropdown = function (trigger, event) {
  if (event) event.stopPropagation();
  if (trigger.classList.contains("disabled")) return;
  const dropdown = trigger.closest(".dropdown");
  if (!dropdown) return;

  const wasOpen = dropdown.classList.contains("open");

  // Close all other dropdowns
  document.querySelectorAll(".dropdown.open").forEach((d) => {
    if (d !== dropdown) d.classList.remove("open");
  });

  dropdown.classList.toggle("open");

  if (!wasOpen) {
    const searchInput = dropdown.querySelector(".dropdown-search");
    if (searchInput) {
      searchInput.value = "";
      setTimeout(() => searchInput.focus(), 50);
      // Reset visibility of all items
      dropdown.querySelectorAll(".dropdown-item").forEach((item) => {
        item.style.display = "flex";
      });
      const noResults = dropdown.querySelector(".no-results");
      if (noResults) noResults.style.display = "none";
    }
  }
};

window.selectFromFormat = function (value, label) {
  console.log("Selecting from:", value, label);
  const dropdown = document.getElementById("formatFromContainer");
  if (!dropdown) return;

  // Update labels and values
  const valueSpan = dropdown.querySelector(".dropdown-value");
  if (valueSpan) valueSpan.textContent = label;
  dropdown.dataset.value = value;

  // Close and select
  dropdown.classList.remove("open");
  dropdown
    .querySelectorAll(".dropdown-item")
    .forEach((i) => i.classList.toggle("selected", i.dataset.value === value));

  // Update the "To" dropdown
  window.updateTargetDropdown(value);
};

window.selectToFormat = function (value, label) {
  console.log("Selecting to:", value, label);
  const dropdown = document.getElementById("formatToContainer");
  if (!dropdown) return;

  const valueSpan = dropdown.querySelector(".dropdown-value");
  if (valueSpan) valueSpan.textContent = label;
  dropdown.dataset.value = value;

  dropdown.classList.remove("open");
  dropdown
    .querySelectorAll(".dropdown-item")
    .forEach((i) => i.classList.toggle("selected", i.dataset.value === value));
};

document.addEventListener("DOMContentLoaded", () => {
  console.log("Covertfily initialized");

  // Set active nav link
  const currentPath = window.location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".nav-links a").forEach((link) => {
    const href = link.getAttribute("href");
    if (href === currentPath) {
      link.classList.add("active");
    }
  });

  // Mobile navigation handled via persistent header; hamburger removed

  // Close mobile menu when clicking outside
  document.addEventListener("click", (e) => {
    if (document.body.classList.contains("nav-active")) {
      const navLinks = document.querySelector(".nav-links");
      const menuToggle = document.querySelector(".menu-toggle");
      if (
        navLinks &&
        !navLinks.contains(e.target) &&
        (!menuToggle || !menuToggle.contains(e.target))
      ) {
        document.body.classList.remove("nav-active");
      }
    }
  });

  // Close desktop dropdown when clicking outside
  document.addEventListener("click", (e) => {
    const toolsDropdown = document.querySelector(".has-nested-menu");
    if (toolsDropdown) {
      const isClickInside = toolsDropdown.contains(e.target);
      if (!isClickInside && toolsDropdown.classList.contains("has-open")) {
        toolsDropdown.classList.remove("has-open");
      }
    }
  });

  // Close menu on link click
  document
    .querySelectorAll(".nav-links a")
    .forEach((link) => {
      link.addEventListener("click", () => {
        document.body.classList.remove("nav-active");
      });
    });

  if (typeof pdfjsLib !== "undefined") {
    pdfjsLib.GlobalWorkerOptions.workerSrc =
      "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";
  }
  const dropzone = document.getElementById("dropzone");
  const formatFromContainer = document.getElementById("formatFromContainer");
  const formatToContainer = document.getElementById("formatToContainer");

  // Global selection handlers removed to prevent interference with selectBasic
  // document.addEventListener('click', ...);

  // Setup Search Logic for existing and future searchable dropdowns
  document.addEventListener("input", (e) => {
    if (e.target.classList.contains("dropdown-search")) {
      const query = e.target.value.toLowerCase();
      const container = e.target.closest(".custom-dropdown");
      if (!container) return;
      const items = container.querySelectorAll(".dropdown-item");
      const noResults = container.querySelector(".no-results");
      let visibleCount = 0;

      items.forEach((item) => {
        const text = item.textContent.toLowerCase();
        const matches = text.includes(query);
        item.classList.toggle("hidden", !matches);
        if (matches) visibleCount++;
      });

      if (noResults)
        noResults.style.display = visibleCount === 0 ? "block" : "none";
    }
  });

  // Click handler moved to inline in index.html to prevent double-firing
  // dropzone.addEventListener('click', () => { ... });

  // Handle drag and drop only on pages with format containers (like index.html)
  // Avoid interfering with specialty tool pages that handle files themselves
  if (
    dropzone &&
    document.getElementById("fileInput") &&
    formatFromContainer &&
    formatToContainer
  ) {
    dropzone.addEventListener("dragover", (e) => {
      e.preventDefault();
      dropzone.style.borderColor = "var(--primary-hover)";
      dropzone.style.background = "var(--bg-alt)";
    });

    dropzone.addEventListener("dragleave", () => {
      dropzone.style.borderColor = "var(--primary)";
      dropzone.style.background = "white";
    });

    dropzone.addEventListener("drop", (e) => {
      e.preventDefault();
      dropzone.style.borderColor = "var(--primary)";
      dropzone.style.background = "white";
      if (window.handleFiles) window.handleFiles(e.dataTransfer.files);
    });
  }

  // Change handler moved to inline in index.html to prevent double-firing
  // fileInput.addEventListener('change', (e) => { ... });

  window.handleFiles = async function (files) {
    console.log("handleFiles triggered", files);
    if (files.length === 0) return;

    const formatFromContainer = document.getElementById("formatFromContainer");
    const formatToContainer = document.getElementById("formatToContainer");

    let formatFrom = formatFromContainer
      ? formatFromContainer.dataset.value
      : "";
    let formatTo = formatToContainer ? formatToContainer.dataset.value : "";

    const file = files[0];
    const ext = file.name.split(".").pop().toLowerCase();
    const extMap = { jpeg: "jpg" };
    const normalizedExt = extMap[ext] || ext;

    if (!formatFrom) {
      formatFrom = normalizedExt;
    }

    if (!formatTo) {
      const targets = formatMapping[formatFrom] || [];
      if (targets && targets.length > 0) {
        formatTo = targets[0];
      }
    }

    if (!formatFrom || !formatTo) {
      alert("Please select 'From' and 'To' formats first!");
      return;
    }

    const targetPage = converterPageSlug(formatFrom, formatTo);
    console.log("Redirecting to:", targetPage);
    window.location.href = targetPage;
  };

  function setConversionProgress(percent, status) {
    const bounded = Math.max(0, Math.min(100, Math.round(percent)));
    if (window.updateProgress) {
      window.updateProgress(bounded);
    }

    const percentEl = document.getElementById("progressPercent");
    if (percentEl) percentEl.textContent = bounded + "%";

    const statusEl = document.getElementById("progressStatus");
    if (statusEl && status) statusEl.textContent = status;

    const loadingText = document.getElementById("loadingText");
    if (loadingText && status) loadingText.textContent = status;
  }

  window.setConversionProgress = setConversionProgress;

  const SCRIPT_LIBS = {
    jszip: "https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js",
    pdfjs: "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js",
    jspdf: "https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js",
    marked: "https://cdn.jsdelivr.net/npm/marked/marked.min.js",
    turndown: "https://unpkg.com/turndown/dist/turndown.js",
    mammoth: "https://cdnjs.cloudflare.com/ajax/libs/mammoth/1.6.0/mammoth.browser.min.js",
    utif: "https://cdn.jsdelivr.net/npm/utif@3.1.0/UTIF.js",
    // heic-to (libheif 1.22) — much faster than legacy heic2any
    heicTo: "https://cdn.jsdelivr.net/npm/heic-to@1.5.2/dist/iife/heic-to.js",
  };

  const scriptLoadPromises = {};

  async function loadScriptOnce(url) {
    if (scriptLoadPromises[url]) return scriptLoadPromises[url];

    scriptLoadPromises[url] = new Promise((resolve, reject) => {
      const existing = document.querySelector(`script[data-dynamic-src="${url}"]`);
      if (existing) {
        if (existing.dataset.loaded === "1") return resolve();
        existing.addEventListener("load", () => resolve());
        existing.addEventListener("error", () =>
          reject(new Error(`Failed to load ${url}`)),
        );
        return;
      }

      const script = document.createElement("script");
      script.src = url;
      script.dataset.dynamicSrc = url;
      script.onload = () => {
        script.dataset.loaded = "1";
        resolve();
      };
      script.onerror = () => reject(new Error(`Failed to load ${url}`));
      document.head.appendChild(script);
    });

    return scriptLoadPromises[url];
  }

  async function ensureConversionLibs(from, to) {
    const source = (from || "").toLowerCase();
    const target = (to || "").toLowerCase();
    const needs = new Set();

    const rasterTargets = ["png", "jpg", "jpeg", "webp", "bmp"];
    const mediaTargets = [
      "mp4", "webm", "mov", "avi", "mkv", "mp3", "wav", "ogg", "aac", "m4a", "flac",
    ];

    if (source === "pdf" || target === "pdf") {
      needs.add("pdfjs");
      needs.add("jspdf");
    }
    if (source === "pdf" && rasterTargets.includes(target)) needs.add("jszip");
    if (source === "pdf" && (target === "docx" || target === "md")) needs.add("jszip");
    if (source === "docx" || target === "docx") {
      needs.add("mammoth");
      needs.add("jszip");
    }
    if (["md", "html", "txt"].includes(source) && target === "docx") needs.add("jszip");
    if (source === "md" && target === "html") needs.add("marked");
    if (source === "html" && target === "md") needs.add("turndown");
    if (source === "tiff") needs.add("utif");
    // HEIC lib is lazy-loaded only when native decode fails (see convertHeicImage)
    if (mediaTargets.includes(target)) {
      // FFmpeg loaded separately in convertMedia
    }

    // ⚡ Bolt: Load independent CDN scripts concurrently to improve TTFB
    await Promise.all(Array.from(needs).map(key => loadScriptOnce(SCRIPT_LIBS[key])));

    if (typeof pdfjsLib !== "undefined") {
      pdfjsLib.GlobalWorkerOptions.workerSrc =
        "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";
    }
  }

  function converterPageSlug(from, to) {
    if (from === "pdf" && to === "docx") return "pdf-to-word.html";
    return `${from}-to-${to}.html`;
  }

  window.processFile = async function (file, from, to) {
    try {
      const ext = file.name.split(".").pop().toLowerCase();
      const sourceFormat = (from || ext).toLowerCase().trim();
      const targetFormat = (to || "").toLowerCase().trim();

      setConversionProgress(3, "Preparing conversion...");
      await ensureConversionLibs(sourceFormat, targetFormat);

      console.log("Processing:", sourceFormat, "->", targetFormat);

      const rasterTargets = ["png", "jpg", "jpeg", "webp", "bmp"];
      const rasterSources = [
        "png", "jpg", "jpeg", "webp", "bmp", "gif", "avif", "heic", "tiff",
      ];

      // 1. Image conversions via Canvas API
      if (
        rasterTargets.includes(targetFormat) &&
        (rasterSources.includes(sourceFormat) ||
          file.type.startsWith("image/") ||
          ["svg", "eps"].includes(sourceFormat) ||
          sourceFormat === "pdf")
      ) {
        setConversionProgress(
          14,
          sourceFormat === "pdf"
            ? "Loading PDF pages..."
            : "Reading image pixels...",
        );
        if (sourceFormat === "pdf") {
          await convertPDFToImages(file, targetFormat);
        } else if (sourceFormat === "tiff") {
          await convertTiffImage(file, targetFormat);
        } else if (sourceFormat === "heic" || sourceFormat === "heif") {
          await convertHeicImage(file, targetFormat);
        } else {
          await convertImage(file, targetFormat);
        }
        setConversionProgress(100, "Output file ready.");
        return;
      }

      // 2. Media Conversions (MP4, WebM, MP3, etc.)
      if (
        [
          "mp4",
          "webm",
          "mov",
          "avi",
          "mkv",
          "mp3",
          "wav",
          "ogg",
          "aac",
          "m4a",
          "flac",
        ].includes(targetFormat)
      ) {
        setConversionProgress(10, "Loading media engine...");
        await convertMedia(file, targetFormat);
        setConversionProgress(100, "Output file ready.");
        return;
      }

      // 4. Text Conversions (MD, HTML, TXT)
      if (
        ["md", "html", "txt"].includes(targetFormat) &&
        ["md", "html", "txt"].includes(sourceFormat)
      ) {
        setConversionProgress(18, "Reading text content...");
        await convertText(file, sourceFormat, targetFormat);
        setConversionProgress(100, "Output file ready.");
        return;
      }

      // 6. PDF Conversions
      if (
        targetFormat === "pdf" &&
        (file.type.startsWith("image/") ||
          rasterSources.includes(sourceFormat) ||
          ["md", "html", "txt"].includes(sourceFormat))
      ) {
        setConversionProgress(16, "Building PDF...");
        await mergeToPDF([file], sourceFormat);
        setConversionProgress(100, "Output file ready.");
        return;
      }
      if (
        sourceFormat === "pdf" &&
        ["jpg", "png", "webp"].includes(targetFormat)
      ) {
        setConversionProgress(14, "Loading PDF pages...");
        await convertPDFToImages(file, targetFormat);
        setConversionProgress(100, "Output file ready.");
        return;
      }
      if (sourceFormat === "pdf" && targetFormat === "docx") {
        setConversionProgress(12, "Extracting PDF text...");
        await convertPDFToDocxViaText(file);
        setConversionProgress(100, "Output file ready.");
        return;
      }
      if (sourceFormat === "pdf" && targetFormat === "txt") {
        setConversionProgress(12, "Extracting PDF text...");
        await convertPDFToText(file);
        setConversionProgress(100, "Output file ready.");
        return;
      }
      if (sourceFormat === "pdf" && targetFormat === "md") {
        setConversionProgress(12, "Extracting PDF text...");
        const text = await extractPdfText(file);
        const blob = new Blob([text], { type: "text/markdown" });
        downloadFile(
          URL.createObjectURL(blob),
          file.name.replace(/\.[^/.]+$/, "") + ".md",
        );
        setConversionProgress(100, "Output file ready.");
        return;
      }
      if (
        sourceFormat === "docx" &&
        (targetFormat === "pdf" ||
          targetFormat === "txt" ||
          targetFormat === "md")
      ) {
        setConversionProgress(16, "Reading Word document...");
        await convertDocx(file, targetFormat);
        setConversionProgress(100, "Output file ready.");
        return;
      }
      if (
        ["md", "html", "txt"].includes(sourceFormat) &&
        targetFormat === "docx"
      ) {
        setConversionProgress(18, "Building Word document...");
        let text = await file.text();
        if (sourceFormat === "html") {
          const temp = document.createElement("div");
          temp.innerHTML = text;
          text = temp.textContent || temp.innerText || "";
        }
        await createDocxFromText(text, file.name);
        setConversionProgress(100, "Output file ready.");
        return;
      }
      if (sourceFormat === "xml") {
        setConversionProgress(18, "Parsing XML...");
        await convertXml(file, targetFormat);
        setConversionProgress(100, "Output file ready.");
        return;
      }
      alert(
        `Format ${(targetFormat || "unknown").toUpperCase()} is not completely mapped in this demo yet.`,
      );
    } catch (error) {
      console.error(error);
      setConversionProgress(0, "Conversion failed.");
      const detail =
        (error && error.message) ||
        (typeof error === "string" ? error : null) ||
        (typeof error === "number" ? "FFmpeg exit code " + error : null) ||
        "Unknown error";
      // Re-throw a real Error so UI catch blocks never show "undefined"
      throw error instanceof Error ? error : new Error(detail);
    }
  };

  /* ---------------------------------------------------------------------- */
  /* Conversion Logic implementations */
  /* ---------------------------------------------------------------------- */

  function yieldToUi() {
    return new Promise((resolve) => {
      if (typeof requestAnimationFrame === "function") {
        requestAnimationFrame(() => setTimeout(resolve, 0));
      } else {
        setTimeout(resolve, 0);
      }
    });
  }

  /** Encode canvas pixels to a BMP Blob. Yields periodically so the progress UI can paint. */
  async function canvasToBmpBlob(canvas, onProgress) {
    const ctx = canvas.getContext("2d");
    const { width, height } = canvas;
    const imageData = ctx.getImageData(0, 0, width, height);
    const rowSize = Math.floor((24 * width + 31) / 32) * 4;
    const pixelDataSize = rowSize * height;
    const fileSize = 54 + pixelDataSize;
    const buffer = new ArrayBuffer(fileSize);
    const view = new DataView(buffer);
    const pixels = imageData.data;

    view.setUint8(0, 0x42);
    view.setUint8(1, 0x4d);
    view.setUint32(2, fileSize, true);
    view.setUint32(10, 54, true);
    view.setUint32(14, 40, true);
    view.setInt32(18, width, true);
    view.setInt32(22, height, true);
    view.setUint16(26, 1, true);
    view.setUint16(28, 24, true);
    view.setUint32(34, pixelDataSize, true);

    let offset = 54;
    // Yield every ~5% of rows so large images keep the progress bar visible/moving
    const yieldEvery = Math.max(1, Math.floor(height / 20));
    for (let y = height - 1; y >= 0; y--) {
      for (let x = 0; x < width; x++) {
        const i = (y * width + x) * 4;
        view.setUint8(offset++, pixels[i + 2]);
        view.setUint8(offset++, pixels[i + 1]);
        view.setUint8(offset++, pixels[i]);
      }
      const padding = rowSize - width * 3;
      for (let p = 0; p < padding; p++) view.setUint8(offset++, 0);

      const rowsDone = height - y;
      if (rowsDone % yieldEvery === 0 || y === 0) {
        if (onProgress) onProgress(rowsDone / height);
        await yieldToUi();
      }
    }

    return new Blob([buffer], { type: "image/bmp" });
  }

  async function canvasToOutput(canvas, targetFormat, quality = 0.9) {
    if (targetFormat === "bmp") {
      return canvasToBmpBlob(canvas, (p) => {
        setConversionProgress(
          40 + Math.round(p * 55),
          "Encoding BMP... " + Math.round(p * 100) + "%",
        );
      });
    }
    let mimeType = "image/png";
    if (targetFormat === "jpg" || targetFormat === "jpeg")
      mimeType = "image/jpeg";
    else if (targetFormat === "webp") mimeType = "image/webp";
    return canvas.toDataURL(mimeType, quality);
  }

  // Back-compat alias used by older call sites
  function canvasToOutputUrl(canvas, targetFormat, quality = 0.9) {
    if (targetFormat === "bmp") {
      throw new Error("BMP output requires async canvasToOutput()");
    }
    let mimeType = "image/png";
    if (targetFormat === "jpg" || targetFormat === "jpeg")
      mimeType = "image/jpeg";
    else if (targetFormat === "webp") mimeType = "image/webp";
    return canvas.toDataURL(mimeType, quality);
  }

  window.assignInputFiles = function (input, files) {
    if (!input || !files) return;
    const dt = new DataTransfer();
    for (const file of files) dt.items.add(file);
    input.files = dt.files;
  };

  /** Windows often leaves file.type empty for drag-dropped files; fall back to extension. */
  window.isPdfFile = function (file) {
    if (!file) return false;
    return (
      file.type === "application/pdf" || /\.pdf$/i.test(file.name || "")
    );
  };

  window.isImageFile = function (file) {
    if (!file) return false;
    return (
      (file.type && file.type.startsWith("image/")) ||
      /\.(jpg|jpeg|png|webp|bmp|gif|svg|avif|tiff|heic)$/i.test(
        file.name || "",
      )
    );
  };

  window.isVideoFile = function (file) {
    if (!file) return false;
    return (
      (file.type && file.type.startsWith("video/")) ||
      /\.(mp4|webm|mov|avi|mkv|flv|wmv|m4v|mpeg|mpg|3gp)$/i.test(
        file.name || "",
      )
    );
  };

  window.isAudioFile = function (file) {
    if (!file) return false;
    return (
      (file.type && file.type.startsWith("audio/")) ||
      /\.(mp3|wav|ogg|flac|m4a|aac|webm|opus|wma)$/i.test(file.name || "")
    );
  };

  // Convert Images via Canvas
  function convertImage(file, targetFormat) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = async () => {
          try {
            setConversionProgress(30, "Drawing image...");
            await yieldToUi();

            const canvas = document.createElement("canvas");
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext("2d");

            if (targetFormat === "jpg" || targetFormat === "jpeg") {
              ctx.fillStyle = "#FFFFFF";
              ctx.fillRect(0, 0, canvas.width, canvas.height);
            }

            ctx.drawImage(img, 0, 0);

            setConversionProgress(
              40,
              targetFormat === "bmp" ? "Encoding BMP..." : "Encoding image...",
            );
            await yieldToUi();

            const output = await canvasToOutput(canvas, targetFormat, 0.9);
            setConversionProgress(96, "Preparing download...");
            downloadFile(
              output,
              file.name.replace(/\.[^/.]+$/, "") + `.${targetFormat}`,
            );
            resolve();
          } catch (err) {
            reject(err);
          }
        };
        img.onerror = async () => {
          if (file.name.toLowerCase().endsWith(".eps")) {
            try {
              const loadingText = document.getElementById("loadingText");
              if (loadingText)
                loadingText.textContent = "Analyzing EPS structure...";

              const buffer = await file.arrayBuffer();
              const view = new Uint8Array(buffer);

              // 1. Check for Embedded PDF (Adobe Illustrator EPS feature)
              const pdfMagic = [0x25, 0x50, 0x44, 0x46, 0x2d]; // %PDF-
              let pdfStart = -1;
              for (let i = 0; i < view.length - 5; i++) {
                if (
                  view[i] === pdfMagic[0] &&
                  view[i + 1] === pdfMagic[1] &&
                  view[i + 2] === pdfMagic[2] &&
                  view[i + 3] === pdfMagic[3] &&
                  view[i + 4] === pdfMagic[4]
                ) {
                  pdfStart = i;
                  break;
                }
              }

              if (pdfStart !== -1) {
                if (loadingText)
                  loadingText.textContent = "Extracting embedded vector PDF...";
                const eofMagic = [0x25, 0x25, 0x45, 0x4f, 0x46]; // %%EOF
                let pdfEnd = view.length;
                for (let i = view.length - 5; i >= pdfStart; i--) {
                  if (
                    view[i] === eofMagic[0] &&
                    view[i + 1] === eofMagic[1] &&
                    view[i + 2] === eofMagic[2] &&
                    view[i + 3] === eofMagic[3] &&
                    view[i + 4] === eofMagic[4]
                  ) {
                    pdfEnd = i + 5;
                    break;
                  }
                }

                const pdfBuffer = buffer.slice(pdfStart, pdfEnd);
                const pdf = await pdfjsLib.getDocument({ data: pdfBuffer })
                  .promise;
                const page = await pdf.getPage(1);
                const viewport = page.getViewport({ scale: 3 }); // High res
                const canvas = document.createElement("canvas");
                const ctx = canvas.getContext("2d");
                canvas.height = viewport.height;
                canvas.width = viewport.width;

                if (targetFormat === "jpg" || targetFormat === "jpeg") {
                  ctx.fillStyle = "#FFFFFF";
                  ctx.fillRect(0, 0, canvas.width, canvas.height);
                }

                await page.render({ canvasContext: ctx, viewport: viewport })
                  .promise;

                let mimeType = "image/png";
                if (targetFormat === "jpg" || targetFormat === "jpeg")
                  mimeType = "image/jpeg";
                else if (targetFormat === "webp") mimeType = "image/webp";

                downloadFile(
                  canvas.toDataURL(mimeType, 0.9),
                  file.name.replace(/\.[^/.]+$/, "") + `.${targetFormat}`,
                );
                resolve();
                return;
              }

              // 2. Check for Embedded TIFF (DOS EPS feature)
              const dataView = new DataView(buffer);
              if (
                buffer.byteLength > 30 &&
                dataView.getUint32(0, false) === 0xc5d0d3c6
              ) {
                if (loadingText)
                  loadingText.textContent = "Extracting TIFF preview...";
                const tiffOffset = dataView.getUint32(20, true);
                const tiffLength = dataView.getUint32(24, true);

                if (
                  tiffOffset > 0 &&
                  tiffLength > 0 &&
                  tiffOffset + tiffLength <= buffer.byteLength
                ) {
                  const tiffBuffer = buffer.slice(
                    tiffOffset,
                    tiffOffset + tiffLength,
                  );
                  if (typeof UTIF === "undefined") {
                    await new Promise((res, rej) => {
                      const script = document.createElement("script");
                      script.src =
                        "https://cdn.jsdelivr.net/npm/utif@3.1.0/UTIF.js";
                      script.onload = res;
                      script.onerror = () =>
                        rej(new Error("Failed to load local TIFF decoder."));
                      document.head.appendChild(script);
                    });
                  }
                  const ifds = UTIF.decode(tiffBuffer);
                  UTIF.decodeImage(tiffBuffer, ifds[0]);
                  const rgba = UTIF.toRGBA8(ifds[0]);

                  const canvas = document.createElement("canvas");
                  canvas.width = ifds[0].width;
                  canvas.height = ifds[0].height;
                  const ctx = canvas.getContext("2d");
                  const imgData = ctx.createImageData(
                    canvas.width,
                    canvas.height,
                  );
                  imgData.data.set(rgba);
                  ctx.putImageData(imgData, 0, 0);

                  let mimeType = "image/png";
                  if (targetFormat === "jpg" || targetFormat === "jpeg")
                    mimeType = "image/jpeg";
                  else if (targetFormat === "webp") mimeType = "image/webp";

                  downloadFile(
                    canvas.toDataURL(mimeType, 0.9),
                    file.name.replace(/\.[^/.]+$/, "") + `.${targetFormat}`,
                  );
                  resolve();
                  return;
                }
              }

              throw new Error(
                "This EPS does not contain an embedded PDF or TIFF preview. Strict client-side conversion requires EPS files saved with previews/PDF compatibility.",
              );
            } catch (err) {
              console.error("Local EPS Extraction Error:", err);
              reject(new Error("Local EPS extraction failed: " + err.message));
            }
          } else {
            reject(
              new Error(
                "Failed to load image. Format may not be supported by browser natively.",
              ),
            );
          }
        };
        img.src = e.target.result;
      };
      reader.readAsDataURL(file);
    });
  }

  async function convertTiffImage(file, targetFormat) {
    const buffer = await file.arrayBuffer();
    if (typeof UTIF === "undefined") {
      await loadScriptOnce(SCRIPT_LIBS.utif);
    }
    const ifds = UTIF.decode(buffer);
    UTIF.decodeImage(buffer, ifds[0]);
    const rgba = UTIF.toRGBA8(ifds[0]);

    const canvas = document.createElement("canvas");
    canvas.width = ifds[0].width;
    canvas.height = ifds[0].height;
    const ctx = canvas.getContext("2d");
    const imgData = ctx.createImageData(canvas.width, canvas.height);
    imgData.data.set(rgba);
    ctx.putImageData(imgData, 0, 0);

    setConversionProgress(
      40,
      targetFormat === "bmp" ? "Encoding BMP..." : "Encoding image...",
    );
    const output = await canvasToOutput(canvas, targetFormat, 0.9);
    downloadFile(
      output,
      file.name.replace(/\.[^/.]+$/, "") + `.${targetFormat}`,
    );
  }

  function canvasToBlobAsync(canvas, mimeType, quality) {
    return new Promise((resolve, reject) => {
      if (typeof canvas.toBlob === "function") {
        canvas.toBlob(
          (blob) =>
            blob
              ? resolve(blob)
              : reject(new Error("Image encoding failed")),
          mimeType,
          quality,
        );
        return;
      }
      try {
        const dataUrl = canvas.toDataURL(mimeType, quality);
        const parts = dataUrl.split(",");
        const bin = atob(parts[1] || "");
        const bytes = new Uint8Array(bin.length);
        for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
        resolve(new Blob([bytes], { type: mimeType }));
      } catch (err) {
        reject(err);
      }
    });
  }

  async function ensureHeicLib() {
    if (typeof HeicTo === "function") return;
    await loadScriptOnce(SCRIPT_LIBS.heicTo);
    if (typeof HeicTo !== "function") {
      throw new Error("Failed to load the HEIC converter engine.");
    }
  }

  function heicOutputMime(targetFormat) {
    const t = (targetFormat || "").toLowerCase();
    if (t === "png") return "image/png";
    if (t === "webp") return "image/webp";
    if (t === "jpg" || t === "jpeg") return "image/jpeg";
    return null;
  }

  async function encodeBitmapToFormat(bitmap, targetFormat, quality = 0.9) {
    const mime = heicOutputMime(targetFormat);
    const canvas = document.createElement("canvas");
    canvas.width = bitmap.width;
    canvas.height = bitmap.height;
    const ctx = canvas.getContext("2d", {
      alpha: mime === "image/png" || mime === "image/webp",
    });
    if (mime === "image/jpeg" || targetFormat === "jpg" || targetFormat === "jpeg") {
      ctx.fillStyle = "#FFFFFF";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
    ctx.drawImage(bitmap, 0, 0);
    if (typeof bitmap.close === "function") bitmap.close();

    if (mime) {
      return canvasToBlobAsync(canvas, mime, quality);
    }
    return canvasToOutput(canvas, targetFormat, quality);
  }

  /**
   * Fast HEIC/HEIF conversion:
   * 1) Native createImageBitmap (Safari) — no lib needed
   * 2) heic-to single-pass decode→jpg/png (libheif 1.22)
   * Avoids the old heic2any path that decoded HEIC→JPEG then re-encoded again.
   */
  async function convertHeicImage(file, targetFormat) {
    const outExt =
      targetFormat === "jpeg" ? "jpg" : (targetFormat || "jpg").toLowerCase();
    const outName = file.name.replace(/\.[^/.]+$/i, "") + `.${outExt}`;
    const mime = heicOutputMime(targetFormat);
    const quality = 0.9;

    setConversionProgress(10, "Decoding HEIC...");
    await yieldToUi();

    // Fast path A: browser-native HEIC decode (Safari / supporting engines)
    try {
      const bitmap = await createImageBitmap(file);
      setConversionProgress(55, `Encoding ${outExt.toUpperCase()}...`);
      await yieldToUi();
      const output = await encodeBitmapToFormat(bitmap, targetFormat, quality);
      setConversionProgress(98, "Preparing download...");
      downloadFile(output, outName);
      return;
    } catch (_) {
      /* not natively decodable — use libheif via heic-to */
    }

    setConversionProgress(20, "Loading HEIC engine...");
    await ensureHeicLib();
    setConversionProgress(35, "Converting HEIC...");
    await yieldToUi();

    // Fast path B: single-pass library convert straight to target mime
    if (mime) {
      const blob = await HeicTo({
        blob: file,
        type: mime,
        quality: mime === "image/png" ? undefined : quality,
      });
      setConversionProgress(98, "Preparing download...");
      downloadFile(blob, outName);
      return;
    }

    // Path C: need pixels for BMP etc. — decode to bitmap then encode
    let bitmap;
    try {
      bitmap = await HeicTo({ blob: file, type: "bitmap" });
    } catch (_) {
      const jpegBlob = await HeicTo({
        blob: file,
        type: "image/jpeg",
        quality,
      });
      bitmap = await createImageBitmap(jpegBlob);
    }
    setConversionProgress(70, `Encoding ${outExt.toUpperCase()}...`);
    await yieldToUi();
    const output = await encodeBitmapToFormat(bitmap, targetFormat, quality);
    setConversionProgress(98, "Preparing download...");
    downloadFile(output, outName);
  }

  async function extractPdfText(file) {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    let fullText = "";

    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      fullText +=
        textContent.items.map((item) => item.str).join(" ") + "\n\n";
    }

    return fullText;
  }

  function xmlNodeToJson(node) {
    if (node.nodeType === 3) {
      const text = node.nodeValue.trim();
      return text || undefined;
    }

    const obj = {};
    if (node.attributes && node.attributes.length) {
      obj["@attributes"] = {};
      for (const attr of node.attributes) {
        obj["@attributes"][attr.name] = attr.value;
      }
    }

    for (const child of node.childNodes) {
      if (child.nodeType === 3) {
        const text = child.nodeValue.trim();
        if (text) obj["#text"] = (obj["#text"] ? obj["#text"] + " " : "") + text;
      } else if (child.nodeType === 1) {
        const name = child.nodeName;
        const value = xmlNodeToJson(child);
        if (obj[name] === undefined) obj[name] = value;
        else if (Array.isArray(obj[name])) obj[name].push(value);
        else obj[name] = [obj[name], value];
      }
    }

    return obj;
  }

  async function convertXml(file, targetFormat) {
    const text = await file.text();
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(text, "application/xml");
    if (xmlDoc.querySelector("parsererror")) {
      throw new Error("Invalid XML file");
    }

    if (targetFormat === "json") {
      const json = JSON.stringify(xmlNodeToJson(xmlDoc.documentElement), null, 2);
      const blob = new Blob([json], { type: "application/json" });
      downloadFile(
        URL.createObjectURL(blob),
        file.name.replace(/\.[^/.]+$/, "") + ".json",
      );
      return;
    }

    if (targetFormat === "txt") {
      const plain = xmlDoc.documentElement.textContent || "";
      const blob = new Blob([plain.trim()], { type: "text/plain" });
      downloadFile(
        URL.createObjectURL(blob),
        file.name.replace(/\.[^/.]+$/, "") + ".txt",
      );
      return;
    }

    throw new Error(`XML to ${targetFormat.toUpperCase()} is not supported`);
  }

  // Convert Text data (Markdown to HTML etc)
  async function convertText(file, sourceFormat, targetFormat) {
    const text = await file.text();
    let result = text;

    if (sourceFormat === "md" && targetFormat === "html") {
      result = marked.parse(text);
    } else if (sourceFormat === "html" && targetFormat === "md") {
      const turndownService = new TurndownService();
      result = turndownService.turndown(text);
    } else if (targetFormat === "txt" && sourceFormat === "html") {
      const temp = document.createElement("div");
      temp.innerHTML = text;
      result = temp.textContent || temp.innerText || "";
    }

    setConversionProgress(72, "Writing output file...");
    const blob = new Blob([result], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    downloadFile(url, file.name.replace(/\.[^/.]+$/, "") + `.${targetFormat}`);
  }

  const RASTER_IMAGE_SOURCES = [
    "png", "jpg", "jpeg", "webp", "bmp", "gif", "svg", "avif", "tiff", "heic", "heif",
  ];

  function isRasterImageForPdf(file, sourceFormat) {
    const ext = file.name.split(".").pop().toLowerCase();
    const extMap = { jpeg: "jpg", tif: "tiff", heif: "heic" };
    const normalizedExt = extMap[ext] || ext;
    const fmt = (sourceFormat || normalizedExt || "").toLowerCase();
    return (
      file.type.startsWith("image/") ||
      RASTER_IMAGE_SOURCES.includes(fmt) ||
      RASTER_IMAGE_SOURCES.includes(normalizedExt)
    );
  }

  async function rasterImageToDataUrl(file, sourceFormat) {
    const ext = file.name.split(".").pop().toLowerCase();
    const fmt = (sourceFormat || ext).toLowerCase();

    if (fmt === "tiff" || ext === "tif" || ext === "tiff") {
      const buffer = await file.arrayBuffer();
      if (typeof UTIF === "undefined") {
        await loadScriptOnce(SCRIPT_LIBS.utif);
      }
      const ifds = UTIF.decode(buffer);
      UTIF.decodeImage(buffer, ifds[0]);
      const rgba = UTIF.toRGBA8(ifds[0]);
      const canvas = document.createElement("canvas");
      canvas.width = ifds[0].width;
      canvas.height = ifds[0].height;
      const ctx = canvas.getContext("2d");
      const imgData = ctx.createImageData(canvas.width, canvas.height);
      imgData.data.set(rgba);
      ctx.putImageData(imgData, 0, 0);
      return canvas.toDataURL("image/jpeg", 0.92);
    }

    if (fmt === "heic" || fmt === "heif" || ext === "heic" || ext === "heif") {
      let jpegBlob;
      try {
        const bitmap = await createImageBitmap(file);
        const canvas = document.createElement("canvas");
        canvas.width = bitmap.width;
        canvas.height = bitmap.height;
        const ctx = canvas.getContext("2d");
        ctx.fillStyle = "#FFFFFF";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(bitmap, 0, 0);
        if (typeof bitmap.close === "function") bitmap.close();
        jpegBlob = await canvasToBlobAsync(canvas, "image/jpeg", 0.9);
      } catch (_) {
        await ensureHeicLib();
        jpegBlob = await HeicTo({
          blob: file,
          type: "image/jpeg",
          quality: 0.9,
        });
      }
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target.result);
        reader.onerror = () =>
          reject(new Error("Failed to read converted HEIC image"));
        reader.readAsDataURL(jpegBlob);
      });
    }

    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target.result);
      reader.onerror = () => reject(new Error("Failed to read image file"));
      reader.readAsDataURL(file);
    });
  }

  // Merge multiple files into a single PDF via jsPDF
  async function mergeToPDF(files, sourceFormat) {
    if (typeof window.jspdf === "undefined") {
      alert("PDF library failed to load. Please refresh the page and try again.");
      return;
    }
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    let addedPages = 0;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const fileSourceFormat =
        sourceFormat || file.name.split(".").pop().toLowerCase();

      if (
        !isRasterImageForPdf(file, fileSourceFormat) &&
        !["md", "html", "txt", "pdf"].includes(fileSourceFormat)
      )
        continue;

      if (addedPages > 0) doc.addPage();

      if (isRasterImageForPdf(file, fileSourceFormat)) {
        const dataUrl = await rasterImageToDataUrl(file, fileSourceFormat);
        const img = new Image();
        await new Promise((resolve, reject) => {
          img.onload = resolve;
          img.onerror = () =>
            reject(new Error(`Failed to load image: ${file.name}`));
          img.src = dataUrl;
        });

        const pageWidth = doc.internal.pageSize.getWidth();
        const pageHeight = doc.internal.pageSize.getHeight();
        const ratio = img.width / img.height;
        let width = pageWidth - 20;
        let height = width / ratio;

        if (height > pageHeight - 20) {
          height = pageHeight - 20;
          width = height * ratio;
        }

        const imageFormat = dataUrl.startsWith("data:image/png") ? "PNG" : "JPEG";
        doc.addImage(dataUrl, imageFormat, 10, 10, width, height);
        addedPages++;
      } else if (file.type === "application/pdf") {
        // PDF merging is complex locally without heavy libs, we notify in this demo
        doc.text(`[PDF Content from ${file.name}]`, 10, 10);
        addedPages++;
      } else {
        const text = await file.text();
        doc.text(text, 10, 10, { maxWidth: 180 });
        addedPages++;
      }
    }

    if (addedPages === 0) {
      throw new Error(
        "No supported files could be added to the PDF. Check that your images are in a supported format.",
      );
    }

    const outputName =
      files.length > 1
        ? "merged_document.pdf"
        : files[0].name.replace(/\.[^/.]+$/, "") + ".pdf";
    const pdfBlob = doc.output("blob");
    downloadFile(pdfBlob, outputName);
  }

  // Convert PDF to Images via PDF.js
  async function convertPDFToImages(file, targetFormat) {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    const zip = new JSZip();

    for (let i = 1; i <= pdf.numPages; i++) {
      setConversionProgress(
        18 + Math.round(((i - 1) / pdf.numPages) * 64),
        `Rendering page ${i} of ${pdf.numPages}...`,
      );
      const page = await pdf.getPage(i);
      const viewport = page.getViewport({ scale: 2 });
      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d");
      canvas.height = viewport.height;
      canvas.width = viewport.width;

      await page.render({ canvasContext: context, viewport: viewport }).promise;

      const output = await canvasToOutput(canvas, targetFormat);
      if (output instanceof Blob) {
        zip.file(`page-${i}.${targetFormat}`, output);
      } else {
        const base64Data = String(output).split(",")[1];
        zip.file(`page-${i}.${targetFormat}`, base64Data, { base64: true });
      }
    }

    setConversionProgress(86, "Packaging output file...");
    const content = await zip.generateAsync({ type: "blob" }, (metadata) => {
      setConversionProgress(
        86 + metadata.percent * 0.12,
        "Packaging output file...",
      );
    });
    const url = URL.createObjectURL(content);
    downloadFile(url, file.name.replace(/\.[^/.]+$/, "") + "_images.zip");
  }

  // Load FFmpeg dynamically (pinned versions must stay in sync — see AGENTS.md)
  let ffmpeg = null;
  let ffmpegLoadPromise = null;

  function loadScriptTag(src) {
    return new Promise((resolve, reject) => {
      const existing = document.querySelector(`script[data-ffmpeg-src="${src}"]`);
      if (existing) {
        if (existing.dataset.loaded === "1") return resolve();
        existing.addEventListener("load", () => resolve());
        existing.addEventListener("error", () =>
          reject(new Error("Failed to load script: " + src)),
        );
        return;
      }
      const script = document.createElement("script");
      script.src = src;
      script.async = true;
      script.dataset.ffmpegSrc = src;
      script.onload = () => {
        script.dataset.loaded = "1";
        resolve();
      };
      script.onerror = () =>
        reject(new Error("Failed to load script: " + src));
      document.head.appendChild(script);
    });
  }

  async function ensureFFmpegLibs() {
    // Prefer jsDelivr (more reliable than unpkg for large wasm assets)
    const ffmpegUmd =
      "https://cdn.jsdelivr.net/npm/@ffmpeg/ffmpeg@0.12.10/dist/umd/ffmpeg.js";
    const utilUmd =
      "https://cdn.jsdelivr.net/npm/@ffmpeg/util@0.12.1/dist/umd/index.js";
    const ffmpegUmdFallback =
      "https://unpkg.com/@ffmpeg/ffmpeg@0.12.10/dist/umd/ffmpeg.js";
    const utilUmdFallback =
      "https://unpkg.com/@ffmpeg/util@0.12.1/dist/umd/index.js";

    if (!window.FFmpegWASM) {
      try {
        await loadScriptTag(ffmpegUmd);
      } catch (_) {
        await loadScriptTag(ffmpegUmdFallback);
      }
    }
    if (!window.FFmpegUtil) {
      try {
        await loadScriptTag(utilUmd);
      } catch (_) {
        await loadScriptTag(utilUmdFallback);
      }
    }
    if (!window.FFmpegWASM || !window.FFmpegWASM.FFmpeg) {
      throw new Error("FFmpeg library failed to initialize in the browser.");
    }
    if (!window.FFmpegUtil || !window.FFmpegUtil.toBlobURL) {
      throw new Error("FFmpeg util library failed to initialize in the browser.");
    }
  }

  async function loadFFmpeg() {
    if (ffmpeg) return ffmpeg;
    if (ffmpegLoadPromise) return ffmpegLoadPromise;

    ffmpegLoadPromise = (async () => {
      const loadingText = document.getElementById("loadingText");
      if (loadingText) loadingText.textContent = "Loading Media Engine...";

      await ensureFFmpegLibs();

      const { FFmpeg } = window.FFmpegWASM;
      const { toBlobURL } = window.FFmpegUtil;

      // CRITICAL: classWorkerURL MUST be a same-origin blob URL.
      // If omitted, UMD FFmpeg tries:
      //   new Worker("https://cdn.../814.ffmpeg.js")
      // which browsers block cross-origin from covertfily.com
      // ("Script cannot be accessed from origin ...").
      const workerCandidates = [
        "https://cdn.jsdelivr.net/npm/@ffmpeg/ffmpeg@0.12.10/dist/umd/814.ffmpeg.js",
        "https://unpkg.com/@ffmpeg/ffmpeg@0.12.10/dist/umd/814.ffmpeg.js",
      ];

      async function blobWorkerURL() {
        let last;
        for (const url of workerCandidates) {
          try {
            return await toBlobURL(url, "text/javascript");
          } catch (err) {
            last = err;
          }
        }
        throw last || new Error("Could not fetch FFmpeg worker script");
      }

      // All strategies use blob URLs for core + worker (same-origin).
      const strategies = [
        {
          name: "jsdelivr-esm-core",
          coreBase:
            "https://cdn.jsdelivr.net/npm/@ffmpeg/core@0.12.6/dist/esm",
        },
        {
          name: "jsdelivr-umd-core",
          coreBase:
            "https://cdn.jsdelivr.net/npm/@ffmpeg/core@0.12.6/dist/umd",
        },
        {
          name: "unpkg-esm-core",
          coreBase: "https://unpkg.com/@ffmpeg/core@0.12.6/dist/esm",
        },
        {
          name: "unpkg-umd-core",
          coreBase: "https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd",
        },
      ];

      // Create worker blob once and reuse
      if (loadingText) {
        loadingText.textContent = "Loading Media Engine (worker)...";
      }
      const classWorkerURL = await blobWorkerURL();

      let lastErr = null;
      for (const strategy of strategies) {
        try {
          if (loadingText) {
            loadingText.textContent =
              "Loading Media Engine (" + strategy.name + ")...";
          }
          console.log("[ffmpeg] trying load strategy:", strategy.name);

          const coreURL = await toBlobURL(
            `${strategy.coreBase}/ffmpeg-core.js`,
            "text/javascript",
          );
          const wasmURL = await toBlobURL(
            `${strategy.coreBase}/ffmpeg-core.wasm`,
            "application/wasm",
          );

          const instance = new FFmpeg();
          instance.on("log", ({ message }) => {
            console.log("[ffmpeg]", message);
          });

          await instance.load({
            coreURL,
            wasmURL,
            classWorkerURL,
          });

          // Only cache after a successful load
          ffmpeg = instance;
          console.log("[ffmpeg] loaded via", strategy.name);
          return ffmpeg;
        } catch (err) {
          lastErr = err;
          console.warn(
            "[ffmpeg] load strategy failed:",
            strategy.name,
            err && err.message ? err.message : err,
          );
        }
      }

      const detail =
        (lastErr && lastErr.message) ||
        (typeof lastErr === "string" ? lastErr : "unknown error");
      throw new Error(
        "Failed to load the media engine (ffmpeg-core). " +
          "Check your network / ad-blocker, then hard-refresh and try again. " +
          "Details: " +
          detail,
      );
    })();

    try {
      return await ffmpegLoadPromise;
    } catch (err) {
      ffmpegLoadPromise = null;
      ffmpeg = null;
      throw err;
    }
  }

  window.loadFFmpeg = loadFFmpeg;

  function audioBufferToWav(audioBuffer) {
    const numberOfChannels = audioBuffer.numberOfChannels;
    const sampleRate = audioBuffer.sampleRate;
    const format = 1; // PCM
    const bitDepth = 16;

    const bytesPerSample = bitDepth / 8;
    const blockAlign = numberOfChannels * bytesPerSample;

    const channelData = [];
    for (let channel = 0; channel < numberOfChannels; channel++) {
      channelData.push(audioBuffer.getChannelData(channel));
    }

    const dataLength = audioBuffer.length * numberOfChannels * bytesPerSample;
    const buffer = new ArrayBuffer(44 + dataLength);
    const view = new DataView(buffer);

    const writeString = (offset, string) => {
      for (let i = 0; i < string.length; i++) {
        view.setUint8(offset + i, string.charCodeAt(i));
      }
    };

    writeString(0, 'RIFF');
    view.setUint32(4, 36 + dataLength, true);
    writeString(8, 'WAVE');
    writeString(12, 'fmt ');
    view.setUint32(16, 16, true);
    view.setUint16(20, format, true);
    view.setUint16(22, numberOfChannels, true);
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, sampleRate * blockAlign, true);
    view.setUint16(32, blockAlign, true);
    view.setUint16(34, bitDepth, true);
    writeString(36, 'data');
    view.setUint32(40, dataLength, true);

    let offset = 44;
    const volume = 0.8;
    for (let i = 0; i < audioBuffer.length; i++) {
      for (let channel = 0; channel < numberOfChannels; channel++) {
        let sample = Math.max(-1, Math.min(1, channelData[channel][i])) * volume;
        sample = sample < 0 ? sample * 0x8000 : sample * 0x7FFF;
        view.setInt16(offset, sample, true);
        offset += 2;
      }
    }

    return new Blob([buffer], { type: 'audio/wav' });
  }

  async function convertAudioOffline(file) {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    if (audioContext.state === 'suspended') {
      await audioContext.resume();
    }
    const arrayBuffer = await file.arrayBuffer();
    const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
    const wavBlob = audioBufferToWav(audioBuffer);
    await audioContext.close();
    return wavBlob;
  }

  function mediaErrorMessage(error) {
    if (!error) return "Unknown media conversion error";
    if (typeof error === "string") return error;
    if (typeof error === "number") return "FFmpeg exited with code " + error;
    if (error.message) return error.message;
    try {
      return String(error);
    } catch (_) {
      return "Unknown media conversion error";
    }
  }

  function mimeForMediaTarget(targetFormat) {
    const map = {
      webm: "video/webm",
      mp4: "video/mp4",
      mov: "video/quicktime",
      avi: "video/x-msvideo",
      mkv: "video/x-matroska",
      mp3: "audio/mpeg",
      wav: "audio/wav",
      ogg: "audio/ogg",
      flac: "audio/flac",
      aac: "audio/aac",
      m4a: "audio/mp4",
    };
    return map[targetFormat] || "application/octet-stream";
  }

  /**
   * Explicit codecs + input demux hints.
   * Bare `-i in out` fails for WebM; FLV often needs `-f flv`.
   * Returns an array of command candidates (first success wins).
   */
  function buildFFmpegCommandCandidates(
    inputName,
    outputName,
    targetFormat,
    sourceExt,
  ) {
    const inputPrefix = [];
    // Help demuxers that can't sniff every container from extension alone
    if (sourceExt === "flv") inputPrefix.push("-f", "flv");
    if (sourceExt === "wmv" || sourceExt === "asf")
      inputPrefix.push("-f", "asf");

    const common = [
      ...inputPrefix,
      "-i",
      inputName,
      "-y",
      "-hide_banner",
      "-loglevel",
      "error",
    ];

    switch (targetFormat) {
      case "webm":
        return [
          [
            ...common,
            "-c:v",
            "libvpx",
            "-b:v",
            "1M",
            "-crf",
            "30",
            "-deadline",
            "realtime",
            "-cpu-used",
            "8",
            "-c:a",
            "libvorbis",
            "-b:a",
            "128k",
            outputName,
          ],
        ];
      case "mp4":
      case "mov":
      case "mkv":
        return [
          [
            ...common,
            "-c:v",
            "libx264",
            "-preset",
            "ultrafast",
            "-crf",
            "28",
            "-c:a",
            "aac",
            "-b:a",
            "128k",
            "-movflags",
            "+faststart",
            outputName,
          ],
        ];
      case "avi":
        return [
          [
            ...common,
            "-c:v",
            "mpeg4",
            "-q:v",
            "5",
            "-c:a",
            "libmp3lame",
            "-b:a",
            "128k",
            outputName,
          ],
        ];
      case "mp3":
        // Several encoder flag variants — wasm builds differ
        return [
          [
            ...common,
            "-vn",
            "-sn",
            "-dn",
            "-map",
            "0:a:0",
            "-c:a",
            "libmp3lame",
            "-b:a",
            "192k",
            "-ar",
            "44100",
            "-ac",
            "2",
            outputName,
          ],
          [
            ...common,
            "-vn",
            "-map",
            "0:a:0",
            "-c:a",
            "libmp3lame",
            "-q:a",
            "4",
            outputName,
          ],
          [
            ...common,
            "-vn",
            "-c:a",
            "libmp3lame",
            "-b:a",
            "192k",
            outputName,
          ],
          // Last resort: first stream only (some FLVs label audio oddly)
          [...common, "-vn", "-c:a", "libmp3lame", outputName],
        ];
      case "wav":
        return [[...common, "-vn", "-c:a", "pcm_s16le", outputName]];
      case "ogg":
        return [
          [
            ...common,
            "-vn",
            "-c:a",
            "libvorbis",
            "-b:a",
            "128k",
            outputName,
          ],
        ];
      case "aac":
      case "m4a":
        return [[...common, "-vn", "-c:a", "aac", "-b:a", "192k", outputName]];
      case "flac":
        return [[...common, "-vn", "-c:a", "flac", outputName]];
      default:
        return [[...common, outputName]];
    }
  }

  async function resetFFmpegInstance() {
    if (ffmpeg) {
      try {
        if (typeof ffmpeg.terminate === "function") ffmpeg.terminate();
      } catch (_) {}
    }
    ffmpeg = null;
    ffmpegLoadPromise = null;
  }

  /** Browser-native WebM encode via MediaRecorder (fallback when FFmpeg lacks libvpx). */
  async function convertVideoToWebmBrowser(file) {
    if (typeof MediaRecorder === "undefined") {
      throw new Error("MediaRecorder is not available in this browser.");
    }

    const objectUrl = URL.createObjectURL(file);
    const video = document.createElement("video");
    video.src = objectUrl;
    video.muted = true;
    video.playsInline = true;
    video.preload = "auto";
    video.crossOrigin = "anonymous";

    try {
      await new Promise((resolve, reject) => {
        video.onloadedmetadata = () => resolve();
        video.onerror = () =>
          reject(new Error("Browser could not decode this video for WebM conversion."));
      });

      if (!video.videoWidth || !video.videoHeight) {
        throw new Error("Video has no visual track to convert to WebM.");
      }

      const canvas = document.createElement("canvas");
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext("2d");
      const fps = 30;
      const canvasStream = canvas.captureStream(fps);

      // Prefer real media stream (includes audio when browser allows it)
      let stream;
      if (typeof video.captureStream === "function") {
        stream = video.captureStream();
      } else if (typeof video.mozCaptureStream === "function") {
        stream = video.mozCaptureStream();
      } else {
        stream = canvasStream;
      }

      // If captureStream has no video tracks, use canvas draws
      if (!stream.getVideoTracks().length) {
        stream = canvasStream;
      }

      const mimeCandidates = [
        "video/webm;codecs=vp9,opus",
        "video/webm;codecs=vp8,opus",
        "video/webm;codecs=vp9",
        "video/webm;codecs=vp8",
        "video/webm",
      ];
      const mimeType =
        mimeCandidates.find((t) => MediaRecorder.isTypeSupported(t)) || "";
      if (!mimeType) {
        throw new Error("This browser cannot record WebM (MediaRecorder unsupported).");
      }

      const chunks = [];
      const recorder = new MediaRecorder(stream, {
        mimeType,
        videoBitsPerSecond: 2_500_000,
      });
      recorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) chunks.push(e.data);
      };

      const stopped = new Promise((resolve, reject) => {
        recorder.onstop = () => resolve();
        recorder.onerror = () =>
          reject(new Error("MediaRecorder failed while encoding WebM."));
      });

      let drawId = 0;
      const useCanvasDraw = stream === canvasStream;
      const draw = () => {
        if (useCanvasDraw && !video.paused && !video.ended) {
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        }
        drawId = requestAnimationFrame(draw);
      };

      setConversionProgress(30, "Encoding WebM in browser...");
      recorder.start(200);
      draw();
      await video.play();

      await new Promise((resolve) => {
        video.onended = resolve;
        // Safety timeout for odd streams that never fire ended
        const ms = Math.max(1000, (video.duration || 30) * 1000 + 2000);
        setTimeout(resolve, ms);
      });

      if (recorder.state !== "inactive") recorder.stop();
      cancelAnimationFrame(drawId);
      await stopped;

      if (!chunks.length) {
        throw new Error("WebM encode produced an empty file.");
      }

      return new Blob(chunks, { type: "video/webm" });
    } finally {
      try {
        video.pause();
      } catch (_) {}
      URL.revokeObjectURL(objectUrl);
    }
  }

  // Convert Video & Audio using actual FFmpeg.wasm Engine
  async function convertMedia(file, targetFormat) {
    const ext = (file.name.split(".").pop() || "").toLowerCase();
    const audioOnlyExt = [
      "mp3",
      "wav",
      "ogg",
      "flac",
      "aac",
      "m4a",
      "opus",
      "wma",
    ];
    const isAudio =
      file.type.startsWith("audio/") || audioOnlyExt.includes(ext);
    const isVideoTarget = ["mp4", "webm", "mov", "avi", "mkv"].includes(
      targetFormat,
    );
    // FLV/WMV → audio is still a video source file for fallbacks
    const extractAudioFromVideo =
      ["mp3", "wav", "ogg", "aac", "m4a", "flac"].includes(targetFormat) &&
      !isAudio;

    // If target is WAV and input is audio, do it 100% offline via Web Audio API
    if (targetFormat === "wav" && isAudio) {
      try {
        setConversionProgress(20, "Decoding audio...");
        const wavBlob = await convertAudioOffline(file);
        setConversionProgress(90, "Finalizing file...");
        downloadFile(
          wavBlob,
          file.name.replace(/\.[^/.]+$/, "") + ".wav",
        );
        setConversionProgress(100, "Done!");
        return;
      } catch (err) {
        console.error(
          "Offline WAV conversion failed, falling back to FFmpeg:",
          err,
        );
      }
    }

    // Short unique MEMFS names — long/weird paths trigger ErrnoError: FS error
    const uid =
      Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
    const inputExt = ext || "bin";
    const inputName = "in_" + uid + "." + inputExt;
    const outputName = "out_" + uid + "." + targetFormat;
    let lastError = null;

    async function runFFmpegPass() {
      setConversionProgress(12, "Loading media engine...");
      const ff = await loadFFmpeg();

      setConversionProgress(18, "Writing file to memory...");
      // Prefer raw bytes — more reliable than fetchFile for File objects
      const bytes = new Uint8Array(await file.arrayBuffer());
      if (!bytes.length) {
        throw new Error("Input file is empty.");
      }

      try {
        await ff.deleteFile(inputName);
      } catch (_) {}
      try {
        await ff.deleteFile(outputName);
      } catch (_) {}

      await ff.writeFile(inputName, bytes);

      const logs = [];
      const onLog = ({ message }) => {
        if (message) {
          logs.push(message);
          console.log("[ffmpeg]", message);
        }
      };
      const onProgress = ({ progress }) => {
        const pct = Math.max(
          0,
          Math.min(100, Math.round((progress || 0) * 100)),
        );
        setConversionProgress(24 + pct * 0.64, `Converting media... ${pct}%`);
      };
      ff.on("log", onLog);
      ff.on("progress", onProgress);

      setConversionProgress(24, "Converting media...");
      const candidates = buildFFmpegCommandCandidates(
        inputName,
        outputName,
        targetFormat,
        inputExt,
      );

      let data = null;
      let lastCmdErr = null;

      for (let i = 0; i < candidates.length; i++) {
        const cmd = candidates[i];
        console.log("FFmpeg command attempt", i + 1, ":", cmd.join(" "));
        try {
          // Clear stale output from a previous attempt
          try {
            await ff.deleteFile(outputName);
          } catch (_) {}

          const code = await ff.exec(cmd);
          if (code !== 0 && code !== undefined && code !== null) {
            throw new Error(
              "FFmpeg exit code " +
                code +
                (logs.length
                  ? ": " + logs.slice(-4).join(" | ")
                  : ""),
            );
          }

          // readFile throws ErrnoError: FS error if encode failed / no output
          data = await ff.readFile(outputName);
          if (data && data.length) break;

          throw new Error("FFmpeg produced an empty output file.");
        } catch (cmdErr) {
          lastCmdErr = cmdErr;
          console.warn(
            "FFmpeg attempt failed:",
            mediaErrorMessage(cmdErr),
          );
          data = null;
        }
      }

      // Cleanup input always
      try {
        await ff.deleteFile(inputName);
      } catch (_) {}
      try {
        await ff.deleteFile(outputName);
      } catch (_) {}

      if (!data || !data.length) {
        throw lastCmdErr || new Error("All FFmpeg encode attempts failed.");
      }

      const mimeType = mimeForMediaTarget(targetFormat);
      const convertedBlob = new Blob([data], { type: mimeType });
      downloadFile(
        convertedBlob,
        file.name.replace(/\.[^/.]+$/, "") + "." + targetFormat,
      );
      setConversionProgress(100, "Done!");
    }

    try {
      await runFFmpegPass();
      return;
    } catch (error) {
      lastError = error;
      console.error("FFmpeg Conversion Error:", error);

      // FS corruption after a failed run — reset engine and retry once
      const msg = mediaErrorMessage(error).toLowerCase();
      if (
        msg.includes("fs error") ||
        msg.includes("errno") ||
        msg.includes("filesystem")
      ) {
        try {
          setConversionProgress(20, "Recovering media engine...");
          await resetFFmpegInstance();
          await runFFmpegPass();
          return;
        } catch (retryErr) {
          lastError = retryErr;
          console.error("FFmpeg retry after FS reset failed:", retryErr);
          await resetFFmpegInstance();
        }
      }
    }

    // WebM video fallback: browser MediaRecorder (no libvpx required)
    if (targetFormat === "webm" && !isAudio) {
      try {
        setConversionProgress(
          28,
          "FFmpeg WebM failed — trying browser encoder...",
        );
        const webmBlob = await convertVideoToWebmBrowser(file);
        setConversionProgress(95, "Finalizing file...");
        downloadFile(
          webmBlob,
          file.name.replace(/\.[^/.]+$/, "") + ".webm",
        );
        setConversionProgress(100, "Done!");
        return;
      } catch (webmErr) {
        console.error("Browser WebM fallback failed:", webmErr);
        lastError = webmErr;
      }
    }

    // Audio fallback → WAV (browser-decodable audio only)
    if (isAudio && targetFormat !== "wav") {
      try {
        setConversionProgress(
          50,
          "Encoding failed. Falling back to WAV conversion...",
        );
        const wavBlob = await convertAudioOffline(file);
        setConversionProgress(90, "Finalizing file...");
        downloadFile(
          wavBlob,
          file.name.replace(/\.[^/.]+$/, "") + ".wav",
        );
        setConversionProgress(100, "Done!");
        console.warn(
          `Conversion to ${targetFormat.toUpperCase()} failed; delivered WAV instead.`,
        );
        return;
      } catch (fallbackError) {
        console.error("Fallback WAV conversion also failed:", fallbackError);
        lastError = fallbackError;
      }
    }

    const detail = mediaErrorMessage(lastError);
    let hint = "";
    if (extractAudioFromVideo && inputExt === "flv") {
      hint =
        " This FLV may have no audio track, or an audio codec the browser engine cannot decode.";
    }
    throw new Error(
      "Media conversion failed" +
        (isVideoTarget ? " (video engine)" : "") +
        ": " +
        detail +
        hint,
    );
  }

  async function convertDocx(file, targetFormat) {
    const ext = file.name.split(".").pop().toLowerCase();
    if (ext === "doc") {
      alert(
        "Legacy .doc files are not supported. Please save your file as .docx (Word 2007+) to convert.",
      );
      resetDropzone();
      return;
    }

    const loadingText = document.getElementById("loadingText");
    if (loadingText) loadingText.textContent = "Reading Word Document...";

    try {
      if (typeof mammoth === "undefined") {
        await loadScriptOnce(SCRIPT_LIBS.mammoth);
      }

      const arrayBuffer = await file.arrayBuffer();
      const result = await mammoth.extractRawText({ arrayBuffer: arrayBuffer });
      const textContent = result.value.trim();

      if (!textContent) {
        throw new Error("No text content found");
      }

      if (targetFormat === "txt") {
        const blob = new Blob([textContent], { type: "text/plain" });
        downloadFile(
          URL.createObjectURL(blob),
          file.name.replace(/\.[^/.]+$/, "") + ".txt",
        );
      } else if (targetFormat === "md") {
        const blob = new Blob([textContent], { type: "text/markdown" });
        downloadFile(
          URL.createObjectURL(blob),
          file.name.replace(/\.[^/.]+$/, "") + ".md",
        );
      } else if (targetFormat === "pdf") {
        dropzone.innerHTML = `<i class="fas fa-cog fa-spin dropzone-icon"></i><h2>Converting...</h2><p id="exportProgress">Converting Word to PDF...</p>`;

        await convertTextToPdf(textContent, file.name);
        return;
      }
    } catch (error) {
      console.error(error);
      alert("Error: " + (error.message || "Could not read Word file"));
    }
  }

  async function convertTextToPdf(textContent, originalFileName) {
    if (typeof window.jspdf === "undefined") {
      await loadScriptOnce(SCRIPT_LIBS.jspdf);
    }

    if (typeof window.jspdf === "undefined") {
      alert("PDF library not loaded");
      return;
    }

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 20;
    const maxWidth = pageWidth - margin * 2;
    const lineHeight = 7;
    let y = margin;

    const lines = textContent.split("\n");

    for (let line of lines) {
      line = line.trim();
      if (!line) {
        y += lineHeight;
        continue;
      }

      const words = line.split(" ");
      let currentLine = "";

      for (let word of words) {
        const testLine = currentLine + (currentLine ? " " : "") + word;
        const testWidth = doc.getTextWidth(testLine);

        if (testWidth > maxWidth) {
          doc.text(currentLine, margin, y);
          y += lineHeight;
          currentLine = word;

          if (y > pageHeight - margin) {
            doc.addPage();
            y = margin;
          }
        } else {
          currentLine = testLine;
        }
      }

      if (currentLine) {
        doc.text(currentLine, margin, y);
        y += lineHeight;

        if (y > pageHeight - margin) {
          doc.addPage();
          y = margin;
        }
      }
    }

    const pdfBlob = doc.output("blob");
    const url = URL.createObjectURL(pdfBlob);
    const dlBtn = document.getElementById("downloadBtn");
    if (dlBtn) {
      downloadFile(url, originalFileName.replace(/\.[^/.]+$/, "") + ".pdf");
    } else {
      doc.save(originalFileName.replace(/\.[^/.]+$/, "") + ".pdf");
      resetDropzone();
    }
  }

  function cleanXmlString(str) {
    if (!str) return "";
    // Remove illegal XML characters
    let cleaned = str.replace(
      /[\x00-\x08\x0B\x0C\x0E-\x1F\x7F-\x84\x86-\x9F\uFDD0-\uFDEF\uFFFE\uFFFF]/g,
      "",
    );
    // Manual escaping for maximum safety in docx.js v7
    return cleaned
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }

  // Helper to split long strings into manageable paragraph chunks for Word
  function chunkText(text, size = 5000) {
    const chunks = [];
    for (let i = 0; i < text.length; i += size) {
      chunks.push(text.substring(i, i + size));
    }
    return chunks;
  }

  async function convertPDFToText(file) {
    const loadingText = document.getElementById("loadingText");
    if (loadingText) loadingText.textContent = "Extracting text from PDF...";

    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      let fullText = "";

      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        fullText +=
          textContent.items.map((item) => item.str).join(" ") + "\n\n";
      }

      const blob = new Blob([fullText], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
      downloadFile(url, file.name.replace(/\.[^/.]+$/, "") + ".txt");
    } catch (err) {
      console.error(err);
      alert("Error extracting text from PDF: " + err.message);
    }
  }

  async function convertPDFToDocxViaText(file) {
    const loadingText = document.getElementById("loadingText");
    if (loadingText) loadingText.textContent = "Extracting text from PDF...";

    const arrayBuffer = await file.arrayBuffer();

    // Simple inline worker to extract text
    const workerCode = `
            self.window = self;
            self.document = { createElement: () => ({ style: {} }), getElementsByTagName: () => [], documentElement: { style: {} } };
            importScripts('https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js');
            self.onmessage = async function(e) {
                try {
                    pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
                    const pdf = await pdfjsLib.getDocument({data: new Uint8Array(e.data), disableWorker: true}).promise;
                    let fullText = "";
                    for (let i = 1; i <= pdf.numPages; i++) {
                        const page = await pdf.getPage(i);
                        const textContent = await page.getTextContent();
                        fullText += textContent.items.map(item => item.str).join(" ") + "\\n\\n";
                    }
                    self.postMessage({ type: 'success', text: fullText });
                } catch (err) {
                    self.postMessage({ type: 'error', message: err.message });
                }
            };
        `;

    const workerBlob = new Blob([workerCode], {
      type: "application/javascript",
    });
    const workerUrl = URL.createObjectURL(workerBlob);
    const worker = new Worker(workerUrl);

    // Transfer the arrayBuffer to avoid copying
    worker.postMessage(arrayBuffer, [arrayBuffer]);

    return new Promise((resolve, reject) => {
      worker.onmessage = async function (e) {
        if (e.data.type === "success") {
          worker.terminate();
          URL.revokeObjectURL(workerUrl);

          if (loadingText)
            loadingText.textContent = "Creating Word document...";

          // Create DOCX manually using JSZip
          await createDocxFromText(e.data.text, file.name);
          resolve();
        } else if (e.data.type === "error") {
          worker.terminate();
          alert("Error: " + e.data.message);
          reject(e.data.message);
        }
      };
    });
  }

  async function createDocxFromText(text, originalName) {
    if (typeof JSZip === "undefined") {
      await loadScriptOnce(SCRIPT_LIBS.jszip);
    }

    if (typeof JSZip === "undefined") {
      alert("ZIP library not loaded");
      return;
    }

    const zip = new JSZip();

    const contentTypes = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
<Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
<Default Extension="xml" ContentType="application/xml"/>
<Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/>
</Types>`;

    const rels = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/>
</Relationships>`;

    const paragraphs = parseTextWithFormatting(text)
      .map((block) => {
        if (block.isHeading) {
          return `<w:p xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:pPr><w:pStyle w:val="Heading1"/></w:pPr><w:r><w:rPr><w:b/><w:sz w:val="28"/></w:rPr><w:t>${escapeXml(block.text)}</w:t></w:r></w:p>`;
        }
        return `<w:p xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:r><w:t>${escapeXml(block.text)}</w:t></w:r></w:p>`;
      })
      .join("\n");

    const document = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main" xmlns:wp="http://schemas.openxmlformats.org/drawingml/2006/wordprocessingDrawing" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">
<w:body>
<w:sectPr>
<w:pgSz w:w="12240" w:h="15840"/>
<w:pgMar w:top="1440" w:right="1440" w:bottom="1440" w:left="1440" w:header="720" w:footer="720" w:gutter="0"/>
</w:sectPr>
${paragraphs}
</w:body>
</w:document>`;

    zip.file("[Content_Types].xml", contentTypes);
    zip.file("_rels/.rels", rels);
    zip.file("word/document.xml", document);

    const docxBlob = await zip.generateAsync({ type: "blob" });
    const url = URL.createObjectURL(docxBlob);
    downloadFile(url, originalName.replace(/\.[^/.]+$/, "") + ".docx");
  }

  function escapeXml(text) {
    return text
      .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&apos;");
  }

  function parseTextWithFormatting(text) {
    const lines = text.split("\n");
    const blocks = [];
    let i = 0;

    while (i < lines.length) {
      const line = lines[i].trim();
      if (!line) {
        i++;
        continue;
      }

      if (
        line.length > 0 &&
        (line === line.toUpperCase() || /^[A-Z][\s\d]+:?$/.test(line)) &&
        line.length < 80
      ) {
        blocks.push({ text: line.replace(/:$/, ""), isHeading: true });
      } else if (
        line.match(/^(chapter|section|part|article|appendix)\s+\d+/i)
      ) {
        blocks.push({ text: line, isHeading: true });
      } else if (line.match(/^\d+\.\s+[A-Z]/) && line.length < 100) {
        blocks.push({ text: line, isHeading: true });
      } else {
        const words = line.split(/\s+/);
        let paragraph = line;
        while (
          i + 1 < lines.length &&
          lines[i + 1].trim() &&
          !lines[i + 1]
            .trim()
            .match(
              /^(chapter|section|part|article|appendix|\d+\.|[A-Z][\s\d]+:?$)/i,
            )
        ) {
          i++;
          paragraph += " " + lines[i].trim();
        }
        if (paragraph.length > 200) {
          const sentences = paragraph.match(/[^.!?]+[.!?]+\s*/g) || [paragraph];
          blocks.push(
            ...sentences.map((s) => ({ text: s.trim(), isHeading: false })),
          );
        } else {
          blocks.push({ text: paragraph, isHeading: false });
        }
      }
      i++;
    }

    return blocks;
  }

  async function convertPDFToDocx(file) {
    dropzone.innerHTML = `<i class="fas fa-cog fa-spin dropzone-icon"></i><h2>Analyzing PDF...</h2><p id="exportProgress">Starting background worker...</p>`;
    const arrayBuffer = await file.arrayBuffer();

    // Inline Worker Script with DOM Mocking for Environment Checks
    const workerCode = `
            // Mock minimum environment for libs that check for it
            self.window = self;
            self.document = {
                createElement: () => ({ style: {} }),
                getElementsByTagName: () => [],
                documentElement: { style: {} }
            };

            importScripts('https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js');
            importScripts('https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js');

            self.onmessage = async function(e) {
                const { data } = e.data;
                try {
                    // Critical for worker environment: point to the worker bundle
                    pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

                    const loadingTask = pdfjsLib.getDocument({
                        data: data,
                        disableWorker: true, // we ARE the worker, don't spawn another
                        useWorkerFetch: false
                    });

                    const pdf = await loadingTask.promise;

                    let fullText = "";
                    for (let i = 1; i <= pdf.numPages; i++) {
                        const page = await pdf.getPage(i);
                        const textContent = await page.getTextContent();
                        fullText += textContent.items.map(item => item.str).join(" ") + "\\n\\n";
                        self.postMessage({ type: 'progress', percent: Math.round((i / pdf.numPages) * 100) });
                    }
                    self.postMessage({ type: 'success', text: fullText });
                } catch (err) {
                    self.postMessage({ type: 'error', message: err.message });
                }
            };
        `;

    const blob = new Blob([workerCode], { type: "application/javascript" });
    const workerUrl = URL.createObjectURL(blob);
    const worker = new Worker(workerUrl);
    const progressText = document.getElementById("exportProgress");

    worker.postMessage({ data: arrayBuffer });

    worker.onmessage = async function (e) {
      const msg = e.data;

      if (msg.type === "progress") {
        progressText.innerText = `Extracting text: ${msg.percent}%`;
      } else if (msg.type === "success") {
        const fullText = msg.text;
        worker.terminate();
        URL.revokeObjectURL(workerUrl);

        await createDocxFromText(fullText, file.name);
      } else if (msg.type === "error") {
        worker.terminate();
        URL.revokeObjectURL(workerUrl);
        alert("Worker Error: " + msg.message);
        resetDropzone();
      }
    };
  }

  window.mergeToPDF = mergeToPDF;

function downloadFile(urlOrBlob, filename) {
  let url = urlOrBlob;
  let revokeAfterUse = false;
  if (
    urlOrBlob instanceof Blob ||
    (urlOrBlob && typeof urlOrBlob === "object" && typeof urlOrBlob.size === "number")
  ) {
    url = URL.createObjectURL(urlOrBlob);
    revokeAfterUse = true;
  }

  // Revoke any previously created object URL to avoid memory leaks
  const dlBtn = document.getElementById("downloadBtn");
  if (dlBtn) {
    const prevUrl = dlBtn.href;
    if (prevUrl && prevUrl.startsWith("blob:")) {
      URL.revokeObjectURL(prevUrl);
    }
    // Update the button to point to the new file without auto‑triggering a download
    dlBtn.href = url;
    dlBtn.download = filename;
    // Clear previous contents and set the new label
    dlBtn.textContent = "Download";
  }

  // Wire up download UI. Prefer not to flash the result area while the
  // loading/progress panel is still visible (page scripts hide loading after processFile).
  const loadingEl = document.getElementById("loading");
  const loadingVisible =
    loadingEl &&
    loadingEl.style.display !== "none" &&
    getComputedStyle(loadingEl).display !== "none";
  const resultArea = document.getElementById("resultArea");
  if (resultArea && !loadingVisible) {
    resultArea.style.display = "block";
  }
  const downloadContainer = document.getElementById("downloadContainer");
  if (downloadContainer) {
    downloadContainer.style.display = "block";
  }

  if (!dlBtn && !downloadContainer) {
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    if (revokeAfterUse) {
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    }
  }
}

  window.downloadFile = downloadFile;

  function resetDropzone() {
    // Revoke any previously created object URL to free memory
    const dlBtn = document.getElementById("downloadBtn");
    if (dlBtn) {
      const prevUrl = dlBtn.href;
      if (prevUrl && prevUrl.startsWith("blob:")) {
        URL.revokeObjectURL(prevUrl);
      }
      // Reset button attributes and label
      dlBtn.removeAttribute("href");
      dlBtn.removeAttribute("download");
      dlBtn.textContent = "Download";
    }

    const loading = document.getElementById("loading");
    const dropzone = document.getElementById("dropzone");
    const dropzoneTitle = document.getElementById("dropzoneTitle");
    const dropzoneSubtitle = document.getElementById("dropzoneSubtitle");

    if (loading) loading.style.display = "none";
    if (dropzone) {
      dropzone.style.display = "block";
      if (dropzoneTitle) dropzoneTitle.textContent = "Drop files here";
      if (dropzoneSubtitle)
        dropzoneSubtitle.textContent =
          "Or click to select files from your computer";

      const dlContainer = document.getElementById("downloadContainer");
      if (dlContainer) dlContainer.style.display = "none";
      const resultArea = document.getElementById("resultArea");
      if (resultArea) resultArea.style.display = "none";
    }
  }

  // Mobile support is now fully enabled and optimized.

  // Warm the HEIC engine on dedicated converter pages so conversion starts instantly.
  (function preloadHeicEngine() {
    try {
      const page = (location.pathname.split("/").pop() || "").toLowerCase();
      if (/^hei[cf]-to-/.test(page)) {
        loadScriptOnce(SCRIPT_LIBS.heicTo).catch(function () {});
      }
    } catch (_) {}
  })();

  // Progress Bar Utility
  window.updateProgress = function (percent) {
    const fill =
      document.getElementById("progressBarFill") ||
      document.querySelector(".progress-bar-fill");
    const container =
      document.getElementById("progressContainer") ||
      document.querySelector(".progress-container");
    if (container) container.style.display = "block";
    if (fill) fill.style.width = Math.max(0, Math.min(100, percent)) + "%";
  };

  window.hideProgress = function () {
    const container =
      document.getElementById("progressContainer") ||
      document.querySelector(".progress-container");
    if (container) container.style.display = "none";
    const fill =
      document.getElementById("progressBarFill") ||
      document.querySelector(".progress-bar-fill");
    if (fill) fill.style.width = "0%";
  };

  // CTA smooth scroll
  document.querySelectorAll(".hero-cta").forEach((btn) => {
    btn.addEventListener("click", function(e) {
      e.preventDefault();
      const href = this.getAttribute("href");
      if (!href) return;
      const target = document.querySelector(href);
      if (target) {
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  });

  // Hub tool list search (pdf-tools, image-tools, document-tools, media-tools)
  (function() {
    const search = document.getElementById("hubToolsSearch");
    if (!search) return;

    const clearBtn = document.getElementById("hubToolsSearchClear");
    const emptyState = document.getElementById("hubToolsEmpty");
    const sections = document.querySelectorAll(".hub-tools-section");

    function filterHubTools() {
      const query = search.value.toLowerCase().trim();
      let totalVisible = 0;

      sections.forEach((section) => {
        const links = section.querySelectorAll(".hub-tools-grid a");
        let sectionVisible = 0;

        links.forEach((link) => {
          const haystack = (link.dataset.search || link.textContent || "").toLowerCase();
          const match = !query || haystack.includes(query);
          link.style.display = match ? "" : "none";
          if (match) sectionVisible++;
        });

        section.hidden = query.length > 0 && sectionVisible === 0;
        totalVisible += sectionVisible;
      });

      if (emptyState) {
        emptyState.hidden = totalVisible > 0 || !query;
      }
      if (clearBtn) {
        clearBtn.hidden = !query;
      }
    }

    search.addEventListener("input", filterHubTools);
    if (clearBtn) {
      clearBtn.addEventListener("click", () => {
        search.value = "";
        search.focus();
        filterHubTools();
      });
    }
  })();

  // Nav Tools dropdown toggle & search
  (function() {
    const btn = document.getElementById("navToolsBtn");
    const dropdown = document.getElementById("navToolsDropdown");
    const search = document.getElementById("navToolsDropdownSearch");
    if (!btn || !dropdown) return;

    const caret = document.getElementById("navToolsCaret");

    function openDropdown() {
      dropdown.classList.add("active");
      dropdown.style.opacity = "1";
      dropdown.style.visibility = "visible";
      dropdown.style.pointerEvents = "auto";
      if (caret) caret.style.transform = "rotate(180deg)";
    }

    function closeDropdown() {
      dropdown.classList.remove("active");
      dropdown.style.opacity = "";
      dropdown.style.visibility = "";
      dropdown.style.pointerEvents = "";
      if (caret) caret.style.transform = "";
      if (search) {
        search.value = "";
        search.dispatchEvent(new Event("input"));
      }
    }

    btn.addEventListener("click", function(e) {
      e.stopPropagation();
      const isOpen = dropdown.classList.contains("active") || dropdown.style.opacity === "1";
      if (isOpen) {
        closeDropdown();
      } else {
        openDropdown();
      }
    });

    document.addEventListener("click", function(e) {
      if (!dropdown.contains(e.target) && !btn.contains(e.target)) {
        closeDropdown();
      }
    });

    if (search) {
      search.addEventListener("input", function() {
        const query = this.value.toLowerCase().trim();
        const groups = dropdown.querySelectorAll(".tools-group");
        groups.forEach((group) => {
          const links = group.querySelectorAll("a");
          const label =
            group.querySelector(".tools-group-label") ||
            group.querySelector(":scope > div:first-child");
          let anyVisible = false;

          links.forEach((link) => {
            const match =
              !query || link.textContent.toLowerCase().includes(query);
            link.style.display = match ? "block" : "none";
            if (match) anyVisible = true;
          });

          group.style.display = anyVisible ? "" : "none";
          if (label) label.style.display = anyVisible ? "" : "none";
        });
      });
    }
  })();
});

/* ============================================================================
   MOBILE-FIRST ENHANCEMENTS
   ============================================================================ */

(function() {
  const mobileMq = window.matchMedia('(max-width: 48rem)');
  let touchLinksBound = false;
  let accordionsBound = false;
  let scrollIndicatorsBound = false;

  function runMobileEnhancements() {
    if (!mobileMq.matches) return;
    setupFormatSwapper();
    setupTouchOptimizations();
    setupAccordions();
    setupScrollIndicators();
  }

  // Initialize mobile navigation drawer
  function setupMobileNav() {
    const toggleBtn = document.getElementById('mobileMenuToggle');
    const closeBtn = document.getElementById('mobileMenuClose');
    const backdrop = document.getElementById('mobileMenuBackdrop');
    const drawer = document.getElementById('mobileMenuDrawer');

    if (!toggleBtn || !drawer) return;

    function openMenu() {
      drawer.classList.remove('translate-x-full');
      drawer.classList.add('translate-x-0');
      drawer.style.pointerEvents = 'auto';
      if (backdrop) {
        backdrop.classList.remove('opacity-0', 'pointer-events-none');
        backdrop.classList.add('opacity-100');
        backdrop.style.pointerEvents = 'auto';
      }
      document.body.style.overflow = 'hidden';
    }

    function closeMenu() {
      drawer.classList.remove('translate-x-0');
      drawer.classList.add('translate-x-full');
      drawer.style.pointerEvents = 'none';
      if (backdrop) {
        backdrop.classList.remove('opacity-100');
        backdrop.classList.add('opacity-0', 'pointer-events-none');
        backdrop.style.pointerEvents = 'none';
      }
      document.body.style.overflow = '';
    }

    toggleBtn.addEventListener('click', openMenu);
    if (closeBtn) closeBtn.addEventListener('click', closeMenu);
    if (backdrop) backdrop.addEventListener('click', closeMenu);

    // Close menu when clicking on any link inside the drawer
    drawer.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', closeMenu);
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    setupMobileNav();
    runMobileEnhancements();
  });

  mobileMq.addEventListener('change', runMobileEnhancements);


  // 2. FORMAT SWAPPER - Swap from/to on mobile
  function setupFormatSwapper() {
    const formatSelectors = document.querySelector('.format-selectors');
    if (!formatSelectors) return;

    // Create swap button if it doesn't exist
    if (!document.querySelector('.format-connector')) {
      const swapBtn = document.createElement('button');
      swapBtn.className = 'format-connector';
      swapBtn.setAttribute('type', 'button');
      swapBtn.setAttribute('aria-label', 'Swap formats');
      swapBtn.innerHTML = '<i class="fas fa-arrows-up-down"></i>';
      
      const fromContainer = document.getElementById('formatFromContainer');
      const toContainer = document.getElementById('formatToContainer');
      
      if (fromContainer && toContainer) {
        fromContainer.parentNode.insertBefore(swapBtn, toContainer);
        
        swapBtn.addEventListener('click', function() {
          // Swap values
          const fromValue = fromContainer.dataset.value;
          const toValue = toContainer.dataset.value;
          const fromLabel = fromContainer.querySelector('.dropdown-value').textContent;
          const toLabel = toContainer.querySelector('.dropdown-value').textContent;
          
          if (fromValue && toValue) {
            fromContainer.dataset.value = toValue;
            toContainer.dataset.value = fromValue;
            fromContainer.querySelector('.dropdown-value').textContent = toLabel;
            toContainer.querySelector('.dropdown-value').textContent = fromLabel;
            
            // Add visual feedback
            swapBtn.style.transform = 'rotate(180deg)';
            setTimeout(() => { swapBtn.style.transform = ''; }, 300);
          }
        });
      }
    }
  }

  const TOUCH_SKIP_SELECTOR = [
    '#mobileMenuToggle',
    '#mobileMenuClose',
    '.hub-tools-search-clear',
    '.format-connector',
    '.search-inner-icon-btn',
    '.search-circle-btn',
    '.menu-toggle',
    '.dock-tab',
    '.accordion-header',
  ].join(', ');

  function shouldSkipTouchTarget(el) {
    return el.matches(TOUCH_SKIP_SELECTOR);
  }

  // 3. TOUCH OPTIMIZATIONS
  function setupTouchOptimizations() {
    document.querySelectorAll('button, a[role="button"], input[type="submit"]').forEach(btn => {
      if (shouldSkipTouchTarget(btn)) return;
      const rect = btn.getBoundingClientRect();
      if (rect.width < 44 || rect.height < 44) {
        btn.style.minWidth = '44px';
        btn.style.minHeight = '44px';
      }
    });

    if (!touchLinksBound) {
      touchLinksBound = true;
      document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
          const href = this.getAttribute('href');
          if (!href || href === '#') return;
          const target = document.querySelector(href);
          if (!target) return;
          e.preventDefault();
          const headerHeight = document.querySelector('nav')?.offsetHeight || 0;
          window.scrollTo({
            top: target.offsetTop - headerHeight,
            behavior: 'smooth',
          });
        });
      });
    }
  }

  // 4. ACCORDION FUNCTIONALITY
  function setupAccordions() {
    if (accordionsBound) return;
    accordionsBound = true;

    // FAQ accordion
    document.querySelectorAll('[role="button"].faq-question').forEach(btn => {
      btn.addEventListener('click', function() {
        const isExpanded = this.getAttribute('aria-expanded') === 'true';
        this.setAttribute('aria-expanded', !isExpanded);
        const answer = this.nextElementSibling;
        if (answer && answer.classList.contains('faq-answer')) {
          answer.classList.toggle('open');
        }
      });
      
      // Keyboard support
      btn.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          this.click();
        }
      });
    });

    // Advanced options accordion
    document.querySelectorAll('.advanced-header').forEach(header => {
      header.addEventListener('click', function() {
        const isExpanded = this.getAttribute('aria-expanded') === 'true';
        this.setAttribute('aria-expanded', !isExpanded);
        const content = this.nextElementSibling;
        if (content && content.classList.contains('advanced-content')) {
          content.classList.toggle('open');
        }
      });
    });
  }

  // 5. SCROLL INDICATORS FOR CAROUSELS
  function setupScrollIndicators() {
    if (scrollIndicatorsBound) return;
    scrollIndicatorsBound = true;

    document.querySelectorAll('.testimonials-container').forEach(container => {
      const indicators = container.parentElement?.querySelector('.testimonial-indicators');
      if (!indicators) return;

      container.addEventListener('scroll', debounce(function() {
        updateCarouselIndicators(container, indicators);
      }, 100));

      // Update on load
      updateCarouselIndicators(container, indicators);
    });
  }

  function updateCarouselIndicators(container, indicators) {
    const cards = container.querySelectorAll('.testimonial-card');
    const scrollLeft = container.scrollLeft;
    const cardWidth = cards[0]?.offsetWidth || 0;
    const currentIndex = Math.round(scrollLeft / cardWidth);

    indicators.querySelectorAll('.indicator').forEach((dot, idx) => {
      dot.classList.toggle('active', idx === currentIndex);
    });
  }

  // 6. UTILITY: DEBOUNCE
  function debounce(fn, delay) {
    let timeoutId;
    return function(...args) {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => fn.apply(this, args), delay);
    };
  }

  // 7. PREVENT 300MS TAP DELAY (already in CSS but reinforced here)
  document.addEventListener('touchstart', function() {}, false);

})();
