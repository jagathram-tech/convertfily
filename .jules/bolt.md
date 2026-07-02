## 2024-05-15 - Concurrent Script Loading Anti-pattern
**Learning:** Loading independent CDN scripts sequentially in a `for...of` loop within `ensureConversionLibs` adds unnecessary latency, significantly delaying the start of conversions. Each script load waits for the previous one to finish, stacking up network delays.
**Action:** Always load independent scripts concurrently using `Promise.all` rather than sequentially `await`ing each one, to significantly improve Time to First Byte (TTFB) and overall conversion start times.
