declare namespace NodeJS {
  export interface ProcessEnv {
    MONGO_CONNECTION_STRING: string;
    GOOGLE_ID: string;
    GOOGLE_SECRET: string;

    CLIENT_URL: string;
    PORT: string;

    JWT_SECRET: string;
    DEFAULT_USER_BOOKING_LIMIT: string;
    MAX_SESSION_DURATION_SECONDS: string;
  }
}
