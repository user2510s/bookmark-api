import { FastifyReply, FastifyRequest } from "fastify";

export default async function verifyAuth(
  req: FastifyRequest,
  rep: FastifyReply,
) {
  const token = req.cookies["user_login"];

  if (!token) {
    return rep.status(401).send({
      message: "Token inválido",
    });
  }

  try {
    const decoded = req.server.jwt.verify(token) as {
      id: string;
    };

    req.user = decoded;
  } catch {
    return rep.status(401).send({
      message: "Token inválido",
    });
  }
}
