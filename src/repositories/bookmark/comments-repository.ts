import { prisma } from "../../lib/prisma";

export class CommentRepository {
  async findBookById(bookId: string) {
    return prisma.bookMark.findUnique({
      where: {
        id: bookId,
      },
    });
  }

  async findParentComment(parentId: string) {
    return prisma.comment.findFirst({
      where: {
        id: parentId,
      },
      include: {
        user: {
          select: {
            name: true,
          },
        },
      },
    });
  }

  async create(data: {
    bookId: string;
    userId: string;
    comment: string;
    parentId?: string;
    answerTo?: string;
  }) {
    return prisma.comment.create({
      data,
    });
  }
}
