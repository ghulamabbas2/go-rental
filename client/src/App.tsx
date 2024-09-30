import React, { useEffect } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./components/Home";
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import CarDetails from "./components/car/CarDetails";
import Register from "./components/auth/Register";
import Login from "./components/auth/Login";
import Profile from "./components/user/Profile";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import Dashboard from "./components/admin/dashboard/Dashboard";
import ForgotPassword from "./components/auth/ForgotPassword";
import ResetPassword from "./components/auth/ResetPassword";
import PaymentMethod from "./components/payment/PaymentMethod";
import MyBookings from "./components/booking/MyBookings";
import Invoice from "./components/invoice/Invoice";
import Search from "./components/search/Search";
import ListCars from "./components/admin/car/ListCars";
import NewCar from "./components/admin/car/NewCar";
import UpdateCar from "./components/admin/car/UpdateCar";
import ListBookings from "./components/admin/booking/ListBookings";
import ListUsers from "./components/admin/user/ListUsers";
import ListReviews from "./components/admin/review/ListReviews";
import ListFaqs from "./components/admin/faq/ListFaqs";
import ListCoupons from "./components/admin/coupon/ListCoupons";
import { useReactiveVar, useSubscription } from "@apollo/client";
import { NEW_BOOKING_SUBSCRIPTION } from "./graphql/subscriptions/booking.subscriptions";
import { userVar } from "./apollo/apollo-vars";
import { toast } from "./components/ui/use-toast";
import NotFound from "./components/layout/NotFound";

function App() {
  const { data, error } = useSubscription(NEW_BOOKING_SUBSCRIPTION);

  const user = useReactiveVar(userVar);

  useEffect(() => {
    if (data && user?.role?.includes("admin")) {
      toast({
        title: `New Booking Worth: $${data?.newBookingAlert?.amount}`,
        description: data?.newBookingAlert?.car,
      });
    }
  }, [data, user]);

  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/car/:id" element={<CarDetails />} />
        <Route path="/search" element={<Search />} />

        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/password/forgot" element={<ForgotPassword />} />
        <Route path="/password/reset/:token" element={<ResetPassword />} />

        <Route
          path="/me/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

        <Route
          path="/me/bookings"
          element={
            <ProtectedRoute>
              <MyBookings />
            </ProtectedRoute>
          }
        />

        <Route
          path="/booking/:id/payment_method"
          element={
            <ProtectedRoute>
              <PaymentMethod />
            </ProtectedRoute>
          }
        />

        <Route
          path="/booking/invoice/:id"
          element={
            <ProtectedRoute>
              <Invoice />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute requiredRoles={["admin"]}>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/cars"
          element={
            <ProtectedRoute requiredRoles={["admin"]}>
              <ListCars />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/cars/new"
          element={
            <ProtectedRoute requiredRoles={["admin"]}>
              <NewCar />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/cars/:id"
          element={
            <ProtectedRoute requiredRoles={["admin"]}>
              <UpdateCar />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/bookings"
          element={
            <ProtectedRoute requiredRoles={["admin"]}>
              <ListBookings />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/users"
          element={
            <ProtectedRoute requiredRoles={["admin"]}>
              <ListUsers />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/reviews"
          element={
            <ProtectedRoute requiredRoles={["admin"]}>
              <ListReviews />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/faqs"
          element={
            <ProtectedRoute requiredRoles={["admin"]}>
              <ListFaqs />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/coupons/:id"
          element={
            <ProtectedRoute requiredRoles={["admin"]}>
              <ListCoupons />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<NotFound />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
