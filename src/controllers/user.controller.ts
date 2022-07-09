import {
  DEFAULT_USER_PERMS_INT,
  LIBRARIAN_PERMS_INT,
} from "code-library-perms";
import rentableSettings from "../data/rentable.settings";

import env from "../env";
import User from "../models/user.model";

const resolvePerms = (email: string) => {
  const isAdmin = rentableSettings.LIBRARIAN_EMAILS.includes(email);

  return {
    permsInt: isAdmin ? LIBRARIAN_PERMS_INT : DEFAULT_USER_PERMS_INT,
    rentingLimit: isAdmin
      ? rentableSettings.LIBRARIAN_BOOKING_LIMIT
      : rentableSettings.USER_BOOKING_LIMIT,
  };
};
type UserInput_NEEDS_TO_BE_FIXED = any;

type NullableUser = typeof User | null;

const userController = {
  create: async (
    userData: UserInput_NEEDS_TO_BE_FIXED
  ): Promise<NullableUser> => {
    const user = {
      ...userData,
      ...resolvePerms(userData.email),
    };
    const doc = await User.create(user);

    console.info(
      `[Server][${user.email}] created user ${JSON.stringify(userData)}`
    );

    return doc?.toObject() ?? null;
  },

  get: async (email: string): Promise<NullableUser> => {
    const doc = await User.findOne({ email });

    return doc?.toObject() ?? null;
  },
  getAll: async (): Promise<NullableUser[]> => {
    const docs = await User.find();

    return docs.map((i) => i?.toObject());
  },
  getRenting: async (): Promise<NullableUser[]> => {
    const docs = await User.find({
      children: { $exists: true, $not: { $size: 0 } },
    });

    return docs.map((i) => i?.toObject());
  },

  patch: async (email: string, userData: UserInput_NEEDS_TO_BE_FIXED) => {
    const doc = await User.findOneAndUpdate({ email }, { userData });

    console.info(`[Server][${email}] patched user ${JSON.stringify(userData)}`);

    return { ok: doc != null, data: doc?.toObject() ?? null };
  },

  delete: async (email: string) => {
    const res = await User.deleteOne({ email });

    console.log(`[Server][${email}] deleted`);

    return { ok: res.acknowledged, data: null };
  },
  deleteAll: async () => {
    const res = await User.deleteMany();

    return { ok: res.acknowledged, data: null };
  },
};
export default userController;
