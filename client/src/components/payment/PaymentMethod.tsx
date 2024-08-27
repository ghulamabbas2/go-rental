import React, { useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { DropdownMenuSeparator } from "../ui/dropdown-menu";
import { Label } from "../ui/label";
import { Coins, CreditCard, ReceiptText } from "lucide-react";
import { Button } from "../ui/button";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import AlertMessage from "../layout/AlertMessage";
import { useMutation, useQuery } from "@apollo/client";
import { GET_BOOKING_BY_ID } from "src/graphql/queries/booking.queries";
import { useNavigate, useParams } from "react-router-dom";
import LoadingSpinner from "../layout/LoadingSpinner";
import NotFound from "../layout/NotFound";
import { errorToast, errorWrapper } from "src/utils/helpers";
import { UPDATE_BOOKING_MUTATION } from "src/graphql/mutations/booking.mutations";
import { toast } from "../ui/use-toast";
import { STRIPE_CHECKOUT_SESSION_MUTATION } from "src/graphql/mutations/payment.mutations";

const PaymentMethod = () => {
  const [paymentMethod, setPaymentMethod] = React.useState("cash");
  const params = useParams();
  const navigate = useNavigate();

  const {
    data,
    loading: bookingLoading,
    error: bookingError,
  } = useQuery(GET_BOOKING_BY_ID, {
    variables: { bookingId: params?.id },
  });
  const booking = data?.getBookingById;

  const [updateBooking] = useMutation(UPDATE_BOOKING_MUTATION, {
    onCompleted: () => {
      toast({
        title: "Booking Updated",
        description: "Please cash with 6 hours to confirm your booking",
      });
    },
  });

  const [
    stripeCheckoutSession,
    { loading: checkoutLoading, error: checkoutError },
  ] = useMutation(STRIPE_CHECKOUT_SESSION_MUTATION, {
    onCompleted: (data) => {
      if (data?.stripeCheckoutSession?.url) {
        window.location.href = data?.stripeCheckoutSession?.url;
      }
    },
  });

  useEffect(() => {
    if (bookingError) errorToast(bookingError);
    if (checkoutError) errorToast(checkoutError);
  }, [bookingError, checkoutError]);

  const handleBookingUpdate = async () => {
    if (paymentMethod === "cash") {
      const bookingInput = {
        paymentInfo: {
          method: "cash",
        },
      };

      await errorWrapper(async () => {
        await updateBooking({
          variables: { bookingId: params?.id, bookingInput },
        });
      });
    }

    if (paymentMethod === "card") {
      await errorWrapper(async () => {
        await stripeCheckoutSession({
          variables: { bookingId: params?.id },
        });
      });
    }
  };

  if (bookingLoading) {
    return <LoadingSpinner size={60} fullScreen={true} />;
  }

  if (bookingError?.graphQLErrors[0]?.extensions?.code === "NOT_FOUND") {
    return <NotFound />;
  }

  return (
    <div className="flex flex-col justify-center items-center h-screen">
      <div className="mb-10 flex items-center">
        <h1 className="text-4xl text-gray-600">Booking # {booking?.id}</h1>
      </div>
      <div className="flex items-center">
        <Card className="h-full w-full max-w-xl me-10">
          <div className="flex items-center justify-start">
            <ReceiptText className="h-12 w-12 ms-5" />
            <CardHeader className="ps-2">
              <CardTitle>Booking Summary</CardTitle>
              <CardDescription>Below are your booking details</CardDescription>
            </CardHeader>
          </div>
          <CardContent>
            <form>
              <div className="grid w-full items-center gap-3">
                <div className="flex justify-between">
                  <p className="text-md">Days of Rent:</p>
                  <p className="font-bold">{booking?.daysOfRent}</p>
                </div>

                <div className="flex justify-between">
                  <p className="text-md">Rent Per Day:</p>
                  <p className="font-bold">${booking?.rentPerDay}</p>
                </div>

                <div className="flex justify-between">
                  <p className="text-md">Total Rent:</p>
                  <p className="font-bold">
                    ${booking?.amount?.rent?.toFixed(2)}
                  </p>
                </div>

                <div className="flex justify-between">
                  <p className="text-md">Discount:</p>
                  <p className="font-bold">
                    ${booking?.amount?.discount?.toFixed(2)}
                  </p>
                </div>

                <div className="flex justify-between">
                  <p className="text-md">Tax (15%):</p>
                  <p className="font-bold">
                    ${booking?.amount?.tax?.toFixed(2)}
                  </p>
                </div>
                <DropdownMenuSeparator />

                <div className="flex justify-between">
                  <p className="text-md">Grand Total:</p>
                  <p className="font-bold">
                    ${booking?.amount?.total?.toFixed(2)}
                  </p>
                </div>
              </div>
            </form>
          </CardContent>
        </Card>
        <Card className="h-full w-full max-w-xl">
          <CardHeader>
            <CardTitle>Payment Method</CardTitle>
            <CardDescription>
              Select your payment method to complete this booking
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-6">
            <RadioGroup defaultValue="card" className="grid grid-cols-2 gap-6">
              <Label
                htmlFor="card"
                className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground [&:has([data-state=checked])]:border-primary"
                onClick={() => setPaymentMethod("cash")}
              >
                <RadioGroupItem value="card" id="card" className="sr-only" />
                <Coins className="mb-3 h-6 w-6" />
                Cash
              </Label>
              <Label
                htmlFor="paypal"
                className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground [&:has([data-state=checked])]:border-primary"
                onClick={() => setPaymentMethod("card")}
              >
                <RadioGroupItem
                  value="paypal"
                  id="paypal"
                  className="sr-only"
                />
                <CreditCard className="mb-3 h-6 w-6" />
                Card
              </Label>
            </RadioGroup>
            {paymentMethod === "cash" && (
              <AlertMessage
                title="Pay Cash within 6 hours"
                description="Otherwise your booking will be removed."
              />
            )}

            {paymentMethod === "card" && (
              <AlertMessage
                title="Instant Confirmation"
                description="Booking will be confirmed after payment"
                color="green"
              />
            )}
          </CardContent>
          <CardFooter>
            <Button
              className="w-full"
              onClick={handleBookingUpdate}
              disabled={checkoutLoading}
            >
              <CreditCard className="mr-2 h-4 w-4" />{" "}
              {paymentMethod === "card" ? "Pay with Card" : "Confirm"}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default PaymentMethod;
