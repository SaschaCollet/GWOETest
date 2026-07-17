# Storyblok-Einrichtung — Beispielbericht zusammensetzen

Schritt-für-Schritt-Anleitung für die Storyblok-Oberfläche (app.storyblok.com, Space
"Testspace"). Zwei Teile: **1)** Blok-Schemas anlegen, **2)** Home-Story mit den Inhalten
aus [beispielbericht.md](beispielbericht.md) befüllen.

Component-Typ in Storyblok: **Nestable Block** für alle unten aufgeführten Bloks (nicht
"Content Type" / Root, außer `page`, der schon existiert).

---

## 1. Blok-Schemas anlegen

Reihenfolge wichtig: erst die "Blätter" (werden in Blocks-Feldern referenziert), dann die
Container. Unter *Block Library → New Block* jeweils den technischen Namen (linke Spalte)
exakt so eintragen.

### `statement`
| Feld | Typ |
|---|---|
| `quote` | Textarea |
| `author` | Text |
| `author_role` | Text |
| `image` | Asset (Single) |

### `kpi_card`
| Feld | Typ |
|---|---|
| `label` | Text |
| `value` | Text |
| `unit` | Text |
| `previous_value` | Text |
| `trend` | Single-Option — Optionen: `up`, `down`, `neutral` |
| `link_target` | Text |
| `show_in_hero` | Boolean — steuert, ob diese Kachel oben in der "Auf einen Blick"-Übersicht erscheint (siehe Abschnitt 3a) |

### `kpi_grid`
| Feld | Typ |
|---|---|
| `title` | Text |
| `cards` | Blocks — Restrict to: `kpi_card` |
| `anchor` | Text (optional — erzeugt Sprungziel, siehe Abschnitt 3) |

### `chart_embed`
| Feld | Typ |
|---|---|
| `title` | Text |
| `embed_code` | Textarea |
| `caption` | Text |
| `alt_text` | Text |

### `accordion_item`
| Feld | Typ |
|---|---|
| `title` | Text |
| `content` | Richtext |

### `accordion`
| Feld | Typ |
|---|---|
| `title` | Text |
| `items` | Blocks — Restrict to: `accordion_item` |

### `timeline_item`
| Feld | Typ |
|---|---|
| `year` | Text |
| `title` | Text |
| `description` | Richtext |

### `timeline`
| Feld | Typ |
|---|---|
| `title` | Text |
| `items` | Blocks — Restrict to: `timeline_item` |

### `matrix_topic`
| Feld | Typ |
|---|---|
| `name` | Text |
| `x_position` | Number (0–100) |
| `y_position` | Number (0–100) |
| `description` | Richtext |
| `color` | Text (Hex-Farbwert, z. B. `#2f6d4f`) |

### `materiality_matrix`
| Feld | Typ |
|---|---|
| `title` | Text |
| `x_axis_label` | Text |
| `y_axis_label` | Text |
| `topics` | Blocks — Restrict to: `matrix_topic` |
| `anchor` | Text (optional — erzeugt Sprungziel, siehe Abschnitt 3) |

### `text_block`
| Feld | Typ |
|---|---|
| `title` | Text (optional) |
| `content` | Richtext |
| `width` | Single-Option — Optionen: `narrow`, `full` |

### `image_text`
| Feld | Typ |
|---|---|
| `title` | Text (optional) |
| `image` | Asset (Single) |
| `text` | Richtext |
| `image_position` | Single-Option — Optionen: `left`, `right` |

### `settings` (Root-Content-Type, kein Nestable Block — eine Story mit Slug `settings`)
| Feld | Typ |
|---|---|
| `font_heading` | Single-Option — Optionen: `serif_classic`, `serif_modern`, `sans_classic`, `sans_modern` |
| `font_body` | Single-Option — gleiche Optionen |
| `color_primary` | Text (Hex-Farbwert) |
| `color_secondary` | Text (Hex-Farbwert) |
| `logo` | Asset (Single) |

Details und Kontrastprüfung: siehe [docs/branding.md](branding.md).

### `stakeholder_block`
| Feld | Typ |
|---|---|
| `category_label` | Text — z. B. „Lieferant*innen:" |
| `headline` | Text |
| `text` | Richtext |
| `link_text` | Text — z. B. „Im Gesamtbericht weiterlesen…" |
| `link_url` | Text |
| `image` | Asset (Single) |
| `image_position` | Single-Option — Optionen: `left`, `right` |
| `audit_score` | Number (kann negativ sein) — Skala mit festen Stufengrenzen im Code (`StakeholderBlock.astro`): <0 Negativbereich · 0 Basislinie · 1–16 Erste Schritte · 17–33 Fortgeschritten · 34–65 Erfahren · 66–100 Vorbildlich |

### `page` (bereits vorhanden, ggf. prüfen)
| Feld | Typ |
|---|---|
| `body` | Blocks — Restrict to: `teaser`, `statement`, `kpi_grid`, `chart_embed`, `accordion`, `timeline`, `materiality_matrix`, `text_block`, `image_text`, `stakeholder_block` |

---

## 2. Home-Story befüllen

*Content → Home* öffnen. Den vorhandenen Platzhalter-Body (Teaser "Hello world!" + Grid)
löschen und folgende Bloks in dieser Reihenfolge in `body` hinzufügen (Inhalte 1:1 aus
[beispielbericht.md](beispielbericht.md)):

1. **statement** — Intro-Zitat (Dr. Miriam Vogt)
2. **image_text** „Über Florawerk" — `image_position` = `left`, beliebiges
   Platzhalterbild hochladen
3. **kpi_grid** „Klimabilanz 2025" (4× `kpi_card`) — **`anchor` = `klima`**
4. **chart_embed** „CO₂-Verlauf 2021–2025" — `embed_code` mit dem Datawrapper-Embed aus
   Abschnitt 5 befüllen
5. **timeline** „Meilensteine Klimastrategie" (5 Einträge 2021–2025)
6. **accordion** „Häufige Fragen zur Klimabilanz" (3 Einträge)
7. **kpi_grid** „Team 2025" (4× `kpi_card`) — **`anchor` = `mitarbeitende`**
8. **statement** — Zitat Jonas Reiter
9. **timeline** „Meilensteine Mitarbeitende" (4 Einträge)
10. **accordion** „Häufige Fragen zu Mitarbeitenden" (2 Einträge)
11. **materiality_matrix** „Wesentlichkeitsanalyse 2025" (8× `matrix_topic`) —
    **`anchor` = `matrix`**
12. **text_block** „Ausblick 2026" — `width` = `narrow`

Alle konkreten Texte, Zahlen und die 8 Matrix-Themen mit x/y-Position stehen in
[beispielbericht.md](beispielbericht.md) — dort einfach copy-pasten.

---

## 3. Warum `anchor`?

Die Navigation und die 4 Kennzahlen auf der Startseite verlinken auf `#klima`,
`#mitarbeitende`, `#matrix`. `src/storyblok/Page.astro` liest bei jedem Body-Blok ein
optionales `anchor`-Feld aus und wrapped den Blok automatisch in `<div id="...">` — daher
reicht es, das Feld nur bei `kpi_grid` und `materiality_matrix` anzulegen und bei den drei
genannten Bloks zu setzen. Kein Code-Änderung pro Baustein nötig.

---

## 3a. Warum `show_in_hero`?

Die 4 Kennzahlen ganz oben auf der Startseite ("Auf einen Blick") sind keine eigene
Content-Liste mehr, sondern werden automatisch aus den `kpi_card`-Bausteinen im
Body gesammelt — genau die, bei denen `show_in_hero` angehakt ist. Der Sprunglink
kommt vom `anchor`-Feld des übergeordneten `kpi_grid`. Um die ursprünglichen 4
Kennzahlen (CO₂, torffreie Substrate, Weiterbildung, Frauenanteil) wiederherzustellen,
bei genau diesen 4 `kpi_card`-Instanzen `show_in_hero` aktivieren.

---

## 5. Datawrapper-Embed für `chart_embed`

Fertiges Diagramm „Indirekte CO₂-Emissionen in t" — responsiver Embed-Code für das
`embed_code`-Feld (Textarea) des `chart_embed`-Bloks aus Abschnitt 2, Punkt 3:

```html
<iframe title="Indirekte CO2-Emissionen in t" aria-label="Tabelle" id="datawrapper-chart-sGeoJ" src="https://datawrapper.dwcdn.net/sGeoJ/3/" scrolling="no" frameborder="0" style="width: 0; min-width: 100% !important; border: none;" height="405" data-external="1"></iframe><script type="text/javascript">(function(){function e(){window.addEventListener(`message`,function(e){if(e.data[`datawrapper-height`]!==void 0){var t=document.querySelectorAll(`iframe`);for(var n in e.data[`datawrapper-height`])for(var r=0,i;i=t[r];r++)if(i.contentWindow===e.source){var a=e.data[`datawrapper-height`][n]+`px`;i.style.height=a}}})}e()})();</script>
```

Das eingebettete `<script>` hört auf `postMessage`-Events von Datawrapper und passt die
iframe-Höhe live an (verhindert Layout-Sprünge/abgeschnittene Inhalte bei
Inhaltsänderungen). `src/storyblok/ChartEmbed.astro` reserviert bis dahin per
`min-height` Platz und schneidet die iframe-Höhe **nicht** per CSS ab.

## 6. Veröffentlichen & prüfen

- Story **Publish** (oder als Draft belassen — die App liest hier `version: draft`,
  Preview funktioniert auch unveröffentlicht)
- `astro dev` starten (siehe [Einmalige Einrichtung](../AGENTS.md) für HTTPS/Zertifikat)
- Prüfen: 4 Kennzahlen auf der Startseite springen zum richtigen Kapitel, alle Bausteine
  erscheinen in der richtigen Reihenfolge
