from PIL import Image, ImageFilter, ImageEnhance
import os
import numpy as np

CHAR_DIR = "/root/Projects/liminal-resonance-vn/public/assets/characters"

def process_character_sprite(char_name):
    jpg_path = os.path.join(CHAR_DIR, f"{char_name}.jpg")
    png_path = os.path.join(CHAR_DIR, f"{char_name}.png")
    
    if not os.path.exists(jpg_path):
        print(f"File not found: {jpg_path}")
        return

    img = Image.open(jpg_path).convert("RGBA")
    w, h = img.size
    
    # 1. Create a soft vertical gradient alpha mask for natural bottom fade
    # Top 0-65% full opacity, bottom 65-100% smooth quadratic fade to transparent
    alpha_mask = np.ones((h, w), dtype=np.float32)
    fade_start = int(h * 0.60)
    for y in range(fade_start, h):
        progress = (y - fade_start) / (h - fade_start)
        # Smooth cosine/quadratic falloff
        alpha_mask[y, :] = (1.0 - progress) ** 1.5

    # 2. Soft radial vignette on outer left/right edges so sprite blends into darkness
    x_coords = np.linspace(-1, 1, w)
    edge_falloff = 1.0 - np.clip((np.abs(x_coords) - 0.7) / 0.3, 0, 1) ** 2
    alpha_mask *= edge_falloff[np.newaxis, :]

    # Convert to 8-bit alpha channel
    alpha_channel = (np.clip(alpha_mask, 0, 1) * 255).astype(np.uint8)
    alpha_img = Image.fromarray(alpha_channel, mode='L')

    img.putalpha(alpha_img)
    img.save(png_path, "PNG")
    print(f"Processed immersive sprite: {png_path} ({w}x{h})")

for c in ["isaac", "mercer", "cole"]:
    process_character_sprite(c)
