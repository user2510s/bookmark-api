import { FastifyReply, FastifyRequest } from "fastify";
import { CreateUserService } from "../../../services/users/create-user-service";
import { UserRepository } from "../../../repositories/user/user-repository";

const userRepository = new UserRepository();
const createUserService = new CreateUserService(userRepository);

export async function createUserController(
  req: FastifyRequest,
  rep: FastifyReply,
) {
  const { email, password, name, lastName, tags } = req.body as any;

  try {
    const result = await createUserService.execute({
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
