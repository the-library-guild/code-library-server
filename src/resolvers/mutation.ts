// const borrowBook = async (_: any, { bookId }: any, { user }: any) => {
//   const { permsInt, _id } = user;

//   const perms = parsePerms(permsInt);
//   const isNormalBooking = perms.includes(BORROW_BOOKS);
//   const isAdminBooking = perms.includes(ADMIN_BOOKS);
//   const isUnAuthorized = !isNormalBooking && !isAdminBooking;
//   if (isUnAuthorized) return;
// };
// const returnBook = async (_: any, { bookId }: any, { user }: any) => {};

export default {};
