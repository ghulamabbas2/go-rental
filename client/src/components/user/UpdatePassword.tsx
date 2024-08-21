import { Link } from "react-router-dom";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { useForm } from "react-hook-form";
import { useMutation } from "@apollo/client";
import {
  UPDATE_PASSWORD_MUTATION,
  UPDATE_PROFILE_MUTATION,
} from "src/graphql/mutations/user.mutations";
import LoadingSpinner from "../layout/LoadingSpinner";
import { useEffect } from "react";
import { errorToast, errorWrapper } from "src/utils/helpers";
import { toast } from "../ui/use-toast";

import { zodResolver } from "@hookform/resolvers/zod";
import { UpdatePasswordSchema } from "src/zod-schemas/user.schemas";
import { z } from "zod";

const UpdatePassword = () => {
  const form = useForm<z.infer<typeof UpdatePasswordSchema>>({
    resolver: zodResolver(UpdatePasswordSchema),
  });

  const [updatePassword, { loading, error }] = useMutation(
    UPDATE_PASSWORD_MUTATION,
    {
      onCompleted: () => {
        toast({
          title: "Password Updated",
          description: "Your password has been updated",
        });
      },
    }
  );

  useEffect(() => {
    if (error) errorToast(error);
  }, [error]);

  const submitHandler = async (data: z.infer<typeof UpdatePasswordSchema>) => {
    const passwords = {
      oldPassword: data.oldPassword,
      newPassword: data.newPassword,
    };

    await errorWrapper(async () => {
      await updatePassword({
        variables: passwords,
      });
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(submitHandler)}>
        <Card className="w-full max-w-lg">
          <CardHeader>
            <CardTitle className="text-2xl">Update Password</CardTitle>
            <CardDescription>Enter your new password to update</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <FormField
                  control={form.control}
                  name="oldPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Old Password</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="Old Password"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                ></FormField>
              </div>

              <div className="grid gap-2">
                <FormField
                  control={form.control}
                  name="newPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>New Password</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="New Password"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                ></FormField>
              </div>

              <div className="grid gap-2">
                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirm Password</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="Confirm Password"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                ></FormField>
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? <LoadingSpinner /> : "Update"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </Form>
  );
};

export default UpdatePassword;
