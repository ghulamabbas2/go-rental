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

  type PaginatedUsers {
    users: [User]
    pagination: Pagination
  }

  input UserInput {
    name: String!
    email: String!
    password: String!
    phoneNo: String!
  }

  input UpdateUserInput {
    name: String!
    email: String!
    phoneNo: String!
    role: [String]
  }

  type Query {
    me: User
    logout: Boolean
    getAllUsers(page: Int, query: String): PaginatedUsers
  }

  type Mutation {
    registerUser(userInput: UserInput!): User
    login(email: String!, password: String!): User
    updateUserProfile(userInput: UpdateUserInput!): Boolean
    updatePassword(oldPassword: String!, newPassword: String!): Boolean
    uploadUserAvatar(avatar: String!): Boolean
    forgotPassword(email: String!): Boolean
    resetPassword(
      token: String!
      password: String!
      confirmPassword: String!
    ): Boolean
    updateUser(userId: String!, userInput: UpdateUserInput!): Boolean
    deleteUser(userId: String!): Boolean
  }
`;
