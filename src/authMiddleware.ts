import type { Request, Response } from "express";
import jwt from "jsonwebtoken";

import env from "./env";

interface Props {
  req: Request;
  res: Response;
}
function setHeaders({ req, res }: Props) {
  /*
  response headers should theoretically get handled with the corsOptions in index.ts,
  but for some reason the cors middleware only gets applied on preflight requests
  */
  const allowedDomains = [env.CLIENT_URL, "https://studio.apollographql.com"];

  if (allowedDomains.includes(req.headers.origin || ""))
    res.header("Access-Control-Allow-Origin", req.headers.origin);
}
const authMiddleware = async ({ req, res }: Props) => {
  setHeaders({ req, res });

  try {
    const token = req.cookies["next-auth.session-token"];
    const user: any = jwt.verify(token, env.JWT_SECRET);

    return { req, res, user };
  } catch (err) {
    return { req, res, user: null };
  }
};
export default authMiddleware;
