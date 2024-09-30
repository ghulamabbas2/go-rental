import { allow, and, rule, shield } from "graphql-shield";

const isAuthenticated = rule({ cache: "contextual" })(
  async (parent, args, context) => {
    return context?.user !== null;
  }
);

const isAdmin = rule({ cache: "contextual" })(async (parent, args, context) => {
  return context?.user?.role?.includes("admin");
});

export const permissions = shield(
  {
    Query: {
      getAllBookings: isAuthenticated,
      getBookingById: isAuthenticated,
      getDashboardStats: and(isAuthenticated, isAdmin),
      myBookings: isAuthenticated,

      getAllUsers: and(isAuthenticated, isAdmin),
      me: isAuthenticated,
      logout: isAuthenticated,

      getAllCoupons: and(isAuthenticated, isAdmin),
    },
    Mutation: {
      createCar: and(isAuthenticated, isAdmin),
      updateCar: and(isAuthenticated, isAdmin),
      deleteCarImage: and(isAuthenticated, isAdmin),
      deleteCar: and(isAuthenticated, isAdmin),

      createBooking: isAuthenticated,
      updateBooking: isAuthenticated,
      deleteBooking: and(isAuthenticated, isAdmin),

      updateUserProfile: isAuthenticated,
      updatePassword: isAuthenticated,
      uploadUserAvatar: isAuthenticated,
      updateUser: and(isAuthenticated, isAdmin),
      deleteUser: and(isAuthenticated, isAdmin),

      createCoupon: and(isAuthenticated, isAdmin),
      updateCoupon: and(isAuthenticated, isAdmin),
      deleteCoupon: and(isAuthenticated, isAdmin),

      createFaq: and(isAuthenticated, isAdmin),
      updateFaq: and(isAuthenticated, isAdmin),
      deleteFaq: and(isAuthenticated, isAdmin),

      stripeCheckoutSession: isAuthenticated,

      createUpdateReview: isAuthenticated,
      deleteReview: and(isAuthenticated, isAdmin),
    },
  },
  {
    debug: true,
  }
);
