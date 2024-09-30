import { gql } from "@apollo/client";

export const GET_CAR_COUPONS = gql`
  query GetAllCoupons($carId: ID!) {
    getAllCoupons(carId: $carId) {
      id
      name
      code
      discountPercent
      expiry
      createdAt
    }
  }
`;

export const GET_COUPON_DETAILS = gql`
  query GetCoupon($couponCode: String!, $carId: ID!) {
    getCoupon(couponCode: $couponCode, carId: $carId) {
      id
      name
      code
      discountPercent
      expiry
    }
  }
`;
