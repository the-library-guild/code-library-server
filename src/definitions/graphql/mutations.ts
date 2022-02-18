import { gql } from "apollo-server";

export default gql`
  type Mutation {
    "[MANAGE_BOOKS || RENT_BOOKS]"
    rentBook(bookId: ID!): Boolean
    "[MANAGE_BOOKS || be current owner of book]"
    returnBook(bookId: ID!): Boolean

    "[MANAGE_BOOKS]"
    updateBook: Boolean
    "[MANAGE_USERS]"
    updateUser: Boolean
  }
`;
