# Branding anpassen (neues Kundenprojekt)

Drei Stellen, um dieses Template für einen neuen Kunden umzufärben: Farben,
Schriften, Logo. Kein Build-Schritt, kein Konfigurationsfile — alles direkt in den
unten genannten Dateien.

## Farben

Datei: `src/styles/tokens.css`, Block `:root { ... }`, Abschnitt "Farben — HIER
Kundenfarben eintragen":

- `--color-primary` — Hauptfarbe (Buttons, Zahlen, Akzente)
- `--color-primary-dark` / `--color-primary-light` — Abstufungen der Hauptfarbe
- `--color-secondary` — zweite Markenfarbe
- `--color-accent` — nur für Fokus-Ringe (Tastatur-Bedienbarkeit), unabhängig von
  Primär-/Sekundärfarbe

**Wichtig — Kontrast prüfen:** Neue Farben müssen als Text auf hellem/dunklem
Hintergrund lesbar bleiben (WCAG AA, mindestens 4.5:1 für normalen Text). Mit
folgendem Python-Snippet prüfen (Werte anpassen):

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

# Neue Primärfarbe gegen Hintergrund prüfen (Beispielwerte anpassen):
print(contrast("#1f6f78", "#ffffff"))  # sollte >= 4.5 sein
EOF
```

Der `@media (prefers-color-scheme: dark)`-Block weiter unten in derselben Datei
überschreibt einzelne Farben fürs Dark Mode — bei einer neuen Primärfarbe dort
prüfen, ob die (meist hellere) Dark-Mode-Variante ebenfalls noch 4.5:1 auf dem
dunklen Hintergrund erreicht.

## Schriften

Gleiche Datei, gleicher Block:

- `--font-heading` — Überschriften
- `--font-body` — Fließtext

Dieses Template lädt **keine externen Web-Fonts** (kein Google Fonts, kein eigenes
`@font-face`) — nur Schriftnamen eintragen, die auf dem Zielsystem bereits verfügbar
sind (System-Schriften wie `-apple-system`, oder verbreitete, meist vorinstallierte
Schriften wie `Georgia`, `Times New Roman`, `Arial`). Web-Font-Loading wäre eine
größere Erweiterung (Font-Dateien einbinden, `<link>`/`@font-face` in
`src/layouts/BaseLayout.astro` ergänzen) und ist bewusst nicht Teil dieses Templates.

## Logo

Datei `public/logo.svg` ablegen (SVG empfohlen — verlustfrei skalierbar). Die
`Logo`-Komponente (`src/components/Logo.astro`) erkennt die Datei automatisch beim
nächsten Build und zeigt sie in Navigation und Footer an. Ohne diese Datei zeigt das
Template automatisch den Berichtstitel als Text — kein Platzhalterbild nötig, das
Template funktioniert auch ganz ohne Logo.

## Weitere Textinhalte

Berichtstitel, Kapitel-Namen und die Startseiten-Kennzahlen sind aktuell **nicht**
über Storyblok steuerbar, sondern fest in `src/storyblok/Page.astro` eingetragen
(Variablen `chapters`, `kpis`, sowie der `title`-Prop an `<HeroOverview>`) — für ein
neues Kundenprojekt dort manuell anpassen.
