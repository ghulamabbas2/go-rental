import { gql } from "@apollo/client";

export const CURRENT_USER = gql`
  query Me {
    me {
      id
      name
      email
      avatar {
        url
        public_id
      }
      phoneNo
      role
      createdAt
      updatedAt
    }
  }
`;

export const LOGOUT = gql`
  query Query {
    logout
  }
`;
