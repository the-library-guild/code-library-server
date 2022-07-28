import Item from "../models/item.model";

const itemController = {
  createMany: async (data: any[], parentId: string = null) => {
    const docs = await Item.create(data.map((i) => ({ ...i, parentId })));

    console.info(`[Server] creating ${data.length} items`);

    const docIds = docs.map((i) => i._id);

    if (parentId != null)
      await Item.updateOne(
        { _id: parentId },
        { $push: { childrenIds: { $each: docIds } } }
      );

    return docs.map((i) => i.toObject());
  },
  create: async (data: any) => {
    return await itemController.createMany([data]);
  },
  get: async (_id: string): Promise<typeof Item | null> => {
    const doc = await Item.findOne({ _id });

    return doc?.toObject() ?? null;
  },
  patch: async (_id: string, bookData: any) => {
    // TODO: make secure

    const doc = await Item.updateOne({ _id }, { $set: bookData });

    return doc;
  },
  getChildren: async (parent: any) => {
    const docs = await Item.find({ _id: { $in: parent.childrenIds } });

    return docs.map((i) => i.toObject());
  },
  getParent: async (child: any) => {
    if (child?.parentId == null) return null;

    const doc = await Item.findOne({ _id: child?.parentId });

    return doc?.toObject() ?? null;
  },
  delete: async (_id: string) => {
    const doc = await Item.deleteOne({ _id });

    return doc;
  },
  deleteAll: async () => {
    return await Item.deleteMany({});
  },
  getAllByTags: async (tags: string[] | string) => {
    if (!Array.isArray(tags)) tags = [tags];

    const docs = await Item.find({ tags: { $in: tags } });

    return docs.map((i) => i.toObject());
  },
  getOneByTags: async (tags: string[] | string) => {
    const items = await itemController.getAllByTags(tags);

    return items.length ? items[0] : items;
  },
};
export default itemController;
