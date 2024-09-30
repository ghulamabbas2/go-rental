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
import { useState } from "react";
import { errorWrapper, parseTimestampDate } from "src/utils/helpers";
import { useMutation } from "@apollo/client";
import LoadingSpinner from "../../layout/LoadingSpinner";
import { ICoupon } from "@go-rental/shared";
import { CalendarIcon, Pencil } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../ui/form";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { CreateCouponSchema } from "src/zod-schemas/coupon.schemas";
import {
  CREATE_COUPON_MUTATION,
  UPDATE_COUPON_MUTATION,
} from "src/graphql/mutations/coupon.mutations";
import { Input } from "src/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "src/components/ui/popover";
import { format } from "date-fns";
import { Calendar } from "src/components/ui/calendar";

type Props = {
  carId?: string;
  updateCouponData?: ICoupon;
  refetchCoupons: () => void;
};

export function CouponDialog({
  carId,
  updateCouponData,
  refetchCoupons,
}: Props) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const defaultValues = updateCouponData
    ? {
        ...updateCouponData,
        expiry: new Date(
          parseTimestampDate(updateCouponData.expiry?.toString())
        ),
      }
    : {
        name: "",
        code: "",
        discountPercent: 0,
        expiry: new Date(),
      };

  const form = useForm<z.infer<typeof CreateCouponSchema>>({
    resolver: zodResolver(CreateCouponSchema),
    defaultValues,
  });

  const [createCoupon, { loading: createLoading }] = useMutation(
    CREATE_COUPON_MUTATION,
    {
      onCompleted: () => {
        setIsDialogOpen(false);
        refetchCoupons();
        form.reset();
      },
    }
  );

  const [updateCoupon, { loading: updateLoading }] = useMutation(
    UPDATE_COUPON_MUTATION,
    {
      onCompleted: () => {
        setIsDialogOpen(false);
        refetchCoupons();
      },
    }
  );

  const submitHandler = async (data: z.infer<typeof CreateCouponSchema>) => {
    const couponInput = {
      name: data.name,
      code: data.code,
      discountPercent: data.discountPercent,
      expiry: data.expiry,
    };

    if (updateCouponData?.id) {
      await errorWrapper(async () => {
        await updateCoupon({
          variables: { couponInput, couponId: updateCouponData.id },
        });
      });
    } else {
      await errorWrapper(async () => {
        await createCoupon({
          variables: { couponInput: { ...couponInput, car: carId } },
        });
      });
    }
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        {updateCouponData ? (
          <Button
            variant={"outline"}
            size={"icon"}
            onClick={() => setIsDialogOpen(true)}
          >
            <Pencil className="h-4 w-4" />
          </Button>
        ) : (
          <Button onClick={() => setIsDialogOpen(true)}>
            Create New Coupon
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(submitHandler)}>
            <DialogHeader>
              <DialogTitle>
                {updateCouponData ? "Edit Coupon" : "Create New Coupon"}
              </DialogTitle>
              <DialogDescription>
                {updateCouponData
                  ? " Update Coupon details here"
                  : "Create New Coupon here"}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter coupon name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Coupon Code</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter Coupon Code" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="discountPercent"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Dicount Percentage</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Enter Dicount Percentage"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="expiry"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Coupon Expiry Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button variant={"outline"}>
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick Expiry Date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter>
              <Button type="submit" disabled={createLoading || updateLoading}>
                {createLoading || updateLoading ? (
                  <LoadingSpinner />
                ) : updateCouponData ? (
                  "Update"
                ) : (
                  "Create"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
