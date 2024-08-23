import { IUser } from "@go-rental/shared";
import {
  createBooking,
  getBookingById,
  getCarBookedDates,
  myBookings,
  updateBooking,
} from "../../controllers/booking.controller";
import { BookingInput } from "../../types/booking.types";

export const bookingResolvers = {
  Query: {
    getBookingById: async (
      _: any,
      { bookingId }: { bookingId: string },
      { user }: { user: IUser }
    ) => getBookingById(bookingId, user),
    getCarBookedDates: async (_: any, { carId }: { carId: string }) =>
      getCarBookedDates(carId),
    myBookings: async (
      _: any,
      { page, query }: { page: number; query: number },
      { user }: { user: IUser }
    ) => {
      const filters = { user: user.id };

      return myBookings(page, filters, query);
    },
  },
  Mutation: {
    createBooking: async (
      _: any,
      { bookingInput }: { bookingInput: BookingInput },
      { user }: { user: IUser }
    ) => createBooking(bookingInput, user.id),
    updateBooking: async (
      _: any,
      {
        bookingId,
        bookingInput,
      }: { bookingId: string; bookingInput: Partial<BookingInput> },
      { user }: { user: IUser }
    ) => updateBooking(bookingId, bookingInput, user),
  },
};
