import { ObjectId, Document } from "mongoose";
import axios from "axios";

import { Item, User } from "./definitions/mongoose";
import { Book, Container } from "./definitions/types";
import { papaParse } from "./papaParse";
import item from "./resolvers/item";
import { gql } from "apollo-server";

function toBookObj(parentId: ObjectId | undefined) {
  return function (props: string[]) {
    const book: Book = {
      tags: ["book", "borrowable", "physical", "media"],
      parentId,
      childrenIds: [],
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
  };
}
const admin = {
  tags: [],
  name: "Linus Bolls",
  childrenIds: [],
  email: "linus.bolls@code.berlin",
  permsInt: 127,
  rentingLimit: 10,
};
const shelf: Container = {
  name: "CODE Library Book Shelf",
  tags: ["shelf", "container", "physical"],
  childrenIds: [],
  desc: "Official CODE Library Shelf™ in Space, students can borrow books under https://placeholder.site/",
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
  desc: "Official CODE Library Return Box™ in Space, students can borrow books under https://placeholder.site/",
  physical: {
    coords: null,
    geometry: null,
    texture: null,
  },
};
async function migrateDb() {
  await Item.deleteMany({});
  await User.deleteMany({});

  const [shelfDoc, returnBoxDoc] = await Item.create([shelf, returnBox]);
  const shelfId = shelfDoc._id;

  const URL =
    "https://docs.google.com/spreadsheets/d/e/2PACX-1vTJs4FKl_eqyLBaWA3WqiP88BbaVNl2rGl-wezGg_ARdinZfkeGG0ZuG-u0dK0vj5xsGJuQ_cQS_eXT/pub?gid=0&single=true&output=csv";

  const res = await axios.get(URL);
  const { data: csvString } = res;
  const { errors, data } = (await papaParse(csvString)) as any;

  console.log(data);

  const books = data.slice(1, 2).map(toBookObj(shelfId));

  const bookDocs = await Item.create(books);
  const bookIds = bookDocs.map((i: Document) => i._id);

  await User.create(admin);
  await Item.updateOne({ _id: shelfId }, { children: bookIds });
}
export { migrateDb };
