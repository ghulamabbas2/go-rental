import { gql } from "@apollo/client";

export const GET_ALL_FAQS = gql`
  query GetAllFaqs {
    getAllFaqs {
      id
      question
      answer
      createdAt
      updatedAt
    }
  }
`;
