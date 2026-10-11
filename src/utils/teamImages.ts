/*
 * Team portraits live in src/assets/team/ so Astro's image pipeline sees them
 * (public/ is copied verbatim). content.json refers to them by filename only,
 * e.g. "photo": "abubakar-khawaja.webp".
 */

const portraits = import.meta.glob<{ default: ImageMetadata }>('../assets/team/*.{webp,jpg,png}', {
  eager: true,
});

/** Maps a content.json team member `photo` filename to its processed image metadata. */
export function getTeamImage(photo?: string): ImageMetadata | undefined {
  if (!photo) return undefined;
  return portraits[`../assets/team/${photo}`]?.default;
}
