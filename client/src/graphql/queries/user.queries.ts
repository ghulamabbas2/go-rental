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

export const GET_ALL_USERS = gql`
  query GetAllUsers($query: String, $page: Int) {
    getAllUsers(query: $query, page: $page) {
      pagination {
        totalCount
        resPerPage
      }
      users {
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
      }
    }
  }
`;
