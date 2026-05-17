import { FastifyTypedInstance } from "../@types/types";
import { createBookmark } from "./bookmark/create-bookmark";
import { deleteBookmark } from "./bookmark/delete-bookmark";
import { findBookmark } from "./bookmark/find-bookmark";
import { listBookmark } from "./bookmark/list-bookmark";
import { createUser } from "./users/create-user";
import { loginUser } from "./users/login-user";
import { profileUser } from "./users/profile-user";

export async function routes(app: FastifyTypedInstance) {
  app.register(createBookmark);
  app.register(listBookmark);
  app.register(findBookmark);
  app.register(deleteBookmark);

  app.register(createUser);
  app.register(loginUser);
  app.register(profileUser);
}
