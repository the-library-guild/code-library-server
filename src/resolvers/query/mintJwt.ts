import jwt from "jsonwebtoken";
import userController from "../../controllers/user.controller";

import { JwtZod } from "../../definitions/zod";
import env from "../../env";

type UserInfo = {
  name: string;
  email: string;
};

const mintJwt = async (
  _: any,
  { userData, secret }: { userData: UserInfo; secret: string }
) => {
  if (secret !== env.JWT_SECRET) throw new Error("Invalid Secret");
  if (!JwtZod.safeParse(userData)) throw new Error("Invalid Userdata");

  const nowInSeconds = Math.floor(Date.now() / 1000);

  const exp = nowInSeconds + env.MAX_SESSION_DURATION_SECONDS;

  const user =
    (await userController.get(userData.email)) ??
    (await userController.create(userData));

  return jwt.sign(
    {
      ...user,
      exp,
    },
    secret
  );
};
export default { mintJwt };
