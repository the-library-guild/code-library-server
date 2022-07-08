import { Perm, requirePerms } from "code-library-perms";

import itemController from "../../controllers/item.controller";
import qrController from "../../controllers/qr.controller";

const getBookByQr = async (_: any, { qrId }: any, { user }: any) => {
  requirePerms(user?.permsInt, Perm.VIEW_BOOKS);

  const doc = await qrController.getLinkedItem(qrId);

  return doc;
};

const getShelf = async (_: any, __: any, { user }: any) => {
  requirePerms(user?.permsInt, Perm.VIEW_BOOKS);

  const doc = await itemController.getShelf();

  return doc;
};
const getReturnBox = async (_: any, __: any, { user }: any) => {
  requirePerms(user?.permsInt, Perm.VIEW_BOOKS);

  const doc = await itemController.getReturnBox();

  return doc;
};
const getBook = async (
  _: any,
  { bookId }: { bookId: string },
  { user }: any
) => {
  requirePerms(user?.permsInt, Perm.VIEW_BOOKS);

  const doc = await itemController.get(bookId);

  return doc;
};
const getAllBooks = async (_: any, __: any, { user }: any) => {
  requirePerms(user?.permsInt, Perm.VIEW_BOOKS);

  const docs = await itemController.getBooks();

  return docs;
};
const getSimilarBooks = async (
  _: any,
  { bookId }: { bookId: string },
  { user }: any
) => {
  requirePerms(user?.permsInt, Perm.VIEW_BOOKS);

  const docs = await itemController.getSimilarMedia(bookId);

  return docs;
};
export default {
  getShelf,
  getReturnBox,
  getBook,
  getAllBooks,
  getSimilarBooks,
  getBookByQr,
};
