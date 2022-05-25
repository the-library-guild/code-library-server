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

    try {
      let token: string;

      const tokenFromHeader = req.headers.authorization;

      if (tokenFromHeader) {
        token = tokenFromHeader.replace("Bearer ", "");
      }

      console.log({ token, cookies: req.cookies });

      const user: any = testUser || jwt.verify(token, env.JWT_SECRET);

      console.log("user inside middleware:", user);

      return { req, res, user };
    } catch (err) {
      console.log("caught error:", err);
      return { req, res, user: null };
    }
  };
export default authMiddleware;
