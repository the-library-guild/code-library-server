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
import rentableSettings from "./data/rentable.settings";

const app = express();

const testUser = {
  name: "Linus Bolls",
  email: "linus.bolls@code.berlin",
  permsInt: rentableSettings.LIBRARIAN_PERMS_INT,
  rentingLimit: rentableSettings.LIBRARIAN_BOOKING_LIMIT,
};

const corsOptions = {
  credentials: true,
  origin: env.ALLOWED_ORIGINS,
};
app.use(cors(corsOptions));
app.use(cookieParser());

const logMongoDb = (arg: any) =>
  console.info(chalk.green(`[Server][MongoDb] ${arg}`));

const logGraphQl = (arg: any) =>
  console.info(chalk.magenta(`[Server][GraphQl] ${arg}`));

async function startMongo() {
  logMongoDb("Connecting to " + env.MONGO_CONNECTION_STRING);

  await connect(env.MONGO_CONNECTION_STRING);
  await migrateDb();
}
async function main() {
  startMongo();

  const server = new ApolloServer({
    introspection: !env.IS_PROD,
    typeDefs,
    resolvers,
    context: authMiddleware(process.env.NODE_ENV === "test" && testUser),
  });
  await server.start();

  server.applyMiddleware({ app });

  app.listen(env.PORT, () => {
    const envMode = process.env.NODE_ENV || "development";

    const capitalizedEnvMode =
      envMode.charAt(0).toUpperCase() + envMode.slice(1);

    logGraphQl(
      `Listening on http://localhost:${env.PORT}/graphql/ in ${capitalizedEnvMode} Mode`
    );
    logGraphQl(`Accepting Requests from ${env.ALLOWED_ORIGINS.join(", ")}`);
  });
}
main().catch((err) => console.error("[Server] Error Occured:", err));
