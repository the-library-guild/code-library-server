import { Schema } from "mongoose";
import { z } from "zod";

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
  DocumentZod,
  ItemZod,
  MediaZod,
  RentableZod,
  PhysicalZod,
  UserZod,
  JwtZod,
};
