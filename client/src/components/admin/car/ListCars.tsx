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
import { GET_ALL_CARS } from "src/graphql/queries/car.queries";
import {
  CarFront,
  Pencil,
  PlusCircle,
  Search,
  Tags,
  Trash2,
} from "lucide-react";
import { Input } from "src/components/ui/input";
import { ICar } from "@go-rental/shared";
import CustomPagination from "src/components/layout/CustomPagination";
import LoadingSpinner from "src/components/layout/LoadingSpinner";
import { DELETE_CAR_MUTATION } from "src/graphql/mutations/car.mutations";

const ListCars = () => {
  const navigate = useNavigate();
  let [searchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState("");

  const query = searchParams.get("query");
  const page = parseInt(searchParams.get("page") || "1", 10);

  const { error, data, loading, refetch } = useQuery(GET_ALL_CARS, {
    variables: {
      page,
      query,
    },
  });

  const cars = data?.getAllCars?.cars;
  const pagination = data?.getAllCars?.pagination;

  const [deleteCar, { loading: deleteLoading, error: deleteError }] =
    useMutation(DELETE_CAR_MUTATION, {
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

    navigate(`/admin/cars?query=${searchQuery}`);
  };

  const deleteCarHandler = async (id: string) => {
    await errorWrapper(async () => {
      await deleteCar({
        variables: { carId: id },
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
              <div className="flex items-center">
                <div className="ml-auto flex items-center gap-2">
                  <Link to="/admin/cars/new">
                    <Button size={"sm"} className="h-8 gap-1">
                      <PlusCircle className="h-3.5 w-3.5" />
                      <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                        Add New Car
                      </span>
                    </Button>
                  </Link>
                </div>
              </div>
              <Card>
                <CardHeader className="flex flex-col md:flex-row mb-4">
                  <div className="flex-1">
                    <CardTitle>Cars</CardTitle>
                    <CardDescription>
                      View and manage all cars in the system
                    </CardDescription>
                  </div>
                  <form onSubmit={submitHandler}>
                    <div className="relative ml-auto flex-1 md:grow-0">
                      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="search"
                        placeholder="Enter Car ID or keyword"
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
                        <TableHead>Name</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead className="hidden md:table-cell">
                          Rent Per Day
                        </TableHead>
                        <TableHead className="hidden md:table-cell">
                          Created At
                        </TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {cars?.map((car: ICar) => (
                        <TableRow key={car?.id}>
                          <TableCell className="hidden sm:table-cell">
                            {car?.images[0]?.url ? (
                              <img
                                src={car?.images[0]?.url}
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
                            {car?.name}
                          </TableCell>
                          <TableCell className="font-medium">
                            <Badge variant="outline">{car?.category}</Badge>
                          </TableCell>
                          <TableCell>${car?.rentPerDay}</TableCell>
                          <TableCell className="hidden md:table-cell">
                            {parseTimestampDate(car?.createdAt)}
                          </TableCell>
                          <TableCell>
                            <Link to={`/admin/cars/${car?.id}`}>
                              <Button
                                variant="outline"
                                className="ms-2"
                                size="icon"
                              >
                                <Pencil className="h-4 w-4" />
                              </Button>
                            </Link>
                            <Link to={`/admin/coupons/${car?.id}`}>
                              <Button className="ms-2" size="icon">
                                <Tags className="h-4 w-4" />
                              </Button>
                            </Link>
                            <Button
                              variant="destructive"
                              className="ms-2"
                              size="icon"
                              disabled={deleteLoading}
                              onClick={() => deleteCarHandler(car?.id)}
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

export default ListCars;
