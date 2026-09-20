import os

BG_DIR = "/root/Projects/liminal-resonance-vn/public/assets/backgrounds"
CHAR_DIR = "/root/Projects/liminal-resonance-vn/public/assets/characters"

def make_bg(filename, svg_content):
    path = os.path.join(BG_DIR, filename)
    with open(path, "w", encoding="utf-8") as f:
        f.write(svg_content.strip())
    print(f"Generated {path}")

def make_char(filename, svg_content):
    path = os.path.join(CHAR_DIR, filename)
    with open(path, "w", encoding="utf-8") as f:
        f.write(svg_content.strip())
    print(f"Generated {path}")

# ==========================================
# BACKGROUNDS
# ==========================================

make_bg("archive_sublevel.svg", """
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1920 1080" width="100%" height="100%">
  <defs>
    <linearGradient id="wall" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#0a0c10"/>
      <stop offset="60%" stop-color="#12161f"/>
      <stop offset="100%" stop-color="#07090c"/>
    </linearGradient>
    <radialGradient id="lamp" cx="0.5" cy="0.4" r="0.6">
      <stop offset="0%" stop-color="#ffb74d" stop-opacity="0.35"/>
      <stop offset="40%" stop-color="#e65100" stop-opacity="0.15"/>
      <stop offset="100%" stop-color="#000000" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="floor" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#11141a"/>
      <stop offset="100%" stop-color="#050608"/>
    </linearGradient>
    <filter id="noise">
      <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" result="noise"/>
      <feColorMatrix type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 0.08 0"/>
      <feComposite in2="SourceGraphic" in="glitch" operator="in"/>
    </filter>
  </defs>
  <!-- Background Wall -->
  <rect width="1920" height="720" fill="url(#wall)"/>
  <!-- Exposed Overhead Pipes -->
  <path d="M 0 60 L 1920 60 M 0 110 L 1920 110 M 0 140 L 1920 140" stroke="#222834" stroke-width="24" fill="none"/>
  <path d="M 400 60 L 400 300 M 1400 110 L 1400 350" stroke="#1b202a" stroke-width="18" fill="none"/>
  <!-- Metal Storage Racks -->
  <g stroke="#1a202c" stroke-width="4" fill="#0d1117">
    <rect x="120" y="160" width="340" height="560"/>
    <line x1="120" y1="280" x2="460" y2="280"/>
    <line x1="120" y1="420" x2="460" y2="420"/>
    <line x1="120" y1="560" x2="460" y2="560"/>
    <!-- Boxes on shelves -->
    <rect x="140" y="210" width="80" height="60" fill="#2d3748" stroke="#4a5568"/>
    <rect x="235" y="200" width="90" height="70" fill="#1a202c" stroke="#4a5568"/>
    <rect x="150" y="340" width="120" height="70" fill="#2d3748" stroke="#4a5568"/>
    <rect x="290" y="330" width="140" height="80" fill="#1a202c" stroke="#4a5568"/>
  </g>
  <!-- Floor -->
  <polygon points="0,720 1920,720 1920,1080 0,1080" fill="url(#floor)"/>
  <line x1="0" y1="720" x2="1920" y2="720" stroke="#333f52" stroke-width="3"/>
  <!-- Central Workbench -->
  <polygon points="560,580 1360,580 1480,880 440,880" fill="#161c24" stroke="#2d3748" stroke-width="4"/>
  <rect x="480" y="880" width="60" height="200" fill="#0f1318"/>
  <rect x="1380" y="880" width="60" height="200" fill="#0f1318"/>
  <!-- Reel to Reel Deck Silhouette -->
  <rect x="740" y="440" width="440" height="340" rx="12" fill="#1f2937" stroke="#4b5563" stroke-width="6"/>
  <circle cx="850" cy="560" r="75" fill="#111827" stroke="#9ca3af" stroke-width="6"/>
  <circle cx="850" cy="560" r="24" fill="#4b5563"/>
  <circle cx="1070" cy="560" r="75" fill="#111827" stroke="#9ca3af" stroke-width="6"/>
  <circle cx="1070" cy="560" r="24" fill="#4b5563"/>
  <!-- Glowing VU Meters -->
  <rect x="880" y="690" width="70" height="45" rx="4" fill="#2e1a06" stroke="#d97706" stroke-width="2"/>
  <line x1="900" y1="725" x2="935" y2="700" stroke="#f59e0b" stroke-width="3"/>
  <rect x="970" y="690" width="70" height="45" rx="4" fill="#2e1a06" stroke="#d97706" stroke-width="2"/>
  <line x1="990" y1="725" x2="1015" y2="700" stroke="#f59e0b" stroke-width="3"/>
  <!-- Ambient Lamp Glow -->
  <rect width="1920" height="1080" fill="url(#lamp)" pointer-events="none"/>
</svg>
""")

make_bg("tape_deck_closeup.svg", """
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1920 1080" width="100%" height="100%">
  <defs>
    <linearGradient id="chassis" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#2a303c"/>
      <stop offset="50%" stop-color="#181c24"/>
      <stop offset="100%" stop-color="#0e1015"/>
    </linearGradient>
    <radialGradient id="spool" cx="0.5" cy="0.5" r="0.5">
      <stop offset="0%" stop-color="#374151"/>
      <stop offset="70%" stop-color="#1f2937"/>
      <stop offset="100%" stop-color="#111827"/>
    </radialGradient>
    <radialGradient id="vu_glow" cx="0.5" cy="0.5" r="0.5">
      <stop offset="0%" stop-color="#fbbf24" stop-opacity="0.9"/>
      <stop offset="70%" stop-color="#b45309" stop-opacity="0.6"/>
      <stop offset="100%" stop-color="#451a03" stop-opacity="0.9"/>
    </radialGradient>
  </defs>
  <!-- Main Deck Faceplate -->
  <rect width="1920" height="1080" fill="url(#chassis)"/>
  <!-- Brushed metal bezel panel -->
  <rect x="140" y="80" width="1640" height="920" rx="20" fill="#13171f" stroke="#374151" stroke-width="8"/>
  <!-- Left Reel Spool -->
  <g transform="translate(540, 420)">
    <circle cx="0" cy="0" r="260" fill="url(#spool)" stroke="#6b7280" stroke-width="12"/>
    <circle cx="0" cy="0" r="210" fill="#0f131a" stroke="#4b5563" stroke-width="4"/>
    <!-- Reel Cutouts -->
    <circle cx="0" cy="-120" r="45" fill="#1f2937" stroke="#374151" stroke-width="4"/>
    <circle cx="104" cy="60" r="45" fill="#1f2937" stroke="#374151" stroke-width="4"/>
    <circle cx="-104" cy="60" r="45" fill="#1f2937" stroke="#374151" stroke-width="4"/>
    <!-- Center Spindle -->
    <circle cx="0" cy="0" r="60" fill="#9ca3af" stroke="#d1d5db" stroke-width="6"/>
    <circle cx="0" cy="0" r="20" fill="#111827"/>
  </g>
  <!-- Right Takeup Spool -->
  <g transform="translate(1380, 420)">
    <circle cx="0" cy="0" r="260" fill="url(#spool)" stroke="#6b7280" stroke-width="12"/>
    <circle cx="0" cy="0" r="140" fill="#0f131a" stroke="#4b5563" stroke-width="4"/>
    <!-- Reel Cutouts -->
    <circle cx="0" cy="-120" r="45" fill="#1f2937" stroke="#374151" stroke-width="4"/>
    <circle cx="104" cy="60" r="45" fill="#1f2937" stroke="#374151" stroke-width="4"/>
    <circle cx="-104" cy="60" r="45" fill="#1f2937" stroke="#374151" stroke-width="4"/>
    <!-- Center Spindle -->
    <circle cx="0" cy="0" r="60" fill="#9ca3af" stroke="#d1d5db" stroke-width="6"/>
    <circle cx="0" cy="0" r="20" fill="#111827"/>
  </g>
  <!-- Magnetic Tape Path -->
  <path d="M 540 680 Q 720 740 840 730 L 1080 730 Q 1200 740 1380 680" stroke="#3e2723" stroke-width="18" fill="none"/>
  <!-- Head Block Housing -->
  <rect x="800" y="690" width="320" height="150" rx="8" fill="#1f2937" stroke="#4b5563" stroke-width="4"/>
  <rect x="830" y="720" width="50" height="60" fill="#6b7280" stroke="#9ca3af" stroke-width="2"/>
  <rect x="935" y="715" width="50" height="70" fill="#9ca3af" stroke="#e5e7eb" stroke-width="2"/>
  <rect x="1040" y="720" width="50" height="60" fill="#6b7280" stroke="#9ca3af" stroke-width="2"/>
  <text x="960" y="820" fill="#9ca3af" font-family="'IBM Plex Mono', monospace" font-size="16" text-anchor="middle" letter-spacing="3">ST. JUDE SOMNOLOGY DECK IV</text>
  <!-- Glowing Dual Analog VU Meters -->
  <g transform="translate(420, 780)">
    <rect x="0" y="0" width="260" height="150" rx="8" fill="url(#vu_glow)" stroke="#f59e0b" stroke-width="4"/>
    <path d="M 30 110 A 100 100 0 0 1 230 110" stroke="#78350f" stroke-width="3" fill="none"/>
    <line x1="130" y1="140" x2="190" y2="40" stroke="#b91c1c" stroke-width="4"/>
    <text x="130" y="130" fill="#78350f" font-family="monospace" font-size="14" text-anchor="middle" font-weight="bold">VU - CH A</text>
  </g>
  <g transform="translate(1240, 780)">
    <rect x="0" y="0" width="260" height="150" rx="8" fill="url(#vu_glow)" stroke="#f59e0b" stroke-width="4"/>
    <path d="M 30 110 A 100 100 0 0 1 230 110" stroke="#78350f" stroke-width="3" fill="none"/>
    <line x1="130" y1="140" x2="160" y2="40" stroke="#b91c1c" stroke-width="4"/>
    <text x="130" y="130" fill="#78350f" font-family="monospace" font-size="14" text-anchor="middle" font-weight="bold">VU - CH B</text>
  </g>
</svg>
""")

make_bg("isolation_chamber.svg", """
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1920 1080" width="100%" height="100%">
  <defs>
    <radialGradient id="spotlight" cx="0.5" cy="0.4" r="0.5">
      <stop offset="0%" stop-color="#fef08a" stop-opacity="0.4"/>
      <stop offset="40%" stop-color="#ca8a04" stop-opacity="0.15"/>
      <stop offset="100%" stop-color="#000000" stop-opacity="0"/>
    </radialGradient>
    <pattern id="wedges" width="60" height="60" patternUnits="userSpaceOnUse">
      <polygon points="0,0 30,60 60,0" fill="#0f1219" stroke="#05070a" stroke-width="2"/>
      <polygon points="30,60 60,0 60,60" fill="#181d28" stroke="#05070a" stroke-width="2"/>
      <polygon points="0,0 0,60 30,60" fill="#131722" stroke="#05070a" stroke-width="2"/>
    </pattern>
  </defs>
  <!-- Anechoic Acoustic Wedge Walls -->
  <rect width="1920" height="1080" fill="url(#wedges)"/>
  <!-- Floor Grid -->
  <polygon points="200,850 1720,850 1920,1080 0,1080" fill="#07090e" stroke="#1e293b" stroke-width="3"/>
  <!-- Suspended Vintage Condenser Microphone -->
  <g transform="translate(960, 480)">
    <line x1="0" y1="-480" x2="0" y2="0" stroke="#475569" stroke-width="6"/>
    <!-- Shockmount ring -->
    <circle cx="0" cy="60" r="45" fill="none" stroke="#94a3b8" stroke-width="6"/>
    <circle cx="0" cy="60" r="32" fill="#0f172a" stroke="#cbd5e1" stroke-width="4"/>
    <!-- Mic capsule -->
    <rect x="-18" y="25" width="36" height="70" rx="8" fill="#334155" stroke="#f1f5f9" stroke-width="3"/>
    <!-- Cable dropping down -->
    <path d="M 0 100 Q 40 300 120 450" stroke="#0f172a" stroke-width="8" fill="none"/>
  </g>
  <!-- Spotlight Cone -->
  <polygon points="960,0 520,1080 1400,1080" fill="url(#spotlight)"/>
</svg>
""")

make_bg("static_hallway.svg", """
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1920 1080" width="100%" height="100%">
  <defs>
    <linearGradient id="hallway_fade" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#0a120e"/>
      <stop offset="100%" stop-color="#030504"/>
    </linearGradient>
  </defs>
  <rect width="1920" height="1080" fill="url(#hallway_fade)"/>
  <!-- Perspective Corridor Lines -->
  <!-- Ceiling -->
  <polygon points="0,0 1920,0 1180,440 740,440" fill="#0d1f17" stroke="#134e4a" stroke-width="2"/>
  <!-- Left Wall -->
  <polygon points="0,0 740,440 740,780 0,1080" fill="#061c14" stroke="#042f2e" stroke-width="3"/>
  <!-- Right Wall -->
  <polygon points="1920,0 1180,440 1180,780 1920,1080" fill="#061c14" stroke="#042f2e" stroke-width="3"/>
  <!-- Floor -->
  <polygon points="0,1080 740,780 1180,780 1920,1080" fill="#04120d" stroke="#0f766e" stroke-width="4"/>
  <!-- Distant Bulkhead Door -->
  <rect x="780" y="480" width="360" height="300" rx="8" fill="#020806" stroke="#14b8a6" stroke-width="6"/>
  <rect x="880" y="520" width="160" height="90" fill="#134e4a" stroke="#2dd4bf" stroke-width="3"/>
  <text x="960" y="575" fill="#a7f3d0" font-family="'IBM Plex Mono', monospace" font-size="20" text-anchor="middle" font-weight="bold" letter-spacing="4">SECTOR 04</text>
  <!-- Overhead Flickering Fluorescent Tube -->
  <line x1="880" y1="120" x2="1040" y2="120" stroke="#a7f3d0" stroke-width="12"/>
  <line x1="880" y1="120" x2="1040" y2="120" stroke="#ffffff" stroke-width="4"/>
</svg>
""")

make_bg("corrupted_void.svg", """
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1920 1080" width="100%" height="100%">
  <defs>
    <radialGradient id="core_abyss" cx="0.5" cy="0.5" r="0.6">
      <stop offset="0%" stop-color="#450a0a"/>
      <stop offset="40%" stop-color="#180404"/>
      <stop offset="100%" stop-color="#000000"/>
    </radialGradient>
  </defs>
  <rect width="1920" height="1080" fill="url(#core_abyss)"/>
  <!-- Lissajous Oscilloscope Curves -->
  <g stroke="#ef4444" stroke-width="3" fill="none" opacity="0.65">
    <path d="M 300 540 Q 600 200 960 540 T 1620 540 Q 1300 900 960 540 T 300 540"/>
    <circle cx="960" cy="540" r="320" stroke="#06b6d4" stroke-width="2" stroke-dasharray="16, 12"/>
    <circle cx="960" cy="540" r="480" stroke="#f43f5e" stroke-width="3" stroke-dasharray="24, 8"/>
    <circle cx="960" cy="540" r="140" stroke="#fbbf24" stroke-width="4"/>
  </g>
</svg>
""")

make_bg("lucid_dawn.svg", """
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1920 1080" width="100%" height="100%">
  <defs>
    <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#0284c7"/>
      <stop offset="50%" stop-color="#bae6fd"/>
      <stop offset="80%" stop-color="#ffedd5"/>
      <stop offset="100%" stop-color="#fef3c7"/>
    </linearGradient>
  </defs>
  <!-- Dawn Sky -->
  <rect width="1920" height="1080" fill="url(#sky)"/>
  <!-- Pine Tree Silhouettes in Mist -->
  <path d="M 0 1080 L 0 720 L 120 540 L 240 760 L 380 480 L 520 800 L 700 420 L 880 790 L 1100 510 L 1320 820 L 1540 460 L 1760 840 L 1920 600 L 1920 1080 Z" fill="#0f172a" opacity="0.85"/>
  <!-- Open Heavy Bulkhead Door Frame in foreground -->
  <polygon points="0,0 480,0 280,1080 0,1080" fill="#020617"/>
  <polygon points="1920,0 1440,0 1640,1080 1920,1080" fill="#020617"/>
  <rect x="0" y="0" width="1920" height="180" fill="#020617"/>
</svg>
""")

make_bg("severed_darkness.svg", """
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1920 1080" width="100%" height="100%">
  <rect width="1920" height="1080" fill="#000000"/>
  <!-- CRT Scanline Noise -->
  <line x1="0" y1="320" x2="1920" y2="320" stroke="#38bdf8" stroke-width="4" opacity="0.8"/>
  <line x1="0" y1="740" x2="1920" y2="740" stroke="#f43f5e" stroke-width="3" opacity="0.6"/>
  <line x1="0" y1="540" x2="1920" y2="540" stroke="#ffffff" stroke-width="8" opacity="0.9"/>
</svg>
""")

# ==========================================
# CHARACTERS
# ==========================================

# Isaac Vance Generator
def make_isaac(exp, mouth_d, eye_l, eye_r, filter_fx=""):
    return f"""
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 1000" width="100%" height="100%">
  <g {filter_fx}>
    <!-- Lab Coat & Shoulders -->
    <path d="M 220 1000 L 260 520 L 360 480 L 440 480 L 540 520 L 580 1000 Z" fill="#1e293b" stroke="#475569" stroke-width="6"/>
    <path d="M 330 480 L 400 680 L 470 480 Z" fill="#0f172a" stroke="#334155" stroke-width="4"/>
    <!-- Neck -->
    <rect x="360" y="400" width="80" height="100" fill="#d4a373" stroke="#a9714b" stroke-width="4"/>
    <!-- Head & Jaw -->
    <polygon points="320,240 480,240 460,420 400,460 340,420" fill="#e0a96d" stroke="#a9714b" stroke-width="6"/>
    <!-- Disheveled Hair -->
    <path d="M 300 240 Q 400 120 500 240 Q 440 180 380 200 Q 320 180 300 240" fill="#1c1917" stroke="#44403c" stroke-width="6"/>
    <!-- Glasses -->
    <rect x="330" y="290" width="60" height="40" rx="6" fill="#38bdf8" fill-opacity="0.25" stroke="#94a3b8" stroke-width="4"/>
    <rect x="410" y="290" width="60" height="40" rx="6" fill="#38bdf8" fill-opacity="0.25" stroke="#94a3b8" stroke-width="4"/>
    <line x1="390" y1="310" x2="410" y2="310" stroke="#94a3b8" stroke-width="4"/>
    <!-- Eyes -->
    <circle cx="360" cy="310" r="{eye_l}" fill="#0f172a"/>
    <circle cx="440" cy="310" r="{eye_r}" fill="#0f172a"/>
    <!-- Mouth -->
    <path d="{mouth_d}" stroke="#78350f" stroke-width="5" fill="none" stroke-linecap="round"/>
  </g>
</svg>
"""

make_char("isaac_neutral.svg", make_isaac("neutral", "M 375 390 L 425 390", 6, 6))
make_char("isaac_focused.svg", make_isaac("focused", "M 380 395 L 420 395", 5, 5))
make_char("isaac_uneasy.svg", make_isaac("uneasy", "M 370 400 Q 400 390 430 400", 7, 7))
make_char("isaac_paranoid.svg", make_isaac("paranoid", "M 370 405 Q 400 385 430 405", 9, 9))
make_char("isaac_terrified.svg", make_isaac("terrified", "M 370 385 Q 400 425 430 385", 12, 12))
make_char("isaac_distorted.svg", make_isaac("distorted", "M 360 410 Q 400 360 440 410", 14, 8, 'style="filter: drop-shadow(4px 4px 0px #ef4444) drop-shadow(-4px -4px 0px #06b6d4);"'))

# Dr. Elena Mercer Generator
def make_mercer(exp, mouth_d, eye_l, eye_r, filter_fx=""):
    return f"""
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 1000" width="100%" height="100%">
  <g {filter_fx}>
    <!-- Vintage 1987 Blouse & Cardigan -->
    <path d="M 230 1000 L 270 540 L 370 500 L 430 500 L 530 540 L 570 1000 Z" fill="#334155" stroke="#64748b" stroke-width="6"/>
    <path d="M 340 500 L 400 660 L 460 500 Z" fill="#f8fafc" stroke="#cbd5e1" stroke-width="4"/>
    <!-- Neck -->
    <rect x="365" y="420" width="70" height="90" fill="#e2b192" stroke="#b07253" stroke-width="4"/>
    <!-- Face -->
    <polygon points="330,260 470,260 450,430 400,465 350,430" fill="#ecc4a8" stroke="#b07253" stroke-width="6"/>
    <!-- 80s Bob Haircut -->
    <path d="M 290 280 Q 400 140 510 280 L 520 440 L 470 410 L 400 370 L 330 410 L 280 440 Z" fill="#451a03" stroke="#78350f" stroke-width="6"/>
    <!-- Eyes -->
    <circle cx="365" cy="320" r="{eye_l}" fill="#1e1b4b"/>
    <circle cx="435" cy="320" r="{eye_r}" fill="#1e1b4b"/>
    <!-- Eyebrows -->
    <line x1="345" y1="300" x2="385" y2="305" stroke="#78350f" stroke-width="4"/>
    <line x1="415" y1="305" x2="455" y2="300" stroke="#78350f" stroke-width="4"/>
    <!-- Mouth -->
    <path d="{mouth_d}" stroke="#991b1b" stroke-width="5" fill="none" stroke-linecap="round"/>
  </g>
</svg>
"""

make_char("mercer_neutral.svg", make_mercer("neutral", "M 380 395 L 420 395", 6, 6))
make_char("mercer_focused.svg", make_mercer("focused", "M 380 400 L 420 400", 5, 5))
make_char("mercer_detached.svg", make_mercer("detached", "M 375 395 Q 400 390 425 395", 8, 8))
make_char("mercer_unnatural_smile.svg", make_mercer("unnatural_smile", "M 350 380 Q 400 435 450 380", 11, 11, 'style="filter: drop-shadow(6px 0px 0px #ef4444) drop-shadow(-6px 0px 0px #10b981);"'))

# Supervisor Arthur Cole Generator
def make_cole(exp, mouth_d, eye_l, eye_r):
    return f"""
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 1000" width="100%" height="100%">
  <!-- Security / Administrative Suit -->
  <path d="M 210 1000 L 250 510 L 350 470 L 450 470 L 550 510 L 590 1000 Z" fill="#0f172a" stroke="#334155" stroke-width="6"/>
  <polygon points="370,470 400,600 430,470" fill="#991b1b" stroke="#7f1d1d" stroke-width="3"/>
  <!-- Neck -->
  <rect x="360" y="390" width="80" height="90" fill="#d4a373" stroke="#a9714b" stroke-width="4"/>
  <!-- Angular Square Jaw -->
  <polygon points="320,230 480,230 470,410 400,450 330,410" fill="#dfad80" stroke="#a9714b" stroke-width="6"/>
  <!-- Slicked Back Grey Hair -->
  <path d="M 310 230 Q 400 130 490 230 L 490 270 L 310 270 Z" fill="#64748b" stroke="#475569" stroke-width="6"/>
  <!-- Eyes -->
  <circle cx="360" cy="300" r="{eye_l}" fill="#0f172a"/>
  <circle cx="440" cy="300" r="{eye_r}" fill="#0f172a"/>
  <!-- Stern Eyebrows -->
  <line x1="340" y1="285" x2="380" y2="295" stroke="#334155" stroke-width="5"/>
  <line x1="420" y1="295" x2="460" y2="285" stroke="#334155" stroke-width="5"/>
  <!-- Mouth -->
  <path d="{mouth_d}" stroke="#78350f" stroke-width="6" fill="none" stroke-linecap="round"/>
</svg>
"""

make_char("cole_neutral.svg", make_cole("neutral", "M 370 380 L 430 380", 5, 5))
make_char("cole_focused.svg", make_cole("focused", "M 375 385 L 425 385", 4, 4))
make_char("cole_paranoid.svg", make_cole("paranoid", "M 365 390 Q 400 370 435 390", 8, 8))

print("Asset generation complete!")
