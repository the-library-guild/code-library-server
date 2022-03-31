import { model, Schema } from "mongoose";

const schemaOptions = {
  strict: false,
  timestamps: { createdAt: "createdDate", updatedAt: "updatedDate" },
};
const itemSache = {
  rentable: {
    stateTags: [String],
  },
  media: {
    contentTags: [String],
    creators: [String],
  },
};
const userSache = {
  childrenIds: [String],
};

const itemSchema = new Schema(itemSache, schemaOptions);
const userSchema = new Schema(userSache, schemaOptions);

const Item = model("Item", itemSchema);
const User = model("User", userSchema);

export { Item, User };
