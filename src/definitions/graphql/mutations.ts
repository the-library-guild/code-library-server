import { gql } from "apollo-server";

export default gql`
  type Mutation {
    "[MANAGE_BOOKS]"
    createBook(bookData: BookData): Response!
    "[MANAGE_BOOKS]"
    updateBook(bookId: ID!, bookData: BookData): Response!
    "[MANAGE_BOOKS]"
    deleteBook(bookId: ID!): Response!

    "[RENT_BOOKS]"
    rentBook(bookId: ID!): Response!
    "[be current owner of book]"
    returnBook(bookId: ID!): Response!
    "[PROCESS_BOOKS]"
    processBook(bookId: ID!): Response!
    "[MANAGE_BOOKS]"
    updateBookStatus(bookId: ID!, newStatus: [String!]!): Response!

    "[MANAGE_USERS] how to handle which permissions to get?"
    createUser(userData: UserData): Response!
    "[MANAGE_USERS]"
    updateUser(userId: ID!, userData: UserData): Response!
    "[MANAGE_USERS] including changing renting limit"
    deleteUser(bookId: ID!): Response!

    "[CHANGE_PERMISSIONS]"
    changeUserPermissions(userId: ID!, newPermsInt: Int): Response!
  }
`;
