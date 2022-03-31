import { gql } from "apollo-server";

export default gql`
  scalar Date

  interface BaseError {
    msg: String!
  }
  type Media {
    contentTags: [String!]!
    contentDesc: String
    tagline: String
    creators: [String!]!
    publisher: String
    language: String
    publishedDate: Date
  }
  type Rentable {
    stateTags: [String!]!
    rentedDate: Date
    dueDate: Date
  }
  type Item {
    _id: ID!
    tags: [String!]!
    name: String
    desc: String

    childrenIds: [ID!]!
    children: [Item!]!

    parentId: ID
    parent: Item

    media: Media
    rentable: Rentable
  }
  type User {
    _id: ID!
    tags: [String!]!
    name: String
    desc: String

    childrenIds: [ID!]!
    children: [Item!]!

    email: String!
    permsInt: Int!
    rentingLimit: Int!
  }
  input Jwt {
    email: String!
    name: String
    picture: String
  }
  input MediaData {
    contentTags: [String!]
    contentDesc: String
    subTitle: String
    creators: [String!]
    publisher: String
    language: String
    publishedDate: Date
  }
  input BookData {
    tags: [String]
    name: String
    desc: String

    media: MediaData
  }
  input UserData {
    email: String
    tags: [String!]
    name: String
    desc: String
  }
`;
