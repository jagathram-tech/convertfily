## 2024-06-25 - Optimize CDN Script Loading
**Learning:** Loading multiple independent CDN scripts sequentially in a `for...await` loop causes a significant and unnecessary delay before conversions can begin. When format conversions require multiple libraries (e.g., pdf to docx requires pdfjs, jspdf, mammoth, and jszip), waiting for each to load one after another blocks execution.
**Action:** Always load independent scripts concurrently using `Promise.all`. This pattern dramatically reduces Time to Interactive (TTI) and Time to First Byte (TTFB) for dynamically loaded libraries.
