// @ts-check
import { defineConfig } from 'astro/config';
import { storyblok } from '@storyblok/astro';
import mkcert from 'vite-plugin-mkcert';
import { loadEnv } from 'vite';

const env = loadEnv('', process.cwd(), 'STORYBLOK');

// https://astro.build/config
export default defineConfig({
  integrations: [
    storyblok({
      accessToken: env.STORYBLOK_TOKEN,
      apiOptions: {
        region: 'eu',
      },
      components: {
        page: 'storyblok/Page',
        teaser: 'storyblok/Teaser',
        statement: 'storyblok/Statement',
        kpi_card: 'storyblok/KpiCard',
        kpi_grid: 'storyblok/KpiGrid',
        chart_embed: 'storyblok/ChartEmbed',
        accordion: 'storyblok/Accordion',
        accordion_item: 'storyblok/AccordionItem',
      },
      // Fängt Bloks aus altem Space-Startinhalt (z. B. "grid"/"feature") ab, die wir in
      // diesem Template nicht bauen — verhindert einen Build-Abbruch statt Fehler zu werfen.
      enableFallbackComponent: true,
    }),
  ],
  vite: {
    // HTTPS wird lokal für den Storyblok Visual Editor benötigt (Preview läuft im iframe).
    // Das Plugin generiert/aktiviert das Zertifikat automatisch und schaltet Vites
    // server.https ein. Erster Start ggf. im Vordergrund, falls das System nach der
    // Trust-Bestätigung für die lokale CA fragt.
    plugins: [mkcert()],
  },
});
