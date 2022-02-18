import { ObjectId } from "mongoose";
import jwt from "jsonwebtoken";

import { Perm, hasPerms, DEFAULT_USER_PERMS_INT } from "code-library-perms";

import type { Jwt } from "../definitions/types";
import { JwtZod } from "../definitions/zod";
import { Item } from "../definitions/mongoose";
import env from "../env";

const toDoc = (i: any) => i?._doc;

const mintJwt = async (
  _: any,
  { userData, secret }: { userData: Jwt; secret: string }
) => {
  if (secret !== env.JWT_SECRET) throw new Error("Invalid Secret");
  if (!JwtZod.safeParse(userData)) throw new Error("Invalid Userdata");

  const nowInSeconds = Math.floor(Date.now() / 1000);
  const expiryDate = nowInSeconds + env.MAX_SESSION_DURATION_SECONDS;

  return jwt.sign(
    {
      ...userData,
      permsInt: DEFAULT_USER_PERMS_INT,
      bookingLimit: env.DEFAULT_USER_BOOKING_LIMIT,
      exp: expiryDate,
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
  if (!hasPerms(user, Perm.VIEW_BOOKS))
    throw new Error("Missing Permission: VIEW_BOOKS");

  return toDoc(await Item.findOne({ tags: { $in: ["media"] }, _id: bookId }));
};
const getSimilarBooks = async (
  _: any,
  { bookId }: { bookId: ObjectId },
  { user }: any
) => {
  if (!hasPerms(user, Perm.VIEW_BOOKS))
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
export default { mintJwt, getAllBooks, getBook, getSimilarBooks };

// async function getBorrowedItems(user: Person & Document) {
//   const res = await Item.find({
//     tags: { $in: ["borrowable"] },
//     parent: user._id,
//   });
//   return res;
// }
