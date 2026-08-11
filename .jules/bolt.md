## 2024-05-18 - Load independent CDN scripts concurrently
**Learning:** Loading multiple independent CDN scripts sequentially in a loop (`for...await`) significantly degrades Time to First Byte (TTFB) and conversion start times because each request is blocked by the previous one.
**Action:** Use `Promise.all` to load independent CDN scripts concurrently when initializing conversion libraries (e.g., in `ensureConversionLibs`).
