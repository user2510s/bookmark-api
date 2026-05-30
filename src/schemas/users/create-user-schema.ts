import { z } from "zod";

export const createUserSchema = z.object({
  email: z.email(),
  password: z.string().min(6),
  name: z.string(),
  lastName: z.string(),
  tags: z.array(z.string()).min(5),
});

export type CreateUserDTO = z.infer<typeof createUserSchema>;
