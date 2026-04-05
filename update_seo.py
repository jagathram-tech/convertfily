import os
import re

directory = r"c:\Users\itsja\.antigravity\covertfily"
domain = "https://convertfily.vercel.app"

seo_data = {
    "index.html": {
        "title": "convertfily — Free Online File Converter (Images, PDF, Video, Audio)",
        "desc": "Fastest and 100% private file converter. Safely convert images, PDFs, videos, audio, and documents locally in your browser for free. No uploads required.",
        "keywords": "free online file converter, private file converter, convert images, pdf converter, video converter, audio converter, local conversion, secure file converter",
        "category": "WebApplication"
    },
    "videos.html": {
        "title": "Free Online Video Converter — convertfily",
        "desc": "Fast and secure online video converter. Convert MP4, WebM, MOV, AVI, MKV formats privately directly in your browser without any quality loss.",
        "keywords": "video converter, mp4 converter, webm converter, mov converter, avi converter, mkv converter, online video converter free",
        "category": "MultimediaApplication"
    },
    "universal.html": {
        "title": "Universal File Converter — convertfily",
        "desc": "Convert any file format to any format simply and quickly. Our universal converter supports images, videos, audio, and documents—all offline in your browser.",
        "keywords": "universal file converter, ultimate converter, convert anything, multi-format converter, online file conversion tool, offline converter",
        "category": "UtilitiesApplication"
    },
    "pdf.html": {
        "title": "Free Online PDF Converter (JPG & PNG to PDF) — convertfily",
        "desc": "Convert images to PDF and PDF to images instantly. Convert JPG to PDF, PNG to PDF, and more locally with our secure online PDF converter.",
        "keywords": "pdf converter, jpg to pdf, png to pdf, pdf to jpg, pdf to png, images to pdf online, secure pdf tools",
        "category": "BusinessApplication"
    },
    "images.html": {
        "title": "Free Online Image Converter — convertfily",
        "desc": "Best image converter for PNG, JPG, WebP, GIF, BMP, ICO, TIFF, and AVIF files. Fast, free, and secure conversion processed directly in your local browser.",
        "keywords": "image converter, png converter, jpg converter, webp converter, gif converter, bmp converter, avif converter, batch image converter",
        "category": "DesignApplication"
    },
    "fusion.html": {
        "title": "Document to PDF Converter (Fusion) — convertfily",
        "desc": "Easily convert TXT, HTML, MD, JSON, and URLs to PDF securely. Your documents are handled locally for 100% privacy and lightning-speed processing.",
        "keywords": "document to pdf, txt to pdf, md to pdf, html to pdf, json to pdf, url to pdf, fusion converter",
        "category": "BusinessApplication"
    },
    "documents.html": {
        "title": "Free Online Document Converter — convertfily",
        "desc": "Secure document converter handling various text and data formats entirely locally. Enhance your workflow with fastest in-browser text and document conversions.",
        "keywords": "document converter, text to pdf, simple document converter, secure file converter javascript",
        "category": "BusinessApplication"
    },
    "audio.html": {
        "title": "Free Online Audio Converter — convertfily",
        "desc": "Convert audio files for free—MP3, WAV, OGG, FLAC, AAC, M4A supported. Lightning fast, completely private, and browser-based online audio converter.",
        "keywords": "audio converter, mp3 converter, wav converter, ogg converter, flac converter, aac converter, m4a converter",
        "category": "MultimediaApplication"
    }
}

for filename, data in seo_data.items():
    filepath = os.path.join(directory, filename)
    if not os.path.exists(filepath):
        continue
        
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Regex filters to wipe out prior SEO/Meta tags to avoid duplicates
    content = re.sub(r'<title>.*?</title>\s*', '', content, flags=re.IGNORECASE | re.DOTALL)
    content = re.sub(r'<meta\s+name="description".*?>\s*', '', content, flags=re.IGNORECASE)
    content = re.sub(r'<meta\s+name="keywords".*?>\s*', '', content, flags=re.IGNORECASE)
    content = re.sub(r'<meta\s+property="og:[^>]*>\s*', '', content, flags=re.IGNORECASE)
    content = re.sub(r'<meta\s+name="twitter:[^>]*>\s*', '', content, flags=re.IGNORECASE)
    content = re.sub(r'<link\s+rel="canonical"[^>]*>\s*', '', content, flags=re.IGNORECASE)
    content = re.sub(r'<meta\s+name="robots"[^>]*>\s*', '', content, flags=re.IGNORECASE)
    content = re.sub(r'<meta\s+name="theme-color"[^>]*>\s*', '', content, flags=re.IGNORECASE)
    content = re.sub(r'<script\s+type="application/ld\+json"[^>]*>.*?</script>\s*', '', content, flags=re.IGNORECASE | re.DOTALL)
    content = re.sub(r'<link\s+rel="manifest"[^>]*>\s*', '', content, flags=re.IGNORECASE)
    
    slug = "" if filename == "index.html" else filename
    full_url = f"{domain}/{slug}"
    
    seo_block = f'''    <title>{data['title']}</title>
    <meta name="description" content="{data['desc']}">
    <meta name="keywords" content="{data['keywords']}">
    <meta name="robots" content="index, follow">
    <meta name="theme-color" content="#2563eb">
    <link rel="canonical" href="{full_url}">
    <link rel="manifest" href="/site.webmanifest">
    
    <!-- Open Graph / Facebook -->
    <meta property="og:type" content="website">
    <meta property="og:url" content="{full_url}">
    <meta property="og:title" content="{data['title']}">
    <meta property="og:description" content="{data['desc']}">
    <meta property="og:image" content="{domain}/logo.png">
    
    <!-- Twitter -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:url" content="{full_url}">
    <meta name="twitter:title" content="{data['title']}">
    <meta name="twitter:description" content="{data['desc']}">
    <meta name="twitter:image" content="{domain}/logo.png">

    <!-- JSON-LD SEO Structured Data -->
    <script type="application/ld+json">
    {{
      "@context": "https://schema.org",
      "@type": "WebApplication",
      "name": "convertfily",
      "url": "{full_url}",
      "description": "{data['desc']}",
      "applicationCategory": "{data['category']}",
      "operatingSystem": "All",
      "offers": {{
        "@type": "Offer",
        "price": "0.00",
        "priceCurrency": "USD"
      }}
    }}
    </script>'''

    def insert_seo(match):
        return match.group(0) + "\n" + seo_block

    content = re.sub(r'(<meta\s+name="viewport"[^>]*>)', insert_seo, content, count=1, flags=re.IGNORECASE)
    
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

# Generate Sitemap
sitemap_content = f'''<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
'''
for filename in seo_data.keys():
    slug = "" if filename == "index.html" else filename
    url = f"{domain}/{slug}"
    priority = "1.0" if filename == "index.html" else "0.8"
    sitemap_content += f'''  <url>
    <loc>{url}</loc>
    <changefreq>daily</changefreq>
    <priority>{priority}</priority>
  </url>
'''
sitemap_content += "</urlset>\n"

with open(os.path.join(directory, "sitemap.xml"), "w", encoding="utf-8") as f:
    f.write(sitemap_content)

# Generate Robots.txt
robots_content = f'''User-agent: *
Allow: /

Sitemap: {domain}/sitemap.xml
'''
with open(os.path.join(directory, "robots.txt"), "w", encoding="utf-8") as f:
    f.write(robots_content)

print("Vercel domain SEO update completed successfully.")
