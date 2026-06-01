import { z } from "zod";
import { AVAILABLE_TAGS } from "../../@types/tags";

export const createBookmarkSchema = z.object({
  title: z.string(),
  description: z.string(),
  image: z.url(),
  amazonLink: z.url(),
  totalRead: z.number(),
  totalPage: z.number(),
  tags: z.array(z.enum(AVAILABLE_TAGS)),
  userId: z.string(),
  createdAt: z.date().optional(),
});

export type CreateBookmarkDTO = z.infer<typeof createBookmarkSchema>;
