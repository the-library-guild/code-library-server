import { Container } from "../definitions/types";
import itemController from "./item.controller";

const containerController = {
  createShelf: async () => {
    const shelf: Container = {
      name: "CODE Library Book Shelf",
      tags: ["shelf", "container", "physical"],
      childrenIds: [],
      desc: "Official CODE Library Book Shelf™ in Bikini Bottom, students can borrow books at https://library.code.berlin/",
      physical: {
        coords: null,
        geometry: null,
        texture: null,
      },
    };
    return await itemController.create(shelf);
  },
  createReturnBox: async () => {
    const returnBox: Container = {
      name: "CODE Library Return Box",
      tags: ["returnBox", "container", "physical"],
      childrenIds: [],
      desc: "Official CODE Library Return Box™ in Bikini Bottom, students can borrow books at https://library.code.berlin/",
      physical: {
        coords: null,
        geometry: null,
        texture: null,
      },
    };
    return await itemController.create(returnBox);
  },
  getShelf: () => itemController.getOneByTags("shelf"),
  getReturnBox: () => itemController.getOneByTags("returnBox"),
};
export default containerController;
