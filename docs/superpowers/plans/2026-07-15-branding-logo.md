# Wiederverwendbares Branding (Logo, Farben, Schriften) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Eine Logo-Komponente mit automatischem Text-Fallback bauen und die
bestehende Farben-/Schriften-Anpassung dokumentieren, damit das Template einfach für
neue Kundenprojekte wiederverwendbar ist.

**Architecture:** Neue Komponente `src/components/Logo.astro` prüft zur Build-Zeit per
`fs.existsSync`, ob `public/logo.svg` existiert, und rendert Bild oder Text-Fallback.
Eingebunden in `Navigation.astro` und `Footer.astro`. Kein neuer Konfigurations-Layer.

**Tech Stack:** Astro (Node-Frontmatter), bestehendes CSS-Token-System.

**Spec:** [docs/superpowers/specs/2026-07-15-branding-logo-design.md](../specs/2026-07-15-branding-logo-design.md)

---

### Task 1: Logo-Komponente

**Files:**
- Create: `src/components/Logo.astro`

- [ ] **Step 1: Komponente anlegen**

Erstelle `src/components/Logo.astro` mit exakt diesem Inhalt:

```astro
---
import fs from 'node:fs';
import path from 'node:path';

interface Props {
  fallbackText: string;
  height?: string;
}

const { fallbackText, height = '2rem' } = Astro.props;
const hasLogo = fs.existsSync(path.join(process.cwd(), 'public/logo.svg'));
---

{
  hasLogo ? (
    <img src="/logo.svg" alt={fallbackText} style={`height: ${height}; width: auto;`} />
  ) : (
    <span>{fallbackText}</span>
  )
}
```

- [ ] **Step 2: Build verifizieren (ohne Logo-Datei — aktueller Zustand)**

Run: `npm run build`
Expected: `Complete!` ohne Fehler. (Es gibt noch keine Einbindung in Navigation/Footer,
dieser Schritt prüft nur, dass die neue Datei syntaktisch gültig ist und den Build
nicht bricht.)

Run: `rm -rf dist`

- [ ] **Step 3: Commit**

```bash
git add src/components/Logo.astro
git commit -m "feat: Logo-Komponente mit Text-Fallback"
```

---

### Task 2: Logo in Navigation einbinden

**Files:**
- Modify: `src/components/Navigation.astro`

- [ ] **Step 1: Import ergänzen**

In `src/components/Navigation.astro`, nach der bestehenden Zeile
`import ScrollProgress from './ScrollProgress.astro';` ergänzen:

```astro
import Logo from './Logo.astro';
```

- [ ] **Step 2: Brand-Link auf Logo umstellen**

Ersetze:

```astro
      <a href="#main-content" class="site-nav__brand">{reportTitle}</a>
```

durch:

```astro
      <a href="#main-content" class="site-nav__brand">
        <Logo fallbackText={reportTitle} height="2rem" />
      </a>
```

(`.site-nav__brand`s bestehende CSS-Regel — `font-family`, `font-weight`, `color` —
gilt weiterhin für den `<a>`-Tag selbst und vererbt sich auf den Text-Fallback der
Logo-Komponente; für das `<img>` wird die Höhe explizit über die `height`-Prop
gesteuert, da `height` keine vererbbare CSS-Eigenschaft ist.)

- [ ] **Step 3: Build verifizieren**

Run: `npm run build`
Expected: `Complete!` ohne Fehler.

Run:
```bash
grep -o "Nachhaltigkeitsbericht 2025" dist/index.html | head -1
```
Expected: ein Treffer (Text-Fallback erscheint, da `public/logo.svg` noch nicht
existiert).

Run: `rm -rf dist`

- [ ] **Step 4: Commit**

```bash
git add src/components/Navigation.astro
git commit -m "feat: Logo-Komponente in Navigation eingebunden"
```

---

### Task 3: Logo im Footer einbinden

**Files:**
- Modify: `src/components/Footer.astro`

- [ ] **Step 1: Import ergänzen**

In `src/components/Footer.astro`, als erste Zeile im Frontmatter (aktuell leer)
ergänzen:

```astro
import Logo from './Logo.astro';
```

- [ ] **Step 2: Markup anpassen**

Ersetze:

```astro
<footer class="site-footer">
  <div class="container site-footer__row">
    <p>&copy; {new Date().getFullYear()} Florawerk GmbH</p>

    <ul role="list" class="site-footer__links">
```

durch:

```astro
<footer class="site-footer">
  <div class="container site-footer__row">
    <div class="site-footer__brand">
      <Logo fallbackText="Florawerk GmbH" height="1.5rem" />
      <p>&copy; {new Date().getFullYear()} Florawerk GmbH</p>
    </div>

    <ul role="list" class="site-footer__links">
```

- [ ] **Step 3: CSS für die neue Wrapper-Klasse ergänzen**

In `src/components/Footer.astro`, nach der bestehenden Regel `.site-footer__row { ... }`
ergänzen:

```css
  .site-footer__brand {
    display: flex;
    align-items: center;
    gap: var(--space-3);
  }
```

- [ ] **Step 4: Build verifizieren**

Run: `npm run build`
Expected: `Complete!` ohne Fehler.

Run: `rm -rf dist`

- [ ] **Step 5: Commit**

```bash
git add src/components/Footer.astro
git commit -m "feat: Logo-Komponente im Footer eingebunden"
```

---

### Task 4: Branding-Dokumentation

**Files:**
- Create: `docs/branding.md`

- [ ] **Step 1: Dokument anlegen**

Erstelle `docs/branding.md` mit exakt diesem Inhalt:

```markdown
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
```

- [ ] **Step 2: Commit**

```bash
git add docs/branding.md
git commit -m "docs: Branding-Anleitung für Farben, Schriften, Logo"
```

---

### Task 5: Logo-Fallback-Verifikation (mit und ohne Datei)

**Files:** keine (nur Verifikation, kein Produktionscode)

- [ ] **Step 1: Build ohne Logo-Datei prüfen (aktueller Zustand)**

Run: `npm run build`

Run:
```bash
grep -c "Nachhaltigkeitsbericht 2025" dist/index.html
grep -c "Florawerk GmbH" dist/index.html
grep -c "<img src=\"/logo.svg\"" dist/index.html
```
Expected: erste zwei Greps liefern jeweils mindestens 1 Treffer (Text-Fallback in
Nav und Footer), dritter Grep liefert 0 Treffer (kein `<img>`, da keine Datei
vorhanden).

Run: `rm -rf dist`

- [ ] **Step 2: Build mit Test-Logo-Datei prüfen**

Run:
```bash
echo '<svg xmlns="http://www.w3.org/2000/svg" width="100" height="40"><rect width="100" height="40" fill="#1f6f78"/></svg>' > public/logo.svg
npm run build
```

Run:
```bash
grep -c "<img src=\"/logo.svg\"" dist/index.html
```
Expected: mindestens 2 Treffer (Navigation + Footer).

- [ ] **Step 3: Test-Logo-Datei wieder entfernen**

```bash
rm public/logo.svg
rm -rf dist
git status --short
```
Expected: `git status --short` zeigt `public/logo.svg` **nicht** mehr an (Datei war
nur für den Test da, das Template soll ohne mitgeliefertes Logo ausgeliefert werden,
siehe Spec).

- [ ] **Step 4: Kein Commit nötig für diesen Task**

(Reine Verifikation, Test-Datei wurde in Step 3 bereits entfernt.)

---

## Self-Review

- **Spec-Abdeckung:** Logo-Komponente (Task 1), Einbindung Navigation (Task 2) und
  Footer (Task 3), Dokumentation (Task 4), Fallback-Verifikation beider Zustände
  (Task 5) — alle Spec-Abschnitte abgedeckt. Out-of-Scope (Web-Fonts, Logo in
  Content-Bausteinen, Konfigurationsdatei) bewusst nicht enthalten.
- **Keine Platzhalter:** Vollständiger Code in jedem Schritt.
- **Konsistenz:** `fallbackText`/`height`-Props identisch benannt in Task 1, 2, 3.
  `public/logo.svg`-Pfad identisch in Logo.astro, branding.md und Task 5.
