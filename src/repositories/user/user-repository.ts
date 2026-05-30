// repositories/user/user-repository.ts

import { prisma } from "../../lib/prisma";

export class UserRepository {
  async findByEmail(email: string) {
    return prisma.user.findUnique({
      where: { email },
    });
  }

  async create(data: {
    email: string;
    password: string;
    name: string;
    lastName: string;
    tags: string[];
  }) {
    return prisma.user.create({
      data,
    });
  }
}
