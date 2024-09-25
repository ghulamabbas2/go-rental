import React from "react";
import { Link } from "react-router-dom";

const AdminMobileMenu = () => {
  return (
    <div className="grid">
      <Link
        to="/admin/dashboard"
        className="text-lg font-medium hover:underline underline-offset-4"
      >
        Dashboard
      </Link>
      <Link
        to="/admin/bookings"
        className="text-lg font-medium hover:underline underline-offset-4"
      >
        Bookings
      </Link>
      <Link
        to="/admin/cars"
        className="text-lg font-medium hover:underline underline-offset-4"
      >
        Cars
      </Link>
      <Link
        to="/admin/users"
        className="text-lg font-medium hover:underline underline-offset-4"
      >
        Users
      </Link>

      <Link
        to="/admin/reviews"
        className="text-lg font-medium hover:underline underline-offset-4"
      >
        Reviews
      </Link>

      <Link
        to="/admin/faqs"
        className="text-lg font-medium hover:underline underline-offset-4"
      >
        FAQs
      </Link>
    </div>
  );
};

export default AdminMobileMenu;
