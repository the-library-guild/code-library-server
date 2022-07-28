import { RentableState } from "../data/rentable.settings";
import containerController from "./container.controller";
import itemController from "./item.controller";

const bookData = {
  desc: "",
  rentable: {
    stateTags: [RentableState.AVAILABLE],
  },
  tags: ["book", "rentable", "physical", "media"],
};

const bookController = {
  createMany: async (data: any[]) => {
    const shelf: any = await containerController.getShelf();

    if (shelf == null) throw new Error("failed to find shelf");

    const newData = data.map((i) => ({ ...i, ...bookData }));

    return await itemController.createMany(newData, shelf._id);
  },
  create: async (data: any) => bookController.createMany([data]),
};
export default bookController;
