import { gql } from "apollo-server";

export default gql`
  type Success {
    id: ID!
  }
  type Error implements BaseError {
    msg: String!
  }
  type MissingPermissionsError implements BaseError {
    msg: String!
    requiredPermsInt: Int!
  }
  union Res = Success | Error
  union PermProtectedRes = Success | MissingPermissionsError | Error

  type Mutation {
    "[MANAGE_BOOKS]"
    createBook(bookData: BookData): PermProtectedRes

    creaetQr(qrId: Int!, bookId: ID!): Res
    "[MANAGE_BOOKS]"
    updateBook(bookId: ID!, bookData: BookData): PermProtectedRes
    "[MANAGE_BOOKS]"
    deleteBook(bookId: ID!): PermProtectedRes

    "[RENT_BOOKS]"
    rentBook(bookId: ID!): PermProtectedRes
    "[be current owner of book]"
    returnBook(bookId: ID!): PermProtectedRes
    "[PROCESS_BOOKS]"
    processBook(bookId: ID!): PermProtectedRes
    "[MANAGE_BOOKS]"
    updateBookStatus(bookId: ID!, newStatus: [String!]!): PermProtectedRes

    "[MANAGE_USERS] how to handle which permissions to get?"
    createUser(userData: UserData): Res
    "[MANAGE_USERS]"
    updateUser(userId: ID!, userData: UserData): Res
    "[MANAGE_USERS] including changing renting limit"
    deleteUser(bookId: ID!): Res

    "[CHANGE_PERMISSIONS]"
    changeUserPermissions(userId: ID!, newPermsInt: Int): Res
  }
`;
