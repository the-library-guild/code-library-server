import { config } from "dotenv";

import { EnvZod } from "./definitions/zod";
/**
 * exports type parsed environment variables (i.e. PORT: "420" becomes PORT: 420) for linting and auto completion purposes.
 * in staging and prod, these are sourced from process.env (injected via heroku), in development from the local .env file
 */
function getEnvSrc() {
  const { error, parsed } = config();

  if (error || parsed == null) return process.env;

  return parsed;
}

const hardcodedAdmins = [
  "marcelo.teixeira@code.berlin",
  "linus.bolls@code.berlin",

  "alex.maurer@code.berlin",
  "lida.masouleh@code.berlin",
  "alexander.gerick@code.berlin",
  "maya.alroy@code.berlin",
];

function parseEnv(env: { [key: string]: string }) {
  return {
    IS_PROD: env.NODE_ENV === "production",
    PORT: parseInt(env.PORT),
    ALLOWED_ORIGINS: JSON.parse(env.ALLOWED_ORIGINS ?? "[]"),

    MONGO_CONNECTION_STRING: env.MONGO_CONNECTION_STRING,
    JWT_SECRET: env.JWT_SECRET,

    GOOGLE_ID: env.GOOGLE_ID,
    GOOGLE_SECRET: env.GOOGLE_SECRET,
  };
}
function validateEnv(env: { [key: string]: any }) {
  const parsedEnv = EnvZod.safeParse(env);

  if (!parsedEnv.success)
    throw new Error(
      "Failed to Parse Environment Variables: " +
        JSON.stringify((parsedEnv as any).error.issues, null, 2)
    );

  return parsedEnv.data;
}
export default validateEnv(parseEnv(getEnvSrc()));
