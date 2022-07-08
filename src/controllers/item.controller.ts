import Item from "../models/item.model";

const getShelf = { tags: { $in: ["shelf"] } };
const getReturnBox = { tags: { $in: ["returnBox"] } };

const bookData = {
  desc: "",
  rentable: {
    stateTags: ["Available"],
  },
  tags: ["book", "rentable", "physical", "borrowable", "media"],
};

const itemController = {
  createMany: async (data: any[], parentId: string = null) => {
    const docs = await Item.create(data.map((i) => ({ ...i, parentId })));

    console.log("creating", parentId);
    console.log(docs.length);

    const docIds = docs.map((i) => i._id);

    if (parentId != null)
      await Item.updateOne(
        { _id: parentId },
        { $push: { childrenIds: { $each: docIds } } }
      );

    return docs.map((i) => i?.toObject());
  },
  create: async (data: any) => {
    return await itemController.createMany([data]);
  },
  createBooks: async (data: any[]) => {
    const shelf = await itemController.getShelf();

    const newData = data.map((i) => ({ ...i, ...bookData }));

    return await itemController.createMany(newData, shelf._id);
  },
  createBook: async (data: any) => {
    return await itemController.createBooks([data]);
  },
  getShelf: async () => {
    const doc = await Item.findOne(getShelf);

    return doc?.toObject();
  },
  getReturnBox: async () => {
    const doc = await Item.findOne(getReturnBox);

    return doc?.toObject();
  },
  get: async (_id: string) => {
    const doc = await Item.findOne({ _id });

    return doc?.toObject();
  },
  patch: async (_id: string, bookData: any) => {
    // TODO: make secure

    const doc = await Item.updateOne({ _id }, { $set: bookData });

    return doc;
  },
  delete: async (_id: string) => {
    const doc = await Item.deleteOne({ _id });

    return doc;
  },
  getChildren: async (parent: any) => {
    const docs = await Item.find({ _id: { $in: parent.childrenIds } });

    return docs.map((i) => i?.toObject());
  },
  getParent: async (child: any) => {
    if (child?.parentId == null) return null;

    const doc = await Item.findOne({ _id: child?.parentId });

    return doc?.toObject();
  },
  getBooks: async () => {
    const docs = await Item.find({ tags: { $in: ["media"] } });

    return docs.map((i) => i?.toObject());
  },
  getSimilarMedia: async (id: string) => {
    const media = await itemController.get(id);

    if (!media) return [];

    const doc = await Item.find({
      tags: { $in: ["media"] },
      "media.contentTags": { $in: media.media.contentTags },
    });
    return doc.map((i) => i?.toObject());
  },
  deleteAll: async () => {
    return await Item.deleteMany({});
  },
};
export default itemController;

// tags: { $in: ["media"] }
