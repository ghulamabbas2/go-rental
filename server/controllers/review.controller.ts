import catchAsyncErrors from "../middlewares/catchAsyncErrors";
import Booking from "../models/booking.model";
import Car from "../models/car.model";
import Review from "../models/review.model";
import { ReviewInput } from "../types/review.types";
import APIFilters from "../utils/apiFilters";

export const getAllReviews = catchAsyncErrors(
  async (page: number, query: string) => {
    const resPerPage = 3;
    const apiFilters = new APIFilters(Review)
      .filters({ car: query })
      .populate("car");

    let reviews = await apiFilters.model;
    const totalCount = reviews.length;

    apiFilters.pagination(page, resPerPage);
    reviews = await apiFilters.model.clone();

    return { reviews, pagination: { totalCount, resPerPage } };
  }
);

export const createUpdateReview = catchAsyncErrors(
  async (reviewInput: ReviewInput, userId: string) => {
    const isReviewed = await Review.findOne({
      user: userId,
      car: reviewInput.car,
    });

    if (isReviewed) {
      const review = await Review.findByIdAndUpdate(
        isReviewed?.id,
        reviewInput,
        { new: true }
      );

      return review;
    } else {
      const review = await Review.create({ ...reviewInput, user: userId });

      await Car.findByIdAndUpdate(reviewInput.car, {
        $push: { reviews: review?.id },
      });

      return review;
    }
  }
);

export const canReview = catchAsyncErrors(
  async (canReviewCarId: string, userId: string) => {
    const booking = await Booking.findOne({
      car: canReviewCarId,
      user: userId,
      "paymentInfo.status": "paid",
    });

    return !!booking;
  }
);

export const deleteReview = catchAsyncErrors(async (reviewId: string) => {
  const review = await Review.findOneAndDelete({ _id: reviewId });

  if (!review) {
    throw new Error("Review not found");
  }

  return true;
});
