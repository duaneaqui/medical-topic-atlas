from pathlib import Path

path = Path(r"src/styles.css")
text = path.read_text(encoding="utf-8")
start = text.find('.scroll-anatomy-app[data-atlas-mode="patient"] .visual-stage::after {')
end = text.find('.scroll-anatomy-app[data-atlas-mode="patient"] .patient-unit-field', start)
if start < 0 or end < 0:
    raise SystemExit(f"markers not found start={start} end={end}")

replacement = '''.scroll-anatomy-app[data-atlas-mode="patient"] .visual-stage::after {
  inset: 12px;
  margin: 0;
  border: 0;
  box-shadow: none;
  opacity: 0.9;
  background:
    /* soft clinical double rim, open at top-left branding zone */
    linear-gradient(90deg, transparent 0 26%, rgba(70, 108, 132, 0.38) 30%, rgba(70, 108, 132, 0.38) 74%, transparent 78%) top 0 left 0 / 100% 1px no-repeat,
    linear-gradient(90deg, transparent 0 16%, rgba(90, 130, 150, 0.3) 22%, rgba(90, 130, 150, 0.3) 78%, transparent 84%) bottom 0 left 0 / 100% 1px no-repeat,
    linear-gradient(180deg, transparent 0 20%, rgba(70, 108, 132, 0.32) 26%, rgba(70, 108, 132, 0.32) 80%, transparent 88%) left 0 top 0 / 1px 100% no-repeat,
    linear-gradient(180deg, rgba(70, 108, 132, 0.36), rgba(110, 150, 170, 0.28) 50%, rgba(70, 108, 132, 0.34)) right 0 top 0 / 1px 100% no-repeat,

    /* second soft inner rim */
    linear-gradient(90deg, transparent 0 28%, rgba(255, 255, 255, 0.34) 32%, rgba(255, 255, 255, 0.34) 70%, transparent 74%) top 8px left 0 / 100% 1px no-repeat,
    linear-gradient(90deg, transparent 0 18%, rgba(255, 255, 255, 0.28) 24%, rgba(255, 255, 255, 0.28) 76%, transparent 82%) bottom 8px left 0 / 100% 1px no-repeat,
    linear-gradient(180deg, transparent 0 22%, rgba(255, 255, 255, 0.24) 28%, rgba(255, 255, 255, 0.24) 76%, transparent 84%) left 8px top 0 / 1px 100% no-repeat,
    linear-gradient(180deg, rgba(255, 255, 255, 0.28), rgba(255, 255, 255, 0.16) 50%, rgba(255, 255, 255, 0.26)) right 8px top 0 / 1px 100% no-repeat,

    /* clinical corner caps + dots */
    linear-gradient(rgba(55, 96, 120, 0.88), rgba(55, 96, 120, 0.88)) left 0 top 0 / 36px 2px no-repeat,
    linear-gradient(rgba(55, 96, 120, 0.88), rgba(55, 96, 120, 0.88)) left 0 top 0 / 2px 36px no-repeat,
    radial-gradient(circle at center, rgba(255, 255, 255, 0.85) 0 1.5px, transparent 2px) left 14px top 14px / 8px 8px no-repeat,

    linear-gradient(rgba(55, 96, 120, 0.88), rgba(55, 96, 120, 0.88)) right 0 top 0 / 36px 2px no-repeat,
    linear-gradient(rgba(55, 96, 120, 0.88), rgba(55, 96, 120, 0.88)) right 0 top 0 / 2px 36px no-repeat,
    radial-gradient(circle at center, rgba(255, 255, 255, 0.85) 0 1.5px, transparent 2px) right 14px top 14px / 8px 8px no-repeat,

    linear-gradient(rgba(55, 96, 120, 0.88), rgba(55, 96, 120, 0.88)) left 0 bottom 0 / 36px 2px no-repeat,
    linear-gradient(rgba(55, 96, 120, 0.88), rgba(55, 96, 120, 0.88)) left 0 bottom 0 / 2px 36px no-repeat,
    radial-gradient(circle at center, rgba(255, 255, 255, 0.85) 0 1.5px, transparent 2px) left 14px bottom 14px / 8px 8px no-repeat,

    linear-gradient(rgba(55, 96, 120, 0.88), rgba(55, 96, 120, 0.88)) right 0 bottom 0 / 36px 2px no-repeat,
    linear-gradient(rgba(55, 96, 120, 0.88), rgba(55, 96, 120, 0.88)) right 0 bottom 0 / 2px 36px no-repeat,
    radial-gradient(circle at center, rgba(255, 255, 255, 0.85) 0 1.5px, transparent 2px) right 14px bottom 14px / 8px 8px no-repeat,

    /* mid ticks */
    linear-gradient(rgba(255, 255, 255, 0.7), rgba(255, 255, 255, 0.7)) left 50% top 0 / 28px 2px no-repeat,
    linear-gradient(rgba(255, 255, 255, 0.7), rgba(255, 255, 255, 0.7)) left 50% bottom 0 / 28px 2px no-repeat,
    linear-gradient(rgba(70, 108, 132, 0.75), rgba(70, 108, 132, 0.75)) right 0 top 50% / 2px 28px no-repeat,
    linear-gradient(rgba(70, 108, 132, 0.55), rgba(70, 108, 132, 0.55)) left 0 top 64% / 2px 28px no-repeat;
  background-origin: padding-box;
}

'''

path.write_text(text[:start] + replacement + text[end:], encoding="utf-8")
print("patient page frame replaced")
