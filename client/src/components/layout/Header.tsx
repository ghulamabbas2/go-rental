import { Link } from "react-router-dom";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetTitle,
  SheetHeader,
  SheetDescription,
} from "../ui/sheet";
import { Button } from "../ui/button";
import { CarTaxiFront, MenuIcon } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
// import AdminMobileMenu from "../mobile-menu/AdminMobileMenu";

const Header = () => {
  return (
    <div className="flex items-center justify-between px-5 py-2 bg-white dark:bg-gray-800 border">
      <Link to="/" className="flex items-center gap-2">
        <CarTaxiFront className="h-8 w-8" />
        <span className="text-lg font-semibold">Go Rental</span>
      </Link>
      <div className="hidden lg:flex gap-4 mr-1">
        <Button className="mb-2" asChild>
          <Link to="/login">Login</Link>
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="overflow-hidden rounded-full"
            >
              <div className="flex items-center">
                <Avatar className="h-10 w-10">
                  <AvatarImage src="path/to/avatar.jpg" />
                  <AvatarFallback>AB</AvatarFallback>
                </Avatar>
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <Link to="/admin/dashboard">
              <DropdownMenuItem>Dashboard</DropdownMenuItem>
            </Link>
            <Link to="/me/bookings">
              <DropdownMenuItem>My Bookings</DropdownMenuItem>
            </Link>
            <Link to="/me/profile">
              <DropdownMenuItem>Profile</DropdownMenuItem>
            </Link>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Logout</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="lg:hidden">
            <MenuIcon className="h-6 w-6" />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left">
          <SheetTitle />
          <SheetHeader>
            <SheetDescription />
          </SheetHeader>
          <div className="grid w-[250px] p-4">
            <div className="flex items-center mb-3">
              <span className="me-4"></span>
              <Button asChild>
                <Link to="/login">Login</Link>
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="overflow-hidden rounded-full"
              >
                <div className="flex items-center">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src="path/to/avatar.jpg" />
                    <AvatarFallback>AB</AvatarFallback>
                  </Avatar>
                </div>
              </Button>
              <p className="ps-2">User Name</p>
            </div>
            {/* <AdminMobileMenu /> */}
            <DropdownMenuSeparator />
            <Link
              to="#"
              className="text-lg font-medium hover:underline underline-offset-4"
            >
              Logout
            </Link>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default Header;
