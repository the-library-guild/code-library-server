import axios from "axios";

import { Book, Container } from "./definitions/types";
import { papaParse } from "./services/papaParse";
import userController from "./controllers/user.controller";
import itemController from "./controllers/item.controller";

function toBookObj(props: string[]) {
  const book: Book = {
    name: props[3],
    desc: props[7],

    media: {
      contentTags: [props[0], props[1], props[2], props[8], props[11]],
      contentDesc: props[12],
      tagline: props[4],
      creators: [props[5]],
      publisher: props[6],
      language: props[10],
      publishedDate: props[9] === "" ? undefined : new Date(props[9]),
    },
    rentable: {
      stateTags: [props[13]],
    },
  };
  return book;
}
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
async function migrateDb() {
  await itemController.deleteAll();
  await userController.deleteAll();

  await userController.create({
    email: "linus.bolls@code.berlin",
    name: "Linus Bolls",
  });

  await itemController.createMany([shelf, returnBox]);

  const URL =
    "https://docs.google.com/spreadsheets/d/e/2PACX-1vTJs4FKl_eqyLBaWA3WqiP88BbaVNl2rGl-wezGg_ARdinZfkeGG0ZuG-u0dK0vj5xsGJuQ_cQS_eXT/pub?gid=0&single=true&output=csv";

  const res = await axios.get(URL);

  const { data } = await papaParse(res.data);

  const books = data.slice(1).map(toBookObj);

  await itemController.createBooks(books);
}
export { migrateDb };
