import crypto from "crypto";

import { model, Schema } from "mongoose";

const schemaOptions = {
  strict: false,
  timestamps: { createdAt: "createdDate", updatedAt: "updatedDate" },
};

const userProps = {
  _id: { type: String, default: crypto.randomUUID },
  childrenIds: { type: [String], default: [] },
  tags: { type: [String], default: [] },
  desc: { type: String, default: "" },

  name: String,
  email: { type: String, required: true },
};
const userSchema = new Schema(userProps, schemaOptions);

const User = model("User", userSchema);

export default User;
export { userProps, userSchema };
