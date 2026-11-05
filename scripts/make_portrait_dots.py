"""Turn a background-removed portrait (RGBA PNG) into the particle data the hero uses.

The site never ships the photo itself, only these dots.
Usage: python3 scripts/make_portrait_dots.py cutout.png src/assets/portrait-dots.json
(Make the cutout first, e.g. with `rembg` using the u2net_human_seg model.)
"""
import json
import sys
from collections import deque

import numpy as np
from PIL import Image, ImageFilter, ImageOps

SRC, OUT = sys.argv[1], sys.argv[2]
STEP = 7            # grid spacing in source pixels (smaller = more dots)
MIN_R, MAX_R = 0.35, 3.6

im = Image.open(SRC).convert("RGBA")
w, h = im.size
alpha = np.array(im.getchannel("A")) > 140

# keep only the largest connected region of the mask (drops stray fragments)
lab = np.zeros(alpha.shape, dtype=np.int32)
best, best_n, cur = 0, 0, 0
for y0, x0 in zip(*np.nonzero(alpha)):
    if lab[y0, x0]:
        continue
    cur += 1
    q, n = deque([(y0, x0)]), 0
    lab[y0, x0] = cur
    while q:
        y, x = q.popleft(); n += 1
        for dy, dx in ((1, 0), (-1, 0), (0, 1), (0, -1)):
            yy, xx = y + dy, x + dx
            if 0 <= yy < h and 0 <= xx < w and alpha[yy, xx] and not lab[yy, xx]:
                lab[yy, xx] = cur; q.append((yy, xx))
    if n > best_n:
        best, best_n = cur, n
mask = lab == best

# luminance with local contrast so eyes, brows and beard read clearly
rgb = Image.new("RGB", im.size, (0, 0, 0)); rgb.paste(im, mask=im.getchannel("A"))
g = ImageOps.grayscale(rgb)
# local contrast: equalize, then sharpen features
g = ImageOps.autocontrast(g, cutoff=1, mask=Image.fromarray((mask * 255).astype(np.uint8)))
g = g.filter(ImageFilter.UnsharpMask(radius=3, percent=260, threshold=1))
lum = np.array(g).astype(np.float32) / 255.0
vals = lum[mask]
lo, hi = np.percentile(vals, 3), np.percentile(vals, 99)
lum = np.clip((lum - lo) / (hi - lo + 1e-6), 0, 1)

# rim light: dots near the silhouette edge glow a little, so dark hair/suit keep their outline
mimg = Image.fromarray((mask * 255).astype(np.uint8))
inner = np.array(mimg.filter(ImageFilter.MinFilter(15))) > 0
rim = mask & ~inner

dots = []
for row, y in enumerate(range(STEP // 2, h, STEP)):
    off = STEP // 2 if row % 2 else 0
    for x in range(STEP // 2 + off, w, STEP):
        if not mask[y, x]:
            continue
        patch = lum[max(0, y - 1):y + 2, max(0, x - 1):x + 2]
        v = max(0.13, float(patch.mean()) ** 1.25)
        if rim[y, x]:
            v = min(1.0, v + 0.35)
        r = MIN_R + (MAX_R - MIN_R) * v
        dots.append([round(x / w * 1000), round(y / h * 1000), round(r / w * 1000, 1), round(0.35 + 0.65 * v, 2)])

json.dump({"w": 1000, "h": round(h / w * 1000), "dots": dots}, open(OUT, "w"), separators=(",", ":"))
print(len(dots), "dots")
