## 2024-05-24 - Interactive Divs Instead of Buttons
**Learning:** Found a recurring pattern where interactive elements like accordion headers are implemented using non-semantic `div` tags with `onclick` handlers, resulting in a lack of keyboard accessibility and screen reader support.
**Action:** When working on this app's components, proactively check `div`s with `onclick` for accessibility attributes (`role="button"`, `tabindex="0"`, `onkeydown` for Enter/Space, and focus styling).
