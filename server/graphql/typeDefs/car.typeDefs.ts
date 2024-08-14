import { gql } from "graphql-tag";

export const carTypeDefs = gql`
  type CarImages {
    url: String
    public_id: String
  }

  type CarRatings {
    value: Float
    count: Int
  }

  type Car {
    id: ID!
    name: String!
    description: String!
    status: String!
    rentPerDay: Float!
    address: String!
    year: Int!
    power: Int!
    milleage: Int!
    brand: String!
    transmission: String!
    fuelType: String!
    seats: Int!
    doors: Int!
    images: [CarImages]
    category: String!
    ratings: CarRatings
    createdAt: String
    updatedAt: String
  }

  input CarInput {
    name: String!
    description: String!
    status: String
    rentPerDay: Float!
    address: String!
    images: [String]
    brand: String!
    year: Int!
    transmission: String!
    milleage: Int!
    power: Int!
    seats: Int!
    doors: Int!
    fuelType: String!
    category: String!
  }

  type Query {
    getAllCars: [Car]
    getCarById(carId: ID!): Car
  }

  type Mutation {
    createCar(carInput: CarInput!): Car
    updateCar(carId: ID!, carInput: CarInput!): Boolean
    deleteCar(carId: ID!): Boolean
  }
`;
