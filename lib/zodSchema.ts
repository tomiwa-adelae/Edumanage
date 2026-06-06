import { metadata } from "./../app/layout";
import z, { optional } from "zod";

export const RegisterSchema = z
  .object({
    firstName: z
      .string()
      .min(2, { message: "First name must be at least 2 characters" }),
    lastName: z
      .string()
      .min(2, { message: "Last name must be at least 2 characters" }),
    email: z.string().email({ message: "Enter a valid email address" }),
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters." })
      .refine((val) => /[a-z]/.test(val), {
        message: "Password must contain at least one lowercase letter.",
      })
      .refine((val) => /[A-Z]/.test(val), {
        message: "Password must contain at least one uppercase letter.",
      })
      .refine((val) => /[0-9]/.test(val), {
        message: "Password must contain at least one number.",
      })
      .refine((val) => /[!@#$%^&*(),.?":{}|<>]/.test(val), {
        message: "Password must contain at least one special character.",
      }),
    confirmPassword: z.string().min(2, { message: "Enter your password" }),
    phoneNumber: z.string().regex(/^(\+?\d{10,15})$/, {
      message: "Enter a valid phone number.",
    }),
    name: z
      .string()
      .min(2, { message: "School name must be at least 2 characters" }),
    role: z.string().min(2, { message: "Role must be selected" }),
    schoolType: z
      .string()
      .min(2, { message: "Type of school must be selected" }),
    address: z
      .string()
      .min(2, { message: "Address must be at least 2 characters" }),
    city: z.string().min(2, { message: "City must be at least 2 characters" }),
    state: z.string().min(2, { message: "State must be selected" }),
    country: z.string().min(2, { message: "Country must be selected" }),
    establishmentYear: z
      .string()
      .min(2, { message: "Year of establishment must be selected" }),
    ownershipType: z.string().min(2, { message: "Ownership must be selected" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"], // 👈 attach the error to confirmPassword
  });

export const LoginSchema = z.object({
  email: z.string().email({ message: "Enter a valid email address" }),
  password: z.string().min(2, { message: "Enter your password" }),
});

export const ForgotPasswordSchema = z.object({
  email: z.string().email({ message: "Enter a valid email address" }),
});

export const VerifyCodeSchema = z.object({
  email: z.string().email().min(2, {
    message: "Email must be at least 2 characters.",
  }),
  otp: z
    .string()
    .min(6, {
      message: "Code must be 6 characters.",
    })
    .max(6, { message: "Code must be 6 characters" }),
});

export const NewPasswordSchema = z
  .object({
    otp: z
      .string()
      .min(6, {
        message: "Code must be 6 characters.",
      })
      .max(6, { message: "Code must be 6 characters" }),
    email: z.string().email().min(2, {
      message: "Email must be at least 2 characters.",
    }),
    newPassword: z
      .string()
      .min(8, { message: "Password must be at least 8 characters." })
      .refine((val) => /[a-z]/.test(val), {
        message: "Password must contain at least one lowercase letter.",
      })
      .refine((val) => /[A-Z]/.test(val), {
        message: "Password must contain at least one uppercase letter.",
      })
      .refine((val) => /[0-9]/.test(val), {
        message: "Password must contain at least one number.",
      })
      .refine((val) => /[!@#$%^&*(),.?":{}|<>]/.test(val), {
        message: "Password must contain at least one special character.",
      }),
    confirmPassword: z.string().min(2, { message: "Enter your password" }),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"], // 👈 attach the error to confirmPassword
  });

export const SchoolIdentitySchema = z.object({
  name: z
    .string()
    .min(2, { message: "School name must be at least 2 characters" }),
  acronym: z.string().optional(),
  motto: z.string().optional(),
  visionStatement: z
    .string()
    .min(2, { message: "Vision statement must be at least 2 characters" }),
  missionStatement: z
    .string()
    .min(2, { message: "Mission statement must be at least 2 characters" }),
  establishmentYear: z
    .string()
    .min(2, { message: "Year of establishment must be selected" }),
  ownershipType: z.string().min(2, { message: "Ownership must be selected" }),
  schoolType: z.string().min(2, { message: "Type of school must be selected" }),
});

export const ContactDetailsSchema = z.object({
  address: z
    .string()
    .min(2, { message: "Address must be at least 2 characters" }),
  city: z.string().min(2, { message: "City must be at least 2 characters" }),
  state: z.string().min(2, { message: "State must be selected" }),
  postalCode: z.string().optional(),
  country: z.string().min(2, { message: "Country must be selected" }),
  website: z.string().url().optional(),
  email: z.string().email({ message: "Enter a valid email address" }),
  primaryPhone: z.string().regex(/^(\+?\d{10,15})$/, {
    message: "Enter a valid phone number.",
  }),
  alternatePhone: z
    .string()
    .regex(/^(\+?\d{10,15})$/, {
      message: "Enter a valid phone number.",
    })
    .optional(),
});

export const AcademicSettingsSchema = z.object({
  currentSession: z
    .string()
    .min(2, { message: "Current session be at least 2 characters" }),
  currentTerm: z.string().min(2, { message: "Current term must be selected" }),
  termsPerSession: z
    .string()
    .min(2, { message: "Terms per session must be selected" }),
  postalCode: z.string().optional(),
  academicStartDate: z
    .string()
    .min(2, { message: "Academic start date must be selected" }),
  academicEndDate: z
    .string()
    .min(2, { message: "Academic end date must be selected" }),
  gradingSystem: z
    .string()
    .min(2, { message: "Grading system must be selected" }),
  passMark: z.string().min(2, { message: "passMark must be selected" }),
});

export const AdministrativeDetailsSchema = z.object({
  schoolRegistrationNumber: z
    .string()
    .min(2, { message: "Registration number must be at least 2 characters" }),
  accreditationBody: z
    .string()
    .min(2, { message: "Accreditation body must be provided" }),
  accreditationNumber: z
    .string()
    .min(2, { message: "Accreditation number must be provided" }),
});

export const GeneralSettingsSchema = z.object({
  systemName: z
    .string()
    .min(2, { message: "System name must be at least 2 characters" }),
  supportEmail: z.string().email().min(2, {
    message: "Support email must be at least 2 characters.",
  }),
  administrativeEmail: z.string().email().min(2, {
    message: "Administrative email must be at least 2 characters.",
  }),
  timezone: z.string().min(2, { message: "Timezone must be selected" }),
  currency: z.string().min(2, { message: "Currency must be selected" }),
  systemLanguage: z
    .string()
    .min(2, { message: "System language must be selected" }),
});

export const NewStudentForm = z.object({
  firstName: z
    .string()
    .min(2, { message: "First name must be at least 2 characters" }),
  lastName: z
    .string()
    .min(2, { message: "Last name must be at least 2 characters" }),
  otherName: z
    .string()
    .min(2, { message: "Other name must be at least 2 characters" }),
  email: z.string().email().min(2, {
    message: "Email must be at least 2 characters.",
  }),
  phoneNumber: z
    .string()
    .trim()
    .optional()
    .refine((val) => !val || /^(\+?\d{10,15})$/.test(val), {
      message: "Enter a valid phone number (e.g. +2348012345678)",
    }),
  gender: z.string().optional(),
  dob: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  country: z.string().optional(),
  classId: z.string().min(2, { message: "Class must be selected" }),
  candidateNumber: z
    .string()
    .min(2, { message: "Candidate number must be selected" }),
  examScore: z.string().min(2, { message: "Exam score must be included" }),
  parentFirstName: z.string().optional(),
  parentLastName: z.string().optional(),
  parentEmail: z
    .string()
    .trim()
    .optional()
    .refine((val) => !val || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val), {
      message: "Enter a valid email address",
    }),
  parentPhoneNumber: z
    .string()
    .trim()
    .optional()
    .refine((val) => !val || /^(\+?\d{10,15})$/.test(val), {
      message: "Enter a valid phone number (e.g. +2348012345678)",
    }),
  parentRelationship: z.string().optional(),
  medicalConditions: z.string().optional(),
  department: z.string().optional(),
  previousSchool: z.string().optional(),
});

export const NewStaffForm = z.object({
  firstName: z
    .string()
    .min(2, { message: "First name must be at least 2 characters" }),
  lastName: z
    .string()
    .min(2, { message: "Last name must be at least 2 characters" }),
  email: z.string().email().min(2, {
    message: "Email must be at least 2 characters.",
  }),
  phoneNumber: z.string().regex(/^(\+?\d{10,15})$/, {
    message: "Enter a valid phone number.",
  }),
  gender: z.string().optional(),
  dob: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  country: z.string().optional(),
  role: z.string().min(2, { message: "Role must be selected" }),
  emergencyContactName: z.string().optional(),
  emergencyPhoneNumber: z.string().optional(),
  medicalConditions: z.string().optional(),
});

export const OnboardingStaffSchema = z
  .object({
    firstName: z
      .string()
      .min(2, { message: "First name must be at least 2 characters" }),
    lastName: z
      .string()
      .min(2, { message: "Last name must be at least 2 characters" }),
    email: z.string().email({ message: "Enter a valid email address" }),
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters." })
      .refine((val) => /[a-z]/.test(val), {
        message: "Password must contain at least one lowercase letter.",
      })
      .refine((val) => /[A-Z]/.test(val), {
        message: "Password must contain at least one uppercase letter.",
      })
      .refine((val) => /[0-9]/.test(val), {
        message: "Password must contain at least one number.",
      })
      .refine((val) => /[!@#$%^&*(),.?":{}|<>]/.test(val), {
        message: "Password must contain at least one special character.",
      }),
    confirmPassword: z.string().min(2, { message: "Enter your password" }),
    phoneNumber: z.string().regex(/^(\+?\d{10,15})$/, {
      message: "Enter a valid phone number.",
    }),
    role: z.string().min(2, { message: "Role must be selected" }),
    address: z
      .string()
      .min(2, { message: "Address must be at least 2 characters" }),
    city: z.string().min(2, { message: "City must be at least 2 characters" }),
    state: z.string().min(2, { message: "State must be selected" }),
    country: z.string().min(2, { message: "Country must be selected" }),
    gender: z.string().optional(),
    dob: z.string().optional(),
    emergencyContactName: z.string().optional(),
    emergencyPhoneNumber: z
      .string()
      .regex(/^(\+?\d{10,15})$/, {
        message: "Enter a valid phone number.",
      })
      .optional(),
    medicalConditions: z.string().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"], // 👈 attach the error to confirmPassword
  });

export const AddClassFormSchema = z
  .object({
    level: z.string().min(2, { message: "Class level must be selected" }),
    section: z.string().min(1, { message: "Section must be selected" }),
    description: z.string().optional(),
    department: z.string().optional(),
    teacherId: z.string().min(2, { message: "Teacher must be selected" }),
    capacity: z.string().min(2, { message: "Capacity is required" }),
    classRoomNumber: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    // check if level is SS1, SS2, or SS3
    const seniorLevels = ["SS1", "SS2", "SS3"];
    if (seniorLevels.includes(data.level) && !data.department) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["department"],
        message: "Department is required for SS1, SS2, or SS3 levels",
      });
    }
  });

export const AddSubjectFormSchema = z
  .object({
    name: z
      .string()
      .min(2, { message: "Subject name must be at least 2 characters" }),
    department: z.string().optional(),
    description: z.string().optional(),
    hoursPerWeek: z
      .string()
      .min(1, { message: "Hours per week must be selected" }),
    passScore: z.string().min(2, { message: "Minimum pass score is required" }),
    classes: z
      .array(z.string())
      .min(1, { message: "Select at least one class level" }),
    isCore: z.boolean(),
  })
  .superRefine((data, ctx) => {
    const seniorLevels = ["SS1", "SS2", "SS3"];
    // check if any class in the array is a senior level
    const hasSeniorLevel = data.classes.some((cls) =>
      seniorLevels.includes(cls)
    );

    if (hasSeniorLevel && !data.department) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["department"],
        message: "Department is required for SS1, SS2, or SS3 levels",
      });
    }
  });

export const AssignTeacherFormSchema = z
  .object({
    type: z.enum(["CLASS", "SUBJECT"]),
    teacher: z.string().min(2, { message: "Teacher is required" }),
    class: z.string().optional(),
    subjects: z
      .array(z.string())
      .min(1, { message: "At least one subject must be selected" })
      .optional(),
  })
  .refine(
    (data) => {
      // if type is CLASS, class is required
      if (data.type === "CLASS") {
        return !!data.class;
      }
      return true;
    },
    {
      message: "Class is required",
      path: ["class"],
    }
  )
  .refine(
    (data) => {
      // if type is SUBJECT, subjects must be provided
      if (data.type === "SUBJECT") {
        return data.subjects && data.subjects.length > 0;
      }
      return true;
    },
    {
      message: "At least one subject must be selected",
      path: ["subjects"],
    }
  );

export const StaffImportSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email"),
  phoneNumber: z
    .string()
    .min(7, "Phone number required")
    .optional()
    .or(z.literal("")), // allow blank but treat as invalid
  role: z.string().min(1, "Role is required"),
  dob: z.any().optional(),
  gender: z.string().min(1, "Gender is required"),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
});

export const EditProfileFormSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email"),
  phoneNumber: z
    .string()
    .min(7, "Phone number required")
    .optional()
    .or(z.literal("")), // allow blank but treat as invalid
  dob: z.any().optional(),
  gender: z.string().optional(),
  address: z.string().optional(),
  employeeID: z.string().optional(),
  joinedDate: z.string().optional(),
  department: z.string().optional(),
  title: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  country: z.string().optional(),
  emergencyContactName: z.string().optional(),
  emergencyPhoneNumber: z.string().optional(),
  image: z.string().optional(),
  medicalConditions: z.string().optional(),
});

export const OnboardingStudentSchema = z
  .object({
    firstName: z
      .string()
      .min(2, { message: "First name must be at least 2 characters" }),
    otherName: z
      .string()
      .min(2, { message: "Other name must be at least 2 characters" }),
    lastName: z
      .string()
      .min(2, { message: "Last name must be at least 2 characters" }),
    email: z.string().email({ message: "Enter a valid email address" }),
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters." })
      .refine((val) => /[a-z]/.test(val), {
        message: "Password must contain at least one lowercase letter.",
      })
      .refine((val) => /[A-Z]/.test(val), {
        message: "Password must contain at least one uppercase letter.",
      })
      .refine((val) => /[0-9]/.test(val), {
        message: "Password must contain at least one number.",
      })
      .refine((val) => /[!@#$%^&*(),.?":{}|<>]/.test(val), {
        message: "Password must contain at least one special character.",
      }),
    confirmPassword: z.string().min(2, { message: "Enter your password" }),
    phoneNumber: z.string().regex(/^(\+?\d{10,15})$/, {
      message: "Enter a valid phone number.",
    }),
    address: z
      .string()
      .min(2, { message: "Address must be at least 2 characters" }),
    city: z.string().min(2, { message: "City must be at least 2 characters" }),
    dob: z.string().min(2, { message: "Date of birth must be selected" }),
    gender: z.string().min(2, { message: "Gender must be selected" }),
    level: z.string().min(2, { message: "Level must be selected" }),
    state: z.string().min(2, { message: "State must be selected" }),
    country: z.string().min(2, { message: "Country must be selected" }),
    candidateNumber: z
      .string()
      .min(2, { message: "Candidate number must be included" }),
    examScore: z.string().min(2, { message: "Exam score must be included" }),
    parentFirstName: z
      .string()
      .min(2, { message: "First name must be at least 2 characters" }),
    parentLastName: z
      .string()
      .min(2, { message: "Last name must be at least 2 characters" }),
    parentEmail: z
      .string()
      .trim()
      .min(2, { message: "Email must be at least 2 characters" })
      .refine((val) => !val || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val), {
        message: "Enter a valid email address",
      }),
    parentPhoneNumber: z
      .string()
      .trim()
      .min(2, { message: "Phone number must be at least 2 characters" })
      .refine((val) => !val || /^(\+?\d{10,15})$/.test(val), {
        message: "Enter a valid phone number (e.g. +2348012345678)",
      }),
    parentRelationship: z
      .string()
      .min(2, { message: "Relationship must be selected" }),
    medicalConditions: z.string().optional(),
    department: z.string().optional(),
    previousSchool: z
      .string()
      .min(2, { message: "Please enter your last school name" }),
  })
  .superRefine(({ password, confirmPassword, level, department }, ctx) => {
    if (password !== confirmPassword) {
      ctx.addIssue({
        code: "custom",
        message: "Passwords do not match",
        path: ["confirmPassword"], // attach to confirmPassword field
      });
    }
    // check if level is SS1, SS2, or SS3
    const seniorLevels = ["SS1", "SS2", "SS3"];
    if (seniorLevels.includes(level) && !department) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["department"],
        message: "Department is required for SS1, SS2, or SS3 levels",
      });
    }
  });

export const PersonalInformationFormSchema = z.object({
  firstName: z
    .string()
    .min(2, { message: "First name must be at least 2 characters" }),
  otherName: z
    .string()
    .min(2, { message: "Other name must be at least 2 characters" }),
  lastName: z
    .string()
    .min(2, { message: "Last name must be at least 2 characters" }),
  email: z.string().email({ message: "Enter a valid email address" }),
  phoneNumber: z.string().regex(/^(\+?\d{10,15})$/, {
    message: "Enter a valid phone number.",
  }),
  address: z
    .string()
    .min(2, { message: "Address must be at least 2 characters" }),
  city: z.string().min(2, { message: "City must be at least 2 characters" }),
  dob: z.string().min(2, { message: "Date of birth must be selected" }),
  gender: z.string().min(2, { message: "Gender must be selected" }),
  state: z.string().min(2, { message: "State must be selected" }),
  country: z.string().min(2, { message: "Country must be selected" }),
  medicalConditions: z.string().optional(),
});

export const ParentInformationFormSchema = z.object({
  parentFirstName: z
    .string()
    .min(2, { message: "First name must be at least 2 characters" }),
  parentLastName: z
    .string()
    .min(2, { message: "Last name must be at least 2 characters" }),
  parentEmail: z
    .string()
    .trim()
    .min(2, { message: "Email must be at least 2 characters" })
    .refine((val) => !val || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val), {
      message: "Enter a valid email address",
    }),
  parentPhoneNumber: z
    .string()
    .trim()
    .min(2, { message: "Phone number must be at least 2 characters" })
    .refine((val) => !val || /^(\+?\d{10,15})$/.test(val), {
      message: "Enter a valid phone number (e.g. +2348012345678)",
    }),
  parentRelationship: z
    .string()
    .min(2, { message: "Relationship must be selected" }),
});

export const EducationInformationFormSchema = z
  .object({
    level: z.string().min(2, { message: "Level must be selected" }),
    candidateNumber: z
      .string()
      .min(2, { message: "Candidate number must be included" }),
    examScore: z.string().min(2, { message: "Exam score must be included" }),
    department: z.string().optional(),
    previousSchool: z
      .string()
      .min(2, { message: "Please enter your last school name" }),
  })
  .superRefine(({ level, department }, ctx) => {
    // check if level is SS1, SS2, or SS3
    const seniorLevels = ["SS1", "SS2", "SS3"];
    if (seniorLevels.includes(level) && !department) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["department"],
        message: "Department is required for SS1, SS2, or SS3 levels",
      });
    }
  });

// export const NewAssignmentFormSchema = z.object({
//   type: z.string(),
//   title: z.string().min(1),
//   description: z.string().min(1),
//   instructions: z.string().optional(),
//   totalMarks: z.string().min(1),
//   classId: z.string().min(1),
//   subjectId: z.string().min(1),
//   due: z.string().min(1),
//   attachments: z.any().optional(),
// });

export const NewAssignmentFormSchema = z
  .object({
    type: z.enum(["ASSIGNMENT", "LESSON-NOTE"]),

    title: z.string().min(1),
    description: z.string().min(1),
    instructions: z.string().optional(),

    totalMarks: z.string().optional(),
    classId: z.string().min(1),
    subjectId: z.string().min(1),

    due: z.string().optional(),

    attachments: z.any().optional(),
  })
  .refine(
    (data) => {
      if (data.type === "ASSIGNMENT") {
        return data.totalMarks && data.totalMarks.trim() !== "";
      }
      return true;
    },
    {
      message: "Total marks is required for assignments",
      path: ["totalMarks"],
    }
  )
  .refine(
    (data) => {
      if (data.type === "ASSIGNMENT") {
        return data.due && data.due.trim() !== "";
      }
      return true;
    },
    {
      message: "Due date is required for assignments",
      path: ["due"],
    }
  );

export const GradeFormSchema = z.object({
  grade: z.string().min(0, { message: "Please enter a grade" }),
  feedback: z.string().optional(),
});

export const AssignRoleFormSchema = z.object({
  roles: z
    .array(z.string())
    .min(1, { message: "At least one role must be selected" })
    .optional(),
});

export type LoginSchemaType = z.infer<typeof LoginSchema>;
export type RegisterSchemaType = z.infer<typeof RegisterSchema>;
export type ForgotPasswordSchemaType = z.infer<typeof ForgotPasswordSchema>;
export type VerifyCodeSchemaType = z.infer<typeof VerifyCodeSchema>;
export type NewPasswordSchemaType = z.infer<typeof NewPasswordSchema>;
export type SchoolIdentitySchemaType = z.infer<typeof SchoolIdentitySchema>;
export type ContactDetailsSchemaType = z.infer<typeof ContactDetailsSchema>;
export type AcademicSettingsSchemaType = z.infer<typeof AcademicSettingsSchema>;
export type AdministrativeDetailsSchemaType = z.infer<
  typeof AdministrativeDetailsSchema
>;
export type GeneralSettingsSchemaType = z.infer<typeof GeneralSettingsSchema>;
export type NewStudentFormType = z.infer<typeof NewStudentForm>;
export type NewStaffFormType = z.infer<typeof NewStaffForm>;

export type AddClassFormSchemaType = z.infer<typeof AddClassFormSchema>;
export type AddSubjectFormSchemaType = z.infer<typeof AddSubjectFormSchema>;
export type AssignTeacherFormSchemaType = z.infer<
  typeof AssignTeacherFormSchema
>;
export type StaffImportSchemaType = z.infer<typeof StaffImportSchema>;
export type EditProfileFormSchemaType = z.infer<typeof EditProfileFormSchema>;
export type OnboardingStaffSchemaType = z.infer<typeof OnboardingStaffSchema>;
export type OnboardingStudentSchemaType = z.infer<
  typeof OnboardingStudentSchema
>;
export type PersonalInformationFormSchemaType = z.infer<
  typeof PersonalInformationFormSchema
>;
export type ParentInformationFormSchemaType = z.infer<
  typeof ParentInformationFormSchema
>;
export type EducationInformationFormSchemaType = z.infer<
  typeof EducationInformationFormSchema
>;
export type NewAssignmentFormSchemaType = z.infer<
  typeof NewAssignmentFormSchema
>;
export type GradeFormSchemaType = z.infer<typeof GradeFormSchema>;

export type AssignRoleFormSchemaType = z.infer<typeof AssignRoleFormSchema>;
