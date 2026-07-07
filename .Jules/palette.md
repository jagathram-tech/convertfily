## 2024-05-24 - ARIA Labels for Icon-Only Social Links
**Learning:** Icon-only elements like the footer social links (GitHub, Twitter, Email) use FontAwesome `<i>` tags for visuals. Without `aria-label`s on the parent link, screen readers will either announce nothing or an unhelpful URL/CSS class. To prevent double-reading, the `<i>` tag should explicitly have `aria-hidden="true"`.
**Action:** Always verify that interactive elements lacking visible text have descriptive `aria-label` attributes on the parent container, and add `aria-hidden="true"` to pure decorative nested children.
