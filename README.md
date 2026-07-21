# Florawerk Nachhaltigkeitsbericht — Astro + Storyblok Template

Wiederverwendbares Template für digitale Nachhaltigkeitsberichte: ein einseitiger,
scrollbarer Bericht mit Kapitel-Navigation, aufgebaut aus Storyblok-editierbaren
Bausteinen. Der aktuelle Inhalt (Florawerk GmbH) ist ein fiktives Beispiel — siehe
[docs/beispielbericht.md](docs/beispielbericht.md).

**Live-Demo:** https://florawerk-nachhaltigkeitsbericht.netlify.app

## Tech-Stack

- [Astro](https://astro.build) (Static Site Generation)
- [Storyblok](https://www.storyblok.com) als Headless CMS (EU-Region)
- Reines CSS mit Custom Properties als Design-Token-System (kein Framework)
- Deployment: [Netlify](https://netlify.com), Auto-Deploy bei jedem Push auf `main`

## Setup

Voraussetzungen: Node ≥ 22.12, ein Storyblok-Space (EU-Region).

```sh
git clone https://github.com/SaschaCollet/GWOETest.git
cd GWOETest
npm install
```

`.env` im Projekt-Root anlegen (wird nie committet, siehe `.gitignore`):

```
STORYBLOK_TOKEN=dein_preview_token
```

Preview-Token: Storyblok-Space → *Settings → API Keys*.

**Einmalig beim allerersten Start:** Der Dev-Server läuft über HTTPS
(`vite-plugin-mkcert`), das der Storyblok Visual Editor im iframe benötigt. Beim
ersten `astro dev` fragt macOS/Linux per Passwort-Prompt, ob das lokale
mkcert-Root-Zertifikat vertraut werden soll — einmal bestätigen, danach läuft es
automatisch. Anschließend unter *Storyblok → Space Settings → Visual Editor →
Preview URL* `https://localhost:4321/` eintragen.

## Entwicklung

| Befehl | Wirkung |
|---|---|
| `npm run dev` | Dev-Server auf `https://localhost:4321`, liest Storyblok-Draft-Inhalte live |
| `npm run build` | Produktions-Build nach `dist/`, liest nur veröffentlichte Storyblok-Inhalte |
| `npm run preview` | Gebauten Stand lokal ansehen |

Der Storyblok-Content wird ohne Cache abgerufen (`astro.config.mjs`) — Änderungen im
CMS erscheinen nach einem Reload sofort, ganz ohne Server-Neustart.

## Projektstruktur

```
src/
├── pages/[...slug].astro   # Catch-All-Route, rendert Storyblok-Stories
├── storyblok/              # CMS-Bausteine (Bloks), automatisch aufgelöst
├── components/             # Statisches Rahmen/Shell (Navigation, Footer, Logo) — nicht CMS-gebunden
├── layouts/BaseLayout.astro
├── styles/tokens.css       # Design-Tokens (Farben, Schriften, Abstände)
└── lib/settings.ts         # Lädt Branding-Einstellungen aus der Storyblok-Story "settings"
```

## Verfügbare Bausteine

| Baustein | Beschreibung |
|---|---|
| `statement` | Großzitat mit Autor und optionalem Bild |
| `kpi_card` / `kpi_grid` | KPI-Kachel mit animiertem Zähler & Trend, im Raster |
| `chart_embed` | Datawrapper-/Flourish-Diagramm-Einbettung |
| `accordion` / `accordion_item` | Aufklappbare FAQ-Liste (nativ, ohne JS) |
| `timeline` / `timeline_item` | Vertikale Zeitleiste mit Meilensteinen |
| `materiality_matrix` / `matrix_topic` | Interaktive Wesentlichkeitsmatrix |
| `text_block` | Einfacher Fließtext, schmal oder volle Breite |
| `image_text` | Bild + Text nebeneinander, Bildposition wählbar |
| `stakeholder_block` | Bild + Text mit 6-stufiger Audit-Bewertungsskala |
| `big_stat` | Große zentrierte Zahl mit Bildunterschrift |
| `bar_chart` / `bar_chart_item` | Horizontales Balkendiagramm mit Icon je Balken |

Feldschemas und Einrichtung: [docs/storyblok-setup.md](docs/storyblok-setup.md).

## Branding anpassen

Farben, Schriften und Logo werden über eine globale Storyblok-Story (`settings`)
gesteuert — ohne Code-Änderung. Details: [docs/branding.md](docs/branding.md).

## Weiterführende Dokumentation

- [docs/storyblok-setup.md](docs/storyblok-setup.md) — alle Blok-Schemas, Home-Story-Aufbau
- [docs/branding.md](docs/branding.md) — Farben/Schriften/Logo über Storyblok
- [docs/beispielbericht.md](docs/beispielbericht.md) — Beispielinhalte (Florawerk GmbH, fiktiv)
- [AGENTS.md](AGENTS.md) — Projektkontext und Arbeitsweise für KI-Coding-Agents
- [docs/superpowers/](docs/superpowers/) — Design-Specs und Implementierungspläne der einzelnen Ausbaustufen
