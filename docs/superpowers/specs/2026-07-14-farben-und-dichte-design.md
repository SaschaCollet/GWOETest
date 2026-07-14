# Design: Farbpalette (Teal) + Layout-Dichte (Scharf/Editorial)

Testweise Design-Variante des Florawerk-Berichtstemplates, entstanden aus einer
Brainstorming-Session mit visueller Vorschau (4 Farbrichtungen, 3 Dichte-Varianten).
Ergebnis: **Teal-Palette** (Option B) + **Scharf/Editorial-Dichte** (Option C).

## Ziel

Zeigen, dass sich das bestehende Design-Token-System (`src/styles/tokens.css`,
gebaut in Phase 4) tatsächlich "an einer Stelle pro Kunde austauschbar" ist — ohne
Änderungen an den Storyblok-Bausteinen selbst. Reine Optik-Variante zum Testen,
keine neue Funktionalität.

## Entscheidungen aus dem Brainstorming

- **Farben:** Weg vom Waldgrün/Braun hin zu einem kühleren Petrol/Teal als
  Primärfarbe, mit warmem Amber/Terrakotta als Sekundärfarbe für Kontrast
  (Buttons, Akzente).
- **Dichte/Radien:** Weg von großen Radien (16px) und weichen Schatten hin zu
  scharfen Ecken (0 Radius) und einer knappen, linienbasierten Optik statt
  weicher Elevation — redaktioneller/nüchterner Charakter.

## Token-Änderungen (`src/styles/tokens.css`)

Alle Werte gegen WCAG-AA-Textkontrast (4.5:1) geprüft, analog zur Prüfung aus
Phase 10:

| Token | Alt | Neu | Kontrast auf Weiß | Hinweis |
|---|---|---|---|---|
| `--color-primary` | `#2f6d4f` | `#1f6f78` | 5.83 (AA) | Teal |
| `--color-primary-dark` | `#1f4d38` | `#154e54` | — | aktuell ungenutzt, nur für Konsistenz |
| `--color-primary-light` | `#e5f0ea` | `#e3eef0` | — | aktuell ungenutzt, nur für Konsistenz |
| `--color-secondary` | `#9b6d39` | `#ad6524` | 4.5 (AA, Grenzwert) | wird für Buttons mit weißer Schrift verwendet → beide Richtungen geprüft |
| `--color-success` | `#2f6d4f` | `#1f6f78` | 5.83 (AA) | an neuen Primärton angeglichen |
| Dark Mode `--color-primary`/`--color-success` | `#4db281` | `#34bbcb` | 7.57 auf `#1a1a18` (AA) | hellere Teal-Variante, sonst < 4.5:1 |

Ursprünglicher Mockup-Amber (`#d98e4a`) hatte nur 2.65:1 Kontrast mit weißer
Schrift — durchgefallen. Auf `#ad6524` abgedunkelt, um AA zu erreichen; Farbeindruck
(warmes Terrakotta) bleibt erhalten.

`--color-accent` (aktuell nur für Fokus-Ringe verwendet), `--color-danger`,
`--color-warning` und der Spacing-Maßstab (`--space-*`) bleiben unverändert — nicht
Teil der getroffenen Auswahl, keine Notwendigkeit für eine Änderung.

### Radien und Schatten

| Token | Alt | Neu |
|---|---|---|
| `--radius-sm` | `0.25rem` | `0` |
| `--radius-md` | `0.5rem` | `0` |
| `--radius-lg` | `1rem` | `0` |
| `--radius-full` | `999px` | unverändert (Avatare, Matrix-Punkte müssen rund bleiben) |
| `--shadow-sm` | weicher Blur | `0 0 0 1px rgba(0,0,0,0.06)` — scharfer 1px-Ring, kein Blur |
| `--shadow-md` | weicher Blur | `0 0 0 1px rgba(0,0,0,0.12)` |
| `--shadow-lg` | weicher Blur | `0 0 0 1px rgba(0,0,0,0.18)` |

Damit bleibt der bestehende Hover-Mechanismus (Karten nutzen `box-shadow` beim
Hover/Fokus) technisch unverändert — er wirkt nur "schärfer" statt weich, ohne
dass eine Komponente angefasst werden muss.

## Komponenten-Änderungen (gezielt, 2 Dateien)

Aus der genehmigten kombinierten Vorschau: KPI-Kacheln bekommen einen 3px breiten
linken Akzentstreifen in `--color-primary` statt (nur) einem umlaufenden 1px-Rahmen
— das war ein sichtbares Element der genehmigten Vorschau, keine reine
Token-Änderung.

- **`src/storyblok/KpiCard.astro`**: `border` → zusätzlich
  `border-inline-start: 3px solid var(--color-primary)`
- **`src/components/HeroOverview.astro`**: `.hero__kpi` analog

Alle anderen Bausteine (Statement, Accordion, Timeline, ChartEmbed,
MaterialityMatrix, Navigation, Footer) ändern sich ausschließlich über die
Tokens — kein Code-Eingriff nötig, das ist der eigentliche Test des
Token-Systems.

## Out of Scope

- Spacing-Skala (`--space-*`) bleibt unverändert — Dichte wird ausschließlich über
  Radien/Schatten ausgedrückt, keine globale Neuberechnung aller Abstände (zu
  riskant für eine "testhalber"-Änderung, hätte Seiteneffekte auf Section-Rhythmus).
- Typografie, `--color-accent`, `--color-danger`, `--color-warning` — nicht Teil
  der getroffenen Auswahl.

## Verifikation

- `npm run build` fehlerfrei
- Kontrastprüfung aller geänderten Farbwerte (Skript wie in Phase 10)
- Visueller Check auf `https://localhost:4321/` (Live-Storyblok-Content bereits
  vorhanden) — Hero-Kennzahlen, KPI-Raster, Navigation, Matrix
