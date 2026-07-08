## 2024-05-24 - Load Conversion Libraries Concurrently
**Learning:** Sequential await loops for fetching independent CDN scripts (e.g. dynamically loading libraries needed for conversion) unnecessarily block and increase Time to First Byte (TTFB).
**Action:** When dynamically loading multiple scripts that don't depend on each other, use `Promise.all(urls.map(url => loadScript(url)))` instead of a `for...of` loop with `await` to significantly improve loading performance.
