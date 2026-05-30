import { prisma } from "../../../lib/prisma";
import { createHash } from "../../../util/hash";

interface CreateUserRequest {
  email: string;
  password: string;
  name: string;
  lastName: string;
  tags: string[];
}

export async function createUserService({
  email,
  password,
  name,
  lastName,
  tags,
}: CreateUserRequest) {
  const userExists = await prisma.user.findUnique({
    where: { email },
  });

  if (userExists) {
    throw new Error("EMAIL_ALREADY_EXISTS");
  }

  const hashedPassword = await createHash(password);

  await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      name,
      lastName,
      tags,
      createdAt: new Date(),
    },
  });

  return {
    success: true,
    message: "Usuario criado com sucesso!",
  };
}
