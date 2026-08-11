## 2024-05-24 - Load Conversion Scripts Concurrently
**Learning:** The application was loading CDN dependencies sequentially inside a loop, significantly increasing Time to First Byte (TTFB) and delaying conversion start.
**Action:** Replaced sequential `await`ing of independent scripts with concurrent loading via `Promise.all` to optimize asset fetching.