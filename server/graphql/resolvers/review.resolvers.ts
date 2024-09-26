import { IUser } from "@go-rental/shared";
import {
  canReview,
  createUpdateReview,
  deleteReview,
  getAllReviews,
} from "../../controllers/review.controller";
import { ReviewInput } from "../../types/review.types";

export const reviewResolvers = {
  Query: {
    getAllReviews: async (
      _: any,
      { page, query }: { page: number; query: string }
    ) => getAllReviews(page, query),
    canReview: async (
      _: any,
      { canReviewCarId }: { canReviewCarId: string },
      { user }: { user: IUser }
    ) => canReview(canReviewCarId, user?.id),
  },
  Mutation: {
    createUpdateReview: async (
      _: any,
      { reviewInput }: { reviewInput: ReviewInput },
      { user }: { user: IUser }
    ) => createUpdateReview(reviewInput, user?.id),
    deleteReview: async (_: any, { reviewId }: { reviewId: string }) =>
      deleteReview(reviewId),
  },
};
