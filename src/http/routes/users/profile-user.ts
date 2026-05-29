import { FastifyTypedInstance } from "../../../@types/types";
import { prisma } from "../../../lib/prisma";
import verifyAuth from "../../../http/middlewares/auth";

export async function profileUser(app: FastifyTypedInstance) {
  app.get(
    "/profile/users",
    {
      preHandler: [verifyAuth],
      schema: {
        tags: ["users"],
      },
    },
    async (req, rep) => {
      try {
        const profile = await prisma.user.findUnique({
          where: {
            id: req.user.id,
          },
          select: {
            name: true,
            lastName: true,
            createdAt: true,
          },
        });

        return rep.status(201).send(profile);
      } catch (err) {
        return rep.status(404).send({
          message: "erro ao buscar dados",
        });
      }
    },
  );
}
