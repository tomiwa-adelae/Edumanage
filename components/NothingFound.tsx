"use client";
import { IconTelescope } from "@tabler/icons-react";
import Lottie, { LottieRefCurrentProps } from "lottie-react";
import React, { useRef } from "react";
import EmptyAnimation from "@/public/assets/animations/empty-animation.json";

export const NothingFound = ({
  message = "Nothing found",
}: {
  message?: string;
}) => {
  const animationRef = useRef<LottieRefCurrentProps>(null);
  return (
    <div className="flex items-center justify-center gap-2 text-center flex-col">
      {/* <IconTelescope className="text-primary size-20" /> */}
      <div className="h-60 w-60">
        <Lottie lottieRef={animationRef} animationData={EmptyAnimation} />
      </div>
      <p className="text-base text-muted-foreground mt-20 z-20">{message}</p>
    </div>
  );
};
