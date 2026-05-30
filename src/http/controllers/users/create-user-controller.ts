// controllers/users/create-user-controller.ts

import { FastifyReply, FastifyRequest } from "fastify";
import { createUserService } from "../../service/users/create-user-service";

export async function createUserController(
  req: FastifyRequest,
  rep: FastifyReply,
) {
  const { email, password, name, lastName, tags } = req.body as any;

  try {
    const result = await createUserService({
      email,
      password,
      name,
      lastName,
      tags,
    });

    return rep.status(201).send(result);
  } catch (err) {
    if (err instanceof Error) {
      if (err.message === "EMAIL_ALREADY_EXISTS") {
        return rep.status(409).send({
          success: false,
          message: "Esse email já está em uso.",
        });
      }
    }

    return rep.status(500).send({
      success: false,
      message: "Erro interno do servidor.",
    });
  }
}
