import os
import re

directory = r"c:\Users\itsja\.antigravity\covertfily"

# 1. Update Title tags to be perfectly sized (under 60 characters)
seo_titles = {
    "index.html": "Free Online File Converter - convertfily",
    "videos.html": "Online Video Converter (MP4, WebM) - convertfily",
    "universal.html": "Universal File Converter - convertfily",
    "pdf.html": "Free PDF Converter (JPG & PNG to PDF) - convertfily",
    "images.html": "Image Format Converter - convertfily",
    "fusion.html": "Document to PDF Fusion Converter - convertfily",
    "documents.html": "Free Document Converter - convertfily",
    "audio.html": "Free Online Audio Converter - convertfily"
}

for filename, new_title in seo_titles.items():
    filepath = os.path.join(directory, filename)
    if not os.path.exists(filepath):
        continue
        
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Replace title tags cleanly
    content = re.sub(r'<title>.*?</title>', f'<title>{new_title}</title>', content, flags=re.IGNORECASE)
    
    # Also update og:title and twitter:title
    content = re.sub(r'<meta property="og:title" content="[^"]*">', f'<meta property="og:title" content="{new_title}">', content, flags=re.IGNORECASE)
    content = re.sub(r'<meta name="twitter:title" content="[^"]*">', f'<meta name="twitter:title" content="{new_title}">', content, flags=re.IGNORECASE)

    # 2. Fix the H1 matching warning for index.html
    if filename == "index.html":
        old_p = "<p>Convert between all popular formats instantly. No uploads, no fees, no login required. Everything happens in your browser.</p>"
        new_p = "<p>Use our <strong>free online file converter</strong> to convert between all popular formats instantly. No uploads, no fees, no login required. Everything happens in your browser.</p>"
        content = content.replace(old_p, new_p)

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

print("Warnings patched.")
