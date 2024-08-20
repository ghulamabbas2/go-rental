import { useReactiveVar } from "@apollo/client";
import React from "react";
import {
  isAuthenticatedVar,
  isLoadingVar,
  userVar,
} from "src/apollo/apollo-vars";
import LoadingSpinner from "../layout/LoadingSpinner";
import { Navigate } from "react-router-dom";

type Props = {
  requiredRoles?: string[];
  children: React.ReactNode;
};

const ProtectedRoute = ({ requiredRoles, children }: Props) => {
  const isLoading = useReactiveVar(isLoadingVar);
  const isAuthenticated = useReactiveVar(isAuthenticatedVar);
  const user = useReactiveVar(userVar);

  if (isLoading) {
    return <LoadingSpinner fullScreen={true} size={60} />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (
    requiredRoles &&
    !requiredRoles.some((role: string) => user?.role?.includes(role))
  ) {
    return <Navigate to="/" />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
