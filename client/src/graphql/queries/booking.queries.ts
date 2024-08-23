import { gql } from "@apollo/client";

export const GET_BOOKING_BY_ID = gql`
  query GetBookingById($bookingId: String!) {
    getBookingById(bookingId: $bookingId) {
      id
      car {
        name
      }
      startDate
      endDate
      customer {
        name
        email
        phoneNo
      }
      amount {
        tax
        rent
        discount
        total
      }
      daysOfRent
      rentPerDay
      paymentInfo {
        id
        method
        status
      }
      additionalNotes
      createdAt
    }
  }
`;

export const GET_MY_BOOKINGS = gql`
  query MyBookings($page: Int, $query: String) {
    myBookings(page: $page, query: $query) {
      bookings {
        id
        car {
          name
          images {
            url
            public_id
          }
        }
        amount {
          total
        }
        paymentInfo {
          status
        }
        createdAt
      }
      totalAmount
      totalBookings
      totalUnpaidBookings
      pagination {
        resPerPage
        totalCount
      }
    }
  }
`;
