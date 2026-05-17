import z from "zod";
import { FastifyTypedInstance } from "../../@types/types";
import { prisma } from "../../lib/prisma";

export async function listBookmark(app: FastifyTypedInstance) {
  app.get(
    "/list/bookmark",
    {
      schema: {
        tags: ["bookmark"],
        security: [
          {
            bearerAuth: [],
          },
        ],
        headers: z.object({
          authorization: z.string(),
        }),
      },
    },
    async (req, rep) => {
      const authHeader = req.headers.authorization;
      const token = authHeader.split(" ")[1];
      const decode = app.jwt.verify(token) as { id: string };
      try {
        const listBookmark = await prisma.bookMark.findMany({
          where: {
            userId: decode.id,
          },
        });
        return rep.send(listBookmark);
      } catch (err) {
        return rep.send({ message: "não foi possivel carregar sua lista!" });
      }
    },
  );
}
