import z, { describe } from "zod";
import { FastifyTypedInstance } from "../../../@types/types";
import { prisma } from "../../../lib/prisma";
import { verifyHash } from "../../../util/hash";

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
    async (req, rep) => {
      const { email, password } = req.body;

      try {
        const user = await prisma.user.findUnique({
          where: { email },
        });

        if (!user) {
          return rep.status(401).send({
            message: "Usuario ou senha incorreta",
          });
        }

        const isPassword = await verifyHash(password, user.password);

        if (!isPassword) {
          return rep.status(401).send({
            message: "Usuario ou senha incorreta",
          });
        }

        const token = app.jwt.sign(
          {
            id: user.id,
            email: user.email,
          },
          {
            expiresIn: "1h",
          },
        );

        const isProd = process.env.NODE_ENV === "production";

        rep.cookie("user_login", token, {
          httpOnly: true,
          secure: isProd,
          sameSite: isProd ? "none" : "lax",
          maxAge: 60 * 60, // 1h em segundos
          path: "/",
          domain: isProd ? "" : "localhost",
        });

        return rep.status(200).send({
          message: "Usuario encontrado",
        });
      } catch (err) {
        console.error(err);
        return rep.status(500).send({
          message: "Internal server error",
        });
      }
    },
  );
}
