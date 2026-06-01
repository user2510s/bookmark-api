import z from "zod";
import { CommentController } from "../../controllers/bookmark/comments-bookmark-controller";
import { FastifyTypedInstance } from "../../../@types/types";
import verifyAuth from "../../middlewares/auth";

const controller = new CommentController();

export async function commentsBookmark(app: FastifyTypedInstance) {
  app.post(
    "/comments/bookmark",
    {
      preHandler: [verifyAuth],
      schema: {
        tags: ["bookmark", "comments"],
        body: z.object({
          comment: z.string(),
          bookId: z.string(),
          parentId: z.string().optional(),
        }),
      },
    },
    controller.create,
  );
}
