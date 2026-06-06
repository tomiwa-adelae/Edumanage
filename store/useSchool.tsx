import { create } from "zustand";
import { persist } from "zustand/middleware";

type School = {
  id: string;
  name: string;
  acronym: string | null;
  motto: string | null;
  visionStatement: string | null;
  missionStatement: string | null;
  establishmentYear: string | null;
  logo: string | null;
  schoolType: string | null;
  ownershipType: string | null;
  address: string | null;
  city: string | null;
  country: string | null;
  state: string | null;
  primaryPhone: string | null;
  alternatePhone: string | null;
  email: string | null;
  website: string | null;
  currentSession: string | null;
  currentTerm: string | null;
  termsPerSession: string | null;
  academicStartDate: string | null;
  academicEndDate: string | null;
  gradingSystem: string | null;
  passMark: string | null;
  schoolRegistrationNumber: string | null;
  accreditationBody: string | null;
  accreditationNumber: string | null;
  createdAt: Date | null;
  updatedAT: Date | null;
} | null;

type SchoolState = {
  school: School;
  setSchool: (school: School) => void;
  clearSchool: () => void;
};

export const useSchool = create<SchoolState>()(
  persist(
    (set) => ({
      school: null,
      setSchool: (school) => set({ school }),
      clearSchool: () => set({ school: null }),
    }),
    { name: "school-profile" }
  )
);
