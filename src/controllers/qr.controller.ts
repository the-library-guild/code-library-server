import Qr from "../models/qr.model";
import itemController from "./item.controller";

const qrController = {
  create: async (qrId: string, mediaId: string) => {
    const alreadyTakenQrCode = await qrController.get(qrId);

    if (alreadyTakenQrCode) return null;

    const doc = await Qr.create({
      qrId,
      mediaId,
    });
    return doc?.toObject();
  },
  get: async (qrId: string) => {
    const doc = await Qr.findOne({
      qrId,
    });
    return doc?.toObject();
  },
  getLinkedItem: async (qrId: string) => {
    const qrDoc = await Qr.findOne({
      qrId,
    });
    if (!qrDoc) return null;

    return await itemController.get(qrDoc.mediaId);
  },
};
export default qrController;
