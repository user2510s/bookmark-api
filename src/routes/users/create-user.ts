import z from "zod";
import { FastifyTypedInstance } from "../../@types/types";
import { prisma } from "../../lib/prisma";
import { createHash } from "../../util/hash";

export async function createUser(app: FastifyTypedInstance) {
  app.post(
    "/create/users",
    {
      schema: {
        tags: ["users"],
        description: "Create a new User",
        body: z.object({
          email: z.string().email(),
          password: z.string().min(5),
          name: z.string(),
          lastName: z.string(),
        }),
        response: {
          201: z
            .object({
              user: z.string(),
              date: z.string(),
            })
            .describe("Create user"),
          401: z
            .object({
              message: z.string(),
            })
            .optional()
            .describe("Erro ao criar usuario"),
        },
      },
    },
    async (req, rep) => {
      const { email, password, name, lastName } = req.body;

      try {
        const hashedPassword = await createHash(password);
        const date = new Date();

        await prisma.user.create({
          data: {
            email,
            password: hashedPassword,
            name,
            lastName,
            createAt: date,
          },
        });
        return rep.status(201).send({
          user: `${name} `,
          date: `${date}`,
        });
      } catch (err) {
        return rep.status(401).send({
          message: "Verifique os campos preenchidos.",
        });
      }
    },
  );
}
