import { stripeCheckoutSession } from "../../controllers/payment.controller";

export const paymentResolvers = {
  Mutation: {
    stripeCheckoutSession: async (
      _: any,
      { bookingId }: { bookingId: string }
    ) => await stripeCheckoutSession(bookingId),
  },
};
