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
import { useState, useTransition } from "react";
import { IconEye, IconEyeClosed } from "@tabler/icons-react";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import { LoginSchema, LoginSchemaType } from "@/lib/zodSchema";
import api from "@/lib/api";
import { Loader } from "@/components/Loader";
import { useAuth } from "@/store/useAuth";
import { useRouter } from "next/navigation";
import { getDashboardPath, useRoleRedirect } from "@/hooks/use-role-redirect";
import { useSchoolFetcher } from "@/hooks/use-school-fetcher";
import { TwoFactorVerifyModal } from "@/components/TwoFactorVerifyModal";

export function LoginForm() {
  const router = useRouter();
  const setUser = useAuth((s) => s.setUser);
  useSchoolFetcher();

  const [pending, startTransition] = useTransition();

  const [isVisible, setIsVisible] = useState<boolean>(false);
  const toggleVisibility = () => setIsVisible((prevState) => !prevState);

  // 2FA modal state
  const [showTwoFactorModal, setShowTwoFactorModal] = useState(false);
  const [tempToken, setTempToken] = useState("");
  const [userId, setUserId] = useState("");
  const form = useForm<LoginSchemaType>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  function onSubmit(data: LoginSchemaType) {
    startTransition(async () => {
      try {
        const res = await api.post("/auth/login", data);

        // Check if 2FA is required
        if (res?.data?.requiresTwoFactor) {
          // Store temp token and user ID for 2FA verification
          setTempToken(res?.data?.tempToken);
          setUserId(res?.data?.user.id);
          setShowTwoFactorModal(true);
          toast.info(res?.data?.message || "Please enter your 2FA code");
          return;
        }

        // Normal login (no 2FA required)
        setUser(res?.data?.user);
        toast.success(res?.data?.message);
        const dashboardPath = getDashboardPath(res?.data?.user?.role);
        router.push(dashboardPath);
      } catch (error: any) {
        toast.error(error?.response?.data?.message || "Internal server error");
      }
    });
  }

  // Handle successful 2FA verification
  const handleTwoFactorSuccess = (user: any) => {
    setUser(user);
    setShowTwoFactorModal(false);
    toast.success("Login successful!");
    const dashboardPath = getDashboardPath(user.role);
    router.push(dashboardPath);
  };

  // Handle 2FA cancellation
  const handleTwoFactorCancel = () => {
    setShowTwoFactorModal(false);
    setTempToken("");
    setUserId("");
  };

  return (
    <Card className="bg-white dark:bg-card">
      <CardContent className="space-y-10 py-6">
        <div className="space-y-1 text-center">
          <h3 className="font-medium text-2xl md:text-3xl">Welcome Back</h3>
          <p className="text-sm text-muted-foreground">
            Sign in to access your school management dashboard
          </p>
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
            <FormField
              control={form.control}
              name="password"
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
                </FormItem>
              )}
            />
            <Link
              href="/forgot-password"
              className="inline-block text-sm text-primary hover:underline"
            >
              Forgot password?
            </Link>
            <Button type="submit" className="w-full" disabled={pending}>
              {pending ? <Loader text="Signing in..." /> : "Sign In"}
            </Button>
            <Separator />
            <p className="text-center text-sm text-muted-foreground">
              Don't have an account?{" "}
              <Link
                href="/register"
                className="hover:underline text-primary font-medium"
              >
                Sign up
              </Link>
            </p>
          </form>
        </Form>
      </CardContent>

      {/* Two-Factor Authentication Modal */}
      <TwoFactorVerifyModal
        isOpen={showTwoFactorModal}
        userId={userId}
        tempToken={tempToken}
        onSuccess={handleTwoFactorSuccess}
        onCancel={handleTwoFactorCancel}
      />
    </Card>
  );
}
