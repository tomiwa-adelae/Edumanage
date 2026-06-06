import { SearchBarWrapper } from "@/components/SearchbarWrapper";
import React from "react";
import { GradingScheme } from "./GradingScheme";

export const GradingSchemes = () => {
  return (
    <div className="space-y-4">
      <SearchBarWrapper />
      <GradingScheme />
      <GradingScheme />
      <GradingScheme />
    </div>
  );
};
