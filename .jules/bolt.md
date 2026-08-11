## 2024-07-24 - Concurrent CDN Script Loading Optimization
**Learning:** Loading independent client-side CDN scripts sequentially (e.g. using a `for...of` loop with `await`) blocks the main thread and significantly delays overall initialization and conversion start times, especially when multiple libraries are needed simultaneously.
**Action:** Always load independent scripts concurrently using `Promise.all` to optimize network requests and execution overlap, improving Time to First Byte (TTFB) and perceived performance.
