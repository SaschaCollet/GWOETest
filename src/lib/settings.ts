import { useStoryblokApi } from '@storyblok/astro';

export interface SiteSettings {
  font_heading?: string;
  font_body?: string;
  color_primary?: string;
  color_secondary?: string;
  logo?: { filename?: string; alt?: string };
}

const FONT_STACKS = {
  serif_classic: `'Georgia', 'Iowan Old Style', serif`,
  serif_modern: `'Times New Roman', Times, serif`,
  sans_modern: `-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif`,
  sans_classic: `Arial, Helvetica, sans-serif`,
} as const;

/**
 * Storyblok liefert bei Single-Option-Feldern je nach Konfiguration den Anzeigenamen
 * (z. B. "Sans Modern") statt des technischen Werts ("sans_modern") — deshalb hier
 * beide Schreibweisen (Deutsch/Englisch, mit/ohne Unterstrich) als Alias zulassen,
 * statt den Redakteur:innen ein exaktes technisches Format vorzuschreiben.
 */
const FONT_ALIASES: Record<string, keyof typeof FONT_STACKS> = {
  serif_classic: 'serif_classic',
  'serif classic': 'serif_classic',
  'serif klassisch': 'serif_classic',
  serif_modern: 'serif_modern',
  'serif modern': 'serif_modern',
  sans_modern: 'sans_modern',
  'sans modern': 'sans_modern',
  sans_classic: 'sans_classic',
  'sans classic': 'sans_classic',
  'sans klassisch': 'sans_classic',
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
  if (!key) return undefined;
  const canonical = FONT_ALIASES[key.trim().toLowerCase()];
  return canonical ? FONT_STACKS[canonical] : undefined;
}
