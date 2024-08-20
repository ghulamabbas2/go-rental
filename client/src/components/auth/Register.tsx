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
import { MailPlus } from "lucide-react";
import { useForm } from "react-hook-form";
import { useMutation } from "@apollo/client";
import { REGISTER_USER_MUTATION } from "src/graphql/mutations/user.mutations";
import LoadingSpinner from "../layout/LoadingSpinner";
import { useEffect } from "react";
import { errorToast, errorWrapper } from "src/utils/helpers";
import { toast } from "../ui/use-toast";

import { zodResolver } from "@hookform/resolvers/zod";
import { RegisterUserSchema } from "src/zod-schemas/user.schemas";
import { z } from "zod";

const Register = () => {
  const form = useForm<z.infer<typeof RegisterUserSchema>>({
    resolver: zodResolver(RegisterUserSchema),
  });

  const [registerUser, { loading, error }] = useMutation(
    REGISTER_USER_MUTATION,
    {
      onCompleted: () => {
        toast({
          title: "Account created.",
          description: "You can now log in to your account.",
        });
      },
    }
  );

  useEffect(() => {
    if (error) errorToast(error);
  }, [error]);

  const submitHandler = async (data: z.infer<typeof RegisterUserSchema>) => {
    const userInput = {
      name: data.name,
      email: data.email,
      password: data.password,
      phoneNo: data.phoneNo,
    };

    await errorWrapper(async () => {
      await registerUser({
        variables: { userInput },
      });
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(submitHandler)}>
        <div className="flex min-h-screen flex-1 flex-col gap-4 bg-muted/40 justify-center">
          <Card className="mx-auto w-full max-w-lg shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl">Sign Up</CardTitle>
              <CardDescription>
                Enter your information to create an account
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
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input
                            type="password"
                            placeholder="Password"
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
                  {loading ? (
                    <LoadingSpinner />
                  ) : (
                    <>
                      Sign Up <MailPlus className="h-4 w-4 ml-2" />
                    </>
                  )}
                </Button>
              </div>
              <div className="mt-4 text-center text-sm">
                Already have an account?{" "}
                <Link to="/login" className="underline">
                  Sign in
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </form>
    </Form>
  );
};

export default Register;
