import itemController from "../controllers/item.controller";

const children = async (parent: any) =>
  await itemController.getChildren(parent);

const parent = async (child: any) => await itemController.getParent(child);

export default { children, parent };
