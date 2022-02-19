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

const app = express();
const allowedDomains = [env.CLIENT_URL, "https://studio.apollographql.com"];

const corsOptions = {
  credentials: true,
  origin: allowedDomains,
};
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
    introspection: process.env.NODE_ENV === "production",
    typeDefs,
    resolvers,
    context: authMiddleware,
  });
  logGraphQl("Starting Server");

  await server.start();

  logGraphQl("Applying Express Middleware");

  server.applyMiddleware({ app });

  app.listen(env.PORT, () =>
    logGraphQl(`Listening on http://localhost:${env.PORT}/`)
  );
}
main().catch((err) => console.error("[Server] Error Occured:", err));
