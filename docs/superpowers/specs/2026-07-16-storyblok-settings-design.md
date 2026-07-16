# Design: Branding-Einstellungen (Schriften, Farben, Logo) aus Storyblok

Verschiebt die drei Branding-Aspekte aus `docs/branding.md` (Farben, Schriften, Logo)
von statischem Code/Dateien in eine CMS-editierbare globale Storyblok-Story. Schema ist
bereits angelegt (`settings`, Slug `settings`) und verifiziert (Felder: `font_heading`,
`font_body`, `color_primary`, `color_secondary`, `logo`).

## Ziel

Nicht-technische Redakteur:innen sollen Primär-/Sekundärfarbe, Überschriften-/
Fließtext-Schrift und das Logo direkt in Storyblok ändern können — ohne Code-Zugriff.

## Mechanismus

### `src/lib/settings.ts` (neu)

Zentrale Fetch- und Fallback-Logik, von zwei Stellen genutzt (`BaseLayout.astro` für
Farben/Schriften, `Page.astro` für das Logo — beide brauchen dieselbe Story, aber
Astros Komponentenmodell erlaubt kein Durchreichen von Daten durch `StoryblokComponent`
hindurch, deshalb zwei unabhängige, aber code-identische Fetches über diese eine
Hilfsfunktion):

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

export async function getSiteSettings(): Promise<SiteSettings | null> { ... }
export function resolveFontStack(key?: string): string | undefined { ... }
```

`getSiteSettings` fängt Fehler ab (Story existiert nicht/noch nicht veröffentlicht)
und gibt `null` zurück — kein Build-Abbruch, Template läuft mit den `tokens.css`-
Defaults weiter, exakt wie der bestehende Logo-Text-Fallback es heute schon tut.

### `BaseLayout.astro`

Setzt geladene Werte als Inline-`style`-Attribut auf `<html>` (nicht als `<style>`-
Block!) — Inline-Style-Attribute haben die höchste Spezifität und schlagen zuverlässig
jede Stylesheet-Regel, unabhängig davon, wie/wo Astro importierte CSS-Dateien beim
Bundling platziert. Nur tatsächlich gesetzte Werte werden emittiert; fehlende Felder
lassen die entsprechende `tokens.css`-Standardvariable unangetastet.

### `Logo.astro`

Wechselt von `fs.existsSync('public/logo.svg')` auf eine `src`-Prop. Kein
Node-Dateisystemzugriff mehr nötig. `public/logo.svg` (aktuell im Repo vorhanden)
wird entfernt — das Storyblok-Asset-Feld ersetzt den Datei-Mechanismus vollständig,
zwei parallele Logo-Quellen wären verwirrend.

### `Navigation.astro` / `Footer.astro`

Bekommen eine neue optionale `logoSrc`-Prop, gereicht an `<Logo src={logoSrc} .../>`.

### `Page.astro`

Holt `settings` selbst (eigener Aufruf von `getSiteSettings()`), extrahiert
`settings?.logo?.filename`, reicht es an `<Navigation>` und `<Footer>` durch.

### Route (`src/pages/[...slug].astro`)

`getStaticPaths` bekommt `excluding_slugs: 'settings'` im CDN-API-Aufruf, damit die
Einstellungen-Story nicht als eigene (kaputte) Seite gerendert wird — sie hat keinen
registrierten `page`-kompatiblen Component-Typ und würde sonst über den
Fallback-Mechanismus als Fehlerseite unter `/settings` erscheinen.

## Was sich NICHT ändert

- `--color-accent` (nur Fokus-Ringe) und die Spacing-/Radius-/Schatten-Tokens bleiben
  Code-only — nicht Teil dieser Anfrage, war schon in `docs/branding.md` so
  festgelegt.
- Keine automatische WCAG-Kontrastprüfung beim Speichern in Storyblok möglich (dafür
  bräuchte es ein eigenes Storyblok-Feld-Plugin, außerhalb des Umfangs) — bleibt eine
  manuelle Verantwortung, wird in der Doku weiterhin so benannt.

## Doku-Updates

- `docs/branding.md`: Farben/Schriften/Logo-Abschnitte auf "in Storyblok einstellen"
  umschreiben statt "Datei bearbeiten"
- `docs/storyblok-setup.md`: neuen Abschnitt für die `settings`-Story ergänzen

## Verifikation

- `npm run build` fehlerfrei, sowohl mit leerer `settings`-Story (aktueller Zustand:
  leere Font-Felder, alte `color_primary`) als auch nach Befüllung
- Prüfen, dass `/settings` nicht als eigene Seite im Build-Output auftaucht
- Live-Check: `color_primary` auf Teal zurücksetzen (`#1f6f78`), Font-Dropdowns
  befüllen, Logo hochladen — alles sollte auf `https://localhost:4321/` sofort
  erscheinen (Storyblok-Cache ist bereits deaktiviert)
