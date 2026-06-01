import { FastifyReply, FastifyRequest } from "fastify";
import { CreateBookmarkService } from "../../../services/bookmark/create-bookmark-service";
import { BookmarkRepository } from "../../../repositories/bookmark/bookmark-repository";

const bookmarkRepository = new BookmarkRepository();
const createBookmarkService = new CreateBookmarkService(bookmarkRepository);

export async function createBookmarkController(
  req: FastifyRequest,
  rep: FastifyReply,
) {
  const { description, image, title, amazonLink, totalRead, totalPage, tags } =
    req.body as any;
  try {
    const bookmark = await createBookmarkService.execute({
      title,
      description,
      image,
      amazonLink,
      totalRead,
      totalPage,
      tags,
      userId: req.user.id,
    });
    return rep.status(201).send(bookmark);
  } catch (err) {
    console.log(err);
    return rep.send({
      message: "não foi possivel criar o bookmark!",
    });
  }
}
