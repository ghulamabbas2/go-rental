import React, { useEffect } from "react";
import AdminLayout from "../AdminLayout";

import { Button } from "../../ui/button";
import {
  Card,
  CardContent,
  CardDescription,
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
  errorToast,
  errorWrapper,
  parseTimestampDate,
} from "src/utils/helpers";
import { useMutation, useQuery } from "@apollo/client";
import { Trash2 } from "lucide-react";

import { ICoupon } from "@go-rental/shared";
import LoadingSpinner from "src/components/layout/LoadingSpinner";
import { GET_CAR_COUPONS } from "src/graphql/queries/coupon.queries";
import { useParams } from "react-router-dom";
import { CouponDialog } from "./CouponDialog";
import { DELETE_COUPON_MUTATION } from "src/graphql/mutations/coupon.mutations";

const ListCoupons = () => {
  const params = useParams();

  const { error, data, loading, refetch } = useQuery(GET_CAR_COUPONS, {
    variables: {
      carId: params?.id,
    },
  });

  const coupons = data?.getAllCoupons;

  const [deleteCoupon, { loading: deleteLoading, error: deleteError }] =
    useMutation(DELETE_COUPON_MUTATION, {
      onCompleted: () => {
        refetch();
      },
    });

  useEffect(() => {
    if (error) errorToast(error);

    if (deleteError) errorToast(deleteError);
  }, [error, deleteError]);

  const deleteCouponHandler = async (id: string) => {
    await errorWrapper(async () => {
      await deleteCoupon({
        variables: { couponId: id },
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
                    <CardTitle>Coupons</CardTitle>
                    <CardDescription>
                      View and manage all Coupons in the system
                    </CardDescription>
                  </div>
                  <div className="relative ml-auto flex-1 md:grow-0">
                    <CouponDialog carId={params?.id} refetchCoupons={refetch} />
                  </div>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="hidden w-[100px] sm:table-cell">
                          Name
                        </TableHead>
                        <TableHead>Code</TableHead>
                        <TableHead>Dicount</TableHead>
                        <TableHead>Expiry</TableHead>
                        <TableHead className="hidden md:table-cell">
                          Created At
                        </TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {coupons?.map((coupon: ICoupon) => (
                        <TableRow key={coupon?.id}>
                          <TableCell className="hidden sm:table-cell">
                            {coupon?.name}
                          </TableCell>
                          <TableCell className="font-medium">
                            {coupon?.code}
                          </TableCell>
                          <TableCell className="font-medium">
                            {coupon?.discountPercent}%
                          </TableCell>
                          <TableCell className="font-medium">
                            {parseTimestampDate(coupon?.expiry?.toString())}
                          </TableCell>
                          <TableCell className="hidden md:table-cell">
                            {parseTimestampDate(coupon?.createdAt)}
                          </TableCell>
                          <TableCell className="w-[120px]">
                            {loading ? (
                              <p>loading...</p>
                            ) : (
                              <CouponDialog
                                updateCouponData={coupon}
                                refetchCoupons={refetch}
                              />
                            )}
                            <Button
                              variant="destructive"
                              className="ms-2"
                              size="icon"
                              disabled={deleteLoading}
                              onClick={() => deleteCouponHandler(coupon?.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </main>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default ListCoupons;
