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
