import { IconLoader2 } from "@tabler/icons-react";

export const Loader = ({ text = "Loading..." }: { text?: string }) => {
  return (
    <div className="flex items-center text-sm justify-center gap-2">
      <IconLoader2 className="size-4 animate-spin" />
      <span>{text}</span>
    </div>
  );
};
