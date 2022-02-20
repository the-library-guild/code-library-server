import { ApolloServer } from "apollo-server-express";
import { connect } from "mongoose";
import express from "express";
import chalk from "chalk";
import cors from "cors";
import cookieParser from "cookie-parser";

import typeDefs from "./definitions/graphql";
import resolvers from "./resolvers";
import { migrateDb } from "./migrateDb";
import authMiddleware from "./authMiddleware";
import env from "./env";

import router from "./pages/api/auth/[...nextauth]";

const app = express();

const corsOptions = {
  credentials: true,
  origin: env.ALLOWED_ORIGINS,
};
app.get("/api/auth", async (req: any, res: any, next: any) =>
  // console.log(await router(req, res))
  router(req, res)
);
app.use(cors(corsOptions));
app.use(cookieParser());

const logMongoDb = (arg: any) =>
  console.info(chalk.green(`[Server][MongoDb] ${arg}`));

const logGraphQl = (arg: any) =>
  console.info(chalk.magenta(`[Server][GraphQl] ${arg}`));

async function main() {
  logMongoDb("Connecting to " + env.MONGO_CONNECTION_STRING);

  await connect(env.MONGO_CONNECTION_STRING);
  await migrateDb();

  const server = new ApolloServer({
    introspection: env.IS_PROD,
    typeDefs,
    resolvers,
    context: authMiddleware,
  });
  await server.start();

  server.applyMiddleware({ app });

  app.listen(env.PORT, () => {
    const envMode = process.env.NODE_ENV || "development";

    const capitalizedEnvMode =
      envMode.charAt(0).toUpperCase() + envMode.slice(1);

    logGraphQl(
      `Listening on http://localhost:${env.PORT}/ in ${capitalizedEnvMode} Mode`
    );
    logGraphQl(`Accepting Requests from ${env.ALLOWED_ORIGINS.join(", ")}`);
  });
}
main().catch((err) => console.error("[Server] Error Occured:", err));
