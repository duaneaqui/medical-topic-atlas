import json
import re
import sys
from pathlib import Path

import pandas as pd


SYSTEM_IDS = {
    "Cardiovascular": "CV",
    "Respiratory": "RS",
    "Gastrointestinal": "GI",
    "Nephrology": "NPH",
    "Hematology": "HM",
    "Infectious Diseases": "IF",
    "Neurology": "NE",
    "Endocrinology": "EN",
    "Musculoskeletal": "MK",
    "Skin": "SK",
    "Oncology": "CA",
    "Gynecology": "GN",
}

SYSTEM_IMAGES = {
    "CV": "/assets/systems/cv-cardiovascular.png",
    "RS": "/assets/systems/rs-respiratory.png",
    "GI": "/assets/systems/gi-gastrointestinal.png",
    "NPH": "/assets/systems/nph-nephrology.png",
    "HM": "/assets/systems/hm-hematology.png",
    "IF": "/assets/systems/if-infectious.png",
    "NE": "/assets/systems/ne-neurology.png",
    "EN": "/assets/systems/en-endocrinology.png",
    "MK": "/assets/systems/mk-musculoskeletal.png",
    "SK": "/assets/systems/sk-skin.png",
    "CA": "/assets/systems/ca-oncology.png",
    "GN": "/assets/systems/gn-gynecology.png",
}

MERGE_NAMES = {
    "Peripheral Vascular 1": "Peripheral Vascular",
    "Peripheral Vascular 2": "Peripheral Vascular",
    "Blood disorders 1": "Blood disorders",
    "Blood disorders 2": "Blood disorders",
    "Brain Issues 1": "Brain Issues",
    "Brain Issues 2": "Brain Issues",
}


def slug(value):
    text = value.lower().replace("&", "and")
    text = re.sub(r"[^a-z0-9]+", "-", text)
    return text.strip("-")


def js_string(value):
    return json.dumps(value, ensure_ascii=False)


def read_systems(workbook_path):
    df = pd.read_excel(workbook_path, sheet_name="Body Systems", header=None)
    systems = []
    current_system = None
    current_group = None
    system_re = re.compile(r"^(\d{2})\s+(.+)$")

    for _, row in df.iterrows():
        system_cell = row.iloc[1]
        name_cell = row.iloc[2]
        code_cell = row.iloc[3]
        short_cell = row.iloc[4]
        full_cell = row.iloc[5]
        faces_cell = row.iloc[6]

        if isinstance(system_cell, str):
            text = system_cell.strip()
            match = system_re.match(text)
            if match and text != "Grp #":
                title = match.group(2).strip()
                system_id = SYSTEM_IDS.get(title)
                if not system_id:
                    continue
                current_system = {
                    "id": system_id,
                    "index": match.group(1),
                    "title": title,
                    "image": SYSTEM_IMAGES[system_id],
                    "topics": [],
                }
                systems.append(current_system)
                current_group = None
                continue

        if str(system_cell).strip() == "Grp #":
            continue

        has_group = pd.notna(system_cell) and pd.notna(name_cell)
        has_card = pd.notna(code_cell) and pd.notna(full_cell)

        if current_system and has_group:
            raw_name = str(name_cell).strip()
            topic_name = MERGE_NAMES.get(raw_name, raw_name)
            current_group = next(
                (topic for topic in current_system["topics"] if topic["title"] == topic_name),
                None,
            )
            if current_group is None:
                current_group = {
                    "id": f"{current_system['id'].lower()}-{slug(topic_name)}",
                    "title": topic_name,
                    "cards": [],
                }
                current_system["topics"].append(current_group)

        if current_group and has_card:
            faces = None
            if pd.notna(faces_cell):
                try:
                    faces = int(faces_cell)
                except Exception:
                    faces = str(faces_cell).strip()
            code = str(code_cell).strip()
            title = str(full_cell).strip()
            current_group["cards"].append(
                {
                    "id": f"{current_system['id'].lower()}-{slug(code)}-{slug(title)}",
                    "code": code,
                    "short": str(short_cell).strip() if pd.notna(short_cell) else "",
                    "title": title,
                    "faces": faces,
                }
            )

    return systems


def render_js(systems):
    lines = ["export const bodySystems = ["]
    for system_index, system in enumerate(systems):
        lines.extend(
            [
                "  {",
                f"    id: {js_string(system['id'])},",
                f"    index: {js_string(system['index'])},",
                f"    title: {js_string(system['title'])},",
                f"    image: {js_string(system['image'])},",
                "    topics: [",
            ]
        )
        for topic_index, topic in enumerate(system["topics"]):
            lines.extend(
                [
                    "      {",
                    f"        id: {js_string(topic['id'])},",
                    f"        title: {js_string(topic['title'])},",
                    "        cards: [",
                ]
            )
            for card_index, card in enumerate(topic["cards"]):
                comma = "," if card_index < len(topic["cards"]) - 1 else ""
                fields = [
                    f"id: {js_string(card['id'])}",
                    f"code: {js_string(card['code'])}",
                    f"short: {js_string(card['short'])}",
                    f"title: {js_string(card['title'])}",
                    f"faces: {json.dumps(card['faces'])}",
                ]
                lines.append(f"          {{ {', '.join(fields)} }}{comma}")
            lines.append("        ]")
            lines.append(f"      }}{',' if topic_index < len(system['topics']) - 1 else ''}")
        lines.append("    ]")
        lines.append(f"  }}{',' if system_index < len(systems) - 1 else ''}")
    lines.extend(
        [
            "];",
            "",
            "export const getSystemById = (id) => bodySystems.find((system) => system.id === id);",
            "",
            "export const getTopicById = (systemId, topicId) => getSystemById(systemId)?.topics.find((topic) => topic.id === topicId);",
            "",
        ]
    )
    return "\n".join(lines)


if __name__ == "__main__":
    workbook = Path(sys.argv[1])
    output = Path(sys.argv[2])
    output.write_text(render_js(read_systems(workbook)), encoding="utf-8")
