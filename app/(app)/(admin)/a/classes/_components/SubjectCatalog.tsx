import React from "react";
import { SubjectBox } from "./SubjectBox";
import { SubjectSearchComponent } from "../../_components/SubjectSearchComponent";

export const SubjectCatalog = () => {
  return (
    <div className="space-y-4">
      <SubjectSearchComponent />
      <SubjectBox />
      <SubjectBox />
      <SubjectBox />
      <SubjectBox />
      <SubjectBox />
    </div>
  );
};
