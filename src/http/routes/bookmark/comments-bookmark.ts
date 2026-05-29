import z from "zod";
import { FastifyTypedInstance } from "../../../@types/types";
import { prisma } from "../../../lib/prisma";
import verifyAuth from "../../../http/middlewares/auth";

export async function commentsBookmark(app: FastifyTypedInstance) {
  app.post(
    "/comments/bookmark",
    {
      preHandler: [verifyAuth],

      schema: {
        tags: ["bookmark", "comments"],

        body: z.object({
          comment: z.string(),
          bookId: z.string(),
          parentId: z.string().optional(),
        }),

        response: {
          200: z.object({
            comments: z.object({
              bookId: z.string(),
              userId: z.string(),
              comment: z.string(),
              parentId: z.string().nullable(),
              answerTo: z.string().nullable(),
            }),
          }),

          401: z.object({
            message: z.string(),
          }),

          404: z.object({
            message: z.string(),
          }),
        },
      },
    },

    async (req, rep) => {
      const { comment, bookId, parentId } = req.body;
      try {
        const book = await prisma.bookMark.findUnique({
          where: {
            id: bookId,
          },
        });

        if (!book) {
          return rep.status(401).send({
            message: "Insira um id valido",
          });
        }
        let answerTo: string | undefined;

        if (parentId) {
          const parentComment = await prisma.comment.findFirst({
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

          if (!parentComment) {
            return rep.status(404).send({
              message: "Comentário pai não encontrado",
            });
          }

          answerTo = parentComment.user.name;
        }

        const comments = await prisma.comment.create({
          data: {
            bookId,
            userId: req.user.id,
            comment,
            parentId,
            answerTo,
          },
        });

        return rep.status(200).send({ comments });
      } catch (err) {
        return rep.status(401).send({
          message: "Não foi possivel criar o comentario",
        });
      }
    },
  );
}
