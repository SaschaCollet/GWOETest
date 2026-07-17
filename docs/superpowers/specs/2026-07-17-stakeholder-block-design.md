# Design: Baustein Stakeholder-Block mit Audit-Skala

Neuer, mehrfach verwendbarer Baustein für Stakeholder-Abschnitte (Lieferant*innen,
Mitarbeitende, Kund*innen etc.) mit Illustration, Kurztext und einer 6-stufigen
Audit-Bewertungsskala. Schema ist bereits in Storyblok angelegt
(`stakeholder_block`).

## Felder (bereits in Storyblok angelegt)

| Feld | Typ |
|---|---|
| `category_label` | Text — z. B. "Lieferant*innen:" |
| `headline` | Text |
| `text` | Richtext |
| `link_text` | Text — z. B. "Im Gesamtbericht weiterlesen…" |
| `link_url` | Text |
| `image` | Asset (Single) |
| `image_position` | Single-Option — Optionen: `left`, `right` |
| `audit_score` | Number — kann negativ sein |

## Audit-Skala

6 fest im Code definierte Stufen (nicht in Storyblok editierbar — bewusste
Entscheidung des Nutzers: "im Backend festgelegt"):

| `audit_score` | Stufe |
|---|---|
| < 0 | Negativbereich |
| 0 | Basislinie |
| 1–16 | Erste Schritte |
| 17–33 | Fortgeschritten |
| 34–65 | Erfahren |
| 66–100 | Vorbildlich |

Alle 6 Segmente werden **gleich breit** dargestellt (wie in der Bildvorlage), nicht
proportional zur numerischen Wertespanne der jeweiligen Stufe. Die zur aktuellen
`audit_score` passende Stufe wird farblich hervorgehoben (`--color-secondary` als
Hintergrund, Kontrast zu den restlichen Segmenten in `--color-primary-light`), zeigt
den Prozentwert und einen kleinen Pfeil-Marker (`--color-accent`) darüber. Werte
außerhalb 0–100 werden auf die jeweils äußerste Stufe abgebildet (< 0 →
Negativbereich, kein Sonderfall für > 100 nötig, da Storyblok-Editor:innen ein
plausibles Prozent-Verständnis haben).

## Layout

Zweispaltig auf Desktop (≥1024px, gleicher Breakpoint wie `image_text`): Bild in
`image_position` (links/rechts, Default `left` bei leerem Storyblok-Wert — gleicher
`||`-Fallstrick wie bei `ImageText.astro`), Inhalt (Label, Headline, Text, Link,
Skala) in der anderen Spalte. Mobil: einspaltig, Bild oben, Inhalt darunter —
identisches Verhalten zu `image_text`.

## Barrierefreiheit

- Skala als `<ul role="list">` von Segment-`<li>`s, aktives Segment mit
  `aria-current="true"` markiert
- Zusätzlich ein `aria-label` auf dem Skala-Container, das Wert und Stufenname in
  einem zusammenhängenden Satz nennt (z. B. "Auditbewertung: 33 Prozent,
  Fortgeschritten") — die visuelle Darstellung (Pille + Zahl + Pfeil getrennt) wäre
  für Screenreader sonst nicht kohärent vorlesbar
- Link (`link_url`/`link_text`) ein normales `<a>`, kein Sonderfall nötig

## Was sich NICHT ändert

- Kein Overlap mit `image_text` — dieser Baustein hat deutlich mehr Struktur
  (Label, getrennte Headline, Link, Audit-Skala) und ersetzt `image_text` nicht.
- Keine neuen Design-Tokens — nutzt ausschließlich `--color-secondary`,
  `--color-primary-light`, `--color-accent`, bestehende Spacing-/Radius-Tokens.

## Verifikation

- `npm run build` fehlerfrei
- Smoke-Test mit mehreren `audit_score`-Werten (negativ, 0, 16, 17, 33, 34, 65, 66,
  100), prüfen dass jeweils die korrekte Stufe hervorgehoben wird
- Test mit `image_position: left` und `right`
- Live-Check auf `https://localhost:4321/`, sobald der Nutzer eine Instanz mit
  echten Inhalten in die Story einträgt
