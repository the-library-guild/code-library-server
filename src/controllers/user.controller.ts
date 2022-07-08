import {
  DEFAULT_USER_PERMS_INT,
  LIBRARIAN_PERMS_INT,
} from "code-library-perms";

import env from "../env";
import Item from "../models/item.model";
import User from "../models/user.model";
import itemController from "./item.controller";
import { RentableState } from "../data/rentable.settings";

type UserInfo = {
  name: string;
  email: string;
};

const resolveUserProps = (email: string) => {
  const isAdmin = env.ADMIN_EMAILS.includes(email);

  return {
    permsInt: isAdmin ? LIBRARIAN_PERMS_INT : DEFAULT_USER_PERMS_INT,
    rentingLimit: isAdmin ? Infinity : env.DEFAULT_USER_BOOKING_LIMIT,
    childrenIds: [],
  };
};

const userController = {
  get: async (email: string) => {
    const doc = await User.findOne({ email });

    return doc?.toObject();
  },
  getAll: async () => {
    const docs = await User.find();

    return docs.map((i) => i?.toObject());
  },
  getRenting: async () => {
    const docs = await User.find({
      children: { $exists: true, $not: { $size: 0 } },
    });

    return docs.map((i) => i?.toObject());
  },
  create: async (userData: UserInfo) => {
    const user = {
      name: userData.name,
      email: userData.email,
      ...resolveUserProps(userData.email),
    };
    console.info(
      `[Server][MongoDb] Creating User: ${JSON.stringify(userData)}`
    );
    return await User.create(user);
  },
  deleteAll: async () => {
    return await User.deleteMany({});
  },
};
export default userController;
