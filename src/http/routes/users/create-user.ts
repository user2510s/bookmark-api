import z from "zod";
import { FastifyTypedInstance } from "../../../@types/types";
import { prisma } from "../../../lib/prisma";
import { createHash } from "../../../util/hash";
import { AVAILABLE_TAGS } from "../../../@types/tags";

export async function createUser(app: FastifyTypedInstance) {
  app.post(
    "/create/users",
    {
      schema: {
        tags: ["users"],
        description: "Create a new User",
        body: z.object({
          email: z
            .email({ error: "Precisa ser um email valido" })
            .min(6, { error: "Precisa ser um email valido" }),
          password: z.string().min(5, { error: "Senha muito curta" }),
          name: z.string().min(2, {
            error: "Nome muito pequeno precisa de no minimo 3 letras",
          }),
          lastName: z
            .string()
            .max(100, { error: "Nome muito grande use abreviaturas EX : S." }),
          tags: z
            .array(z.enum(AVAILABLE_TAGS))
            .min(2, { error: "Precisa de no minimo 5 tags" })
            .max(15, { error: "O maximo é 15 tags" }),
        }),
        response: {
          201: z
            .object({
              message: z.string().describe("Mensagem de sucesso"),
              success: z.boolean(),
            })
            .describe("Usuario criado"),
          401: z
            .object({
              message: z.string(),
              success: z.boolean(),
            })
            .optional()
            .describe("Erro ao criar usuario"),
          409: z
            .object({
              message: z.string(),
              success: z.boolean(),
            })
            .optional()
            .describe("Erro ao criar usuario"),
        },
      },
    },
    async (req, rep) => {
      const { email, password, name, lastName, tags } = req.body;

      try {
        const hashedPassword = await createHash(password);
        const date = new Date();

        const user = await prisma.user.findUnique({
          //valida se ja exite o email
          where: { email },
        });

        if (user) {
          return rep.status(409).send({
            success: false,
            message: "Esse email já está em uso.",
          });
        }

        await prisma.user.create({
          data: {
            email,
            password: hashedPassword,
            name,
            lastName,
            tags,
            createdAt: date,
          },
        });
        return rep.status(201).send({
          success: true,
          message: "Usuario criado com sucesso!",
        });
      } catch (err) {
        console.log(err);
        return rep.status(401).send({
          success: false,
          message: "Verifique os campos preenchidos.",
        });
      }
    },
  );
}
