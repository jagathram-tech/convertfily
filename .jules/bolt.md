## 2024-05-24 - Parallel Script Loading
**Learning:** The `ensureConversionLibs` function loaded multiple dependent CDN scripts sequentially using a `for...of` loop with `await`. This blocked the main thread and delayed conversions, especially for complex operations like PDF-to-Word which need multiple libraries (e.g., pdfjs, jszip, mammoth).
**Action:** Always load independent scripts concurrently using `Promise.all` rather than sequentially `await`ing each one in a loop to improve TTFB and conversion start times.
