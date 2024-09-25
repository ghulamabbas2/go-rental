import { gql } from "@apollo/client";

export const CREATE_CAR_MUTATION = gql`
  mutation CreateCar($carInput: CarInput!) {
    createCar(carInput: $carInput) {
      id
    }
  }
`;

export const UPDATE_CAR_MUTATION = gql`
  mutation UpdateCar($carId: ID!, $carInput: CarInput!) {
    updateCar(carId: $carId, carInput: $carInput)
  }
`;

export const DELETE_CAR_IMAGE = gql`
  mutation DeleteCarImage($carId: ID!, $imageId: String!) {
    deleteCarImage(carId: $carId, imageId: $imageId)
  }
`;

export const DELETE_CAR_MUTATION = gql`
  mutation DeleteCar($carId: ID!) {
    deleteCar(carId: $carId)
  }
`;
