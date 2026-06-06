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
import { Card, CardContent } from "@/components/ui/card";
import { useEffect, useState, useTransition } from "react";
import {
  IconProgressCheck,
  IconRefreshDot,
  IconShield,
} from "@tabler/icons-react";
import { Separator } from "@/components/ui/separator";
import { VerifyCodeSchema, VerifyCodeSchemaType } from "@/lib/zodSchema";
import api from "@/lib/api";
import { Loader } from "@/components/Loader";
import { useAuth } from "@/store/useAuth";
import { useRouter } from "next/navigation";
import { cn, maskEmail } from "@/lib/utils";
import { OTPInput, SlotProps } from "input-otp";

interface Props {
  email: string;
}

export function VerifyCodeForm({ email }: Props) {
  const router = useRouter();
  const setUser = useAuth((s) => s.setUser);

  const [pending, startTransition] = useTransition();
  const [resendPending, startResendTransition] = useTransition();

  const [timeLeft, setTimeLeft] = useState(20); // 3 minutes = 180 seconds
  const [isCounting, setIsCounting] = useState(true);

  // Start the countdown
  useEffect(() => {
    if (!isCounting) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setIsCounting(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isCounting]);

  // Convert seconds → MM:SS format
  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  const form = useForm<VerifyCodeSchemaType>({
    resolver: zodResolver(VerifyCodeSchema),
    defaultValues: {
      email,
      otp: "",
    },
  });

  function onSubmit(data: VerifyCodeSchemaType) {
    startTransition(async () => {
      try {
        const res = await api.post("/auth/verify-code", data);
        toast.success(res.data.message);
        router.replace(`/new-password?email=${data.email}&otp=${data.otp}`);
      } catch (error: any) {
        toast.error(error.response?.data?.message || "Something went wrong");
      }
    });
  }

  const handleResendCode = () => {
    startResendTransition(async () => {
      try {
        const res = await api.post("/auth/forgot-password", { email });
        // setUser(res.data.user);
        toast.success(res.data.message);
        setTimeLeft(180);
        setIsCounting(true);
      } catch (error: any) {
        toast.error(error.response.data.message);
      }
    });
  };

  return (
    <Card className="bg-white dark:bg-card md:min-w-md">
      <CardContent className="space-y-10 py-6">
        <div className="space-y-3 text-center">
          <div
            className={cn(
              "rounded-full p-4 bg-secondary text-primary mx-auto inline-flex"
            )}
          >
            <IconShield className="size-8" />
          </div>
          <div className="space-y-2">
            <h3 className="font-medium text-2xl md:text-3xl">Verify Code</h3>
            <p className="text-sm text-muted-foreground">
              We've sent a 6-digit verification code to{" "}
              <span className="font-medium">{maskEmail(email)}</span>
            </p>
          </div>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="otp"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-center w-full block">
                    Enter code
                  </FormLabel>
                  <FormControl>
                    <OTPInput
                      value={field.value}
                      onChange={(value) => {
                        field.onChange(value);

                        // Automatically submit when length === 6
                        if (value.length === 6) {
                          form.handleSubmit(onSubmit)();
                        }
                      }}
                      containerClassName="flex items-center justify-center gap-3 has-disabled:opacity-50"
                      maxLength={6}
                      render={({ slots }) => (
                        <div className="flex gap-2">
                          {slots.map((slot, idx) => (
                            <Slot key={idx} {...slot} />
                          ))}
                        </div>
                      )}
                    />
                  </FormControl>
                  <FormMessage className="w-full block text-center text-xs" />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              className="w-full"
              disabled={resendPending || pending}
            >
              {pending ? (
                <Loader text="Verifying..." />
              ) : (
                <>
                  <IconProgressCheck />
                  Verify Code
                </>
              )}
            </Button>
            <Separator />
            <div className="space-y-2 flex flex-col items-center justify-center">
              <p className="text-center text-sm text-muted-foreground">
                Didn't receive the code?
              </p>
              <Button
                type="button"
                onClick={handleResendCode}
                className="w-full"
                variant={"outline"}
                disabled={resendPending || pending || isCounting}
              >
                {resendPending ? (
                  <Loader text="Resending..." />
                ) : (
                  <>
                    <IconRefreshDot />
                    Resend code
                  </>
                )}
              </Button>
              <p className="text-xs text-muted-foreground">
                Available in {formatTime(timeLeft)}
              </p>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

function Slot(props: SlotProps) {
  return (
    <div
      className={cn(
        "border-input bg-muted text-foreground flex size-14 items-center justify-center rounded-md border font-medium shadow-xs transition-[color,box-shadow]",
        { "border-ring ring-ring/50 z-10 ring-[1px]": props.isActive }
      )}
    >
      {props.char !== null && <div>{props.char}</div>}
    </div>
  );
}
