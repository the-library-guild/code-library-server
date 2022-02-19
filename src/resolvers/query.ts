import { ObjectId } from "mongoose";
import jwt from "jsonwebtoken";

import { Perm, hasPerms, DEFAULT_USER_PERMS_INT } from "code-library-perms";

import type { Jwt } from "../definitions/types";
import { JwtZod } from "../definitions/zod";
import { Item } from "../definitions/mongoose";
import env from "../env";

import { User } from "../definitions/mongoose";

const toDoc = (i: any) => i?._doc;

const mintJwt = async (
  _: any,
  { userData, secret }: { userData: Jwt; secret: string }
) => {
  if (secret !== env.JWT_SECRET) throw new Error("Invalid Secret");
  if (!JwtZod.safeParse(userData)) throw new Error("Invalid Userdata");

  const nowInSeconds = Math.floor(Date.now() / 1000);

  const exp =
    nowInSeconds + parseInt(env.MAX_SESSION_DURATION_SECONDS as string);

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
const getAllBooks = async (_: any, __: any, { user }: any) => {
  if (!hasPerms(user?.permsInt, Perm.VIEW_BOOKS))
    throw new Error("Missing Permission: VIEW_BOOKS");

  const data = await Item.find({ tags: { $in: ["media"] } });

  return data.map(toDoc);
};
const getBook = async (
  _: any,
  { bookId }: { bookId: ObjectId },
  { user }: any
) => {
  if (!hasPerms(user?.permsInt, Perm.VIEW_BOOKS))
    throw new Error("Missing Permission: VIEW_BOOKS");

  return toDoc(await Item.findOne({ tags: { $in: ["media"] }, _id: bookId }));
};
const getUser = async (
  _: any,
  { userId }: { userId: ObjectId },
  { user }: any
) => {
  if (!hasPerms(user?.permsInt, Perm.VIEW_USERS))
    throw new Error("Missing Permission: VIEW_USERS");

  return toDoc(await User.findOne({ _id: userId }));
};
const getSimilarBooks = async (
  _: any,
  { bookId }: { bookId: ObjectId },
  { user }: any
) => {
  if (!hasPerms(user?.permsInt, Perm.VIEW_BOOKS))
    throw new Error("Missing Permission: VIEW_BOOKS");

  const book = toDoc(
    await Item.findOne({
      tags: { $in: ["media"] },
      _id: bookId,
    })
  );
  if (!book) return [];

  const similarBooks = await Item.find({
    tags: { $in: ["media"] },
    "media.contentTags": { $in: book.media.contentTags },
  });
  return similarBooks.map(toDoc);
};
export default { mintJwt, getAllBooks, getUser, getBook, getSimilarBooks };

// async function getBorrowedItems(user: Person & Document) {
//   const res = await Item.find({
//     tags: { $in: ["borrowable"] },
//     parent: user._id,
//   });
//   return res;
// }
