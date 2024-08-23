import { format } from "date-fns";
import { toast } from "src/components/ui/use-toast";

export const updateSearchParams = (
  searchParams: URLSearchParams,
  key: string,
  value: string
) => {
  if (searchParams.has(key)) {
    searchParams.set(key, value);
  } else {
    searchParams.append(key, value);
  }

  return searchParams;
};

export const errorToast = (error: any) => {
  const errMessage = error?.cause?.result?.errors[0]?.message || error?.message;
  toast({
    variant: "destructive",
    title: "Something went wrong.",
    description: errMessage || "An unexpected error occured.",
  });
};

export const errorWrapper = async (fn: Function) => {
  try {
    return await fn();
  } catch (error: any) {
    const errMessage =
      error?.cause?.result?.errors[0]?.message || error?.message;

    toast({
      variant: "destructive",
      title: "Something went wrong.",
      description: errMessage || "An unexpected error occurred.",
    });
  }
};

export const getUserNameInitials = (fullName: string) => {
  const names = fullName.split(" ");
  if (names.length > 1) {
    return `${names[0].charAt(0)}${names[1].charAt(0)}`;
  } else if (names.length === 1) {
    return names[0].charAt(0);
  }
  return "";
};

export const calculateAmount = (rentPerDay: number, daysOfRent: number) => {
  const rent = rentPerDay * daysOfRent;
  const tax = rent * 0.15;
  const discount = 0;
  const total = rent + tax - discount;

  return {
    tax,
    rent,
    discount,
    total,
  };
};

export const adjustDateToLocalTimeZone = (date: Date | undefined) => {
  if (!date) return null;

  const localDate = new Date(date);
  localDate.setMinutes(date.getMinutes() - date.getTimezoneOffset());

  return localDate;
};

export const formatDate = (date: Date | string) => {
  if (typeof date === "string") {
    date = new Date(parseInt(date));
  }
  return format(date, "yyyy-MM-dd");
};

export const getAllDatesBetween = (startDate: Date, endDate: Date) => {
  const dates = [];
  let currentDate = new Date(startDate);

  while (currentDate <= endDate) {
    dates.push(formatDate(new Date(currentDate)));
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return dates;
};

export const parseTimestampDate = (date: string) => {
  return new Date(parseInt(date?.toString())).toLocaleString();
};

export const calculateTablePaginationStart = (
  currentPage: number,
  resPerPage: number
) => {
  const start = (currentPage - 1) * resPerPage + 1;
  return start;
};

export const calculateTablePaginationEnd = (
  currentPage: number,
  resPerPage: number,
  totalCount: number
) => {
  const end = Math.min(currentPage * resPerPage, totalCount);
  return end;
};
