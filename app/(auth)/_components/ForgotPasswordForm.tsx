"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { useTransition } from "react";
import { IconMail, IconSend } from "@tabler/icons-react";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import {
  ForgotPasswordSchema,
  ForgotPasswordSchemaType,
} from "@/lib/zodSchema";
import api from "@/lib/api";
import { Loader } from "@/components/Loader";
import { useAuth } from "@/store/useAuth";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

export function ForgotPasswordForm() {
  const router = useRouter();
  const setUser = useAuth((s) => s.setUser);

  const [pending, startTransition] = useTransition();

  const form = useForm<ForgotPasswordSchemaType>({
    resolver: zodResolver(ForgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  function onSubmit(data: ForgotPasswordSchemaType) {
    startTransition(async () => {
      try {
        const res = await api.post("/auth/forgot-password", data);
        setUser(res.data.user);
        toast.success(res.data.message);
        router.replace(`/verify-code?email=${data.email}`);
      } catch (error: any) {
        toast.error(error.response.data.message);
      }
    });
  }

  return (
    <Card className="bg-white dark:bg-card">
      <CardContent className="space-y-10 py-6">
        <div className="space-y-3 text-center">
          <div
            className={cn(
              "rounded-full p-4 bg-secondary text-primary mx-auto inline-flex"
            )}
          >
            <IconMail className="size-8" />
          </div>
          <div className="space-y-2">
            <h3 className="font-medium text-2xl md:text-3xl">Reset Password</h3>
            <p className="text-sm text-muted-foreground">
              Enter your email address and we'll send you a verification code to
              reset your password.
            </p>
          </div>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email Address</FormLabel>
                  <FormControl>
                    <Input placeholder="example@lagelu.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={pending}>
              {pending ? (
                <Loader text="Sending..." />
              ) : (
                <>
                  <IconSend />
                  Send code
                </>
              )}
            </Button>
            <Separator />
            <p className="text-center text-sm text-muted-foreground">
              Remember password?{" "}
              <Link
                href="/"
                className="hover:underline text-primary font-medium"
              >
                Login
              </Link>
            </p>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
