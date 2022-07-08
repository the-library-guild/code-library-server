import crypto from "crypto";

import { model, Schema } from "mongoose";

const schemaOptions = {
  strict: false,
  timestamps: { createdAt: "createdDate", updatedAt: "updatedDate" },
};

const qrProps = {
  _id: { type: String, default: crypto.randomUUID },
  qrId: Number,
  mediaId: String,
};

const qrSchema = new Schema(qrProps, schemaOptions);
const Qr = model("Qr", qrSchema);

export default Qr;
export { qrProps, qrSchema };
