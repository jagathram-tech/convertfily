## 2024-05-19 - Make Non-Semantic Accordion Keyboard Accessible
**Learning:** FAQ accordion headers were implemented as non-semantic `<div>` elements with `onclick` handlers, making them inaccessible to keyboard users (no tab order, no enter/space activation).
**Action:** Added `role="button"`, `tabindex="0"`, `onkeydown` handlers for Enter/Space, and explicit `focus-visible` ring styles to ensure proper keyboard navigation.
