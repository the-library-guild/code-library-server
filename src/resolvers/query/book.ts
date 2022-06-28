import { ObjectId } from "mongoose";

import { Perm, requirePerms } from "code-library-perms";

import { Item, Qr } from "../../definitions/mongoose";

const toDoc = (i: any) => i?._doc;

const getBookByQr = async (_: any, { qrId }: any, { user }: any) => {
  requirePerms(user?.permsInt, Perm.VIEW_BOOKS);

  const qrDoc = await Qr.findOne({
    qrId,
  });
  if (!qrDoc) return null;

  const bookDoc = await Item.findOne({ _id: qrDoc.mediaId });

  return bookDoc;
};

const getShelf = async (_: any, __: any, { user }: any) => {
  requirePerms(user?.permsInt, Perm.VIEW_BOOKS);

  const res = await Item.findOne({ tags: { $in: ["shelf"] } });

  return toDoc(res);
};
const getReturnBox = async (_: any, __: any, { user }: any) => {
  requirePerms(user?.permsInt, Perm.VIEW_BOOKS);

  const res = await Item.findOne({ tags: { $in: ["returnBox"] } });

  return toDoc(res);
};
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
export default {
  getShelf,
  getReturnBox,
  getBook,
  getAllBooks,
  getSimilarBooks,
  getBookByQr,
};
