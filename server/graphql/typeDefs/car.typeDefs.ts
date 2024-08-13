import { gql } from "graphql-tag";

export const carTypeDefs = gql`
  type CarImages {
    url: String
    public_id: String
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
    createdAt: String
    updatedAt: String
  }

  type Query {
    getAllCars: String
  }
`;
