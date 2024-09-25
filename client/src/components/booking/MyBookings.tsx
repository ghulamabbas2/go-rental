import {
  CarFront,
  CreditCard,
  DollarSign,
  ReceiptText,
  Search,
  Users,
} from "lucide-react";

import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";

import React, { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Input } from "../ui/input";
import { useQuery } from "@apollo/client";
import { GET_MY_BOOKINGS } from "src/graphql/queries/booking.queries";
import {
  calculateTablePaginationEnd,
  calculateTablePaginationStart,
  errorToast,
  parseTimestampDate,
} from "src/utils/helpers";
import LoadingSpinner from "../layout/LoadingSpinner";
import { IBooking } from "@go-rental/shared";
import CustomPagination from "../layout/CustomPagination";

const MyBookings = () => {
  const navigate = useNavigate();
  let [searchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState("");

  const query = searchParams.get("query");
  const page = parseInt(searchParams.get("page") || "1", 10);

  const { error, data, loading } = useQuery(GET_MY_BOOKINGS, {
    variables: {
      page,
      query,
    },
  });

  const bookings = data?.myBookings?.bookings;
  const pagination = data?.myBookings?.pagination;

  useEffect(() => {
    if (searchQuery === "") searchParams.delete("query");

    const path = `${window.location.pathname}?${searchParams.toString()}`;
    navigate(path);
  }, [searchQuery]);

  useEffect(() => {
    if (error) errorToast(error);
  }, [error]);

  const submitHandler = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    navigate(`/me/bookings?query=${searchQuery}`);
  };

  if (loading) {
    return <LoadingSpinner fullScreen={true} size={60} />;
  }

  return (
    <div>
      <div className="flex min-h-screen w-full flex-col bg-muted/40">
        <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
          <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
            <h1 className="text-3xl font-bold mt-5">Your Bookings Stats</h1>
            <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-3">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Amount
                  </CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    ${data?.myBookings?.totalAmount?.toFixed(2)}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Total Amount you spent on Bookings
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Bookings
                  </CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {data?.myBookings?.totalBookings}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Total No of Cars you booked for rental
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Unpaid Bookings
                  </CardTitle>
                  <CreditCard className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {data?.myBookings?.totalUnpaidBookings}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    No of Bookings, you have not paid for
                  </p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader className="flex flex-col md:flex-row mb-4">
                <div className="flex-1">
                  <CardTitle>Bookings</CardTitle>
                  <CardDescription>View your booking details</CardDescription>
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
                        Image
                      </TableHead>
                      <TableHead>Car</TableHead>
                      <TableHead>Booking ID</TableHead>
                      <TableHead className="hidden md:table-cell">
                        Payment Status
                      </TableHead>
                      <TableHead className="hidden md:table-cell">
                        Total Amount
                      </TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {bookings?.map((booking: IBooking) => (
                      <TableRow>
                        <TableCell className="hidden sm:table-cell">
                          {booking?.car?.images[0]?.url ? (
                            <img
                              src={booking?.car?.images[0]?.url}
                              alt="Car Thumbnail"
                              className="aspect-square rounded-md object-cover"
                              height={"60"}
                              width={"60"}
                            />
                          ) : (
                            <CarFront color="gray" className="h-8 w-8" />
                          )}
                        </TableCell>
                        <TableCell className="font-medium">
                          {booking?.car?.name}
                        </TableCell>
                        <TableCell className="font-medium">
                          {booking?.id}
                          <p className="font-thin text-sm">
                            {parseTimestampDate(booking?.createdAt)}
                          </p>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {booking?.paymentInfo?.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          ${booking?.amount.total}
                        </TableCell>
                        <TableCell>
                          {booking?.paymentInfo?.status === "pending" && (
                            <Link to={`/booking/${booking?.id}/payment_method`}>
                              <Button>
                                <CreditCard className="mr-2 h-4 w-4" /> Pay
                              </Button>
                            </Link>
                          )}

                          {booking?.paymentInfo?.status === "paid" && (
                            <Link to={`/booking/invoice/${booking?.id}`}>
                              <Button className="ml-2">
                                <ReceiptText className="mr-2 h-4 w-4" /> Invoice
                              </Button>
                            </Link>
                          )}
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
    </div>
  );
};

export default MyBookings;
