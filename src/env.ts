import { config } from "dotenv";

const { error, parsed } = config();

function loadEnvFile() {
  if (error || parsed == null) throw error;

  return {
    MONGO_CONNECTION_STRING: parsed.MONGO_CONNECTION_STRING,

    GOOGLE_ID: parsed.GOOGLE_ID,
    GOOGLE_SECRET: parsed.GOOGLE_SECRET,

    CLIENT_URL: parsed.CLIENT_URL,
    PORT: parseInt(parsed.PORT),

    MAX_SESSION_DURATION_SECONDS: parseInt(parsed.MAX_SESSION_DURATION_SECONDS),
    DEFAULT_USER_BOOKING_LIMIT: parseInt(parsed.DEFAULT_USER_BOOKING_LIMIT),
    JWT_SECRET: parsed.JWT_SECRET,
  };
}
function parseIntValues(sache: { [key: string]: string | number }) {
  for (const [key, value] of Object.entries(sache)) {
    const canBeNumber = !isNaN(value as any);
    if (canBeNumber) sache[key] = parseInt(value as string);
  }
  return sache;
}

const env =
  process.env.NODE_ENV === "production"
    ? parseIntValues(process.env)
    : loadEnvFile();

export default env;
