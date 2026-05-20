import fastify from "fastify";
import {
  jsonSchemaTransform,
  serializerCompiler,
  validatorCompiler,
  type ZodTypeProvider,
} from "fastify-type-provider-zod";
import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUi from "@fastify/swagger-ui";
import { fastifyCors } from "@fastify/cors";
import cookie from "@fastify/cookie";
import fastifyJwt from "@fastify/jwt";
import { routes } from "./routes/routes";
import "dotenv/config";

const app = fastify({ logger: true }).withTypeProvider<ZodTypeProvider>();

export function start() {
  const jwtSecret = process.env.JWT_SECRET;
  if (!jwtSecret) {
    throw new Error("JWT_SECRET is not defined");
  }
  app.register(fastifyJwt, { secret: jwtSecret });
  app.register(cookie, {
    secret: "my-secret", // for cookies signature
    hook: "onRequest", // set to false to disable cookie autoparsing or set autoparsing on any of the following hooks: 'onRequest', 'preParsing', 'preHandler', 'preValidation'. default: 'onRequest'
    parseOptions: {}, // options for parsing cookies
  });
  app.setValidatorCompiler(validatorCompiler);
  app.setSerializerCompiler(serializerCompiler);

  app.register(fastifyCors, { origin: "*" });
  app.register(fastifySwagger, {
    openapi: {
      info: {
        title: "bookmanager",
        version: "1.0.0",
      },
      components: {},
    },
    transform: jsonSchemaTransform,
  });

  app.register(fastifySwaggerUi, {
    routePrefix: "/docs",
  });

  app.register(routes);

  app.listen({
    port: Number(process.env.PORT),
  });
}
