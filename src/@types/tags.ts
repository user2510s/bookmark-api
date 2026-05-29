// tags.ts
export const AVAILABLE_TAGS = [
  "acao",
  "romance",
  "ficcao",
  "terror",
  "comedia",
  "drama",
] as const;

// cria automaticamente:
// type Tag = "acao" | "romance" | ...
export type Tag = (typeof AVAILABLE_TAGS)[number];
