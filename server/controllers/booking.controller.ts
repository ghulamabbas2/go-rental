import { IBooking, IUser } from "@go-rental/shared";
import catchAsyncErrors from "../middlewares/catchAsyncErrors";
import Booking from "../models/booking.model";
import { BookingInput } from "../types/booking.types";
import { NotFoundError } from "../utils/errorHandler";
import APIFilters from "../utils/apiFilters";

export const createBooking = catchAsyncErrors(
  async (bookingInput: BookingInput, userId: string) => {
    const newBooking = await Booking.create({
      ...bookingInput,
      user: userId,
    });

    return newBooking;
  }
);

export const getBookingById = catchAsyncErrors(
  async (bookingId: string, user: IUser) => {
    const booking = await Booking.findById(bookingId).populate("car");

    if (!booking) {
      throw new NotFoundError("Booking not found");
    }

    if (!user.role?.includes("admin") && booking.user.toString() !== user.id) {
      throw new Error("You do not have permission to access this booking");
    }

    return booking;
  }
);

export const updateBooking = catchAsyncErrors(
  async (
    bookingId: string,
    bookingInput: Partial<BookingInput>,
    user: IUser
  ) => {
    const booking = await Booking.findById(bookingId).populate("car");

    if (!booking) {
      throw new NotFoundError("Booking not found");
    }

    if (!user.role?.includes("admin") && booking.user.toString() !== user.id) {
      throw new Error("You do not have permission to access this booking");
    }

    await booking.set(bookingInput).save();

    return true;
  }
);

export const getCarBookedDates = catchAsyncErrors(async (carId: string) => {
  const bookings = await Booking.find({ car: carId });

  const bookedDates = bookings.flatMap((booking) => {
    const startDate = new Date(booking.startDate);
    const endDate = new Date(booking.endDate);
    const dates = [];

    for (
      let date = new Date(startDate);
      date <= endDate;
      date.setDate(date.getDate() + 1)
    ) {
      dates.push(new Date(date));
    }

    return dates;
  });

  return bookedDates;
});

export const myBookings = catchAsyncErrors(
  async (page: number, filters: any, query: string) => {
    const resPerPage = 2;

    const apiFilters = new APIFilters(Booking).filters(filters).populate("car");
    let bookings = await apiFilters.model;

    const totalAmount = bookings?.reduce(
      (acc: number, booking: IBooking) => acc + booking.amount.total,
      0
    );
    const totalBookings = bookings.length;
    const totalUnpaidBookings = bookings.filter(
      (booking: IBooking) => booking.paymentInfo.status !== "paid"
    ).length;

    apiFilters.search(query);

    bookings = await apiFilters.model.clone();
    let totalCount = bookings.length;

    apiFilters.pagination(page, resPerPage);
    bookings = await apiFilters.model.clone();

    return {
      bookings,
      totalAmount,
      totalBookings,
      totalUnpaidBookings,
      pagination: {
        totalCount,
        resPerPage,
      },
    };
  }
);
