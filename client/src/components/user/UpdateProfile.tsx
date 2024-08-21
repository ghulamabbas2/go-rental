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
import { useMutation, useReactiveVar } from "@apollo/client";
import { UPDATE_PROFILE_MUTATION } from "src/graphql/mutations/user.mutations";
import LoadingSpinner from "../layout/LoadingSpinner";
import { useEffect } from "react";
import { errorToast, errorWrapper } from "src/utils/helpers";
import { toast } from "../ui/use-toast";

import { zodResolver } from "@hookform/resolvers/zod";
import { UpdateUserProfileSchema } from "src/zod-schemas/user.schemas";
import { z } from "zod";
import { userVar } from "src/apollo/apollo-vars";
import { CURRENT_USER } from "src/graphql/queries/user.queries";

const UpdateProfile = () => {
  const user = useReactiveVar(userVar);

  const form = useForm<z.infer<typeof UpdateUserProfileSchema>>({
    resolver: zodResolver(UpdateUserProfileSchema),
    defaultValues: {
      name: "",
      email: "",
      phoneNo: "",
    },
  });

  const [updateUserProfile, { loading, error }] = useMutation(
    UPDATE_PROFILE_MUTATION,
    {
      refetchQueries: [{ query: CURRENT_USER }],
      onCompleted: () => {
        toast({
          title: "Profile Updated",
          description: "Your profile details have been updated",
        });
      },
    }
  );

  useEffect(() => {
    if (user) {
      form.setValue("name", user?.name);
      form.setValue("email", user?.email);
      form.setValue("phoneNo", user?.phoneNo);
    }
  }, [user]);

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
    };

    await errorWrapper(async () => {
      await updateUserProfile({
        variables: { userInput },
      });
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(submitHandler)}>
        <Card className="w-full max-w-lg">
          <CardHeader>
            <CardTitle className="text-2xl">Update Profile</CardTitle>
            <CardDescription>
              Enter your details to update profile
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
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
                ></FormField>
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
                ></FormField>
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

export default UpdateProfile;
