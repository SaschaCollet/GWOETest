# Design: Bausteine „Große Zahl" und „Balkendiagramm"

Zwei neue Storyblok-Bausteine. Schemas und je ein Beispiel-Blok sind bereits in der
Home-Story angelegt und verifiziert (`big_stat`, `bar_chart` + `bar_chart_item`).

## Baustein `big_stat` → `src/storyblok/BigStat.astro`

**Felder (bereits angelegt):**
- `value` (Text) — die große Zahl, z. B. „100%"
- `caption` (Richtext) — Satz darunter, mit Formatierung/Links

**Verhalten:** Zentriert, `value` in großer Heading-Schrift (deutlich größer als
`--font-size-3xl`, z. B. 5rem), `caption` klein, gedämpfte Farbe, mittig darunter,
via `renderRichText` gerendert (gleiches Pattern wie `AccordionItem.astro`).

## Baustein `bar_chart` + `bar_chart_item` → `src/storyblok/BarChart.astro`

**Felder (bereits angelegt):**
- `bar_chart`: `title` (Text, optional), `bars` (Blocks — Restrict to:
  `bar_chart_item`)
- `bar_chart_item`: `icon` (Asset), `label` (Text, unter dem Icon), `value`
  (Number — kommt als String aus der API, `Number(...)` nötig), `value_label`
  (Text, rechts angezeigt)

**Architektur-Besonderheit:** `bar_chart_item` wird **nicht** über
`<StoryblokComponent>` aufgelöst — `BarChart.astro` liest `blok.bars` direkt und
berechnet `maxValue = Math.max(...bars.map(b => Number(b.value) || 0))`, um die
Balkenbreite jedes Balkens relativ zum größten Wert zu bestimmen
(`(value / maxValue) * 100`). Das ist nur möglich, wenn die Elternkomponente die
Rohdaten aller Geschwister-Bloks direkt einliest, statt jedes Kind isoliert über
die generische Komponenten-Auflösung zu rendern — gleiches Muster wie
`collectHeroKpis()` in `Page.astro`. `bar_chart_item` bleibt trotzdem als
Storyblok-Schema nötig (für das Blocks-Feld im CMS), bekommt aber keinen Eintrag in
`astro.config.mjs`s `components`-Map und keine eigene `.astro`-Datei.

**Layout pro Balken-Zeile** (3-spaltig, CSS Grid `auto 1fr auto`):
1. Icon (Bild) mit Label-Text darunter (kleine, zentrierte Spalte)
2. Horizontaler Balken (Track + Fill, Fill-Breite = berechneter Prozentsatz)
3. `value_label` rechts

`storyblokEditable` wird manuell auf jede Balken-Zeile gespreadet (nicht über eine
Kind-Komponente), damit der Visual Editor trotzdem pro Balken klickbar bleibt.

## Barrierefreiheit

- Icon-`alt` kommt aus dem Asset-Feld selbst (Default `''`, gleiches Pattern wie
  `Statement.astro`/`ImageText.astro`) — Label-Text daneben trägt die eigentliche
  Bedeutung
- Balken-Fill ist rein dekorativ (`aria-hidden="true"`), der numerische Wert steht
  bereits sichtbar als `value_label`-Text im DOM — keine zusätzliche ARIA-Semantik
  nötig, da alle Informationen bereits als normaler Text vorhanden sind

## Was sich NICHT ändert

- Kein Overlap mit `kpi_card`/`kpi_grid` — `big_stat` ist bewusst eine
  randlose, zentrierte "Editorial"-Darstellung, kein Dashboard-Kachel-Look.
- Keine neuen Design-Tokens.

## Verifikation

- `npm run build` fehlerfrei
- Smoke-Test: `bar_chart` mit 3 Balken unterschiedlicher Werte, prüfen dass die
  berechneten Breiten korrekt relativ zum Maximalwert sind (z. B. Werte 10/40/80 →
  Breiten 12.5%/50%/100%)
- Live-Check auf `https://localhost:4321/` mit den bereits vorhandenen
  Beispiel-Bloks
