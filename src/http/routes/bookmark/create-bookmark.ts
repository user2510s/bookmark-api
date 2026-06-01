import { FastifyTypedInstance } from "../../../@types/types";
import z from "zod";
import { prisma } from "../../../lib/prisma";
import verifyAuth from "../../../http/middlewares/auth";
import { AVAILABLE_TAGS } from "../../../@types/tags";
import { createBookmarkController } from "../../controllers/bookmark/create-bookmark-controller";

export async function createBookmark(app: FastifyTypedInstance) {
  app.post(
    "/create/bookmark",
    {
      preHandler: [verifyAuth],
      schema: {
        tags: ["bookmark"],
        body: z.object({
          title: z.string(),
          description: z.string(),
          image: z
            .url()
            .default(
              "https://i.pinimg.com/1200x/2b/a7/d4/2ba7d465604ed99b9b49c70a60232c6f.jpg",
            ),
          amazonLink: z.url().default("https://www.amazon.com.br/"),
          totalRead: z.number().default(0),
          totalPage: z.number().default(1),
          tags: z
            .array(z.enum(AVAILABLE_TAGS))
            .min(2, { error: "Precisa de no minimo 5 tags" }),
        }),
      },
    },
    createBookmarkController,
  );
}
