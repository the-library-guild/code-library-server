import { Item } from "../definitions/mongoose";

const children = async (parent: any) => {
  return Item.find({ _id: { $in: parent.children } });
};
export default { children };
