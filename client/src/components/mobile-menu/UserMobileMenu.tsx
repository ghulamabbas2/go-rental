import React from "react";
import { Link } from "react-router-dom";

const UserMobileMenu = ({ isAdmin }: { isAdmin: boolean }) => {
  return (
    <div className="grid">
      {isAdmin && (
        <Link
          to="/admin/dashboard"
          className="text-lg font-medium hover:underline underline-offset-4"
        >
          Dashboard
        </Link>
      )}

      <Link
        to="/me/bookings"
        className="text-lg font-medium hover:underline underline-offset-4"
      >
        My Bookings
      </Link>
      <Link
        to="/me/profile"
        className="text-lg font-medium hover:underline underline-offset-4"
      >
        Profile
      </Link>
    </div>
  );
};

export default UserMobileMenu;
