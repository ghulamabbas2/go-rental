import React, { useEffect, useState } from "react";
import AdminLayout from "../AdminLayout";

import { Badge } from "../../ui/badge";
import { Button } from "../../ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../ui/card";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../ui/table";
import {
  calculateTablePaginationEnd,
  calculateTablePaginationStart,
  errorToast,
  errorWrapper,
  getUserNameInitials,
  parseTimestampDate,
} from "src/utils/helpers";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useMutation, useQuery } from "@apollo/client";
import { Pencil, ReceiptText, Search, Trash2 } from "lucide-react";
import { Input } from "src/components/ui/input";
import { IUser } from "@go-rental/shared";
import CustomPagination from "src/components/layout/CustomPagination";
import LoadingSpinner from "src/components/layout/LoadingSpinner";
import { GET_ALL_USERS } from "src/graphql/queries/user.queries";
import { Avatar, AvatarFallback, AvatarImage } from "src/components/ui/avatar";
import { UserDialog } from "./UserDialog";
import { DELETE_USER_MUTATION } from "src/graphql/mutations/user.mutations";

const ListUsers = () => {
  const navigate = useNavigate();
  let [searchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState("");

  const query = searchParams.get("query");
  const page = parseInt(searchParams.get("page") || "1", 10);

  const { error, data, loading, refetch } = useQuery(GET_ALL_USERS, {
    variables: {
      page,
      query,
    },
  });

  const users = data?.getAllUsers?.users;
  const pagination = data?.getAllUsers?.pagination;

  const [deleteUser, { loading: deleteLoading, error: deleteError }] =
    useMutation(DELETE_USER_MUTATION, {
      onCompleted: () => {
        refetch();
      },
    });

  useEffect(() => {
    if (searchQuery === "") searchParams.delete("query");

    const path = `${window.location.pathname}?${searchParams.toString()}`;
    navigate(path);
  }, [searchQuery]);

  useEffect(() => {
    if (error) errorToast(error);

    if (deleteError) errorToast(deleteError);
  }, [error, deleteError]);

  const submitHandler = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    navigate(`/admin/users?query=${searchQuery}`);
  };

  const deleteUserHandler = async (id: string) => {
    await errorWrapper(async () => {
      await deleteUser({
        variables: { userId: id },
      });
    });
  };

  return (
    <AdminLayout>
      {loading ? (
        <LoadingSpinner fullScreen={true} size={60} />
      ) : (
        <div className="flex min-h-screen w-full flex-col bg-muted/40">
          <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
            <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
              <Card>
                <CardHeader className="flex flex-col md:flex-row mb-4">
                  <div className="flex-1">
                    <CardTitle>Users</CardTitle>
                    <CardDescription>
                      View and manage all users in the system
                    </CardDescription>
                  </div>
                  <form onSubmit={submitHandler}>
                    <div className="relative ml-auto flex-1 md:grow-0">
                      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="search"
                        placeholder="Enter User ID"
                        className="w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[336px]"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>
                  </form>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="hidden w-[100px] sm:table-cell">
                          Avatar
                        </TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead className="hidden md:table-cell">
                          Roles
                        </TableHead>
                        <TableHead className="hidden md:table-cell">
                          Created At
                        </TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {users?.map((user: IUser) => (
                        <TableRow key={user?.id}>
                          <TableCell className="hidden sm:table-cell">
                            <Avatar className="h-10 w-10">
                              <AvatarImage src={user?.avatar?.url} />
                              <AvatarFallback>
                                {getUserNameInitials(user?.name)}
                              </AvatarFallback>
                            </Avatar>
                          </TableCell>
                          <TableCell className="font-medium">
                            {user?.name}
                          </TableCell>
                          <TableCell className="font-medium">
                            {user?.email}
                          </TableCell>
                          <TableCell className="font-medium">
                            {user?.role?.map((role: string) => (
                              <div key={role}>
                                <Badge variant="outline" className="my-1">
                                  {role}
                                </Badge>
                              </div>
                            ))}
                          </TableCell>
                          <TableCell className="hidden md:table-cell">
                            {parseTimestampDate(user?.createdAt)}
                          </TableCell>
                          <TableCell>
                            <UserDialog
                              updateUserData={user}
                              refetchUser={refetch}
                            />
                            <Button
                              variant="destructive"
                              className="ms-2"
                              size="icon"
                              disabled={deleteLoading}
                              onClick={() => deleteUserHandler(user?.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
                {pagination?.totalCount > 0 && (
                  <CardFooter>
                    <div className="text-xs text-muted-foreground">
                      Showing{" "}
                      {calculateTablePaginationStart(
                        page,
                        pagination?.resPerPage
                      )}
                      -
                      {calculateTablePaginationEnd(
                        page,
                        pagination?.resPerPage,
                        pagination?.totalCount
                      )}{" "}
                      of <strong>{pagination?.totalCount}</strong> users
                    </div>
                  </CardFooter>
                )}
              </Card>
            </main>
          </div>
          <CustomPagination
            resPerPage={pagination?.resPerPage}
            totalCount={pagination?.totalCount}
          />
        </div>
      )}
    </AdminLayout>
  );
};

export default ListUsers;
