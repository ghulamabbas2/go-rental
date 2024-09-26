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

  type PaginatedReviews {
    reviews: [Review]
    pagination: Pagination
  }

  input ReviewInput {
    car: ID!
    rating: Int!
    comment: String!
  }

  type Query {
    canReview(canReviewCarId: ID): Boolean
    getAllReviews(page: Int, query: String): PaginatedReviews
  }

  type Mutation {
    createUpdateReview(reviewInput: ReviewInput!): Review
    deleteReview(reviewId: String!): Boolean
  }
`;
