import z from "zod";
import { FastifyTypedInstance } from "../../@types/types";
import { prisma } from "../../lib/prisma";
import { verifyHash } from "../../util/hash";

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
            token: z.string(),
          }),
          404: z.object({
            err: z.string(),
          }),
          500: z.object({
            err: z.string(),
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
          return rep.status(404).send({
            err: "User not found",
          });
        }

        const isPassword = await verifyHash(password, user.password);

        if (!isPassword) {
          return rep.status(404).send({
            err: "Invalid password",
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
          token,
        });
      } catch (err) {
        console.error(err);

        return rep.status(500).send({
          err: "Internal server error",
        });
      }
    },
  );
}
