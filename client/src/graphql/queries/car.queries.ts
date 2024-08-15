import { gql } from "@apollo/client";

export const GET_ALL_CARS = gql`
  query GetAllCars {
    getAllCars {
      category
      fuelType
      images {
        public_id
        url
      }
      id
      name
      rentPerDay
      transmission
      ratings {
        count
        value
      }
    }
  }
`;

export const GET_CAR_BY_ID = gql`
  query GetCarById($carId: ID!) {
    getCarById(carId: $carId) {
      id
      name
      description
      status
      rentPerDay
      address
      year
      power
      milleage
      brand
      transmission
      fuelType
      seats
      doors
      images {
        url
        public_id
      }
      category
      ratings {
        value
        count
      }
      createdAt
      updatedAt
    }
  }
`;
