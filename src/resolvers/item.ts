import { Item } from "../definitions/mongoose";

const toDoc = (i: any) => i?._doc;

const getChildren = async (parent: any) => {
  const res = await Item.find({ _id: { $in: parent.children } });

  return res.map(toDoc);
};
const getParent = async (parent: any) => {
  if (!parent?.parentId) return null;

  return toDoc(await Item.findOne({ _id: parent.parentId }));
};
export default { children: getChildren, parent: getParent };
