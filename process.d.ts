declare namespace NodeJS {
  export interface ProcessEnv {
    PORT: string;
    ALLOWED_ORIGINS: string;

    MONGO_CONNECTION_STRING: string;
    JWT_SECRET: string;

    GOOGLE_ID: string;
    GOOGLE_SECRET: string;

    MAX_SESSION_DURATION_SECONDS: string;
    DEFAULT_USER_BOOKING_LIMIT: string;
  }
}
