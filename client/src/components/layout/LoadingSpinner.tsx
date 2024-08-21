import { LoaderCircle } from "lucide-react";
import React from "react";
import { cn } from "src/lib/utils";

type Props = {
  size?: number;
  className?: string;
  fullScreen?: boolean;
};

const LoadingSpinner = ({
  size = 20,
  className,
  fullScreen = false,
}: Props) => {
  const spinner = (
    <LoaderCircle className={cn("animate-spin", className)} size={size} />
  );

  if (fullScreen) {
    return (
      <div className="flex justify-center items-center h-screen">{spinner}</div>
    );
  }

  return spinner;
};

export default LoadingSpinner;
