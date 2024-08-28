import { gql } from "@apollo/client";

export const GET_ALL_CARS = gql`
  query Cars($filters: CarFilters, $query: String, $page: Int) {
    getAllCars(filters: $filters, query: $query, page: $page) {
      cars {
        category
        fuelType
        location {
          coordinates
        }
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
      pagination {
        resPerPage
        totalCount
      }
    }
  }
`;

export const GET_CAR_BY_ID = gql`
  query GetCarById($carId: ID!, $getCarBookedDatesCarId2: String!) {
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
    getCarBookedDates(carId: $getCarBookedDatesCarId2)
  }
`;
