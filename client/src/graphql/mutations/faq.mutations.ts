import { gql } from "@apollo/client";

export const CREATE_FAQ_MUTATION = gql`
  mutation CreateFaq($faqInput: FaqInput!) {
    createFaq(faqInput: $faqInput) {
      id
    }
  }
`;

export const UPDATE_FAQ_MUTATION = gql`
  mutation UpdateFaq($faqId: ID!, $faqInput: FaqInput!) {
    updateFaq(faqId: $faqId, faqInput: $faqInput) {
      id
    }
  }
`;

export const DELETE_FAQ_MUTATION = gql`
  mutation DeleteFaq($faqId: ID!) {
    deleteFaq(faqId: $faqId)
  }
`;
