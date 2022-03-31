import { ObjectId } from "mongoose";

import { Perm, requirePerms } from "code-library-perms";

import { User } from "../../definitions/mongoose";

const toDoc = (i: any) => i?._doc;

const getUser = async (
  _: any,
  { userId }: { userId: ObjectId },
  { user }: any
) => {
  requirePerms(user?.permsInt, Perm.VIEW_USERS);

  const res = await User.findOne({ _id: userId });

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
