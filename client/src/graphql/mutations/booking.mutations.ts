import { gql } from "@apollo/client";

export const NEW_BOOKING_MUTATION = gql`
  mutation CreateBooking($bookingInput: BookingInput!) {
    createBooking(bookingInput: $bookingInput) {
      id
    }
  }
`;

export const UPDATE_BOOKING_MUTATION = gql`
  mutation UpdateBooking(
    $bookingId: String!
    $bookingInput: UpdateBookingInput!
  ) {
    updateBooking(bookingId: $bookingId, bookingInput: $bookingInput)
  }
`;
