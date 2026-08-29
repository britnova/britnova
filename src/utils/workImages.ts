/*
 * Heroes live in src/assets/ rather than public/ so Astro's image pipeline
 * sees them; public/ is copied verbatim. content.json still refers to them by
 * their old public path, so match on filename instead of rewriting content.
 */

const heroes = import.meta.glob<{ default: ImageMetadata }>('../assets/work/*.jpg', {
  eager: true,
});

/** Maps a content.json `heroImage` path to its processed image metadata. */
export function getWorkImage(heroImage?: string): ImageMetadata | undefined {
  if (!heroImage) return undefined;
  const filename = heroImage.split('/').pop();
  return heroes[`../assets/work/${filename}`]?.default;
}

/** Grid cards: 3-up inside max-w-7xl (~389px), 2-up at md, full-bleed on mobile. */
export const CARD_WIDTHS = [400, 600, 800];
export const CARD_SIZES = '(min-width: 1024px) 400px, (min-width: 768px) 45vw, 92vw';

/** Case-study hero: fills the max-w-4xl (896px) article column. */
export const HERO_WIDTHS = [640, 896, 1344, 1792];
export const HERO_SIZES = '(min-width: 896px) 896px, 92vw';
