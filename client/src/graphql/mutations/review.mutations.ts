import { gql } from "@apollo/client";

export const CREATE_UPDATE_REVIEW_MUTATION = gql`
  mutation CreateUpdateReview($reviewInput: ReviewInput!) {
    createUpdateReview(reviewInput: $reviewInput) {
      id
    }
  }
`;

export const DELETE_REVIEW_MUTATION = gql`
  mutation DeleteReview($reviewId: String!) {
    deleteReview(reviewId: $reviewId)
  }
`;
