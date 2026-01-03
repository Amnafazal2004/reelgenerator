"use client";
import React from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import Image from "next/image";
import close from "@/Assets/close.png";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useReelContext } from "@/Context/ReelContext";

const Signup = () => {
  const form = useForm({
    defaultValues: { email: "", name: "", password: "" },
  });

  const { setsignin, setsignup, setshowlogin } = useReelContext();

  async function onSubmit(values) {
    setshowlogin(false)
    console.log(values);
    try {
      const response = await authClient.signUp.email({
        email: values.email,
        password: values.password,
        name: values.name,
      });

      console.log("Full signup response:", response); // Add this

      if (response.data) {
        toast(`Signup successful! Welcome ${response.data.user.name}`);
      } else {
        console.log("Signup error:", response.error); // Add this
        toast("Signup failed");
      }
    } catch (error) {
      console.error("Signup catch error:", error); // Add this
      toast("Something went wrong");
    }
  }
  return (
    <div id="signup">
      <Card className="w-full max-w-sm">
        <CardHeader className="flex justify-between">
          <div>
            <CardTitle>Create a New Account</CardTitle>
            <CardDescription>
              Enter your email and password below to create a new account
            </CardDescription>
          </div>
          <Button
            variant="custom"
            className="pr-5"
            onClick={() => setshowlogin(false)}
          >
            {" "}
            <Image src={close} alt="close" className="w-3 mt-1 h-3" />{" "}
          </Button>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="m@gmail.com"
                        type="email"
                        className="w-80"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input placeholder="" className="w-80" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        placeholder=""
                        className="w-80"
                        type="password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                size="lg"
                className="w-full bg-black text-white"
              >
                Sign Up
              </Button>
            </form>
          </Form>
        </CardContent>

        <CardFooter className="flex-col gap-2">
          <CardAction className="flex mt-4 text-[10px]">
            <p>Already have an account?</p>
            <Button
              onClick={() => {
                setsignup(false);
                setsignin(true);
              }}
              variant="custom"
              className="text-[10px] pb-3 font-bold underline pl-1"
            >
              Sign in
            </Button>
          </CardAction>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Signup;

// Tokens ka flow (Better Auth + Client)
// User login/signup
// signIn() ya signUp() call hoti hai
// Server session create karta hai → token generate hota hai
// Token browser cookie me store hota hai
// API request
// Frontend ya useSession() call → token automatically request me send hota hai
// Server token verify karta hai → agar valid → user authorized
// Logout
// Token / session delete hoti hai → user logged out
