import Item from "../models/item.model";
import Qr from "../models/qr.model";
import itemController from "./item.controller";

const qrController = {
  create: async (
    qrId: string,
    mediaId: string
  ): Promise<typeof Item | null> => {
    const alreadyTakenQrCode = await qrController.get(qrId);

    if (alreadyTakenQrCode) return null;

    const doc = await Qr.create({
      qrId,
      mediaId,
    });
    return doc?.toObject() ?? null;
  },
  get: async (qrId: string): Promise<typeof Item | null> => {
    const doc = await Qr.findOne({
      qrId,
    });
    return doc?.toObject() ?? null;
  },
  getLinkedItem: async (qrId: string): Promise<typeof Item | null> => {
    const qrDoc = await Qr.findOne({
      qrId,
    });
    if (!qrDoc) return null;

    return await itemController.get(qrDoc.mediaId);
  },
};
export default qrController;
