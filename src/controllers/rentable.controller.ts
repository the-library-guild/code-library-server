import { addDays, addHours } from "date-fns";
import { Err } from "../data/errors.settings";
import rentableSettings, { RentableState } from "../data/rentable.settings";
import env from "../env";
import Item from "../models/item.model";
import User from "../models/user.model";

type ControllerValue = { ok: true; data: any } | { ok: false; msg: string };

const replace = <T>(arr: T[], oldItem: T, newItem: T) =>
  arr.map((i) => (i === oldItem ? newItem : i));

const remove = <T>(arr: T[], oldItem: T) => arr.filter((i) => i !== oldItem);

const rentableController = {
  rent: async (email: string, rentableId: string): Promise<ControllerValue> => {
    const rentableDoc: any = await Item.findOne({
      _id: rentableId,
      tags: "rentable",
      "rentable.stateTags": RentableState.AVAILABLE,
    });

    const userDoc = await User.findOne({
      email,
      $expr: {
        $lt: [{ $size: "$childrenIds" }, "$rentingLimit"],
      },
    });

    if (rentableDoc == null)
      return {
        ok: false,
        msg: Err.Renting.CANT_BE_RENTED,
      };

    if (userDoc == null) return { ok: false, msg: Err.Renting.USER_CANT_RENT };

    rentableDoc.rentable.stateTags = replace(
      rentableDoc.rentable.stateTags,
      RentableState.AVAILABLE,
      RentableState.BORROWED
    );
    rentableDoc.rentable.currentOwner = userDoc._id;
    rentableDoc.rentable.rentedDate = Date.now();
    rentableDoc.rentable.dueDate = addHours(
      new Date(),
      rentableSettings.MAX_RENTING_DURATION_HOURS
    );

    userDoc.childrenIds = [...userDoc.childrenIds, rentableId];

    await rentableDoc.save();
    await userDoc.save();

    console.info(`[Server][${email}] rented "${rentableDoc.name}"`);

    return { ok: true, data: null };
  },
  return: async (
    email: string,
    rentableId: string
  ): Promise<ControllerValue> => {
    const rentableDoc: any = await Item.findOne({
      _id: rentableId,
      tags: "rentable",
      "rentable.stateTags": RentableState.BORROWED,
    });
    const userDoc = await User.findOne({ email });

    if (rentableDoc == null)
      return {
        ok: false,
        msg: Err.Renting.CANT_BE_RETURNED,
      };
    if (
      userDoc == null ||
      (!rentableSettings.ANYONE_CAN_RETURN_ANYONES_BOOKS &&
        !userDoc.childrenIds.includes(rentableId))
    )
      return { ok: false, msg: Err.Renting.USER_CANT_RETURN };

    rentableDoc.rentable.stateTags = replace(
      rentableDoc.rentable.stateTags,
      RentableState.BORROWED,
      RentableState.PROCESSING
    );
    rentableDoc.rentable.currentOwner = null;
    rentableDoc.rentable.rentedDate = null;
    rentableDoc.rentable.dueDate = null;

    userDoc.childrenIds = remove(userDoc.childrenIds, rentableId);

    await rentableDoc.save();
    await userDoc.save();

    console.info(`[Server][${email}] returned "${rentableDoc.name}"`);

    return { ok: true, data: null };
  },
  process: async (
    email: string,
    rentableId: string
  ): Promise<ControllerValue> => {
    const rentableDoc: any = await Item.findOne({
      _id: rentableId,
      tags: "rentable",
      "rentable.stateTags": RentableState.PROCESSING,
    });

    if (rentableDoc == null)
      return {
        ok: false,
        msg: Err.Renting.CANT_BE_PROCESSED,
      };

    rentableDoc.rentable.stateTags = replace(
      rentableDoc.rentable.stateTags,
      RentableState.PROCESSING,
      RentableState.AVAILABLE
    );
    console.info(`[Server][${email}] processed "${rentableDoc.name}"`);

    return { ok: true, data: null };
  },
};
export default rentableController;
