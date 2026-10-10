"""Regenerate atlas topic data from Atlas_ListOfTopicsAndGroupings.xlsx."""

from __future__ import annotations

import json
import re
import sys
from pathlib import Path

import openpyxl
from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
DEFAULT_XLSX = Path.home() / "Downloads" / "Atlas_ListOfTopicsAndGroupings.xlsx"
CARD_SOURCE = ROOT / "VSC Cards 2026 Final"
CARD_OUTPUT = ROOT / "public" / "assets" / "cards"
CARD_MANIFEST = ROOT / "tools" / "card-image-manifest.json"

CARD_DIRECTORIES = {
    "CV": "01_Cardiac",
    "RS": "02_Respiratory",
    "GI": "03_Gastro",
    "NPH": "04_Renal",
    "HM": "05_Hema",
    "IF": "06_Infx",
    "NE": "07_Neuro",
    "EN": "08_Endocrine",
    "MK": "09_MusculoSkeletal",
    "SK": "10_Skin",
    "CA": "11_Oncology",
    "GN": "12-Gynecology",
    "MB": "13_MoBaby",
    "PD": "14_Peds",
    "MS": "15_MedSurg",
    "CC": "16_ICU",
    "ER": "17_ER",
    "MH": "18_Psych",
    "NS": "19_NurseStation",
}

BODY_META = {
    1: {
        "id": "CV",
        "index": "01",
        "title": "Cardiovascular",
        "image": "assets/systems/cv-cardiovascular.png",
        "visual_dir": "assets/topic-visuals-wide",
        "visual_prefix": "cv",
    },
    2: {
        "id": "RS",
        "index": "02",
        "title": "Respiratory",
        "image": "assets/systems/rs-respiratory.png",
        "visual_dir": "assets/topic-visuals-wide",
        "visual_prefix": "rs",
    },
    3: {
        "id": "GI",
        "index": "03",
        "title": "Gastrointestinal",
        "image": "assets/systems/gi-gastrointestinal.png",
        "visual_dir": "assets/topic-visuals-wide",
        "visual_prefix": "gi",
    },
    4: {
        "id": "NPH",
        "index": "04",
        "title": "Nephrology",
        "image": "assets/systems/nph-nephrology.png",
        "visual_dir": "assets/topic-visuals-wide",
        "visual_prefix": "nph",
    },
    5: {
        "id": "HM",
        "index": "05",
        "title": "Hematology",
        "image": "assets/systems/hm-hematology.png",
        "visual_dir": "assets/topic-visuals-wide",
        "visual_prefix": "hm",
    },
    6: {
        "id": "IF",
        "index": "06",
        "title": "Infectious Diseases",
        "image": "assets/systems/if-infectious.png",
        "visual_dir": "assets/topic-visuals-wide",
        "visual_prefix": "if",
    },
    7: {
        "id": "NE",
        "index": "07",
        "title": "Neurology",
        "image": "assets/systems/ne-neurology.png",
        "visual_dir": "assets/topic-visuals-wide",
        "visual_prefix": "ne",
    },
    8: {
        "id": "EN",
        "index": "08",
        "title": "Endocrinology",
        "image": "assets/systems/en-endocrinology.png",
        "visual_dir": "assets/topic-visuals-wide",
        "visual_prefix": "en",
    },
    9: {
        "id": "MK",
        "index": "09",
        "title": "Musculoskeletal",
        "image": "assets/systems/mk-musculoskeletal.png",
        "visual_dir": "assets/topic-visuals-wide",
        "visual_prefix": "mk",
    },
    10: {
        "id": "SK",
        "index": "10",
        "title": "Skin",
        "image": "assets/systems/sk-skin.png",
        "visual_dir": "assets/topic-visuals-wide",
        "visual_prefix": "sk",
    },
    11: {
        "id": "CA",
        "index": "11",
        "title": "Oncology",
        "image": "assets/systems/ca-oncology.png",
        "visual_dir": "assets/topic-visuals-wide",
        "visual_prefix": "ca",
    },
    12: {
        "id": "GN",
        "index": "12",
        "title": "Gynecology",
        "image": "assets/systems/gn-gynecology.png",
        "visual_dir": "assets/topic-visuals-wide",
        "visual_prefix": "gn",
    },
}

PATIENT_META = {
    13: {
        "id": "MB",
        "index": "13",
        "title": "Mother-Baby",
        "unit": "Maternal / Neonatal",
        "image": "assets/patient-units/pu-unit-mb-mother-baby.png",
        "visual_dir": "assets/patient-topic-visuals-wide",
        "visual_prefix": "pu-mb",
    },
    14: {
        "id": "PD",
        "index": "14",
        "title": "Pediatrics",
        "unit": "Growth / Child Health",
        "image": "assets/patient-units/pu-unit-pd-pediatrics.png",
        "visual_dir": "assets/patient-topic-visuals-wide",
        "visual_prefix": "pu-pd",
    },
    15: {
        "id": "MS",
        "index": "15",
        "title": "Med-Surg",
        "unit": "Ward / Fundamentals",
        "image": "assets/patient-units/pu-unit-ms-med-surg.png",
        "visual_dir": "assets/patient-topic-visuals-wide",
        "visual_prefix": "pu-ms",
    },
    16: {
        "id": "CC",
        "index": "16",
        "title": "Critical Care",
        "unit": "ICU / Perioperative",
        "image": "assets/patient-units/pu-unit-cc-critical-care.png",
        "visual_dir": "assets/patient-topic-visuals-wide",
        "visual_prefix": "pu-cc",
    },
    17: {
        "id": "ER",
        "index": "17",
        "title": "Emergency",
        "unit": "Triage / Resuscitation",
        "image": "assets/patient-units/pu-unit-er-emergency.png",
        "visual_dir": "assets/patient-topic-visuals-wide",
        "visual_prefix": "pu-er",
    },
    18: {
        "id": "MH",
        "index": "18",
        "title": "Mental Health",
        "unit": "Psych Ward",
        "image": "assets/patient-units/pu-unit-mh-mental-health.png",
        "visual_dir": "assets/patient-topic-visuals-wide",
        "visual_prefix": "pu-mh",
    },
    19: {
        "id": "NS",
        "index": "19",
        "title": "Nurse Station",
        "unit": "Leadership / Priorities",
        "image": "assets/patient-units/pu-unit-ns-nurse-station.png",
        "visual_dir": "assets/patient-topic-visuals-wide",
        "visual_prefix": "pu-ns",
    },
}

# Prefer closest existing artwork when Excel group names change.
VISUAL_ALIASES = {
    "cv-heart-related-issues": "cv-heart-related-issues",
    "cv-vascular-issues": "cv-peripheral-vascular",
    "cv-other-issues": "cv-other-topics",
    "rs-pulmonary-embolism": "rs-pulmo-embolism",
    "rs-acid-base-imbalance": "rs-acid-base",
    "gi-gi-tract-bleeding": "gi-intestinal-issues",
    "gi-upper-gi": "gi-upper-gi-issues",
    "gi-lower-gi": "gi-abdominal",
    "gi-other-gi-issues": "gi-intestinal-issues",
    "nph-kidney-issues": "nph-kidney-diseases",
    "nph-bph": "nph-adjuncts",
    "nph-acid-base-and-ions": "nph-acid-base",
    "hm-hemostasis": "hm-bleeding",
    "hm-blood-cell-issues": "hm-blood-disorders",
    "if-infection-overview": "if-overview",
    "if-infection-by-area-1-cephalic": "if-head",
    "if-cephalic": "if-head",
    "if-infection-by-area-2-lungs": "if-respiratory",
    "if-lungs": "if-respiratory",
    "ne-icp": "ne-brain-issues",
    "ne-neurological-issues": "ne-brain-issues",
    "ne-eent": "ne-ent-issues",
    "en-pituitary-issues": "en-pituitary-issues",
    "en-thyroid": "en-thyroid-issues",
    "en-adrenals": "en-adrenal-issues",
    "mk-arthritis": "mk-arthritis-and-sle",
    "mk-joints-and-systemic": "mk-spine-and-muscle",
    "sk-burns-and-sores": "sk-skin-infections",
    "sk-visible-skin-issues": "sk-dermatitis-and-psoriasis",
    "ca-terms-and-groupings": "ca-terminologies",
    "ca-cancers-group-1": "ca-brain-and-bone",
    "ca-cancers-group-2": "ca-other-cancers",
    "gn-menstruation-and-menopause": "gn-menopause-and-contraceptives",
    "gn-contraceptives": "gn-menopause-and-contraceptives",
    "pu-mb-pregnancy-and-delivery": "pu-mb-pregnancy",
    "pu-mb-delivery-issues": "pu-mb-obstetrical-issues",
    "pu-mb-post-partum-issues": "pu-mb-postpartum-issues",
    "pu-mb-congenital-heart-diseases": "pu-mb-congenital-heart-issues",
    "pu-pd-from-birth": "pu-pd-neonate",
    "pu-pd-common-issues-by-system": "pu-pd-body-systems-1",
    "pu-ms-assessment": "pu-ms-physical-assessment",
    "pu-ms-med-surg-concerns-1": "pu-ms-gait-and-traction",
    "pu-ms-diets-and-herbs": "pu-ms-food",
    "pu-ms-med-surg-concerns-2": "pu-ms-medications",
    "pu-ms-diagnostic-procedures": "pu-ms-diagnostics",
    "pu-cc-hemodynamics-concepts": "pu-cc-hemodynamics",
    "pu-cc-oxygen-and-ventilators": "pu-cc-oxygen",
    "pu-cc-perioperative-care": "pu-cc-periop-care",
    "pu-er-priority-triage": "pu-er-cardiac-arrest",
    "pu-er-heart-and-circulation": "pu-er-shock-and-syncope",
    "pu-er-er-issues-by-system": "pu-er-nervous-system-issues",
    "pu-er-other-er-issues": "pu-er-other-emergencies",
    "pu-mh-psych-medications": "pu-mh-psych-meds",
    "pu-mh-therapeutic-communication": "pu-mh-communication",
    "pu-mh-mental-health-issues": "pu-mh-anxiety-and-mood",
    "pu-mh-substance-use-and-abuse": "pu-mh-substance-abuse",
    "pu-mh-other-mental-health-issues": "pu-mh-add-and-asd",
    "pu-ns-ethics-and-legal": "pu-ns-nurse-ethics",
    "pu-ns-prioritization-and-delegation": "pu-ns-delegation",
}


def slug(value: str) -> str:
    text = str(value).lower().replace("&", "and").replace("/", " ")
    text = re.sub(r"[^a-z0-9]+", "-", text)
    return text.strip("-")


def clean(value):
    if value is None:
        return None
    if isinstance(value, str):
        text = value.replace("\xa0", " ").strip()
        return text or None
    return value


def parse_sheet(ws):
    systems = []
    current = None
    current_group = None

    for row in ws.iter_rows(values_only=True):
        vals = [clean(v) for v in row[:8]]
        if len(vals) < 8:
            vals.extend([None] * (8 - len(vals)))
        sys_num, _sys_name, gno, gname, code, short, full, faces = vals

        if gname == "Group Name" or code == "CCode":
            continue
        if isinstance(_sys_name, str) and _sys_name.startswith("Division"):
            continue

        if sys_num is not None and _sys_name:
            current = {
                "sheet_index": int(sys_num),
                "sheet_title": str(_sys_name),
                "groups": [],
            }
            systems.append(current)
            current_group = None

        if current is None:
            continue

        if gno is not None and gname:
            current_group = {
                "no": int(gno),
                "name": str(gname),
                "cards": [],
            }
            current["groups"].append(current_group)

        if current_group is None or code is None or full is None:
            continue

        face_value = None
        if isinstance(faces, (int, float)):
            face_value = int(faces)
        elif isinstance(faces, str) and faces.isdigit():
            face_value = int(faces)

        current_group["cards"].append(
            {
                "code": str(code).strip(),
                "short": str(short).strip() if short is not None else "",
                "title": str(full).strip(),
                "faces": face_value,
            }
        )

    return systems


def asset_url(path: str) -> str:
    return f"${{import.meta.env.BASE_URL}}{path}"


def resolve_visual(prefix: str, visual_dir: str, topic_title: str, fallback: str) -> str:
    topic_slug = slug(topic_title)
    candidates = [
        f"{prefix}-{topic_slug}",
        VISUAL_ALIASES.get(f"{prefix}-{topic_slug}", ""),
    ]
    # Second infection-by-area-2 group uses systemic topics; prefer other-infections art.
    if prefix == "if" and topic_slug.startswith("infection-by-area-2") and "lungs" in topic_slug:
        # First lungs group already uses if-respiratory via alias; for ambiguous second
        # occurrence we resolve after the fact with used-set below.
        pass

    public_dir = ROOT / "public" / visual_dir
    for name in candidates:
        if name and (public_dir / f"{name}.png").exists():
            return asset_url(f"{visual_dir}/{name}.png")
    return asset_url(fallback)


def normalize_infection_groups(groups):
    """Keep Cephalic separate; merge duplicate Excel 'Lungs' groups into one."""
    normalized = []
    lungs = None

    for group in groups:
        name = group["name"]
        lower = name.lower()

        if "cephalic" in lower:
            normalized.append({**group, "name": "Cephalic"})
            continue

        if "lungs" in lower or lower.startswith("infection by area 2"):
            if lungs is None:
                lungs = {
                    "no": group["no"],
                    "name": "Lungs",
                    "cards": list(group["cards"]),
                }
                normalized.append(lungs)
            else:
                lungs["cards"].extend(group["cards"])
            continue

        normalized.append(group)

    return normalized


def build_units(parsed, meta_map, *, is_patient: bool):
    units = []
    for entry in parsed:
        meta = meta_map[entry["sheet_index"]]
        system_id = meta["id"]
        used_topic_ids: set[str] = set()
        topics = []
        groups = entry["groups"]
        if system_id == "IF":
            groups = normalize_infection_groups(groups)

        for group in groups:
            topic_slug = slug(group["name"])
            topic_id = f"{system_id.lower()}-{topic_slug}"
            if topic_id in used_topic_ids:
                topic_id = f"{topic_id}-{group['no']:02d}"
            used_topic_ids.add(topic_id)

            visual = resolve_visual(
                meta["visual_prefix"],
                meta["visual_dir"],
                group["name"],
                meta["image"],
            )

            cards = []
            for card in group["cards"]:
                code_slug = slug(card["code"])
                title_slug = slug(card["title"])
                card_id = f"{system_id.lower()}-{code_slug}-{title_slug}"
                cards.append(
                    {
                        "id": card_id,
                        "code": card["code"],
                        "short": card["short"],
                        "title": card["title"],
                        "faces": card["faces"],
                    }
                )

            topics.append(
                {
                    "id": topic_id,
                    "title": group["name"],
                    "visual": visual,
                    "cards": cards,
                }
            )

        unit = {
            "id": system_id,
            "index": meta["index"],
            "title": meta["title"],
        }
        if is_patient:
            unit["unit"] = meta["unit"]
        unit["image"] = asset_url(meta["image"])
        unit["topics"] = topics
        units.append(unit)
    return units


def natural_key(value: str):
    return [int(part) if part.isdigit() else part.lower() for part in re.split(r"(\d+)", value)]


def attach_card_images(units):
    """Attach optimized card faces by stable card ID, independent of Excel order."""
    if not CARD_SOURCE.exists():
        raise SystemExit(f"Card source directory not found: {CARD_SOURCE}")
    if not CARD_MANIFEST.exists():
        raise SystemExit(f"Card image manifest not found: {CARD_MANIFEST}")

    manifest = json.loads(CARD_MANIFEST.read_text(encoding="utf-8"))["cards"]
    source_by_name = {}
    for source in CARD_SOURCE.rglob("*.png"):
        key = source.name.upper()
        if key in source_by_name:
            raise SystemExit(f"Duplicate card filename: {source.name}")
        source_by_name[key] = source

    converted = 0
    reused = 0
    used_sources = set()
    for unit in units:
        records = [card for topic in unit["topics"] for card in topic["cards"]]
        output_dir = CARD_OUTPUT / unit["id"].lower()
        output_dir.mkdir(parents=True, exist_ok=True)

        for record in records:
            expected = record.get("faces") or 0
            filenames = manifest.get(record["id"])
            if filenames is None:
                raise SystemExit(f"No card image mapping for {record['id']}")
            if len(filenames) != expected:
                raise SystemExit(
                    f"{record['id']}: manifest has {len(filenames)} faces, data expects {expected}"
                )

            source_faces = []
            for filename in filenames:
                source = source_by_name.get(filename.upper())
                if source is None:
                    raise SystemExit(f"Missing source artwork: {filename}")
                source_faces.append(source)
                used_sources.add(source.resolve())

            urls = []
            for source in source_faces:
                target = output_dir / f"{source.stem.lower()}.webp"
                if not target.exists() or target.stat().st_mtime < source.stat().st_mtime:
                    with Image.open(source) as image:
                        image.thumbnail((1200, 1800), Image.Resampling.LANCZOS)
                        image.save(target, "WEBP", quality=82, method=4)
                    converted += 1
                else:
                    reused += 1
                urls.append(asset_url(f"assets/cards/{unit['id'].lower()}/{target.name}"))
            record["images"] = urls

    all_sources = {source.resolve() for source in source_by_name.values()}
    unused = all_sources - used_sources
    if unused:
        sample = ", ".join(sorted(path.name for path in unused)[:5])
        raise SystemExit(f"{len(unused)} unmapped card images (first: {sample})")
    if len(used_sources) != 588:
        raise SystemExit(f"Expected 588 mapped card faces, found {len(used_sources)}")

    print(f"Card artwork: {converted} optimized, {reused} reused")


def emit_js_literal(value, indent=0):
    pad = "  " * indent
    if isinstance(value, list):
        if not value:
            return "[]"
        lines = ["["]
        for item in value:
            lines.append(f"{pad}  {emit_js_literal(item, indent + 1)},")
        lines.append(f"{pad}]")
        return "\n".join(lines)
    if isinstance(value, dict):
        lines = ["{"]
        for key, item in value.items():
            rendered = emit_js_literal(item, indent + 1)
            if key in {"image", "visual"} and isinstance(item, str) and item.startswith("${"):
                lines.append(f"{pad}  {key}: `{item}`,")
            elif "\n" in rendered:
                lines.append(f"{pad}  {key}: {rendered},")
            else:
                lines.append(f"{pad}  {key}: {rendered},")
        lines.append(f"{pad}}}")
        return "\n".join(lines)
    if isinstance(value, str):
        if value.startswith("${"):
            return f"`{value}`"
        return json.dumps(value, ensure_ascii=False)
    if value is None:
        return "null"
    if isinstance(value, bool):
        return "true" if value else "false"
    return str(value)


def write_body(units):
    path = ROOT / "src" / "data" / "bodySystems.js"
    content = (
        "export const bodySystems = "
        + emit_js_literal(units)
        + ";\n\n"
        + "export const getSystemById = (id) => bodySystems.find((system) => system.id === id);\n\n"
        + "export const getTopicById = (systemId, topicId) => getSystemById(systemId)?.topics.find((topic) => topic.id === topicId);\n"
    )
    path.write_text(content, encoding="utf-8")
    return path


def write_patient(units):
    path = ROOT / "src" / "data" / "patientUnits.js"
    content = (
        "export const patientUnits = "
        + emit_js_literal(units)
        + ";\n\n"
        + "export const getPatientUnitById = (id) => patientUnits.find((unit) => unit.id === id);\n"
    )
    path.write_text(content, encoding="utf-8")
    return path


def main():
    xlsx = Path(sys.argv[1]) if len(sys.argv) > 1 else DEFAULT_XLSX
    if not xlsx.exists():
        raise SystemExit(f"Workbook not found: {xlsx}")

    wb = openpyxl.load_workbook(xlsx, data_only=True)
    body_parsed = parse_sheet(wb["BodySystems"])
    patient_parsed = parse_sheet(wb["PatientUnts"])

    body = build_units(body_parsed, BODY_META, is_patient=False)
    patient = build_units(patient_parsed, PATIENT_META, is_patient=True)
    attach_card_images(body + patient)

    body_path = write_body(body)
    patient_path = write_patient(patient)

    body_topics = sum(len(s["topics"]) for s in body)
    body_cards = sum(len(t["cards"]) for s in body for t in s["topics"])
    patient_topics = sum(len(s["topics"]) for s in patient)
    patient_cards = sum(len(t["cards"]) for s in patient for t in s["topics"])

    print(f"Wrote {body_path.relative_to(ROOT)} ({len(body)} systems, {body_topics} groups, {body_cards} cards)")
    print(f"Wrote {patient_path.relative_to(ROOT)} ({len(patient)} units, {patient_topics} groups, {patient_cards} cards)")
    densest = max(
        ((s["title"], t["title"], len(t["cards"])) for s in body + patient for t in s["topics"]),
        key=lambda item: item[2],
    )
    print(f"Densest group: {densest[0]} / {densest[1]} ({densest[2]} cards)")


if __name__ == "__main__":
    main()
