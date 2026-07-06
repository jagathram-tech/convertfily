## 2024-07-06 - Concurrent Script Loading
 **Learning:** Discovered a bottleneck in how independent CDN scripts were being sequentially awaited during tool loading, which slowed down the time to first byte and conversion start.
 **Action:** Refactored the loading sequence to use Promise.all to fetch scripts concurrently. Always load independent scripts in parallel rather than using a sequential loop with awaits.
