import os
import re

directory = r"c:\Users\itsja\.antigravity\covertfily"
domain = "https://convertfily.vercel.app"

seo_data = {
    "index.html": {
        "title": "convertfily (converfily) — Free Online File Converter (50+ Tools)",
        "desc": "Convert files online for free directly in your browser. Support 50+ formats including PDF to Word, JPG to PNG, MP3 to WAV, MP4 to AVI. 100% private, no uploads required.",
        "keywords": "convertfily, converfily, free online file converter, PDF converter, image converter, video converter, audio converter, local converter, offline converter tool",
        "category": "UtilitiesApplication"
    },
    "videos.html": {
        "title": "Online Video Converter (MP4, WebM, AVI, MKV) — convertfily",
        "desc": "Fastest free online video converter. Convert MP4 to AVI, MOV to MP4, MKV to WebM seamlessly in your browser. No size limits, 100% private.",
        "keywords": "video converter, mp4 converter, webm converter, mov converter, avi converter, mkv converter, online video converter free, converfily video",
        "category": "MultimediaApplication"
    },
    "universal.html": {
        "title": "Universal File Converter (Images, Audio, Video, Docs) — convertfily",
        "desc": "The ultimate universal format converter. Switch between any file format offline in your browser. Fast, secure, and 100% free multi-tool.",
        "keywords": "universal file converter, multi-format converter, online file conversion tool, convert any file, offline converter, convertfily universal",
        "category": "UtilitiesApplication"
    },
    "pdf.html": {
        "title": "Free PDF Converter (JPG & PNG to PDF) — convertfily",
        "desc": "Easily convert images to PDF or PDF to images. Convert JPG to PDF, PNG to PDF, and extract formats securely right in your browser.",
        "keywords": "pdf converter, jpg to pdf, png to pdf, pdf to jpg, pdf to png, images to pdf online, free pdf tools, convertfily pdf",
        "category": "BusinessApplication"
    },
    "images.html": {
        "title": "Image Format Converter (PNG, JPG, WebP, GIF) — convertfily",
        "desc": "Best free image converter for PNG, JPG, WebP, GIF, BMP, ICO, and AVIF. Lightning-fast offline conversions with zero data collection.",
        "keywords": "image converter, png converter, jpg to png, webp converter, gif converter, bmp converter, avif converter, batch image converter, convertfily image",
        "category": "DesignApplication"
    },
    "fusion.html": {
        "title": "Document to PDF Fusion Converter — convertfily",
        "desc": "Convert TXT, HTML, MD, JSON, and URLs directly into perfectly rendered PDFs. Ultra-fast, completely secure, offline processing.",
        "keywords": "document to pdf, txt to pdf, md to pdf, html to pdf, json to pdf, url to pdf, fusion converter, convertfily fusion",
        "category": "BusinessApplication"
    },
    "documents.html": {
        "title": "Free Document Converter — convertfily",
        "desc": "Securely convert text files and document formats directly in your browser. No server uploads for ultimate privacy.",
        "keywords": "document converter, text to pdf, simple document converter, secure file converter, convertfily docs",
        "category": "BusinessApplication"
    },
    "audio.html": {
        "title": "Free Online Audio Converter (MP3, WAV, FLAC) — convertfily",
        "desc": "Convert audio files for free—MP3 to WAV, OGG to FLAC, AAC to M4A. Private, fast, offline audio conversions in seconds.",
        "keywords": "audio converter, mp3 converter, wav converter, ogg converter, flac converter, aac converter, m4a converter, convertfily audio",
        "category": "MultimediaApplication"
    }
}

for filename, data in seo_data.items():
    filepath = os.path.join(directory, filename)
    if not os.path.exists(filepath):
        continue
        
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Clear old tags
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
    
    <!-- Open Graph -->
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

    <!-- Software App SEO Schema -->
    <script type="application/ld+json">
    {{
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      "name": "convertfily",
      "description": "{data['desc']}",
      "url": "{full_url}",
      "applicationCategory": "{data['category']}",
      "operatingSystem": "Web Browser",
      "offers": {{
        "@type": "Offer",
        "price": "0.00",
        "priceCurrency": "USD"
      }},
      "featureList": [
        "100% Offline Browser Processing",
        "End-to-End Privacy without file uploads",
        "Image format conversion (JPG, PNG, WebP)",
        "Video format conversion (MP4, WebM)",
        "Audio format conversion (MP3, WAV)",
        "PDF creation from images and documents"
      ]
    }}
    </script>
    
    <!-- FAQ Rich Snippets for Maximum Reach in Google Search -->
    <script type="application/ld+json">
    {{
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [
        {{
          "@type": "Question",
          "name": "Is convertfily (converfily) completely free and without ads?",
          "acceptedAnswer": {{
            "@type": "Answer",
            "text": "Yes, convertfily is an entirely free online file converter. We do not place hidden charges, and you can convert unlimited files."
          }}
        }},
        {{
          "@type": "Question",
          "name": "Are my files uploaded to your servers?",
          "acceptedAnswer": {{
            "@type": "Answer",
            "text": "No! Unlike other competitors, convertfily processes your files 100% locally directly inside your web browser. This means your files never leave your computer, ensuring absolute privacy."
          }}
        }},
        {{
          "@type": "Question",
          "name": "What file formats are supported?",
          "acceptedAnswer": {{
            "@type": "Answer",
            "text": "Convertfily supports over 50 formats including PDF conversions, JPG/PNG imagery, MP4/MKV video variations, and MP3/WAV audio processing."
          }}
        }}
      ]
    }}
    </script>'''

    def insert_seo(match):
        return match.group(0) + "\n" + seo_block

    content = re.sub(r'(<meta\s+name="viewport"[^>]*>)', insert_seo, content, count=1, flags=re.IGNORECASE)
    
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

print("Supercharged SEO script execution completed.")
