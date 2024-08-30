import { IUser } from "@go-rental/shared";
import {
  canReview,
  createUpdateReview,
} from "../../controllers/review.controller";
import { ReviewInput } from "../../types/review.types";

export const reviewResolvers = {
  Query: {
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
  },
};
