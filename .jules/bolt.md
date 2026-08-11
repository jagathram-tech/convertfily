## 2026-05-12 - Initial Bolt Journal\n**Learning:** Creating initial journal for Bolt.\n**Action:** Log future learnings here.

## 2026-05-12 - Cache DOM properties to prevent excessive reads during input events
**Learning:** In a vanilla JS/static architecture heavy on real-time DOM-based filtering, reading properties like `element.textContent` and `element.dataset` directly inside an `input` event listener forces repeated O(N * M) DOM property access cycles per keystroke.
**Action:** When filtering a static or rarely-changing list, iterate through the DOM nodes once upfront to build a cached array of objects containing the node reference and its text/data properties. Inside the `input` event, iterate over the cached plain JS array to prevent redundant DOM property reading overhead.
