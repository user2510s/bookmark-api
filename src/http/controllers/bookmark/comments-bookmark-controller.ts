import { FastifyReply, FastifyRequest } from "fastify";
import { CommentRepository } from "../../../repositories/bookmark/comments-repository";
import { CommentService } from "../../../services/bookmark/comments-bookmark-service";

export class CommentController {
  async create(req: FastifyRequest, rep: FastifyReply) {
    const { comment, bookId, parentId } = req.body as {
      comment: string;
      bookId: string;
      parentId?: string;
    };

    const repository = new CommentRepository();
    const service = new CommentService(repository);

    try {
      const comments = await service.execute({
        bookId,
        comment,
        parentId,
        userId: req.user.id,
      });

      return rep.status(200).send({
        comments,
      });
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === "BOOK_NOT_FOUND") {
          return rep.status(404).send({
            message: "Insira um id válido",
          });
        }

        if (error.message === "PARENT_COMMENT_NOT_FOUND") {
          return rep.status(404).send({
            message: "Comentário pai não encontrado",
          });
        }
      }

      return rep.status(500).send({
        message: "Não foi possível criar o comentário",
      });
    }
  }
}
