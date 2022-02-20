import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import jwt from "jsonwebtoken";

import env from "../../../src/env";

const validTimeInSeconds = parseInt(env.MAX_SESSION_DURATION_SECONDS);

// https://next-auth.js.org/configuration/options
export default NextAuth({
  secret: env.JWT_SECRET,
  providers: [
    GoogleProvider({
      clientId: env.GOOGLE_ID,
      clientSecret: env.GOOGLE_SECRET,
    }),
  ],
  pages: {
    signIn: "/login",
    signOut: "/logout",
    // we are not using these but lets keep them in anyway
    error: "/auth-error", // error code passed in query string as ?error=
    verifyRequest: "/auth-verify-request", // used to check email magic link message
    newUser: "/auth-new-user",
  },
  session: {
    strategy: "jwt",
    maxAge: validTimeInSeconds,
  },
  jwt: {
    /*
      next-auth is using non-standart jwts, which libraries like jsonwebtoken are to my knowledge unable to decode.
      since we are not using next-auth on the graphql backend, but still need to decode the jwts there,
      we are going with a 💫 custom 💫 implementation using jsonwebtoken.
      this is thankfully supported by next-auth.
      */
    encode: async ({ token }) => {
      if (token == null) return "";

      // the first token created after sign in only contains one key called state
      if (token.state) return jwt.sign(token, env.JWT_SECRET);

      const { name, email, picture } = token;
      const userData = { name, email, picture };

      return jwt.sign(userData, env.JWT_SECRET);
    },
    decode: ({ token }) => jwt.verify(token, env.JWT_SECRET) as any,
  },
  callbacks: {
    session: async ({ session, token }) => {
      (session.user as any).permsInt = token.permsInt;
      return session;
    },
  },
});
