import { gql } from "@apollo/client";

export const CREATE_COUPON_MUTATION = gql`
  mutation CreateCoupon($couponInput: CouponInput!) {
    createCoupon(couponInput: $couponInput) {
      id
    }
  }
`;

export const UPDATE_COUPON_MUTATION = gql`
  mutation UpdateCoupon($couponId: ID!, $couponInput: CouponInput!) {
    updateCoupon(couponId: $couponId, couponInput: $couponInput) {
      id
    }
  }
`;
export const DELETE_COUPON_MUTATION = gql`
  mutation DeleteCoupon($couponId: ID!) {
    deleteCoupon(couponId: $couponId)
  }
`;
