import { Button } from "../../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../ui/dialog";
import { useEffect, useState } from "react";
import { errorToast, errorWrapper } from "src/utils/helpers";
import { useMutation } from "@apollo/client";
import LoadingSpinner from "../../layout/LoadingSpinner";
import { IUser, UserRoles } from "@go-rental/shared";
import { Pencil } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../ui/form";
import { UPDATE_USER_MUTATION } from "src/graphql/mutations/user.mutations";
import { Input } from "src/components/ui/input";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { UpdateUserProfileSchema } from "src/zod-schemas/user.schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { Checkbox } from "src/components/ui/checkbox";

type Props = {
  updateUserData: IUser;
  refetchUser: () => void;
};

export function UserDialog({ updateUserData, refetchUser }: Props) {
  const [selectedRoles, setSelectedRoles] = useState(
    updateUserData?.role || []
  );

  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleCheckboxChange = (role: string) => {
    setSelectedRoles((prevRoles: string[]) =>
      prevRoles?.includes(role)
        ? prevRoles?.filter((r) => r !== role)
        : [...prevRoles, role]
    );
  };

  const form = useForm<z.infer<typeof UpdateUserProfileSchema>>({
    resolver: zodResolver(UpdateUserProfileSchema),
    defaultValues: updateUserData,
  });

  const [updateUser, { loading, error }] = useMutation(UPDATE_USER_MUTATION, {
    onCompleted: () => {
      setIsDialogOpen(false);
      refetchUser();
    },
  });

  useEffect(() => {
    if (error) errorToast(error);
  }, [error]);

  const submitHandler = async (
    data: z.infer<typeof UpdateUserProfileSchema>
  ) => {
    const userInput = {
      name: data.name,
      email: data.email,
      phoneNo: data.phoneNo,
      role: selectedRoles,
    };
    await errorWrapper(async () => {
      await updateUser({
        variables: { userId: updateUserData?.id, userInput },
      });
    });
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button
          variant={"outline"}
          size={"icon"}
          onClick={() => setIsDialogOpen(true)}
        >
          <Pencil className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(submitHandler)}>
            <DialogHeader>
              <DialogTitle>Update User</DialogTitle>
              <DialogDescription>Update user details here</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid gap-2">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="hello@example.com"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid gap-2">
                <FormField
                  control={form.control}
                  name="phoneNo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone No</FormLabel>
                      <FormControl>
                        <Input placeholder="1112223333" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid gap-2">
                <FormLabel>Role</FormLabel>
                {UserRoles.map((role) => (
                  <div className="items-top flex space-x-2" key={role}>
                    <Checkbox
                      id={role}
                      value={role}
                      checked={selectedRoles?.includes(role)}
                      onCheckedChange={() => handleCheckboxChange(role)}
                    />
                    <div className="grid gap-1.5 leading-none">
                      <label
                        htmlFor={role}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {role?.toUpperCase()}
                      </label>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <DialogFooter>
              <Button type="submit" disabled={loading}>
                {loading ? <LoadingSpinner /> : "Update"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
