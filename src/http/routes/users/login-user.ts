import z, { describe } from "zod";
import { FastifyTypedInstance } from "../../../@types/types";
import { prisma } from "../../../lib/prisma";
import { verifyHash } from "../../../util/hash";
import { loginUserController } from "../../controllers/users/login-user-controller";

export async function loginUser(app: FastifyTypedInstance) {
  app.post(
    "/login/users",
    {
      schema: {
        tags: ["users"],
        description: "Login with our user.",
        body: z.object({
          email: z.email({ error: "Email invalido" }),
          password: z.string().min(5, { error: "Senha muito curta" }).max(20),
        }),
        response: {
          200: z.object({
            message: z.string().describe("Mensagem de sucesso"),
          }),
          401: z.object({
            message: z.string().describe("Mensagem de erro"),
          }),
          500: z.object({
            message: z.string().describe("Mensagem de erro"),
          }),
        },
      },
    },
    loginUserController
  );
}
