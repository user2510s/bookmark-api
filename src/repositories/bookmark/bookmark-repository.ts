import { prisma } from "../../lib/prisma";

interface CreateBookmarkData {
  title: string;
  description: string;
  image: string;
  amazonLink: string;
  totalRead: number;
  totalPage: number;
  tags: string[];
  userId: string;
  createdAt: Date;
}

export class BookmarkRepository {
  async create(data: CreateBookmarkData) {
    return prisma.bookMark.create({
      data: {
        title: data.title,
        description: data.description,
        image: data.image,
        amazonLink: data.amazonLink,
        totalRead: data.totalRead,
        totalPage: data.totalPage,
        tags: data.tags,
        createdAt: data.createdAt,
        user: {
          connect: {
            id: data.userId,
          },
        },
      },
    });
  }
}
