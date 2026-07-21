# Große Zahl & Balkendiagramm Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Zwei neue Bausteine bauen: `big_stat` (große zentrierte Zahl mit
Richtext-Caption) und `bar_chart` (horizontales Balkendiagramm mit Icon, Label und
automatisch skalierten Balkenbreiten). Schemas existieren bereits in Storyblok.

**Architecture:** `BigStat.astro` folgt dem Standard-Baustein-Pattern. `BarChart.astro`
liest `bar_chart_item`-Kindobjekte direkt aus `blok.bars` (statt über
`<StoryblokComponent>`), um den Maximalwert über alle Balken zu berechnen — kein
separates `BarChartItem.astro` nötig.

**Tech Stack:** Astro, `@storyblok/astro`.

**Spec:** [docs/superpowers/specs/2026-07-21-big-stat-bar-chart-design.md](../specs/2026-07-21-big-stat-bar-chart-design.md)

---

### Task 1: Baustein `big_stat`

**Files:**
- Create: `src/storyblok/BigStat.astro`
- Modify: `astro.config.mjs` (components-Map)

- [ ] **Step 1: Komponente anlegen**

Erstelle `src/storyblok/BigStat.astro` mit exakt diesem Inhalt:

```astro
---
import { storyblokEditable, renderRichText } from '@storyblok/astro';

interface Props {
  blok: {
    value?: string;
    caption?: unknown;
    [key: string]: unknown;
  };
}

const { blok } = Astro.props;
const html = blok.caption ? renderRichText(blok.caption as never) : '';
---

<section {...storyblokEditable(blok)} class="big-stat container">
  <p class="big-stat__value">{blok.value}</p>
  <div class="big-stat__caption" set:html={html} />
</section>

<style>
  .big-stat {
    padding-block: var(--space-12);
    text-align: center;
  }

  .big-stat__value {
    margin: 0;
    font-family: var(--font-heading);
    font-size: 5rem;
    line-height: var(--line-height-tight);
    color: var(--color-primary);
  }

  .big-stat__caption {
    margin-top: var(--space-2);
    max-width: 32rem;
    margin-inline: auto;
    color: var(--color-text-muted);
  }

  .big-stat__caption :global(p) {
    margin: 0;
  }
</style>
```

- [ ] **Step 2: In astro.config.mjs registrieren**

In `astro.config.mjs`, in der `components`-Map, nach der Zeile
`stakeholder_block: 'storyblok/StakeholderBlock',` ergänzen:

```js
        big_stat: 'storyblok/BigStat',
```

- [ ] **Step 3: Build verifizieren**

Run: `npm run build`
Expected: `Complete!` ohne Fehler.

Run: `rm -rf dist`

- [ ] **Step 4: Commit**

```bash
git add src/storyblok/BigStat.astro astro.config.mjs
git commit -m "feat: Baustein Große Zahl (big_stat)"
```

---

### Task 2: Baustein `bar_chart`

**Files:**
- Create: `src/storyblok/BarChart.astro`
- Modify: `astro.config.mjs` (components-Map)

- [ ] **Step 1: Komponente anlegen**

Erstelle `src/storyblok/BarChart.astro` mit exakt diesem Inhalt:

```astro
---
import { storyblokEditable } from '@storyblok/astro';

interface BarChartItem {
  _uid: string;
  _editable?: string;
  icon?: { filename?: string; alt?: string };
  label?: string;
  value?: string | number;
  value_label?: string;
  [key: string]: unknown;
}

interface Props {
  blok: {
    title?: string;
    bars?: BarChartItem[];
    [key: string]: unknown;
  };
}

const { blok } = Astro.props;
const bars = blok.bars ?? [];
const maxValue = Math.max(0, ...bars.map((bar) => Number(bar.value) || 0));

function widthPercent(bar: BarChartItem): number {
  const value = Number(bar.value) || 0;
  return maxValue > 0 ? (value / maxValue) * 100 : 0;
}
---

<section {...storyblokEditable(blok)} class="bar-chart container">
  {blok.title && <h2>{blok.title}</h2>}
  <ul role="list" class="bar-chart__list">
    {
      bars.map((bar) => (
        <li class="bar-chart__row" {...storyblokEditable(bar)}>
          <div class="bar-chart__icon-col">
            {bar.icon?.filename && (
              <img class="bar-chart__icon" src={bar.icon.filename} alt={bar.icon.alt ?? ''} />
            )}
            <span class="bar-chart__icon-label">{bar.label}</span>
          </div>
          <div class="bar-chart__track">
            <div class="bar-chart__fill" style={`width: ${widthPercent(bar)}%`} aria-hidden="true" />
          </div>
          <span class="bar-chart__value">{bar.value_label}</span>
        </li>
      ))
    }
  </ul>
</section>

<style>
  .bar-chart {
    padding-block: var(--space-12);
  }

  .bar-chart__list {
    margin-top: var(--space-6);
    display: flex;
    flex-direction: column;
    gap: var(--space-4);
  }

  .bar-chart__row {
    display: grid;
    grid-template-columns: auto 1fr auto;
    align-items: center;
    gap: var(--space-4);
  }

  .bar-chart__icon-col {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--space-1);
    width: 4rem;
  }

  .bar-chart__icon {
    width: 2rem;
    height: 2rem;
    object-fit: contain;
  }

  .bar-chart__icon-label {
    font-size: var(--font-size-sm);
    color: var(--color-text-muted);
    text-align: center;
  }

  .bar-chart__track {
    height: 0.75rem;
    background: var(--color-primary-light);
  }

  .bar-chart__fill {
    height: 100%;
    background: var(--color-primary);
  }

  .bar-chart__value {
    font-weight: 600;
    color: var(--color-text);
    white-space: nowrap;
  }
</style>
```

- [ ] **Step 2: In astro.config.mjs registrieren**

In `astro.config.mjs`, in der `components`-Map, nach der in Task 1 ergänzten Zeile
`big_stat: 'storyblok/BigStat',` ergänzen:

```js
        bar_chart: 'storyblok/BarChart',
```

Kein Eintrag für `bar_chart_item` — wird absichtlich nicht über
`<StoryblokComponent>` aufgelöst (siehe Spec, Architektur-Besonderheit).

- [ ] **Step 3: Build verifizieren**

Run: `npm run build`
Expected: `Complete!` ohne Fehler.

Run: `rm -rf dist`

- [ ] **Step 4: Commit**

```bash
git add src/storyblok/BarChart.astro astro.config.mjs
git commit -m "feat: Baustein Balkendiagramm (bar_chart)"
```

---

### Task 3: Dokumentation

**Files:**
- Modify: `docs/storyblok-setup.md`

- [ ] **Step 1: Schema-Tabellen ergänzen**

Ersetze:

```markdown
### `page` (bereits vorhanden, ggf. prüfen)
| Feld | Typ |
|---|---|
| `body` | Blocks — Restrict to: `teaser`, `statement`, `kpi_grid`, `chart_embed`, `accordion`, `timeline`, `materiality_matrix`, `text_block`, `image_text`, `stakeholder_block` |
```

durch:

```markdown
### `big_stat`
| Feld | Typ |
|---|---|
| `value` | Text — die große Zahl, z. B. „100%" |
| `caption` | Richtext |

### `bar_chart_item`
| Feld | Typ |
|---|---|
| `icon` | Asset (Single) |
| `label` | Text |
| `value` | Number |
| `value_label` | Text |

### `bar_chart`
| Feld | Typ |
|---|---|
| `title` | Text (optional) |
| `bars` | Blocks — Restrict to: `bar_chart_item` |

### `page` (bereits vorhanden, ggf. prüfen)
| Feld | Typ |
|---|---|
| `body` | Blocks — Restrict to: `teaser`, `statement`, `kpi_grid`, `chart_embed`, `accordion`, `timeline`, `materiality_matrix`, `text_block`, `image_text`, `stakeholder_block`, `big_stat`, `bar_chart` |
```

- [ ] **Step 2: Commit**

```bash
git add docs/storyblok-setup.md
git commit -m "docs: Große Zahl und Balkendiagramm in Storyblok-Setup-Anleitung ergänzt"
```

---

### Task 4: Kombinierter Smoke-Test

**Files:** keine (nur Verifikation, kein Produktionscode)

- [ ] **Step 1: Temporäre Testseite anlegen**

Erstelle `src/pages/verify-test/big-stat-bar-chart.astro`:

```astro
---
import Page from '../../storyblok/Page.astro';

const blok = {
  _uid: 'root',
  component: 'page',
  body: [
    {
      _uid: 'bs1', component: 'big_stat', value: '100%',
      caption: { type: 'doc', content: [{ type: 'paragraph', content: [{ type: 'text', text: 'kommen zu Fuß oder mit dem Fahrrad' }] }] },
    },
    {
      _uid: 'bc1', component: 'bar_chart', title: 'Testdiagramm',
      bars: [
        { _uid: 'b1', component: 'bar_chart_item', label: 'Klein', value: '10', value_label: '10%' },
        { _uid: 'b2', component: 'bar_chart_item', label: 'Mittel', value: '40', value_label: '40%' },
        { _uid: 'b3', component: 'bar_chart_item', label: 'Groß', value: '80', value_label: '80%' },
      ],
    },
  ],
};
---
<Page blok={blok} />
```

- [ ] **Step 2: Build ausführen und Balkenbreiten prüfen**

Run: `npm run build`
Expected: `Complete!` ohne Fehler.

Run:
```bash
python3 -c "
import re
html = open('dist/verify-test/big-stat-bar-chart/index.html').read()
widths = re.findall(r'bar-chart__fill\" style=\"width: ([\d.]+)%', html)
print('Breiten:', widths)
print('Erwartet: [\'12.5\', \'50\', \'100\']')
print('Match:', widths == ['12.5', '50', '100'])
print('---big_stat Wert---')
print('100% vorhanden:', '100%' in html)
"
```
Expected: `Breiten: ['12.5', '50', '100']`, `Match: True` (Werte 10/40/80 relativ zum
Maximalwert 80: 10/80=12.5%, 40/80=50%, 80/80=100%). `100% vorhanden: True`.

- [ ] **Step 3: Testseite und Build-Output wieder entfernen**

```bash
rm -rf src/pages/verify-test dist
```

- [ ] **Step 4: Kein Commit nötig für diesen Task**

(Reine Verifikation, Testseite wurde in Step 3 bereits entfernt.)

---

## Self-Review

- **Spec-Abdeckung:** `big_stat` (Task 1), `bar_chart` inkl. Direkt-Lesen-Architektur
  (Task 2), Doku (Task 3), Skalierungs-Rechentest (Task 4) — alle Spec-Punkte
  abgedeckt.
- **Keine Platzhalter:** Vollständiger Code in jedem Schritt.
- **Konsistenz:** `Number(bar.value) || 0`-Konvertierung identisch in Berechnung
  (`maxValue`) und pro Balken (`widthPercent`). Erwartete Testbreiten (12.5/50/100)
  gegen die Testwerte (10/40/80) von Hand nachgerechnet, stimmen überein.
