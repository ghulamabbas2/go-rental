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

const getSalesData = async (startDate: Date, endDate: Date) => {
  const salesData = await Booking.aggregate([
    {
      // Stage 1: Filter results
      $match: {
        createdAt: {
          $gte: new Date(startDate),
          $lte: new Date(endDate),
        },
      },
    },
    // Stage 2: Facet to get total sales and total bookings
    {
      $facet: {
        salesData: [
          // Stage 1: Group by date and get total sales & bookings
          {
            $group: {
              _id: {
                date: {
                  $dateToString: {
                    format: "%Y-%m-%d",
                    date: "$createdAt",
                  },
                },
              },
              totalSales: { $sum: "$amount.total" },
              numOfBookings: { $sum: 1 },
            },
          },
        ],
        pendingCashData: [
          {
            $match: { "paymentInfo.status": "pending" },
          },
          {
            $group: {
              _id: null,
              totalPendingCash: { $sum: "$amount.total" },
            },
          },
        ],
        paidCashData: [
          {
            $match: {
              "paymentInfo.status": "paid",
              "paymentInfo.method": "cash",
            },
          },
          {
            $group: {
              _id: null,
              totalPendingCash: { $sum: "$amount.total" },
            },
          },
        ],
      },
    },
  ]);

  const {
    salesData: salesDataResult = [],
    pendingCashData: pendingCashDataResult = [],
    paidCashData: paidCashDataResult = [],
  } = salesData[0];

  const salesMap = new Map();
  let totalSales = 0;
  let totalBookings = 0;

  salesDataResult.forEach((data: any) => {
    const date = data?._id?.date;
    const sales = data?.totalSales || 0;
    const bookings = data?.numOfBookings || 0;

    salesMap.set(date, { sales, bookings });
    totalSales += sales;
    totalBookings += bookings;
  });

  let currentDate = new Date(startDate);
  const finalSalesData = [];
  while (currentDate <= endDate) {
    const date = currentDate.toISOString().split("T")[0]; // Get date in format YYYY-MM-DD
    finalSalesData.push({
      date,
      sales: salesMap.get(date)?.sales || 0,
      bookings: salesMap.get(date)?.bookings || 0,
    });

    currentDate.setDate(currentDate.getDate() + 1);
  }

  const totalPendingAmount = pendingCashDataResult[0]?.totalPendingCash || 0;
  const totalPaidCash = paidCashDataResult[0]?.totalPendingCash || 0;

  return {
    salesData: finalSalesData,
    totalSales,
    totalBookings,
    totalPendingAmount,
    totalPaidCash,
  };
};

export const getDashboardStats = catchAsyncErrors(
  async (startDate: Date, endDate: Date) => {
    startDate = new Date(startDate);
    endDate = new Date(endDate);

    startDate.setUTCHours(0, 0, 0, 0);
    endDate.setUTCHours(23, 59, 59, 999);

    const {
      salesData,
      totalSales,
      totalBookings,
      totalPendingAmount,
      totalPaidCash,
    } = await getSalesData(startDate, endDate);

    return {
      sales: salesData,
      totalSales,
      totalBookings,
      totalPendingAmount,
      totalPaidCash,
    };
  }
);
