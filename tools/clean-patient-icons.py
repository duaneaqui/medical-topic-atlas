from pathlib import Path
from collections import deque
from PIL import Image

icon_dir = Path(__file__).resolve().parents[1] / "public" / "assets" / "patient-icons"


def color_distance(a, b):
    return abs(a[0] - b[0]) + abs(a[1] - b[1]) + abs(a[2] - b[2])


def knock_out_background(path: Path, tolerance: int = 42) -> None:
    img = Image.open(path).convert("RGBA")
    pixels = img.load()
    w, h = img.size

    # Sample corner colors; remove matching background via flood fill.
    seeds = [(0, 0), (w - 1, 0), (0, h - 1), (w - 1, h - 1), (w // 2, 0), (w // 2, h - 1), (0, h // 2), (w - 1, h // 2)]
    visited = [[False] * w for _ in range(h)]
    queue = deque()

    for sx, sy in seeds:
        r, g, b, a = pixels[sx, sy]
        # Only treat pale or very dark corners as background candidates.
        brightness = (r + g + b) / 3
        chroma = max(r, g, b) - min(r, g, b)
        if not ((brightness >= 190 and chroma <= 45) or (brightness <= 45 and chroma <= 35) or a < 20):
            continue
        if not visited[sy][sx]:
            visited[sy][sx] = True
            queue.append((sx, sy, (r, g, b)))

    while queue:
        x, y, target = queue.popleft()
        r, g, b, a = pixels[x, y]
        if color_distance((r, g, b), target) > tolerance and a >= 20:
            continue
        pixels[x, y] = (r, g, b, 0)
        for nx, ny in ((x + 1, y), (x - 1, y), (x, y + 1), (x, y - 1)):
            if 0 <= nx < w and 0 <= ny < h and not visited[ny][nx]:
                visited[ny][nx] = True
                nr, ng, nb, na = pixels[nx, ny]
                if color_distance((nr, ng, nb), target) <= tolerance or na < 20:
                    queue.append((nx, ny, target))

    # Second pass: strip residual near-white / near-black fringe.
    for y in range(h):
        for x in range(w):
            r, g, b, a = pixels[x, y]
            if a == 0:
                continue
            brightness = (r + g + b) / 3
            chroma = max(r, g, b) - min(r, g, b)
            if brightness >= 205 and chroma <= 35:
                pixels[x, y] = (r, g, b, 0)
            elif brightness <= 28 and chroma <= 25:
                pixels[x, y] = (r, g, b, 0)

    img.save(path, optimize=True)
    print(f"cleaned {path.name}")


for path in sorted(icon_dir.glob("*.png")):
    knock_out_background(path)
