import { IconBucket } from "@tabler/icons-react";
import React from "react";

interface Props {
  text?: string;
}

export const EmptyState = ({ text = "There is nothing here" }: Props) => {
  return (
    <div className="flex flex-col items-center justify-center text-center text-muted-foreground">
      <IconBucket className="size-32" />
      <p>{text}</p>
    </div>
  );
};
