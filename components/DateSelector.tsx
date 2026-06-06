// "use client";

// import * as React from "react";
// import { CalendarIcon } from "lucide-react";

// import { Button } from "@/components/ui/button";
// import { Calendar } from "@/components/ui/calendar";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import {
//   Popover,
//   PopoverContent,
//   PopoverTrigger,
// } from "@/components/ui/popover";

// function formatDate(date: Date | undefined) {
//   if (!date) {
//     return "";
//   }

//   return date.toLocaleDateString("en-US", {
//     day: "2-digit",
//     month: "long",
//     year: "numeric",
//   });
// }

// function isValidDate(date: Date | undefined) {
//   if (!date) {
//     return false;
//   }
//   return !isNaN(date.getTime());
// }

// export function DateSelector({
//   field,
//   dateValue,
//   onChange,
// }: {
//   field?: any;
//   dateValue?: any;
//   onChange?: () => void;
// }) {
//   const [open, setOpen] = React.useState(false);
//   const [date, setDate] = React.useState<Date | undefined>(
//     field?.value || dateValue
//   );
//   const [month, setMonth] = React.useState<Date | undefined>(date);
//   const [value, setValue] = React.useState(
//     field?.value || dateValue || formatDate(date)
//   );

//   return (
//     <div className="relative flex gap-2">
//       <Input
//         id="date"
//         value={value}
//         placeholder="June 01, 2025"
//         className="bg-background pr-10"
//         onChange={(e) => {
//           const date = new Date(e.target.value);
//           setValue(e.target.value);
//           if (isValidDate(date)) {
//             setDate(date);
//             setMonth(date);
//           }
//           field.onChange();
//           onChange(date)
//         }}
//         onKeyDown={(e) => {
//           if (e.key === "ArrowDown") {
//             e.preventDefault();
//             setOpen(true);
//           }
//         }}
//       />
//       <Popover open={open} onOpenChange={setOpen}>
//         <PopoverTrigger asChild>
//           <Button
//             id="date-picker"
//             variant="ghost"
//             className="absolute top-1/2 right-2 size-6 -translate-y-1/2"
//           >
//             <CalendarIcon className="size-3.5" />
//             <span className="sr-only">Select date</span>
//           </Button>
//         </PopoverTrigger>
//         <PopoverContent
//           className="w-auto overflow-hidden p-0"
//           align="end"
//           alignOffset={-8}
//           sideOffset={10}
//         >
//           <Calendar
//             mode="single"
//             selected={date}
//             captionLayout="dropdown"
//             month={month}
//             onMonthChange={setMonth}
//             onSelect={(date) => {
//               setDate(date);
//               setValue(formatDate(date));
//               setOpen(false);
//             }}
//           />
//         </PopoverContent>
//       </Popover>
//     </div>
//   );
// }

"use client";

import * as React from "react";
import { CalendarIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

function formatDateDisplay(date?: Date) {
  if (!date) return "";
  return date.toLocaleDateString("en-US", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

export function DateSelector({
  field,
  dateValue,
  onChange,
  disabled,
}: {
  field?: any;
  dateValue?: string | Date;
  onChange?: (formatted: string) => void;
  disabled?: boolean;
}) {
  // Normalize incoming value (string OR date)
  const initialDate =
    typeof dateValue === "string" ? new Date(dateValue) : dateValue;

  const [open, setOpen] = React.useState(false);
  const [date, setDate] = React.useState<Date | undefined>(initialDate);
  const [month, setMonth] = React.useState<Date | undefined>(initialDate);
  const [value, setValue] = React.useState(formatDateDisplay(initialDate));

  return (
    <div className="relative flex gap-2">
      <Input
        value={value}
        placeholder="June 01, 2025"
        className="bg-background pr-10"
        disabled
        onChange={(e) => {
          const input = e.target.value;
          setValue(input);

          const parsed = new Date(input);

          if (!isNaN(parsed.getTime())) {
            setDate(parsed);
            setMonth(parsed);

            const formattedIso = parsed.toISOString().split("T")[0];

            field?.onChange?.(formattedIso);
            onChange?.(formattedIso);
          }
        }}
      />

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="ghost"
            className="absolute top-1/2 right-2 size-6 -translate-y-1/2"
          >
            <CalendarIcon className="size-3.5" />
          </Button>
        </PopoverTrigger>

        <PopoverContent
          className="w-auto overflow-hidden p-0"
          align="end"
          alignOffset={-8}
          sideOffset={10}
        >
          <Calendar
            mode="single"
            selected={date}
            month={month}
            captionLayout="dropdown"
            onMonthChange={setMonth}
            onSelect={(selectedDate) => {
              if (!selectedDate) return;

              setDate(selectedDate);
              setValue(formatDateDisplay(selectedDate));
              setOpen(false);

              const iso = selectedDate.toISOString().split("T")[0];

              field?.onChange?.(iso);
              onChange?.(iso);
            }}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
