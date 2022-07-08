import { Perm, requirePerms } from "code-library-perms";

import userController from "../../controllers/user.controller";
import { isLoggedInUser } from "../util";

const getUser = async (_: any, { email }: { email: string }, { user }: any) => {
  isLoggedInUser(email, user?.email);

  return await userController.get(email);
};
const getAllUsers = async (_: any, __: any, { user }: any) => {
  // requirePerms(user?.permsInt, Perm.VIEW_USERS);

  return await userController.getAll();
};
const getRentingUsers = async (_: any, __: any, { user }: any) => {
  requirePerms(user?.permsInt, Perm.VIEW_USERS);

  return await userController.getRenting();
};
// async function getBorrowedItems(user: Person & Document) {
//   const res = await Item.find({
//     tags: { $in: ["borrowable"] },
//     parent: user._id,
//   });
//   return res;
// }
export default { getUser, getAllUsers, getRentingUsers };
