import { ApolloError } from "apollo-server-express";

import { Perm } from "code-library-perms";

import { Item, User, Qr } from "../../definitions/mongoose";
import { createNewUser } from "../../user.helpers";
import { handleErrs, requirePerms } from "../util";

const anyoneCanReturnBooks = true;

const remove = (entryToRemove: any) => (i: any) => i !== entryToRemove;

const linkQr = async (_: any, { qrId, mediaId }: any, { user }: any) =>
  handleErrs(async () => {
    requirePerms(user?.permsInt, Perm.RENT_BOOKS);

    const alreadyTakenQrCode = await Qr.findOne({
      qrId,
    });

    if (alreadyTakenQrCode) {
      throw new ApolloError(
        `QR code [ ${alreadyTakenQrCode.qrId}] already linked to book [${alreadyTakenQrCode.mediaId}]`,
        "Error"
      );
    }

    const qrDoc = await Qr.create({
      qrId,
      mediaId,
    });

    if (!qrDoc) throw new ApolloError("Failed to create item", "Error");

    return { __typename: "Success", id: qrId };
  });

const createBook = async (_: any, { bookData }: any, { user }: any) =>
  handleErrs(async () => {
    requirePerms(user?.permsInt, Perm.MANAGE_BOOKS);

    const shelf = await Item.findOne({ tags: { $in: ["shelf"] } });

    const bookDoc = await Item.create({
      ...bookData,
      parentId: shelf._id,
      rentable: {
        stateTags: ["Available"],
      },
      tags: ["book", "rentable", "media"],
      desc: "",
    });
    if (!bookDoc) throw new ApolloError("Failed to create item", "Error");

    await Item.updateOne(
      { _id: shelf._id },
      { children: [...shelf.children, bookDoc._id] }
    );

    return { __typename: "Success", id: bookDoc._id };
  });

const updateBook = async (_: any, { bookId, bookData }: any, { user }: any) =>
  handleErrs(async () => {
    requirePerms(user?.permsInt, Perm.MANAGE_BOOKS);

    const bookDoc = await Item.findOne({ _id: bookId });

    for (const [key, value] of Object.entries(bookData))
      bookDoc._doc[key] = value;

    await bookDoc.save();

    return { __typename: "Success", id: bookId };
  });

const deleteBook = async (_: any, { bookId }: any, { user }: any) =>
  handleErrs(async () => {
    requirePerms(user?.permsInt, Perm.MANAGE_BOOKS);

    const bookDoc = await Item.deleteOne({ _id: bookId });

    if (!bookDoc.deletedCount)
      throw new ApolloError("Failed to create item", "Error");

    return { __typename: "Success", id: bookId };
  });

const rentBook = async (_: any, { bookId }: any, { user }: any) =>
  handleErrs(async () => {
    requirePerms(user?.permsInt, Perm.RENT_BOOKS);

    const bookDoc = await Item.findOne({ _id: bookId });

    let userDoc = await User.findOne({ email: user.email });
    if (!userDoc) {
      userDoc = await createNewUser(user);
    }

    if (!bookDoc || !bookDoc.rentable.stateTags.includes("Available"))
      throw new ApolloError(
        "This book does not exist or is not available right now",
        "Error"
      );
    if (userDoc.childrenIds.length > user.rentingLimit)
      throw new ApolloError(
        "You have already reached your renting limit",
        "Error"
      );
    bookDoc.rentable = {
      stateTags: [
        ...bookDoc.rentable.stateTags.filter(remove("Available")),
        "Borrowed",
      ],
      currentOwner: userDoc._id,
      rentedDate: Date.now(),
      // dueDate: ""
    };
    userDoc.childrenIds = [...userDoc.childrenIds, bookId];

    await bookDoc.save();
    await userDoc.save();

    return { __typename: "Success", id: bookId };
  });

const returnBook = async (_: any, { bookId }: any, { user }: any) =>
  handleErrs(async () => {
    const bookDoc = await Item.findOne({ _id: bookId });
    const userDoc = await User.findOne({ email: user.email });

    if (!bookDoc || !userDoc._id)
      throw new ApolloError("Error understanding user");

    if (!bookDoc.rentable.stateTags.includes("Borrowed"))
      throw new ApolloError("This book is not borrowed right now");

    if (!anyoneCanReturnBooks && !userDoc.childrenIds.includes(bookId))
      throw new ApolloError(
        "You have to own this book in order to return it",
        "Error"
      );

    bookDoc.rentable = {
      stateTags: [
        ...bookDoc.rentable.stateTags.filter(remove("Borrowed")),
        "Processing",
      ],
    };
    userDoc.childrenIds = userDoc.childrenIds.filter(remove(bookId));

    await bookDoc.save();
    await userDoc.save();

    return { __typename: "Success", id: bookId };
  });

const processBook = async (_: any, { bookId }: any, { user }: any) =>
  handleErrs(async () => {
    requirePerms(user?.permsInt, Perm.MANAGE_BOOKS);

    const bookDoc = await Item.findOne({ _id: bookId });

    if (!bookDoc || !bookDoc.rentable.stateTags.includes("Processing"))
      throw new ApolloError("Failed to process book", "Error");

    bookDoc.rentable.stateTags = [
      ...bookDoc.rentable.stateTags.filter(remove("Processing")),
      "Available",
    ];
    await bookDoc.save();

    return { __typename: "Success", id: bookId };
  });

const updateBookStatus = async (_: any, { bookId }: any, { user }: any) =>
  handleErrs(async () => {
    requirePerms(user?.permsInt, Perm.MANAGE_BOOKS);

    const res = await Item.deleteOne({ _id: bookId });

    if (res.deletedCount === 0) throw new Error("Failed to Delete Item");

    return { __typename: "Success", id: bookId };
  });

export default {
  createBook,
  updateBook,
  deleteBook,
  rentBook,
  returnBook,
  processBook,
  updateBookStatus,
  linkQr,
};
