import { IUser } from "@go-rental/shared";
import {
  createCoupon,
  deleteCoupon,
  getAllCoupons,
  getCoupon,
  updateCoupon,
} from "../../controllers/coupon.controller";
import { CouponInput } from "../../types/coupon.types";

export const couponResolvers = {
  Query: {
    getAllCoupons: async (_: any, { carId }: { carId: string }) =>
      getAllCoupons(carId),
    getCoupon: async (
      _: any,
      { couponCode, carId }: { couponCode: string; carId: string }
    ) => getCoupon(couponCode, carId),
  },
  Mutation: {
    createCoupon: async (
      _: any,
      { couponInput }: { couponInput: CouponInput },
      { user }: { user: IUser }
    ) => createCoupon(couponInput, user?.id),
    updateCoupon: async (
      _: any,
      { couponId, couponInput }: { couponId: string; couponInput: CouponInput }
    ) => updateCoupon(couponId, couponInput),
    deleteCoupon: async (_: any, { couponId }: { couponId: string }) =>
      deleteCoupon(couponId),
  },
};
