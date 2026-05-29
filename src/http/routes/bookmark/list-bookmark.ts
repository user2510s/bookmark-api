import { FastifyTypedInstance } from "../../../@types/types";
import { prisma } from "../../../lib/prisma";
import verifyAuth from "../../../http/middlewares/auth";

export async function listBookmark(app: FastifyTypedInstance) {
  app.get(
    "/list/bookmark",
    {
      preHandler: [verifyAuth],
      schema: {
        tags: ["bookmark"],
      },
    },
    async (req, rep) => {
      try {
        const listBookmark = await prisma.bookMark.findMany({
          where: {
            userId: req.user.id,
          },
          select: {
            id: true,
            title: true,
            description: true,
            amazonLink: true,
            image: true,
            createdAt: true,
            totalRead: true,
            totalPage: true,
            views: true,
            user: {
              select: {
                name: true,
                lastName: true,
              },
            },
          },
        });

        return rep.send({ data: listBookmark });
      } catch (err) {
        return rep.send({ err: "não foi possivel carregar sua lista!" });
      }
    },
  );
}
