## 2024-07-24 - Optimize ensureConversionLibs by loading independent scripts concurrently

**Learning:** When ensuring necessary conversion libraries are loaded, `main.js` was using a sequential `for...of` loop to `await` each `loadScriptOnce` call. Since these CDN scripts are independent, this results in a waterfalled network request pattern, slowing down the time-to-first-byte (TTFB) and delaying the start of the conversion process, particularly on slower networks or when multiple libraries are required (e.g., pdf to docx requires pdfjs, jspdf, jszip).

**Action:** Replaced the sequential loop with `await Promise.all(Array.from(needs).map(key => loadScriptOnce(SCRIPT_LIBS[key])));` to load all required scripts concurrently.
