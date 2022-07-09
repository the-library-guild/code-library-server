const Err = {
  Renting: {
    USER_CANT_RENT: "you are not able to rent this item",
    USER_CANT_RETURN: "you are not able to return this item",
    USER_CANT_PROCESS: "you are not able to process this item",

    CANT_BE_RENTED:
      "this item does not exist, is not rentable in general or is available right now",
    CANT_BE_RETURNED:
      "this item does not exist, is not rentable in general or is not rented right now",
    CANT_BE_PROCESSED:
      "this item does not exist, is not rentable in general or is not processing right now",
  },
  User: { CANT_FIND_USER: "failed to find user" },
};
export { Err };
