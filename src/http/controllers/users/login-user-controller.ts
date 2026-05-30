import { FastifyReply } from "fastify";
import { FastifyRequest } from "fastify/types/request";
import { LoginUserService } from "../../service/users/login-user-service";
import { UserRepository } from "../../../repositories/user/user-repository";

const userRepository = new UserRepository();
const loginUserService = new LoginUserService(userRepository);

export async function loginUserController(
  req: FastifyRequest,
  rep: FastifyReply,
) {
  const { email, password } = req.body as any;

  try {
    const user = await loginUserService.execute({
      email,
      password,
    });

    const token = req.server.jwt.sign(
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
    if (err instanceof Error) {
      if (err.message === "INVALIDE_CREDENTIALS") {
        return rep.status(401).send({
          message: "Usuario ou senha incorreto",
        });
      }
    }

    return rep.status(500).send({
      message: "internal server error",
    });
  }
}
