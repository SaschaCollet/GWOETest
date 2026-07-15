# Text- und Bild+Text-Bausteine Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Zwei neue Storyblok-Bausteine bauen — ein einfacher Text-Baustein
(`text_block`) und ein Bild+Text-Element (`image_text`) — deren Schemas bereits in
Storyblok existieren.

**Architecture:** Zwei neue Astro-Komponenten unter `src/storyblok/`, registriert in
`astro.config.mjs`, nutzen ausschließlich bestehende Design-Tokens. Gleiches Pattern
wie alle bisherigen Bausteine (`storyblokEditable`, `renderRichText`).

**Tech Stack:** Astro, `@storyblok/astro`, bestehendes CSS-Token-System.

**Spec:** [docs/superpowers/specs/2026-07-15-text-und-bildtext-bausteine-design.md](../specs/2026-07-15-text-und-bildtext-bausteine-design.md)

---

### Task 1: Baustein `text_block` (TextBlock.astro)

**Files:**
- Create: `src/storyblok/TextBlock.astro`
- Modify: `astro.config.mjs:21-34` (components-Map)

- [ ] **Step 1: Komponente anlegen**

Erstelle `src/storyblok/TextBlock.astro` mit exakt diesem Inhalt:

```astro
---
import { storyblokEditable, renderRichText } from '@storyblok/astro';

interface Props {
  blok: {
    title?: string;
    content?: unknown;
    width?: 'narrow' | 'full';
    [key: string]: unknown;
  };
}

const { blok } = Astro.props;
const html = blok.content ? renderRichText(blok.content as never) : '';
// Storyblok liefert ein leeres Single-Option-Feld als "" statt undefined/null —
// deshalb bewusst || statt ?? (gleicher Fallstrick wie bei KpiCard.astro's trend-Feld).
const width = blok.width || 'narrow';
---

<section {...storyblokEditable(blok)} class="text-block container">
  <div class={`text-block__inner text-block__inner--${width}`}>
    {blok.title && <h2>{blok.title}</h2>}
    <div class="text-block__content" set:html={html} />
  </div>
</section>

<style>
  .text-block {
    padding-block: var(--space-12);
  }

  .text-block__inner--narrow {
    max-width: 44rem;
  }

  .text-block__inner--full {
    max-width: none;
  }

  .text-block__content :global(p) {
    margin: 0 0 var(--space-4);
    color: var(--color-text);
  }

  .text-block__content :global(p:last-child) {
    margin-bottom: 0;
  }
</style>
```

- [ ] **Step 2: In astro.config.mjs registrieren**

In `astro.config.mjs`, in der `components`-Map, nach der Zeile
`matrix_topic: 'storyblok/MatrixTopic',` ergänzen:

```js
        text_block: 'storyblok/TextBlock',
```

- [ ] **Step 3: Build verifizieren**

Run: `npm run build`
Expected: `Complete!` ohne Fehler.

Run: `rm -rf dist`

- [ ] **Step 4: Commit**

```bash
git add src/storyblok/TextBlock.astro astro.config.mjs
git commit -m "feat: Baustein Text (text_block)"
```

---

### Task 2: Baustein `image_text` (ImageText.astro)

**Files:**
- Create: `src/storyblok/ImageText.astro`
- Modify: `astro.config.mjs` (components-Map)

- [ ] **Step 1: Komponente anlegen**

Erstelle `src/storyblok/ImageText.astro` mit exakt diesem Inhalt:

```astro
---
import { storyblokEditable, renderRichText } from '@storyblok/astro';

interface Props {
  blok: {
    title?: string;
    image?: { filename?: string; alt?: string };
    text?: unknown;
    image_position?: 'left' | 'right';
    [key: string]: unknown;
  };
}

const { blok } = Astro.props;
const html = blok.text ? renderRichText(blok.text as never) : '';
// Gleicher Storyblok-Fallstrick wie bei TextBlock.astro: leeres Single-Option-Feld
// liefert "", nicht undefined — || statt ?? verwenden.
const position = blok.image_position || 'left';
---

<section {...storyblokEditable(blok)} class="image-text container">
  {blok.title && <h2>{blok.title}</h2>}
  <div class={`image-text__grid image-text__grid--${position}`}>
    {blok.image?.filename && (
      <img
        class="image-text__image"
        src={blok.image.filename}
        alt={blok.image.alt ?? ''}
      />
    )}
    <div class="image-text__text" set:html={html} />
  </div>
</section>

<style>
  .image-text {
    padding-block: var(--space-12);
  }

  .image-text__grid {
    margin-top: var(--space-4);
    display: grid;
    grid-template-columns: 1fr;
    gap: var(--space-6);
  }

  .image-text__image {
    width: 100%;
    height: auto;
  }

  .image-text__text :global(p) {
    margin: 0 0 var(--space-4);
    color: var(--color-text);
  }

  .image-text__text :global(p:last-child) {
    margin-bottom: 0;
  }

  @media (min-width: 1024px) {
    .image-text__grid {
      grid-template-columns: 1fr 1fr;
      align-items: center;
    }

    .image-text__grid--right .image-text__image {
      order: 2;
    }
  }
</style>
```

- [ ] **Step 2: In astro.config.mjs registrieren**

In `astro.config.mjs`, in der `components`-Map, nach der in Task 1 ergänzten Zeile
`text_block: 'storyblok/TextBlock',` ergänzen:

```js
        image_text: 'storyblok/ImageText',
```

- [ ] **Step 3: Build verifizieren**

Run: `npm run build`
Expected: `Complete!` ohne Fehler.

Run: `rm -rf dist`

- [ ] **Step 4: Commit**

```bash
git add src/storyblok/ImageText.astro astro.config.mjs
git commit -m "feat: Baustein Bild+Text (image_text)"
```

---

### Task 3: Dokumentation nachziehen

**Files:**
- Modify: `docs/storyblok-setup.md`

- [ ] **Step 1: Neue Bausteine in die Schema-Tabelle aufnehmen**

In `docs/storyblok-setup.md`, nach dem Abschnitt `### matrix_topic` (vor
`### materiality_matrix` oder an vergleichbarer Stelle in Abschnitt 1), zwei neue
Unterabschnitte einfügen:

```markdown
### `text_block`
| Feld | Typ |
|---|---|
| `title` | Text (optional) |
| `content` | Richtext |
| `width` | Single-Option — Optionen: `narrow`, `full` |

### `image_text`
| Feld | Typ |
|---|---|
| `title` | Text (optional) |
| `image` | Asset (Single) |
| `text` | Richtext |
| `image_position` | Single-Option — Optionen: `left`, `right` |
```

- [ ] **Step 2: `page.body`-Liste erweitern**

Im Abschnitt `### page`, in der Zeile mit „Restrict to:", `text_block` und
`image_text` zur Liste der erlaubten Blocktypen hinzufügen.

- [ ] **Step 3: Commit**

```bash
git add docs/storyblok-setup.md
git commit -m "docs: Text- und Bild+Text-Baustein in Storyblok-Setup-Anleitung ergänzt"
```

---

### Task 4: Kombinierter Smoke-Test

**Files:** keine (nur Verifikation, kein Produktionscode)

- [ ] **Step 1: Temporäre Testseite mit Beispieldaten anlegen**

Erstelle `src/pages/verify-test/text-blocks.astro`:

```astro
---
import Page from '../../storyblok/Page.astro';

const blok = {
  _uid: 'root',
  component: 'page',
  body: [
    {
      _uid: 'tb1', component: 'text_block', title: 'Testüberschrift', width: 'narrow',
      content: { type: 'doc', content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Testtext schmal.' }] }] },
    },
    {
      _uid: 'tb2', component: 'text_block', width: 'full',
      content: { type: 'doc', content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Testtext voll, ohne Titel.' }] }] },
    },
    {
      _uid: 'it1', component: 'image_text', title: 'Bild links', image_position: 'left',
      image: { filename: 'https://placehold.co/600x400', alt: 'Test-Alt-Text' },
      text: { type: 'doc', content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Text neben Bild.' }] }] },
    },
    {
      _uid: 'it2', component: 'image_text', image_position: 'right',
      image: { filename: 'https://placehold.co/600x400', alt: '' },
      text: { type: 'doc', content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Text, Bild rechts, kein Titel.' }] }] },
    },
  ],
};
---
<Page blok={blok} />
```

- [ ] **Step 2: Build ausführen und Inhalte prüfen**

Run: `npm run build`
Expected: `Complete!` ohne Fehler.

Run:
```bash
f=dist/verify-test/text-blocks/index.html
grep -o "Testüberschrift\|Testtext schmal\|Testtext voll" $f
grep -o "text-block__inner--narrow\|text-block__inner--full" $f
grep -o 'image-text__grid--left\|image-text__grid--right' $f
grep -o "placehold.co" $f | wc -l
grep -o "\[object Object\]" $f
```
Expected: alle vier Textzeilen erscheinen, beide Breiten-Klassen erscheinen, beide
Layout-Klassen erscheinen, 2 Bild-Treffer, **keine** Ausgabe bei `[object Object]`.

- [ ] **Step 3: Testseite und Build-Output wieder entfernen**

```bash
rm -rf src/pages/verify-test dist
```

- [ ] **Step 4: Kein Commit nötig für diesen Task**

(Testseite wird nicht committet — reine Verifikation, siehe Step 3.)

---

## Self-Review

- **Spec-Abdeckung:** `text_block` (Task 1), `image_text` (Task 2), Doku (Task 3),
  Verifikation (Task 4) — alle Spec-Abschnitte abgedeckt. Out-of-Scope („schicker
  machen") bewusst nicht enthalten.
- **Keine Platzhalter:** Vollständiger Code in jedem Schritt.
- **Konsistenz:** `||`-Fallback-Pattern für leere Single-Option-Felder identisch in
  Task 1 und 2 formuliert, matcht das bereits im Code vorhandene `KpiCard.astro`-Muster.
  Feldnamen (`content` bei text_block, `text` bei image_text) stimmen mit der
  bestätigten Storyblok-Schema-Benennung überein.
