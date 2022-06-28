import { gql } from "apollo-server";

export default gql`
  type Query {
    "[VIEW_BOOKS]"
    getBookByQr(qrId: ID!): Item
    "[VIEW_BOOKS]"
    getShelf: Item
    "[VIEW_BOOKS]"
    getReturnBox: Item
    "[VIEW_BOOKS] get a single media item by mongoose ObjectId"
    getBook(bookId: ID!): Item
    "[VIEW_BOOKS] get all media items in the database"
    getAllBooks: [Item!]!
    "[VIEW_BOOKS] get all media items whos media.contentTags intersect with the media.contentTags of the item"
    getSimilarBooks(bookId: ID!): [Item!]!

    "[VIEW_USERS] get a single user by mongoose ObjectId"
    getUser(email: String!): User
    "[VIEW_USERS] get all documents in collection User"
    getAllUsers: [User!]!
    "[VIEW_USERS] get all users who have rented one or multiple books"
    getRentingUsers: [User!]!

    "[secret === env.JWT_SECRET] only meant to be accessed by next-authJs backend, secret is used to ensure this"
    mintJwt(userData: Jwt!, secret: String!): String
  }
`;
