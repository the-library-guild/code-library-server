import { Item } from "../definitions/mongoose";

const toDoc = (i: any) => i?._doc;

const children = async (parent: any) => {
  return (await Item.find({ _id: { $in: parent.children } })).map(toDoc);
};
export default { children };
