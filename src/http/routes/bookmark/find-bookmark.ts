import z from "zod";
import { FastifyTypedInstance } from "../../../@types/types";
import { prisma } from "../../../lib/prisma";

export async function findBookmark(app: FastifyTypedInstance) {
  app.get(
    "/find/bookmark/:id",
    {
      schema: {
        tags: ["bookmark"],
        params: z.object({
          id: z.string(),
        }),
      },
    },
    async (req, rep) => {
      const { id } = req.params;
      try {
        const bookmark = await prisma.bookMark.findMany({
          where: {
            id,
          },
          select: {
            userId: false,
            title: true,
            description: true,
            amazonLink: true,
            image: true,
            views: true,
            like: true,

            comments: {
              select: {
                user: {
                  select: {
                    name: true,
                    lastName: true,
                  },
                },
                comment: true,
              },
            },
          },
        });
        return rep.send(bookmark);
      } catch (err) {
        return rep.send({ message: "Não foi encontrar o bookmark!" });
      }
    },
  );
}
