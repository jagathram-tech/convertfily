## 2024-07-25 - Concurrent CDN Script Loading
**Learning:** Loading independent external CDN scripts sequentially in a loop (using `await` in a `for...of` loop) creates unnecessary network bottlenecks and delays conversion start times, especially when multiple scripts are required.
**Action:** Always use `Promise.all` to load independent external scripts or resources concurrently to significantly improve Time to First Byte (TTFB) and overall performance.
