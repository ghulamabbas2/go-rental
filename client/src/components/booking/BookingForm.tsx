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
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { DropdownMenuSeparator } from "../ui/dropdown-menu";
import { MoveRight } from "lucide-react";
// import CouponCard from "../coupon/CouponCard";
import AlertMessage from "../layout/AlertMessage";
import { Link, useNavigate } from "react-router-dom";
import { useMutation, useReactiveVar } from "@apollo/client";
import { userVar } from "src/apollo/apollo-vars";
import { DateRange } from "react-day-picker";
import { CarDatePicker } from "./CarDatePicker";
import { differenceInDays } from "date-fns";
import {
  adjustDateToLocalTimeZone,
  calculateAmount,
  errorToast,
  errorWrapper,
  formatDate,
  getAllDatesBetween,
} from "src/utils/helpers";
import { NEW_BOOKING_MUTATION } from "src/graphql/mutations/booking.mutations";
import CouponCard from "../coupon/CouponCard";

type Props = {
  carId: string;
  rentPerDay?: number;
  disabledDates?: [string];
};

export function BookingForm({ carId, rentPerDay = 0, disabledDates }: Props) {
  const user = useReactiveVar(userVar);
  const navigate = useNavigate();

  const [daysOfRent, setDaysOfRent] = useState(0);
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);
  const [additionalNotes, setAdditionalNotes] = useState("");
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [customer, setCustomer] = useState({
    name: "",
    email: "",
    phoneNo: "",
  });

  const [amount, setAmount] = useState({
    tax: 0,
    discount: 0,
    rent: 0,
    total: 0,
  });

  const [dates, setDates] = useState<DateRange | undefined>({
    from: new Date(),
    to: new Date(),
  });

  const [createBooking, { loading }] = useMutation(NEW_BOOKING_MUTATION);

  useEffect(() => {
    if (user) {
      setCustomer({
        name: user?.name,
        email: user?.email,
        phoneNo: user?.phoneNo,
      });
    }
  }, [user]);

  useEffect(() => {
    setAmount(calculateAmount(rentPerDay, daysOfRent, couponDiscount));
  }, [daysOfRent, couponDiscount]);

  const bookedDates = disabledDates?.map(formatDate);

  const dateChangeHandler = (dates: DateRange | undefined) => {
    if (!dates?.from || !dates?.to) return;

    const allDates = getAllDatesBetween(dates.from, dates.to);
    const filteredDates = allDates.filter((element) =>
      bookedDates?.includes(element)
    );

    if (filteredDates.length > 0) {
      setIsAvailable(false);
    } else {
      setIsAvailable(true);
    }

    setDates(dates);

    const daysOfRent =
      differenceInDays(
        dates.to?.setHours(0, 0, 0, 0),
        dates.from?.setHours(0, 0, 0, 0)
      ) + 1;

    setDaysOfRent(daysOfRent);
  };

  const newBookingHandler = async () => {
    if (!dates?.from || !dates?.to) return;

    if (daysOfRent <= 0) {
      return errorToast({ message: "Please select booking dates" });
    }

    const newBookingData = {
      amount,
      customer,
      daysOfRent,
      rentPerDay,
      car: carId,
      startDate: adjustDateToLocalTimeZone(dates?.from),
      endDate: adjustDateToLocalTimeZone(dates?.to),
      additionalNotes,
    };

    await errorWrapper(async () => {
      const { data } = await createBooking({
        variables: { bookingInput: newBookingData },
      });

      if (data?.createBooking?.id) {
        navigate(`/booking/${data.createBooking.id}/payment_method`);
      }
    });
  };

  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle>New Booking</CardTitle>
          <CardDescription>Enter the details to rent this car.</CardDescription>
        </CardHeader>
        <CardContent>
          <form>
            <div className="grid w-full items-center gap-6">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  placeholder="Full Name"
                  value={customer?.name}
                  onChange={(e) =>
                    setCustomer({ ...customer, name: e.target.value })
                  }
                />
              </div>

              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Email Address"
                  defaultValue={customer?.email}
                  disabled
                />
              </div>

              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="phoneno">Phone No</Label>
                <Input
                  id="phoneno"
                  type="text"
                  placeholder="Phone No"
                  value={customer?.phoneNo}
                  onChange={(e) =>
                    setCustomer({ ...customer, phoneNo: e.target.value })
                  }
                />
              </div>

              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="phoneno">Booking Dates</Label>
                <CarDatePicker
                  dates={dates}
                  onDateChange={dateChangeHandler}
                  disabledDates={disabledDates}
                />
              </div>

              {isAvailable === false && (
                <AlertMessage
                  title="Not Available"
                  description="Dates are not available for booking. Try again!"
                />
              )}

              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="phoneno">Additional Notes</Label>
                <Textarea
                  placeholder="Type your additional notes here."
                  value={additionalNotes}
                  onChange={(e) => setAdditionalNotes(e.target.value)}
                />
              </div>
            </div>
          </form>
        </CardContent>
      </Card>

      <CouponCard
        onCouponChange={(discount: number) => setCouponDiscount(discount)}
      />

      <Card className="mt-5">
        <CardHeader>
          <CardTitle>Summary</CardTitle>
          <CardDescription>
            Take a look at your booking & confirm
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form>
            <div className="grid w-full items-center gap-3">
              <div className="flex justify-between">
                <p className="text-md">Days of Rent:</p>
                <p className="font-bold">{daysOfRent}</p>
              </div>

              <div className="flex justify-between">
                <p className="text-md">Rent Per Day:</p>
                <p className="font-bold">${rentPerDay}</p>
              </div>

              <div className="flex justify-between">
                <p className="text-md">Total Rent:</p>
                <p className="font-bold">
                  {couponDiscount > 0 ? (
                    <>
                      <span className="line-through me-2">
                        ${amount?.rent?.toFixed(2)}
                      </span>
                      ${(amount?.rent - amount?.discount).toFixed(2)}
                    </>
                  ) : (
                    <>${amount?.rent?.toFixed(2)}</>
                  )}
                </p>
              </div>

              <div className="flex justify-between">
                <p className="text-md">Tax (15%):</p>
                <p className="font-bold">${amount?.tax?.toFixed(2)}</p>
              </div>
              <DropdownMenuSeparator />

              <div className="flex justify-between">
                <p className="text-md">Est. Total:</p>
                <p className="font-bold">${amount?.total?.toFixed(2)}</p>
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter>
          {user && isAvailable && (
            <Button
              className="w-full"
              disabled={loading}
              onClick={newBookingHandler}
            >
              Proceed <MoveRight className="ms-3 h-5 w-5" />
            </Button>
          )}

          {!user && (
            <AlertMessage
              title="Login!"
              description="Please login to rent this Car"
            />
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
