import Item from "../models/item.model";
import itemController from "./item.controller";

const mediaController = {
  getAll: () => itemController.getAllByTags("media"),

  getSimilar: async (mediaId: string) => {
    const doc = await itemController.get(mediaId);

    if (doc == null) return [];

    const {
      media: { contentTags },
    } = doc as any;

    const docs = await Item.find({
      tags: "media",
      "media.contentTags": { $in: contentTags },
    });
    return docs.map((i) => i.toObject());
  },
};
export default mediaController;
