import { Button } from "../../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../ui/dialog";
import { Label } from "../../ui/label";
import { useEffect, useState } from "react";
import {
  errorToast,
  errorWrapper,
  parseTimestampDate,
} from "src/utils/helpers";
import { useMutation } from "@apollo/client";
import LoadingSpinner from "../../layout/LoadingSpinner";
import { IBooking } from "@go-rental/shared";
import { Pencil } from "lucide-react";
import { Table, TableBody, TableCell, TableRow } from "src/components/ui/table";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "src/components/ui/select";
import { UPDATE_BOOKING_MUTATION } from "src/graphql/mutations/booking.mutations";

type Props = {
  updateBookingData: IBooking;
  refetchBookings: () => void;
};

export function BookingDialog({ updateBookingData, refetchBookings }: Props) {
  const [paymentStatus, setPaymentStatus] = useState(
    updateBookingData?.paymentInfo?.status
  );
  const [paymentMethod, setPaymentMethod] = useState(
    updateBookingData?.paymentInfo?.method
  );

  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const [updateBooking, { loading, error }] = useMutation(
    UPDATE_BOOKING_MUTATION,
    {
      onCompleted: () => {
        setIsDialogOpen(false);
        refetchBookings();
      },
    }
  );

  useEffect(() => {
    if (error) errorToast(error);
  }, [error]);

  const submitHandler = async () => {
    const bookingInput = {
      paymentInfo: {
        status: paymentStatus,
        method: paymentMethod,
      },
    };
    await errorWrapper(async () => {
      await updateBooking({
        variables: { bookingId: updateBookingData?.id, bookingInput },
      });
    });
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button
          variant={"outline"}
          size={"icon"}
          onClick={() => setIsDialogOpen(true)}
        >
          <Pencil className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Update Booking</DialogTitle>
          <DialogDescription>Update Booking details here</DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <Table>
            <TableBody>
              <TableRow>
                <TableCell>Car</TableCell>
                <TableCell>
                  <>
                    {updateBookingData?.car?.name}
                    <p className="text-xs text-gray-400">
                      {updateBookingData?.car?.id}
                    </p>
                  </>
                </TableCell>
              </TableRow>

              <TableRow>
                <TableCell>User</TableCell>
                <TableCell>
                  <>
                    {updateBookingData?.user?.name}
                    <p className="text-xs text-gray-400">
                      {updateBookingData?.user?.id}
                    </p>
                  </>
                </TableCell>
              </TableRow>

              <TableRow>
                <TableCell>Start Date</TableCell>
                <TableCell>
                  {parseTimestampDate(updateBookingData?.startDate?.toString())}
                </TableCell>
              </TableRow>

              <TableRow>
                <TableCell>End Date</TableCell>
                <TableCell>
                  {parseTimestampDate(updateBookingData?.endDate?.toString())}
                </TableCell>
              </TableRow>

              <TableRow>
                <TableCell>Days Of Rent</TableCell>
                <TableCell>{updateBookingData?.daysOfRent}</TableCell>
              </TableRow>

              <TableRow>
                <TableCell>Total Amount</TableCell>
                <TableCell>${updateBookingData?.amount?.total}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
        <div className="grid gap-6 py-3">
          <div className="grid gap-3">
            <Label>Booking Status</Label>
            <Select
              value={paymentStatus}
              onValueChange={(value) => setPaymentStatus(value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a status" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Payment Status</SelectLabel>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="paid">Paid</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-3">
            <Label>Payment Method</Label>
            <Select
              value={paymentMethod}
              onValueChange={(value) => setPaymentMethod(value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a payment method" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Payment Method</SelectLabel>
                  <SelectItem value="cash">Cash</SelectItem>
                  <SelectItem value="card">Card</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button onClick={submitHandler} disabled={loading}>
            {loading ? <LoadingSpinner /> : "Update"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
