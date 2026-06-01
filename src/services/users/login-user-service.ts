import { UserRepository } from "../../repositories/user/user-repository";
import { LoginUserDTO } from "../../schemas/users/login-user-schema";
import { verifyHash } from "../../util/hash";

export class LoginUserService {
  constructor(private userRepository: UserRepository) {}

  async execute({ email, password }: LoginUserDTO) {
    const user = await this.userRepository.findByEmail(email);

    if (!user) {
      throw new Error("INVALIDE_CREDENTIALS");
    }

    const isPassword = await verifyHash(password, user.password);

    if (!isPassword) {
      throw new Error("INVALIDE_CREDENTIALS");
    }

    return user;
  }
}
