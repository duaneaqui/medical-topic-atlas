from pathlib import Path

from PIL import Image, ImageChops, ImageEnhance, ImageFilter


ROOT = Path(__file__).resolve().parents[1]
VISUAL_DIR = ROOT / "public" / "assets" / "topic-visuals"
OUT_DIR = ROOT / "public" / "assets" / "topic-visuals-wide"
TARGET_W = 1600
TARGET_H = 900


def resize_cover(image, width, height):
    scale = max(width / image.width, height / image.height)
    resized = image.resize((round(image.width * scale), round(image.height * scale)), Image.Resampling.LANCZOS)
    left = (resized.width - width) // 2
    top = (resized.height - height) // 2
    return resized.crop((left, top, left + width, top + height))


def resize_contain(image, width, height):
    scale = min(width / image.width, height / image.height)
    return image.resize((round(image.width * scale), round(image.height * scale)), Image.Resampling.LANCZOS)


def trim_panel_edges(image):
    # Crops away atlas dividers and hard cell borders before making the wide version.
    margin_x = max(10, round(image.width * 0.045))
    margin_y = max(10, round(image.height * 0.055))
    return image.crop((margin_x, margin_y, image.width - margin_x, image.height - margin_y))


def normalize(path):
    source = Image.open(path).convert("RGB")
    subject_source = trim_panel_edges(source)

    canvas = resize_cover(subject_source, TARGET_W, TARGET_H)
    canvas = ImageEnhance.Brightness(canvas).enhance(1.02)
    canvas = ImageEnhance.Contrast(canvas).enhance(1.1)

    # HUD-safe edge falloff so readouts remain legible without creating side bars.
    horizontal = [
        round((1 - min(min(x, TARGET_W - x) / (TARGET_W / 2), 1)) ** 2 * 54)
        for x in range(TARGET_W)
    ]
    vertical = [
        round((1 - min(min(y, TARGET_H - y) / (TARGET_H / 2), 1)) ** 2 * 38)
        for y in range(TARGET_H)
    ]
    h_mask = Image.new("L", (TARGET_W, 1))
    h_mask.putdata(horizontal)
    h_mask = h_mask.resize((TARGET_W, TARGET_H))
    v_mask = Image.new("L", (1, TARGET_H))
    v_mask.putdata(vertical)
    v_mask = v_mask.resize((TARGET_W, TARGET_H))
    alpha = ImageChops.add(h_mask, v_mask, scale=1.0, offset=0)
    overlay = Image.new("RGBA", (TARGET_W, TARGET_H), (0, 0, 0, 0))
    overlay.putalpha(alpha)
    canvas = Image.alpha_composite(canvas.convert("RGBA"), overlay).convert("RGB")

    OUT_DIR.mkdir(parents=True, exist_ok=True)
    canvas.save(OUT_DIR / path.name, optimize=True, quality=92)


def main():
    for path in sorted(VISUAL_DIR.glob("*.png")):
        normalize(path)


if __name__ == "__main__":
    main()
