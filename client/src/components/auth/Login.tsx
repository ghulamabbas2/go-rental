import { Link, useNavigate } from "react-router-dom";
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
import { LogIn } from "lucide-react";
import { useForm } from "react-hook-form";
import { useMutation, useReactiveVar } from "@apollo/client";
import { LOGIN_MUTATION } from "src/graphql/mutations/user.mutations";
import LoadingSpinner from "../layout/LoadingSpinner";
import { useEffect } from "react";
import { errorToast, errorWrapper } from "src/utils/helpers";

import { zodResolver } from "@hookform/resolvers/zod";
import { LoginSchema } from "src/zod-schemas/user.schemas";
import { z } from "zod";
import { isAuthenticatedVar } from "src/apollo/apollo-vars";
import { CURRENT_USER } from "src/graphql/queries/user.queries";

const Login = () => {
  const isAuthenticated = useReactiveVar(isAuthenticatedVar);
  const navigate = useNavigate();

  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: { email: "", password: "" },
  });

  const [login, { loading, error }] = useMutation(LOGIN_MUTATION, {
    refetchQueries: [{ query: CURRENT_USER }],
  });

  useEffect(() => {
    if (isAuthenticated) navigate("/");
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (error) errorToast(error);
  }, [error]);

  const submitHandler = async (data: z.infer<typeof LoginSchema>) => {
    await errorWrapper(async () => {
      await login({
        variables: { email: data.email, password: data.password },
      });
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(submitHandler)}>
        <div className="flex min-h-screen flex-1 flex-col gap-4 bg-muted/40 justify-center">
          <Card className="mx-auto w-full max-w-lg shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl">Login</CardTitle>
              <CardDescription>
                Enter your email & password to login
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
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
                        <div className="flex items-center">
                          <FormLabel>Password</FormLabel>
                          <Link
                            to="/password/forgot"
                            className="ml-auto inline-block text-sm underline"
                          >
                            Forgot your password?
                          </Link>
                        </div>
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

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? (
                    <LoadingSpinner />
                  ) : (
                    <>
                      Login <LogIn className="h-4 w-4 ml-2" />
                    </>
                  )}
                </Button>
              </div>
              <div className="mt-4 text-center text-sm">
                Don't have an account?{" "}
                <Link to="/register" className="underline">
                  Sign Up
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </form>
    </Form>
  );
};

export default Login;
