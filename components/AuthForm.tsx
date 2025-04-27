"use client";
import Image from "next/image";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { toast } from "sonner";
import FormField from "./FormField";
import { useRouter } from "next/navigation";




const authFormSchema = (type: FormType) => {

  return z.object({
    name: type === "sign-up" ? z.string().min(3) : z.string().optional(),
    email: z.string().email(),
    password: z.string().min(3),
  });
};

const AuthForm = ({ type }: { type: FormType }) => {
  const router = useRouter()
  const formSchema = authFormSchema(type);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    try {
        if (type === "sign-in") {
           toast.success("sign in successfully")
           router.push("/")
        } else {
          toast.success("sign up successfully")
          router.push("/sign-in") 
        }
    } catch (error) {
      toast.error("threre was an error" + error);
    }
  }

  const isSignedIn = type === "sign-in";

  return (
    <div className=" card-border lg:min-w-[566px]">
      <div className=" flex flex-col gap-6 card py-14 px-10">
        <div className=" flex flex-row gap-2 justify-center">
          <Image src="logo.svg" alt="logo" height={32} width={38} />
          <h2 className="text-primary-100">PrepAi</h2>
        </div>
        <h3>Practise Job interviews with AI</h3>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6 w-full mt-4 form"
          >
            {!isSignedIn && (
              <FormField
                control={form.control}
                name="name"
                label="Name"
                placeholder="Your name"
                type="name"
              />
            )}
             <FormField
                control={form.control}
                name="email"
                label="Email"
                placeholder="Your Email address"
                type="email"
              />
             <FormField
                control={form.control}
                name="password"
                label="Password"
                placeholder="Password"
                type="password"
              />
            <Button className="btn" type="submit">
              {isSignedIn ? "Sign in" : "Create an account"}
            </Button>
          </form>
        </Form>
        <p className=" text-center">
          {isSignedIn ? "Don't have an account?" : "Already have an account?"}{" "}
          <Link
            href={isSignedIn ? "/sign-up" : "/sign-in"}
            className="text-primary-100 font-semibold"
          >
            {isSignedIn ? "Sign up" : "Sign in"}
          </Link>
        </p>
      </div>
    </div>
  );
};

export default AuthForm;
