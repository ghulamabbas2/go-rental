import { gql } from "@apollo/client";

export const STRIPE_CHECKOUT_SESSION_MUTATION = gql`
  mutation StripeCheckoutSession($bookingId: ID!) {
    stripeCheckoutSession(bookingId: $bookingId) {
      url
    }
  }
`;
