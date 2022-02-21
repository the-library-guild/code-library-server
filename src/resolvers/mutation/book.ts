import { Perm, requirePerms } from "code-library-perms";

import { Item, User } from "../../definitions/mongoose";

const remove = (entryToRemove: any) => (i: any) => i !== entryToRemove;

const createBook = async (_: any, { bookData }: any, { user }: any) => {
  requirePerms(user?.permsInt, Perm.MANAGE_BOOKS);

  const res = await Item.create(bookData);

  return { ok: true, data: res._id != null };
};
const updateBook = async (_: any, { bookId, bookData }: any, { user }: any) => {
  requirePerms(user?.permsInt, Perm.MANAGE_BOOKS);

  const doc = await Item.findOne({ _id: bookId });

  for (const [key, value] of Object.entries(bookData)) doc[key] = value;

  const res = await doc.save();

  return { ok: res._id != null };
};
const deleteBook = async (_: any, { bookId }: any, { user }: any) => {
  requirePerms(user?.permsInt, Perm.MANAGE_BOOKS);

  const res = await Item.deleteOne({ _id: bookId });

  return { ok: res.deletedCount > 0 };
};
const rentBook = async (_: any, { bookId }: any, { user }: any) => {
  requirePerms(user?.permsInt, Perm.RENT_BOOKS);

  const doc = await Item.findOne({
    _id: bookId,
    $in: { "rentable.ownershipStateTags": "Available" },
  });
  doc.rentable.ownershipStateTags = doc.rentable.ownershipStateTags.filter(
    remove("Available")
  );
  await doc.save();

  return { ok: true };
};
const returnBook = async (_: any, { bookId }: any, { user }: any) => {
  const userDoc = await User.findOne({ _id: user.id });

  if (!userDoc.children.includes(bookId))
    throw new Error("You do not currently own this book");

  const res = await Item.deleteOne({ _id: bookId });

  return { ok: res.deletedCount > 0 };
};
const processBook = async (_: any, { bookId }: any, { user }: any) => {
  requirePerms(user?.permsInt, Perm.MANAGE_BOOKS);

  const res = await Item.deleteOne({ _id: bookId });

  return { ok: res.deletedCount > 0 };
};
const updateBookStatus = async (_: any, { bookId }: any, { user }: any) => {
  requirePerms(user?.permsInt, Perm.MANAGE_BOOKS);

  const res = await Item.deleteOne({ _id: bookId });

  return { ok: res.deletedCount > 0 };
};
export default {
  createBook,
  updateBook,
  deleteBook,
  rentBook,
  returnBook,
  processBook,
  updateBookStatus,
};
