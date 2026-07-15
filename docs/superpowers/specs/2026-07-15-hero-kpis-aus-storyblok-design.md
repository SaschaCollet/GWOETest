# Design: Hero-Kennzahlen aus Storyblok ableiten

Löst eine Content-Duplikation: die 4 Kennzahlen in der "Auf einen Blick"-Übersicht
oben auf der Startseite sind aktuell fest in `src/storyblok/Page.astro` eingetragen
und unabhängig von den `kpi_card`-Bausteinen im eigentlichen Body — Änderungen in
Storyblok wirken sich nicht auf die Hero-Zahlen aus.

## Ziel

Genau eine Quelle für KPI-Werte: die `kpi_card`-Bausteine im Story-Body. Die Hero-
Übersicht zeigt automatisch die Kacheln, die ein Redakteur in Storyblok dafür markiert.

## Mechanismus

**Neues Feld auf `kpi_card`:** `show_in_hero` (Boolean, Default aus).

**`Page.astro`** durchläuft `blok.body`, findet alle `kpi_grid`-Bloks, iteriert deren
`cards`, und sammelt jede `kpi_card` mit `show_in_hero: true` zu einem Hero-Eintrag:
- `label` = `card.label`
- `value` = `card.value` + (falls vorhanden) `" " + card.unit`
- `href` = `#` + `anchor` des übergeordneten `kpi_grid`, falls dort ein `anchor`
  gesetzt ist — sonst Fallback auf `#main-content`

Anzahl der Hero-Kacheln ist **nicht auf 4 begrenzt** — das Grid in `HeroOverview.astro`
ist bereits responsiv (1/2/4 Spalten je nach Breite) und verträgt eine beliebige
Anzahl. Sind keine Kacheln markiert, bleibt die Hero-Sektion mit Titel/Untertitel,
aber ohne Kacheln (kein Sonderfall-Code nötig, `.hero__grid` ist dann einfach leer).

**`HeroOverview.astro`:** `Kpi.href` wird optional (`href?: string`), da nicht jede
`kpi_grid`-Instanz zwingend ein `anchor`-Feld gesetzt hat.

## Was sich NICHT ändert

- `chapters` (Navigation) bleibt weiterhin fest in `Page.astro` — nicht Teil dieser
  Anfrage, betrifft nur die Doppelung bei den KPI-Werten.
- Kein neues Feld am `page`-Root-Blok — die Auswahl passiert ausschließlich über das
  neue Feld direkt an den bestehenden `kpi_card`-Instanzen.
- `KpiCard.astro` (der Baustein im Chapter-Body selbst) ändert sich nicht.

## Migration für den Nutzer (nicht Teil des Codes, aber zu dokumentieren)

1. Feld `show_in_hero` (Boolean) im `kpi_card`-Schema in Storyblok ergänzen
2. Bei genau den 4 Kacheln, die aktuell oben auf der Seite stehen sollen (CO₂,
   torffreie Substrate, Weiterbildung, Frauenanteil), das Häkchen setzen

## Verifikation

- `npm run build` fehlerfrei
- Smoke-Test mit synthetischen Bloks: mehrere `kpi_grid` mit gemischt
  markierten/unmarkierten `kpi_card`s, prüfen dass genau die markierten (und nur
  diese) im Hero erscheinen, mit korrektem Sprungziel
- Live-Check auf `https://localhost:4321/` und der Netlify-Deployment-URL, nachdem
  der Nutzer das Feld in Storyblok ergänzt und gesetzt hat
