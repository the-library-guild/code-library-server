import { connect, disconnect } from "mongoose";
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

describe("user", () => {
  describe("creating", () => {
    it("creates admin", async () => {
      const user = await userController.create({
        email: "marcelo.teixeira@code.berlin",
      });
      const { _id, createdDate, updatedDate, __v, ...rest } = user as any;

      expect(rest).toEqual({
        email: "marcelo.teixeira@code.berlin",
        permsInt: rentableSettings.USER_PERMS_INT,
        rentingLimit: rentableSettings.USER_BOOKING_LIMIT,
        childrenIds: [],
        tags: [],
        desc: "",
      });
    });
    it("creates normal user", async () => {
      const user = await userController.create({
        email: "mark.soeder@code.berlin",
      });
      const { _id, createdDate, updatedDate, __v, ...rest } = user as any;

      expect(rest).toEqual({
        email: "mark.soeder@code.berlin",
        permsInt: rentableSettings.USER_PERMS_INT,
        rentingLimit: rentableSettings.USER_BOOKING_LIMIT,
        childrenIds: [],
        tags: [],
        desc: "",
      });
    });
    describe("queries", () => {
      describe("getUser", () => {
        test("it works", async () => {
          const user = await userController.get("mark.soeder@code.berlin");

          const { _id, createdDate, updatedDate, __v, ...rest } = user as any;

          expect(rest).toEqual({
            email: "mark.soeder@code.berlin",
            permsInt: rentableSettings.USER_PERMS_INT,
            rentingLimit: rentableSettings.USER_BOOKING_LIMIT,
            childrenIds: [],
            tags: [],
            desc: "",
          });
        });
        test("it returns null if user does not exist", async () => {
          const user = await userController.get("nonexistent.user@code.berlin");

          expect(user).toEqual(null);
        });
      });
      describe("getUsers", () => {
        test("it works", async () => {
          const users = await userController.getAll();

          // a user is created in migrateDb(), with marcelo and mark that makes 3 users
          expect(users?.length).toEqual(3);
        });
      });
      describe("getRenting", () => {
        test("it works", async () => {
          const users = await userController.getRenting();
          expect(users?.length).toEqual(0);
        });
      });
    });
    describe("patch", () => {
      it("works", async () => {
        const res = await userController.patch("mark.soeder@code.berlin", {
          name: "markus",
        });
        const { _id, createdDate, updatedDate, __v, ...rest } = res.data as any;

        expect(rest).toEqual({
          ok: true,
          data: {
            email: "mark.soeder@code.berlin",
            permsInt: rentableSettings.USER_PERMS_INT,
            rentingLimit: rentableSettings.USER_BOOKING_LIMIT,
            childrenIds: [],
            tags: [],
            desc: "",
            name: "markus",
          },
        });
      });
      it("fails on unknown users", async () => {
        const res = await userController.patch("nonexistent.user@code.berlin", {
          name: "markus",
        });
        const { _id, createdDate, updatedDate, __v, ...rest } = res.data as any;

        expect(rest).toEqual({
          ok: false,
          msg: Err.User.CANT_FIND_USER,
        });
      });
    });
  });
});
