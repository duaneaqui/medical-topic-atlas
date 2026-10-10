"""Generate a themed Medical Topic Atlas APNG favicon."""

from __future__ import annotations

import math
from pathlib import Path

from PIL import Image, ImageDraw, ImageFilter

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "public" / "assets" / "atlas-icon.png"
SIZE = 256
FRAMES = 48
DURATION_MS = 70


def clamp(value, low=0, high=255):
    return max(low, min(high, int(value)))


def mix(a, b, t):
    return tuple(clamp(a[i] + (b[i] - a[i]) * t) for i in range(4))


def draw_frame(progress: float) -> Image.Image:
    img = Image.new("RGBA", (SIZE, SIZE), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    cx = cy = SIZE / 2
    radius = SIZE * 0.46

    # Soft outer glow disc
    for i in range(8, 0, -1):
        alpha = 10 + i * 4
        glow = radius + i * 2.2
        draw.ellipse(
            [cx - glow, cy - glow, cx + glow, cy + glow],
            fill=(14, 120, 170, alpha),
        )

    # Main badge
    draw.ellipse(
        [cx - radius, cy - radius, cx + radius, cy + radius],
        fill=(8, 14, 22, 255),
        outline=(88, 214, 255, 210),
        width=4,
    )
    draw.ellipse(
        [cx - radius + 8, cy - radius + 8, cx + radius - 8, cy + radius - 8],
        outline=(40, 78, 104, 180),
        width=2,
    )

    # Inner HUD grid arcs
    for ring in (0.72, 0.52, 0.34):
        r = radius * ring
        draw.ellipse(
            [cx - r, cy - r, cx + r, cy + r],
            outline=(72, 188, 230, 55),
            width=1,
        )

    # Anatomical atlas silhouette (simplified torso + head)
    body_color = (186, 236, 255, 230)
    head_r = radius * 0.13
    draw.ellipse(
        [cx - head_r, cy - radius * 0.58, cx + head_r, cy - radius * 0.58 + head_r * 2],
        fill=body_color,
    )
    # Torso
    torso = [
        (cx - radius * 0.18, cy - radius * 0.32),
        (cx + radius * 0.18, cy - radius * 0.32),
        (cx + radius * 0.24, cy + radius * 0.08),
        (cx + radius * 0.14, cy + radius * 0.42),
        (cx - radius * 0.14, cy + radius * 0.42),
        (cx - radius * 0.24, cy + radius * 0.08),
    ]
    draw.polygon(torso, fill=body_color)
    # Arms
    draw.line(
        [(cx - radius * 0.2, cy - radius * 0.22), (cx - radius * 0.42, cy + radius * 0.02)],
        fill=body_color,
        width=10,
    )
    draw.line(
        [(cx + radius * 0.2, cy - radius * 0.22), (cx + radius * 0.42, cy + radius * 0.02)],
        fill=body_color,
        width=10,
    )

    # System nodes on body
    nodes = [
        (cx, cy - radius * 0.46),  # head
        (cx - radius * 0.08, cy - radius * 0.14),  # heart-ish
        (cx + radius * 0.07, cy - radius * 0.02),  # lung-ish
        (cx, cy + radius * 0.16),  # abdomen
    ]
    pulse = 0.5 + 0.5 * math.sin(progress * math.pi * 2)
    for nx, ny in nodes:
        pr = 3.2 + pulse * 1.8
        draw.ellipse([nx - pr, ny - pr, nx + pr, ny + pr], fill=(255, 214, 110, 230))
        draw.ellipse(
            [nx - pr * 2.2, ny - pr * 2.2, nx + pr * 2.2, ny + pr * 2.2],
            outline=(255, 214, 110, 70),
            width=1,
        )

    # Rotating orbital scan ring
    angle = progress * math.pi * 2
    orbit_r = radius * 0.78
    for trail in range(10):
        t = angle - trail * 0.12
        tx = cx + math.cos(t) * orbit_r
        ty = cy + math.sin(t) * orbit_r
        alpha = 210 - trail * 18
        size = 5.5 - trail * 0.28
        draw.ellipse(
            [tx - size, ty - size, tx + size, ty + size],
            fill=(90, 230, 255, clamp(alpha)),
        )

    # Rotating dashed arc
    for i in range(18):
        a0 = angle + i * (math.pi * 2 / 18)
        a1 = a0 + 0.14
        if i % 2:
            continue
        pts = []
        for step in range(6):
            a = a0 + (a1 - a0) * (step / 5)
            pts.append(
                (
                    cx + math.cos(a) * orbit_r,
                    cy + math.sin(a) * orbit_r,
                )
            )
        if len(pts) > 1:
            draw.line(pts, fill=(120, 244, 255, 150), width=2)

    # Soft scan sweep
    sweep = Image.new("RGBA", (SIZE, SIZE), (0, 0, 0, 0))
    sweep_draw = ImageDraw.Draw(sweep)
    sweep_angle = angle
    for i in range(14):
        a = sweep_angle - i * 0.045
        x = cx + math.cos(a) * radius * 0.9
        y = cy + math.sin(a) * radius * 0.9
        sweep_draw.line([(cx, cy), (x, y)], fill=(90, 220, 255, 8), width=10)
    img = Image.alpha_composite(img, sweep)

    # Vignette clip to circle for crisp favicon edges
    mask = Image.new("L", (SIZE, SIZE), 0)
    ImageDraw.Draw(mask).ellipse(
        [cx - radius, cy - radius, cx + radius, cy + radius],
        fill=255,
    )
    # Soft edge
    mask = mask.filter(ImageFilter.GaussianBlur(0.6))
    out = Image.new("RGBA", (SIZE, SIZE), (0, 0, 0, 0))
    out.paste(img, (0, 0))
    out.putalpha(mask)
    return out


def main():
    frames = [draw_frame(i / FRAMES) for i in range(FRAMES)]
    OUT.parent.mkdir(parents=True, exist_ok=True)
    frames[0].save(
        OUT,
        save_all=True,
        append_images=frames[1:],
        duration=DURATION_MS,
        loop=0,
        format="PNG",
        optimize=False,
    )
    print(f"Wrote {OUT.relative_to(ROOT)} ({OUT.stat().st_size / 1024:.1f} KB, {FRAMES} frames)")


if __name__ == "__main__":
    main()
