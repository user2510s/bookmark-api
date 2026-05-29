import z from "zod";
import { FastifyTypedInstance } from "../../../@types/types";
import { prisma } from "../../../lib/prisma";
import verifyAuth from "../../../http/middlewares/auth";

export async function deleteBookmark(app: FastifyTypedInstance) {
  app.delete(
    "/delete/bookmark",
    {
      preHandler: [verifyAuth],
      schema: {
        tags: ["bookmark"],
        body: z.object({
          id: z.string(),
          verify: z.boolean().default(false),
        }),
        response: {
          201: z.object({
            message: z.string(),
          }),
          401: z.object({
            message: z.string(),
          }),
        },
      },
    },
    async (req, rep) => {
      const { id, verify } = req.body;
      if (!verify) {
        return rep.status(401).send({
          message: "Não foi possivel apagar o bookmark",
        });
      }
      if (!req.user.id) {
        return rep.status(401).send({
          message: "Não foi possivel apagar o bookmark",
        });
      }

      try {
        await prisma.bookMark.delete({
          where: { id, userId: req.user.id },
        });
        return rep.status(201).send({
          message: "Bookmark apagado com sucesso",
        });
      } catch (err) {
        return rep.status(401).send({
          message: "Não foi possivel apagar o bookmark",
        });
      }
    },
  );
}
