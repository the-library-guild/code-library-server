import crypto from "crypto";

import { model, Schema } from "mongoose";
import { RentableState } from "../data/rentable.settings";

const schemaOptions = {
  strict: false,
  timestamps: { createdAt: "createdDate", updatedAt: "updatedDate" },
};

const itemProps = {
  _id: { type: String, default: crypto.randomUUID },
  childrenIds: { type: [String], default: [] },
  tags: { type: [String], default: [] },
  desc: { type: String, default: "" },

  rentable: {
    stateTags: { type: [String], default: [RentableState.AVAILABLE] },
  },
  media: {
    contentTags: [String],
    creators: [String],
    title: String,
  },
};
const itemSchema = new Schema(itemProps, schemaOptions);
const Item = model("Item", itemSchema);

export default Item;
export { itemProps, itemSchema };
