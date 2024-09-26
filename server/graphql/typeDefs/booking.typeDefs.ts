import gql from "graphql-tag";

export const bookingTypeDefs = gql`
  type Customer {
    name: String!
    email: String!
    phoneNo: String!
  }

  type BookingAmount {
    tax: Float!
    discount: Float!
    rent: Float!
    total: Float!
  }

  type PaymentInfo {
    id: String
    status: String
    method: String
  }

  type Booking {
    id: ID!
    user: User
    car: Car
    startDate: String!
    endDate: String!
    customer: Customer!
    amount: BookingAmount!
    daysOfRent: Int!
    rentPerDay: Float!
    paymentInfo: PaymentInfo
    additionalNotes: String
    createdAt: String!
    updatedAt: String!
  }

  type CurrentUserBookings {
    bookings: [Booking]
    totalAmount: Float
    totalBookings: Int
    totalUnpaidBookings: Int
    pagination: Pagination
  }

  type SalesData {
    date: String
    sales: Float
    bookings: Int
  }

  type DashboardStats {
    totalSales: Float
    totalBookings: Int
    totalPendingAmount: Float
    totalPaidCash: Float
    sales: [SalesData]
  }

  type PaginatedBookings {
    bookings: [Booking]
    pagination: Pagination
  }

  input CustomerInput {
    name: String!
    email: String!
    phoneNo: String!
  }

  input BookingAmountInput {
    tax: Float!
    discount: Float!
    rent: Float!
    total: Float!
  }

  input BookingInput {
    car: ID!
    startDate: String!
    endDate: String!
    customer: CustomerInput!
    amount: BookingAmountInput!
    daysOfRent: Int!
    rentPerDay: Float!
    additionalNotes: String
  }

  input PaymentInfoInput {
    id: String
    status: String
    method: String
  }

  input UpdateBookingInput {
    paymentInfo: PaymentInfoInput
  }

  type Query {
    getAllBookings(page: Int, query: String): PaginatedBookings
    getBookingById(bookingId: String!): Booking!
    getCarBookedDates(carId: String): [String]!
    myBookings(page: Int, query: String): CurrentUserBookings
    getDashboardStats(startDate: String, endDate: String): DashboardStats
  }

  type Mutation {
    createBooking(bookingInput: BookingInput!): Booking!
    updateBooking(
      bookingId: String!
      bookingInput: UpdateBookingInput!
    ): Boolean
    deleteBooking(bookingId: String!): Boolean
  }
`;
