import {
  DEFAULT_USER_PERMS_INT,
  LIBRARIAN_PERMS_INT,
} from "code-library-perms";

import env from "./env";

import { User } from "./definitions/mongoose";

export type UserInfo = {
  name: string;
  email: string;
};

// TODO: get it from a configuration variable
const ADMINS = ["marcelo.teixeira@code.berlin", "linus.bolls@code.berlin"];

const resolveDefaultPermissions = (email: string) => {
  if (ADMINS.includes(email)) {
    // return LIBRARIAN_PERMS_INT;
    return DEFAULT_USER_PERMS_INT;
  }

  return DEFAULT_USER_PERMS_INT;
};

export const createNewUser = async (userData: UserInfo) => {
  const user = {
    name: userData.name,
    email: userData.email,
    childrenIds: [],
    permsInt: resolveDefaultPermissions(userData.email),
    bookingLimit: env.DEFAULT_USER_BOOKING_LIMIT,
  };

  console.info(`[Server][MongoDb] Creating User: ${JSON.stringify(userData)}`);

  return await User.create(user);
};
