import type { Request, Response } from "express";
import jwt from "jsonwebtoken";

import env from "./env";

interface Props {
  req: Request;
  res: Response;
}
function setHeaders({ req, res }: Props) {
  /*
  response headers should theoretically get handled by the corsOptions in index.ts,
  but for some reason the cors middleware only gets applied on preflight requests
  */
  if (env.ALLOWED_ORIGINS.includes(req.headers.origin))
    res.header("Access-Control-Allow-Origin", req.headers.origin);
}
const authMiddleware =
  (testUser: any = null) =>
  async ({ req, res }: Props) => {
    setHeaders({ req, res });

    const cookieName = env.IS_PROD
      ? "__Secure-next-auth.session-token"
      : "next-auth.session-token";

    try {
      const token = req.cookies[cookieName];

      console.log("cookies", JSON.stringify(req.cookies, null, 2));
      console.log("token", token);

      const user: any = testUser || jwt.verify(token, env.JWT_SECRET);

      return { req, res, user };
    } catch (err) {
      return { req, res, user: null };
    }
  };
export default authMiddleware;
