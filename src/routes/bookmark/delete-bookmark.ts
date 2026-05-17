import z from "zod";
import { FastifyTypedInstance } from "../../@types/types";
import { prisma } from "../../lib/prisma";

export async function deleteBookmark(app: FastifyTypedInstance) {
  app.delete(
    "/delete/bookmark",
    {
      schema: {
        tags: ["bookmark"],
        body: z.object({
          id: z.string(),
          verify: z.boolean(),
        }),
        security: [
          {
            bearerAuth: [],
          },
        ],
        headers: z.object({
          authorization: z.string(),
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
      const authHeader = req.headers.authorization;
      const token = authHeader.split(" ")[1];
      const decode = app.jwt.verify(token) as { id: string };
      if (!verify) {
        return rep.status(401).send({
          message: "Não foi possivel apagar o bookmark",
        });
      }
      if (!token) {
        return rep.status(401).send({
          message: "Não foi possivel apagar o bookmark",
        });
      }
      if (!decode.id) {
        return rep.status(401).send({
          message: "Não foi possivel apagar o bookmark",
        });
      }

      try {
        await prisma.bookMark.delete({
          where: { id, userId: decode.id },
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
