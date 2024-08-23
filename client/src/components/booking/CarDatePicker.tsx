import * as React from "react";
import { addDays, format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { DateRange } from "react-day-picker";

import { cn } from "../../lib/utils";
import { Button } from "../ui/button";
import { Calendar } from "../ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { useSearchParams } from "react-router-dom";

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  dates?: DateRange | undefined;
  disabledDates?: [string];
  onDateChange?: (date: DateRange | undefined) => void;
}

export function CarDatePicker({
  className,
  dates,
  disabledDates,
  onDateChange,
}: Props) {
  let [searchParams] = useSearchParams();
  const startDate = searchParams.get("startDate");
  const endDate = searchParams.get("endDate");

  const [date, setDate] = React.useState<DateRange | undefined>({
    from: startDate ? new Date(startDate) : undefined,
    to: endDate ? new Date(endDate) : undefined,
  });

  const handleDateChange = (date: DateRange | undefined) => {
    setDate(date);
    if (onDateChange) {
      onDateChange(date);
    }
  };

  const parsedDisabledDates =
    disabledDates?.map((timestamp) => new Date(parseInt(timestamp))) || [];

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn(
              "justify-start text-left font-normal",
              !date && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, "LLL dd, y")} -{" "}
                  {format(date.to, "LLL dd, y")}
                </>
              ) : (
                format(date.from, "LLL dd, y")
              )
            ) : (
              <span>Pick a date</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={handleDateChange}
            numberOfMonths={2}
            disabled={[...parsedDisabledDates, { before: new Date() }]}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
