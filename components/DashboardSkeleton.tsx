import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { CardsSkeleton } from "./CardsSkeleton";

interface DashboardSkeletonProps {
  statCards?: number;
  showChart?: boolean;
  showRecentActivity?: boolean;
}

export const DashboardSkeleton = ({
  statCards = 4,
  showChart = true,
  showRecentActivity = true,
}: DashboardSkeletonProps) => {
  return (
    <div className="space-y-6">
      {/* Stat Cards */}
      <CardsSkeleton count={statCards} />

      <div className="grid gap-6 md:grid-cols-2">
        {/* Chart Card */}
        {showChart && (
          <Card className="md:col-span-2 lg:col-span-1">
            <CardHeader>
              <Skeleton className="h-6 w-48" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-[300px] w-full" />
            </CardContent>
          </Card>
        )}

        {/* Recent Activity Card */}
        {showRecentActivity && (
          <Card className="md:col-span-2 lg:col-span-1">
            <CardHeader>
              <Skeleton className="h-6 w-48" />
            </CardHeader>
            <CardContent className="space-y-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-center gap-4">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-3 w-2/3" />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        )}
      </div>

      {/* Additional Sections */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-5 w-32" />
            </CardHeader>
            <CardContent className="space-y-3">
              {Array.from({ length: 4 }).map((_, j) => (
                <div key={j} className="flex justify-between items-center">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-16" />
                </div>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
