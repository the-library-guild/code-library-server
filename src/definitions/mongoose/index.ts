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
const qrSache = {
  qrId: Number,
  mediaId: String,
};

const itemSchema = new Schema(itemSache, schemaOptions);
const userSchema = new Schema(userSache, schemaOptions);
const qrSchema = new Schema(qrSache);

const Item = model("Item", itemSchema);
const User = model("User", userSchema);
const Qr = model("Qr", qrSchema);

export { Item, User, Qr };
