import { Err } from "../data/errors.settings";
import rentableSettings from "../data/rentable.settings";

import User from "../models/user.model";

const resolvePerms = (email: string) => {
  const isAdmin = rentableSettings.LIBRARIAN_EMAILS.includes(email);

  return {
    permsInt: isAdmin
      ? rentableSettings.LIBRARIAN_PERMS_INT
      : rentableSettings.USER_PERMS_INT,

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

    return docs.map((i) => i.toObject());
  },
  getRenting: async (): Promise<NullableUser[]> => {
    const docs = await User.find({
      children: { $exists: true, $not: { $size: 0 } },
    });

    return docs.map((i) => i.toObject());
  },

  patch: async (email: string, userData: UserInput_NEEDS_TO_BE_FIXED) => {
    const doc = await User.findOneAndUpdate(
      { email },
      { ...userData },
      { new: true }
    );

    console.info(`[Server][${email}] patched user ${JSON.stringify(userData)}`);

    if (doc == null) return { ok: false, msg: Err.User.CANT_FIND_USER };

    return { ok: true, data: doc?.toObject() ?? null };
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
