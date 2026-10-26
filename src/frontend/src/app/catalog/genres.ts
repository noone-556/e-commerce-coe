// How each genre LOOKS on screen. This is a frontend-only concern, so it lives here, not in the database.

// The look of one genre: an emoji, a background colour, and a picture.
// image is the path to a file in public/images/genres/ (null = no picture, show the emoji instead).
export interface GenreLook {
  emoji: string;
  color: string;
  image: string | null;
}

// A lookup table. Record<string, GenreLook> means:
// "the key is some text (the genre's slug), and the value is a GenreLook".
// const = this variable can't be pointed at a different table later.
// The image paths must match the real file names exactly, including .jpg / .webp.
const LOOKS: Record<string, GenreLook> = {
  comedy: { emoji: '😂', color: '#ffe08a', image: '/images/genres/comedy.jpg' },
  horror: { emoji: '👻', color: '#d9d2ff', image: '/images/genres/horror.webp' },
  fiction: { emoji: '📖', color: '#c9e9ff', image: '/images/genres/fiction.jpg' },
  history: { emoji: '🏛️', color: '#ffd8b8', image: '/images/genres/history.webp' },
  kids: { emoji: '🧸', color: '#c8f0cf', image: '/images/genres/kids.jpg' },
};

// Used for a genre that isn't in the table above (for example, a new genre added to the database later)
const FALLBACK: GenreLook = { emoji: '📚', color: '#e8e2da', image: null };

// Give me the look for a genre slug, e.g. genreLook('horror') -> { emoji: '👻', color: '#d9d2ff' }
// ?? means "if the left side is missing (undefined or null), use the right side instead".
export function genreLook(slug: string): GenreLook {
  return LOOKS[slug] ?? FALLBACK;
}
