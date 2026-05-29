import z from "zod";
import { FastifyTypedInstance } from "../../../@types/types";
import { prisma } from "../../../lib/prisma";
import verifyAuth from "../../middlewares/auth";

// Oque Precisa ser feito
// atualmente lista as tags mais recentes e lista todas
// não faz mal listar as mais recentes, porem seria interesante que elas não
// se repetissem.

async function feedList(app: FastifyTypedInstance) {
  app.get(
    "/feed",
    {
      preHandler: [verifyAuth],
      schema: {
        querystring: z.object({
          page: z.coerce.number().min(1).default(1),
        }),
      },
    },
    async (req, rep) => {
      const id = req.user.id;
      const page = Number(req.query.page || 1);
      const limit = 10;

      const skip = (page - 1) * limit;
      const user = await prisma.user.findUnique({
        where: {
          id,
        },
        select: {
          tags: true,
        },
      });

      if (!user) {
        return rep.status(404).send({
          message: "Usuário não encontrado",
        });
      }

      const post = await prisma.bookMark.findMany({
        where: {
          tags: {
            hasSome: user.tags,
          },
        },
        select: {
          id: true,
        },
        orderBy: {
          createdAt: "desc",
        },
        skip,
        take: limit,
      });

      return rep.send(post);
    },
  );
}

export { feedList };
