import gql from "graphql-tag";

export const reviewTypeDefs = gql`
  type Review {
    id: ID
    user: User
    car: Car
    rating: Int
    comment: String
    createdAt: String
    updatedAt: String
  }

  input ReviewInput {
    car: ID!
    rating: Int!
    comment: String!
  }

  type Query {
    canReview(canReviewCarId: ID!): Boolean
  }

  type Mutation {
    createUpdateReview(reviewInput: ReviewInput!): Review
  }
`;
