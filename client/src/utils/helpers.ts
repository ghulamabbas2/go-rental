import { IReview } from "@go-rental/shared";
import { queryAllByAltText } from "@testing-library/react";
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

export const calculateAmount = (
  rentPerDay: number,
  daysOfRent: number,
  couponDiscount: number
) => {
  const rent = rentPerDay * daysOfRent;
  const tax = rent * 0.15;
  const discountValue = (rent * couponDiscount) / 100;
  const discountedAmount = rent - discountValue;

  const total = tax + discountedAmount;

  return {
    tax,
    rent,
    discount: discountedAmount,
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

export const generateSvg = (
  price: string
) => `<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 80 60" fill="none">
  <rect width="80" height="50" rx="10" fill="#1c1b1b"/>
  <path d="M40 60L30 50H50L40 60Z" fill="#1c1b1b"/>
  <text x="50%" y="35"
        text-anchor="middle" fill="#FFF"
        font-size="30px" font-family="sans-serif" font-weight="bold">
        $${price}
  </text>
</svg>`;

export const isValidQueryValue = (value: string) => {
  return value !== undefined && value !== null && value !== "";
};

export const formatQueryParam = (key: string, value: string) => {
  return `${encodeURIComponent(key)}=${encodeURIComponent(value)}`;
};

export const buildQueryString = (queries: object) => {
  return Object.entries(queries)
    .filter(([_, value]) => isValidQueryValue(value))
    .map(([key, value]) => formatQueryParam(key, value))
    .join("&");
};

export const findReviewByUserId = (reviews: IReview[], userId: string) => {
  return reviews.find((review) => review.user.id === userId);
};

export const formatAmountWithCommas = (amount: number) => {
  return new Intl.NumberFormat("en-US").format(amount);
};
