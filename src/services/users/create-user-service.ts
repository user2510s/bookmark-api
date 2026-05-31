// services/user/create-user-service.ts

import { createHash } from "../../../util/hash";
import { UserRepository } from "../../../repositories/user/user-repository";
import { CreateUserDTO } from "../../../schemas/users/create-user-schema";

export class CreateUserService {
  constructor(private userRepository: UserRepository) {}

  async execute({ email, password, name, lastName, tags }: CreateUserDTO) {
    const userExists = await this.userRepository.findByEmail(email);

    if (userExists) {
      throw new Error("EMAIL_ALREADY_EXISTS");
    }

    const hashedPassword = await createHash(password);

    await this.userRepository.create({
      email,
      password: hashedPassword,
      name,
      lastName,
      tags,
    });

    return {
      success: true,
      message: "Usuário criado com sucesso!",
    };
  }
}
