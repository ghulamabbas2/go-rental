import gql from "graphql-tag";

export const userTypeDefs = gql`
  type Avatar {
    url: String
    public_id: String
  }

  type User {
    id: ID!
    name: String!
    email: String!
    avatar: Avatar
    phoneNo: String!
    role: [String]
    createdAt: String!
    updatedAt: String!
  }

  input UserInput {
    name: String!
    email: String!
    password: String!
    phoneNo: String!
  }

  type Query {
    me: String
  }

  type Mutation {
    registerUser(userInput: UserInput!): User
    login(email: String!, password: String!): User
  }
`;
