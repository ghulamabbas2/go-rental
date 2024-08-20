import { gql } from "@apollo/client";

export const REGISTER_USER_MUTATION = gql`
  mutation RegisterUser($userInput: UserInput!) {
    registerUser(userInput: $userInput) {
      id
    }
  }
`;

export const LOGIN_MUTATION = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      id
    }
  }
`;
