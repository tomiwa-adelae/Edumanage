import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface ListSkeletonProps {
  items?: number;
  showHeader?: boolean;
  itemHeight?: "sm" | "md" | "lg" | string;
}

export const ListSkeleton = ({
  items = 5,
  showHeader = true,
  itemHeight = "md",
}: ListSkeletonProps) => {
  const heightClass = {
    sm: "h-16",
    md: "h-20",
    lg: "h-24",
  }[itemHeight];

  return (
    <Card>
      {showHeader && (
        <CardHeader>
          <Skeleton className="h-6 w-40" />
        </CardHeader>
      )}
      <CardContent className="space-y-3">
        {Array.from({ length: items }).map((_, i) => (
          <div key={i} className={`flex items-center gap-4 ${heightClass}`}>
            <Skeleton className="h-12 w-12 rounded-md" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
            <Skeleton className="h-9 w-20" />
          </div>
        ))}
      </CardContent>
    </Card>
  );
};
