import z from "zod";

export const commentSchema = z.object({
  bookId: z.string(),
  userId: z.string(),
  parentId: z.string().optional(),
  comment: z.string(),
});

export type CommentSchemaDTO = z.infer<typeof commentSchema>;
