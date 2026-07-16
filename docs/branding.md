# Branding anpassen (neues Kundenprojekt)

Farben, Schriften und Logo werden über eine globale Storyblok-Story gesteuert
(Content-Type `settings`, Slug `settings`) — Redakteur:innen können sie ohne
Code-Zugriff ändern. Änderungen erscheinen nach einem Browser-Reload, ohne
Neustart nötig (Storyblok-Cache ist deaktiviert, siehe `astro.config.mjs`).

## Story `settings` anlegen

Falls noch nicht vorhanden: Content-Type `settings` (Root, nicht Nestable) mit
folgenden Feldern anlegen, dann eine Story mit Slug `settings` erstellen:

| Feld | Typ |
|---|---|
| `font_heading` | Single-Option — Optionen: `serif_classic`, `serif_modern`, `sans_classic`, `sans_modern` |
| `font_body` | Single-Option — gleiche Optionen |
| `color_primary` | Text (Hex-Farbwert, z. B. `#1f6f78`) |
| `color_secondary` | Text (Hex-Farbwert) |
| `logo` | Asset (Single) |

## Farben

`color_primary` / `color_secondary` in der `settings`-Story setzen. **Wichtig —
Kontrast prüfen:** Storyblok validiert das nicht automatisch. Neue Farben vor dem
Speichern mit folgendem Snippet gegen WCAG AA (mindestens 4.5:1) prüfen:

```bash
python3 << 'EOF'
def hex_to_rgb(h):
    h = h.lstrip('#')
    return tuple(int(h[i:i+2], 16) for i in (0, 2, 4))
def relative_luminance(rgb):
    def chan(c):
        c = c / 255
        return c / 12.92 if c <= 0.03928 else ((c + 0.055) / 1.055) ** 2.4
    r, g, b = rgb
    return 0.2126*chan(r)+0.7152*chan(g)+0.0722*chan(b)
def contrast(a, b):
    l1, l2 = relative_luminance(hex_to_rgb(a)), relative_luminance(hex_to_rgb(b))
    hi, lo = max(l1, l2), min(l1, l2)
    return (hi + 0.05) / (lo + 0.05)

print(contrast("#1f6f78", "#ffffff"))  # sollte >= 4.5 sein
EOF
```

`--color-accent` (nur Fokus-Ringe/Tastaturbedienbarkeit) bleibt bewusst Code-only
(`src/styles/tokens.css`) — nicht Teil der Storyblok-Einstellungen.

## Schriften

`font_heading` / `font_body` in der `settings`-Story per Dropdown wählen. Nur die
vier vorgeprüften, sicheren System-Font-Stacks stehen zur Auswahl (siehe Tabelle
oben) — kein Laden externer Web-Fonts.

## Logo

Bild im `logo`-Asset-Feld der `settings`-Story hochladen. Ist kein Bild gesetzt,
zeigt das Template automatisch den Berichtstitel als Text (Navigation) bzw.
"Florawerk GmbH" (Footer) — kein Platzhalterbild nötig.

## Weitere Textinhalte

Berichtstitel, Kapitel-Namen und die Zuordnung der Startseiten-Kennzahlen sind
weiterhin **nicht** über Storyblok steuerbar, sondern fest in
`src/storyblok/Page.astro` eingetragen (Variablen `chapters`, `title`-Prop an
`<HeroOverview>`) — für ein neues Kundenprojekt dort manuell anpassen. Welche
KPI-Kacheln im Hero erscheinen, wird über das `show_in_hero`-Feld an `kpi_card`
gesteuert (siehe `docs/storyblok-setup.md`, Abschnitt 3a).
