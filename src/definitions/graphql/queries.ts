import { gql } from "apollo-server";

export default gql`
  type Query {
    login(idToken: String!): Boolean
    "[VIEW_BOOKS] get a single media item by mongoose ObjectId"
    getBook(bookId: ID!): Book
    "[VIEW_BOOKS] get all media items whos media.contentTags intersect with the media.contentTags of the item"
    getSimilarBooks(bookId: ID!): [Book!]!
    "[VIEW_BOOKS]"
    getBooksByFilter: [Book!]!
    "[VIEW_BOOKS] get all media items in the database"
    getAllBooks: [Book!]!
    "[VIEW_BOOKS] get all media rentable items whos rentable.stateTags don't include 'Available'"
    getAllRentedBooks: [Book!]!

    "[VIEW_USERS] get a single user by mongoose ObjectId"
    getUser(userId: ID!): User
    "[VIEW_USERS] get all documents in collection User"
    getAllUsers: [User!]!
    "[VIEW_USERS]"
    getAllUsersThatHaveRentedOneOrMultiplePiecesOfMedia: [User!]!
    mintJwt(userData: Jwt!, secret: String!): String
  }
`;
