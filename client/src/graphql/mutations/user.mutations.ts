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

export const UPDATE_PROFILE_MUTATION = gql`
  mutation UpdateUserProfile($userInput: UpdateUserInput!) {
    updateUserProfile(userInput: $userInput)
  }
`;

export const UPDATE_PASSWORD_MUTATION = gql`
  mutation UpdatePassword($oldPassword: String!, $newPassword: String!) {
    updatePassword(oldPassword: $oldPassword, newPassword: $newPassword)
  }
`;

export const UPLOAD_AVATAR_MUTATION = gql`
  mutation UploadUserAvatar($avatar: String!) {
    uploadUserAvatar(avatar: $avatar)
  }
`;
