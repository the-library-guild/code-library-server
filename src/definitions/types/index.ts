import { z } from "zod";

import {
  DocumentZod,
  ItemZod,
  MediaZod,
  RentableZod,
  PhysicalZod,
  UserZod,
  JwtZod,
} from "../zod";

type IDocument = z.infer<typeof DocumentZod>;
type IItem = z.infer<typeof ItemZod>;
type IMedia = z.infer<typeof MediaZod>;
type IRentable = z.infer<typeof RentableZod>;
type IPhysical = z.infer<typeof PhysicalZod>;

type User = z.infer<typeof UserZod>;
type Jwt = z.infer<typeof JwtZod>;

type Book = IItem & { media: IMedia; rentable: IRentable };
type Container = IItem & { physical: IPhysical };

export type { IDocument, IItem, IMedia, IRentable, IPhysical, User, Jwt };
export type { Book, Container };
