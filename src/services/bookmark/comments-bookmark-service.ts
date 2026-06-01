import { CommentRepository } from "../../repositories/bookmark/comments-repository";
import { CommentSchemaDTO } from "../../schemas/bookmark/comments-bookmark-schema";

export class CommentService {
  constructor(private repository: CommentRepository) {}

  async execute({ bookId, userId, comment, parentId }: CommentSchemaDTO) {
    const book = await this.repository.findBookById(bookId);

    if (!book) {
      throw new Error("BOOK_NOT_FOUND");
    }

    let answerTo: string | undefined;

    if (parentId) {
      const parentComment = await this.repository.findParentComment(parentId);

      if (!parentComment) {
        throw new Error("PARENT_COMMENT_NOT_FOUND");
      }

      answerTo = parentComment.user.name;
    }

    return this.repository.create({
      bookId,
      userId,
      comment,
      parentId,
      answerTo,
    });
  }
}
