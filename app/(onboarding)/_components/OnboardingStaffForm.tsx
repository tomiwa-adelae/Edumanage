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
import { useEffect, useMemo, useState, useTransition } from "react";
import { IconCheck, IconEye, IconEyeClosed, IconX } from "@tabler/icons-react";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import api from "@/lib/api";
import { Loader } from "@/components/Loader";
import { useAuth } from "@/store/useAuth";
import { useRouter } from "next/navigation";
import * as RPNInput from "react-phone-number-input";
import {
  CountrySelect,
  FlagComponent,
  PhoneInput,
} from "@/components/PhoneNumberInput";
import { RequiredAsterisk } from "@/components/RequiredAsterisk";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { genders, years } from "@/constant";
import { cn, formatWord } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";
import {
  OnboardingStaffSchema,
  OnboardingStaffSchemaType,
} from "@/lib/zodSchema";
import { Textarea } from "@/components/ui/textarea";
import { DateSelector } from "@/components/DateSelector";
import { getDashboardPath, useRoleRedirect } from "@/hooks/use-role-redirect";
import { useSchoolFetcher } from "@/hooks/use-school-fetcher";

interface Props {
  jobRoles: {
    id: string;
    name: string;
  }[];
  countries: {
    id: string;
    name: string;
  }[];
  states: {
    id: string;
    name: string;
  }[];
  schoolID: string;
  acronym: string;
}

export function OnboardingStaffForm({
  jobRoles,
  countries,
  states,
  schoolID,
  acronym,
}: Props) {
  const router = useRouter();
  useSchoolFetcher();

  const setUser = useAuth((s) => s.setUser);

  const [step, setStep] = useState(1);

  const [pending, startTransition] = useTransition();

  const form = useForm<OnboardingStaffSchemaType>({
    resolver: zodResolver(OnboardingStaffSchema),
    mode: "all", // ✅ Validate only after user leaves the field
    reValidateMode: "onChange", // ✅ Revalidate when field changes to clear old errors
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
      phoneNumber: "",
      medicalConditions: "",
      role: "",
      emergencyContactName: "",
      emergencyPhoneNumber: "",
      address: "",
      city: "",
      state: "",
      country: "",
      dob: "",
      gender: "",
    },
  });

  // 🧠 Watch for password changes
  const password = form.watch("password");
  const confirmPassword = form.watch("confirmPassword");

  // 🧩 When password or confirmPassword changes, recheck the match
  useEffect(() => {
    if (confirmPassword !== "" || password !== "") {
      form.trigger("confirmPassword");
    }
  }, [password, confirmPassword, form]);

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

  const handleNext = async () => {
    const step1Fields: (keyof OnboardingStaffSchemaType)[] = [
      "firstName",
      "lastName",
      "email",
      "password",
      "confirmPassword",
      "phoneNumber",
      "role",
    ];
    const isStep1Valid = await form.trigger(step1Fields, { shouldFocus: true });
    if (isStep1Valid) {
      setStep(2);
    } else {
      toast.error("Please fill all required fields correctly.");
    }
  };

  function onSubmit(data: OnboardingStaffSchemaType) {
    startTransition(async () => {
      try {
        const res = await api.post(
          `/schools/${schoolID}/staff/onboarding`,
          data
        );
        setUser(res?.data?.user);
        toast.success(res?.data?.message);
        const dashboardPath = getDashboardPath(res?.data?.user?.role);

        router.push(dashboardPath);
      } catch (error: any) {
        toast.error(error?.response?.data?.message || "Internal server error");
      }
    });
  }

  return (
    <Card className="bg-white dark:bg-card w-full">
      <CardContent className="space-y-10 py-6">
        <div className="space-y-1 text-center">
          <h3 className="font-medium text-2xl md:text-3xl">
            Create an account
          </h3>
          <p className="text-sm text-muted-foreground">
            Create your staff account to get started with {acronym}’s workspace.
          </p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {step === 1 && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          First name
                          <RequiredAsterisk />
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter your first name"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="lastName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Last name
                          <RequiredAsterisk />
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter your last name"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Email Address
                          <RequiredAsterisk />
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="example@lagelu.com"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="phoneNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Primary Phone
                          <RequiredAsterisk />
                        </FormLabel>
                        <FormControl>
                          <RPNInput.default
                            className="flex rounded-md shadow-xs"
                            international
                            flagComponent={FlagComponent}
                            countrySelectComponent={CountrySelect}
                            inputComponent={PhoneInput}
                            placeholder="+2348012345679"
                            value={field.value}
                            onChange={(value) => field.onChange(value)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="gender"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Gender</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select gender" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {genders.map((gender, index) => (
                              <SelectItem value={gender} key={index}>
                                {gender}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="role"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Job role
                          <RequiredAsterisk />
                        </FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select role" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {jobRoles
                              .filter((role) => role.name !== "ADMINISTRATOR")
                              .map((role, index) => (
                                <SelectItem value={role.name} key={index}>
                                  {formatWord[role.name]}
                                </SelectItem>
                              ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="dob"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Date of Birth</FormLabel>
                      <FormControl>
                        <DateSelector field={field} />
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
                      <FormLabel htmlFor="password">
                        Password
                        <RequiredAsterisk />
                      </FormLabel>
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
                          password.length !== 0
                            ? "block mt-2 space-y-3"
                            : "hidden"
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
                      <FormLabel>
                        Confirm password
                        <RequiredAsterisk />
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type={isConfirmVisible ? "text" : "password"}
                            placeholder="Confirm new password"
                            {...field}
                          />
                          <Button
                            className="absolute top-[50%] translate-y-[-50%] end-1 text-muted-foreground/80"
                            variant="ghost"
                            size="icon"
                            type="button"
                            onClick={toggleConfirmVisibility}
                            aria-label={
                              isConfirmVisible
                                ? "Hide password"
                                : "Show password"
                            }
                            aria-pressed={isConfirmVisible}
                            aria-controls="confirmPassword"
                          >
                            {isConfirmVisible ? (
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
                <Button
                  onClick={handleNext}
                  type={"button"}
                  className="w-full"
                  disabled={pending}
                >
                  {pending ? <Loader text="Signing in..." /> : "Next"}
                </Button>
              </>
            )}
            {step === 2 && (
              <>
                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Address
                        <RequiredAsterisk />
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter complete address"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <FormField
                    control={form.control}
                    name="city"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          City
                          <RequiredAsterisk />
                        </FormLabel>
                        <FormControl>
                          <Input placeholder="Ibadan" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="state"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          State
                          <RequiredAsterisk />
                        </FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select state" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {states.map((state, index) => (
                              <SelectItem value={state.name} key={index}>
                                {state.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="country"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Country <RequiredAsterisk />
                        </FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select country" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {countries.map((country, index) => (
                              <SelectItem value={country.name} key={index}>
                                {country.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="emergencyContactName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Emergency name</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="emergencyPhoneNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Emergency phone</FormLabel>
                        <FormControl>
                          <RPNInput.default
                            className="flex rounded-md shadow-xs"
                            international
                            flagComponent={FlagComponent}
                            countrySelectComponent={CountrySelect}
                            inputComponent={PhoneInput}
                            placeholder="+2348012345679"
                            value={field.value}
                            onChange={(value) => field.onChange(value)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="medicalConditions"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Medical conditions/allergies</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Enter any medical conditions or allergies (or 'None')"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-2 gap-4">
                  <Button
                    onClick={() => setStep(1)}
                    type={"button"}
                    variant={"outline"}
                    className="w-full"
                    disabled={pending}
                  >
                    Back
                  </Button>
                  <Button className="w-full" disabled={pending}>
                    {pending ? <Loader text="Creating..." /> : "Create account"}
                  </Button>
                </div>
              </>
            )}
            <Separator />
            <p className="text-center text-sm text-muted-foreground">
              Already have an account?{" "}
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
