// routes/users/create-user.ts

import z from "zod";
import { FastifyTypedInstance } from "../../../@types/types";
import { AVAILABLE_TAGS } from "../../../@types/tags";
import { createUserController } from "../../controllers/users/create-user-controller";

export async function createUser(app: FastifyTypedInstance) {
  app.post(
    "/create/users",
    {
      schema: {
        tags: ["users"],
        description: "Create a new User",
        body: z.object({
          email: z.email(),
          password: z.string().min(5),
          name: z.string().min(2),
          lastName: z.string().max(100),
          tags: z.array(z.enum(AVAILABLE_TAGS)).min(2).max(15),
        }),
      },
    },
    createUserController,
  );
}
