from pathlib import Path
import re
import shutil

from PIL import Image


ROOT = Path(__file__).resolve().parents[1]
GENERATED = Path.home() / ".codex" / "generated_images" / "019ef030-6636-74a2-8ee1-3c0304338cea"
ATLAS_DIR = ROOT / "public" / "assets" / "topic-atlases"
VISUAL_DIR = ROOT / "public" / "assets" / "topic-visuals"
DATA_FILE = ROOT / "src" / "data" / "bodySystems.js"

SYSTEM_ORDER = ["CV", "RS", "GI", "NPH", "HM", "IF", "NE", "EN", "MK", "SK", "CA", "GN"]


def slug(value):
    value = value.lower().replace("&", "and")
    value = re.sub(r"[^a-z0-9]+", "-", value)
    return value.strip("-")


def collect_topic_ids():
    topics = {}
    current_system = None
    pending_topic = None
    for line in DATA_FILE.read_text(encoding="utf-8").splitlines():
        system_match = re.match(r"    id: \"([A-Z]+)\",", line)
        if system_match:
            current_system = system_match.group(1)
            topics[current_system] = []
            pending_topic = None
            continue

        topic_id_match = re.match(r"        id: \"([^\"]+)\",", line)
        if current_system and topic_id_match:
            pending_topic = topic_id_match.group(1)
            continue

        title_match = re.match(r"        title: \"([^\"]+)\",", line)
        if current_system and pending_topic and title_match:
            topics[current_system].append(pending_topic)
            pending_topic = None
    return topics


def copy_atlases():
    ATLAS_DIR.mkdir(parents=True, exist_ok=True)
    latest = sorted(GENERATED.glob("*.png"), key=lambda path: path.stat().st_mtime)[-12:]
    for system_id, source in zip(SYSTEM_ORDER, latest):
        target = ATLAS_DIR / f"{system_id.lower()}-atlas.png"
        shutil.copy2(source, target)


def crop_atlases(topics):
    VISUAL_DIR.mkdir(parents=True, exist_ok=True)
    for system_id in SYSTEM_ORDER:
        atlas = ATLAS_DIR / f"{system_id.lower()}-atlas.png"
        if not atlas.exists():
            continue
        image = Image.open(atlas).convert("RGB")
        width, height = image.size
        cell_w = width // 3
        cell_h = height // 2
        for index, topic_id in enumerate(topics.get(system_id, [])):
            if topic_id == "cv-heart-related-issues":
                continue
            col = index % 3
            row = index // 3
            crop = image.crop((col * cell_w, row * cell_h, (col + 1) * cell_w, (row + 1) * cell_h))
            crop.save(VISUAL_DIR / f"{topic_id}.png", optimize=True, quality=92)


def wire_data(topics):
    visual_by_topic = {
        topic_id: f"/assets/topic-visuals/{topic_id}.png"
        for system_topics in topics.values()
        for topic_id in system_topics
    }
    visual_by_topic["cv-heart-related-issues"] = "/assets/topic-visuals/cv-heart-related-issues.png"

    lines = DATA_FILE.read_text(encoding="utf-8").splitlines()
    output = []
    current_topic = None
    skip_next_visual = False

    for line in lines:
        topic_id_match = re.match(r"        id: \"([^\"]+)\",", line)
        if topic_id_match:
            current_topic = topic_id_match.group(1)
            output.append(line)
            skip_next_visual = False
            continue

        if re.match(r"        visual: ", line):
            if current_topic:
                skip_next_visual = True
                continue

        output.append(line)

        title_match = re.match(r"        title: \"[^\"]+\",", line)
        if current_topic and title_match and current_topic in visual_by_topic:
            output.append(f"        visual: \"{visual_by_topic[current_topic]}\",")
            current_topic = None

    DATA_FILE.write_text("\n".join(output) + "\n", encoding="utf-8")


def main():
    topics = collect_topic_ids()
    copy_atlases()
    crop_atlases(topics)
    wire_data(topics)


if __name__ == "__main__":
    main()
