import { model, Schema } from "mongoose";

const schemaOptions = {
  strict: false,
  timestamps: { createdAt: "createdDate", updatedAt: "updatedDate" },
};
const itemSchema = new Schema({}, schemaOptions);
const userSchema = new Schema({}, schemaOptions);

const Item = model("Item", itemSchema);
const User = model("User", userSchema);

export { Item, User };
