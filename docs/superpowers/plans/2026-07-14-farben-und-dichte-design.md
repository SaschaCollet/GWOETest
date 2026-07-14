# Farben & Layout-Dichte (Teal + Scharf/Editorial) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Design-Tokens von der aktuellen Waldgrün/Weich-Optik auf eine Teal-Palette
mit scharfer, editorialer Kartenoptik (0 Radius, kein weicher Schatten) umstellen —
als Test dafür, dass das Token-System aus Phase 4 tatsächlich zentral austauschbar ist.

**Architecture:** Reine CSS-Custom-Property-Änderung in `src/styles/tokens.css`
(Farben, Radien, Schatten) plus zwei gezielte Komponenten-Anpassungen
(`KpiCard.astro`, `HeroOverview.astro`) für den Akzentstreifen aus der genehmigten
Vorschau. Kein neuer Code, keine neuen Abhängigkeiten.

**Tech Stack:** Astro, CSS Custom Properties (bestehendes Token-System).

**Spec:** [docs/superpowers/specs/2026-07-14-farben-und-dichte-design.md](../specs/2026-07-14-farben-und-dichte-design.md)

---

### Task 1: Farb-Tokens auf Teal umstellen

**Files:**
- Modify: `src/styles/tokens.css:8-16` (Light-Mode-Farben)
- Modify: `src/styles/tokens.css:76-85` (Dark-Mode-Override)

- [ ] **Step 1: Kontrastwerte verifizieren, bevor etwas geändert wird**

Run:
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
def contrast(a,b):
    l1,l2 = relative_luminance(hex_to_rgb(a)), relative_luminance(hex_to_rgb(b))
    hi,lo = max(l1,l2), min(l1,l2)
    return (hi+0.05)/(lo+0.05)

checks = [
    ("primary/white", "#1f6f78", "#ffffff"),
    ("secondary/white", "#ad6524", "#ffffff"),
    ("dark primary/bg", "#34bbcb", "#1a1a18"),
]
for name, a, b in checks:
    ratio = contrast(a, b)
    status = "OK" if ratio >= 4.5 else "FAIL"
    print(f"{name}: {ratio:.2f} {status}")
EOF
```

Expected output: alle drei Zeilen enden mit `OK` (Werte ca. 5.83, 4.50, 7.57).
Falls `FAIL` erscheint: Wert nicht übernehmen, sondern in der Spec-Tabelle
nachschlagen bzw. neu berechnen — nicht einfach den Mockup-Wert nehmen.

- [ ] **Step 2: Light-Mode-Farbtokens ändern**

In `src/styles/tokens.css`, ersetze den Block:

```css
  /* Auf WCAG-AA-Textkontrast (4.5:1) gegen --color-background geprüft */
  --color-secondary: #9b6d39;
  --color-accent: #3d7ea6;

  --color-success: #2f6d4f;
  --color-warning: #996f09;
  --color-danger: #b3421f;
```

durch:

```css
  /* Auf WCAG-AA-Textkontrast (4.5:1) gegen --color-background geprüft */
  --color-secondary: #ad6524;
  --color-accent: #3d7ea6;

  --color-success: #1f6f78;
  --color-warning: #996f09;
  --color-danger: #b3421f;
```

Und den Block:

```css
  --color-primary: #2f6d4f;
  --color-primary-dark: #1f4d38;
  --color-primary-light: #e5f0ea;
```

durch:

```css
  --color-primary: #1f6f78;
  --color-primary-dark: #154e54;
  --color-primary-light: #e3eef0;
```

- [ ] **Step 3: Dark-Mode-Override anpassen**

In `src/styles/tokens.css`, im `@media (prefers-color-scheme: dark)`-Block, ersetze:

```css
    /* Aufgehellt: #2f6d4f fällt auf dunklem Hintergrund unter 4.5:1 Textkontrast */
    --color-primary: #4db281;
    --color-success: #4db281;
```

durch:

```css
    /* Aufgehellt: #1f6f78 fällt auf dunklem Hintergrund unter 4.5:1 Textkontrast */
    --color-primary: #34bbcb;
    --color-success: #34bbcb;
```

- [ ] **Step 4: Build verifizieren**

Run: `npm run build`
Expected: `Complete!` ohne Fehler (wie in jedem vorherigen Phasen-Commit).

Run: `rm -rf dist`

- [ ] **Step 5: Commit**

```bash
git add src/styles/tokens.css
git commit -m "feat(design): Farb-Tokens auf Teal-Palette umgestellt

Testvariante aus Brainstorming-Session (docs/superpowers/specs/2026-07-14-farben-und-dichte-design.md).
Alle Werte gegen WCAG-AA-Kontrast (4.5:1) verifiziert."
```

---

### Task 2: Radien und Schatten auf scharfe Optik umstellen

**Files:**
- Modify: `src/styles/tokens.css:58-67`

- [ ] **Step 1: Radien-Tokens ändern**

Ersetze:

```css
  /* Eckenradien */
  --radius-sm: 0.25rem;
  --radius-md: 0.5rem;
  --radius-lg: 1rem;
  --radius-full: 999px;
```

durch:

```css
  /* Eckenradien */
  --radius-sm: 0;
  --radius-md: 0;
  --radius-lg: 0;
  --radius-full: 999px;
```

`--radius-full` bleibt unverändert — wird für runde Elemente (Avatar-Bild in
Statement.astro, Matrix-Punkte in MatrixTopic.astro) gebraucht, die auch in der
scharfen Variante rund bleiben sollen.

- [ ] **Step 2: Schatten-Tokens ändern**

Ersetze:

```css
  /* Schatten */
  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.06);
  --shadow-md: 0 4px 12px rgba(0, 0, 0, 0.08);
  --shadow-lg: 0 12px 32px rgba(0, 0, 0, 0.12);
```

durch:

```css
  /* Schatten: scharfer 1px-Ring statt weichem Blur (Editorial-Look) */
  --shadow-sm: 0 0 0 1px rgba(0, 0, 0, 0.06);
  --shadow-md: 0 0 0 1px rgba(0, 0, 0, 0.12);
  --shadow-lg: 0 0 0 1px rgba(0, 0, 0, 0.18);
```

- [ ] **Step 3: Build verifizieren**

Run: `npm run build`
Expected: `Complete!` ohne Fehler.

Run: `rm -rf dist`

- [ ] **Step 4: Commit**

```bash
git add src/styles/tokens.css
git commit -m "feat(design): Radien und Schatten auf scharfe Editorial-Optik umgestellt

0 Radius statt weicher Rundungen, 1px-Ring-Schatten statt Blur. --radius-full
bleibt für runde Elemente (Avatare, Matrix-Punkte) unverändert."
```

---

### Task 3: Akzentstreifen an KPI-Kacheln (KpiCard.astro)

**Files:**
- Modify: `src/storyblok/KpiCard.astro`

- [ ] **Step 1: Aktuellen Style-Block lesen**

Run: `grep -n "\.kpi-card {" -A 12 src/storyblok/KpiCard.astro`

Erwarteter aktueller Inhalt (Zeilen können leicht abweichen):

```css
  .kpi-card {
    display: flex;
    flex-direction: column;
    gap: var(--space-2);
    padding: var(--space-6);
    background: var(--color-surface);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-lg);
    text-decoration: none;
    color: var(--color-text);
  }
```

- [ ] **Step 2: Akzentstreifen ergänzen**

Ersetze die Zeile `border: 1px solid var(--color-border);` durch:

```css
    border: 1px solid var(--color-border);
    border-inline-start: 3px solid var(--color-primary);
```

(Ergebnis: Karte behält den umlaufenden 1px-Rahmen, zusätzlich ein 3px breiter
Akzentstreifen auf der Startseite — links in LTR.)

- [ ] **Step 3: Build verifizieren**

Run: `npm run build`
Expected: `Complete!` ohne Fehler.

Run: `rm -rf dist`

- [ ] **Step 4: Commit**

```bash
git add src/storyblok/KpiCard.astro
git commit -m "feat(design): Akzentstreifen an KPI-Kacheln (Editorial-Look)"
```

---

### Task 4: Akzentstreifen an Hero-Kennzahlen (HeroOverview.astro)

**Files:**
- Modify: `src/components/HeroOverview.astro`

- [ ] **Step 1: Aktuellen Style-Block lesen**

Run: `grep -n "\.hero__kpi {" -A 10 src/components/HeroOverview.astro`

Erwarteter aktueller Inhalt:

```css
  .hero__kpi {
    display: flex;
    flex-direction: column;
    gap: var(--space-1);
    padding: var(--space-6);
    background: var(--color-surface);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-lg);
    text-decoration: none;
    color: var(--color-text);
    transition: transform 0.15s ease, box-shadow 0.15s ease;
  }
```

- [ ] **Step 2: Akzentstreifen ergänzen**

Ersetze die Zeile `border: 1px solid var(--color-border);` durch:

```css
    border: 1px solid var(--color-border);
    border-inline-start: 3px solid var(--color-primary);
```

- [ ] **Step 3: Build verifizieren**

Run: `npm run build`
Expected: `Complete!` ohne Fehler.

Run: `rm -rf dist`

- [ ] **Step 4: Commit**

```bash
git add src/components/HeroOverview.astro
git commit -m "feat(design): Akzentstreifen an Hero-Kennzahlen (Editorial-Look)"
```

---

### Task 5: Live-Verifikation auf dem laufenden Dev-Server

**Files:** keine (nur Prüfung)

- [ ] **Step 1: Live-Seite abrufen**

Der Dev-Server läuft bereits (siehe vorherige Session, `astro dev` auf
`https://localhost:4321/`, Storyblok-Cache ist deaktiviert — kein Neustart nötig).

Run:
```bash
curl -sk https://localhost:4321/ --max-time 5 -o /tmp/design-check.html
grep -o "background-color:#1f6f78\|#1f6f78" /tmp/design-check.html | head -1
```

Expected: mindestens ein Treffer für `#1f6f78` (bestätigt, dass die neue
Teal-Farbe im ausgelieferten CSS ankommt).

Falls kein Treffer: `astro dev status` prüfen, ob der Server noch läuft; bei Bedarf
Nutzer bitten, `astro dev` neu zu starten (kein `sudo`-Prompt mehr nötig, Zertifikat
ist bereits vertraut).

- [ ] **Step 2: Nutzer um visuelle Bestätigung bitten**

Bitte den Nutzer, `https://localhost:4321/` im Browser neu zu laden und zu
bestätigen, dass Teal-Farbe, scharfe Ecken und Akzentstreifen wie in der
genehmigten Vorschau aussehen.

---

## Self-Review

- **Spec-Abdeckung:** Farb-Tokens (Task 1), Radien/Schatten (Task 2), die zwei
  genannten Komponenten-Änderungen (Task 3+4), Verifikation (Task 5) — alle
  Spec-Abschnitte abgedeckt. Out-of-Scope-Punkte (Spacing, Typografie, Accent/
  Danger/Warning) bewusst nicht in Tasks enthalten.
- **Keine Platzhalter:** Alle Werte, Dateipfade und Befehle sind konkret.
- **Konsistenz:** `--color-primary: #1f6f78` und `#34bbcb` (Dark-Mode) stimmen in
  Task 1 und der Spec-Tabelle überein. `border-inline-start` in Task 3 und 4
  identisch formuliert.
