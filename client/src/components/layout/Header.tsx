import { Link, useLocation, useNavigate } from "react-router-dom";
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
import { CURRENT_USER, LOGOUT } from "src/graphql/queries/user.queries";
import { useLazyQuery, useQuery } from "@apollo/client";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Skeleton } from "../ui/skeleton";
import { getUserNameInitials } from "src/utils/helpers";
import UserMobileMenu from "../mobile-menu/UserMobileMenu";
import {
  isAuthenticatedVar,
  userVar,
  isLoadingVar,
} from "src/apollo/apollo-vars";
import AdminMobileMenu from "../mobile-menu/AdminMobileMenu";
import { ModeToggle } from "../theme/ModeToggle";

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const { loading, data } = useQuery(CURRENT_USER, {
    onCompleted: (data) => {
      userVar(data.me);
      isAuthenticatedVar(true);
      isLoadingVar(false);
    },
    onError: () => {
      userVar(null);
      isAuthenticatedVar(false);
      isLoadingVar(false);
    },
  });

  const currentUser = data?.me;

  const [logout] = useLazyQuery(LOGOUT, {
    onCompleted: () => {
      navigate(0);
    },
  });

  const logoutHandler = () => {
    logout();
  };

  return (
    <div className="flex items-center justify-between px-5 py-2 bg-white dark:bg-gray-800 border">
      <Link to="/" className="flex items-center gap-2">
        <CarTaxiFront className="h-8 w-8" />
        <span className="text-lg font-semibold">Go Rental</span>
      </Link>
      <div className="hidden lg:flex gap-4 mr-1">
        {!currentUser && !loading && (
          <Button className="mb-2" asChild>
            <Link to="/login">Login</Link>
          </Button>
        )}
        {currentUser ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="overflow-hidden rounded-full"
              >
                <div className="flex items-center">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={currentUser?.avatar?.url} />
                    <AvatarFallback>
                      {getUserNameInitials(currentUser?.name)}
                    </AvatarFallback>
                  </Avatar>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {currentUser?.role?.includes("admin") && (
                <Link to="/admin/dashboard">
                  <DropdownMenuItem>Dashboard</DropdownMenuItem>
                </Link>
              )}
              <Link to="/me/bookings">
                <DropdownMenuItem>My Bookings</DropdownMenuItem>
              </Link>
              <Link to="/me/profile">
                <DropdownMenuItem>Profile</DropdownMenuItem>
              </Link>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={logoutHandler}>
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          loading && <Skeleton className="h-10 w-10 rounded-full" />
        )}
        <ModeToggle />
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
              <span className="me-4">
                <ModeToggle />
              </span>
              {!currentUser && !loading && (
                <Button asChild>
                  <Link to="/login">Login</Link>
                </Button>
              )}
              {currentUser && (
                <>
                  <Button
                    variant="outline"
                    size="icon"
                    className="overflow-hidden rounded-full"
                  >
                    <div className="flex items-center">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={currentUser?.avatar?.url} />
                        <AvatarFallback>
                          {getUserNameInitials(currentUser?.name)}
                        </AvatarFallback>
                      </Avatar>
                    </div>
                  </Button>
                  <p className="ps-2">{currentUser?.name}</p>
                </>
              )}
            </div>
            {currentUser && (
              <>
                {location?.pathname?.includes("/admin") ? (
                  <AdminMobileMenu />
                ) : (
                  <UserMobileMenu
                    isAdmin={currentUser?.role?.includes("admin")}
                  />
                )}
                <DropdownMenuSeparator />
                <Link
                  to="#"
                  onClick={logoutHandler}
                  className="text-lg font-medium hover:underline underline-offset-4"
                >
                  Logout
                </Link>
              </>
            )}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default Header;
