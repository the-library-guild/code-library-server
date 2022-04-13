import { ObjectId } from "mongoose";

import { Perm, requirePerms } from "code-library-perms";

import { User } from "../../definitions/mongoose";
import { isLoggedInUser } from "../util";

const toDoc = (i: any) => i?._doc;

const getUser = async (_: any, { email }: { email: string }, { user }: any) => {
  isLoggedInUser(email, user?.email);

  const res = await User.findOne({ email });

  return toDoc(res);
};
const getAllUsers = async (_: any, __: any, { user }: any) => {
  // requirePerms(user?.permsInt, Perm.VIEW_USERS);

  const res = await User.find();

  return res.map(toDoc);
};
const getRentingUsers = async (_: any, __: any, { user }: any) => {
  requirePerms(user?.permsInt, Perm.VIEW_USERS);

  const res = await User.find({
    children: { $exists: true, $not: { $size: 0 } },
  });

  return res.map(toDoc);
};
// async function getBorrowedItems(user: Person & Document) {
//   const res = await Item.find({
//     tags: { $in: ["borrowable"] },
//     parent: user._id,
//   });
//   return res;
// }
export default { getUser, getAllUsers, getRentingUsers };
