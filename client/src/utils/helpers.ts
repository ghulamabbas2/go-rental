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
