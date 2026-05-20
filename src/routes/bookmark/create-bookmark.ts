import { FastifyTypedInstance } from "../../@types/types";
import z from "zod";
import { prisma } from "../../lib/prisma";

export async function createBookmark(app: FastifyTypedInstance) {
  app.post(
    "/create/bookmark",
    {
      schema: {
        tags: ["bookmark"],
        body: z.object({
          title: z.string(),
          description: z.string(),
          image: z.url(),
        }),
      },
    },
    async (req, rep) => {
      const { description, image, title } = req.body;
      const date = new Date();
      const token = req.cookies["user_login"] as string;
      const decode = app.jwt.verify(token) as { id: string };
      try {
        const bookmark = await prisma.bookMark.create({
          data: {
            title,
            description,
            image,
            createAt: String(date),

            user: {
              connect: {
                id: decode.id,
              },
            },
          },
        });
        return rep.send(bookmark);
      } catch (err) {
        return rep.send({
          message: "não foi possivel criar o bookmark!",
        });
      }
    },
  );
}
