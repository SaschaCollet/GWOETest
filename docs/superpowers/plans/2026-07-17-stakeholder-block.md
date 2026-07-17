# Stakeholder-Block mit Audit-Skala Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Neuen Baustein `stakeholder_block` bauen — Bild+Text-Layout mit Label,
Headline, Link und einer 6-stufigen Audit-Bewertungsskala, deren Stufengrenzen fest
im Code liegen.

**Architecture:** Eine neue Astro-Komponente `src/storyblok/StakeholderBlock.astro`,
registriert in `astro.config.mjs`. Layout-Grundgerüst analog zu `ImageText.astro`
(Grid, `image_position`-Fallback), plus eine reine Präsentations-/Berechnungslogik
für die Skala (kein State, kein Client-JS nötig).

**Tech Stack:** Astro, `@storyblok/astro`.

**Spec:** [docs/superpowers/specs/2026-07-17-stakeholder-block-design.md](../specs/2026-07-17-stakeholder-block-design.md)

---

### Task 1: StakeholderBlock.astro

**Files:**
- Create: `src/storyblok/StakeholderBlock.astro`
- Modify: `astro.config.mjs` (components-Map)

- [ ] **Step 1: Komponente anlegen**

Erstelle `src/storyblok/StakeholderBlock.astro` mit exakt diesem Inhalt:

```astro
---
import { storyblokEditable, renderRichText } from '@storyblok/astro';

interface Props {
  blok: {
    category_label?: string;
    headline?: string;
    text?: unknown;
    link_text?: string;
    link_url?: string;
    image?: { filename?: string; alt?: string };
    image_position?: 'left' | 'right';
    audit_score?: number;
    [key: string]: unknown;
  };
}

const { blok } = Astro.props;
const html = blok.text ? renderRichText(blok.text as never) : '';
// Gleicher Storyblok-Fallstrick wie bei ImageText.astro: leeres Single-Option-Feld
// liefert "", nicht undefined — || statt ?? verwenden.
const position = blok.image_position || 'left';

/**
 * Stufengrenzen der Audit-Skala liegen bewusst im Code, nicht in Storyblok
 * (Nutzer-Vorgabe: "im Backend festgelegt"). Reihenfolge = Anzeigereihenfolge.
 */
const SCALE = [
  { label: 'Negativbereich' },
  { label: 'Basislinie' },
  { label: 'Erste Schritte' },
  { label: 'Fortgeschritten' },
  { label: 'Erfahren' },
  { label: 'Vorbildlich' },
];

function getActiveScaleIndex(score: number): number {
  if (score < 0) return 0;
  if (score === 0) return 1;
  if (score <= 16) return 2;
  if (score <= 33) return 3;
  if (score <= 65) return 4;
  return 5;
}

const score = Number(blok.audit_score) || 0;
const activeIndex = getActiveScaleIndex(score);
const activeLabel = SCALE[activeIndex].label;
---

<section {...storyblokEditable(blok)} class="stakeholder container">
  <div class={`stakeholder__grid stakeholder__grid--${position}`}>
    {
      blok.image?.filename && (
        <img
          class="stakeholder__image"
          src={blok.image.filename}
          alt={blok.image.alt ?? ''}
        />
      )
    }
    <div class="stakeholder__content">
      {blok.category_label && <p class="stakeholder__label">{blok.category_label}</p>}
      {blok.headline && <h2>{blok.headline}</h2>}
      <div class="stakeholder__text" set:html={html} />
      {
        blok.link_url && blok.link_text && (
          <p>
            <a class="stakeholder__link" href={blok.link_url}>
              {blok.link_text}
            </a>
          </p>
        )
      }

      <div class="stakeholder__scale-wrap">
        <p class="stakeholder__scale-label">Auditbewertung:</p>
        <ul
          role="list"
          class="stakeholder__scale"
          aria-label={`Auditbewertung: ${score} Prozent, ${activeLabel}`}
        >
          {
            SCALE.map((step, index) => (
              <li
                class="stakeholder__scale-item"
                data-active={index === activeIndex ? 'true' : undefined}
                aria-current={index === activeIndex ? 'true' : undefined}
              >
                {index === activeIndex && (
                  <span class="stakeholder__scale-pointer" aria-hidden="true">
                    ▼
                  </span>
                )}
                {index === activeIndex ? (
                  <>
                    <strong class="stakeholder__scale-value">{score}%</strong>
                    <span class="stakeholder__scale-text">{step.label}</span>
                  </>
                ) : (
                  step.label
                )}
              </li>
            ))
          }
        </ul>
      </div>
    </div>
  </div>
</section>

<style>
  .stakeholder {
    padding-block: var(--space-12);
  }

  .stakeholder__grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: var(--space-6);
  }

  .stakeholder__image {
    width: 100%;
    height: auto;
  }

  .stakeholder__label {
    margin: 0 0 var(--space-2);
    color: var(--color-text-muted);
  }

  .stakeholder__text :global(p) {
    margin: 0 0 var(--space-4);
    color: var(--color-text);
  }

  .stakeholder__text :global(p:last-child) {
    margin-bottom: 0;
  }

  .stakeholder__link {
    font-weight: 600;
  }

  .stakeholder__scale-wrap {
    margin-top: var(--space-6);
  }

  .stakeholder__scale-label {
    margin: 0 0 var(--space-2);
    font-weight: 600;
  }

  .stakeholder__scale {
    display: flex;
    flex-wrap: wrap;
    gap: var(--space-2);
  }

  .stakeholder__scale-item {
    position: relative;
    flex: 1 1 0;
    min-width: 6rem;
    padding: var(--space-2) var(--space-3);
    background: var(--color-primary-light);
    color: var(--color-text);
    font-size: var(--font-size-sm);
    text-align: center;
  }

  .stakeholder__scale-item[data-active='true'] {
    display: flex;
    flex-direction: column;
    background: var(--color-secondary);
    color: var(--color-neutral-0);
    font-weight: 600;
  }

  .stakeholder__scale-value {
    font-size: var(--font-size-lg);
  }

  .stakeholder__scale-pointer {
    position: absolute;
    top: -1.25rem;
    left: 50%;
    transform: translateX(-50%);
    color: var(--color-accent);
    font-size: 1rem;
  }

  @media (min-width: 1024px) {
    .stakeholder__grid {
      grid-template-columns: 1fr 1fr;
      align-items: center;
    }

    .stakeholder__grid--right .stakeholder__image {
      order: 2;
    }
  }
</style>
```

- [ ] **Step 2: In astro.config.mjs registrieren**

In `astro.config.mjs`, in der `components`-Map, nach der Zeile
`image_text: 'storyblok/ImageText',` ergänzen:

```js
        stakeholder_block: 'storyblok/StakeholderBlock',
```

- [ ] **Step 3: Build verifizieren**

Run: `npm run build`
Expected: `Complete!` ohne Fehler.

Run: `rm -rf dist`

- [ ] **Step 4: Commit**

```bash
git add src/storyblok/StakeholderBlock.astro astro.config.mjs
git commit -m "feat: Baustein Stakeholder-Block mit Audit-Skala (stakeholder_block)"
```

---

### Task 2: Dokumentation

**Files:**
- Modify: `docs/storyblok-setup.md`

- [ ] **Step 1: Schema-Tabelle ergänzen**

Ersetze:

```markdown
### `page` (bereits vorhanden, ggf. prüfen)
| Feld | Typ |
|---|---|
| `body` | Blocks — Restrict to: `teaser`, `statement`, `kpi_grid`, `chart_embed`, `accordion`, `timeline`, `materiality_matrix`, `text_block`, `image_text` |
```

durch:

```markdown
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
```

- [ ] **Step 2: Commit**

```bash
git add docs/storyblok-setup.md
git commit -m "docs: Stakeholder-Block in Storyblok-Setup-Anleitung ergänzt"
```

---

### Task 3: Kombinierter Smoke-Test

**Files:** keine (nur Verifikation, kein Produktionscode)

- [ ] **Step 1: Temporäre Testseite mit mehreren Score-Werten anlegen**

Erstelle `src/pages/verify-test/stakeholder.astro`:

```astro
---
import Page from '../../storyblok/Page.astro';

function block(uid: string, score: number, position: 'left' | 'right' = 'left') {
  return {
    _uid: uid,
    component: 'stakeholder_block',
    category_label: `Score ${score}`,
    headline: `Test ${score}`,
    image_position: position,
    audit_score: score,
    link_text: 'Mehr erfahren',
    link_url: '#',
    text: { type: 'doc', content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Testtext.' }] }] },
  };
}

const blok = {
  _uid: 'root',
  component: 'page',
  body: [
    block('b1', -5),
    block('b2', 0),
    block('b3', 16),
    block('b4', 17),
    block('b5', 33),
    block('b6', 34),
    block('b7', 65),
    block('b8', 66),
    block('b9', 100, 'right'),
  ],
};
---
<Page blok={blok} />
```

- [ ] **Step 2: Build ausführen und aktive Stufen prüfen**

Run: `npm run build`
Expected: `Complete!` ohne Fehler.

Run:
```bash
python3 -c "
import re
html = open('dist/verify-test/stakeholder/index.html').read()
items = re.findall(r'<li class=\"stakeholder__scale-item\"[^>]*data-active=\"true\"[^>]*>(.*?)</li>', html, re.S)
expected = ['Negativbereich', 'Basislinie', 'Erste Schritte', 'Fortgeschritten',
            'Fortgeschritten', 'Erfahren', 'Erfahren', 'Vorbildlich', 'Vorbildlich']
labels = [re.search(r'stakeholder__scale-text\"[^>]*>([^<]+)<', i).group(1) for i in items]
print('Anzahl aktive Segmente:', len(items), '(erwartet: 9)')
print('Ergebnis:', labels)
print('Erwartet: ', expected)
print('Match:', labels == expected)
"
```
Expected: `Anzahl aktive Segmente: 9`, `Match: True`.

Run:
```bash
grep -c 'stakeholder__grid--right' dist/verify-test/stakeholder/index.html
```
Expected: mindestens 1 Treffer (der letzte Testblock mit `image_position: right`).

- [ ] **Step 3: Testseite und Build-Output wieder entfernen**

```bash
rm -rf src/pages/verify-test dist
```

- [ ] **Step 4: Kein Commit nötig für diesen Task**

(Reine Verifikation, Testseite wurde in Step 3 bereits entfernt.)

---

## Self-Review

- **Spec-Abdeckung:** Komponente mit allen 8 Feldern (Task 1), Doku (Task 2),
  Skalen-Grenzwert-Test über alle 6 Stufen inkl. beider Grenzfälle (33/34) sowie
  `image_position` links/rechts (Task 3) — alle Spec-Punkte abgedeckt.
- **Keine Platzhalter:** Vollständiger Code in jedem Schritt.
- **Konsistenz:** Stufengrenzen in Task 1 (Code) identisch mit Spec-Tabelle und
  Task 2 (Doku): 16/17, 33/34, 65/66. `image_position`-Fallback-Pattern identisch
  zu `ImageText.astro` übernommen.
