## Projekt

Florawerk GmbH — Gemeinwohlbericht 2025: ein lokal sichtbarer Beispielbericht als
wiederverwendbares Template. Stack: Astro + Storyblok (Headless CMS, EU-Region). Kein
Deployment nötig, lokale Vorschau im Browser reicht. Sprache: nur Deutsch, kein i18n.

## Architektur

- `src/pages/[...slug].astro` — Catch-All-Route, rendert Storyblok-Stories
- `src/storyblok/` — CMS-Bausteine (Bloks), werden von `@storyblok/astro` auto-resolved
- `src/components/` — statisches Rahmen/Shell (Navigation, Hero, Footer), nicht CMS-gebunden
- `src/layouts/BaseLayout.astro` — HTML-Grundgerüst, globales CSS, SEO-Basis
- `src/styles/tokens.css` — Design-Tokens (Farben, Schriften, Abstände) als CSS Custom
  Properties, zentrale Stelle für Kunden-Branding
- `docs/beispielbericht.md` — fiktive Inhalts-Referenz für den Beispielbericht

## Prioritäten

1. Barrierefreiheit (WCAG AA, Tastaturbedienbarkeit, aria-Attribute)
2. Mobile-first responsives Layout
3. Minimales client-seitiges JavaScript (nur wo nötig: KPI-Zähler, Matrix,
   Scroll-Fortschritt), Astro-Inseln (`client:visible`) statt globalem JS
4. Performance (Lighthouse)

## Arbeitsweise

- Jeder Baustein: Astro-Komponente + zugehöriges Storyblok-Blok-Schema (Felder werden
  manuell in der Storyblok-Oberfläche angelegt, siehe jeweilige Anleitung im Verlauf)
- Ein Commit pro abgeschlossenem Arbeitsschritt
- `.env` enthält den Storyblok-Preview-Token, wird nie committed

## Einmalige Einrichtung: lokales HTTPS-Zertifikat

Der Dev-Server läuft über HTTPS (`vite-plugin-mkcert`), das der Storyblok Visual Editor
im iframe benötigt. Beim allerersten `astro dev` fragt macOS per `sudo`-Prompt, ob das
lokale mkcert-Root-Zertifikat der Keychain vertraut werden soll — das funktioniert nur
in einem echten Terminal mit TTY, nicht aus einer Agent-Sandbox heraus. Bitte einmalig
manuell im eigenen Terminal ausführen:

```
npx astro dev
```

Danach den `sudo`-Passwort-Prompt bestätigen. Ab dann läuft `astro dev --background`
auch automatisiert, weil das Zertifikat bereits vertraut ist.

**Preview-URL in Storyblok eintragen:** Nach dem ersten Start unter *Space Settings →
Visual Editor → Preview URL* `https://localhost:4321/` (Port ggf. anpassen) eintragen.

## Development

When starting the dev server, use background mode:

```
astro dev --background
```

Manage the background server with `astro dev stop`, `astro dev status`, and `astro dev logs`.

## Documentation

Full documentation: https://docs.astro.build

Consult these guides before working on related tasks:

- [Adding pages, dynamic routes, or middleware](https://docs.astro.build/en/guides/routing/)
- [Working with Astro components](https://docs.astro.build/en/basics/astro-components/)
- [Using React, Vue, Svelte, or other framework components](https://docs.astro.build/en/guides/framework-components/)
- [Adding or managing content](https://docs.astro.build/en/guides/content-collections/)
- [Adding styles or using Tailwind](https://docs.astro.build/en/guides/styling/)
- [Supporting multiple languages](https://docs.astro.build/en/guides/internationalization/)
