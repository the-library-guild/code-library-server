import { connect, disconnect } from "mongoose";
import mediaController from "../src/controllers/media.controller";
import rentableController from "../src/controllers/rentable.controller";
import userController from "../src/controllers/user.controller";
import { Err } from "../src/data/errors.settings";
import rentableSettings from "../src/data/rentable.settings";
import env from "../src/env";
import { migrateDb } from "../src/migrateDb";

beforeAll(async () => {
  await connect(env.MONGO_CONNECTION_STRING);
  await migrateDb();
});
afterAll(async () => await disconnect());

describe("lifecycle", () => {
  let bookIds: string[];

  test("get books", async () => {
    const books = await mediaController.getAll();

    bookIds = books.map((i) => i._id);
  });

  describe("rentBook", () => {
    test("it works", async () => {
      const res = await rentableController.rent(
        "linus.bolls@code.berlin",
        bookIds[0]
      );
      expect(res).toEqual({ ok: true, data: null });
    });
    test("it fails to rent a book twice", async () => {
      const res1 = await rentableController.rent(
        "linus.bolls@code.berlin",
        bookIds[0]
      );
      const res2 = await rentableController.rent(
        "mark.soeder@code.berlin",
        bookIds[0]
      );

      expect(res1).toEqual({
        ok: false,
        msg: Err.Renting.CANT_BE_RENTED,
      });
      expect(res2).toEqual({
        ok: false,
        msg: Err.Renting.CANT_BE_RENTED,
      });
    });
  });
  describe("returnBook", () => {
    test("it works", async () => {
      const { ok } = await rentableController.return(
        "linus.bolls@code.berlin",
        bookIds[0]
      );
      expect(ok).toEqual(true);
    });
  });
  describe("processBook", () => {
    test("dings", async () => {
      const { ok } = await rentableController.process(
        "linus.bolls@code.berlin",
        bookIds[0]
      );
      expect(ok).toEqual(true);
    });
  });
  it("enforces renting limit", async () => {
    await userController.create({
      email: "mark.soeder@code.berlin",
      name: "Mark Söder",
    });

    let results = [];

    for (const i of bookIds) {
      const res = await rentableController.rent("mark.soeder@code.berlin", i);

      results.push(res);
    }
    const successes = results.filter((i) => i.ok);

    expect(successes.length).toEqual(rentableSettings.USER_BOOKING_LIMIT);
  });
});
