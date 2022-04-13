import { Item } from "../definitions/mongoose";

const toDoc = (i: any) => i?._doc;

const children = async (parent: any) => {
  return (await Item.find({ "rentable.currentOwner": parent._id })).map(toDoc);
};

export default { children };
