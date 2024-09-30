import gql from "graphql-tag";

export const couponTypeDefs = gql`
  type Coupon {
    id: ID
    user: ID
    car: ID
    name: String
    code: String
    discountPercent: Int
    expiry: String
    createdAt: String
    updatedAt: String
  }

  input CouponInput {
    name: String!
    code: String!
    discountPercent: Int!
    expiry: String!
    car: ID
  }

  type Query {
    getAllCoupons(carId: ID!): [Coupon]
    getCoupon(couponCode: String!, carId: ID!): Coupon
  }

  type Mutation {
    createCoupon(couponInput: CouponInput!): Coupon
    updateCoupon(couponId: ID!, couponInput: CouponInput!): Coupon
    deleteCoupon(couponId: ID!): Boolean
  }
`;
