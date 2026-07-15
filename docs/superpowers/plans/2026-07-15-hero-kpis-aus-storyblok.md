# Hero-Kennzahlen aus Storyblok Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Die 4 Hero-Kennzahlen auf der Startseite automatisch aus den `kpi_card`-
Bausteinen im Story-Body ableiten (per neuem `show_in_hero`-Boolean-Feld), statt sie
doppelt und unabhängig in `Page.astro` zu pflegen.

**Architecture:** `Page.astro` durchläuft `blok.body` rekursiv über `kpi_grid` →
`cards`, sammelt markierte `kpi_card`s zu Hero-Einträgen. `HeroOverview.astro`s
`href`-Prop wird optional mit Fallback. Keine neuen Dateien.

**Tech Stack:** Astro, `@storyblok/astro`.

**Spec:** [docs/superpowers/specs/2026-07-15-hero-kpis-aus-storyblok-design.md](../specs/2026-07-15-hero-kpis-aus-storyblok-design.md)

---

### Task 1: HeroOverview.astro — href optional machen

**Files:**
- Modify: `src/components/HeroOverview.astro`

- [ ] **Step 1: Interface und Fallback anpassen**

Ersetze:

```astro
interface Kpi {
  label: string;
  value: string;
  href: string;
}
```

durch:

```astro
interface Kpi {
  label: string;
  value: string;
  href?: string;
}
```

Ersetze im Markup:

```astro
            <a class="hero__kpi" href={kpi.href}>
```

durch:

```astro
            <a class="hero__kpi" href={kpi.href ?? '#main-content'}>
```

(`??` ist hier korrekt, nicht `||` — `kpi.href` ist entweder ein echter String oder
`undefined`, kein leeres-String-Fallstrick wie bei Storyblok-Single-Option-Feldern.)

- [ ] **Step 2: Build verifizieren**

Run: `npm run build`
Expected: `Complete!` ohne Fehler.

Run: `rm -rf dist`

- [ ] **Step 3: Commit**

```bash
git add src/components/HeroOverview.astro
git commit -m "feat: HeroOverview-Kennzahl-Link mit Fallback statt Pflichtfeld"
```

---

### Task 2: Page.astro — Hero-Kennzahlen aus Body ableiten

**Files:**
- Modify: `src/storyblok/Page.astro`

- [ ] **Step 1: Hardcodierte kpis-Variable durch Ableitung ersetzen**

Ersetze:

```astro
const kpis = [
  { label: 'CO₂-Emissionen (Scope 1+2)', value: '1.240 t', href: '#klima' },
  { label: 'Anteil torffreie Substrate', value: '78 %', href: '#klima' },
  { label: 'Mitarbeitende mit Weiterbildung', value: '92 %', href: '#mitarbeitende' },
  { label: 'Frauenanteil in Führungspositionen', value: '41 %', href: '#mitarbeitende' },
];
```

durch:

```astro
/**
 * Hero-Kennzahlen kommen jetzt direkt aus den kpi_card-Bausteinen im Body statt aus
 * einer separat gepflegten Liste — verhindert, dass die Übersicht oben und die
 * Kacheln im jeweiligen Kapitel auseinanderlaufen. Ein Redakteur markiert in
 * Storyblok die gewünschten Kacheln über das Feld "show_in_hero" (Boolean).
 */
function collectHeroKpis(body: any[] = []) {
  const kpis: { label: string; value: string; href?: string }[] = [];

  for (const item of body) {
    if (item.component !== 'kpi_grid') continue;

    for (const card of item.cards ?? []) {
      if (!card.show_in_hero) continue;

      kpis.push({
        label: card.label,
        value: card.unit ? `${card.value} ${card.unit}` : card.value,
        href: item.anchor ? `#${item.anchor}` : undefined,
      });
    }
  }

  return kpis;
}

const kpis = collectHeroKpis(blok.body);
```

- [ ] **Step 2: Build verifizieren**

Run: `npm run build`
Expected: `Complete!` ohne Fehler. Die aktuelle Home-Story hat noch keine
`show_in_hero`-Kacheln (Feld existiert in Storyblok noch nicht) — Hero-Sektion zeigt
danach übergangsweise keine Kacheln mehr, das ist bis Task 4 (Nutzer-Migration in
Storyblok) erwartet.

Run: `rm -rf dist`

- [ ] **Step 3: Commit**

```bash
git add src/storyblok/Page.astro
git commit -m "feat: Hero-Kennzahlen aus kpi_card-Bausteinen ableiten (show_in_hero)"
```

---

### Task 3: Dokumentation aktualisieren

**Files:**
- Modify: `docs/storyblok-setup.md`

- [ ] **Step 1: Neues Feld in der kpi_card-Tabelle ergänzen**

Ersetze:

```markdown
### `kpi_card`
| Feld | Typ |
|---|---|
| `label` | Text |
| `value` | Text |
| `unit` | Text |
| `previous_value` | Text |
| `trend` | Single-Option — Optionen: `up`, `down`, `neutral` |
| `link_target` | Text |
```

durch:

```markdown
### `kpi_card`
| Feld | Typ |
|---|---|
| `label` | Text |
| `value` | Text |
| `unit` | Text |
| `previous_value` | Text |
| `trend` | Single-Option — Optionen: `up`, `down`, `neutral` |
| `link_target` | Text |
| `show_in_hero` | Boolean — steuert, ob diese Kachel oben in der "Auf einen Blick"-
  Übersicht erscheint (siehe Abschnitt 3a) |
```

- [ ] **Step 2: Neuen Erklärungsabschnitt ergänzen**

Nach dem bestehenden Abschnitt `## 3. Warum \`anchor\`?` einfügen:

```markdown
---

## 3a. Warum `show_in_hero`?

Die 4 Kennzahlen ganz oben auf der Startseite ("Auf einen Blick") sind keine eigene
Content-Liste mehr, sondern werden automatisch aus den `kpi_card`-Bausteinen im
Body gesammelt — genau die, bei denen `show_in_hero` angehakt ist. Der Sprunglink
kommt vom `anchor`-Feld des übergeordneten `kpi_grid`. Um die ursprünglichen 4
Kennzahlen (CO₂, torffreie Substrate, Weiterbildung, Frauenanteil) wiederherzustellen,
bei genau diesen 4 `kpi_card`-Instanzen `show_in_hero` aktivieren.
```

- [ ] **Step 3: Commit**

```bash
git add docs/storyblok-setup.md
git commit -m "docs: show_in_hero-Feld für kpi_card dokumentiert"
```

---

### Task 4: Kombinierter Smoke-Test

**Files:** keine (nur Verifikation, kein Produktionscode)

- [ ] **Step 1: Temporäre Testseite mit gemischt markierten Kacheln anlegen**

Erstelle `src/pages/verify-test/hero-kpis.astro`:

```astro
---
import Page from '../../storyblok/Page.astro';

const blok = {
  _uid: 'root',
  component: 'page',
  body: [
    {
      _uid: 'kg1', component: 'kpi_grid', title: 'Klima', anchor: 'klima',
      cards: [
        { _uid: 'k1', component: 'kpi_card', label: 'CO2', value: '1.240', unit: 't', show_in_hero: true },
        { _uid: 'k2', component: 'kpi_card', label: 'Wasser', value: '310', unit: 'l', show_in_hero: false },
      ],
    },
    {
      _uid: 'kg2', component: 'kpi_grid', title: 'Team',
      cards: [
        { _uid: 'k3', component: 'kpi_card', label: 'Weiterbildung', value: '92', unit: '%', show_in_hero: true },
      ],
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
f=dist/verify-test/hero-kpis/index.html
python3 -c "
import re
html = open('$f').read()
hero = html.split('hero__grid')[1].split('</ul>')[0]
print('CO2 in hero:', '1.240 t' in hero)
print('Wasser in hero (sollte False sein):', '310 l' in hero)
print('Weiterbildung in hero:', '92 %' in hero)
print('CO2 href:', re.search(r'href=\"([^\"]*)\"[^>]*>\s*<span[^>]*>1\.240 t', hero).group(1) if '1.240 t' in hero else 'n/a')
print('Weiterbildung href (kein anchor am kpi_grid -> Fallback erwartet):', re.search(r'href=\"([^\"]*)\"[^>]*>\s*<span[^>]*>92 %', hero).group(1) if '92 %' in hero else 'n/a')
"
```
Expected: `CO2 in hero: True`, `Wasser in hero: False`, `Weiterbildung in hero: True`,
CO2-href `#klima`, Weiterbildung-href `#main-content` (Fallback, da `kg2` kein
`anchor`-Feld hat).

- [ ] **Step 3: Testseite und Build-Output wieder entfernen**

```bash
rm -rf src/pages/verify-test dist
```

- [ ] **Step 4: Kein Commit nötig für diesen Task**

(Reine Verifikation, Testseite wurde in Step 3 bereits entfernt.)

---

## Self-Review

- **Spec-Abdeckung:** href-Fallback (Task 1), Ableitungslogik (Task 2), Doku (Task 3),
  gemischter Markierungs-Test inkl. Fallback-href (Task 4) — alle Spec-Punkte
  abgedeckt, inkl. dem in der Spec explizit genannten "kein anchor → Fallback"-Fall.
- **Keine Platzhalter:** Vollständiger Code in jedem Schritt.
- **Konsistenz:** `show_in_hero` als Feldname identisch in Task 2 (Code) und Task 3
  (Doku). `??`-Verwendung in Task 1 bewusst begründet (kein Storyblok-Single-Option-
  Fallstrick, da `href` in Page.astro entweder String oder `undefined` ist, nie `""`).
