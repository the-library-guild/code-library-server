import { ObjectId } from "mongoose";

import { Perm, requirePerms } from "code-library-perms";

import { Item } from "../../definitions/mongoose";

const toDoc = (i: any) => i?._doc;

const getBook = async (
  _: any,
  { bookId }: { bookId: ObjectId },
  { user }: any
) => {
  requirePerms(user?.permsInt, Perm.VIEW_BOOKS);

  const res = await Item.findOne({ tags: { $in: ["media"] }, _id: bookId });

  return toDoc(res);
};
const getAllBooks = async (_: any, __: any, { user }: any) => {
  requirePerms(user?.permsInt, Perm.VIEW_BOOKS);

  const res = await Item.find({ tags: { $in: ["media"] } });

  return res.map(toDoc);
};
const getSimilarBooks = async (
  _: any,
  { bookId }: { bookId: ObjectId },
  { user }: any
) => {
  requirePerms(user?.permsInt, Perm.VIEW_BOOKS);

  const book = toDoc(
    await Item.findOne({
      tags: { $in: ["media"] },
      _id: bookId,
    })
  );
  if (!book) return [];

  const res = await Item.find({
    tags: { $in: ["media"] },
    "media.contentTags": { $in: book.media.contentTags },
  });
  return res.map(toDoc);
};
export default { getBook, getAllBooks, getSimilarBooks };
