"""Remove the flat green (#00FF00-ish) background from character art and write a transparent PNG.

Usage: python tools/chroma.py assets/potato.jpg [more files...]
Writes assets/<name>.png next to each input. Needs Pillow.
"""
import sys
from collections import deque
from pathlib import Path
from PIL import Image

def greenness(r, g, b):
    return g - max(r, b)

def drop_specks(im):
    """Remove tiny disconnected blobs (leftover thumbs, noise) so they can't stretch the crop box."""
    w, h = im.size
    px = im.load()
    seen = [[0] * w for _ in range(h)]
    comps = []
    for sy in range(h):
        for sx in range(w):
            if px[sx, sy][3] and not seen[sy][sx]:
                seen[sy][sx] = 1; q = deque([(sx, sy)]); cells = []
                while q:
                    x, y = q.popleft(); cells.append((x, y))
                    for dx in (-1, 0, 1):
                        for dy in (-1, 0, 1):
                            nx, ny = x + dx, y + dy
                            if 0 <= nx < w and 0 <= ny < h and px[nx, ny][3] and not seen[ny][nx]:
                                seen[ny][nx] = 1; q.append((nx, ny))
                comps.append(cells)
    if comps:
        big = max(len(c) for c in comps)
        for c in comps:
            if len(c) < big * 0.02:
                for x, y in c: px[x, y] = (0, 0, 0, 0)
    return im

def key(path):
    im = Image.open(path).convert('RGBA')
    w, h = im.size
    px = im.load()
    # Flood-fill from the border so green inside the character is never touched.
    bg = [[False] * w for _ in range(h)]
    q = deque()
    def is_bg(x, y):
        r, g, b, _ = px[x, y]
        return greenness(r, g, b) > 60
    for x in range(w):
        for y in (0, h - 1):
            if is_bg(x, y) and not bg[y][x]: bg[y][x] = True; q.append((x, y))
    for y in range(h):
        for x in (0, w - 1):
            if is_bg(x, y) and not bg[y][x]: bg[y][x] = True; q.append((x, y))
    while q:
        x, y = q.popleft()
        for nx, ny in ((x + 1, y), (x - 1, y), (x, y + 1), (x, y - 1)):
            if 0 <= nx < w and 0 <= ny < h and not bg[ny][nx] and is_bg(nx, ny):
                bg[ny][nx] = True; q.append((nx, ny))
    for y in range(h):
        for x in range(w):
            r, g, b, _ = px[x, y]
            if bg[y][x]:
                px[x, y] = (r, g, b, 0)
            else:
                # Edge pixels touching the background: soften and remove green spill.
                near = any(0 <= x + dx < w and 0 <= y + dy < h and bg[y + dy][x + dx]
                           for dx in (-1, 0, 1) for dy in (-1, 0, 1))
                if near and greenness(r, g, b) > 10:
                    g = max(r, b)
                    px[x, y] = (r, g, b, 255)
    im = drop_specks(im)
    box = im.getbbox()
    if box: im = im.crop(box)
    out = Path(path).with_suffix('.png')
    im.save(out)
    print(out, im.size)

if __name__ == '__main__':
    for p in sys.argv[1:]:
        key(p)
