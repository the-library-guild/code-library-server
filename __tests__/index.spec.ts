describe("dings", () => {
  it("dings", () => {});
});

// import { connect, disconnect } from "mongoose";

// import { migrateDb } from "../src/migrateDb";
// import env from "../src/env";

// import itemController from "../src/controllers/item.controller";
// import userController from "../src/controllers/user.controller";
// import { DEFAULT_USER_PERMS_INT } from "code-library-perms";

// beforeAll(async () => {
//   await connect(env.MONGO_CONNECTION_STRING);
//   await migrateDb();
// });
// afterAll(async () => await disconnect());

// describe("app", () => {
//   test("MongoDb Connects", async () => {});
//   describe("itemController", () => {
//     describe("queries", () => {
//       describe("getShelf", () => {
//         let shelf: any;

//         test("it is not rentable", async () => {
//           shelf = await itemController.getShelf();

//           expect(shelf?.rentable).toEqual({});
//         });
//         test("it is not media", () => {
//           expect(shelf?.media).toEqual({});
//         });
//         test("it contains books", () => {
//           expect(shelf?.childrenIds?.length).toBeGreaterThan(0);
//         });
//       });
//       describe("getReturnBox", () => {
//         let returnBox: any;

//         test("it is not rentable", async () => {
//           returnBox = await itemController.getReturnBox();

//           expect(returnBox?.rentable).toEqual({});
//         });
//         test("it is not media", () => {
//           expect(returnBox?.media).toEqual({});
//         });
//         test("it is empty", () => {
//           expect(returnBox?.childrenIds?.length).toEqual(0);
//         });
//       });
//     });
//   });
// });
// 0;
// const user = {
//   name: "Linus Bolls",
//   email: "linus.bolls@code.berlin",
//   permsInt: 127,
//   rentingLimit: 10,
// };
// describe("App", () => {
//   test("MongoDb Connects", async () => {
//     await connect(env.MONGO_CONNECTION_STRING);
//     await migrateDb();
//   });
//   describe("GraphQl Resolvers", () => {
//     describe("Queries", () => {
//       describe("getShelf", () => {
//         test("it contains books", async () => {
//           const res = await query.getShelf(null, null, { user });

//           expect(res.children.length).toBeGreaterThan(0);
//         });
//       });
//     });
//     describe("Mutations", () => {
//       let createdBookId: string;
//       describe("createBook", () => {
//         test("it works", async () => {
//           const res = await mutation.createBook(
//             null,
//             {
//               bookData: {
//                 tags: ["book"],
//                 name: "The kickin' Adventures of Tomas Amüsant",
//                 media: {
//                   contentTags: ["tomas amüsant", "adventure", "life lessons"],
//                   creators: ["tomas amüsant", "ghost rider"],
//                   publisher: "penguin books",
//                   language: "english",
//                 },
//               },
//             },
//             { user }
//           );
//           createdBookId = res.id;
//           expect(res.__typename).toEqual("Success");
//         });
//       });
//       describe("rentBook", () => {
//         test("it works", async () => {
//           const res = await mutation.rentBook(
//             null,
//             { bookId: createdBookId },
//             { user }
//           );
//           expect(res.__typename).toEqual("Success");
//         });
//       });
//       describe("returnBook", () => {
//         test("it works", async () => {
//           const res = await mutation.returnBook(
//             null,
//             { bookId: createdBookId },
//             { user }
//           );
//           expect(res.__typename).toEqual("Success");
//         });
//       });
//       describe("processBook", () => {
//         test("it works", async () => {
//           const res = await mutation.processBook(
//             null,
//             { bookId: createdBookId },
//             { user }
//           );
//           expect(res.__typename).toEqual("Success");
//         });
//       });
//     });
//   });
//   test("MongoDb Disconnects", async () => {
//     await disconnect();
//   });
// });
