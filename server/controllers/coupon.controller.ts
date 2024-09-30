import catchAsyncErrors from "../middlewares/catchAsyncErrors";
import Car from "../models/car.model";
import Coupon from "../models/coupon.model";
import { CouponInput } from "../types/coupon.types";

export const getAllCoupons = catchAsyncErrors(async (carId: string) => {
  const coupons = await Coupon.find({ car: carId });

  return coupons;
});

export const createCoupon = catchAsyncErrors(
  async (couponInput: CouponInput, userId: string) => {
    const car = await Car.findById(couponInput.car);

    if (!car) throw new Error("Car not found");

    const coupon = await Coupon.create({
      ...couponInput,
      user: userId,
    });

    return coupon;
  }
);

export const updateCoupon = catchAsyncErrors(
  async (couponId: string, couponInput: CouponInput) => {
    const coupon = await Coupon.findByIdAndUpdate(couponId, couponInput);

    if (!coupon) throw new Error("Coupon not found");

    return coupon;
  }
);

export const deleteCoupon = catchAsyncErrors(async (couponId: string) => {
  const coupon = await Coupon.findById(couponId);

  if (!coupon) throw new Error("Coupon not found");

  await coupon.deleteOne();

  return true;
});

export const getCoupon = catchAsyncErrors(
  async (couponCode: string, carId: string) => {
    const coupon = await Coupon.findOne({
      code: couponCode,
      car: carId,
    });

    if (!coupon) throw new Error("Coupon not found");

    const isCouponExpired = new Date() > coupon.expiry;

    if (isCouponExpired) throw new Error("Coupon is expired");

    return coupon;
  }
);
