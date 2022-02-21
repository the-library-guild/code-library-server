import jwt from "jsonwebtoken";

import { DEFAULT_USER_PERMS_INT } from "code-library-perms";

import type { Jwt } from "../../definitions/types";
import { JwtZod } from "../../definitions/zod";
import env from "../../env";

import { User } from "../../definitions/mongoose";

const mintJwt = async (
  _: any,
  { userData, secret }: { userData: Jwt; secret: string }
) => {
  if (secret !== env.JWT_SECRET) throw new Error("Invalid Secret");
  if (!JwtZod.safeParse(userData)) throw new Error("Invalid Userdata");

  const nowInSeconds = Math.floor(Date.now() / 1000);

  const exp = nowInSeconds + env.MAX_SESSION_DURATION_SECONDS;

  const user = await User.findOne({ email: userData.email });

  const permsInt = user?.permsInt || DEFAULT_USER_PERMS_INT;
  const bookingLimit = user?.bookingLimit || env.DEFAULT_USER_BOOKING_LIMIT;

  return jwt.sign(
    {
      ...userData,
      permsInt,
      bookingLimit,
      exp,
    },
    secret
  );
};
export default { mintJwt };
