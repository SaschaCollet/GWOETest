# Design: Wiederverwendbares Branding (Logo, Farben, Schriften)

Macht das Template für zukünftige Kundenprojekte einfacher anpassbar: eine Logo-Komponente
mit automatischem Text-Fallback, plus eine dedizierte Dokumentation für Farben/Schriften
(Mechanismus existiert bereits seit Phase 4, war aber nicht dokumentiert).

## Ziel

Ein neues Kundenprojekt aus diesem Template soll ohne Code-Kenntnisse an drei Stellen
anpassbar sein: Farben, Schriften, Logo. Kein neuer Konfigurations-Layer — bewusst auf
den bestehenden CSS-Custom-Property-Mechanismus aufgesetzt (YAGNI: kein
Build-Time-Config-System für etwas, das CSS-Variablen bereits lösen).

## Logo: `src/components/Logo.astro`

**Verhalten:**
- Prüft zur Build-Zeit (Astro-Frontmatter läuft in Node) via `fs.existsSync`, ob
  `public/logo.svg` existiert.
- Existiert die Datei: `<img src="/logo.svg" alt={fallbackText} />`
- Existiert sie nicht: `<span>{fallbackText}</span>` (aktuelles Verhalten, keine
  Regression für Projekte ohne eigenes Logo)
- Props: `fallbackText` (Pflicht, der Text der ohne Logo angezeigt wird), `height`
  (optional, Default `"2rem"`, per Inline-Style statt Scoped-CSS — vermeidet den
  Astro-Fallstrick, dass Scoped Styles der Eltern-Komponente nicht auf Elemente
  wirken, die eine Kind-Komponente rendert)

**Einbindung:**
- `src/components/Navigation.astro`: ersetzt den bisherigen Text-Link
  (`<a class="site-nav__brand">{reportTitle}</a>`) — `<a>` bleibt als Wrapper,
  `<Logo fallbackText={reportTitle} />` innen
- `src/components/Footer.astro`: zusätzlich, kleiner (`height="1.5rem"`), neben dem
  Copyright-Text

**Warum SVG und Text-Fallback (statt Platzhalterbild):** SVG ist verlustfrei
skalierbar und die übliche Lieferform für Firmenlogos. Text-Fallback statt
mitgeliefertem Platzhalterbild hält das Template sofort einsatzbereit ohne
Logo-Upload — kein „totes" Platzhalterbild, das jemand vergisst zu ersetzen.

## Farben & Schriften: `docs/branding.md` (neu)

Dokumentiert den bereits bestehenden Mechanismus (`src/styles/tokens.css`,
`:root`-Block, Kommentar „HIER Kundenfarben/-schriften eintragen" seit Phase 4):

- Welche Variablen für Primär-/Sekundärfarbe/Akzent zuständig sind
- WCAG-AA-Kontrastprüfung als Copy-paste-Python-Snippet (gleiches Muster wie bei der
  Teal-Palette-Änderung), damit neue Farben nicht versehentlich unter 4.5:1 fallen
- Schriften: nur Austausch des Font-Namens (System-/bereits verfügbare Schriften),
  **kein** Laden externer Web-Fonts — explizit als Grenze dokumentiert
- Hinweis: Berichtstitel und Kapitelnamen stehen aktuell fest in
  `src/storyblok/Page.astro` (`chapters`, `kpis`, `title`-Prop an `HeroOverview`) —
  für ein neues Kundenprojekt manuell anzupassen. Nicht Teil dieser Änderung, nur
  als Fundstelle dokumentiert, damit es bei der Wiederverwendung nicht übersehen wird.

## Out of Scope

- Kein Web-Font-Loading (Google Fonts, `@font-face`, selbst gehostete Font-Dateien)
- Kein Logo im Bild+Text- oder anderen Content-Bausteinen
- Keine Auslagerung von Berichtstitel/Kapitelnamen in Storyblok-Felder oder eine
  Konfigurationsdatei — nur dokumentiert als bekannte Fundstelle

## Verifikation

- `npm run build` fehlerfrei, sowohl mit als auch ohne `public/logo.svg` (Fallback
  testen: einmal mit Testdatei bauen, einmal ohne)
- Live-Check auf `https://localhost:4321/`: Logo/Fallback erscheint korrekt in
  Navigation und Footer
