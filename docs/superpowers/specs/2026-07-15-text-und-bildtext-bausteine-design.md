# Design: Bausteine Text und Bild+Text

Zwei neue Storyblok-Bausteine für den Florawerk-Bericht, analog zu den bestehenden
Content-Bausteinen aus Phase 6 (Statement, KpiGrid, Accordion, Timeline). Schemas
sind bereits in Storyblok angelegt (technische Namen `text_block` und `image_text`).

## Ziel

Bisher gibt es keinen einfachen Fließtext-Baustein und kein Bild+Text-Element —
beides wird für längere Erklärabschnitte im Bericht gebraucht, die nicht in eines
der bestehenden strukturierten Bausteine (KPI, Timeline, Akkordeon) passen.

## Baustein: `text_block` → `src/storyblok/TextBlock.astro`

**Storyblok-Felder** (bereits angelegt):
- `title` (Text, optional) — H2-Überschrift über dem Text
- `content` (Richtext, Pflicht)
- `width` (Single-Option: `narrow` | `full`) — `narrow` = schmale Lesespalte wie
  beim Statement-Zitat (~44rem), `full` = volle Container-Breite (~72rem)

**Verhalten:**
- Rendering via `renderRichText` (gleiches Pattern wie `AccordionItem.astro`/
  `TimelineItem.astro`)
- Fehlt `width`, wird `narrow` als Default angenommen (leeres Single-Option-Feld
  liefert `""`, nicht `undefined` — bekannter Storyblok-Fallstrick, siehe
  `KpiCard.astro`s `trend`-Fix aus Phase „Feinschliff"; hier mit `||` statt `??`
  behandeln)

## Baustein: `image_text` → `src/storyblok/ImageText.astro`

**Storyblok-Felder** (bereits angelegt):
- `title` (Text, optional)
- `image` (Asset, Pflicht) — Alt-Text kommt aus dem Asset selbst (`blok.image.alt`,
  gleiches Pattern wie `Statement.astro`)
- `text` (Richtext, Pflicht)
- `image_position` (Single-Option: `left` | `right`)

**Verhalten:**
- Desktop (≥1024px, gleicher Breakpoint wie `MaterialityMatrix`/`KpiGrid`):
  zweispaltiges Grid, Bild links oder rechts je nach `image_position`
- Mobil (<1024px): immer einspaltig, Bild oben, Text darunter — unabhängig vom
  gewählten `image_position`
- Leeres `image_position`-Feld fällt auf `left` zurück (gleicher `||`-Fallback wie
  bei `TextBlock`s `width`)
- Bild responsiv (`max-width: 100%`, `height: auto`), kein festes Seitenverhältnis
  vorgegeben (Redakteur lädt passend zugeschnittene Bilder hoch)

## Registrierung

Beide Bausteine in `astro.config.mjs` unter `components` eintragen:
```js
text_block: 'storyblok/TextBlock',
image_text: 'storyblok/ImageText',
```

`docs/storyblok-setup.md` wird um beide Bausteine in der Schema-Tabelle und in der
Liste der für `page.body` erlaubten Blocktypen ergänzt (Dokumentation nachziehen,
Schemas existieren in Storyblok bereits).

## Out of Scope

- Kein neues Layout-System — beide Bausteine nutzen ausschließlich bestehende
  Design-Tokens (`--space-*`, `--radius-*`, Farben), keine neuen Tokens nötig.
- Keine Änderung an bestehenden Bausteinen.
- "Schicker machen" (allgemeine Design-Politur) ist ein separates, noch offenes
  Thema — bewusst nicht Teil dieser Spec.

## Verifikation

- `npm run build` fehlerfrei
- Kombinierter Smoke-Test mit Beispiel-Bloks (wie in Phase „Feinschliff" für alle
  Bausteine gemeinsam durchgeführt)
- Live-Check auf `https://localhost:4321/`, sobald der Nutzer Instanzen der beiden
  Bausteine in die Home-Story einträgt
