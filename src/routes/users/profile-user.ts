import z from "zod";
import { FastifyTypedInstance } from "../../@types/types";
import { prisma } from "../../lib/prisma";

export async function profileUser(app: FastifyTypedInstance) {
  app.get(
    "/profile/users",
    {
      schema: {
        tags: ["users"],
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

      const profile = await prisma.user.findUnique({
        where: {
          id: decode.id,
        },
        select: {
          name: true,
          lastName: true,
          createAt: true,
        },
      });

      return rep.status(201).send(profile);
    },
  );
}
