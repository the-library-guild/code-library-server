import { Schema } from "mongoose";
import { z } from "zod";

// required_error: "Age is required",
// invalid_type_error: "Age must be a number",

const EnvZod = z.object({
  IS_PROD: z.boolean(),
  PORT: z.number().positive(),
  ALLOWED_ORIGINS: z.array(z.string().url().nonempty()),
  MONGO_CONNECTION_STRING: z.string().url().nonempty(),
  JWT_SECRET: z.string().min(5),
  GOOGLE_ID: z.string().nonempty(),
  GOOGLE_SECRET: z.string().nonempty(),
  MAX_SESSION_DURATION_SECONDS: z.number().positive(),
  DEFAULT_USER_BOOKING_LIMIT: z.number().positive(),
});
const DocumentZod = z.object({
  _id: z.instanceof(Schema.Types.ObjectId),
});
const ItemZod = z.object({
  parent: z.instanceof(Schema.Types.ObjectId).optional(),
  children: z.array(z.instanceof(Schema.Types.ObjectId)),
  tags: z.array(z.string()),
  name: z.string().nonempty(),
  desc: z.string().optional(),
});
const MediaZod = z.object({
  contentTags: z.array(z.string()),
  contentDesc: z.string().optional(),
  subTitle: z.string().optional(),
  creators: z.array(z.string()),
  publisher: z.string().optional(),
  language: z.string().optional(),
  publishedDate: z.date().optional(),
});
const RentableZod = z.object({
  ownershipStateTags: z.array(z.string()),
  borrowedDate: z.date().optional(),
  dueDate: z.date().optional(),
});
const PhysicalZod = z.object({
  coords: z.any(),
  geometry: z.any(),
  texture: z.any(),
});
const UserZod = z.object({
  email: z.string().email(),
  name: z.string().optional(),
  img: z.string().optional(),
  permsInt: z.number(),
});
const JwtZod = z.object({
  email: z.string().email(),
  name: z.string().optional(),
  picture: z.string().optional(),
});
export {
  EnvZod,
  DocumentZod,
  ItemZod,
  MediaZod,
  RentableZod,
  PhysicalZod,
  UserZod,
  JwtZod,
};
