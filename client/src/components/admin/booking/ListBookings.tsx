import React, { useEffect, useState } from "react";
import AdminLayout from "../AdminLayout";

import { Badge } from "../../ui/badge";
import { Button } from "../../ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../ui/card";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../ui/table";
import {
  calculateTablePaginationEnd,
  calculateTablePaginationStart,
  errorToast,
  errorWrapper,
  parseTimestampDate,
} from "src/utils/helpers";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useMutation, useQuery } from "@apollo/client";
import { Pencil, ReceiptText, Search, Trash2 } from "lucide-react";
import { Input } from "src/components/ui/input";
import { IBooking } from "@go-rental/shared";
import CustomPagination from "src/components/layout/CustomPagination";
import LoadingSpinner from "src/components/layout/LoadingSpinner";
import { GET_ALL_BOOKINGS } from "src/graphql/queries/booking.queries";
import { BookingDialog } from "./BookingDialog";
import { DELETE_BOOKING_MUTATION } from "src/graphql/mutations/booking.mutations";

const ListBookings = () => {
  const navigate = useNavigate();
  let [searchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState("");

  const query = searchParams.get("query");
  const page = parseInt(searchParams.get("page") || "1", 10);

  const { error, data, loading, refetch } = useQuery(GET_ALL_BOOKINGS, {
    variables: {
      page,
      query,
    },
  });

  const bookings = data?.getAllBookings?.bookings;
  const pagination = data?.getAllBookings?.pagination;

  const [deleteBooking, { loading: deleteLoading, error: deleteError }] =
    useMutation(DELETE_BOOKING_MUTATION, {
      onCompleted: () => {
        refetch();
      },
    });

  useEffect(() => {
    if (searchQuery === "") searchParams.delete("query");

    const path = `${window.location.pathname}?${searchParams.toString()}`;
    navigate(path);
  }, [searchQuery]);

  useEffect(() => {
    if (error) errorToast(error);

    if (deleteError) errorToast(deleteError);
  }, [error, deleteError]);

  const submitHandler = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    navigate(`/admin/bookings?query=${searchQuery}`);
  };

  const deleteBookingHandler = async (id: string) => {
    await errorWrapper(async () => {
      await deleteBooking({
        variables: { bookingId: id },
      });
    });
  };

  return (
    <AdminLayout>
      {loading ? (
        <LoadingSpinner fullScreen={true} size={60} />
      ) : (
        <div className="flex min-h-screen w-full flex-col bg-muted/40">
          <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
            <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
              <Card>
                <CardHeader className="flex flex-col md:flex-row mb-4">
                  <div className="flex-1">
                    <CardTitle>Bookings</CardTitle>
                    <CardDescription>
                      View and manage all bookings in the system
                    </CardDescription>
                  </div>
                  <form onSubmit={submitHandler}>
                    <div className="relative ml-auto flex-1 md:grow-0">
                      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="search"
                        placeholder="Enter Booking ID"
                        className="w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[336px]"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>
                  </form>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="hidden w-[100px] sm:table-cell">
                          ID
                        </TableHead>
                        <TableHead>Car Name</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="hidden md:table-cell">
                          Amount
                        </TableHead>
                        <TableHead className="hidden md:table-cell">
                          Created At
                        </TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {bookings?.map((booking: IBooking) => (
                        <TableRow key={booking?.id}>
                          <TableCell className="hidden sm:table-cell">
                            {booking?.id}
                          </TableCell>
                          <TableCell className="font-medium">
                            {booking?.car?.name}
                          </TableCell>
                          <TableCell className="font-medium">
                            <Badge variant="outline">
                              {booking?.paymentInfo?.status}
                            </Badge>
                          </TableCell>
                          <TableCell>${booking?.amount?.total}</TableCell>
                          <TableCell className="hidden md:table-cell">
                            {parseTimestampDate(booking?.createdAt)}
                          </TableCell>
                          <TableCell>
                            <BookingDialog
                              updateBookingData={booking}
                              refetchBookings={refetch}
                            />
                            <Link to={`/booking/invoice/${booking?.id}`}>
                              <Button className="ms-2" size="icon">
                                <ReceiptText className="h-4 w-4" />
                              </Button>
                            </Link>
                            <Button
                              variant="destructive"
                              className="ms-2"
                              size="icon"
                              disabled={deleteLoading}
                              onClick={() => deleteBookingHandler(booking?.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
                {pagination?.totalCount > 0 && (
                  <CardFooter>
                    <div className="text-xs text-muted-foreground">
                      Showing{" "}
                      {calculateTablePaginationStart(
                        page,
                        pagination?.resPerPage
                      )}
                      -
                      {calculateTablePaginationEnd(
                        page,
                        pagination?.resPerPage,
                        pagination?.totalCount
                      )}{" "}
                      of <strong>{pagination?.totalCount}</strong> bookings
                    </div>
                  </CardFooter>
                )}
              </Card>
            </main>
          </div>
          <CustomPagination
            resPerPage={pagination?.resPerPage}
            totalCount={pagination?.totalCount}
          />
        </div>
      )}
    </AdminLayout>
  );
};

export default ListBookings;
