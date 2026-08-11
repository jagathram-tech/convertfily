## 2024-05-24 - Concurrent script loading for conversion libraries
**Learning:** Found that when loading multiple conversion libraries on demand, sequential script loading created a waterfall effect that delayed conversion start time. `ensureConversionLibs` was `await`ing each script load in a loop instead of fetching them in parallel.
**Action:** When loading multiple independent CDN scripts on demand, always use `Promise.all` to fetch them concurrently, significantly improving Time to First Byte (TTFB) and conversion start time without sacrificing code readability.
