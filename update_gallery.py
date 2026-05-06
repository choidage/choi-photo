import os
import json

CATEGORIES = ['street', 'minimal', 'structure', 'life']
ALLOWED_EXTENSIONS = {'.jpg', '.jpeg', '.png', '.webp', '.gif'}

gallery_data = []

print("Scanning folders for images...")

for category in CATEGORIES:
    if os.path.exists(category):
        files = os.listdir(category)
        # Sort files alphabetically
        files.sort()
        count = 0
        for f in files:
            ext = os.path.splitext(f)[1].lower()
            if ext in ALLOWED_EXTENSIONS:
                gallery_data.append({
                    'category': category,
                    'path': f"{category}/{f}"
                })
                count += 1
        print(f" - Found {count} image(s) in '{category}'")
    else:
        print(f" - Folder '{category}' not found. Creating it now...")
        os.makedirs(category)

# Write to gallery_data.js
output_file = 'gallery_data.js'
with open(output_file, 'w', encoding='utf-8') as f:
    f.write(f"const galleryData = {json.dumps(gallery_data, indent=4)};\n")

print(f"\nSuccess! gallery_data.js updated with {len(gallery_data)} total image(s).")
