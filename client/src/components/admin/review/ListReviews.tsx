import React, { useEffect, useState } from "react";
import AdminLayout from "../AdminLayout";

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
import { useNavigate, useSearchParams } from "react-router-dom";
import { useMutation, useQuery } from "@apollo/client";
import { Search, Trash2 } from "lucide-react";
import { Input } from "src/components/ui/input";
import { IReview } from "@go-rental/shared";
import CustomPagination from "src/components/layout/CustomPagination";
import LoadingSpinner from "src/components/layout/LoadingSpinner";
import { GET_ALL_REVIEWS } from "src/graphql/queries/review.queries";
import { DELETE_REVIEW_MUTATION } from "src/graphql/mutations/review.mutations";

const ListReviews = () => {
  const navigate = useNavigate();
  let [searchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState("");

  const query = searchParams.get("car");
  const page = parseInt(searchParams.get("page") || "1", 10);

  const { error, data, loading, refetch } = useQuery(GET_ALL_REVIEWS, {
    variables: {
      page,
      ...(query && { query }),
    },
  });

  const reviews = data?.getAllReviews?.reviews;
  const pagination = data?.getAllReviews?.pagination;

  const [deleteReview, { loading: deleteLoading, error: deleteError }] =
    useMutation(DELETE_REVIEW_MUTATION, {
      onCompleted: () => {
        refetch();
      },
    });

  useEffect(() => {
    if (searchQuery === "") searchParams.delete("car");

    const path = `${window.location.pathname}?${searchParams.toString()}`;
    navigate(path);
  }, [searchQuery]);

  useEffect(() => {
    if (error) errorToast(error);

    if (deleteError) errorToast(deleteError);
  }, [error, deleteError]);

  const submitHandler = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    navigate(`/admin/reviews?car=${searchQuery}`);
  };

  const deleteReviewHandler = async (id: string) => {
    await errorWrapper(async () => {
      await deleteReview({
        variables: { reviewId: id },
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
                    <CardTitle>Reviews</CardTitle>
                    <CardDescription>
                      View and manage all reviews in the system
                    </CardDescription>
                  </div>
                  <form onSubmit={submitHandler}>
                    <div className="relative ml-auto flex-1 md:grow-0">
                      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="search"
                        placeholder="Enter Car ID"
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
                        <TableHead>Comment</TableHead>
                        <TableHead>Rating</TableHead>
                        <TableHead className="hidden md:table-cell">
                          Car
                        </TableHead>
                        <TableHead className="hidden md:table-cell">
                          Created At
                        </TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {reviews?.map((review: IReview) => (
                        <TableRow key={review?.id}>
                          <TableCell className="hidden sm:table-cell">
                            {review?.id}
                          </TableCell>
                          <TableCell className="font-medium">
                            {review?.comment}
                          </TableCell>
                          <TableCell className="font-medium">
                            {review?.rating}
                          </TableCell>
                          <TableCell className="font-medium">
                            {review?.car?.name}
                          </TableCell>
                          <TableCell className="hidden md:table-cell">
                            {parseTimestampDate(review?.createdAt)}
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="destructive"
                              className="ms-2"
                              size="icon"
                              disabled={deleteLoading}
                              onClick={() => deleteReviewHandler(review?.id)}
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
                      of <strong>{pagination?.totalCount}</strong> reviews
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

export default ListReviews;
