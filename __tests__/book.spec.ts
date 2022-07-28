import { connect, disconnect } from "mongoose";
import itemController from "../src/controllers/item.controller";
import rentableController from "../src/controllers/rentable.controller";
import userController from "../src/controllers/user.controller";
import { Err } from "../src/data/errors.settings";
import env from "../src/env";
import { migrateDb } from "../src/migrateDb";

beforeAll(async () => {
  await connect(env.MONGO_CONNECTION_STRING);
  await migrateDb();
});
afterAll(async () => await disconnect());

describe("books", () => {
  test("they exist", async () => {});
});
