import os
import glob
from PIL import Image, ImageOps, ImageFilter, ImageEnhance
import numpy as np

ART_DIR = "/root/.gemini/antigravity-cli/brain/64b3a1f2-a2eb-4e49-bc40-e4e6a0af9423"
CHAR_DIR = "/root/Projects/liminal-resonance-vn/public/assets/characters"
BG_DIR = "/root/Projects/liminal-resonance-vn/public/assets/backgrounds"

os.makedirs(CHAR_DIR, exist_ok=True)
os.makedirs(BG_DIR, exist_ok=True)

# 1. Process Chiaroscuro Characters
char_map = {
    "isaac": "isaac_chiaroscuro",
    "mercer": "elena_mercer_chiaroscuro",
    "cole": "arthur_cole_chiaroscuro"
}

for char_id, file_prefix in char_map.items():
    files = sorted(glob.glob(f"{ART_DIR}/{file_prefix}*.jpg"), key=os.path.getmtime)
    if not files:
        continue
    latest = files[-1]
    img = Image.open(latest).convert("RGBA")
    w, h = img.size
    
    # Create smooth quadratic alpha fade at bottom
    alpha_mask = np.ones((h, w), dtype=np.float32)
    fade_start = int(h * 0.65)
    for y in range(fade_start, h):
        prog = (y - fade_start) / (h - fade_start)
        alpha_mask[y, :] = (1.0 - prog) ** 1.8
        
    # Edge vignette
    x_coords = np.linspace(-1, 1, w)
    edge_falloff = 1.0 - np.clip((np.abs(x_coords) - 0.72) / 0.28, 0, 1) ** 2
    alpha_mask *= edge_falloff[np.newaxis, :]
    
    alpha_img = Image.fromarray((np.clip(alpha_mask, 0, 1) * 255).astype(np.uint8), mode='L')
    img.putalpha(alpha_img)
    
    out_png = f"{CHAR_DIR}/{char_id}.png"
    img.save(out_png, "PNG")
    print(f"Saved stylized chiaroscuro sprite: {out_png}")

# 2. Stylize Backgrounds to match Hand-Drawn Dark Graphic Novel (Slay the Princess aesthetic)
for bg_file in glob.glob(f"{BG_DIR}/*.jpg"):
    base_name = os.path.basename(bg_file)
    img = Image.open(bg_file).convert("RGB")
    
    # Desaturate with warm/cool split toning and high-contrast charcoal black level
    gray = ImageOps.grayscale(img)
    contrast = ImageEnhance.Contrast(gray).enhance(1.6)
    
    # Subtle sketch edge enhancement
    edges = gray.filter(ImageFilter.FIND_EDGES)
    edges = ImageOps.invert(edges)
    edges = ImageEnhance.Contrast(edges).enhance(1.4)
    
    # Composite sketch lines with contrast image
    blended = Image.blend(contrast.convert("RGB"), edges.convert("RGB"), 0.15)
    
    # Apply warm/dark amber tint for subterranean atmosphere
    tinted = ImageOps.colorize(ImageOps.grayscale(blended), black="#070707", mid="#4a3e32", white="#dcd3c4")
    
    out_path = f"{BG_DIR}/{base_name}"
    tinted.save(out_path, "JPEG", quality=95)
    print(f"Stylized graphic novel background: {out_path}")

print("Style transfer complete!")
