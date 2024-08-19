import React from "react";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { AlertCircle, CircleCheckBig } from "lucide-react";

type Props = {
  title: string;
  description: string;
  color?: string;
};

const AlertMessage = ({ title, description, color = "red" }: Props) => {
  return (
    <Alert
      variant="destructive"
      className={color === "green" ? "text-green-800 border-green-800" : ""}
    >
      {color === "red" ? (
        <AlertCircle color={color} className="h-4 w-4" />
      ) : (
        <CircleCheckBig color={color} className="h-4 w-4" />
      )}
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription>{description}</AlertDescription>
    </Alert>
  );
};

export default AlertMessage;
