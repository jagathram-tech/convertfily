import os
import re

directory = r"c:\Users\itsja\.antigravity\covertfily"

for filename in os.listdir(directory):
    if filename.endswith(".html"):
        filepath = os.path.join(directory, filename)
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()

        # Replace favicon
        content = re.sub(
            r'<link\s+rel="icon"\s+href="data:image/svg\+xml,[^"]*">',
            '<link rel="icon" href="logo.png" type="image/png">',
            content,
            flags=re.IGNORECASE
        )

        # Replace header logo
        content = re.sub(
            r'<div class="logo-icon">\s*<svg[^>]*>.*?</svg>\s*</div>',
            '<img src="logo.png" alt="convertfily logo" style="width: 34px; height: 34px; border-radius: 8px; object-fit: contain;">',
            content,
            flags=re.IGNORECASE | re.DOTALL
        )

        # Replace og:image and twitter:image to use logo.png instead of cover-image.png
        content = re.sub(
            r'cover-image\.png',
            'logo.png',
            content,
            flags=re.IGNORECASE
        )

        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
            
# Also update site.webmanifest
manifest_path = os.path.join(directory, 'site.webmanifest')
if os.path.exists(manifest_path):
    with open(manifest_path, 'r', encoding='utf-8') as f:
        m_content = f.read()
    m_content = m_content.replace('/cover-image.png', '/logo.png')
    with open(manifest_path, 'w', encoding='utf-8') as f:
        f.write(m_content)

# Update update_seo.py as well
updater_path = os.path.join(directory, 'update_seo.py')
if os.path.exists(updater_path):
    with open(updater_path, 'r', encoding='utf-8') as f:
        u_content = f.read()
    u_content = u_content.replace('cover-image.png', 'logo.png')
    with open(updater_path, 'w', encoding='utf-8') as f:
        f.write(u_content)

print("Icons integrated successfully.")
