import gql from "graphql-tag";

export const faqTypeDefs = gql`
  type Faq {
    id: ID
    user: User
    question: String
    answer: String
    createdAt: String
    updatedAt: String
  }

  input FaqInput {
    question: String!
    answer: String!
  }

  type Query {
    getAllFaqs: [Faq]
  }

  type Mutation {
    createFaq(faqInput: FaqInput!): Faq
    updateFaq(faqId: ID!, faqInput: FaqInput!): Faq
    deleteFaq(faqId: ID!): Boolean
  }
`;
