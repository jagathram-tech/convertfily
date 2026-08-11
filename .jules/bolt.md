## 2024-05-24 - Avoid redundant DOM reads during frequent events
**Learning:** Querying the DOM (e.g., `querySelector`, `textContent`) on every keypress during search filtering is a common frontend performance bottleneck that causes layout thrashing and unnecessary CPU usage.
**Action:** Always cache static DOM elements and their text content in arrays or maps upfront, and iterate over this cache rather than querying the live DOM for search/filtering logic.
