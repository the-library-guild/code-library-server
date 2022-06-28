import jwt from "jsonwebtoken";

import type { Jwt } from "../../definitions/types";
import { JwtZod } from "../../definitions/zod";
import env from "../../env";

import { User } from "../../definitions/mongoose";
import { createNewUser } from "../../user.helpers";

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

  let user = await User.findOne({ email: userData.email });

  if (!user) {
    user = await createNewUser(userData);
  }
  return jwt.sign(
    {
      ...user,
      exp,
    },
    secret
  );
};
export default { mintJwt };
