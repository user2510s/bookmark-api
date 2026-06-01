import { BookmarkRepository } from "../../repositories/bookmark/bookmark-repository";
import { CreateBookmarkDTO } from "../../schemas/bookmark/create-bookmark-schema";
const date = new Date();
export class CreateBookmarkService {
  constructor(private bookmarkRepository: BookmarkRepository) {}

  async execute({
    title,
    description,
    tags,
    image,
    amazonLink,
    totalPage,
    totalRead,
    userId,
  }: CreateBookmarkDTO) {
    await this.bookmarkRepository.create({
      title,
      description,
      tags,
      image,
      amazonLink,
      totalPage,
      totalRead,
      userId,
      createdAt: date,
    });

    return {
      success: true,
      message: "Bookmark criado com sucesso",
    };
  }
}
