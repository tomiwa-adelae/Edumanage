"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { useMemo, useState, useTransition } from "react";
import {
  IconCheck,
  IconEye,
  IconEyeClosed,
  IconLock,
  IconLockAccess,
  IconMail,
  IconSend,
  IconX,
} from "@tabler/icons-react";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import { NewPasswordSchema, NewPasswordSchemaType } from "@/lib/zodSchema";
import axios from "axios";
import api from "@/lib/api";
import { Loader } from "@/components/Loader";
import { useAuth } from "@/store/useAuth";
import { useRouter } from "next/navigation";
import { cn, maskEmail } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";

interface Props {
  email: string;
  otp: string;
}

export function NewPasswordForm({ email, otp }: Props) {
  const router = useRouter();
  const setUser = useAuth((s) => s.setUser);

  const [pending, startTransition] = useTransition();

  const form = useForm<NewPasswordSchemaType>({
    resolver: zodResolver(NewPasswordSchema),
    defaultValues: {
      newPassword: "",
      confirmPassword: "",
      otp,
      email,
    },
  });

  const password = form.watch("newPassword");
  const [isVisible, setIsVisible] = useState<boolean>(false);

  const [isConfirmVisible, setConfirmIsVisible] = useState<boolean>(false);
  const toggleVisibility = () => setIsVisible((prevState) => !prevState);
  const toggleConfirmVisibility = () =>
    setConfirmIsVisible((prevState) => !prevState);

  const checkStrength = (pass: string) => {
    const requirements = [
      { regex: /.{8,}/, text: "At least 8 characters" },
      { regex: /[0-9]/, text: "At least 1 number" },
      { regex: /[a-z]/, text: "At least 1 lowercase letter" },
      { regex: /[A-Z]/, text: "At least 1 uppercase letter" },
      {
        regex: /[!@#$%^&*(),.?":{}|<>]/,
        text: "At least 1 special character",
      },
    ];

    return requirements.map((req) => ({
      met: req.regex.test(pass),
      text: req.text,
    }));
  };

  const strength = checkStrength(password);

  const strengthScore = useMemo(() => {
    return strength.filter((req) => req.met).length;
  }, [strength]);

  const getStrengthText = (score: number) => {
    if (score === 0) return "Enter a password";
    if (score <= 2) return "Weak password";
    if (score === 3) return "Medium password";
    return "Strong password";
  };

  function onSubmit(data: NewPasswordSchemaType) {
    startTransition(async () => {
      try {
        const res = await api.post("/auth/set-new-password", data);
        toast.success(res.data.message);
        router.push(`/new-password/success?email=${data.email}`);
      } catch (error: any) {
        toast.error(error.response?.data?.message || "Something went wrong");
      }
    });
  }

  return (
    <Card className="bg-white dark:bg-card w-full md:min-w-md">
      <CardContent className="space-y-10 py-6">
        <div className="space-y-3 text-center">
          <div
            className={cn(
              "rounded-full p-4 bg-secondary text-primary mx-auto inline-flex"
            )}
          >
            <IconLock className="size-8" />
          </div>
          <div className="space-y-2">
            <h3 className="font-medium text-2xl md:text-3xl">
              Set New Password
            </h3>
            <p className="text-sm text-muted-foreground">
              Create a new password for{" "}
              <span className="font-medium">{maskEmail(email)}</span>
            </p>
          </div>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="newPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="password">Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        id="password"
                        className="pe-9"
                        placeholder="Password"
                        type={isVisible ? "text" : "password"}
                        {...field}
                      />
                      <Button
                        className="absolute top-[50%] translate-y-[-50%] end-1 text-muted-foreground/80"
                        variant={"ghost"}
                        size="icon"
                        type="button"
                        onClick={toggleVisibility}
                        aria-label={
                          isVisible ? "Hide password" : "Show password"
                        }
                        aria-pressed={isVisible}
                        aria-controls="password"
                      >
                        {isVisible ? (
                          <IconEyeClosed
                            className="size-4"
                            aria-hidden="true"
                          />
                        ) : (
                          <IconEye className="size-4" aria-hidden="true" />
                        )}
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage />
                  <div
                    className={cn(
                      password.length !== 0 ? "block mt-2 space-y-3" : "hidden"
                    )}
                  >
                    <Progress
                      value={(strengthScore / 5) * 100}
                      className={cn("h-1")}
                    />
                    {/* Password strength description */}
                    <p className="text-foreground mb-2 text-sm font-medium">
                      {getStrengthText(strengthScore)}. Must contain:
                    </p>

                    {/* Password requirements list */}
                    <ul
                      className="space-y-1.5"
                      aria-label="Password requirements"
                    >
                      {strength.map((req, index) => (
                        <li key={index} className="flex items-center gap-2">
                          {req.met ? (
                            <IconCheck
                              size={16}
                              className="text-emerald-500"
                              aria-hidden="true"
                            />
                          ) : (
                            <IconX
                              size={16}
                              className="text-muted-foreground/80"
                              aria-hidden="true"
                            />
                          )}
                          <span
                            className={`text-xs ${
                              req.met
                                ? "text-emerald-600"
                                : "text-muted-foreground"
                            }`}
                          >
                            {req.text}
                            <span className="sr-only">
                              {req.met
                                ? " - Requirement met"
                                : " - Requirement not met"}
                            </span>
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type={isConfirmVisible ? "text" : "password"}
                        placeholder="Confirm new password"
                        {...field}
                      />
                      <Button
                        className="absolute top-[50%] translate-y-[-50%] end-1 text-muted-foreground/80"
                        variant={"ghost"}
                        size="icon"
                        type="button"
                        onClick={toggleConfirmVisibility}
                        aria-label={
                          isVisible ? "Hide password" : "Show password"
                        }
                        aria-pressed={isConfirmVisible}
                        aria-controls="password"
                      >
                        {isVisible ? (
                          <IconEyeClosed
                            className="size-4"
                            aria-hidden="true"
                          />
                        ) : (
                          <IconEye className="size-4" aria-hidden="true" />
                        )}
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={pending}>
              {pending ? (
                <Loader text="Updating..." />
              ) : (
                <>
                  <IconLock />
                  Update Password
                </>
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
