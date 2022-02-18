import { config } from "dotenv";

const { error, parsed } = config();

if (error || parsed == null) throw error;

const env = {
  MONGO_CONNECTION_STRING: parsed.MONGO_CONNECTION_STRING,

  GOOGLE_ID: parsed.GOOGLE_ID,
  GOOGLE_SECRET: parsed.GOOGLE_SECRET,

  CLIENT_URL: parsed.CLIENT_URL,
  PORT: parseInt(parsed.PORT),

  MAX_SESSION_DURATION_SECONDS: parseInt(parsed.MAX_SESSION_DURATION_SECONDS),
  DEFAULT_USER_BOOKING_LIMIT: parseInt(parsed.DEFAULT_USER_BOOKING_LIMIT),
  JWT_SECRET: parsed.JWT_SECRET,
};
export default env;
