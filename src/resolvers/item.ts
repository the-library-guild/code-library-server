import { Item } from "../definitions/mongoose";

const getChildren = async (parent: any) => {
  return await Item.find({ _id: { $in: parent.children } });
};
const getParent = async (parent: any) => {
  if (!parent?.parentId) return null;

  return await Item.findOne({ _id: parent.parentId });
};
export default { children: getChildren, parent: getParent };
