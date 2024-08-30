import { gql } from "@apollo/client";

export const CREATE_UPDATE_REVIEW_MUTATION = gql`
  mutation CreateUpdateReview($reviewInput: ReviewInput!) {
    createUpdateReview(reviewInput: $reviewInput) {
      id
    }
  }
`;
