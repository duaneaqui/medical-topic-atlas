from pathlib import Path
import re


ROOT = Path(__file__).resolve().parents[1]
DATA_FILE = ROOT / "src" / "data" / "bodySystems.js"


def main():
    text = DATA_FILE.read_text(encoding="utf-8")
    text = re.sub(
        r'visual: "/assets/topic-visuals/([^"]+\.png)"',
        r'visual: "/assets/topic-visuals-wide/\1"',
        text,
    )
    DATA_FILE.write_text(text, encoding="utf-8")


if __name__ == "__main__":
    main()
