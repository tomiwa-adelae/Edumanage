"use client";

import React, { useState } from "react";
import { Button } from "./ui/button";
import {
  IconCheck,
  IconArrowRight,
  IconChevronLeft,
  IconChartBar,
  IconCompass,
  IconFileText,
  IconTrendingUp,
  IconCalendarEvent,
  IconCreditCard,
  IconCalendar,
  IconUser,
  IconSparkles,
  IconFileDescription,
  IconSchool,
  IconUsers,
  IconWallet,
  IconBook,
} from "@tabler/icons-react";
import { useAuth } from "@/store/useAuth";
import { useRouter } from "next/navigation";
import { getDashboardPath } from "@/hooks/use-role-redirect";
import { env } from "@/lib/env";
import { cn } from "@/lib/utils";
import { schoolService } from "@/lib/school";
import api from "@/lib/api";
import { toast } from "sonner";

// Tour step data
const tourSteps = [
  {
    id: 1,
    icon: "👋",
    bgColor: "bg-muted",
    iconColor: "text-primary",
    title: "Welcome to your Student Portal!",
    description:
      "Let's take a quick tour to help you get started. This will only take a minute!",
  },
  {
    id: 2,
    icon: "📊",
    bgColor: "bg-blue-100",
    iconColor: "text-blue-600",
    title: "Your Dashboard",
    description:
      "View your daily schedule, upcoming assignments, attendance, and academic performance all in one place.",
  },
  {
    id: 3,
    icon: "🧭",
    bgColor: "bg-orange-100",
    iconColor: "text-orange-600",
    title: "Easy Navigation",
    description:
      "Use the sidebar menu to access all features: Assignments, Grades, Timetable, Attendance, Fees, Calendar, and more!",
  },
  {
    id: 4,
    icon: "📝",
    bgColor: "bg-blue-100",
    iconColor: "text-blue-600",
    title: "Submit Assignments",
    description:
      "View all your assignments, submit work online, and track your submission status. Never miss a deadline!",
  },
  {
    id: 5,
    icon: "📈",
    bgColor: "bg-green-100",
    iconColor: "text-green-600",
    title: "Track Your Progress",
    description:
      "Monitor your grades across all subjects, view your GPA, and track your academic improvement over time.",
  },
  {
    id: 6,
    icon: "📅",
    bgColor: "bg-blue-100",
    iconColor: "text-blue-600",
    title: "Monitor Attendance",
    description:
      "Keep track of your attendance record with visual calendar and statistics. Aim for 90% or higher!",
  },
  {
    id: 7,
    icon: "💰",
    bgColor: "bg-pink-100",
    iconColor: "text-pink-600",
    title: "Manage Fees & Payments",
    description:
      "View your fee structure, make online payments, download receipts, and track payment history.",
  },
  {
    id: 8,
    icon: "📆",
    bgColor: "bg-yellow-100",
    iconColor: "text-yellow-600",
    title: "Stay Updated",
    description:
      "Check the academic calendar for exams, events, holidays, and important school dates.",
  },
  {
    id: 9,
    icon: "👤",
    bgColor: "bg-purple-100",
    iconColor: "text-purple-600",
    title: "Your Profile",
    description:
      "Update your contact information, view your academic details, and manage your account settings.",
  },
  {
    id: 10,
    icon: "🎉",
    bgColor: "bg-green-100",
    iconColor: "text-green-600",
    title: "You're All Set!",
    description:
      "You can always revisit this tour from the Help menu. Enjoy your learning journey at Lagelu Grammar School!",
  },
];

interface Props {
  onClose: () => void;
}

export const AccountApprovedModal = ({ onClose }: Props) => {
  const { user, updateStudent } = useAuth();

  const [showTour, setShowTour] = useState(false);
  const [loading, setLoading] = useState(false);

  const completeOnboarding = async () => {
    if (!user?.Student || !user?.schoolId) return;

    try {
      setLoading(true);
      onClose();
      const res = await api.patch(`/students/${user.id}/onboarding-complete`, {
        schoolId: user?.school?.id,
      });
      toast.success(res.data.message);

      updateStudent({ completedOnboarding: true });

      onClose();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to update onboarding");
    } finally {
      setLoading(false);
    }
  };

  const handleGetStarted = () => {
    setShowTour(true);
  };

  const handleSkipTour = () => {
    if (!user) return;
    onClose();
  };

  const handleExploreLater = () => {
    if (!user) return;
    onClose();
  };

  if (showTour) {
    return (
      <WelcomeTour onComplete={completeOnboarding} onSkip={handleSkipTour} />
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center h-screen justify-center bg-red-300/5 backdrop-blur-xs">
      <div
        className="bg-white dark:bg-card rounded-2xl shadow-xl w-full overflow-hidden max-h-[70vh] max-w-[90vw] sm:max-w-xl sm:max-h-[min(640px,80vh)]
    flex flex-col"
      >
        <div className="overflow-y-auto custom-scroll w-full flex-1">
          <div className="bg-white dark:bg-card rounded-2xl shadow-xl w-full">
            {/* Header */}
            <div className="bg-primary px-2 lg:px-6 py-12 text-center relative">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-white dark:bg-card rounded-full mb-4 shadow-lg">
                <IconCheck
                  className="w-10 h-10 text-green-500"
                  strokeWidth={3}
                />
              </div>
              <h2 className="text-xl md:text-3xl font-bold text-white mb-2">
                🎊 Congratulations! 🎊
              </h2>
              <p className="text-white text-sm md:text-base font-medium">
                Your application has been approved
              </p>
              {user?.school && (
                <p className="text-white/90 text-xs md:text-sm mt-2">
                  Welcome to {user.school.name}
                </p>
              )}

              {/* Status Badges */}
              <div className="flex items-center justify-center gap-3 mt-4 flex-wrap">
                <div className="bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-full text-xs font-medium flex items-center gap-2">
                  <span>📧</span>
                  <span>{user?.email}</span>
                </div>
                <div className="bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-full text-xs font-medium flex items-center gap-2">
                  <span>🆔</span>
                  <span>{user?.Student.admissionNumber}</span>
                </div>
                <div className="bg-green-500 text-white px-4 py-2 rounded-full text-xs font-medium flex items-center gap-2">
                  <IconCheck className="w-3 h-3" />
                  <span>Active Student</span>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-2 md:p-4 lg:p-8">
              {/* Welcome Message */}
              <div className="text-center mb-8">
                <h3 className="text-base md:text-xl font-medium text-gray-900 mb-1">
                  You're All Set to Begin Your Journey! 🎉
                </h3>
                <p className="text-muted-foreground text-xs md:text-sm">
                  Your student account is now active. Explore your dashboard,
                  check your timetable, view assignments, and stay connected
                  with your teachers. We're excited to have you!
                </p>
              </div>

              {/* Quick Access Portal */}
              <div className="mb-8">
                <h4 className="text-sm font-medium text-muted-foreground text-center mb-4 flex items-center justify-center gap-2">
                  <span>🚀</span>
                  Quick Access to Your Portal
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <QuickAccessCard
                    icon={IconSchool}
                    title="Dashboard"
                    description="View your overview"
                    onClick={handleSkipTour}
                    bgColor="bg-primary/10"
                    color="text-primary"
                  />
                  <QuickAccessCard
                    icon={IconUsers}
                    title="Complete Profile"
                    description="Update your information"
                    onClick={handleSkipTour}
                    bgColor="bg-purple-500/10"
                    color="text-purple-500"
                  />
                  <QuickAccessCard
                    icon={IconCalendar}
                    title="View Timetable"
                    description="Check your class schedule"
                    onClick={handleSkipTour}
                    bgColor="bg-green-500/10"
                    color="text-green-500"
                  />
                  <QuickAccessCard
                    icon={IconFileDescription}
                    title="Assignments"
                    description="See your tasks"
                    onClick={handleSkipTour}
                    bgColor="bg-orange-500/10"
                    color="text-orange-500"
                  />
                  <QuickAccessCard
                    icon={IconWallet}
                    title="Fees & Payments"
                    description="Check fee structure"
                    onClick={handleSkipTour}
                    bgColor="bg-red-500/10"
                    color="text-red-500"
                  />
                  <QuickAccessCard
                    icon={IconBook}
                    title="Academic Calendar"
                    description="Important dates"
                    onClick={handleSkipTour}
                    bgColor="bg-blue-700/10"
                    color="text-blue-700"
                  />
                </div>
              </div>

              {/* Recommended Next Steps */}
              <div className="bg-blue-50 rounded-xl p-6 mb-6">
                <h4 className="text-sm font-medium mb-4 flex items-center gap-2">
                  <span>✨</span>
                  Recommended Next Steps
                </h4>
                <div className="space-y-3">
                  <NextStepItem
                    number={1}
                    title="Complete Your Profile"
                    description="Add your photo and verify your contact information"
                  />
                  <NextStepItem
                    number={2}
                    title="Review Your Timetable"
                    description="Check your class schedule and save important times"
                  />
                  <NextStepItem
                    number={3}
                    title="Check Fee Payment Status"
                    description="View your fee structure and make necessary payments"
                  />
                  <NextStepItem
                    number={4}
                    title="Explore Academic Calendar"
                    description="Stay updated on exams, events, and important dates"
                  />
                </div>
              </div>

              {/* Important Notice */}
              <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4 mb-6">
                <div className="flex gap-3">
                  <span className="text-yellow-600 size-4">
                    <IconFileDescription />
                  </span>
                  <div>
                    <h5 className="text-sm font-medium text-yellow-800 mb-1">
                      Important Notice
                    </h5>
                    <p className="text-xs text-yellow-700">
                      Please ensure you complete your fee payment within the
                      next 7 days to maintain your active status. Contact the
                      bursar's office if you have any questions.
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col md:flex-row gap-3">
                <Button onClick={handleGetStarted} className="flex-1">
                  Get Started
                  <IconArrowRight />
                </Button>
                <Button
                  onClick={handleExploreLater}
                  variant="outline"
                  className="flex-1"
                >
                  I'll Explore Later
                </Button>
              </div>
            </div>

            {/* Footer */}
            <div className="bg-gray-50 px-4 lg:px-8 py-4 text-center border-t border-gray-200 text-xs text-muted-foreground">
              Need help getting started? Contact us at{" "}
              <a
                className="text-primary hover:underline font-medium"
                href={`mailto:${env.NEXT_PUBLIC_SUPPORT_EMAIL_ADDRESS}`}
              >
                {env.NEXT_PUBLIC_SUPPORT_EMAIL_ADDRESS}
              </a>{" "}
              or call{" "}
              <a
                className="text-primary hover:underline font-medium"
                href={`tel:${env.NEXT_PUBLIC_SUPPORT_PHONE_NUMBER}`}
              >
                {env.NEXT_PUBLIC_SUPPORT_PHONE_NUMBER}
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Quick Access Card Component
const QuickAccessCard = ({
  icon,
  title,
  description,
  onClick,
  bgColor,
  color,
}: {
  icon: any;
  title: string;
  description: string;
  bgColor: string;
  color: string;
  onClick: () => void;
}) => {
  const Icon = icon;
  return (
    <button
      onClick={onClick}
      className="bg-white dark:bg-card flex md:flex-col items-center md:items-start justify-start gap-2 border border-gray-200 rounded-md p-4 hover:border-primary hover:shadow-md transition-all text-left group"
    >
      <div className={cn(bgColor, color, "p-3 rounded-md")}>
        <Icon />
      </div>
      <div>
        <h5 className="text-sm font-medium group-hover:text-primary">
          {title}
        </h5>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
    </button>
  );
};

// Next Step Item Component
const NextStepItem = ({
  number,
  title,
  description,
}: {
  number: number;
  title: string;
  description: string;
}) => (
  <div className="flex gap-3 items-start">
    <div className="flex-shrink-0 size-6 bg-primary text-white rounded-full flex items-center justify-center text-xs font-medium">
      {number}
    </div>
    <div className="flex-1">
      <h5 className="text-sm font-medium">{title}</h5>
      <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
    </div>
  </div>
);

// Welcome Tour Component
const WelcomeTour = ({
  onComplete,
  onSkip,
}: {
  onComplete: () => void;
  onSkip: () => void;
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const totalSteps = tourSteps.length;
  const isLastStep = currentStep === totalSteps - 1;
  const isFirstStep = currentStep === 0;

  const handleNext = () => {
    if (isLastStep) {
      onComplete();
    } else {
      setCurrentStep((s) => s + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep((s) => s - 1);
    }
  };

  const currentTourStep = tourSteps[currentStep];

  return (
    <div className="fixed inset-0 z-[60] flex items-center h-screen justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-card rounded-2xl shadow-2xl max-w-lg w-full mx-4 overflow-hidden">
        {/* Blue Header Bar */}
        <div className="h-2 bg-primary" />

        <div className="p-8 text-center">
          {/* Progress Indicator */}
          <div className="flex items-center justify-center gap-1.5 mb-8">
            {tourSteps.map((_, index) => (
              <div
                key={index}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  index === currentStep
                    ? "w-8 bg-primary"
                    : index < currentStep
                    ? "w-1.5 bg-primary/50"
                    : "w-1.5 bg-gray-300"
                }`}
              />
            ))}
          </div>

          {/* Icon */}
          <div
            className={`inline-flex items-center justify-center w-20 h-20 ${currentTourStep.bgColor} rounded-full mb-6`}
          >
            <span className="text-4xl">{currentTourStep.icon}</span>
          </div>

          {/* Title */}
          <h2 className="text-2xl font-bold text-gray-900 mb-3">
            {currentTourStep.title}
          </h2>

          {/* Description */}
          <p className="text-muted-foreground text-sm mb-6 leading-relaxed">
            {currentTourStep.description}
          </p>

          {/* Step Counter */}
          <p className="text-xs text-gray-500 mb-8">
            Step {currentStep + 1} of {totalSteps}
          </p>

          {/* Action Buttons */}
          <div className="flex items-center justify-between gap-3">
            <Button onClick={onSkip} variant="ghost">
              Skip Tour
            </Button>
            <div className="flex items-center justify-end gap-3">
              {!isFirstStep && (
                <Button onClick={handlePrevious} variant="outline">
                  <IconChevronLeft />
                  <span className="hidden md:block">Previous</span>
                </Button>
              )}

              <Button
                onClick={handleNext}
                className={`${isFirstStep && "flex-1"}`}
              >
                {isLastStep ? (
                  <>
                    Complete
                    <IconCheck />
                  </>
                ) : (
                  <>
                    <span className="hidden md:block">Next</span>
                    <IconArrowRight />
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
