import React, { useEffect, useState } from "react";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Input } from "../ui/input";
import AlertMessage from "../layout/AlertMessage";
import { Label } from "../ui/label";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useLazyQuery } from "@apollo/client";
import { GET_COUPON_DETAILS } from "src/graphql/queries/coupon.queries";
import { updateSearchParams } from "src/utils/helpers";

type Props = {
  onCouponChange?: (dicount: number) => void;
};

const CouponCard = ({ onCouponChange }: Props) => {
  let [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const params = useParams();

  const [coupon, setCoupon] = useState(searchParams.get("coupon") || "");

  const [getCoupon, { data, loading, error }] =
    useLazyQuery(GET_COUPON_DETAILS);

  useEffect(() => {
    if (coupon) {
      getCoupon({
        variables: {
          couponCode: coupon,
          carId: params?.id,
        },
      });
    }
  }, []);

  useEffect(() => {
    onCouponChange?.(data?.getCoupon?.discountPercent || 0);
  }, [data]);

  useEffect(() => {
    if (!coupon) {
      searchParams.delete("coupon");

      const path = `${window.location.pathname}?${searchParams.toString()}`;
      navigate(path);
    }
  }, [coupon]);

  const submitHandler = (e: React.FormEvent) => {
    e.preventDefault();

    searchParams = updateSearchParams(searchParams, "coupon", coupon);

    getCoupon({
      variables: {
        couponCode: coupon,
        carId: params?.id,
      },
    });

    const path = `${window.location.pathname}?${searchParams.toString()}`;
    navigate(path);
  };

  return (
    <Card className="mt-5">
      <CardHeader>
        <CardTitle>Have Coupon?</CardTitle>
        <CardDescription>Enter below to avail discount</CardDescription>
      </CardHeader>
      <form onSubmit={submitHandler}>
        <CardContent>
          <div className="grid w-full items-center gap-3">
            <div className="flex flex-col space-y-1.5">
              <Label>Name</Label>
              <Input
                id="coupon"
                type="search"
                placeholder="Coupon Code"
                value={coupon}
                onChange={(e) => setCoupon(e.target.value)}
              />
            </div>
          </div>

          {error && (
            <div className="mt-2">
              <AlertMessage
                title="Invalid Coupon!"
                description="Coupon is invalid or expired"
              />
            </div>
          )}

          {data && (
            <div className="mt-2">
              <AlertMessage
                title="Coupon Applied!"
                description={`You have saved ${data?.getCoupon?.discountPercent}%`}
                color="green"
              />
            </div>
          )}
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full">
            Apply Coupon
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default CouponCard;
