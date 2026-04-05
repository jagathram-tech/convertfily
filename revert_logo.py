import os
import re

directory = r"c:\Users\itsja\.antigravity\covertfily"

orig_favicon = '''<link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><rect fill='%233b82f6' width='100' height='100' rx='20'/><path d='M75 60v20a5 5 0 0 1-5 5H25a5 5 0 0 1-5-5V40a5 5 0 0 1 10 0v30h45V60a5 5 0 0 1 5-5h0a5 5 0 0 1 0 10H30v10h40a5 5 0 0 1 5 5v0a5 5 0 0 1-5 5H25a5 5 0 0 1-5-5V60' fill='white'/></svg>">'''

orig_logo = '''<div class="logo-icon">
            <svg viewBox="0 0 24 24"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
        </div>'''

for filename in os.listdir(directory):
    if filename.endswith(".html"):
        filepath = os.path.join(directory, filename)
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()

        # Revert favicon
        content = re.sub(
            r'<link\s+rel="icon"\s+href="logo\.png"\s+type="image/png">',
            orig_favicon,
            content,
            flags=re.IGNORECASE
        )

        # Revert header logo
        content = re.sub(
            r'<img\s+src="logo\.png"\s+alt="convertfily logo"\s+style="width: 34px; height: 34px; border-radius: 8px; object-fit: contain;">',
            orig_logo,
            content,
            flags=re.IGNORECASE
        )

        # Remove social cover image tags entirely!
        content = re.sub(r'<meta\s+property="og:image"\s+content="[^"]*">\n?', '', content, flags=re.IGNORECASE)
        content = re.sub(r'<meta\s+name="twitter:image"\s+content="[^"]*">\n?', '', content, flags=re.IGNORECASE)

        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)

print("Logos reverted and cover images removed.")
