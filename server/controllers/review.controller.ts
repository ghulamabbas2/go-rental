import catchAsyncErrors from "../middlewares/catchAsyncErrors";
import Booking from "../models/booking.model";
import Car from "../models/car.model";
import Review from "../models/review.model";
import { ReviewInput } from "../types/review.types";

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
