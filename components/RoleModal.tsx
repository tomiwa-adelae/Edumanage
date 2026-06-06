"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormControl,
} from "@/components/ui/form";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { UserProfilePicture } from "@/components/UserProfilePicture";
import { Loader } from "@/components/Loader";
import MultipleSelector, { Option } from "@/components/ui/multiselect";

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./ui/alert-dialog";
import { Button } from "./ui/button";
import { IconX } from "@tabler/icons-react";
import {
  AssignRoleFormSchema,
  AssignRoleFormSchemaType,
} from "@/lib/zodSchema";
import z from "zod";
import { SchoolRoles, useAuth } from "@/store/useAuth";
import api from "@/lib/api";

interface Props {
  open?: boolean;
  onClose?: () => void;
  lastName: string;
  firstName: string;
  staffId: string;
  jobRoles: {
    id: string;
    name: string;
  }[];
  role: string;
  schoolRoles: SchoolRoles[];
}

export const RoleModal = ({
  open = true,
  onClose,
  firstName,
  staffId,
  lastName,
  jobRoles,
  role,
  schoolRoles,
}: Props) => {
  const { user } = useAuth();
  const [pending, startTransition] = useTransition();
  const currentRole = jobRoles?.find((r) => r.name === role)?.name;

  const defaultRoles =
    schoolRoles && schoolRoles.length > 1
      ? schoolRoles.map((r) => r.role) // use all schoolRoles if more than 2
      : currentRole
      ? [currentRole] // fallback to single role
      : [];

  const form = useForm<z.infer<typeof AssignRoleFormSchema>>({
    resolver: zodResolver(AssignRoleFormSchema),
    defaultValues: {
      roles: defaultRoles,
    },
  });

  async function onSubmit(values: AssignRoleFormSchemaType) {
    startTransition(async () => {
      try {
        const res = await api.post(
          `/roles/${user?.school?.id}/assign/${staffId}`,
          values
        );
        toast.success(res.data.message);
        onClose?.();
      } catch (error: any) {
        toast.error(error.response?.data?.message || "An error occurred");
      }
    });
  }
  const roleOptions: Option[] =
    jobRoles?.map((s) => ({
      value: s.name,
      label: `${s.name}`,
    })) ?? [];

  return (
    <AlertDialog open={open} onOpenChange={onClose}>
      <AlertDialogContent className="flex flex-col gap-0 sm:max-h-[min(640px,80vh)] sm:max-w-lg [&>button:last-child]:top-3.5 space-y-4">
        <AlertDialogHeader className="flex flex-row items-start justify-between gap-1">
          <div>
            <AlertDialogTitle className="text-left">
              Assign Role
            </AlertDialogTitle>
            <AlertDialogDescription>
              Select a new role for {firstName} {lastName}
            </AlertDialogDescription>
          </div>
          <Button size="icon" variant="ghost" onClick={onClose}>
            <IconX />
          </Button>
        </AlertDialogHeader>
        <div className="overflow-visible p-1">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="roles"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Roles</FormLabel>
                    <MultipleSelector
                      defaultOptions={roleOptions}
                      placeholder="Select roles"
                      value={roleOptions.filter((opt) =>
                        field?.value?.includes(opt.value)
                      )}
                      onChange={(selected) => {
                        field.onChange(selected.map((s) => s.value));
                      }}
                      emptyIndicator={
                        <p className="text-center text-sm text-muted-foreground">
                          No roles found
                        </p>
                      }
                      className="max-h-[120px] overflow-y-auto"
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex items-center justify-end gap-2 pt-4">
                <Button
                  onClick={onClose}
                  type="button"
                  variant="secondary"
                  disabled={pending}
                >
                  Cancel
                </Button>
                <Button disabled={pending} type="submit">
                  {pending ? <Loader text="Assigning..." /> : "Assign Roles"}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
};
