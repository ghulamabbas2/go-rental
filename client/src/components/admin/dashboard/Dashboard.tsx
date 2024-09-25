import { CircleDotDashed, Coins, DollarSign, ReceiptText } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import { DropdownMenuSeparator } from "../../ui/dropdown-menu";
import AdminLayout from "../AdminLayout";
import { Skeleton } from "../../ui/skeleton";
import { useEffect, useState } from "react";
import { DateRange } from "react-day-picker";
import { CarDatePicker } from "src/components/booking/CarDatePicker";
import { useLazyQuery } from "@apollo/client";
import { GET_DASHBOARD_STATS } from "src/graphql/queries/booking.queries";
import {
  adjustDateToLocalTimeZone,
  errorWrapper,
  formatAmountWithCommas,
} from "src/utils/helpers";
import { DashboardSalesChart } from "./DashboardSalesChart";

const Dashboard = () => {
  const [dates, setDates] = useState<DateRange | undefined>({
    from: new Date(new Date().setDate(1)),
    to: new Date(Date.now()),
  });

  const [getDashboardStats, { data, loading }] = useLazyQuery(
    GET_DASHBOARD_STATS,
    {
      variables: {
        startDate: adjustDateToLocalTimeZone(dates?.from),
        endDate: adjustDateToLocalTimeZone(dates?.to),
      },
    }
  );

  useEffect(() => {
    async function fetchData() {
      await errorWrapper(async () => {
        await getDashboardStats({
          variables: {
            startDate: adjustDateToLocalTimeZone(dates?.from),
            endDate: adjustDateToLocalTimeZone(dates?.to),
          },
        });
      });
    }

    fetchData();
  }, [dates, getDashboardStats]);

  const stats = data?.getDashboardStats;

  return (
    <AdminLayout>
      <div className="flex flex-col">
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
          <div className="flex items-center">
            <h1 className="text-lg font-semibold md:text-2xl">Dashboard</h1>
          </div>
          <div className="flex justify-end">
            <CarDatePicker
              dates={dates}
              onDateChange={(date) => setDates(date)}
              disabledBefore={false}
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Sales
                </CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {loading ? (
                    <Skeleton className="h-8 w-full" />
                  ) : (
                    <>${formatAmountWithCommas(stats?.totalSales)}</>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">
                  (Paid, Pending, Cash)
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Bookings</CardTitle>
                <ReceiptText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {loading ? (
                    <Skeleton className="h-8 w-full" />
                  ) : (
                    <>{formatAmountWithCommas(stats?.totalBookings)}</>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">
                  (Paid, Pending, Cash)
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Pending Amount
                </CardTitle>
                <CircleDotDashed className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {loading ? (
                    <Skeleton className="h-8 w-full" />
                  ) : (
                    <>${formatAmountWithCommas(stats?.totalPendingAmount)}</>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">
                  Booking Amount (Pending, Unpaid)
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Cash</CardTitle>
                <Coins className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {loading ? (
                    <Skeleton className="h-8 w-full" />
                  ) : (
                    <>${formatAmountWithCommas(stats?.totalPaidCash)}</>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">
                  Amount Paid with Cash
                </p>
              </CardContent>
            </Card>
          </div>

          <DropdownMenuSeparator />

          <DashboardSalesChart data={stats?.sales} dates={dates} />
        </main>
      </div>
    </AdminLayout>
  );
};

export default Dashboard;
