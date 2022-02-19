import { Perm, hasPerms } from "code-library-perms";

import { Item, User } from "../definitions/mongoose";

const rentBook = async (_: any, { bookId }: any, { user }: any) => {
  const { permsInt, _id } = user;

  const isAuthorized =
    (user.rentingLimit > user.children.length &&
      hasPerms(permsInt, Perm.RENT_BOOKS)) ||
    hasPerms(permsInt, Perm.RENT_UNLIMITED_BOOKS);

  if (isAuthorized) throw new Error("Missing Authorization");

  const book = await Item.updateOne(
    { _id: bookId },
    { $push: { "rentable.ownershipStateTags": "Rented" } }
  );
};
const returnBook = async (_: any, { bookId }: any, { user }: any) => {};

export default { rentBook, returnBook };

// const isAvailable = book.rentable.ownershipTags.includes("Available");
// const isBorrowedByUser = user.children.includes(book._id);

// const canBeRented = userCanRent && isAvailable;
// const canBeReturned = isBorrowedByUser;
