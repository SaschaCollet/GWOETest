# Branding-Einstellungen aus Storyblok Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Farben, Schriften und Logo aus der bereits angelegten Storyblok-Story
`settings` laden, statt aus `tokens.css`/`public/logo.svg` — CMS-editierbar ohne
Code-Zugriff.

**Architecture:** Neue Hilfsfunktion `src/lib/settings.ts` kapselt Fetch + Fallback.
`BaseLayout.astro` setzt Farben/Schriften als Inline-`style` auf `<html>` (höchste
Spezifität, unabhängig von Astros CSS-Bundling). `Page.astro` reicht die Logo-URL an
`Navigation`/`Footer` durch. `Logo.astro` wird von dateibasiert auf prop-basiert
umgestellt.

**Tech Stack:** Astro, `@storyblok/astro`.

**Spec:** [docs/superpowers/specs/2026-07-16-storyblok-settings-design.md](../specs/2026-07-16-storyblok-settings-design.md)

---

### Task 1: Settings-Hilfsfunktion

**Files:**
- Create: `src/lib/settings.ts`

- [ ] **Step 1: Verzeichnis und Datei anlegen**

Run: `mkdir -p src/lib`

Erstelle `src/lib/settings.ts` mit exakt diesem Inhalt:

```ts
import { useStoryblokApi } from '@storyblok/astro';

export interface SiteSettings {
  font_heading?: string;
  font_body?: string;
  color_primary?: string;
  color_secondary?: string;
  logo?: { filename?: string; alt?: string };
}

const FONT_STACKS: Record<string, string> = {
  serif_classic: `'Georgia', 'Iowan Old Style', serif`,
  serif_modern: `'Times New Roman', Times, serif`,
  sans_modern: `-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif`,
  sans_classic: `Arial, Helvetica, sans-serif`,
};

export async function getSiteSettings(): Promise<SiteSettings | null> {
  try {
    const storyblokApi = useStoryblokApi();
    const { data } = await storyblokApi.get('cdn/stories/settings', {
      version: import.meta.env.PROD ? 'published' : 'draft',
    });
    return data.story.content as SiteSettings;
  } catch {
    // Einstellungen-Story existiert (noch) nicht oder ist nicht veröffentlicht —
    // Template läuft mit den Standardwerten aus tokens.css weiter, kein Build-Abbruch.
    return null;
  }
}

export function resolveFontStack(key?: string): string | undefined {
  return key ? FONT_STACKS[key] : undefined;
}
```

- [ ] **Step 2: Build verifizieren**

Run: `npm run build`
Expected: `Complete!` ohne Fehler. (Die Funktion wird noch nirgends aufgerufen,
dieser Schritt prüft nur, dass die Datei syntaktisch gültig ist.)

Run: `rm -rf dist`

- [ ] **Step 3: Commit**

```bash
git add src/lib/settings.ts
git commit -m "feat: Settings-Hilfsfunktion für Storyblok-Branding-Story"
```

---

### Task 2: Logo.astro, Navigation.astro, Footer.astro auf Storyblok-Logo umstellen

**Files:**
- Modify: `src/components/Logo.astro`
- Modify: `src/components/Navigation.astro`
- Modify: `src/components/Footer.astro`
- Delete: `public/logo.svg`

- [ ] **Step 1: Logo.astro auf src-Prop umstellen**

Ersetze den kompletten Inhalt von `src/components/Logo.astro` durch:

```astro
---
interface Props {
  fallbackText: string;
  height?: string;
  src?: string;
}

const { fallbackText, height = '2rem', src } = Astro.props;
---

{
  src ? (
    <img src={src} alt={fallbackText} style={`height: ${height}; width: auto;`} />
  ) : (
    <span>{fallbackText}</span>
  )
}
```

- [ ] **Step 2: Navigation.astro — logoSrc-Prop ergänzen**

Ersetze:

```astro
interface Props {
  chapters: Chapter[];
  reportTitle?: string;
}

const { chapters, reportTitle = 'Nachhaltigkeitsbericht 2025' } = Astro.props;
```

durch:

```astro
interface Props {
  chapters: Chapter[];
  reportTitle?: string;
  logoSrc?: string;
}

const { chapters, reportTitle = 'Nachhaltigkeitsbericht 2025', logoSrc } = Astro.props;
```

Ersetze:

```astro
      <a href="#main-content" class="site-nav__brand">
        <Logo fallbackText={reportTitle} height="2rem" />
      </a>
```

durch:

```astro
      <a href="#main-content" class="site-nav__brand">
        <Logo fallbackText={reportTitle} height="2rem" src={logoSrc} />
      </a>
```

- [ ] **Step 3: Footer.astro — logoSrc-Prop ergänzen**

Ersetze:

```astro
---
import Logo from './Logo.astro';
---
```

durch:

```astro
---
import Logo from './Logo.astro';

interface Props {
  logoSrc?: string;
}

const { logoSrc } = Astro.props;
---
```

Ersetze:

```astro
      <Logo fallbackText="Florawerk GmbH" height="1.5rem" />
```

durch:

```astro
      <Logo fallbackText="Florawerk GmbH" height="1.5rem" src={logoSrc} />
```

- [ ] **Step 4: Datei-basiertes Logo entfernen**

Run: `git rm public/logo.svg`

(Ersetzt vollständig durch das Storyblok-Asset-Feld — zwei parallele Logo-Quellen
wären verwirrend, siehe Spec "Was sich NICHT ändert".)

- [ ] **Step 5: Build verifizieren**

Run: `npm run build`
Expected: `Complete!` ohne Fehler. (`Navigation`/`Footer` werden noch ohne `logoSrc`
aufgerufen — zeigt weiterhin den Text-Fallback, das ist bis Task 3 erwartet.)

Run: `rm -rf dist`

- [ ] **Step 6: Commit**

```bash
git add src/components/Logo.astro src/components/Navigation.astro src/components/Footer.astro
git commit -m "feat: Logo aus Storyblok-Asset statt public/logo.svg-Datei"
```

---

### Task 3: Page.astro — Logo-URL aus Storyblok laden und durchreichen

**Files:**
- Modify: `src/storyblok/Page.astro`

- [ ] **Step 1: Import und Fetch ergänzen**

Ersetze:

```astro
import Footer from '../components/Footer.astro';

const { blok } = Astro.props;
```

durch:

```astro
import Footer from '../components/Footer.astro';
import { getSiteSettings } from '../lib/settings';

const { blok } = Astro.props;

const settings = await getSiteSettings();
// Storyblok liefert ein leeres Asset-Feld mit filename: "" statt null/undefined —
// gleicher Fallstrick wie bei leeren Single-Option-Feldern, deshalb || statt ??.
const logoSrc = settings?.logo?.filename || undefined;
```

- [ ] **Step 2: logoSrc an Navigation und Footer durchreichen**

Ersetze:

```astro
<Navigation chapters={chapters} />
```

durch:

```astro
<Navigation chapters={chapters} logoSrc={logoSrc} />
```

Ersetze:

```astro
<Footer />
```

durch:

```astro
<Footer logoSrc={logoSrc} />
```

- [ ] **Step 3: Build verifizieren**

Run: `npm run build`
Expected: `Complete!` ohne Fehler.

Run: `rm -rf dist`

- [ ] **Step 4: Commit**

```bash
git add src/storyblok/Page.astro
git commit -m "feat: Logo-URL aus Storyblok-Settings an Navigation/Footer reichen"
```

---

### Task 4: BaseLayout.astro — Farben/Schriften als Inline-Override

**Files:**
- Modify: `src/layouts/BaseLayout.astro`

- [ ] **Step 1: Import und Fetch-Logik ergänzen**

Ersetze:

```astro
---
import '../styles/global.css';

interface Props {
  title: string;
  description?: string;
}

const { title, description = 'Florawerk GmbH — Nachhaltigkeitsbericht' } = Astro.props;
---
```

durch:

```astro
---
import '../styles/global.css';
import { getSiteSettings, resolveFontStack } from '../lib/settings';

interface Props {
  title: string;
  description?: string;
}

const { title, description = 'Florawerk GmbH — Nachhaltigkeitsbericht' } = Astro.props;

const settings = await getSiteSettings();
const overrides: string[] = [];
const fontHeading = resolveFontStack(settings?.font_heading);
const fontBody = resolveFontStack(settings?.font_body);
if (fontHeading) overrides.push(`--font-heading: ${fontHeading};`);
if (fontBody) overrides.push(`--font-body: ${fontBody};`);
if (settings?.color_primary) overrides.push(`--color-primary: ${settings.color_primary};`);
if (settings?.color_secondary) overrides.push(`--color-secondary: ${settings.color_secondary};`);
const styleOverride = overrides.length > 0 ? overrides.join(' ') : undefined;
---
```

- [ ] **Step 2: Inline-Style auf html-Element setzen**

Ersetze:

```astro
<html lang="de">
```

durch:

```astro
<html lang="de" style={styleOverride}>
```

- [ ] **Step 3: Build verifizieren**

Run: `npm run build`
Expected: `Complete!` ohne Fehler.

Run: `rm -rf dist`

- [ ] **Step 4: Commit**

```bash
git add src/layouts/BaseLayout.astro
git commit -m "feat: Farben/Schriften aus Storyblok-Settings als Inline-Override"
```

---

### Task 5: Settings-Story von der Seitenliste ausschließen

**Files:**
- Modify: `src/pages/[...slug].astro`

- [ ] **Step 1: excluding_slugs ergänzen**

Ersetze:

```astro
  const { data } = await storyblokApi.get('cdn/stories', {
    version: import.meta.env.PROD ? 'published' : 'draft',
  });
```

durch:

```astro
  const { data } = await storyblokApi.get('cdn/stories', {
    version: import.meta.env.PROD ? 'published' : 'draft',
    // Verhindert, dass die globale Branding-Story als eigene (kaputte) Seite
    // gerendert wird — sie hat keinen registrierten "page"-kompatiblen Component-Typ.
    excluding_slugs: 'settings',
  });
```

- [ ] **Step 2: Build verifizieren, settings-Seite darf nicht existieren**

Run: `npm run build`
Expected: `Complete!` ohne Fehler.

Run:
```bash
test -f dist/settings/index.html && echo "FEHLER: settings-Seite existiert" || echo "OK: keine settings-Seite"
```
Expected: `OK: keine settings-Seite`

Run: `rm -rf dist`

- [ ] **Step 3: Commit**

```bash
git add "src/pages/[...slug].astro"
git commit -m "fix: settings-Story von der Seiten-Generierung ausgeschlossen"
```

---

### Task 6: Dokumentation aktualisieren

**Files:**
- Modify: `docs/branding.md`
- Modify: `docs/storyblok-setup.md`

- [ ] **Step 1: docs/branding.md komplett ersetzen**

Ersetze den kompletten Inhalt von `docs/branding.md` durch:

```markdown
# Branding anpassen (neues Kundenprojekt)

Farben, Schriften und Logo werden über eine globale Storyblok-Story gesteuert
(Content-Type `settings`, Slug `settings`) — Redakteur:innen können sie ohne
Code-Zugriff ändern. Änderungen erscheinen nach einem Browser-Reload, ohne
Neustart nötig (Storyblok-Cache ist deaktiviert, siehe `astro.config.mjs`).

## Story `settings` anlegen

Falls noch nicht vorhanden: Content-Type `settings` (Root, nicht Nestable) mit
folgenden Feldern anlegen, dann eine Story mit Slug `settings` erstellen:

| Feld | Typ |
|---|---|
| `font_heading` | Single-Option — Optionen: `serif_classic`, `serif_modern`, `sans_classic`, `sans_modern` |
| `font_body` | Single-Option — gleiche Optionen |
| `color_primary` | Text (Hex-Farbwert, z. B. `#1f6f78`) |
| `color_secondary` | Text (Hex-Farbwert) |
| `logo` | Asset (Single) |

## Farben

`color_primary` / `color_secondary` in der `settings`-Story setzen. **Wichtig —
Kontrast prüfen:** Storyblok validiert das nicht automatisch. Neue Farben vor dem
Speichern mit folgendem Snippet gegen WCAG AA (mindestens 4.5:1) prüfen:

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

print(contrast("#1f6f78", "#ffffff"))  # sollte >= 4.5 sein
EOF
```

`--color-accent` (nur Fokus-Ringe/Tastaturbedienbarkeit) bleibt bewusst Code-only
(`src/styles/tokens.css`) — nicht Teil der Storyblok-Einstellungen.

## Schriften

`font_heading` / `font_body` in der `settings`-Story per Dropdown wählen. Nur die
vier vorgeprüften, sicheren System-Font-Stacks stehen zur Auswahl (siehe Tabelle
oben) — kein Laden externer Web-Fonts.

## Logo

Bild im `logo`-Asset-Feld der `settings`-Story hochladen. Ist kein Bild gesetzt,
zeigt das Template automatisch den Berichtstitel als Text (Navigation) bzw.
"Florawerk GmbH" (Footer) — kein Platzhalterbild nötig.

## Weitere Textinhalte

Berichtstitel, Kapitel-Namen und die Zuordnung der Startseiten-Kennzahlen sind
weiterhin **nicht** über Storyblok steuerbar, sondern fest in
`src/storyblok/Page.astro` eingetragen (Variablen `chapters`, `title`-Prop an
`<HeroOverview>`) — für ein neues Kundenprojekt dort manuell anpassen. Welche
KPI-Kacheln im Hero erscheinen, wird über das `show_in_hero`-Feld an `kpi_card`
gesteuert (siehe `docs/storyblok-setup.md`, Abschnitt 3a).
```

- [ ] **Step 2: docs/storyblok-setup.md — settings-Schema ergänzen**

Ersetze:

```markdown
### `page` (bereits vorhanden, ggf. prüfen)
```

durch:

```markdown
### `settings` (Root-Content-Type, kein Nestable Block — eine Story mit Slug `settings`)
| Feld | Typ |
|---|---|
| `font_heading` | Single-Option — Optionen: `serif_classic`, `serif_modern`, `sans_classic`, `sans_modern` |
| `font_body` | Single-Option — gleiche Optionen |
| `color_primary` | Text (Hex-Farbwert) |
| `color_secondary` | Text (Hex-Farbwert) |
| `logo` | Asset (Single) |

Details und Kontrastprüfung: siehe [docs/branding.md](branding.md).

### `page` (bereits vorhanden, ggf. prüfen)
```

- [ ] **Step 3: Commit**

```bash
git add docs/branding.md docs/storyblok-setup.md
git commit -m "docs: Branding-Anleitung auf Storyblok-Settings-Story umgestellt"
```

---

### Task 7: Kombinierte Verifikation

**Files:** keine (nur Verifikation, kein Produktionscode)

- [ ] **Step 1: Build mit aktuellem Storyblok-Zustand prüfen**

Run: `npm run build`
Expected: `Complete!` ohne Fehler.

Run:
```bash
grep -o 'style="[^"]*--color-primary:[^"]*"' dist/index.html
```
Expected: ein Treffer mit `--color-primary: #2f6d4f;` (der aktuell in der
`settings`-Story hinterlegte Wert — siehe Hinweis in der Spec, dass das noch das
alte Grün ist, nicht das aktuelle Teal).

Run: `rm -rf dist`

- [ ] **Step 2: settings-Story-Ausschluss nochmal bestätigen**

Run:
```bash
npm run build > /tmp/build-log.txt 2>&1
grep -c "verify-test\|/settings/" dist/**/*.html 2>/dev/null || true
find dist -type d -name settings
```
Expected: `find dist -type d -name settings` liefert keine Treffer.

Run: `rm -rf dist`

- [ ] **Step 3: Kein Commit nötig für diesen Task**

(Reine Verifikation.)

---

## Self-Review

- **Spec-Abdeckung:** Settings-Helper (Task 1), Logo-Umstellung (Task 2),
  Page.astro-Durchreichung (Task 3), BaseLayout-Override (Task 4),
  Seitenausschluss (Task 5), Doku (Task 6), Verifikation (Task 7) — alle
  Spec-Punkte abgedeckt.
- **Keine Platzhalter:** Vollständiger Code in jedem Schritt.
- **Konsistenz:** `getSiteSettings`/`resolveFontStack`-Signaturen identisch in
  Task 1 (Definition) und Task 3/4 (Verwendung). `||` statt `??` für `logo.filename`
  in Task 3 bewusst begründet (leeres Storyblok-Asset-Feld liefert `""`, nicht
  `undefined` — gleicher Fallstrick wie bei Single-Option-Feldern, bereits bekannt
  aus `KpiCard.astro`).
